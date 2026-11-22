"""Cherkasyoblenergo schedule posts read from the operator's own posts API.

The parsing follows sigmanor/cherkasyoblenergo-api. The news list gives the title, slug and publication
time of every post; the body of a schedule post holds a line per queue ("5.1 14:00 - 17:00, 20:00 - 22:00")
or a table row with the sub-queue in Roman numerals. A queue missing from a schedule post has no outages. An update
published during the day lists only its rest, so it replaces the slots from the half hour it was published
in, and the earlier ones keep the version before it.
"""

from __future__ import annotations

import asyncio
import html
import re
from collections.abc import Mapping, Sequence
from dataclasses import dataclass
from datetime import date, datetime
from difflib import SequenceMatcher
from typing import Any
from urllib.parse import quote

from ..models import (
    KYIV,
    SLOT_MINUTES,
    SLOTS_PER_DAY,
    DaySchedule,
    DayStatus,
    FeedResult,
    Slots,
    SlotState,
    empty_slots,
    slot_index,
)
from .base import ScheduleSource, SourceError
from .http import JsonFetcher

POSTS_URL = "https://www.cherkasyoblenergo.com/api/v1/posts"
LIST_URL = f"{POSTS_URL}/category/news?lang=uk&page=0&size=20"
DETAIL_URL = POSTS_URL + "/{}?lang=uk"
TTL = 300
GROUPS = tuple(f"{queue}.{sub}" for queue in range(1, 7) for sub in (1, 2))
DAY_MINUTES = 24 * 60

MONTHS = {
    "січня": 1,
    "лютого": 2,
    "березня": 3,
    "квітня": 4,
    "травня": 5,
    "червня": 6,
    "липня": 7,
    "серпня": 8,
    "вересня": 9,
    "жовтня": 10,
    "листопада": 11,
    "грудня": 12,
}
MONTH_SIMILARITY = 0.8
TITLE_WORDS = ("погодин", "відключ", "вимкн", "оновл")
CANCEL_WORDS = ("графік", "відключ", "вимкн", "погодин", "гпв")
CANCELLED = "скасовано"
SUB_QUEUES = {"1": 1, "І": 1, "I": 1, "l": 1, "2": 2, "ІІ": 2, "II": 2, "ll": 2}

TITLE_DATE_RE = re.compile(r"(\d{1,2})\s+([^\W\d_]+)(?:\s+(\d{4}))?")
BREAK_RE = re.compile(r"<br\s*/?>|</(?:p|div|li|tr|h[1-6]|ul|ol|table)\s*>", re.IGNORECASE)
CELL_RE = re.compile(r"</t[dh]\s*>", re.IGNORECASE)
TAG_RE = re.compile(r"<[^>]*>")
SPACE_RE = re.compile(r"\s+")
SENTENCE_RE = re.compile(r"[.!?;\n]+")
QUEUE_RE = re.compile(r"^\W*([1-6])\s*\.\s*(ІІ|II|ll|І|I|l|[12])(?!\d)\.?\s*[:\-–—]?\s*(.+)$")
RANGE_RE = re.compile(r"(\d{1,2}):(\d{2})\s*[-–—]\s*(\d{1,2}):(\d{2})")


@dataclass(frozen=True, slots=True)
class Summary:
    slug: str
    title: str
    day: date
    published: datetime


@dataclass(frozen=True, slots=True)
class Post:
    day: date
    published: datetime
    groups: Mapping[str, Slots]


def is_schedule_title(title: str) -> bool:
    text = title.lower()

    return "гпв" in text or ("графік" in text and any(word in text for word in TITLE_WORDS))


def parse_month(word: str) -> int | None:
    name = word.lower()

    if name in MONTHS:
        return MONTHS[name]

    best = max(MONTHS, key=lambda month: SequenceMatcher(None, name, month).ratio())

    return MONTHS[best] if SequenceMatcher(None, name, best).ratio() >= MONTH_SIMILARITY else None


def _date(year: int, month: int, day: int) -> date | None:
    try:
        return date(year, month, day)
    except ValueError:
        return None


def title_day(title: str, published: datetime) -> date | None:
    for match in TITLE_DATE_RE.finditer(title):
        month = parse_month(match[2])

        if month is None:
            continue

        years = (int(match[3]),) if match[3] else (published.year - 1, published.year, published.year + 1)
        days = [day for year in years if (day := _date(year, month, int(match[1]))) is not None]

        if days:
            return min(days, key=lambda day: abs(day - published.date()))

    return None


def parse_published(value: Any) -> datetime | None:
    if not isinstance(value, str):
        return None

    try:
        moment = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None

    return moment.replace(tzinfo=KYIV) if moment.tzinfo is None else moment.astimezone(KYIV)


def text_lines(body: str) -> list[str]:
    text = html.unescape(TAG_RE.sub("", CELL_RE.sub(" ", BREAK_RE.sub("\n", body))))

    return [line for raw in text.splitlines() if (line := SPACE_RE.sub(" ", raw).strip())]


