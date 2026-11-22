"""Which version of a day the coordinator keeps."""

from __future__ import annotations

from datetime import date, datetime

from custom_components.blackout.coordinator import keep_past, pick_schedule
from custom_components.blackout.models import (
    KYIV,
    DaySchedule,
    DayStatus,
    SlotState,
    decode_slots,
    empty_slots,
    encode_slots,
)

DAY = date(2026, 11, 22)
OFFICIAL = DaySchedule(DAY, empty_slots(SlotState.OFF), DayStatus.SCHEDULE, datetime(2026, 11, 22, 15, 52, tzinfo=KYIV))
MIRROR = DaySchedule(DAY, empty_slots(SlotState.ON), DayStatus.NO_OUTAGES, datetime(2026, 11, 22, 0, 5, tzinfo=KYIV))


def test_an_older_version_does_not_replace_a_newer_one() -> None:
    assert pick_schedule(MIRROR, OFFICIAL) is OFFICIAL
    assert pick_schedule(OFFICIAL, MIRROR) is OFFICIAL


def test_versions_without_a_time_and_missing_days() -> None:
    undated = DaySchedule(DAY, empty_slots(SlotState.ON), DayStatus.NO_OUTAGES)
    waiting = DaySchedule(DAY, empty_slots(), DayStatus.WAITING, datetime(2026, 11, 23, tzinfo=KYIV))

    assert pick_schedule(undated, OFFICIAL) is undated
    assert pick_schedule(MIRROR, waiting) is MIRROR
    assert pick_schedule(None, OFFICIAL) is OFFICIAL
    assert pick_schedule(MIRROR, None) is MIRROR
    assert pick_schedule(None, None) is None


def _slots(*ranges: tuple[int, int]) -> str:
    codes = ["1"] * 48

    for start, end in ranges:
        codes[start:end] = ["0"] * (end - start)

    return "".join(codes)


def test_a_new_version_of_today_keeps_the_past() -> None:
    morning = DaySchedule(DAY, decode_slots(_slots((16, 20), (28, 34))), DayStatus.SCHEDULE)
    update = DaySchedule(DAY, decode_slots(_slots((40, 44))), DayStatus.SCHEDULE)
    kept = keep_past(update, morning, 31)

    assert kept is not None
    assert encode_slots(kept.slots) == _slots((16, 20), (28, 31), (40, 44))
    assert keep_past(MIRROR, None, 31) is MIRROR
    assert keep_past(OFFICIAL, OFFICIAL, 31) is OFFICIAL


def test_keeping_the_past_sets_the_status() -> None:
    morning = DaySchedule(DAY, decode_slots(_slots((16, 20))), DayStatus.SCHEDULE)
    cancelled = DaySchedule(DAY, empty_slots(SlotState.ON), DayStatus.NO_OUTAGES)
    waiting = DaySchedule(DAY, empty_slots(), DayStatus.WAITING)

    assert keep_past(cancelled, morning, 30).status == DayStatus.SCHEDULE
    assert keep_past(cancelled, morning, 10).status == DayStatus.NO_OUTAGES
    assert keep_past(waiting, morning, 30) is waiting
