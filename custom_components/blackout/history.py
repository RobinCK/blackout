"""Persistent history of one queue: schedules by day (with versions) and actual outages."""

from __future__ import annotations

from collections.abc import Iterable
from datetime import date, datetime, timedelta
from typing import Any, TypedDict

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, MAX_VERSIONS_PER_DAY
from .models import (
    KYIV,
    SLOT_CODES,
    SLOTS_PER_DAY,
    DaySchedule,
    DayStatus,
    OutageInterval,
    Slots,
    SlotState,
    decode_slots,
    encode_slots,
    slot_start,
)

STORAGE_VERSION = 1
SAVE_DELAY = 10


class StoredVersion(TypedDict):
    at: str
    slots: str


class StoredDay(TypedDict):
    slots: str
    status: str
    updated_at: str | None
    versions: list[StoredVersion]


class StoredOutage(TypedDict):
    start: str
    end: str | None


class StoredHistory(TypedDict):
    schedules: dict[str, StoredDay]
    outages: list[StoredOutage]
    backfilled: str | None


def _empty() -> StoredHistory:
    return {"schedules": {}, "outages": [], "backfilled": None}


def _parse(value: str | None) -> datetime | None:
    return dt_util.parse_datetime(value) if value else None


class QueueHistory:
    def __init__(self, hass: HomeAssistant, key: str) -> None:
        self._store: Store[StoredHistory] = Store(hass, STORAGE_VERSION, f"{DOMAIN}.{key}")
        self._data: StoredHistory = _empty()

    async def async_load(self) -> None:
        stored = await self._store.async_load()
        self._data = stored if isinstance(stored, dict) else _empty()

    async def async_remove(self) -> None:
        await self._store.async_remove()

    def save(self) -> None:
        self._store.async_delay_save(lambda: self._data, SAVE_DELAY)

    def record_schedule(self, schedule: DaySchedule, now: datetime) -> bool:
        """Keep the day's schedule; return whether it differs from what was kept."""
        key = schedule.day.isoformat()
        slots = encode_slots(schedule.slots)
        stored = self._data["schedules"].get(key)
        updated_at = schedule.updated_at.isoformat() if schedule.updated_at else None

        if stored and stored["slots"] == slots and stored["status"] == schedule.status:
            stored["updated_at"] = updated_at or stored["updated_at"]

            return False

        versions = [*(stored["versions"] if stored else []), {"at": now.isoformat(), "slots": slots}]
        self._data["schedules"][key] = {
            "slots": slots,
            "status": schedule.status.value,
            "updated_at": updated_at,
            "versions": versions[-MAX_VERSIONS_PER_DAY:],
        }

        return True

    def schedule(self, day: date) -> DaySchedule | None:
        stored = self._data["schedules"].get(day.isoformat())

        if stored is None:
            return None

        try:
            status = DayStatus(stored["status"])
        except ValueError:
            status = DayStatus.WAITING

        return DaySchedule(day, decode_slots(stored["slots"]), status, _parse(stored["updated_at"]))

    def planned(self, day: date, slots: Slots) -> Slots:
        """The day's slots, plus the outages of earlier versions that were still ahead when published."""
        stored = self._data["schedules"].get(day.isoformat())
        planned = list(slots)
        off = SLOT_CODES[SlotState.OFF]

        for version in stored["versions"] if stored else []:
            at = _parse(version.get("at"))
            codes = version.get("slots", "")

            if at is None or len(codes) != SLOTS_PER_DAY:
                continue

            for index, code in enumerate(codes):
                if code == off and slot_start(day, index) >= at:
                    planned[index] = SlotState.OFF

        return tuple(planned)

    def versions(self, day: date) -> int:
        stored = self._data["schedules"].get(day.isoformat())

        return len(stored["versions"]) if stored else 0

    def open_outage(self) -> OutageInterval | None:
        outages = self._data["outages"]

        if outages and outages[-1]["end"] is None:
            start = _parse(outages[-1]["start"])

            return OutageInterval(start, None) if start else None

        return None

    def start_outage(self, start: datetime) -> None:
        if self.open_outage() is not None:
            return

        self._data["outages"].append({"start": start.isoformat(), "end": None})

    def end_outage(self, end: datetime, min_duration: timedelta) -> None:
        current = self.open_outage()

        if current is None:
            return

        if end - current.start < min_duration:
            self._data["outages"].pop()

            return

        self._data["outages"][-1]["end"] = end.isoformat()

    def replace_outages(self, outages: Iterable[OutageInterval], entity_id: str) -> None:
        self._data["outages"] = [
            {"start": o.start.isoformat(), "end": o.end.isoformat() if o.end else None} for o in outages
        ]
        self._data["backfilled"] = entity_id

    def backfilled_for(self) -> str | None:
        return self._data.get("backfilled")

    def outages(self, start: datetime, end: datetime) -> list[OutageInterval]:
        intervals: list[OutageInterval] = []

        for stored in self._data["outages"]:
            begin, finish = _parse(stored["start"]), _parse(stored["end"])

            if begin is None or begin >= end or (finish is not None and finish <= start):
                continue

            intervals.append(OutageInterval(begin, finish))

        return intervals

    def all_outages(self) -> list[OutageInterval]:
        return self.outages(datetime.min.replace(tzinfo=KYIV), datetime.max.replace(tzinfo=KYIV))

    def prune(self, now: datetime, schedule_days: int, outage_days: int) -> None:
        schedule_limit = (now.astimezone(KYIV) - timedelta(days=schedule_days)).date().isoformat()
        self._data["schedules"] = {
            day: stored for day, stored in self._data["schedules"].items() if day >= schedule_limit
        }
        outage_limit = now - timedelta(days=outage_days)
        self._data["outages"] = [
            stored
            for stored in self._data["outages"]
            if stored["end"] is None or (_parse(stored["end"]) or now) >= outage_limit
        ]

    def as_dict(self) -> dict[str, Any]:
        return dict(self._data)
