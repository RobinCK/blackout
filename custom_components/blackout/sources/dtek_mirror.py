"""DTEK page format (`DisconSchedule.fact`) as published by open GitHub mirrors.

Hours are keyed 1-24, days by the unix time of Kyiv midnight. Values: ``yes``, ``no``,
``first``/``second`` (no power in that half of the hour), ``maybe``/``mfirst``/``msecond``.
"""

from __future__ import annotations

from collections.abc import Mapping
from datetime import date, datetime
from typing import Any

from ..models import (
    KYIV,
    SLOTS_PER_DAY,
    DaySchedule,
    DayStatus,
    FeedResult,
    Slots,
    SlotState,
)
from .base import ScheduleSource, SourceError
from .http import JsonFetcher

ON, OFF, MAYBE = SlotState.ON, SlotState.OFF, SlotState.POSSIBLE
HOUR_VALUES: Mapping[str, tuple[SlotState, SlotState]] = {
    "yes": (ON, ON),
    "no": (OFF, OFF),
    "first": (OFF, ON),
    "second": (ON, OFF),
    "maybe": (MAYBE, MAYBE),
    "mfirst": (MAYBE, ON),
    "msecond": (ON, MAYBE),
}
UPDATE_FORMATS = ("%d.%m.%Y %H:%M", "%H:%M %d.%m.%Y")
GROUP_PREFIX = "GPV"
TTL = 300


def parse_update(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None

    for fmt in UPDATE_FORMATS:
        try:
            return datetime.strptime(value.strip(), fmt).replace(tzinfo=KYIV)
        except ValueError:
            continue

    return None


def parse_day_key(value: str) -> date | None:
    try:
        return datetime.fromtimestamp(int(value), KYIV).date()
    except (ValueError, OverflowError, OSError):
        return None


def parse_hours(hours: Any) -> Slots | None:
    if not isinstance(hours, Mapping):
        return None

    slots: list[SlotState] = []

    for hour in range(1, 25):
        pair = HOUR_VALUES.get(str(hours.get(str(hour), "")).strip().lower())
        slots.extend(pair or (SlotState.UNKNOWN, SlotState.UNKNOWN))

    return tuple(slots) if len(slots) == SLOTS_PER_DAY else None


def day_status(slots: Slots) -> DayStatus:
    if all(slot == SlotState.UNKNOWN for slot in slots):
        return DayStatus.WAITING

    return DayStatus.SCHEDULE if OFF in slots or MAYBE in slots else DayStatus.NO_OUTAGES


def parse_fact(payload: Any, source: str) -> FeedResult:
    fact = payload.get("fact") if isinstance(payload, Mapping) else None

    if not isinstance(fact, Mapping):
        raise SourceError("no fact block")

    updated_at = parse_update(fact.get("update"))
    days = fact.get("data")

    if isinstance(days, list) and not days:
        return FeedResult(source, {}, updated_at=updated_at)

    if not isinstance(days, Mapping):
        raise SourceError("unknown fact format")

    groups: dict[str, dict[date, DaySchedule]] = {}

    for day_key, day_groups in days.items():
        day = parse_day_key(str(day_key))

        if day is None or not isinstance(day_groups, Mapping):
            continue

        for group_key, hours in day_groups.items():
            slots = parse_hours(hours)

            if slots is None:
                continue

            group = str(group_key).removeprefix(GROUP_PREFIX)
            groups.setdefault(group, {})[day] = DaySchedule(day, slots, day_status(slots), updated_at)

    return FeedResult(source, groups, updated_at=updated_at)


class DtekMirrorSource(ScheduleSource):
    official = False

    def __init__(self, url: str, name: str) -> None:
        self.url = url
        self.name = name

    @property
    def key(self) -> str:
        return f"dtek_mirror:{self.url}"

    async def fetch(self, http: JsonFetcher, now: datetime) -> FeedResult:
        return parse_fact(await http.get_json(self.url, TTL), self.name)
