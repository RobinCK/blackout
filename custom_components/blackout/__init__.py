"""Blackout: planned and emergency power outages in Ukraine."""

from __future__ import annotations

from dataclasses import dataclass, field

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .card import async_register_card
from .const import DOMAIN, SUBENTRY_QUEUE
from .coordinator import QueueCoordinator
from .history import QueueHistory
from .hub import BlackoutHub
from .websocket import async_register

PLATFORMS: list[Platform] = [
    Platform.BINARY_SENSOR,
    Platform.CALENDAR,
    Platform.EVENT,
    Platform.SENSOR,
]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


@dataclass(slots=True)
class BlackoutRuntime:
    hub: BlackoutHub
    coordinators: dict[str, QueueCoordinator] = field(default_factory=dict)


type BlackoutConfigEntry = ConfigEntry[BlackoutRuntime]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    async_register(hass)
    await async_register_card(hass)

    return True


async def async_setup_entry(hass: HomeAssistant, entry: BlackoutConfigEntry) -> bool:
    runtime = BlackoutRuntime(BlackoutHub(hass))

    for subentry in entry.subentries.values():
        if subentry.subentry_type != SUBENTRY_QUEUE:
            continue

        coordinator = QueueCoordinator(hass, entry, subentry, runtime.hub)
        await coordinator.async_prepare()
        await coordinator.async_refresh()
        runtime.coordinators[subentry.subentry_id] = coordinator

    entry.runtime_data = runtime
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    entry.async_on_unload(entry.add_update_listener(_async_reload))

    return True


async def async_unload_entry(hass: HomeAssistant, entry: BlackoutConfigEntry) -> bool:
    for coordinator in entry.runtime_data.coordinators.values():
        coordinator.async_shutdown_listeners()

    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    for subentry_id in entry.subentries:
        await QueueHistory(hass, subentry_id).async_remove()


async def _async_reload(hass: HomeAssistant, entry: BlackoutConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)
