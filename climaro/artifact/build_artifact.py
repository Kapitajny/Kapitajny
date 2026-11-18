"""Zamienia statyczny eksport Next.js (climaro/out) w pliki artefaktu: strona główna jako fragment HTML,
podstrony jako pełne dokumenty, zdjęcia WebP, bez skryptów Next.js – zamiast nich site.js."""
import re
import subprocess
import sys
from pathlib import Path

OUT = Path(sys.argv[1])  # climaro/out
DEST = Path(sys.argv[2])  # katalog artefaktu
SRC = Path(__file__).parent
DEST.mkdir(parents=True, exist_ok=True)
(DEST / "images").mkdir(exist_ok=True)

site_js = (SRC / "site.js").read_text()

FONTS = (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=swap">'
)

# Poprawki dla ramki artefaktu: krój z Google Fonts, przyklejony nagłówek pod paskiem systemowym telefonu.
EXTRA_CSS = """
:root{--font-archivo:"Archivo","Helvetica Neue",Arial,sans-serif}
body>header{top:env(safe-area-inset-top,0px)}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:60;background:#080909}
"""

PAGES = {
    "index": "./",
    "uslugi": "uslugi.html",
    "o-nas": "o-nas.html",
    "kontakt": "kontakt.html",
    "polityka-prywatnosci": "polityka-prywatnosci.html",
}


def rewrite_links(html: str) -> str:
    html = re.sub(r'href="/kontakt\?usluga=([a-z-]+)"', r'href="kontakt.html#usluga-\1"', html)
    for slug, target in PAGES.items():
        if slug == "index":
            continue
        html = re.sub(rf'href="/{slug}(#[^"]*)?"', lambda m, t=target: f'href="{t}{m.group(1) or ""}"', html)
    html = html.replace('href="/"', 'href="./"')
    # Zdjęcia: /images/nazwa.jpg -> images/nazwa.webp (także w srcset)
    html = re.sub(r"/images/([a-z0-9-]+)\.jpg", r"images/\1.webp", html)
    return html


def clean(html: str) -> tuple[str, str, str]:
    """Zwraca (style, ciało strony, json-ld)."""
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body[^>]*>(.*)</body>", html, re.S).group(1)
    styles = "".join(re.findall(r"<style[^>]*>.*?</style>", head + body, re.S))
    # Kroje Next.js (pliki /_next) zastępuje Google Fonts.
    styles = re.sub(r"@font-face\{[^}]*?/_next/[^}]*\}", "", styles)
    jsonld = "".join(re.findall(r'<script type="application/ld\+json">.*?</script>', body, re.S))
    body = re.sub(r"<style[^>]*>.*?</style>", "", body, flags=re.S)
    body = re.sub(r"<script\b[^>]*>.*?</script>", "", body, flags=re.S)
    body = re.sub(r"<link\b[^>]*>", "", body)
    body = re.sub(r"<!--.*?-->", "", body, flags=re.S)
    return styles, body.strip(), jsonld


for slug in PAGES:
    source = OUT / f"{slug}.html"
    html = rewrite_links(source.read_text())
    styles, body, jsonld = clean(html)
    title = "CLIMARO" if slug == "index" else re.search(r"<title>(.*?)</title>", html).group(1)
    script = f"<script>{site_js}</script>"
    style_block = styles + f"<style>{EXTRA_CSS}</style>"
    if slug == "index":
        # Strona główna artefaktu: fragment – szkielet dokumentu dokłada platforma.
        page = f"<title>{title}</title>\n{FONTS}\n{style_block}\n{body}\n{jsonld}\n{script}\n"
        (DEST / "climaro.html").write_text(page)
    else:
        page = (
            '<!doctype html>\n<html lang="pl">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<meta name="robots" content="noindex, nofollow">\n<title>{title}</title>\n{FONTS}\n{style_block}\n</head>\n'
            f"<body>\n{body}\n{script}\n</body>\n</html>\n"
        )
        (DEST / f"{slug}.html").write_text(page)

# Zdjęcia: WebP o rozsądnej szerokości (hero 2000 px, reszta 1600 px).
for jpg in sorted((OUT / "images").glob("*.jpg")):
    width = 2000 if jpg.stem.startswith("hero-dom-pompa-ciepla") and "pion" not in jpg.stem else 1600
    target = DEST / "images" / f"{jpg.stem}.webp"
    subprocess.run(["convert", str(jpg), "-resize", f"{width}x>", "-quality", "80", str(target)], check=True)

for f in sorted(DEST.rglob("*")):
    if f.is_file():
        print(f"{f.relative_to(DEST)}\t{f.stat().st_size // 1024} KB")
