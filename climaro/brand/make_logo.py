"""Generuje pliki SVG logo CLIMARO z konturami liter (bez zależności od czcionek).

Użycie: python3 brand/make_logo.py public/brand
Wymaga plików brand/wordmark.ttf i brand/tagline.ttf (krój Archivo, licencja OFL) – zob. README.md.
"""
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HERE = Path(__file__).parent
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)

ORANGE = "#FF7900"
WHITE = "#F5F5F5"
GRAPHITE = "#111315"
STEEL_ON_DARK = "#92989D"
STEEL_ON_LIGHT = "#4A5056"


def text_path(font_file, text, cap_height, x, baseline, tracking_em=0.0, target_width=None):
    font = TTFont(font_file)
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    cap = font["OS/2"].sCapHeight or 0.7 * upm
    scale = cap_height / cap
    names = [cmap[ord(ch)] for ch in text]
    advances = [glyph_set[n].width for n in names]
    natural = sum(advances) * scale
    gaps = len(names) - 1
    if target_width is not None:
        tracking = (target_width - natural) / gaps
    else:
        tracking = tracking_em * upm * scale
    pen = SVGPathPen(glyph_set)
    cursor = x
    for name, adv in zip(names, advances):
        tpen = TransformPen(pen, (scale, 0, 0, -scale, cursor, baseline))
        glyph_set[name].draw(tpen)
        cursor += adv * scale + tracking
    width = cursor - tracking - x
    return pen.getCommands(), width


def symbol(arc, bars, dx=0.0, dy=0.0):
    # Łuk C: środek (24,24), promień 16, grubość 8, otwarty w prawo (±42°).
    # Lamele: trzy poziome strugi powietrza wychodzące z otworu.
    return (
        f'<g transform="translate({dx} {dy})">'
        f'<path d="M35.89 13.29A16 16 0 1 0 35.89 34.71" fill="none" stroke="{arc}" stroke-width="8"/>'
        f'<rect x="27" y="15.2" width="13" height="3.6" fill="{bars}"/>'
        f'<rect x="27" y="22.2" width="19" height="3.6" fill="{bars}"/>'
        f'<rect x="27" y="29.2" width="13" height="3.6" fill="{bars}"/>'
        "</g>"
    )


WORD_X = 60
word_d, word_w = text_path(HERE / "wordmark.ttf", "CLIMARO", 21, WORD_X, 27, tracking_em=0.06)
tag_d, tag_w = text_path(HERE / "tagline.ttf", "KLIMATYZACJA · POMPY CIEPŁA · REKUPERACJA", 5.2, WORD_X + 0.6, 41.5, target_width=word_w - 1.2)
total_w = round(WORD_X + word_w + 2, 2)


def full_logo(arc, bars, word, tag, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 {total_w - 2} 44" role="img" aria-labelledby="t">'
        f'<title id="t">{title}</title>'
        + symbol(arc, bars)
        + f'<path d="{word_d}" fill="{word}"/>'
        + f'<path d="{tag_d}" fill="{tag}"/>'
        + "</svg>\n"
    )


TITLE = "CLIMARO – klimatyzacja, pompy ciepła, rekuperacja"
(OUT / "climaro-logo-dark.svg").write_text(full_logo(ORANGE, WHITE, WHITE, STEEL_ON_DARK, TITLE))
(OUT / "climaro-logo-light.svg").write_text(full_logo(ORANGE, GRAPHITE, GRAPHITE, STEEL_ON_LIGHT, TITLE))
(OUT / "climaro-symbol.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 46 44" role="img" aria-label="CLIMARO">'
    + symbol(ORANGE, GRAPHITE)
    + "</svg>\n"
)
(OUT / "climaro-symbol-mono.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 46 44" role="img" aria-label="CLIMARO">'
    + symbol("currentColor", "currentColor")
    + "</svg>\n"
)
# Ikona aplikacji / favicon: symbol na kwadratowym polu w głębokiej czerni.
(OUT / "climaro-app-icon.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
    '<rect width="64" height="64" rx="10" fill="#080909"/>'
    + symbol(ORANGE, WHITE, dx=7, dy=8)
    + "</svg>\n"
)
# Same kontury do użycia w komponencie React.
(HERE / "paths.txt").write_text(f"WORD {word_d}\nTAG {tag_d}\nTOTAL_W {total_w}\n")
print("wordmark width", round(word_w, 2), "tagline width", round(tag_w, 2), "total", total_w)
