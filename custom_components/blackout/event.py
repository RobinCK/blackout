"""Schedule events: a day was published, or a published day changed."""

from __future__ import annotations

from datetime import timedelta
from typing import Any

from homeassistant.components.event import EventEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import BlackoutConfigEntry
from .coordinator import DayChange, QueueCoordinator
from .entity import QueueEntity
from .models import KYIV, encode_slots
from .timeline import day_outages, outage_hours

PARALLEL_UPDATES = 0
PUBLISHED = "schedule_published"
CHANGED = "schedule_changed"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BlackoutConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    for subentry_id, coordinator in entry.runtime_data.coordinators.items():
        async_add_entities([ScheduleEvent(coordinator)], config_subentry_id=subentry_id)


def event_data(change: DayChange) -> dict[str, Any]:
    today = dt_util.now().astimezone(KYIV).date()
    day = change.day
    outages = [o for o in day_outages(change.schedule) if not o.possible]

    return {
        "day": "today" if day == today else "tomorrow" if day == today + timedelta(days=1) else "other",
        "date": day.isoformat(),
        "slots": encode_slots(change.schedule.slots),
        "outages": [f"{o.start:%H:%M}–{o.end:%H:%M}" for o in outages],
        "hours": outage_hours(change.schedule),
    }


class ScheduleEvent(QueueEntity, EventEntity):
    _attr_event_types = [PUBLISHED, CHANGED]

    def __init__(self, coordinator: QueueCoordinator) -> None:
        super().__init__(coordinator, "schedule_event")
        self._seen = coordinator.fetches

    @callback
    def _handle_coordinator_update(self) -> None:
        coordinator = self.coordinator

        if coordinator.fetches != self._seen:
            self._seen = coordinator.fetches

            for change in coordinator.changes:
                self._trigger_event(PUBLISHED if change.published else CHANGED, event_data(change))

        super()._handle_coordinator_update()
