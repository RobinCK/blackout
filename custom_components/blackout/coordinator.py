"""One coordinator per queue: schedule, grid state of the region, history and the grid entity."""

from __future__ import annotations

import logging
from collections.abc import Callable, Iterable
from dataclasses import dataclass
from datetime import date, datetime, timedelta

from homeassistant.config_entries import ConfigEntry, ConfigSubentry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_time_change
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .const import (
    CONF_EMERGENCY_SOURCES,
    CONF_GRID_ENTITY,
    CONF_GRID_THRESHOLD,
    CONF_GROUP,
    CONF_HISTORY_DAYS,
    CONF_MIN_OUTAGE,
    CONF_OUTAGE_LOG_DAYS,
    CONF_REGION,
    CONF_SCAN_INTERVAL,
    DEFAULT_GRID_THRESHOLD,
    DEFAULT_OPTIONS,
    DOMAIN,
    EMERGENCY_SVITLO,
    EMERGENCY_UKRENERGO,
    EMERGENCY_YASNO,
)
from .grid import GridMonitor
from .history import QueueHistory
from .hub import BlackoutHub
from .models import (
    KYIV,
    DaySchedule,
    DayStatus,
    PowerStatus,
    QueueData,
    RegionStatus,
    SlotState,
    empty_slots,
)
from .names import EntityNames
from .regions import Region, get_region
from .timeline import ScheduledOutage, merged_outages, slot_at

_LOGGER = logging.getLogger(__name__)


@dataclass(frozen=True, slots=True)
class DayChange:
    day: date
    published: bool
    schedule: DaySchedule


