# ComputerIT – środowisko WordPress + WooCommerce

Lokalne środowisko do budowy sklepów WooCommerce: WordPress (pl_PL) na SQLite, WP-CLI,
własny motyw blokowy `computerit-shop`, audyty Lighthouse i dokumentacja przez Context7 w Claude Code.

## Szybki start

```bash
cd computerit
tools/setup-wordpress.sh                       # pobiera i konfiguruje wszystko (idempotentnie)
bin/wp server --host=127.0.0.1 --port=8080     # http://localhost:8080/sklep/
tools/check-environment.sh                     # 14 testów stanu narzędzi
```

Dane logowania do panelu: `wordpress/.admin-credentials` (plik tworzony lokalnie, poza Gitem).

Wymagania: PHP 8.1+ z `pdo_sqlite`, `curl`, `unzip`, `openssl`; do audytów Node.js 18+, Chrome
oraz `npm install -g lighthouse`.

## Struktura

| Ścieżka | Zawartość |
| --- | --- |
| `themes/computerit-shop/` | Motyw blokowy zgodny z WooCommerce (w Gicie, podlinkowany do WordPressa) |
| `tools/setup-wordpress.sh` | Instalacja WP + SQLite + WooCommerce (oficjalne pakiety wordpress.org) |
| `tools/lighthouse-audit.sh` | Audyt Lighthouse → raport HTML + JSON + podsumowanie problemów |
| `tools/check-environment.sh` | Kontrola wszystkich narzędzi (tylko odczyt) |
| `tools/check-context7.py` | Test serwera MCP Context7 |
| `docs/audyt-lighthouse.md` | Wyniki audytów i rekomendacje |
| `wordpress/`, `reports/`, `bin/wp-cli.phar` | Generowane lokalnie – poza Gitem |
| `../.mcp.json` | Konfiguracja serwera MCP Context7 dla Claude Code (bez kluczy) |

## Motyw `computerit-shop`

Motyw blokowy (theme.json v3), bez zmian w rdzeniu WordPressa i WooCommerce.

| Widok | Szablon |
| --- | --- |
| Strona główna sklepu | `templates/front-page.html` + wzorce `store-hero`, `store-benefits` |
| Lista produktów, kategorie, tagi | `templates/archive-product.html` |
| Karta produktu | `templates/single-product.html` |
| Koszyk | `templates/page-cart.html` |
| Zamówienie | `templates/page-checkout.html` + `parts/checkout-header.html` |
| Konto klienta, potwierdzenie, wyniki wyszukiwania | domyślne szablony WooCommerce + `page.html` |
| Regulamin, dostawa, polityka prywatności | szablon „Strona regulaminowa” (`page-legal.html`) |

Przetestowane: ścieżka zakupu (produkt → koszyk → zamówienie → potwierdzenie) na 390 px
i 1366 px, brak błędów JS i PHP, brak poziomego przewijania, Lighthouse Accessibility 100.

## Przed uruchomieniem sklepu produkcyjnego

- Treść regulaminu, polityki prywatności oraz strony dostaw i płatności (strony są szkieletami).
- Bramka płatności (np. Przelewy24, PayU) – lokalnie włączony jest tylko „Przelew bankowy”.
- Wysyłka e-maili (SMTP) – lokalny serwer nie wysyła poczty.
- Włączenie indeksowania, kompresja i cache na serwerze – szczegóły w `docs/audyt-lighthouse.md`.
