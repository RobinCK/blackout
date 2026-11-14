"""Normalized outage data shared by every source and entity."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass, field
from datetime import date, datetime, time, timedelta
from enum import StrEnum
from zoneinfo import ZoneInfo

KYIV = ZoneInfo("Europe/Kyiv")
SLOT_MINUTES = 30
SLOTS_PER_DAY = 24 * 60 // SLOT_MINUTES


class SlotState(StrEnum):
    ON = "on"
    OFF = "off"
    POSSIBLE = "possible"
    UNKNOWN = "unknown"


SLOT_CODES: Mapping[SlotState, str] = {
    SlotState.ON: "1",
    SlotState.OFF: "0",
    SlotState.POSSIBLE: "?",
    SlotState.UNKNOWN: "-",
}
CODE_SLOTS: Mapping[str, SlotState] = {code: state for state, code in SLOT_CODES.items()}


class DayStatus(StrEnum):
    SCHEDULE = "schedule"
    NO_OUTAGES = "no_outages"
    WAITING = "waiting"
    EMERGENCY = "emergency"


class RegionStatus(StrEnum):
    NORMAL = "normal"
    SHORTAGE = "shortage"
    OUTAGE_SCHEDULES = "outage_schedules"
    EMERGENCY_OUTAGES = "emergency_outages"
    GRID_DAMAGE = "grid_damage"
    UNKNOWN = "unknown"


class PowerStatus(StrEnum):
    POWER_ON = "power_on"
    SCHEDULED_OUTAGE = "scheduled_outage"
    POSSIBLE_OUTAGE = "possible_outage"
    EMERGENCY = "emergency"
    UNSCHEDULED_OUTAGE = "unscheduled_outage"
    UNKNOWN = "unknown"


Slots = tuple[SlotState, ...]


def empty_slots(state: SlotState = SlotState.UNKNOWN) -> Slots:
    return (state,) * SLOTS_PER_DAY


def encode_slots(slots: Slots) -> str:
    return "".join(SLOT_CODES[slot] for slot in slots)


def decode_slots(value: str) -> Slots:
    if len(value) != SLOTS_PER_DAY:
        return empty_slots()

    return tuple(CODE_SLOTS.get(code, SlotState.UNKNOWN) for code in value)


def day_start(day: date) -> datetime:
    return datetime.combine(day, time.min, KYIV)


def slot_start(day: date, index: int) -> datetime:
    extra_days, index = divmod(index, SLOTS_PER_DAY)
    minutes = index * SLOT_MINUTES

    return datetime.combine(day + timedelta(days=extra_days), time(minutes // 60, minutes % 60), KYIV)


def slot_index(moment: datetime) -> int:
    local = moment.astimezone(KYIV)

    return (local.hour * 60 + local.minute) // SLOT_MINUTES


@dataclass(frozen=True, slots=True)
class DaySchedule:
    day: date
    slots: Slots
    status: DayStatus
    updated_at: datetime | None = None

    @property
    def has_outages(self) -> bool:
        return SlotState.OFF in self.slots or SlotState.POSSIBLE in self.slots


@dataclass(frozen=True, slots=True)
class FeedResult:
    """What one schedule source returned: every group it knows, by day."""

    source: str
    groups: Mapping[str, Mapping[date, DaySchedule]]
    emergency: bool | None = None
    updated_at: datetime | None = None

    def group_days(self, group: str) -> Mapping[date, DaySchedule]:
        return self.groups.get(group, {})


@dataclass(frozen=True, slots=True)
class RegionState:
    status: RegionStatus
    since: datetime | None = None
    period_end: datetime | None = None


@dataclass(frozen=True, slots=True)
class OutageInterval:
    start: datetime
    end: datetime | None

    def duration(self, now: datetime) -> timedelta:
        return (self.end or now) - self.start


@dataclass(slots=True)
class QueueData:
    days: dict[date, DaySchedule] = field(default_factory=dict)
    source: str | None = None
    feed_emergency: bool | None = None
    region: RegionState | None = None
    fetched_at: datetime | None = None
