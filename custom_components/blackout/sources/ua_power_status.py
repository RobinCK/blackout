"""Grid state by region from the Ukrenergo app, mirrored by lasercat12/ua-power-status."""

from __future__ import annotations

from collections.abc import Mapping
from datetime import datetime, timedelta
from typing import Any

from ..models import RegionState, RegionStatus
from .base import SourceError, StatusSource
from .http import JsonFetcher

URL = "https://raw.githubusercontent.com/lasercat12/ua-power-status/main/data/regions.json"
TTL = 120
STALE_AFTER = timedelta(hours=2)


def parse_datetime(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None

    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def parse_status(value: Any) -> RegionStatus:
    try:
        return RegionStatus(str(value))
    except ValueError:
        return RegionStatus.UNKNOWN


def parse_regions(payload: Any, now: datetime) -> dict[str, RegionState]:
    if not isinstance(payload, Mapping) or not isinstance(payload.get("regions"), list):
        raise SourceError("unknown format")

    generated = parse_datetime(payload.get("generated_at"))

    if generated is None or now - generated > STALE_AFTER:
        raise SourceError("data is stale")

    states: dict[str, RegionState] = {}

    for region in payload["regions"]:
        if not isinstance(region, Mapping) or not isinstance(region.get("slug"), str):
            continue

        period = region.get("period")
        period_end = parse_datetime(period.get("end")) if isinstance(period, Mapping) else None
        states[region["slug"]] = RegionState(
            parse_status(region.get("status")),
            parse_datetime(region.get("since")),
            period_end,
        )

    return states


class UaPowerStatusSource(StatusSource):
    name = "Ukrenergo"

    async def fetch(self, http: JsonFetcher, now: datetime) -> Mapping[str, RegionState]:
        return parse_regions(await http.get_json(URL, TTL), now)
