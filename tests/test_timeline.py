"""Intervals and the next changes of a schedule."""

from __future__ import annotations

from datetime import date, datetime

from custom_components.blackout.models import KYIV, DaySchedule, DayStatus, decode_slots
from custom_components.blackout.timeline import (
    current_outage,
    day_outages,
    longest_outage_hours,
    merged_outages,
    next_outage,
    next_power_on,
    outage_hours,
)

TODAY = date(2026, 11, 14)
TOMORROW = date(2026, 11, 15)


def _day(day: date, slots: str) -> DaySchedule:
    return DaySchedule(day, decode_slots(slots), DayStatus.SCHEDULE)


def test_day_outages() -> None:
    schedule = _day(TODAY, "1" * 36 + "0" * 6 + "1" * 6)
    outages = day_outages(schedule)

    assert len(outages) == 1
    assert outages[0].start == datetime(2026, 11, 14, 18, 0, tzinfo=KYIV)
    assert outages[0].end == datetime(2026, 11, 14, 21, 0, tzinfo=KYIV)
    assert outage_hours(schedule) == 3
    assert longest_outage_hours(schedule) == 3


def test_outage_over_midnight_is_merged() -> None:
    days = {TODAY: _day(TODAY, "1" * 44 + "0" * 4), TOMORROW: _day(TOMORROW, "0" * 4 + "1" * 44)}
    outages = merged_outages(days)

    assert len(outages) == 1
    assert outages[0].start == datetime(2026, 11, 14, 22, 0, tzinfo=KYIV)
    assert outages[0].end == datetime(2026, 11, 15, 2, 0, tzinfo=KYIV)


def test_current_and_next() -> None:
    days = {TODAY: _day(TODAY, "1" * 20 + "0" * 4 + "1" * 12 + "0" * 6 + "1" * 6)}
    outages = merged_outages(days)
    during = datetime(2026, 11, 14, 10, 30, tzinfo=KYIV)
    between = datetime(2026, 11, 14, 15, 0, tzinfo=KYIV)

    assert current_outage(outages, during) is not None
    assert next_power_on(outages, during) == datetime(2026, 11, 14, 12, 0, tzinfo=KYIV)
    assert next_outage(outages, between).start == datetime(2026, 11, 14, 18, 0, tzinfo=KYIV)
    assert next_power_on(outages, between) == datetime(2026, 11, 14, 21, 0, tzinfo=KYIV)


def test_possible_outages_are_kept_apart() -> None:
    days = {TODAY: _day(TODAY, "1" * 20 + "??" + "00" + "1" * 24)}
    outages = merged_outages(days)

    assert [o.possible for o in outages] == [True, False]
    assert next_outage(outages, datetime(2026, 11, 14, 9, 0, tzinfo=KYIV)).possible is False
