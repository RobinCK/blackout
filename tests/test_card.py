"""The integration serves the cards."""

from __future__ import annotations

from custom_components.blackout.card import CARD_FILE, _digest


def test_card_is_built() -> None:
    assert CARD_FILE.is_file()
    assert len(_digest() or "") == 12
