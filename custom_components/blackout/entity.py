"""Base entity: one device per queue."""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import QueueCoordinator


class QueueEntity(CoordinatorEntity[QueueCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: QueueCoordinator, key: str) -> None:
        super().__init__(coordinator)
        subentry = coordinator.subentry
        self._attr_unique_id = f"{subentry.subentry_id}_{key}"
        self._attr_translation_key = key
        self._object_name = coordinator.names.object_names.get(key)

        if (name := coordinator.names.names.get(key)) is not None:
            self._attr_name = name

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, subentry.subentry_id)},
            name=subentry.title,
            manufacturer=coordinator.region.operator,
            model=f"Queue {coordinator.group}",
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def suggested_object_id(self) -> str | None:
        return self._object_name or super().suggested_object_id

    @property
    def available(self) -> bool:
        return self.coordinator.data is not None
