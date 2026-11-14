"""One shared JSON client: every URL is fetched once per interval for all queues."""

from __future__ import annotations

import asyncio
import json
import time
from collections import defaultdict
from typing import Any

import aiohttp

from .base import SourceError

USER_AGENT = "HomeAssistant-Blackout (+https://github.com/RobinCK/blackout)"
REQUEST_TIMEOUT = 30
MAX_BYTES = 8 * 1024 * 1024


class JsonFetcher:
    def __init__(self, session: aiohttp.ClientSession) -> None:
        self._session = session
        self._cache: dict[str, tuple[float, Any]] = {}
        self._locks: defaultdict[str, asyncio.Lock] = defaultdict(asyncio.Lock)

    async def get_json(self, url: str, ttl: float) -> Any:
        async with self._locks[url]:
            cached = self._cache.get(url)

            if cached is not None and time.monotonic() - cached[0] < ttl:
                return cached[1]

            payload = await self._request(url)
            self._cache[url] = (time.monotonic(), payload)

            return payload

    def invalidate(self) -> None:
        self._cache.clear()

    async def _request(self, url: str) -> Any:
        headers = {"User-Agent": USER_AGENT, "Accept": "application/json"}

        try:
            async with self._session.get(
                url, headers=headers, timeout=aiohttp.ClientTimeout(total=REQUEST_TIMEOUT)
            ) as response:
                if response.status != 200:
                    raise SourceError(f"HTTP {response.status}")

                body = await response.content.read(MAX_BYTES + 1)
        except (aiohttp.ClientError, TimeoutError) as err:
            raise SourceError(type(err).__name__) from err

        if len(body) > MAX_BYTES:
            raise SourceError("response is too large")

        try:
            return json.loads(body)
        except ValueError as err:
            raise SourceError("response is not JSON") from err
