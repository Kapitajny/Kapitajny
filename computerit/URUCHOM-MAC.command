#!/bin/bash
# ComputerIT – uruchamianie strony (macOS / Linux). Dwuklik w Finderze albo: ./URUCHOM-MAC.command
cd "$(dirname "$0")" || exit 1

echo
echo " ComputerIT - uruchamianie strony"
echo " --------------------------------"

open_url() { if command -v open >/dev/null; then open "$1"; elif command -v xdg-open >/dev/null; then xdg-open "$1" >/dev/null 2>&1; fi; }
fail() { echo; echo " Wystąpił błąd. Skopiuj komunikat powyżej i wyślij go Claude."; read -r -p " Naciśnij Enter, aby zamknąć..."; exit 1; }

if ! command -v node >/dev/null; then
  echo " Nie znaleziono Node.js. Zainstaluj wersję LTS ze strony https://nodejs.org i uruchom ten plik ponownie."
  open_url https://nodejs.org
  fail
fi

if ! node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)"; then
  echo " Masz za starą wersję Node.js ($(node -v)). Zainstaluj aktualną wersję LTS ze strony https://nodejs.org"
  open_url https://nodejs.org
  fail
fi

if [ ! -d node_modules ]; then
  echo " Instaluję pakiety – za pierwszym razem może to potrwać kilka minut..."
  npm install || fail
fi

export NEXT_PUBLIC_SITE_URL=http://localhost:3000
echo " Przygotowuję stronę..."
npm run build || fail

echo
echo " Strona działa pod adresem: http://localhost:3000"
echo " Aby ją wyłączyć, zamknij to okno (albo naciśnij Ctrl + C)."
echo
(sleep 4 && open_url http://localhost:3000) &
npm start
