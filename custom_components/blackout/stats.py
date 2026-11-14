"""Statistics of actual outages kept in the history."""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date, datetime, timedelta

from .models import KYIV, OutageInterval, day_start


@dataclass(frozen=True, slots=True)
class OutageSummary:
    total: timedelta
    count: int
    longest: OutageInterval | None
    availability: float


def clipped(outage: OutageInterval, start: datetime, end: datetime, now: datetime) -> timedelta:
    begin = max(outage.start, start)
    finish = min(outage.end or now, end)

    return max(finish - begin, timedelta())


def summarize(outages: Sequence[OutageInterval], start: datetime, end: datetime, now: datetime) -> OutageSummary:
    window = max(min(end, now) - start, timedelta(seconds=1))
    total = sum((clipped(o, start, end, now) for o in outages), timedelta())
    longest = max(outages, key=lambda o: o.duration(now), default=None)
    availability = max(0.0, 100 * (1 - total / window))

    return OutageSummary(total, len(outages), longest, round(availability, 2))


def day_window(day: date) -> tuple[datetime, datetime]:
    return day_start(day), day_start(day + timedelta(days=1))


def today_window(now: datetime) -> tuple[datetime, datetime]:
    return day_window(now.astimezone(KYIV).date())
