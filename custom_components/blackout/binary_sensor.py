"""Binary sensors of a queue."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
    BinarySensorEntityDescription,
)
from homeassistant.const import EntityCategory
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import BlackoutConfigEntry
from .coordinator import QueueCoordinator
from .entity import QueueEntity
from .models import SlotState

PARALLEL_UPDATES = 0


@dataclass(frozen=True, kw_only=True)
class QueueBinaryDescription(BinarySensorEntityDescription):
    is_on_fn: Callable[[QueueCoordinator, datetime], bool | None]
    needs_grid: bool = False
    always_available: bool = False


BINARY_SENSORS: tuple[QueueBinaryDescription, ...] = (
    QueueBinaryDescription(
        key="scheduled_outage",
        is_on_fn=lambda c, now: c.slot_now(now) == SlotState.OFF,
    ),
    QueueBinaryDescription(
        key="possible_outage",
        entity_registry_enabled_default=False,
        is_on_fn=lambda c, now: c.slot_now(now) == SlotState.POSSIBLE,
    ),
    QueueBinaryDescription(
        key="emergency",
        device_class=BinarySensorDeviceClass.PROBLEM,
        is_on_fn=lambda c, now: c.emergency(now),
    ),
    QueueBinaryDescription(
        key="grid",
        device_class=BinarySensorDeviceClass.POWER,
        is_on_fn=lambda c, now: c.grid.present if c.grid else None,
        needs_grid=True,
    ),
    QueueBinaryDescription(
        key="source",
        device_class=BinarySensorDeviceClass.CONNECTIVITY,
        entity_category=EntityCategory.DIAGNOSTIC,
        is_on_fn=lambda c, now: c.last_update_success,
        always_available=True,
    ),
)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: BlackoutConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    for subentry_id, coordinator in entry.runtime_data.coordinators.items():
        async_add_entities(
            [
                QueueBinarySensor(coordinator, description)
                for description in BINARY_SENSORS
                if not description.needs_grid or coordinator.grid is not None
            ],
            config_subentry_id=subentry_id,
        )


class QueueBinarySensor(QueueEntity, BinarySensorEntity):
    entity_description: QueueBinaryDescription

    def __init__(self, coordinator: QueueCoordinator, description: QueueBinaryDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def available(self) -> bool:
        return self.entity_description.always_available or super().available

    @property
    def is_on(self) -> bool | None:
        return self.entity_description.is_on_fn(self.coordinator, dt_util.now())

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        coordinator = self.coordinator

        if self.entity_description.key == "source":
            return {
                "source": coordinator.data.source if coordinator.data else None,
                "last_success": coordinator.last_success.isoformat() if coordinator.last_success else None,
                "last_error": coordinator.last_error,
                "source_errors": coordinator.source_errors,
                "sources_without_today": coordinator.sources_without_today,
            }

        if self.entity_description.key == "grid" and coordinator.grid:
            return {"since": coordinator.grid.since.isoformat() if coordinator.grid.since else None}

        return None
