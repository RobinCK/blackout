"""Shared access to the sources: one request per URL and interval for every queue."""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .models import KYIV, FeedResult, RegionState
from .regions import Region
from .sources.base import SourceError
from .sources.http import JsonFetcher
from .sources.ua_power_status import UaPowerStatusSource

_LOGGER = logging.getLogger(__name__)


@dataclass(slots=True)
class ScheduleAnswer:
    feed: FeedResult | None
    errors: list[str] = field(default_factory=list)
    skipped: list[str] = field(default_factory=list)


class BlackoutHub:
    def __init__(self, hass: HomeAssistant) -> None:
        self.http = JsonFetcher(async_get_clientsession(hass))
        self._status = UaPowerStatusSource()

    async def fetch_schedule(self, region: Region, group: str, now: datetime) -> ScheduleAnswer:
        today = now.astimezone(KYIV).date()
        answer = ScheduleAnswer(None)

        for source in region.sources:
            try:
                feed = await source.fetch(self.http, now)
            except SourceError as err:
                answer.errors.append(f"{source.name}: {err}")
                continue

            if today in feed.group_days(group):
                answer.feed = feed

                return answer

            answer.skipped.append(source.name)
            answer.feed = answer.feed or feed

        if answer.errors:
            _LOGGER.debug("%s/%s: %s", region.id, group, "; ".join(answer.errors))

        return answer

    async def fetch_region_state(self, region: Region, now: datetime) -> RegionState | None:
        if region.status_slug is None:
            return None

        try:
            states = await self._status.fetch(self.http, now)
        except SourceError as err:
            _LOGGER.debug("Grid state is unavailable: %s", err)

            return None

        return states.get(region.status_slug)
