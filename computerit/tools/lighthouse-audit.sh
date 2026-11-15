#!/usr/bin/env bash
# Audyt Lighthouse: raport HTML + JSON i podsumowanie z listą problemów.
# Użycie: tools/lighthouse-audit.sh <url> [mobile|desktop] [katalog-raportów]
# Przykłady:
#   tools/lighthouse-audit.sh http://localhost:8080/
#   tools/lighthouse-audit.sh https://example.com/ desktop
set -euo pipefail

URL="${1:?Podaj adres strony, np. http://localhost:8080/}"
PRESET="${2:-mobile}"
OUT_DIR="${3:-reports/lighthouse}"

if ! command -v lighthouse >/dev/null 2>&1; then
  echo "Brak Lighthouse. Zainstaluj: npm install -g lighthouse" >&2
  exit 1
fi
if [[ "$PRESET" != "mobile" && "$PRESET" != "desktop" ]]; then
  echo "Drugi argument to mobile albo desktop (podano: $PRESET)" >&2
  exit 1
fi

STAMP="$(date +%Y%m%d-%H%M%S)"
NAME="$(printf '%s' "$URL" | sed -E 's#^https?://##; s#[^A-Za-z0-9]+#-#g; s#-+$##')"
BASE="$OUT_DIR/$NAME-$PRESET-$STAMP"
mkdir -p "$OUT_DIR"

FLAGS=(
  --output=html --output=json --output-path="$BASE"
  --only-categories=performance,accessibility,best-practices,seo
  --chrome-flags="--headless=new --no-sandbox"
  --quiet
)
[[ "$PRESET" == "desktop" ]] && FLAGS+=(--preset=desktop)
# Własna przeglądarka: CHROME_PATH=/ścieżka/do/chrome tools/lighthouse-audit.sh ...

lighthouse "$URL" "${FLAGS[@]}"

echo "Raport HTML: $BASE.report.html"
echo "Raport JSON: $BASE.report.json"
node "$(dirname "$0")/lighthouse-summary.mjs" "$BASE.report.json"
