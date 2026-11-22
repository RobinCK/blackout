"""Setup, entities, grid log and the websocket payload."""

from __future__ import annotations

from typing import Any

import pytest
from freezegun.api import FrozenDateTimeFactory
from homeassistant.config_entries import ConfigSubentryData
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker
from pytest_homeassistant_custom_component.typing import WebSocketGenerator

from custom_components.blackout.const import (
    CONF_GRID_ENTITY,
    CONF_GRID_THRESHOLD,
    CONF_GROUP,
    CONF_REGION,
    DEFAULT_OPTIONS,
    DOMAIN,
    SUBENTRY_QUEUE,
)
from custom_components.blackout.payload import build_payload
from custom_components.blackout.regions import OE_OUTAGE_DATA
from custom_components.blackout.sources import cherkasyoblenergo, svitlo_live, ua_power_status

from .conftest import load_fixture

NOW = "2026-11-14T08:00:00+00:00"
GRID = "binary_sensor.deye_master_grid_connected"


def _mock_sources(aioclient_mock: AiohttpClientMocker, *, mirror: Any = None) -> None:
    aioclient_mock.get(cherkasyoblenergo.LIST_URL, status=503)
    aioclient_mock.get(
        OE_OUTAGE_DATA.format("Cherkasyoblenergo"),
        json=mirror if mirror is not None else load_fixture("dtek_cherkasy.json"),
    )
    aioclient_mock.get(svitlo_live.URL, json=load_fixture("svitlo_live.json"))
    aioclient_mock.get(ua_power_status.URL, json=load_fixture("ua_power_status.json"))


def _entry(grid: bool = False) -> MockConfigEntry:
    data: dict[str, Any] = {CONF_REGION: "cherkasy", CONF_GROUP: "5.1", CONF_GRID_THRESHOLD: 150.0}

    if grid:
        data[CONF_GRID_ENTITY] = GRID

    return MockConfigEntry(
        domain=DOMAIN,
        title="Blackout",
        unique_id=DOMAIN,
        options=dict(DEFAULT_OPTIONS),
        subentries_data=[
            ConfigSubentryData(
                data=data,
                subentry_type=SUBENTRY_QUEUE,
                title="Home",
                unique_id="cherkasy_5.1",
            )
        ],
    )


async def _setup(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()


@pytest.fixture
def frozen(freezer: FrozenDateTimeFactory) -> FrozenDateTimeFactory:
    freezer.move_to(NOW)

    return freezer


async def test_entities(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, frozen: FrozenDateTimeFactory
) -> None:
    _mock_sources(aioclient_mock)
    await _setup(hass, _entry())

    assert hass.states.get("sensor.home_power_status").state == "power_on"
    assert hass.states.get("sensor.home_next_outage").state == "2026-11-14T10:30:00+00:00"
    assert hass.states.get("sensor.home_power_back").state == "2026-11-14T12:30:00+00:00"
    assert float(hass.states.get("sensor.home_outage_today").state) == 10.0
    assert hass.states.get("sensor.home_grid_status_in_region").state == "shortage"
    assert hass.states.get("binary_sensor.home_scheduled_outage_now").state == "off"
    assert hass.states.get("binary_sensor.home_emergency_outages").state == "off"
    assert hass.states.get("sensor.home_no_power_since") is None

    frozen.move_to("2026-11-14T10:45:00+00:00")
    async_fire_time_changed(hass)
    await hass.async_block_till_done()

    assert hass.states.get("sensor.home_power_status").state == "scheduled_outage"
    assert hass.states.get("binary_sensor.home_scheduled_outage_now").state == "on"


async def test_fallback_to_second_source(
    hass: HomeAssistant, aioclient_mock: AiohttpClientMocker, frozen: FrozenDateTimeFactory
) -> None:
    _mock_sources(aioclient_mock, mirror={"fact": {"data": [], "update": "13.10.2026 10:00"}})
    await _setup(hass, _entry())

    source = hass.states.get("binary_sensor.home_data_source")

    assert source.attributes["source"] == "svitlo.live"
    assert source.attributes["source_errors"] == ["cherkasyoblenergo.com: HTTP 503"]
    assert source.attributes["sources_without_today"] == ["OE_OUTAGE_DATA"]
    assert hass.states.get("sensor.home_next_outage").state == "2026-11-14T16:00:00+00:00"


async def test_grid_log_and_payload(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    frozen: FrozenDateTimeFactory,
) -> None:
    _mock_sources(aioclient_mock)
    hass.states.async_set(GRID, "on")
    entry = _entry(grid=True)
    await _setup(hass, entry)

    assert hass.states.get("binary_sensor.home_grid").state == "on"

    frozen.move_to("2026-11-14T08:10:00+00:00")
    hass.states.async_set(GRID, "off")
    await hass.async_block_till_done()

    assert hass.states.get("sensor.home_power_status").state == "unscheduled_outage"
    assert hass.states.get("sensor.home_no_power_since").state == "2026-11-14T08:10:00+00:00"

    frozen.move_to("2026-11-14T09:40:00+00:00")
    hass.states.async_set(GRID, "on")
    await hass.async_block_till_done()

    coordinator = entry.runtime_data.coordinators[next(iter(entry.subentries))]
    payload = build_payload(coordinator, 7, dt_util.now())
    today = next(day for day in payload["days"] if day["date"] == "2026-11-14")

    assert payload["queue"]["group"] == "5.1"
    assert payload["next"]["start"].startswith("2026-11-14T12:30")
    assert len(today["slots"]) == 48
    assert today["actual_hours"] == 1.5
    assert payload["records"]["longest_outage"]["hours"] == 1.5
    assert payload["summary"]["count"] == 1
    assert len(payload["days"]) == 8


async def test_queues_command(
    hass: HomeAssistant,
    aioclient_mock: AiohttpClientMocker,
    hass_ws_client: WebSocketGenerator,
) -> None:
    _mock_sources(aioclient_mock)
    entry = _entry()
    await _setup(hass, entry)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "blackout/queues"})
    response = await client.receive_json()

    assert response["result"][0]["status_entity"] == "sensor.home_power_status"
    assert response["result"][0]["group"] == "5.1"

    await client.send_json({"id": 2, "type": "blackout/queue", "entity_id": "sensor.home_power_status", "days": 3})
    response = await client.receive_json()

    assert response["success"]
    assert len(response["result"]["days"]) == 4

    await client.send_json({"id": 3, "type": "blackout/queue", "entity_id": "sun.sun"})
    response = await client.receive_json()

    assert response["error"]["code"] == "not_found"

    registry = er.async_get(hass)
    status = registry.async_get("sensor.home_power_status")

    assert status.config_subentry_id == next(iter(entry.subentries))
