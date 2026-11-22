"""Config flow and queue subentries."""

from __future__ import annotations

import pytest
from homeassistant.config_entries import SOURCE_RECONFIGURE, SOURCE_USER
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.blackout.const import (
    CONF_GRID_ENTITY,
    CONF_GROUP,
    CONF_NAME,
    CONF_REGION,
    DOMAIN,
    SUBENTRY_QUEUE,
)
from custom_components.blackout.regions import OE_OUTAGE_DATA
from custom_components.blackout.sources import cherkasyoblenergo, svitlo_live, ua_power_status

from .conftest import load_fixture


@pytest.fixture(autouse=True)
def sources(aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(cherkasyoblenergo.LIST_URL, status=503)
    aioclient_mock.get(OE_OUTAGE_DATA.format("Cherkasyoblenergo"), json=load_fixture("dtek_cherkasy.json"))
    aioclient_mock.get(OE_OUTAGE_DATA.format("Poltavaoblenergo"), json=load_fixture("dtek_cherkasy.json"))
    aioclient_mock.get(svitlo_live.URL, json=load_fixture("svitlo_live.json"))
    aioclient_mock.get(ua_power_status.URL, json=load_fixture("ua_power_status.json"))


async def _create(hass: HomeAssistant) -> str:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_REGION: "cherkasy"})
    assert result["step_id"] == "queue"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {CONF_GROUP: "5.1", CONF_NAME: "Home"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()

    return result["result"].entry_id


async def test_create_entry_with_first_queue(hass: HomeAssistant) -> None:
    entry_id = await _create(hass)
    entry = hass.config_entries.async_get_entry(entry_id)
    subentry = next(iter(entry.subentries.values()))

    assert subentry.title == "Home"
    assert subentry.unique_id == "cherkasy_5.1"
    assert hass.states.get("sensor.home_power_status") is not None


async def test_single_instance(hass: HomeAssistant) -> None:
    await _create(hass)
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": SOURCE_USER})

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_add_queue_and_duplicate(hass: HomeAssistant) -> None:
    entry_id = await _create(hass)

    result = await hass.config_entries.subentries.async_init(
        (entry_id, SUBENTRY_QUEUE), context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.subentries.async_configure(result["flow_id"], {CONF_REGION: "poltava"})
    result = await hass.config_entries.subentries.async_configure(result["flow_id"], {CONF_GROUP: "3.2"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()

    entry = hass.config_entries.async_get_entry(entry_id)
    assert {sub.unique_id for sub in entry.subentries.values()} == {"cherkasy_5.1", "poltava_3.2"}
    assert hass.states.get("sensor.poltavaoblenergo_3_2_power_status") is not None

    result = await hass.config_entries.subentries.async_init(
        (entry_id, SUBENTRY_QUEUE), context={"source": SOURCE_USER}
    )
    result = await hass.config_entries.subentries.async_configure(result["flow_id"], {CONF_REGION: "cherkasy"})
    result = await hass.config_entries.subentries.async_configure(result["flow_id"], {CONF_GROUP: "5.1"})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


async def test_reconfigure_queue(hass: HomeAssistant) -> None:
    entry_id = await _create(hass)
    entry = hass.config_entries.async_get_entry(entry_id)
    subentry_id = next(iter(entry.subentries))
    hass.states.async_set("binary_sensor.grid", "on")

    result = await hass.config_entries.subentries.async_init(
        (entry_id, SUBENTRY_QUEUE), context={"source": SOURCE_RECONFIGURE, "subentry_id": subentry_id}
    )
    assert result["step_id"] == "reconfigure"
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {CONF_NAME: "Home", CONF_GRID_ENTITY: "binary_sensor.grid"}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    await hass.async_block_till_done()

    assert hass.states.get("binary_sensor.home_grid").state == "on"
