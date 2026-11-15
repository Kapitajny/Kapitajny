#!/usr/bin/env bash
# Lokalne środowisko WordPress + WooCommerce dla ComputerIT (bez MySQL – baza SQLite).
# Skrypt jest idempotentny: pomija kroki już wykonane, niczego nie usuwa.
# Wymaga: PHP 8.1+ (pdo_sqlite), dostęp do wordpress.org i downloads.wordpress.org.
# Użycie (z katalogu computerit/):  tools/setup-wordpress.sh
set -euo pipefail
cd "$(dirname "$0")/.."

WP="bin/wp"
WP_DIR="wordpress"
SITE_URL="${SITE_URL:-http://localhost:8080}"
ADMIN_USER="${ADMIN_USER:-computerit-admin}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.test}"
CREDENTIALS="$WP_DIR/.admin-credentials"
THEME_SRC="themes/computerit-shop"

step() { printf '\n== %s\n' "$1"; }

# Instalacja wtyczki z oficjalnego repozytorium wordpress.org.
# Pobieramy ZIP przez curl (działa także za proxy bez DNS, np. w kontenerze chmurowym),
# a instaluje WP-CLI z pliku – to ten sam oficjalny pakiet co przy `wp plugin install <slug>`.
install_plugin() {
  local slug="$1" url tmp
  url="$(curl -sS -f "https://api.wordpress.org/plugins/info/1.2/?action=plugin_information&request%5Bslug%5D=$slug" \
    | php -r 'echo json_decode(stream_get_contents(STDIN), true)["download_link"] ?? "";')"
  [[ -n "$url" ]] || { echo "Nie znaleziono wtyczki $slug w repozytorium wordpress.org" >&2; return 1; }
  tmp="$(mktemp -d)"
  curl -sS -f -L -o "$tmp/$slug.zip" "$url"
  $WP plugin install "$tmp/$slug.zip" --activate
  rm -rf "$tmp"
}

# Polskie tłumaczenie wtyczki z oficjalnego API tłumaczeń wordpress.org.
install_plugin_translation() {
  local slug="$1" version url tmp
  version="$($WP plugin get "$slug" --field=version)"
  url="$(curl -sS -f "https://api.wordpress.org/translations/plugins/1.0/?slug=$slug&version=$version" \
    | php -r 'foreach (json_decode(stream_get_contents(STDIN), true)["translations"] ?? [] as $t) { if ($t["language"] === "pl_PL") { echo $t["package"]; break; } }')"
  [[ -n "$url" ]] || { echo "Brak polskiego tłumaczenia dla $slug $version"; return 0; }
  tmp="$(mktemp -d)"
  curl -sS -f -L -o "$tmp/pl.zip" "$url"
  mkdir -p "$WP_DIR/wp-content/languages/plugins"
  unzip -q -o "$tmp/pl.zip" -d "$WP_DIR/wp-content/languages/plugins/"
  rm -rf "$tmp"
  echo "Tłumaczenie pl_PL dla $slug zainstalowane."
}

step "WP-CLI"
if [[ ! -f bin/wp-cli.phar ]]; then
  curl -sS -f -L -o bin/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
  expected="$(curl -sS -f -L https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar.sha512)"
  echo "$expected  bin/wp-cli.phar" | sha512sum -c -
fi
$WP --version

step "Rdzeń WordPress (pl_PL)"
if [[ ! -f "$WP_DIR/wp-load.php" ]]; then
  $WP core download --locale=pl_PL
else
  echo "Już pobrany: $($WP core version)"
fi

step "Konfiguracja wp-config.php"
if [[ ! -f "$WP_DIR/wp-config.php" ]]; then
  # Dane MySQL są nieużywane – połączenie przejmuje wtyczka SQLite (db.php).
  $WP config create --dbname=computerit --dbuser=unused --dbpass=unused --skip-check --locale=pl_PL
  $WP config set WP_ENVIRONMENT_TYPE local
  $WP config set WP_DEBUG true --raw
  $WP config set WP_DEBUG_LOG true --raw
  $WP config set WP_DEBUG_DISPLAY false --raw
else
  echo "wp-config.php już istnieje – bez zmian."
fi

step "Baza SQLite (oficjalna wtyczka SQLite Database Integration)"
SQLITE_DIR="$WP_DIR/wp-content/plugins/sqlite-database-integration"
if [[ ! -d "$SQLITE_DIR" ]]; then
  tmp="$(mktemp -d)"
  curl -sS -f -L -o "$tmp/sqlite.zip" https://downloads.wordpress.org/plugin/sqlite-database-integration.latest-stable.zip
  unzip -q "$tmp/sqlite.zip" -d "$WP_DIR/wp-content/plugins/"
  rm -rf "$tmp"
