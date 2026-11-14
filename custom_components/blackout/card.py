"""Serve the dashboard cards and load them on every dashboard page."""

from __future__ import annotations

import hashlib
from pathlib import Path

from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

CARD_URL = "/blackout_static/blackout-card.js"
CARD_FILE = Path(__file__).parent / "frontend" / "blackout-card.js"


def _digest() -> str | None:
    if not CARD_FILE.is_file():
        return None

    return hashlib.sha256(CARD_FILE.read_bytes()).hexdigest()[:12]


async def async_register_card(hass: HomeAssistant) -> None:
    if hass.http is None:
        return

    digest = await hass.async_add_executor_job(_digest)

    if digest is None:
        return

    await hass.http.async_register_static_paths([StaticPathConfig(CARD_URL, str(CARD_FILE), True)])

    if "frontend" not in hass.config.components:
        return

    from homeassistant.components.frontend import add_extra_js_url  # noqa: PLC0415

    add_extra_js_url(hass, f"{CARD_URL}?v={digest}")
