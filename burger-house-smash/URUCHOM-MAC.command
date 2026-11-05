#!/bin/bash
cd "$(dirname "$0")" || exit 1
echo ""
echo " BUŁA burger house – uruchamianie koncepcji Smash"
echo " ---------------------------------------"
if ! command -v node >/dev/null 2>&1; then
  echo " Nie znaleziono Node.js. Zainstaluj wersję LTS ze strony https://nodejs.org"
  open "https://nodejs.org"
  read -r -p " Naciśnij Enter, aby zamknąć..."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo " Instaluję pakiety – za pierwszym razem może to potrwać kilka minut..."
  npm install || { read -r -p " Błąd instalacji. Enter, aby zamknąć..."; exit 1; }
fi
export NEXT_PUBLIC_SITE_URL=http://localhost:3004
echo " Przygotowuję stronę..."
npm run build || { read -r -p " Błąd budowania. Enter, aby zamknąć..."; exit 1; }
( sleep 4; open "http://localhost:3004" ) &
echo ""
echo " Strona działa pod adresem: http://localhost:3004"
echo " Aby ją wyłączyć, zamknij to okno."
npx next start -p 3004
