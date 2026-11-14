"""Websocket commands for dashboard cards."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from .const import DOMAIN, WS_MAX_DAYS
from .coordinator import QueueCoordinator
from .payload import build_payload


@callback
def async_register(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_queue)
    websocket_api.async_register_command(hass, ws_queues)


def _loaded_coordinators(hass: HomeAssistant) -> dict[str, QueueCoordinator]:
    coordinators: dict[str, QueueCoordinator] = {}

    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry.state is ConfigEntryState.LOADED:
            coordinators.update(entry.runtime_data.coordinators)

    return coordinators


def _find_coordinator(hass: HomeAssistant, entity_id: str) -> QueueCoordinator | None:
    entity = er.async_get(hass).async_get(entity_id)

    if entity is None or entity.platform != DOMAIN or entity.config_subentry_id is None:
        return None

    return _loaded_coordinators(hass).get(entity.config_subentry_id)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "blackout/queue",
        vol.Required("entity_id"): str,
        vol.Optional("days", default=7): vol.All(int, vol.Range(min=1, max=WS_MAX_DAYS)),
    }
)
@callback
def ws_queue(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    coordinator = _find_coordinator(hass, msg["entity_id"])

    if coordinator is None:
        connection.send_error(msg["id"], "not_found", "The entity is not a Blackout queue entity")
        return

    connection.send_result(msg["id"], build_payload(coordinator, msg["days"], dt_util.now()))


@websocket_api.websocket_command({vol.Required("type"): "blackout/queues"})
@callback
def ws_queues(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    registry = er.async_get(hass)
    queues = []

    for subentry_id, coordinator in _loaded_coordinators(hass).items():
        status_entity = registry.async_get_entity_id("sensor", DOMAIN, f"{subentry_id}_status")
        queues.append(
            {
                "subentry_id": subentry_id,
                "title": coordinator.subentry.title,
                "region": coordinator.region.id,
                "group": coordinator.group,
                "status_entity": status_entity,
            }
        )

    connection.send_result(msg["id"], queues)