class QueueCoordinator(DataUpdateCoordinator[QueueData]):
    config_entry: ConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
        subentry: ConfigSubentry,
        hub: BlackoutHub,
    ) -> None:
        region = get_region(subentry.data[CONF_REGION])

        if region is None:
            raise ValueError(f"Unknown region {subentry.data[CONF_REGION]}")

        options = {**DEFAULT_OPTIONS, **entry.options}
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=f"{DOMAIN} {subentry.title}",
            update_interval=timedelta(minutes=int(options[CONF_SCAN_INTERVAL])),
        )
        self.subentry = subentry
        self.region: Region = region
        self.group: str = subentry.data[CONF_GROUP]
        self.hub = hub
        self.options = options
        self.history = QueueHistory(hass, subentry.subentry_id)
        self.grid: GridMonitor | None = None
        self.changes: list[DayChange] = []
        self.names = EntityNames(hass.config.language)
        self.fetches = 0
        self.last_error: str | None = None
        self.last_success: datetime | None = None
        self._unsubscribers: list[Callable[[], None]] = []

    @property
    def emergency_sources(self) -> frozenset[str]:
        return frozenset(self.options[CONF_EMERGENCY_SOURCES])

    async def async_prepare(self) -> None:
        await self.history.async_load()
        self.data = self._seed(dt_util.now())
        grid_entity = self.subentry.data.get(CONF_GRID_ENTITY)

        if grid_entity:
            self.grid = GridMonitor(
                self.hass,
                entity_id=grid_entity,
                threshold=float(self.subentry.data.get(CONF_GRID_THRESHOLD, DEFAULT_GRID_THRESHOLD)),
                history=self.history,
                min_duration=timedelta(seconds=int(self.options[CONF_MIN_OUTAGE])),
                on_change=self.async_update_listeners,
            )
            await self.grid.async_start()

        self._unsubscribers.append(
            async_track_time_change(self.hass, self._handle_slot_boundary, minute=(0, 30), second=1)
        )

    def _seed(self, now: datetime) -> QueueData | None:
        today = now.astimezone(KYIV).date()
        days = {
            day: schedule
            for day in (today, today + timedelta(days=1))
            if (schedule := self.history.schedule(day)) is not None
        }

        return QueueData(days=days) if days else None

    @callback
    def async_shutdown_listeners(self) -> None:
        for unsubscribe in self._unsubscribers:
            unsubscribe()

        self._unsubscribers.clear()

        if self.grid:
            self.grid.async_stop()

    @callback
    def _handle_slot_boundary(self, _now: datetime) -> None:
        self.async_update_listeners()

    async def _async_update_data(self) -> QueueData:
        now = dt_util.now()
        today = now.astimezone(KYIV).date()
        days_wanted = (today, today + timedelta(days=1))
        previous = self.data or QueueData()
        region_state = await self.hub.fetch_region_state(self.region, now)
        feed = None

        if self.region.has_schedule:
            answer = await self.hub.fetch_schedule(self.region, self.group, now)
            feed = answer.feed

            if feed is None:
                self.last_error = "; ".join(answer.errors) or "no source answered"
                raise UpdateFailed(self.last_error)

        days: dict[date, DaySchedule] = {}

        for day in days_wanted:
            fresh = feed.group_days(self.group).get(day) if feed else None
            days[day] = fresh or previous.days.get(day) or DaySchedule(day, empty_slots(), DayStatus.WAITING)

        self.changes = self._detect_changes(previous, days)
        self._record(days.values(), now)
        self.fetches += 1
        self.last_error = None
        self.last_success = now

        return QueueData(
            days=days,
            source=feed.source if feed else None,
            feed_emergency=feed.emergency if feed else None,
            region=region_state,
            fetched_at=now,
        )

    def _detect_changes(self, previous: QueueData, days: dict[date, DaySchedule]) -> list[DayChange]:
        if not previous.days:
            return []

        changes: list[DayChange] = []

        for day, schedule in days.items():
            if schedule.status == DayStatus.WAITING:
                continue

            before = previous.days.get(day)

            if before is None or before.status == DayStatus.WAITING:
                changes.append(DayChange(day, True, schedule))
            elif before.slots != schedule.slots:
                changes.append(DayChange(day, False, schedule))

        return changes

    def _record(self, schedules: Iterable[DaySchedule], now: datetime) -> None:
        for schedule in schedules:
            if schedule.status != DayStatus.WAITING:
                self.history.record_schedule(schedule, now)

        self.history.prune(now, int(self.options[CONF_HISTORY_DAYS]), int(self.options[CONF_OUTAGE_LOG_DAYS]))
        self.history.save()

    def days(self) -> dict[date, DaySchedule]:
        return self.data.days if self.data else {}

    def outages(self) -> list[ScheduledOutage]:
        return merged_outages(self.days())

    def slot_now(self, now: datetime) -> SlotState:
        return slot_at(self.days(), now)

    def emergency(self, now: datetime) -> bool:
        data = self.data

        if data is None:
            return False

        sources = self.emergency_sources
        today = data.days.get(now.astimezone(KYIV).date())

        return any(
            (
                EMERGENCY_UKRENERGO in sources
                and data.region is not None
                and data.region.status == RegionStatus.EMERGENCY_OUTAGES,
                EMERGENCY_YASNO in sources and today is not None and today.status == DayStatus.EMERGENCY,
                EMERGENCY_SVITLO in sources and bool(data.feed_emergency),
            )
        )

    def power_status(self, now: datetime) -> PowerStatus:
        slot = self.slot_now(now)
        emergency = self.emergency(now)
        present = self.grid.present if self.grid else None

        if present is False:
            if slot == SlotState.OFF:
                return PowerStatus.SCHEDULED_OUTAGE

            return PowerStatus.EMERGENCY if emergency else PowerStatus.UNSCHEDULED_OUTAGE

        if present is True:
            return PowerStatus.POWER_ON

        if emergency:
            return PowerStatus.EMERGENCY

        return {
            SlotState.OFF: PowerStatus.SCHEDULED_OUTAGE,
            SlotState.POSSIBLE: PowerStatus.POSSIBLE_OUTAGE,
            SlotState.ON: PowerStatus.POWER_ON,
        }.get(slot, PowerStatus.UNKNOWN)

    def schedule_for(self, day: date) -> DaySchedule | None:
        current = self.days().get(day)

        if current is not None and current.status != DayStatus.WAITING:
            return current

        return self.history.schedule(day) or current
