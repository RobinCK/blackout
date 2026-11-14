"""Entity names in the language chosen in the options, entity IDs always from English names."""

from __future__ import annotations

from dataclasses import dataclass, field

from homeassistant.core import HomeAssistant
from homeassistant.helpers.translation import async_get_translations

from .const import CONF_LANGUAGE, DEFAULT_LANGUAGE, DOMAIN, LANGUAGE_AUTO

OBJECT_ID_LANGUAGE = "en"


@dataclass(frozen=True, slots=True)
class EntityNames:
    language: str
    names: dict[str, str] = field(default_factory=dict)
    object_names: dict[str, str] = field(default_factory=dict)


async def _load(hass: HomeAssistant, language: str) -> dict[str, str]:
    translations = await async_get_translations(hass, language, "entity", [DOMAIN])
    prefix = f"component.{DOMAIN}.entity."
    names: dict[str, str] = {}

    for key, value in translations.items():
        if not key.startswith(prefix) or not key.endswith(".name"):
            continue

        names[key.removeprefix(prefix).split(".")[1]] = value

    return names


async def async_entity_names(hass: HomeAssistant, options: dict[str, object]) -> EntityNames:
    chosen = str(options.get(CONF_LANGUAGE, DEFAULT_LANGUAGE))

    if chosen == LANGUAGE_AUTO:
        return EntityNames(hass.config.language)

    return EntityNames(
        chosen,
        await _load(hass, chosen),
        await _load(hass, OBJECT_ID_LANGUAGE),
    )
