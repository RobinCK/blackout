"""Actual grid presence from an entity of the inverter (or any meter), logged as outages."""

from __future__ import annotations

import logging
from collections.abc import Callable, Sequence
from datetime import datetime, timedelta

from homeassistant.components.recorder import get_instance, history
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, HomeAssistant, State, callback, split_entity_id
from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import BACKFILL_MAX_DAYS
from .history import QueueHistory
from .models import OutageInterval

_LOGGER = logging.getLogger(__name__)

PRESENT_TEXTS = frozenset({"on", "connected", "online", "true", "yes", "grid", "on-grid", "on_grid", "ok"})
ABSENT_TEXTS = frozenset({"off", "disconnected", "offline", "false", "no", "off-grid", "off_grid", "lost"})
BINARY_DOMAINS = frozenset({"binary_sensor", "input_boolean", "switch"})


def grid_present(state: State | None, threshold: float) -> bool | None:
    if state is None or state.state in (STATE_UNKNOWN, STATE_UNAVAILABLE, ""):
        return None

    value = state.state.strip().lower()

    if split_entity_id(state.entity_id)[0] in BINARY_DOMAINS:
        return value == "on"

    try:
        return float(value) >= threshold
    except ValueError:
        pass

    if value in PRESENT_TEXTS:
        return True

    return False if value in ABSENT_TEXTS else None


def outages_from_states(
    states: Sequence[State], threshold: float, now: datetime, min_duration: timedelta
) -> list[OutageInterval]:
    outages: list[OutageInterval] = []
    start: datetime | None = None

    for state in states:
        present = grid_present(state, threshold)

        if present is False and start is None:
            start = state.last_changed
        elif present is True and start is not None:
            if state.last_changed - start >= min_duration:
                outages.append(OutageInterval(start, state.last_changed))
            start = None

    if start is not None:
        outages.append(OutageInterval(start, None))

    return outages


class GridMonitor:
    def __init__(
        self,
        hass: HomeAssistant,
        *,
        entity_id: str,
        threshold: float,
        history: QueueHistory,
        min_duration: timedelta,
        on_change: Callable[[], None],
    ) -> None:
        self._hass = hass
        self.entity_id = entity_id
        self._threshold = threshold
        self._history = history
        self._min_duration = min_duration
        self._on_change = on_change
        self.present: bool | None = None
        self.since: datetime | None = None
        self._unsubscribe: Callable[[], None] | None = None

    async def async_start(self) -> None:
        if self._history.backfilled_for() != self.entity_id:
            await self._async_backfill()

        state = self._hass.states.get(self.entity_id)
        self._apply(state, state.last_changed if state else dt_util.utcnow())
        self._unsubscribe = async_track_state_change_event(self._hass, [self.entity_id], self._handle_event)

    @callback
    def async_stop(self) -> None:
        if self._unsubscribe:
            self._unsubscribe()
            self._unsubscribe = None

    @callback
    def _handle_event(self, event: Event[EventStateChangedData]) -> None:
        state = event.data["new_state"]

        if self._apply(state, state.last_changed if state else dt_util.utcnow()):
            self._history.save()
            self._on_change()

    def _apply(self, state: State | None, moment: datetime) -> bool:
        present = grid_present(state, self._threshold)

        if present is None or present == self.present:
            return False

        self.present = present
        self.since = moment

        if present:
            self._history.end_outage(moment, self._min_duration)
        else:
            self._history.start_outage(moment)

        return True

    async def _async_backfill(self) -> None:
        if "recorder" not in self._hass.config.components:
            return

        now = dt_util.utcnow()
        start = now - timedelta(days=BACKFILL_MAX_DAYS)

        try:
            changes = await get_instance(self._hass).async_add_executor_job(
                history.state_changes_during_period,
                self._hass,
                start,
                now,
                self.entity_id,
                True,
                False,
                None,
                True,
            )
        except Exception:
            _LOGGER.debug("Recorder history of %s is unavailable", self.entity_id, exc_info=True)
            return

        try:
            outages = outages_from_states(changes.get(self.entity_id, []), self._threshold, now, self._min_duration)
        except Exception:  # noqa: BLE001
            _LOGGER.warning("Could not read the outage log of %s from the recorder", self.entity_id, exc_info=True)
            return

        self._history.replace_outages(outages, self.entity_id)
        self._history.save()
