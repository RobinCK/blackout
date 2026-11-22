"""Everything a dashboard card needs about a queue, in one JSON object."""

from __future__ import annotations

from datetime import date, datetime, timedelta
from itertools import pairwise
from typing import Any

from .coordinator import QueueCoordinator
from .models import KYIV, SLOT_MINUTES, DaySchedule, DayStatus, OutageInterval, day_start, empty_slots
from .stats import day_window, summarize
from .timeline import ScheduledOutage, current_outage, longest_outage_hours, next_outage, next_power_on, outage_hours


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None


def _outage(outage: ScheduledOutage | None) -> dict[str, Any] | None:
    if outage is None:
        return None

    return {"start": outage.start.isoformat(), "end": outage.end.isoformat(), "possible": outage.possible}


def _interval(outage: OutageInterval | None, now: datetime) -> dict[str, Any] | None:
    if outage is None:
        return None

    return {
        "start": outage.start.isoformat(),
        "end": _iso(outage.end),
        "hours": round(outage.duration(now).total_seconds() / 3600, 2),
    }


def _day(coordinator: QueueCoordinator, day: date, now: datetime) -> dict[str, Any]:
    schedule = coordinator.schedule_for(day) or DaySchedule(day, empty_slots(), DayStatus.WAITING)
    start, end = day_window(day)
    actual = coordinator.history.outages(start, end) if coordinator.grid else []
    summary = summarize(actual, start, end, now)
    published = schedule.status != DayStatus.WAITING

    return {
        "date": day.isoformat(),
        "start": day_start(day).isoformat(),
        "status": schedule.status.value,
        "slots": [slot.value for slot in schedule.slots],
        "planned": [slot.value for slot in coordinator.history.planned(day, schedule.slots)],
        "updated_at": _iso(schedule.updated_at),
        "versions": coordinator.history.versions(day),
        "outage_hours": outage_hours(schedule) if published else None,
        "possible_hours": (outage_hours(schedule, possible=True) or 0) - (outage_hours(schedule) or 0)
        if published
        else None,
        "longest_hours": longest_outage_hours(schedule) if published else None,
        "actual": [_interval(o, now) for o in actual],
        "actual_hours": round(summary.total.total_seconds() / 3600, 2) if coordinator.grid else None,
    }


def _records(coordinator: QueueCoordinator, now: datetime) -> dict[str, Any]:
    outages = coordinator.history.all_outages()

    if not outages:
        return {
            "longest_outage": None,
            "worst_day": None,
            "longest_power_streak": None,
            "current_power_streak": None,
            "count": 0,
        }

    longest = max(outages, key=lambda o: o.duration(now))
    by_day: dict[date, timedelta] = {}

    for outage in outages:
        day = outage.start.astimezone(KYIV).date()
        last = (outage.end or now).astimezone(KYIV).date()

        while day <= last:
            start, end = day_window(day)
            by_day[day] = by_day.get(day, timedelta()) + max(
                min(outage.end or now, end) - max(outage.start, start), timedelta()
            )
            day += timedelta(days=1)

    worst_day, worst = max(by_day.items(), key=lambda item: item[1])
    streaks = [
        OutageInterval(previous.end, following.start)
        for previous, following in pairwise(outages)
        if previous.end is not None
    ]
    last_end = outages[-1].end
    current = OutageInterval(last_end, None) if last_end is not None else None

    if current is not None:
        streaks.append(current)

    return {
        "longest_outage": _interval(longest, now),
        "worst_day": {"date": worst_day.isoformat(), "hours": round(worst.total_seconds() / 3600, 2)},
        "longest_power_streak": _interval(max(streaks, key=lambda s: s.duration(now), default=None), now),
        "current_power_streak": _interval(current, now),
        "count": len(outages),
    }


def build_payload(coordinator: QueueCoordinator, days: int, now: datetime) -> dict[str, Any]:
    data = coordinator.data
    today = now.astimezone(KYIV).date()
    first = today - timedelta(days=days - 1)
    outages = coordinator.outages()
    window_start = datetime.combine(first, datetime.min.time(), KYIV)
    actual = coordinator.history.outages(window_start, now) if coordinator.grid else []
    summary = summarize(actual, window_start, now, now)
    region = data.region if data else None
    grid = coordinator.grid

    return {
        "queue": {
            "title": coordinator.subentry.title,
            "region": coordinator.region.id,
            "operator": coordinator.region.operator,
            "group": coordinator.group,
            "has_schedule": coordinator.region.has_schedule,
            "grid_entity": grid.entity_id if grid else None,
        },
        "now": now.isoformat(),
        "slot_minutes": SLOT_MINUTES,
        "status": coordinator.power_status(now).value,
        "emergency": coordinator.emergency(now),
        "region_status": {
            "status": region.status.value,
            "since": _iso(region.since),
            "period_end": _iso(region.period_end),
        }
        if region
        else None,
        "current": _outage(current_outage(outages, now)),
        "next": _outage(next_outage(outages, now)),
        "next_possible": _outage(next_outage(outages, now, possible=True)),
        "next_power_on": _iso(next_power_on(outages, now)),
        "grid": {"present": grid.present, "since": _iso(grid.since)} if grid else None,
        "source": {
            "name": data.source if data else None,
            "ok": coordinator.last_update_success,
            "last_success": _iso(coordinator.last_success),
            "last_error": coordinator.last_error,
            "fetched_at": _iso(data.fetched_at if data else None),
        },
        "days": [_day(coordinator, first + timedelta(days=offset), now) for offset in range(days + 1)],
        "summary": {
            "days": days,
            "actual_hours": round(summary.total.total_seconds() / 3600, 2) if grid else None,
            "count": summary.count if grid else None,
            "longest": _interval(summary.longest, now) if grid else None,
            "availability": summary.availability if grid else None,
        },
        "records": _records(coordinator, now) if grid else None,
    }
