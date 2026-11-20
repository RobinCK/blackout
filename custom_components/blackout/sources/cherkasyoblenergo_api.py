"""Cherkasyoblenergo posts parsed by sigmanor/cherkasyoblenergo-api, every published version kept.

A record is one post: the schedule of a day or its update. An update lists only the rest of the day, so
it replaces the slots from the half hour it was published in, and the earlier ones keep the version
before it.
"""

from __future__ import annotations

import re
from collections.abc import Mapping
from dataclasses import dataclass
from datetime import date, datetime
from typing import Any

from ..models import (
    KYIV,
    SLOT_MINUTES,
    SLOTS_PER_DAY,
    DaySchedule,
    DayStatus,
    FeedResult,
    Slots,
    SlotState,
    empty_slots,
    slot_index,
)
from .base import ScheduleSource, SourceError
from .http import JsonFetcher

URL = "https://hue.pp.ua/cherkasyoblenergo/api/blackout-schedule?option=latest_n&limit=20"
TTL = 300
COLUMN_RE = re.compile(r"([1-6])_([12])")
RANGE_RE = re.compile(r"(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})")
CANCELLED = "скасовано"


@dataclass(frozen=True, slots=True)
class Post:
    day: date
    published: datetime
    groups: Mapping[str, Slots]


def _minutes(hours: str, minutes: str) -> int:
    return int(hours) * 60 + int(minutes)


def parse_ranges(value: str) -> Slots | None:
    text = value.strip()
    slots = list(empty_slots(SlotState.ON))

    if not text or text.lower() == CANCELLED:
        return tuple(slots)

    ranges = RANGE_RE.findall(text)

    if not ranges:
        return None

    for start_h, start_m, end_h, end_m in ranges:
        start = _minutes(start_h, start_m) // SLOT_MINUTES
        end = -(-_minutes(end_h, end_m) // SLOT_MINUTES)

        for index in range(max(start, 0), min(end, SLOTS_PER_DAY)):
            slots[index] = SlotState.OFF

    return tuple(slots)


def parse_post(record: Mapping[str, Any]) -> Post | None:
    try:
        day = date.fromisoformat(str(record.get("schedule_date")))
        published = datetime.fromisoformat(str(record.get("date")).replace("Z", "+00:00")).astimezone(KYIV)
    except ValueError:
        return None

    groups: dict[str, Slots] = {}

    for key, value in record.items():
        match = COLUMN_RE.fullmatch(str(key))
        slots = parse_ranges(value) if match and isinstance(value, str) else None

        if match and slots is not None:
            groups[f"{match[1]}.{match[2]}"] = slots

    return Post(day, published, groups) if groups else None


def merge(previous: Slots | None, post: Post, slots: Slots) -> Slots:
    if previous is None or post.published.date() < post.day:
        return slots

    cutoff = slot_index(post.published) if post.published.date() == post.day else SLOTS_PER_DAY

    return previous[:cutoff] + slots[cutoff:]


def parse(payload: Any, source: str) -> FeedResult:
    if not isinstance(payload, list):
        raise SourceError("unknown format")

    posts = sorted(
        (post for item in payload if isinstance(item, Mapping) and (post := parse_post(item)) is not None),
        key=lambda post: post.published,
    )
    merged: dict[str, dict[date, Slots]] = {}
    updated: dict[date, datetime] = {}

    for post in posts:
        for group, slots in post.groups.items():
            days = merged.setdefault(group, {})
            days[post.day] = merge(days.get(post.day), post, slots)

        updated[post.day] = post.published

    groups = {
        group: {
            day: DaySchedule(
                day,
                slots,
                DayStatus.SCHEDULE if SlotState.OFF in slots else DayStatus.NO_OUTAGES,
                updated[day],
            )
            for day, slots in days.items()
        }
        for group, days in merged.items()
    }

    return FeedResult(source, groups, updated_at=posts[-1].published if posts else None)


class CherkasyoblenergoApiSource(ScheduleSource):
    name = "cherkasyoblenergo-api"
    official = False

    @property
    def key(self) -> str:
        return "cherkasyoblenergo_api"

    async def fetch(self, http: JsonFetcher, now: datetime) -> FeedResult:
        return parse(await http.get_json(URL, TTL), self.name)
