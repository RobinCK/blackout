"""Entity names follow the language option, entity IDs stay English."""

from __future__ import annotations

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.blackout.const import CONF_LANGUAGE

from .test_integration import _entry, _mock_sources


@pytest.mark.parametrize(
    ("language", "name"),
    [
        ("en", "Home Power status"),
        ("uk", "Home Стан світла"),
        ("auto", "Home Стан світла"),
    ],
)
async def test_entity_names(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    freezer: FrozenDateTimeFactory,
    language: str,
    name: str,
) -> None:
    freezer.move_to("2026-11-14T08:00:00+00:00")
    hass.config.language = "uk"
    _mock_sources(aioclient_mock)
    entry = _entry()
    entry.add_to_hass(hass)
    hass.config_entries.async_update_entry(entry, options={**entry.options, CONF_LANGUAGE: language})

    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    state = hass.states.get("sensor.home_power_status")

    assert state is not None
    assert state.attributes["friendly_name"] == name
