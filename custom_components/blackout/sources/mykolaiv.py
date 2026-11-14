"""Mykolaivoblenergo official API (off.energy.mk.ua)."""

from __future__ import annotations

import re
from collections.abc import Mapping
from datetime import date, datetime
from typing import Any

from ..models import KYIV, SLOT_MINUTES, SLOTS_PER_DAY, DaySchedule, DayStatus, FeedResult, SlotState, empty_slots
from .base import ScheduleSource, SourceError
from .http import JsonFetcher

BASE_URL = "https://off.energy.mk.ua/api"
QUEUES_URL = f"{BASE_URL}/outage-queue/by-type/3"
SERIES_URL = f"{BASE_URL}/schedule/time-series"
ACTIVE_URL = f"{BASE_URL}/v2/schedule/active"
ACTIVE_TTL = 300
STATIC_TTL = 24 * 3600
TIME_RE = re.compile(r"(\d{2}):(\d{2})(?::\d{2})?")
GROUP_RE = re.compile(r"\d+\.\d+")
TYPES: Mapping[str, SlotState] = {
    "OFF": SlotState.OFF,
    "SURE_OFF": SlotState.OFF,
    "PROBABLY_OFF": SlotState.POSSIBLE,
    "ENABLE": SlotState.ON,
}


def _items(value: Any, what: str) -> list[Mapping[str, Any]]:
    if not isinstance(value, list):
        raise SourceError(f"{what} is not a list")

    return [item for item in value if isinstance(item, Mapping)]


def parse(queues: Any, series: Any, active: Any, source: str) -> FeedResult:
    group_by_id = {
        q.get("id"): str(q.get("name")) for q in _items(queues, "queues") if GROUP_RE.fullmatch(str(q.get("name")))
    }
    slot_by_id: dict[Any, int] = {}

    for item in _items(series, "time series"):
        match = TIME_RE.fullmatch(str(item.get("start")))

        if match:
            slot_by_id[item.get("id")] = (int(match[1]) * 60 + int(match[2])) // SLOT_MINUTES

    if not group_by_id or not slot_by_id:
        raise SourceError("no queues or time slots")

    groups: dict[str, dict[date, DaySchedule]] = {}

    for item in _items(active, "active schedules"):
        try:
            day = datetime.fromisoformat(str(item.get("from")).replace("Z", "+00:00")).astimezone(KYIV).date()
        except ValueError:
            continue

        slots = {group: list(empty_slots(SlotState.ON)) for group in group_by_id.values()}

        for cell in _items(item.get("series", []), "series"):
            group = group_by_id.get(cell.get("outage_queue_id"))
            index = slot_by_id.get(cell.get("time_series_id"))
            state = TYPES.get(str(cell.get("type")))

            if group is None or index is None or state is None or not 0 <= index < SLOTS_PER_DAY:
                continue

            slots[group][index] = state

        for group, group_slots in slots.items():
            values = tuple(group_slots)
            status = (
                DayStatus.SCHEDULE if SlotState.OFF in values or SlotState.POSSIBLE in values else DayStatus.NO_OUTAGES
            )
            groups.setdefault(group, {})[day] = DaySchedule(day, values, status)

    return FeedResult(source, groups)


class MykolaivSource(ScheduleSource):
    name = "Mykolaivoblenergo"
    official = True

    @property
    def key(self) -> str:
        return "mykolaiv"

    async def fetch(self, http: JsonFetcher, now: datetime) -> FeedResult:
        queues = await http.get_json(QUEUES_URL, STATIC_TTL)
        series = await http.get_json(SERIES_URL, STATIC_TTL)
        active = await http.get_json(ACTIVE_URL, ACTIVE_TTL)

        return parse(queues, series, active, self.name)
