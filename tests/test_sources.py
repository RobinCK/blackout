"""Parsers of every source against recorded answers."""

from __future__ import annotations

from datetime import date, datetime

import pytest

from custom_components.blackout.models import DayStatus, RegionStatus, SlotState, encode_slots
from custom_components.blackout.sources.base import SourceError
from custom_components.blackout.sources.dtek_mirror import parse_fact
from custom_components.blackout.sources.mykolaiv import parse as parse_mykolaiv
from custom_components.blackout.sources.svitlo_live import parse_region
from custom_components.blackout.sources.ua_power_status import parse_regions
from custom_components.blackout.sources.yasno import parse_planned

from .conftest import load_fixture


def test_dtek_mirror_half_hours() -> None:
    feed = parse_fact(load_fixture("dtek_cherkasy.json"), "OE_OUTAGE_DATA")
    schedule = feed.group_days("5.1")[date(2026, 11, 14)]

    assert schedule.status == DayStatus.SCHEDULE
    assert encode_slots(schedule.slots) == "100000011111100001111111100001111111100000011111"
    assert schedule.updated_at is not None
    assert set(feed.groups) == {f"{q}.{s}" for q in range(1, 7) for s in (1, 2)}


def test_dtek_mirror_without_outages() -> None:
    feed = parse_fact({"fact": {"data": [], "update": "14.11.2026 10:00"}}, "mirror")

    assert feed.groups == {}
    assert feed.updated_at is not None


def test_dtek_mirror_rejects_unknown_format() -> None:
    with pytest.raises(SourceError):
        parse_fact({"something": 1}, "mirror")


def test_yasno_statuses() -> None:
    feed = parse_planned(load_fixture("yasno_kyiv.json"), "YASNO")
    days = feed.group_days("1.1")

    assert days[date(2026, 10, 18)].status == DayStatus.SCHEDULE
    assert days[date(2026, 10, 18)].slots[27] == SlotState.OFF
    assert days[date(2026, 10, 19)].status == DayStatus.WAITING
    assert set(days[date(2026, 10, 19)].slots) == {SlotState.UNKNOWN}


def test_yasno_emergency() -> None:
    payload = {
        "1.1": {
            "today": {"slots": [], "date": "2026-11-14T00:00:00+02:00", "status": "EmergencyShutdowns"},
            "updatedOn": "2026-11-14T07:00:00+00:00",
        }
    }

    assert parse_planned(payload, "YASNO").emergency is True


def test_svitlo_live_region() -> None:
    feed = parse_region(load_fixture("svitlo_live.json"), "cherkaska-oblast", "svitlo.live")
    schedule = feed.group_days("5.1")[date(2026, 11, 14)]

    assert feed.emergency is True
    assert schedule.slots[36] == SlotState.OFF
    assert schedule.slots[42] == SlotState.ON


def test_svitlo_live_missing_region() -> None:
    with pytest.raises(SourceError):
        parse_region(load_fixture("svitlo_live.json"), "kyiv", "svitlo.live")


def test_mykolaiv() -> None:
    feed = parse_mykolaiv(
        load_fixture("mykolaiv_queues.json"),
        load_fixture("mykolaiv_series.json"),
        load_fixture("mykolaiv_active.json"),
        "Mykolaivoblenergo",
    )
    slots = feed.group_days("1.1")[date(2026, 10, 17)].slots

    assert SlotState.OFF in slots
    assert SlotState.POSSIBLE in slots


def test_ua_power_status() -> None:
    states = parse_regions(load_fixture("ua_power_status.json"), datetime.fromisoformat("2026-11-14T09:00:00+00:00"))

    assert states["dnipropetrovsk"].status == RegionStatus.EMERGENCY_OUTAGES
    assert states["cherkasy"].status == RegionStatus.SHORTAGE


def test_ua_power_status_stale() -> None:
    with pytest.raises(SourceError):
        parse_regions(load_fixture("ua_power_status.json"), datetime.fromisoformat("2026-11-15T09:00:00+00:00"))
