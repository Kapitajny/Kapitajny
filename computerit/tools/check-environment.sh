#!/usr/bin/env bash
# Przegląd stanu narzędzi ComputerIT. Tylko odczyt – niczego nie instaluje ani nie zmienia.
# Użycie (z katalogu computerit/): tools/check-environment.sh
cd "$(dirname "$0")/.."
pass=0; fail=0
check() { # opis, polecenie
  local out
  if out="$(eval "$2" 2>&1)"; then
    printf '  OK    %-28s %s\n' "$1" "$(head -1 <<<"$out")"; pass=$((pass + 1))
  else
    printf '  BRAK  %-28s %s\n' "$1" "$(head -1 <<<"$out")"; fail=$((fail + 1))
  fi
}
chrome_bin() { command -v google-chrome || command -v chromium || command -v chromium-browser; }

echo "Narzędzia systemowe"
check "Node.js (>= 18)" "node -e 'process.exit(parseInt(process.versions.node) < 18 ? 1 : 0)' && node --version"
check "npm" 'npm --version'
check "Chrome / Chromium" '"$(chrome_bin)" --version'
check "Lighthouse CLI" 'lighthouse --version'
check "PHP + pdo_sqlite" 'php -m | grep -qx pdo_sqlite && php -r "echo PHP_VERSION;"'
check "WP-CLI" 'bin/wp --version'

echo "Claude Code + Context7"
check "Context7 w .mcp.json" 'grep -q "mcp.context7.com" ../.mcp.json && echo "../.mcp.json"'
check "Context7 zatwierdzony" 'command -v claude >/dev/null && claude mcp list 2>/dev/null | grep -i "context7.*connected"'
check "Context7 zwraca dokumentację" 'python3 tools/check-context7.py >/tmp/computerit-c7.log && tail -1 /tmp/computerit-c7.log'

echo "WordPress + WooCommerce (lokalnie)"
check "WordPress zainstalowany" 'bin/wp core is-installed && echo "WordPress $(bin/wp core version)"'
check "WooCommerce aktywny" 'bin/wp plugin is-active woocommerce && echo "WooCommerce $(bin/wp plugin get woocommerce --field=version)"'
check "Motyw computerit-shop" 'bin/wp theme is-active computerit-shop && echo aktywny'
url="$(sed -n 's/^url: *//p' wp-cli.yml)"
check "Serwer HTTP ($url)" 'curl -fsS --noproxy "*" -o /dev/null -w "%{http_code}" "$url/sklep/"'
check "Store API (produkty)" 'curl -fsS --noproxy "*" "$url/wp-json/wc/store/v1/products" | php -r "echo count(json_decode(stream_get_contents(STDIN))), \" produktów\";"'

echo
echo "Wynik: $pass OK, $fail do poprawy."
[[ $fail -eq 0 ]]
