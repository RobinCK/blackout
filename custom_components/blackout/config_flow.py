"""Config flow: one entry with a queue subentry for every monitored queue."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import (
    ConfigEntry,
    ConfigFlow,
    ConfigFlowResult,
    ConfigSubentryData,
    ConfigSubentryFlow,
    OptionsFlow,
    SubentryFlowResult,
)
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)

from .const import (
    CONF_EMERGENCY_SOURCES,
    CONF_GRID_ENTITY,
    CONF_GRID_THRESHOLD,
    CONF_GROUP,
    CONF_HISTORY_DAYS,
    CONF_LANGUAGE,
    CONF_MIN_OUTAGE,
    CONF_NAME,
    CONF_OUTAGE_LOG_DAYS,
    CONF_REGION,
    CONF_SCAN_INTERVAL,
    DEFAULT_GRID_THRESHOLD,
    DEFAULT_OPTIONS,
    DOMAIN,
    EMERGENCY_SOURCES,
    LANGUAGE_AUTO,
    LANGUAGES,
    SUBENTRY_QUEUE,
    TITLE,
)
from .regions import REGIONS, Region, get_region

GRID_DOMAINS = ["binary_sensor", "sensor", "input_boolean", "switch"]


def _region_schema() -> vol.Schema:
    return vol.Schema(
        {
            vol.Required(CONF_REGION): SelectSelector(
                SelectSelectorConfig(
                    options=[region.id for region in REGIONS],
                    translation_key=CONF_REGION,
                    mode=SelectSelectorMode.DROPDOWN,
                    sort=True,
                )
            )
        }
    )


def _queue_schema(region: Region, defaults: dict[str, Any] | None = None, *, with_group: bool = True) -> vol.Schema:
    defaults = defaults or {}
    fields: dict[Any, Any] = {}

    if with_group:
        fields[vol.Required(CONF_GROUP, default=defaults.get(CONF_GROUP, region.groups[0]))] = SelectSelector(
            SelectSelectorConfig(options=list(region.groups), mode=SelectSelectorMode.DROPDOWN)
        )

    fields[vol.Optional(CONF_NAME, description={"suggested_value": defaults.get(CONF_NAME)})] = TextSelector()
    fields[vol.Optional(CONF_GRID_ENTITY, description={"suggested_value": defaults.get(CONF_GRID_ENTITY)})] = (
        EntitySelector(EntitySelectorConfig(domain=GRID_DOMAINS))
    )
    fields[vol.Optional(CONF_GRID_THRESHOLD, default=defaults.get(CONF_GRID_THRESHOLD, DEFAULT_GRID_THRESHOLD))] = (
        NumberSelector(NumberSelectorConfig(min=0, max=400, step=1, mode=NumberSelectorMode.BOX))
    )

    return vol.Schema(fields)


def _title(region: Region, data: dict[str, Any]) -> str:
    name = str(data.get(CONF_NAME) or "").strip()

    return name or f"{region.operator} · {data[CONF_GROUP]}"


def _queue_data(region: Region, user_input: dict[str, Any], group: str) -> dict[str, Any]:
    data: dict[str, Any] = {
        CONF_REGION: region.id,
        CONF_GROUP: group,
        CONF_GRID_THRESHOLD: float(user_input.get(CONF_GRID_THRESHOLD, DEFAULT_GRID_THRESHOLD)),
    }

    if name := str(user_input.get(CONF_NAME) or "").strip():
        data[CONF_NAME] = name

    if grid := user_input.get(CONF_GRID_ENTITY):
        data[CONF_GRID_ENTITY] = grid

    return data


class BlackoutConfigFlow(ConfigFlow, domain=DOMAIN):
    VERSION = 1

    def __init__(self) -> None:
        self._region: Region | None = None

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        if user_input is None:
            return self.async_show_form(step_id="user", data_schema=_region_schema())

        self._region = get_region(user_input[CONF_REGION])

        return await self.async_step_queue()

    async def async_step_queue(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        region = self._region

        if region is None:
            return self.async_abort(reason="unknown_region")

        if user_input is None:
            return self.async_show_form(step_id="queue", data_schema=_queue_schema(region))

        data = _queue_data(region, user_input, user_input[CONF_GROUP])
        subentry = ConfigSubentryData(
            data=data,
            subentry_type=SUBENTRY_QUEUE,
            title=_title(region, data),
            unique_id=f"{region.id}_{data[CONF_GROUP]}",
        )

        return self.async_create_entry(title=TITLE, data={}, options=dict(DEFAULT_OPTIONS), subentries=[subentry])

    @classmethod
    @callback
    def async_get_supported_subentry_types(cls, config_entry: ConfigEntry) -> dict[str, type[ConfigSubentryFlow]]:
        return {SUBENTRY_QUEUE: QueueSubentryFlow}

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return BlackoutOptionsFlow()


class QueueSubentryFlow(ConfigSubentryFlow):
    def __init__(self) -> None:
        self._region: Region | None = None

    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        if user_input is None:
            return self.async_show_form(step_id="user", data_schema=_region_schema())

        self._region = get_region(user_input[CONF_REGION])

        return await self.async_step_queue()

    async def async_step_queue(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        region = self._region

        if region is None:
            return self.async_abort(reason="unknown_region")

        if user_input is None:
            return self.async_show_form(step_id="queue", data_schema=_queue_schema(region))

        unique_id = f"{region.id}_{user_input[CONF_GROUP]}"

        if any(sub.unique_id == unique_id for sub in self._get_entry().subentries.values()):
            return self.async_abort(reason="already_configured")

        data = _queue_data(region, user_input, user_input[CONF_GROUP])

        return self.async_create_entry(title=_title(region, data), data=data, unique_id=unique_id)

    async def async_step_reconfigure(self, user_input: dict[str, Any] | None = None) -> SubentryFlowResult:
        subentry = self._get_reconfigure_subentry()
        region = get_region(subentry.data[CONF_REGION])

        if region is None:
            return self.async_abort(reason="unknown_region")

        if user_input is None:
            return self.async_show_form(
                step_id="reconfigure",
                data_schema=_queue_schema(region, dict(subentry.data), with_group=False),
            )

        data = _queue_data(region, user_input, subentry.data[CONF_GROUP])

        return self.async_update_and_abort(self._get_entry(), subentry, data=data, title=_title(region, data))


class BlackoutOptionsFlow(OptionsFlow):
    async def async_step_init(self, user_input: dict[str, Any] | None = None) -> ConfigFlowResult:
        if user_input is not None:
            return self.async_create_entry(data=user_input)

        options = {**DEFAULT_OPTIONS, **self.config_entry.options}
        schema = vol.Schema(
            {
                vol.Required(CONF_LANGUAGE, default=options[CONF_LANGUAGE]): SelectSelector(
                    SelectSelectorConfig(
                        options=[*LANGUAGES, LANGUAGE_AUTO],
                        translation_key=CONF_LANGUAGE,
                        mode=SelectSelectorMode.DROPDOWN,
                    )
                ),
                vol.Required(CONF_SCAN_INTERVAL, default=options[CONF_SCAN_INTERVAL]): NumberSelector(
                    NumberSelectorConfig(min=3, max=60, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="min")
                ),
                vol.Required(CONF_HISTORY_DAYS, default=options[CONF_HISTORY_DAYS]): NumberSelector(
                    NumberSelectorConfig(min=7, max=730, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="d")
                ),
                vol.Required(CONF_OUTAGE_LOG_DAYS, default=options[CONF_OUTAGE_LOG_DAYS]): NumberSelector(
                    NumberSelectorConfig(min=7, max=1825, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="d")
                ),
                vol.Required(CONF_MIN_OUTAGE, default=options[CONF_MIN_OUTAGE]): NumberSelector(
                    NumberSelectorConfig(min=0, max=3600, step=1, mode=NumberSelectorMode.BOX, unit_of_measurement="s")
                ),
                vol.Required(CONF_EMERGENCY_SOURCES, default=list(options[CONF_EMERGENCY_SOURCES])): SelectSelector(
                    SelectSelectorConfig(
                        options=list(EMERGENCY_SOURCES),
                        multiple=True,
                        translation_key=CONF_EMERGENCY_SOURCES,
                        mode=SelectSelectorMode.LIST,
                    )
                ),
            }
        )

        return self.async_show_form(step_id="init", data_schema=schema)
