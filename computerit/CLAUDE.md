# ComputerIT – zasady pracy dla Claude Code

Środowisko deweloperskie sklepów WordPress + WooCommerce agencji ComputerIT.
Odpowiadaj i komentuj kod **po polsku**.

## Dokumentacja przed kodem (Context7)

Zanim napiszesz lub zmienisz kod WordPress / WooCommerce / Lighthouse, pobierz aktualną
dokumentację przez serwer MCP **Context7** (`resolve-library-id`, potem `query-docs`).
Nie polegaj na pamięci – API WordPressa i WooCommerce zmieniają się między wersjami.

| Temat | Identyfikator biblioteki Context7 |
| --- | --- |
| Funkcje WordPress | `/websites/developer_wordpress_reference_functions` |
| Klasy WordPress | `/websites/developer_wordpress_reference_classes` |
| Hooki WordPress | `/websites/developer_wordpress_reference_hooks` |
| WooCommerce (deweloperzy) | `/websites/developer_woocommerce` |
| WooCommerce (dokumentacja sklepu) | `/websites/woocommerce_document` |
| Lighthouse | `/googlechrome/lighthouse` |

Test połączenia: `python3 tools/check-context7.py`.

## Zasady techniczne

- **Nigdy nie modyfikuj rdzenia WordPress ani plików WooCommerce** (`wordpress/wp-admin`,
  `wordpress/wp-includes`, `wp-content/plugins/woocommerce`). Zmiany wyłącznie w motywie
  (`themes/computerit-shop` lub motyw potomny) i przez hooki / filtry / szablony blokowe.
- Szablony WooCommerce nadpisujemy plikiem o tej samej nazwie w `themes/computerit-shop/templates/`
  (np. `single-product.html`, `archive-product.html`, `page-cart.html`, `page-checkout.html`).
  Kategorie i tagi produktów korzystają z `archive-product.html`.
- Kolory, odstępy i typografia – tylko przez `theme.json` (tokeny), nie wpisuj wartości na sztywno.
- Teksty w motywie tłumaczalne: domena `computerit-shop`, `esc_html__()` / `esc_attr__()`.
- Dostępność: WCAG 2.2 AA – widoczny fokus, kontrast ≥ 4,5:1, obsługa klawiaturą,
  brak poziomego przewijania od 320 px.
- Po każdej zmianie motywu: `tools/check-environment.sh` i audyt Lighthouse
  (`tools/lighthouse-audit.sh <adres> mobile`).

## Bezpieczeństwo (wymagania ComputerIT – obowiązują zawsze)

- Nie ujawniaj haseł, kluczy API ani danych dostępowych.
- Nie zapisuj sekretów w repozytorium Git.
- Nie instaluj przypadkowych rozszerzeń.
- Nie modyfikuj istniejących stron produkcyjnych bez zgody właściciela.
- Przed zmianami wykonaj kopię zapasową, jeżeli pracujesz na istniejącym WordPressie
  (`bin/wp db export` + kopia `wp-content`).
- Nie usuwaj istniejących plików ani konfiguracji.

Dane logowania lokalnego panelu są w `wordpress/.admin-credentials` (poza Gitem) – nie wypisuj ich.

## Polecenia

```bash
tools/setup-wordpress.sh                         # instalacja / naprawa środowiska (idempotentna)
bin/wp server --host=127.0.0.1 --port=8080       # serwer lokalny
tools/check-environment.sh                       # stan wszystkich narzędzi (tylko odczyt)
tools/lighthouse-audit.sh <adres> [mobile|desktop]   # raport HTML + JSON + podsumowanie
bin/wp <polecenie>                               # WP-CLI dla lokalnej instalacji
```
