"""The outage log is filled from the recorder history of the grid entity."""

from __future__ import annotations

from typing import Any

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.components.recorder.common import async_wait_recording_done
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from .test_integration import GRID, _entry, _mock_sources, _setup


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(recorder_mock: Any, enable_custom_integrations: None) -> None:
    return None


async def test_backfill_from_recorder(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    freezer: FrozenDateTimeFactory,
) -> None:
    _mock_sources(aioclient_mock)
    freezer.move_to("2026-11-14T05:00:00+00:00")
    hass.states.async_set(GRID, "on")
    freezer.move_to("2026-11-14T06:00:00+00:00")
    hass.states.async_set(GRID, "off")
    freezer.move_to("2026-11-14T07:30:00+00:00")
    hass.states.async_set(GRID, "on")
    await async_wait_recording_done(hass)

    freezer.move_to("2026-11-14T08:00:00+00:00")
    entry = _entry(grid=True)
    await _setup(hass, entry)

    coordinator = entry.runtime_data.coordinators[next(iter(entry.subentries))]
    outages = coordinator.history.all_outages()

    assert hass.states.get("binary_sensor.home_grid").state == "on"
    assert len(outages) == 1
    assert (outages[0].end - outages[0].start).total_seconds() == 90 * 60
