"""Sensors of a queue."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import PERCENTAGE, EntityCategory, UnitOfTime
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddConfigEntryEntitiesCallback
from homeassistant.util import dt as dt_util

from . import BlackoutConfigEntry
from .coordinator import QueueCoordinator
from .entity import QueueEntity
from .models import KYIV, DaySchedule, DayStatus, PowerStatus, RegionStatus, encode_slots
from .stats import summarize, today_window
from .timeline import longest_outage_hours, next_outage, next_power_on, outage_hours

PARALLEL_UPDATES = 0
AVAILABILITY_DAYS = 7

ValueFn = Callable[[QueueCoordinator, datetime], datetime | float | str | None]


@dataclass(frozen=True, kw_only=True)
class QueueSensorDescription(SensorEntityDescription):
    value_fn: ValueFn
    needs_grid: bool = False


def _today(c: QueueCoordinator, now: datetime) -> DaySchedule | None:
    return c.days().get(now.astimezone(KYIV).date())


def _tomorrow(c: QueueCoordinator, now: datetime) -> DaySchedule | None:
    return c.days().get(now.astimezone(KYIV).date() + timedelta(days=1))


def _published(schedule: DaySchedule | None) -> DaySchedule | None:
    return schedule if schedule is not None and schedule.status != DayStatus.WAITING else None


def _next_outage(c: QueueCoordinator, now: datetime) -> datetime | None:
    outage = next_outage(c.outages(), now)

    return outage.start if outage else None


def _updated(c: QueueCoordinator, now: datetime) -> datetime | None:
    return max((s.updated_at for s in c.days().values() if s.updated_at), default=None)


def _region_status(c: QueueCoordinator, now: datetime) -> str:
    region = c.data.region if c.data else None

    return (region.status if region else RegionStatus.UNKNOWN).value


def _outage_since(c: QueueCoordinator, now: datetime) -> datetime | None:
    if c.grid is None or c.grid.present is not False:
        return None

    return c.grid.since


def _actual_today(c: QueueCoordinator, now: datetime) -> float:
    start, end = today_window(now)

    return round(summarize(c.history.outages(start, end), start, end, now).total.total_seconds() / 3600, 2)


def _availability(c: QueueCoordinator, now: datetime) -> float:
    start = now - timedelta(days=AVAILABILITY_DAYS)

    return summarize(c.history.outages(start, now), start, now, now).availability


SENSORS: tuple[QueueSensorDescription, ...] = (
    QueueSensorDescription(
        key="status",
        device_class=SensorDeviceClass.ENUM,
        options=[status.value for status in PowerStatus],
        value_fn=lambda c, now: c.power_status(now).value,
    ),
    QueueSensorDescription(
        key="next_outage",
        device_class=SensorDeviceClass.TIMESTAMP,
        value_fn=_next_outage,
    ),
    QueueSensorDescription(
        key="next_power_on",
        device_class=SensorDeviceClass.TIMESTAMP,
        value_fn=lambda c, now: next_power_on(c.outages(), now),
    ),
    QueueSensorDescription(
        key="outage_today",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.HOURS,
        suggested_display_precision=1,
        value_fn=lambda c, now: outage_hours(_published(_today(c, now))),
    ),
    QueueSensorDescription(
        key="outage_tomorrow",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.HOURS,
        suggested_display_precision=1,
        value_fn=lambda c, now: outage_hours(_published(_tomorrow(c, now))),
    ),
    QueueSensorDescription(
        key="longest_outage_today",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.HOURS,
        suggested_display_precision=1,
        value_fn=lambda c, now: longest_outage_hours(_published(_today(c, now))),
    ),
    QueueSensorDescription(
        key="region_status",
        device_class=SensorDeviceClass.ENUM,
        options=[status.value for status in RegionStatus],
        value_fn=_region_status,
    ),
    QueueSensorDescription(
        key="schedule_updated",
        device_class=SensorDeviceClass.TIMESTAMP,
        entity_category=EntityCategory.DIAGNOSTIC,
        value_fn=_updated,
    ),
    QueueSensorDescription(
        key="outage_since",
        device_class=SensorDeviceClass.TIMESTAMP,
        value_fn=_outage_since,
        needs_grid=True,
    ),
    QueueSensorDescription(
        key="actual_outage_today",
        device_class=SensorDeviceClass.DURATION,
        native_unit_of_measurement=UnitOfTime.HOURS,
        suggested_display_precision=1,
        value_fn=_actual_today,
        needs_grid=True,
    ),
    QueueSensorDescription(
        key="availability_7d",
        native_unit_of_measurement=PERCENTAGE,
        state_class=SensorStateClass.MEASUREMENT,
        suggested_display_precision=1,
        value_fn=_availability,
        needs_grid=True,
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
                QueueSensor(coordinator, description)
                for description in SENSORS
                if not description.needs_grid or coordinator.grid is not None
            ],
            config_subentry_id=subentry_id,
        )


class QueueSensor(QueueEntity, SensorEntity):
    entity_description: QueueSensorDescription
    _unrecorded_attributes = frozenset({"today", "tomorrow"})

    def __init__(self, coordinator: QueueCoordinator, description: QueueSensorDescription) -> None:
        super().__init__(coordinator, description.key)
        self.entity_description = description

    @property
    def native_value(self) -> datetime | float | str | None:
        return self.entity_description.value_fn(self.coordinator, dt_util.now())

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        if self.entity_description.key != "status":
            return None

        coordinator = self.coordinator
        now = dt_util.now()
        today, tomorrow = _today(coordinator, now), _tomorrow(coordinator, now)
        data = coordinator.data

        return {
            "region": coordinator.region.id,
            "group": coordinator.group,
            "today": encode_slots(today.slots) if today else None,
            "today_status": today.status.value if today else None,
            "tomorrow": encode_slots(tomorrow.slots) if tomorrow else None,
            "tomorrow_status": tomorrow.status.value if tomorrow else None,
            "emergency": coordinator.emergency(now),
            "source": data.source if data else None,
        }
