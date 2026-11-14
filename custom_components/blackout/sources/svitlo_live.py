"""svitlo.live API: one answer for the whole country, half-hour slots and an emergency flag."""

from __future__ import annotations

import json
from collections.abc import Mapping
from datetime import date, datetime
from typing import Any

from ..models import SLOT_MINUTES, SLOTS_PER_DAY, DaySchedule, DayStatus, FeedResult, Slots, SlotState
from .base import ScheduleSource, SourceError
from .http import JsonFetcher

URL = "https://dtek-api.svitlo-proxy.workers.dev/"
TTL = 600
CODES: Mapping[int, SlotState] = {1: SlotState.ON, 2: SlotState.OFF}


def unwrap(payload: Any) -> Mapping[str, Any]:
    if not isinstance(payload, Mapping):
        raise SourceError("unknown format")

    body = payload.get("body")

    if not isinstance(body, str):
        return payload

    try:
        data = json.loads(body)
    except ValueError as err:
        raise SourceError("body is not JSON") from err

    if not isinstance(data, Mapping):
        raise SourceError("unknown body format")

    return data


def parse_day(slots_map: Any) -> Slots | None:
    if not isinstance(slots_map, Mapping):
        return None

    slots: list[SlotState] = []

    for index in range(SLOTS_PER_DAY):
        minutes = index * SLOT_MINUTES
        code = slots_map.get(f"{minutes // 60:02d}:{minutes % 60:02d}")
        slots.append(CODES.get(code, SlotState.UNKNOWN) if isinstance(code, int) else SlotState.UNKNOWN)

    if all(slot == SlotState.UNKNOWN for slot in slots):
        return None

    return tuple(slots)


def parse_region(payload: Any, cpu: str, source: str) -> FeedResult:
    data = unwrap(payload)
    regions = data.get("regions")

    if not isinstance(regions, list):
        raise SourceError("no regions")

    region = next((r for r in regions if isinstance(r, Mapping) and r.get("cpu") == cpu), None)

    if region is None:
        raise SourceError(f"region {cpu} is missing")

    groups: dict[str, dict[date, DaySchedule]] = {}
    schedule = region.get("schedule")

    for group, days in schedule.items() if isinstance(schedule, Mapping) else ():
        if not isinstance(days, Mapping):
            continue

        for iso_day, slots_map in days.items():
            slots = parse_day(slots_map)

            try:
                day = date.fromisoformat(str(iso_day))
            except ValueError:
                continue

            if slots is None:
                continue

            status = DayStatus.SCHEDULE if SlotState.OFF in slots else DayStatus.NO_OUTAGES
            groups.setdefault(str(group), {})[day] = DaySchedule(day, slots, status)

    return FeedResult(source, groups, emergency=bool(region.get("emergency")))


class SvitloLiveSource(ScheduleSource):
    name = "svitlo.live"
    official = False

    def __init__(self, cpu: str) -> None:
        self.cpu = cpu

    @property
    def key(self) -> str:
        return f"svitlo_live:{self.cpu}"

    async def fetch(self, http: JsonFetcher, now: datetime) -> FeedResult:
        return parse_region(await http.get_json(URL, TTL), self.cpu, self.name)
