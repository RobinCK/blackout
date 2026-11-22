"""Cherkasyoblenergo posts API: listing, post bodies, updates during the day."""

from __future__ import annotations

from datetime import date, datetime

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from pytest_homeassistant_custom_component.test_util.aiohttp import AiohttpClientMocker

from custom_components.blackout.models import KYIV, DayStatus, SlotState, encode_slots
from custom_components.blackout.sources.base import SourceError
from custom_components.blackout.sources.cherkasyoblenergo import (
    DETAIL_URL,
    LIST_URL,
    CherkasyoblenergoSource,
    parse_body,
    parse_listing,
    parse_ranges,
    title_day,
)
from custom_components.blackout.sources.http import JsonFetcher

from .conftest import load_fixture

NOW = datetime(2026, 11, 22, 21, 30, tzinfo=KYIV)


def _off(*ranges: tuple[int, int]) -> str:
    codes = ["1"] * 48

    for start, end in ranges:
        codes[start:end] = ["0"] * (end - start)

    return "".join(codes)


def _mock(aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(LIST_URL, json=load_fixture("cherkasyoblenergo_news.json"))

    for slug, payload in load_fixture("cherkasyoblenergo_posts.json").items():
        aioclient_mock.get(DETAIL_URL.format(slug), json=payload)


@pytest.mark.parametrize(
    ("title", "published", "expected"),
    [
        ("Оновлення графіка погодинних відключень (ГПВ) на 22 листопада", "2026-11-22T15:52:00", date(2026, 11, 22)),
        ("Графік на 1 січня", "2026-12-31T21:00:00", date(2027, 1, 1)),
        ("Графік з 15:30, 22 жовтня 2025 року", "2026-11-22T10:00:00", date(2025, 10, 22)),
        ("Графік погодинних відключень на 23 листопда", "2026-11-22T20:00:00", date(2026, 11, 23)),
        ("Графіки погодинних відключень: як вони діяли у жовтні", "2026-11-22T10:00:00", None),
    ],
)
def test_title_day(title: str, published: str, expected: date | None) -> None:
    assert title_day(title, datetime.fromisoformat(published).replace(tzinfo=KYIV)) == expected


def test_ranges() -> None:
    assert encode_slots(parse_ranges("22:00 – 00:00") or ()) == _off((44, 48))
    assert encode_slots(parse_ranges("08:00 - 10:00, 14:30 - 17:00;") or ()) == _off((16, 20), (29, 34))
    assert parse_ranges("скасовано") == (SlotState.ON,) * 48
    assert parse_ranges("130,5 години") is None


def test_statistics_are_not_a_schedule() -> None:
    assert parse_body("<p>Години без світла у жовтні:</p><p>1.1 – 130,5 години;</p><p>5.1 – 128,5 години.</p>") is None


def test_listing_rejects_unknown_format() -> None:
    with pytest.raises(SourceError):
        parse_listing({"success": False, "message": "maintenance"})


async def test_updates_replace_the_rest_of_the_day(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    _mock(aioclient_mock)
    feed = await CherkasyoblenergoSource().fetch(JsonFetcher(async_get_clientsession(hass)), NOW)
    today = feed.group_days("5.1")[date(2026, 11, 22)]

    assert encode_slots(today.slots) == _off((16, 20), (28, 34), (40, 44))
    assert today.updated_at == datetime(2026, 11, 22, 15, 52, 0, 123000, tzinfo=KYIV)
    assert encode_slots(feed.group_days("5.2")[date(2026, 11, 22)].slots) == _off((36, 42))
    assert encode_slots(feed.group_days("1.1")[date(2026, 11, 22)].slots) == _off((0, 4), (20, 26))
    assert feed.group_days("6.2")[date(2026, 11, 22)].status == DayStatus.NO_OUTAGES


async def test_tables_cancellations_and_skipped_posts(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    _mock(aioclient_mock)
    feed = await CherkasyoblenergoSource().fetch(JsonFetcher(async_get_clientsession(hass)), NOW)
    requested = {str(url) for _method, url, _data, _headers in aioclient_mock.mock_calls}

    assert encode_slots(feed.group_days("5.1")[date(2026, 11, 23)].slots) == _off((0, 4), (25, 30))
    assert encode_slots(feed.group_days("5.2")[date(2026, 11, 23)].slots) == _off((4, 8), (36, 40))
    assert feed.group_days("1.1")[date(2026, 11, 23)].status == DayStatus.NO_OUTAGES
    assert all(feed.group_days(group)[date(2026, 11, 24)].status == DayStatus.NO_OUTAGES for group in feed.groups)
    assert date(2026, 11, 21) not in feed.group_days("5.1")
    assert feed.updated_at == datetime(2026, 11, 22, 21, 10, tzinfo=KYIV)
    assert DETAIL_URL.format("uvaha-shakhrayi") not in requested
    assert DETAIL_URL.format("statystyka-zhovten") not in requested
    assert DETAIL_URL.format("hrafik-na-21-lystopada") not in requested


async def test_unavailable_posts(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    aioclient_mock.get(LIST_URL, json=load_fixture("cherkasyoblenergo_news.json"))

    for item in load_fixture("cherkasyoblenergo_news.json")["data"]["content"]:
        aioclient_mock.get(DETAIL_URL.format(item["slug"]), status=503)

    with pytest.raises(SourceError):
        await CherkasyoblenergoSource().fetch(JsonFetcher(async_get_clientsession(hass)), NOW)


async def test_short_failures_reuse_the_last_answers(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    source = CherkasyoblenergoSource()
    session = async_get_clientsession(hass)
    _mock(aioclient_mock)
    first = await source.fetch(JsonFetcher(session), NOW)

    aioclient_mock.clear_requests()
    aioclient_mock.get(LIST_URL, text="<html>Service Unavailable</html>")

    for slug in load_fixture("cherkasyoblenergo_posts.json"):
        aioclient_mock.get(DETAIL_URL.format(slug), status=503)

    second = await source.fetch(JsonFetcher(session), NOW)

    assert second.groups == first.groups


async def test_a_post_never_read_fails_the_source(hass: HomeAssistant, aioclient_mock: AiohttpClientMocker) -> None:
    _mock(aioclient_mock)
    aioclient_mock.clear_requests()
    aioclient_mock.get(LIST_URL, json=load_fixture("cherkasyoblenergo_news.json"))

    for slug, payload in load_fixture("cherkasyoblenergo_posts.json").items():
        status = 503 if slug == "hrafik-na-22-lystopada" else 200
        aioclient_mock.get(DETAIL_URL.format(slug), status=status, json=payload)

    with pytest.raises(SourceError, match="hrafik-na-22-lystopada"):
        await CherkasyoblenergoSource().fetch(JsonFetcher(async_get_clientsession(hass)), NOW)
