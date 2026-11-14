"""YASNO public API: Kyiv and Dnipropetrovsk region (DTEK DnEM and CEK)."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import date, datetime
from typing import Any

from ..models import SLOT_MINUTES, SLOTS_PER_DAY, DaySchedule, DayStatus, FeedResult, Slots, SlotState, empty_slots
from .base import ScheduleSource, SourceError
from .http import JsonFetcher

URL = "https://app.yasno.ua/api/blackout-service/public/shutdowns/regions/{region}/dsos/{dso}/planned-outages"
TTL = 180
DAY_KEYS = ("today", "tomorrow")
STATUSES: Mapping[str, DayStatus] = {
    "ScheduleApplies": DayStatus.SCHEDULE,
    "WaitingForSchedule": DayStatus.WAITING,
    "NoOutages": DayStatus.NO_OUTAGES,
    "EmergencyShutdowns": DayStatus.EMERGENCY,
}
SLOT_TYPES: Mapping[str, SlotState] = {
    "Definite": SlotState.OFF,
    "NotPlanned": SlotState.ON,
    "Possible": SlotState.POSSIBLE,
}


def parse_datetime(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None

    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def parse_slots(raw: Any, status: DayStatus) -> Slots:
    if status == DayStatus.NO_OUTAGES:
        return empty_slots(SlotState.ON)

    if status != DayStatus.SCHEDULE or not isinstance(raw, list) or not raw:
        return empty_slots()

    slots = list(empty_slots(SlotState.ON))

    for item in raw:
        if not isinstance(item, Mapping):
            continue

        state = SLOT_TYPES.get(str(item.get("type")), SlotState.POSSIBLE)
        start, end = item.get("start"), item.get("end")

        if not isinstance(start, int) or not isinstance(end, int):
            continue

        for index in range(SLOTS_PER_DAY):
            middle = index * SLOT_MINUTES + SLOT_MINUTES // 2

            if start <= middle < end:
                slots[index] = state

    return tuple(slots)


def parse_planned(payload: Any, source: str) -> FeedResult:
    if not isinstance(payload, Mapping):
        raise SourceError("unknown format")

    groups: dict[str, dict[date, DaySchedule]] = {}
    emergency = False

    for group, group_data in payload.items():
        if not isinstance(group_data, Mapping):
            continue

        updated_at = parse_datetime(group_data.get("updatedOn"))

        for key in DAY_KEYS:
            day_data = group_data.get(key)

            if not isinstance(day_data, Mapping):
                continue

            moment = parse_datetime(day_data.get("date"))

            if moment is None:
                continue

            status = STATUSES.get(str(day_data.get("status")), DayStatus.WAITING)
            emergency = emergency or (key == "today" and status == DayStatus.EMERGENCY)
            slots = parse_slots(day_data.get("slots"), status)
            groups.setdefault(str(group), {})[moment.date()] = DaySchedule(moment.date(), slots, status, updated_at)

    return FeedResult(source, groups, emergency=emergency)


class YasnoSource(ScheduleSource):
    name = "YASNO"
    official = True

    def __init__(self, region_id: int, dso_id: int) -> None:
        self.url = URL.format(region=region_id, dso=dso_id)

    @property
    def key(self) -> str:
        return f"yasno:{self.url}"

    async def fetch(self, http: JsonFetcher, now: datetime) -> FeedResult:
        return parse_planned(await http.get_json(self.url, TTL), self.name)