def _minutes(hours: str, minutes: str) -> int:
    return int(hours) * 60 + int(minutes)


def parse_ranges(value: str) -> Slots | None:
    text = value.strip().rstrip(".,;").strip()

    if text.lower() == CANCELLED:
        return empty_slots(SlotState.ON)

    matches = [RANGE_RE.fullmatch(part.strip()) for part in re.split(r"[,;]", text)]

    if not matches or not all(matches):
        return None

    slots = list(empty_slots(SlotState.ON))

    for match in matches:
        start = _minutes(match[1], match[2])
        end = _minutes(match[3], match[4])
        end = DAY_MINUTES if end <= start else end

        for index in range(start // SLOT_MINUTES, min(-(-end // SLOT_MINUTES), SLOTS_PER_DAY)):
            slots[index] = SlotState.OFF

    return tuple(slots)


def parse_body(body: str) -> dict[str, Slots] | None:
    found: dict[str, Slots] = {}

    for line in text_lines(body):
        match = QUEUE_RE.match(line)
        slots = parse_ranges(match[3]) if match else None

        if match and slots is not None:
            found[f"{match[1]}.{SUB_QUEUES[match[2]]}"] = slots

    if not found:
        return None

    return {group: found.get(group, empty_slots(SlotState.ON)) for group in GROUPS}


def announces_cancellation(body: str) -> bool:
    sentences = SENTENCE_RE.split("\n".join(text_lines(body)).lower())

    return any("скасован" in sentence and any(word in sentence for word in CANCEL_WORDS) for sentence in sentences)


def _content(payload: Any) -> Any:
    if not isinstance(payload, Mapping) or payload.get("success") is not True:
        return None

    data = payload.get("data")

    return data.get("content") if isinstance(data, Mapping) else None


def parse_listing(payload: Any) -> list[Summary]:
    content = _content(payload)

    if not isinstance(content, list):
        raise SourceError("unknown format")

    summaries: list[Summary] = []

    for item in content:
        if not isinstance(item, Mapping):
            continue

        slug, title = item.get("slug"), item.get("title")
        published = parse_published(item.get("publishedAt"))

        if not isinstance(slug, str) or not slug or not isinstance(title, str) or published is None:
            continue

        day = title_day(title, published) if is_schedule_title(title) else None

        if day is not None:
            summaries.append(Summary(slug, title, day, published))

    return summaries


def parse_post(summary: Summary, payload: Any) -> Post | None:
    body = _content(payload)

    if not isinstance(body, str):
        return None

    groups = parse_body(body)

    if groups is None and announces_cancellation(body):
        groups = {group: empty_slots(SlotState.ON) for group in GROUPS}

    return Post(summary.day, summary.published, groups) if groups else None


def merge(previous: Slots | None, post: Post, slots: Slots) -> Slots:
    if previous is None or post.published.date() < post.day:
        return slots

    cutoff = slot_index(post.published) if post.published.date() == post.day else SLOTS_PER_DAY

    return previous[:cutoff] + slots[cutoff:]


def build_feed(posts: Sequence[Post], source: str) -> FeedResult:
    merged: dict[str, dict[date, Slots]] = {}
    updated: dict[date, datetime] = {}

    for post in sorted(posts, key=lambda post: post.published):
        for group, slots in post.groups.items():
            days = merged.setdefault(group, {})
            days[post.day] = merge(days.get(post.day), post, slots)

        updated[post.day] = post.published

    groups = {
        group: {
            day: DaySchedule(
                day,
                slots,
                DayStatus.SCHEDULE if SlotState.OFF in slots else DayStatus.NO_OUTAGES,
                updated[day],
            )
            for day, slots in days.items()
        }
        for group, days in merged.items()
    }

    return FeedResult(source, groups, updated_at=max(updated.values(), default=None))


class CherkasyoblenergoSource(ScheduleSource):
    name = "cherkasyoblenergo.com"
    official = True

    @property
    def key(self) -> str:
        return "cherkasyoblenergo"

    async def fetch(self, http: JsonFetcher, now: datetime) -> FeedResult:
        today = now.astimezone(KYIV).date()
        summaries = [item for item in parse_listing(await http.get_json(LIST_URL, TTL)) if item.day >= today]
        bodies = await asyncio.gather(*(self._detail(http, item.slug) for item in summaries))

        if summaries and all(body is None for body in bodies):
            raise SourceError("posts are unavailable")

        posts = [
            post
            for summary, body in zip(summaries, bodies, strict=True)
            if body is not None and (post := parse_post(summary, body)) is not None
        ]

        return build_feed(posts, self.name)

    @staticmethod
    async def _detail(http: JsonFetcher, slug: str) -> Any:
        try:
            return await http.get_json(DETAIL_URL.format(quote(slug, safe="")), TTL)
        except SourceError:
            return None