fi
if [[ ! -f "$WP_DIR/wp-content/db.php" ]]; then
  # To samo, co robi activate.php wtyczki: podstawienie ścieżek w db.copy.
  abs_dir="$(cd "$SQLITE_DIR" && pwd)"
  sed -e "s#{SQLITE_IMPLEMENTATION_FOLDER_PATH}#$abs_dir#g" \
      -e "s#{SQLITE_PLUGIN}#sqlite-database-integration/load.php#g" \
      "$SQLITE_DIR/db.copy" > "$WP_DIR/wp-content/db.php"
  echo "Utworzono wp-content/db.php"
fi

step "Instalacja WordPress"
if ! $WP core is-installed 2>/dev/null; then
  if [[ ! -f "$CREDENTIALS" ]]; then
    umask 077
    printf 'Adres: %s/wp-admin/\nLogin: %s\nHasło: %s\n' "$SITE_URL" "$ADMIN_USER" "$(openssl rand -base64 18)" > "$CREDENTIALS"
  fi
  password="$(sed -n 's/^Hasło: //p' "$CREDENTIALS")"
  $WP core install --url="$SITE_URL" --title="Sklep ComputerIT (lokalny)" \
    --admin_user="$ADMIN_USER" --admin_password="$password" --admin_email="$ADMIN_EMAIL" --skip-email
  echo "Dane logowania zapisane w $CREDENTIALS (plik poza Git, tylko dla Ciebie)."
else
  echo "WordPress już zainstalowany."
fi
$WP plugin activate sqlite-database-integration >/dev/null 2>&1 || true
$WP option update blog_public 0 >/dev/null        # środowisko lokalne – bez indeksowania
$WP rewrite structure '/%postname%/' >/dev/null
$WP option update timezone_string 'Europe/Warsaw' >/dev/null

step "WooCommerce (oficjalne repozytorium wordpress.org)"
if ! $WP plugin is-installed woocommerce; then
  install_plugin woocommerce
else
  $WP plugin is-active woocommerce || $WP plugin activate woocommerce
  echo "WooCommerce już zainstalowany: $($WP plugin get woocommerce --field=version)"
fi
install_plugin_translation woocommerce

step "Motyw ComputerIT Shop"
if [[ -d "$THEME_SRC" ]]; then
  target="$WP_DIR/wp-content/themes/computerit-shop"
  [[ -e "$target" ]] || ln -s "$(pwd)/$THEME_SRC" "$target"
  $WP theme activate computerit-shop
else
  echo "Brak $THEME_SRC – pozostaje motyw domyślny."
fi

step "Ustawienia sklepu (Polska, PLN)"
$WP option update woocommerce_default_country 'PL' >/dev/null
$WP option update woocommerce_currency 'PLN' >/dev/null
$WP option update woocommerce_currency_pos 'right_space' >/dev/null
$WP option update woocommerce_price_thousand_sep ' ' >/dev/null
$WP option update woocommerce_price_decimal_sep ',' >/dev/null
$WP option update woocommerce_price_num_decimals '2' >/dev/null
$WP option update woocommerce_calc_taxes 'yes' >/dev/null
$WP option update woocommerce_prices_include_tax 'yes' >/dev/null
$WP option update woocommerce_coming_soon 'no' >/dev/null          # sklep widoczny lokalnie
$WP option update woocommerce_onboarding_profile '{"skipped":true}' --format=json >/dev/null
$WP wc tool run install_pages --user=1 >/dev/null
# Lokalnie włączamy wbudowany „Przelew bankowy”, aby dało się złożyć zamówienie testowe.
# Docelową bramkę płatności (np. Przelewy24, PayU) wybiera i konfiguruje właściciel sklepu.
if [[ "$($WP option pluck woocommerce_bacs_settings enabled 2>/dev/null || true)" != "yes" ]]; then
  $WP option update woocommerce_bacs_settings \
    '{"enabled":"yes","title":"Przelew bankowy","description":"Dane do przelewu otrzymasz w potwierdzeniu zamówienia."}' \
    --format=json >/dev/null
fi
# Polskie tytuły i adresy stron sklepu (ID z ustawień WooCommerce, więc działa także przy ponownym uruchomieniu).
rename_page() {
  local option="$1" title="$2" slug="$3" id
  id="$($WP option get "$option" 2>/dev/null || true)"
  if [[ -n "$id" && "$id" != "0" ]]; then
    $WP eval-file tools/rename-page.php "$id" "$title" "$slug" >/dev/null
  fi
}
rename_page woocommerce_shop_page_id "Sklep" "sklep"
rename_page woocommerce_cart_page_id "Koszyk" "koszyk"
rename_page woocommerce_checkout_page_id "Zamówienie" "zamowienie"
rename_page woocommerce_myaccount_page_id "Moje konto" "moje-konto"
rename_page woocommerce_refund_returns_page_id "Zwroty i reklamacje" "zwroty-i-reklamacje"
# Polskie bazy adresów produktów i kategorii (WooCommerce zapisuje je przy instalacji, zanim wczyta tłumaczenie).
$WP option update woocommerce_permalinks \
  '{"product_base":"produkt","category_base":"kategoria-produktu","tag_base":"tag-produktu","attribute_base":"","use_verbose_page_rules":false}' \
  --format=json >/dev/null
