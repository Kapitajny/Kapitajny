#!/usr/bin/env python3
"""
Podzbiory fontów strony (Shippori Mincho, Zen Kaku Gothic New — licencja SIL OFL 1.1).

Fonty japońskie mają 2–9 MB. Strona potrzebuje tylko alfabetu łacińskiego z polskimi znakami
i kilkudziesięciu znaków kanji, więc generujemy małe pliki WOFF2 zawierające wyłącznie te znaki.

Użycie (po dodaniu nowego znaku japońskiego w kodzie lub słownikach):
    pip install fonttools brotli
    python3 scripts/subset-fonts.py <katalog z plikami .ttf z github.com/google/fonts>

Pliki źródłowe: ofl/shipporimincho/ShipporiMincho-{Regular,Medium}.ttf
                ofl/zenkakugothicnew/ZenKakuGothicNew-{Regular,Medium}.ttf
Wynik: src/app/fonts/*.woff2 oraz src/app/fonts/glyphs.json (lista znaków japońskich, sprawdzana w testach).
"""
import json
import pathlib
import sys

from fontTools import subset

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
OUT = ROOT / "src" / "app" / "fonts"

# Łacina podstawowa i rozszerzona A (polskie znaki, ō), interpunkcja typograficzna, waluty, strzałki.
LATIN = [
    *range(0x0020, 0x007F), *range(0x00A0, 0x0100), *range(0x0100, 0x0180),
    *range(0x2000, 0x206F), 0x20AC, 0x2122, *range(0x2190, 0x2194), 0x2212, 0x2215, 0xFEFF, 0xFFFD,
]


def is_japanese(ch: str) -> bool:
    cp = ord(ch)
    return 0x3000 <= cp <= 0x30FF or 0x3400 <= cp <= 0x9FFF or 0xF900 <= cp <= 0xFAFF or 0xFF00 <= cp <= 0xFFEF


def collect_japanese() -> list[str]:
    chars: set[str] = set()
    for path in SRC.rglob("*"):
        if path.suffix in {".ts", ".tsx", ".css"}:
            chars.update(ch for ch in path.read_text(encoding="utf-8") if is_japanese(ch))
    return sorted(chars)


FONTS = [
    ("ShipporiMincho-Regular.ttf", "shippori-mincho-400.woff2", True),
    ("ShipporiMincho-Medium.ttf", "shippori-mincho-500.woff2", True),
    ("ZenKakuGothicNew-Regular.ttf", "zen-kaku-gothic-400.woff2", False),
    ("ZenKakuGothicNew-Medium.ttf", "zen-kaku-gothic-500.woff2", False),
]


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    source_dir = pathlib.Path(sys.argv[1])
    japanese = collect_japanese()
    OUT.mkdir(parents=True, exist_ok=True)
    for source, target, with_japanese in FONTS:
        options = subset.Options()
        options.flavor = "woff2"
        options.hinting = False
        options.desubroutinize = True
        options.layout_features = ["kern", "liga", "calt", "palt", "vert", "vrt2", "vkna"]
        options.name_IDs = ["*"]
        options.notdef_outline = True
        font = subset.load_font(str(source_dir / source), options)
        subsetter = subset.Subsetter(options)
        unicodes = LATIN + ([ord(ch) for ch in japanese] if with_japanese else [])
        subsetter.populate(unicodes=unicodes)
        subsetter.subset(font)
        subset.save_font(font, str(OUT / target), options)
        print(f"{target}: {(OUT / target).stat().st_size / 1024:.1f} KB")
    (OUT / "glyphs.json").write_text(json.dumps({"japanese": "".join(japanese)}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Japanese characters: {len(japanese)} — {''.join(japanese)}")


if __name__ == "__main__":
    main()
