"""Registry of regions: queues, schedule sources in order of preference, grid state slug."""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass

from .sources.base import ScheduleSource
from .sources.cherkasyoblenergo_api import CherkasyoblenergoApiSource
from .sources.dtek_mirror import DtekMirrorSource
from .sources.mykolaiv import MykolaivSource
from .sources.svitlo_live import SvitloLiveSource
from .sources.yasno import YasnoSource

OUTAGE_DATA_UA = "https://raw.githubusercontent.com/Baskerville42/outage-data-ua/main/data/{}.json"
OE_OUTAGE_DATA = "https://raw.githubusercontent.com/yaroslav2901/OE_OUTAGE_DATA/main/data/{}.json"

STANDARD_GROUPS = tuple(f"{queue}.{sub}" for queue in range(1, 7) for sub in (1, 2))
KYIV_GROUPS = tuple(f"{queue}.1" for queue in range(1, 61))
NUMBERED_GROUPS = tuple(str(group) for group in range(1, 13))


@dataclass(frozen=True, slots=True)
class Region:
    id: str
    operator: str
    groups: tuple[str, ...]
    sources: tuple[ScheduleSource, ...]
    status_slug: str | None

    @property
    def has_schedule(self) -> bool:
        return bool(self.sources)


def _mirror(base: str, file: str, name: str) -> DtekMirrorSource:
    return DtekMirrorSource(base.format(file), name)


def _oblenergo(file: str) -> DtekMirrorSource:
    return _mirror(OE_OUTAGE_DATA, file, "OE_OUTAGE_DATA")


def _dtek(file: str) -> DtekMirrorSource:
    return _mirror(OUTAGE_DATA_UA, file, "outage-data-ua")


REGIONS: tuple[Region, ...] = (
    Region(
        "kyiv",
        "DTEK Kyiv Electric Networks",
        KYIV_GROUPS,
        (YasnoSource(25, 902), _dtek("kyiv"), SvitloLiveSource("kyiv")),
        "kyiv",
    ),
    Region(
        "kyiv_oblast",
        "DTEK Kyiv Regional Electric Networks",
        STANDARD_GROUPS,
        (_dtek("kyiv-region"), SvitloLiveSource("kiivska-oblast")),
        "kyiv-oblast",
    ),
    Region(
        "dnipro_dnem",
        "DTEK Dnipro Electric Networks",
        STANDARD_GROUPS,
        (YasnoSource(3, 301), _dtek("dnipro"), SvitloLiveSource("dnipro-dnem")),
        "dnipropetrovsk",
    ),
    Region(
        "dnipro_cek", "CEK", STANDARD_GROUPS, (YasnoSource(3, 303), SvitloLiveSource("dnipro-cek")), "dnipropetrovsk"
    ),
    Region(
        "odesa",
        "DTEK Odesa Electric Networks",
        STANDARD_GROUPS,
        (_dtek("odesa"), SvitloLiveSource("odeska-oblast")),
        "odesa",
    ),
    Region(
        "cherkasy",
        "Cherkasyoblenergo",
        STANDARD_GROUPS,
        (CherkasyoblenergoApiSource(), _oblenergo("Cherkasyoblenergo"), SvitloLiveSource("cherkaska-oblast")),
        "cherkasy",
    ),
    Region(
        "chernihiv",
        "Chernihivoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Chernihivoblenergo"), SvitloLiveSource("chernihivska-oblast")),
        "chernihiv",
    ),
    Region(
        "chernivtsi", "Chernivtsioblenergo", NUMBERED_GROUPS, (SvitloLiveSource("chernivetska-oblast"),), "chernivtsi"
    ),
    Region(
        "ivano_frankivsk",
        "Prykarpattiaoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Prykarpattiaoblenerho"), SvitloLiveSource("ivano-frankivska-oblast")),
        "ivano-frankivsk",
    ),
    Region(
        "kharkiv",
        "Kharkivoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Kharkivoblenerho"), SvitloLiveSource("kharkivska-oblast")),
        "kharkiv",
    ),
    Region(
        "khmelnytskyi",
        "Khmelnytskoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Khmelnytskoblenerho"), SvitloLiveSource("khmelnytska-oblast")),
        "khmelnytskyi",
    ),
    Region("kirovohrad", "Kirovohradoblenergo", STANDARD_GROUPS, (), "kirovohrad"),
    Region(
        "lviv",
        "Lvivoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Lvivoblenerho"), SvitloLiveSource("lvivska-oblast")),
        "lviv",
    ),
    Region("mykolaiv", "Mykolaivoblenergo", STANDARD_GROUPS, (MykolaivSource(),), "mykolaiv"),
    Region(
        "poltava",
        "Poltavaoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Poltavaoblenergo"), SvitloLiveSource("poltavska-oblast")),
        "poltava",
    ),
    Region(
        "rivne",
        "Rivneoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Rivneoblenergo"), SvitloLiveSource("rivnenska-oblast")),
        "rivne",
    ),
    Region("sumy", "Sumyoblenergo", STANDARD_GROUPS, (SvitloLiveSource("sumska-oblast"),), "sumy"),
    Region(
        "ternopil",
        "Ternopiloblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Ternopiloblenerho"), SvitloLiveSource("ternopilska-oblast")),
        "ternopil",
    ),
    Region(
        "vinnytsia",
        "Vinnytsiaoblenergo",
        STANDARD_GROUPS,
        (
            DtekMirrorSource(
                "https://raw.githubusercontent.com/olnet93/gpv-voe-vinnytsia/main/data/Vinnytsiaoblenerho.json",
                "gpv-voe-vinnytsia",
            ),
            DtekMirrorSource(
                "https://raw.githubusercontent.com/vn-progr/gpv-voe-vinnytsia/main/data/Vinnytsiaoblenerho.json",
                "gpv-voe-vinnytsia",
            ),
        ),
        "vinnytsia",
    ),
    Region("volyn", "Volynoblenergo", STANDARD_GROUPS, (), "volyn"),
    Region(
        "zakarpattia",
        "Zakarpattiaoblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Zakarpattiaoblenerho"), SvitloLiveSource("zakarpatska-oblast")),
        "zakarpattia",
    ),
    Region(
        "zaporizhzhia",
        "Zaporizhzhiaoblenergo",
        STANDARD_GROUPS,
        (
            DtekMirrorSource(
                "https://raw.githubusercontent.com/milkmann/gpv-zoe-zaporizhzhia/main/data/Zaporizhzhiaoblenergo.json",
                "gpv-zoe-zaporizhzhia",
            ),
            _oblenergo("Zaporizhzhiaoblenergo"),
            SvitloLiveSource("zaporizka-oblast"),
        ),
        "zaporizhzhia",
    ),
    Region(
        "zhytomyr",
        "Zhytomyroblenergo",
        STANDARD_GROUPS,
        (_oblenergo("Zhytomyroblenergo"), SvitloLiveSource("zhytomyrska-oblast")),
        "zhytomyr",
    ),
)

REGIONS_BY_ID: Mapping[str, Region] = {region.id: region for region in REGIONS}


def get_region(region_id: str) -> Region | None:
    return REGIONS_BY_ID.get(region_id)
