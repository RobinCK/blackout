"""The notifications blueprint: schedule events, emergency outages and reminders."""

from __future__ import annotations

import shutil
from datetime import timedelta
from pathlib import Path
from typing import Any

import pytest
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_mock_service

BLUEPRINT = Path(__file__).parents[1] / "blueprints" / "automation" / "blackout" / "notifications.yaml"
EVENT = "event.home_schedule"
EMERGENCY = "binary_sensor.home_emergency_outages"
NEXT_OUTAGE = "sensor.home_next_outage"
POWER_BACK = "sensor.home_power_back"


async def _setup(hass: HomeAssistant, tmp_path: Path, **inputs: Any) -> list[ServiceCall]:
    hass.config.config_dir = str(tmp_path)
    target = tmp_path / "blueprints" / "automation" / "blackout" / "notifications.yaml"
    target.parent.mkdir(parents=True)
    shutil.copy(BLUEPRINT, target)
    await hass.config.async_set_time_zone("Europe/Kyiv")
    calls = async_mock_service(hass, "notify", "phone")

    hass.states.async_set(EVENT, "2026-11-21T21:00:00.000+00:00", {"event_type": "schedule_published"})
    hass.states.async_set(EMERGENCY, "off")
    hass.states.async_set(NEXT_OUTAGE, "unknown")
    hass.states.async_set(POWER_BACK, "unknown")

    config = {
        "schedule_event": EVENT,
        "emergency_sensor": EMERGENCY,
        "next_outage_sensor": NEXT_OUTAGE,
        "power_back_sensor": POWER_BACK,
        "notify_action": "notify.phone",
        **inputs,
    }

    assert await async_setup_component(
        hass,
        "automation",
        {"automation": {"use_blueprint": {"path": "blackout/notifications.yaml", "input": config}}},
    )
    await hass.async_block_till_done()

    return calls


def _schedule_event(hass: HomeAssistant, event_type: str, day: str, outages: list[str], hours: float) -> None:
    hass.states.async_set(
        EVENT,
        dt_util.utcnow().isoformat(),
        {
            "event_type": event_type,
            "day": day,
            "date": "2026-11-23",
            "outages": outages,
            "hours": hours,
        },
    )


async def test_schedule_published_and_changed(hass: HomeAssistant, tmp_path: Path) -> None:
    calls = await _setup(hass, tmp_path)

    _schedule_event(hass, "schedule_published", "tomorrow", ["08:00–10:00", "14:00–17:30"], 5.5)
    await hass.async_block_till_done()
    _schedule_event(hass, "schedule_changed", "today", [], 0)
    await hass.async_block_till_done()

    assert [call.data for call in calls] == [
        {"title": "Schedule for tomorrow", "message": "Outages: 08:00–10:00, 14:00–17:30 (5.5 h)"},
        {"title": "Schedule for today changed", "message": "No outages"},
    ]


async def test_ukrainian_and_disabled_changes(hass: HomeAssistant, tmp_path: Path) -> None:
    calls = await _setup(hass, tmp_path, language="uk", notify_changed=False)

    _schedule_event(hass, "schedule_changed", "today", ["20:00–22:00"], 2)
    await hass.async_block_till_done()
    _schedule_event(hass, "schedule_published", "other", ["20:00–22:00"], 2.5)
    await hass.async_block_till_done()

    assert [call.data for call in calls] == [
        {"title": "Графік на 23.11", "message": "Відключення: 20:00–22:00 (2,5 год)"},
    ]


async def test_emergency(hass: HomeAssistant, tmp_path: Path) -> None:
    calls = await _setup(hass, tmp_path)

    hass.states.async_set(EMERGENCY, "unavailable")
    await hass.async_block_till_done()
    hass.states.async_set(EMERGENCY, "on")
    await hass.async_block_till_done()

    assert calls == []

    hass.states.async_set(EMERGENCY, "off")
    hass.states.async_set(EMERGENCY, "on")
    await hass.async_block_till_done()

    assert [call.data["title"] for call in calls] == ["Emergency outages"]


@pytest.mark.parametrize(("lead", "expected"), [(0, 0), (15, 1)])
async def test_outage_reminder(hass: HomeAssistant, tmp_path: Path, lead: int, expected: int) -> None:
    calls = await _setup(hass, tmp_path, outage_reminder=lead)
    at = dt_util.utcnow().replace(microsecond=0) + timedelta(minutes=10)

    hass.states.async_set(NEXT_OUTAGE, at.isoformat())
    await hass.async_block_till_done()

    assert len(calls) == expected

    if expected:
        assert calls[0].data == {
            "title": "Outage in 10 min",
            "message": f"Power goes off at {dt_util.as_local(at):%H:%M} by schedule.",
        }


async def test_power_on_reminder_only_during_an_outage(hass: HomeAssistant, tmp_path: Path) -> None:
    calls = await _setup(hass, tmp_path, power_on_reminder=30)
    now = dt_util.utcnow().replace(microsecond=0)

    hass.states.async_set(NEXT_OUTAGE, (now + timedelta(minutes=5)).isoformat())
    hass.states.async_set(POWER_BACK, (now + timedelta(minutes=20)).isoformat())
    await hass.async_block_till_done()

    assert calls == []

    hass.states.async_set(NEXT_OUTAGE, (now + timedelta(hours=5)).isoformat())
    await hass.async_block_till_done()

    assert [call.data["title"] for call in calls] == ["Power back in 20 min"]
