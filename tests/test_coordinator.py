"""Which version of a day the coordinator keeps."""

from __future__ import annotations

from datetime import date, datetime

from custom_components.blackout.coordinator import pick_schedule
from custom_components.blackout.models import KYIV, DaySchedule, DayStatus, SlotState, empty_slots

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
