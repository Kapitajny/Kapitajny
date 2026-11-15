# Audyt Lighthouse – wyniki i rekomendacje (15.11.2026)

Lighthouse 13.6.0, Chrome for Testing 153, profil mobilny (symulowane 4G, wolny CPU) i desktopowy.
Pełne raporty HTML/JSON powstają w `reports/lighthouse/` (poza Gitem – generuj ponownie
`tools/lighthouse-audit.sh`).

## Wyniki

| Strona | Profil | Wydajność | Dostępność | Dobre praktyki | SEO |
| --- | --- | --- | --- | --- | --- |
| Sklep lokalny `/sklep/` (przed poprawką) | mobile | 67 | 96 | 100 | 58 |
| Sklep lokalny `/sklep/` (po poprawce) | mobile | 68 | **100** | 100 | 58* |
| Sklep lokalny `/sklep/` | desktop | 98 | 100 | 100 | 58* |
| Karta produktu `/produkt/laptop-biznesowy-14/` | mobile | 67 | 97 → 100 | 100 | 61* |
| CLIMARO (eksport statyczny, `serve`) | mobile | 74 | 100 | 100 | 69* |
| wordpress.org (strona produkcyjna – próbka) | mobile | 98 | 100 | 96 | 100 |

\* Strony lokalne są celowo wyłączone z indeksowania (`noindex`) – to obniża SEO o ok. 40 pkt
i **nie jest błędem**. Na produkcji trzeba to wyłączyć (Ustawienia → Czytanie).

## Problemy i konkretne poprawki

### Naprawione w motywie

1. **Dostępność – `aria-hidden-focus` (waga 7).** Zamknięta szuflada mini-koszyka WooCommerce
   11.3 ma `aria-hidden="true"`, ale zawiera aktywne przyciski. Rozwiązanie bez zmian w WooCommerce:
   `themes/computerit-shop/assets/js/mini-cart-inert.js` ustawia `inert` na zamkniętej szufladzie.
   Wynik dostępności: 96 → 100. Przetestowane: otwieranie, fokus w szufladzie, zamykanie Esc.
2. **Poziome przewijanie na telefonie (36 px).** Rząd wyszukiwarka + konto + koszyk nie mieścił się
   w 390 px. Poprawka w `assets/css/theme.css` (wyszukiwarka się zwęża).

### Do wdrożenia na serwerze produkcyjnym (nie dotyczą kodu motywu)

3. **Brak kompresji (oszczędność ~100 KiB HTML, ok. 70% CSS/JS).** Lokalny `wp server`
   (wbudowany serwer PHP) nie kompresuje. Na produkcji: Brotli lub gzip w nginx/Apache albo w CDN.
4. **Brak nagłówków cache (555–650 KiB).** Statyczne pliki `wp-content/*` i `wp-includes/*`:
   `Cache-Control: public, max-age=31536000, immutable` – adresy mają `?ver=`, więc to bezpieczne.
5. **Zasoby blokujące renderowanie (~2,5 s na 4G).** Około 20 plików CSS/JS w `<head>`; przy HTTP/2
   i kompresji czas spada kilkukrotnie. Kolejne kroki:
   - jQuery + jquery-migrate (~100 KiB) ładuje się przez klasyczną galerię produktu i atrybucję
     zamówień; po przejściu na w pełni blokową kartę produktu można je usunąć z listy, sklepu i koszyka;
   - **Atrybucja zamówień** (`sourcebuster.js`, `order-attribution.js`) – funkcja WooCommerce do
     analityki źródeł sprzedaży. Wyłączenie (WooCommerce → Ustawienia → Zaawansowane → Funkcje)
     przyspiesza stronę, ale usuwa dane marketingowe – **decyzja właściciela sklepu**;
   - wtyczka cache strony (np. LiteSpeed Cache, WP Rocket – zgodnie z serwerem klienta) do łączenia
     i odraczania CSS – instalować dopiero po uzgodnieniu.
6. **Brak meta description (SEO).** WordPress nie generuje opisów; zalecana wtyczka SEO
   (Yoast SEO lub Rank Math – jedna, wybrana z klientem) z opisami kategorii i produktów.
7. **Zdjęcia produktów bez wymiarów (`unsized-images`).** Dotyczy tylko obrazka zastępczego
   WooCommerce – zniknie po dodaniu prawdziwych zdjęć. Zdjęcia wgrywać w WebP/AVIF, min. 1200 px.

### CLIMARO (eksport statyczny)

8. Zdjęcia JPG bez optymalizacji (1,4 MiB do odzyskania) – w wersji z serwerem Next.js działa
   `next/image` (WebP/AVIF); dla eksportu statycznego: konwersja do WebP podczas budowania.
9. Brak nagłówków cache w `serve` – na hostingu ustawić `immutable` dla `/_next/static/*`.

### wordpress.org (próbka strony produkcyjnej)

10. `errors-in-console` (Dobre praktyki 96) – błędy pochodzą z zablokowanych przez piaskownicę
    zewnętrznych skryptów; nie odtwarzać poza kontenerem. CSS nieużywany 177 KiB – po stronie
    wordpress.org, tylko jako punkt odniesienia.

> Strony produkcyjnej ComputerIT nie audytowano – nie podano jej adresu. Polecenie:
> `tools/lighthouse-audit.sh https://adres-sklepu.pl mobile` (tylko odczyt, niczego nie zmienia).