# Polskie końcówki adresów (WooCommerce → Ustawienia → Zaawansowane → Końcówki stron).
while read -r option value; do
  $WP option update "$option" "$value" >/dev/null
done <<'ENDPOINTS'
woocommerce_checkout_pay_endpoint zaplac
woocommerce_checkout_order_received_endpoint zamowienie-przyjete
woocommerce_myaccount_add_payment_method_endpoint dodaj-metode-platnosci
woocommerce_myaccount_orders_endpoint zamowienia
woocommerce_myaccount_view_order_endpoint szczegoly-zamowienia
woocommerce_myaccount_downloads_endpoint pliki
woocommerce_myaccount_edit_account_endpoint edytuj-konto
woocommerce_myaccount_edit_address_endpoint adresy
woocommerce_myaccount_payment_methods_endpoint metody-platnosci
woocommerce_myaccount_lost_password_endpoint odzyskaj-haslo
woocommerce_logout_endpoint wyloguj
ENDPOINTS
$WP rewrite flush >/dev/null
echo "Strony WooCommerce: $($WP post list --post_type=page --field=post_title | tr '\n' ',' | sed 's/,$//')"

step "Strony informacyjne i prawne (szkielety do uzupełnienia)"
# Tworzymy tylko brakujące strony. Treść prawną musi przygotować właściciel sklepu lub prawnik.
legal_page() { # tytuł, slug -> wypisuje ID
  local id
  id="$($WP post list --post_type=page --name="$2" --field=ID --post_status=any)"
  if [[ -z "$id" ]]; then
    id="$($WP post create --post_type=page --post_status=publish --post_title="$1" --post_name="$2" \
      --page_template=page-legal --porcelain \
      --post_content='<!-- wp:paragraph --><p><strong>Do uzupełnienia.</strong> Treść tej strony musi przygotować właściciel sklepu (najlepiej z prawnikiem).</p><!-- /wp:paragraph -->')"
  fi
  echo "$id"
}
terms_id="$(legal_page "Regulamin sklepu" "regulamin")"
legal_page "Dostawa i płatności" "dostawa-i-platnosci" >/dev/null
$WP option update woocommerce_terms_page_id "$terms_id" >/dev/null
# Polityka prywatności: szkic z WordPressa publikujemy tylko lokalnie, żeby link w stopce działał.
privacy_id="$($WP option get wp_page_for_privacy_policy)"
if [[ "$privacy_id" != "0" && "$($WP post get "$privacy_id" --field=post_status)" == "draft" ]]; then
  $WP post update "$privacy_id" --post_status=publish >/dev/null
fi
echo "Strony prawne: regulamin (ID $terms_id), dostawa i płatności, polityka prywatności – treść do uzupełnienia."

step "Produkty demonstracyjne"
if [[ "$($WP wc product list --user=1 --format=count 2>/dev/null || echo 0)" == "0" ]]; then
  cat_id() { $WP wc product_cat create --user=1 --name="$1" --porcelain; }
  laptopy="$(cat_id "Laptopy")"; monitory="$(cat_id "Monitory")"; akcesoria="$(cat_id "Akcesoria")"
  add_product() { # nazwa, cena, cena promocyjna (lub pusta), kategoria, krótki opis
    $WP wc product create --user=1 --name="$1" --type=simple --regular_price="$2" ${3:+--sale_price="$3"} \
      --categories="[{\"id\":$4}]" --short_description="$5" \
      --description="Produkt demonstracyjny środowiska ComputerIT – dane przykładowe." \
      --manage_stock=true --stock_quantity=12 --porcelain >/dev/null
  }
  add_product "Laptop biznesowy 14\"" 3499 3299 "$laptopy" "14 cali, 16 GB RAM, dysk SSD 512 GB."
  add_product "Ultrabook 13\"" 4299 "" "$laptopy" "Lekka obudowa, 1,1 kg, do 14 godzin pracy."
  add_product "Monitor 27\" QHD" 1199 "" "$monitory" "Matryca IPS, 2560 × 1440, regulacja wysokości."
  add_product "Monitor 24\" Full HD" 699 649 "$monitory" "Matryca IPS, 1920 × 1080, cienkie ramki."
  add_product "Mysz bezprzewodowa" 129 "" "$akcesoria" "Łączność Bluetooth i 2,4 GHz, cicha praca."
  add_product "Klawiatura mechaniczna" 349 "" "$akcesoria" "Przełączniki liniowe, polski układ klawiszy."
  echo "Dodano 6 produktów w 3 kategoriach."
else
  echo "Sklep ma już produkty – pomijam."
fi

step "Gotowe"
echo "Uruchom serwer:  bin/wp server --host=127.0.0.1 --port=8080"
echo "Sklep:           $SITE_URL/sklep/"
echo "Panel:           $SITE_URL/wp-admin/  (dane w $CREDENTIALS)"
