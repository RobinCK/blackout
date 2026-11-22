"""Planned slots: what was in the schedule before the time came."""

from __future__ import annotations

from datetime import date, datetime

from homeassistant.core import HomeAssistant

from custom_components.blackout.history import QueueHistory
from custom_components.blackout.models import KYIV, DaySchedule, DayStatus, decode_slots, encode_slots

DAY = date(2026, 11, 22)


def _slots(*ranges: tuple[int, int]) -> str:
    codes = ["1"] * 48

    for start, end in ranges:
        codes[start:end] = ["0"] * (end - start)

    return "".join(codes)


async def test_planned_keeps_outages_removed_while_ahead(hass: HomeAssistant) -> None:
    history = QueueHistory(hass, "test")
    await history.async_load()
    versions = [
        (datetime(2026, 11, 21, 23, 20, tzinfo=KYIV), _slots((16, 20), (28, 34))),
        (datetime(2026, 11, 22, 12, 0, tzinfo=KYIV), _slots((16, 20), (40, 44))),
        (datetime(2026, 11, 22, 18, 20, tzinfo=KYIV), _slots((16, 20), (28, 34), (40, 44))),
        (datetime(2026, 11, 22, 18, 30, tzinfo=KYIV), _slots((16, 20), (40, 44))),
    ]

    for at, slots in versions:
        history.record_schedule(DaySchedule(DAY, decode_slots(slots), DayStatus.SCHEDULE), at)

    current = history.schedule(DAY)

    assert current is not None
    assert encode_slots(history.planned(DAY, current.slots)) == _slots((16, 20), (28, 34), (40, 44))
