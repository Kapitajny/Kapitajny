# FORMA ATELIER — raport końcowy

## Co zostało wykonane
- Strona w Next.js 16.4 w `forma-atelier/`. Ma 7 podstron i 6 stron realizacji, `sitemap.xml`, `robots.txt`, stronę 404,
  API formularza i metadane SEO z JSON-LD (`InteriorDesigner`).
- Hero: pełnoekranowy film 17,5 s w pętli (autorski render 3D), z plakatem, wersją lekką na telefony, pauzą
  i obsługą `prefers-reduced-motion` oraz wolnego łącza.
- 29 autorskich fotografii 3D. Każda realizacja ma osobny zestaw ujęć; zdjęcia pracowni są unikalne.
- Menu pełnoekranowe z podglądem zdjęć, przejścia stron (`<ViewTransition>`, okładka „przelatuje” do hero
  realizacji), galeria z podglądem pełnoekranowym, akordeon oferty, oś procesu sterowana przewijaniem, opinie
  oznaczone jako przykładowe.
- Formularz z walidacją po stronie przeglądarki i serwera. Bez skonfigurowanego webhooka formularz uczciwie
  informuje, że wiadomość nie została wysłana.
- Dokumentacja: `docs/KONCEPCJA.md`, `docs/FILM.md`, `README.md`, `production/3d/README.md`.

## Skills, pluginy, narzędzia
| Narzędzie | Użycie |
| --- | --- |
| Skill `frontend-design` | kierunek wizualny, plan tokenów, samokrytyka projektu |
| Skill `artifact-design` (quickstart Artifact) | podgląd strony w claude.ai |
| Skill `figma-create-new-file` + Figma MCP | sprawdzona możliwość generowania obrazów; tworzenia pliku i wydawania kredytów nie wykonano (blokada bezpieczeństwa, brak zgody właściciela konta) |
| Figma Weave | niedostępny — konto Weave niepołączone z Figmą |
| WebSearch / WebFetch | próba researchu stron inspiracji — domeny zablokowane polityką sieci |
| Playwright (Chromium) | testy interakcji, zrzuty ekranu, nagrania, pomiary LCP/CLS |
| axe-core 4.14 | audyt WCAG 2.1 A/AA |
| Blender 5.2 (`bpy` z PyPI), Cycles | film i fotografie |
| ffmpeg, ImageMagick | montaż, kodowanie, kompresja |

Pluginy na koncie claude.ai: brak włączonych. Serwery MCP pluginu „design” (Asana, Notion, Slack itp.) nie połączyły
się (odmowa proxy) i nie były potrzebne.

## Testy
| Test | Wynik |
| --- | --- |
| `npm run lint`, `npm run typecheck`, `next build` | bez błędów |
| `qa/interactions.cjs` (menu, Esc i fokus, nawigacja, galeria, formularz, API 422, linki, film desktop/mobile, reduced motion) | 23/23 |
| `qa/a11y-perf.cjs` — axe, 9 stron × desktop/mobile | 0 naruszeń |
| CLS | 0,000 na wszystkich stronach |
| LCP (serwer produkcyjny, ciepły cache) | 0,06–0,43 s na podstronach; strona główna 0,2 s desktop, 2,4 s mobile (animowane wejście nagłówka hero) |
| Przewijanie poziome | brak na 390 px i 1440 px |
| Błędy konsoli | brak (poza 404 pliku wideo przed jego wyrenderowaniem) |
| Pętla filmu | różnica ostatnia→pierwsza klatka = różnica dwóch kolejnych klatek (6,0%) |

## Ocena (1–10, bez taryfy ulgowej)
| Obszar | Ocena | Uzasadnienie |
| --- | --- | --- |
| Design | 8 | spójny, redakcyjny układ, asymetria i rytm; paleta z briefu bywa bliska popularnym szablonom |
| UX | 8 | czytelna nawigacja, akordeon, galeria, uczciwy formularz; brak wyszukiwania i filtrów realizacji (przy 6 projektach zbędne) |
| Typografia | 8 | dobra hierarchia i skala; Cormorant przy małych stopniach jest delikatny, dlatego stosowany tylko od 21 px |
| Fotografie | 7 | autorskie, spójne kolorystycznie, naturalne światło. To jednak rendery 3D, które doświadczone oko rozpozna jako CGI (proste modele, brak tekstur skanowanych). Podniesienie oceny wymaga prawdziwych zdjęć lub stocku, które były w tej sesji zablokowane |
| Film | 7 | płynny, kinowy, bez cięć, z bezszwową pętlą; renderowany w 720p i skalowany do 1080p, z tymi samymi ograniczeniami CGI co zdjęcia |
| Responsywność | 9 | testowane 390 px i 1440 px, osobna lżejsza wersja filmu |
| Animacje | 8 | subtelne, podporządkowane zdjęciom; respektują reduced motion |
| Wydajność | 8 | CLS 0, szybkie LCP podstron, film nie blokuje ładowania; ciężar filmu 3–9 MB pobierany strumieniowo |
| SEO | 8 | metadane, canonical, OG, sitemap, JSON-LD, semantyczne nagłówki; domena i treści demonstracyjne |
| Jakość kodu | 8 | komponenty, wspólna walidacja, typy, lint bez uwag; brak testów jednostkowych (są testy E2E w Playwright) |

**Poniżej 8 są tylko fotografie i film.** Granicą było środowisko, nie projekt. Bez dostępu do Unsplash, Pexels
i generatorów wideo nie dało się uzyskać fotorealizmu wyższego niż render proceduralny na CPU w rozsądnym czasie.

## Co pozostało / co można ulepszyć
1. Podmiana renderów na prawdziwe fotografie realizacji (te same nazwy plików w `src/assets/photos/`).
2. Wersja filmu z generatora AI (gotowy prompt w `docs/FILM.md`) albo dłuższy render w 1080p na GPU.
3. Podłączenie `CONTACT_WEBHOOK_URL` i weryfikacja prawna polityki prywatności.
4. Powtórzenie analizy czterech stron inspiracji po odblokowaniu domen.
5. Wdrożenie (Vercel, Root Directory `forma-atelier`) i pomiar Lighthouse na produkcji.
