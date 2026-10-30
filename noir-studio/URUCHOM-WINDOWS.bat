@echo off
chcp 65001 >nul
title NOIR STUDIO
cd /d "%~dp0"

echo.
echo  NOIR STUDIO - uruchamianie strony
echo  ---------------------------------

where node >nul 2>nul
if errorlevel 1 (
  echo  Nie znaleziono Node.js. Zainstaluj wersje LTS ze strony https://nodejs.org
  echo  i uruchom ten plik ponownie.
  start "" https://nodejs.org
  pause
  exit /b 1
)

node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)"
if errorlevel 1 (
  echo  Masz za stara wersje Node.js. Zainstaluj aktualna wersje LTS ze strony https://nodejs.org
  start "" https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo  Instaluje pakiety - za pierwszym razem moze to potrwac kilka minut...
  call npm install
  if errorlevel 1 goto error
)

set NEXT_PUBLIC_SITE_URL=http://localhost:3100
echo  Przygotowuje strone...
call npm run build
if errorlevel 1 goto error

echo.
echo  Strona dziala pod adresem: http://localhost:3100
echo  Aby ja wylaczyc, zamknij to okno.
echo.
start "" cmd /c "timeout /t 4 >nul & start http://localhost:3100"
call npm start
goto :eof

:error
echo.
echo  Wystapil blad. Skopiuj komunikat powyzej i wyslij go Claude.
pause
exit /b 1
