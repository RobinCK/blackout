"""Contracts every source adapter implements."""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Mapping
from datetime import datetime
from typing import TYPE_CHECKING

from ..models import FeedResult, RegionState

if TYPE_CHECKING:
    from .http import JsonFetcher


class SourceError(Exception):
    """A source did not answer, or answered in a format it does not know."""


class ScheduleSource(ABC):
    name: str
    official: bool

    @property
    @abstractmethod
    def key(self) -> str:
        """Identity of the source instance, shared by every region that uses it."""

    @abstractmethod
    async def fetch(self, http: JsonFetcher, now: datetime) -> FeedResult:
        """Every group the source knows, by day."""


class StatusSource(ABC):
    name: str

    @abstractmethod
    async def fetch(self, http: JsonFetcher, now: datetime) -> Mapping[str, RegionState]:
        """State of the grid by region slug."""
