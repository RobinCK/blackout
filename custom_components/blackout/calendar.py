"""Calendar of scheduled outages: kept history and the published days."""

from __future__ import annotations

from datetime import date, datetime, timedelta

from homeassistant.components.calendar import CalendarEntity, CalendarEvent
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import BlackoutConfigEntry
from .coordinator import QueueCoordinator
from .entity import QueueEntity
from .models import KYIV, DaySchedule
from .timeline import ScheduledOutage, current_outage, merged_outages, next_outage

PARALLEL_UPDATES = 0
SUMMARY_OUTAGE = "Power outage"
SUMMARY_POSSIBLE = "Possible power outage"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BlackoutConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    for subentry_id, coordinator in entry.runtime_data.coordinators.items():
        async_add_entities([QueueCalendar(coordinator)], config_subentry_id=subentry_id)


def _event(outage: ScheduledOutage, group: str) -> CalendarEvent:
    return CalendarEvent(
        start=outage.start,
        end=outage.end,
        summary=SUMMARY_POSSIBLE if outage.possible else SUMMARY_OUTAGE,
        description=f"Queue {group}",
    )


class QueueCalendar(QueueEntity, CalendarEntity):
    def __init__(self, coordinator: QueueCoordinator) -> None:
        super().__init__(coordinator, "schedule")

    def _outages(self, start: date, end: date) -> list[ScheduledOutage]:
        days: dict[date, DaySchedule] = {}
        day = start

        while day <= end:
            schedule = self.coordinator.schedule_for(day)

            if schedule is not None:
                days[day] = schedule

            day += timedelta(days=1)

        return merged_outages(days)

    @property
    def event(self) -> CalendarEvent | None:
        now = dt_util.now()
        outages = self.coordinator.outages()
        outage = current_outage(outages, now, possible=True) or next_outage(outages, now, possible=True)

        return _event(outage, self.coordinator.group) if outage else None

    async def async_get_events(
        self, hass: HomeAssistant, start_date: datetime, end_date: datetime
    ) -> list[CalendarEvent]:
        first = start_date.astimezone(KYIV).date() - timedelta(days=1)
        last = end_date.astimezone(KYIV).date()

        return [
            _event(outage, self.coordinator.group)
            for outage in self._outages(first, last)
            if outage.end > start_date and outage.start < end_date
        ]
