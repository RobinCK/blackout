"""Pure functions over schedules: intervals, the current slot and the next changes."""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass
from datetime import date, datetime, timedelta

from .models import KYIV, SLOT_MINUTES, DaySchedule, SlotState, slot_index, slot_start

OUTAGE_STATES = frozenset({SlotState.OFF, SlotState.POSSIBLE})


@dataclass(frozen=True, slots=True)
class ScheduledOutage:
    start: datetime
    end: datetime
    possible: bool

    @property
    def duration(self) -> timedelta:
        return self.end - self.start

    def contains(self, moment: datetime) -> bool:
        return self.start <= moment < self.end


def day_outages(schedule: DaySchedule) -> list[ScheduledOutage]:
    outages: list[ScheduledOutage] = []
    run_start: int | None = None
    run_state: SlotState | None = None

    for index, state in enumerate((*schedule.slots, SlotState.ON)):
        if state == run_state:
            continue

        if run_start is not None and run_state is not None:
            outages.append(
                ScheduledOutage(
                    slot_start(schedule.day, run_start),
                    slot_start(schedule.day, index),
                    run_state == SlotState.POSSIBLE,
                )
            )

        run_start, run_state = (index, state) if state in OUTAGE_STATES else (None, None)

    return outages


def merged_outages(days: Mapping[date, DaySchedule]) -> list[ScheduledOutage]:
    merged: list[ScheduledOutage] = []

    for day in sorted(days):
        for outage in day_outages(days[day]):
            previous = merged[-1] if merged else None

            if previous and previous.end == outage.start and previous.possible == outage.possible:
                merged[-1] = ScheduledOutage(previous.start, outage.end, previous.possible)
                continue

            merged.append(outage)

    return merged


def slot_at(days: Mapping[date, DaySchedule], moment: datetime) -> SlotState:
    local = moment.astimezone(KYIV)
    schedule = days.get(local.date())

    if schedule is None:
        return SlotState.UNKNOWN

    return schedule.slots[slot_index(local)]


def current_outage(
    outages: Iterable[ScheduledOutage], now: datetime, *, possible: bool = False
) -> ScheduledOutage | None:
    return next((o for o in outages if o.contains(now) and (possible or not o.possible)), None)


def next_outage(outages: Iterable[ScheduledOutage], now: datetime, *, possible: bool = False) -> ScheduledOutage | None:
    return next((o for o in outages if o.start > now and (possible or not o.possible)), None)


def next_power_on(outages: list[ScheduledOutage], now: datetime) -> datetime | None:
    outage = current_outage(outages, now) or next_outage(outages, now)

    return outage.end if outage else None


def outage_hours(schedule: DaySchedule | None, *, possible: bool = False) -> float | None:
    if schedule is None:
        return None

    states = OUTAGE_STATES if possible else frozenset({SlotState.OFF})

    return sum(1 for slot in schedule.slots if slot in states) * SLOT_MINUTES / 60


def longest_outage_hours(schedule: DaySchedule | None) -> float | None:
    if schedule is None:
        return None

    durations = [o.duration for o in day_outages(schedule) if not o.possible]

    return max(durations, default=timedelta()).total_seconds() / 3600


def next_slot_boundary(now: datetime) -> datetime:
    local = now.astimezone(KYIV)
    index = slot_index(local)

    return slot_start(local.date(), index + 1)
