# Wersja statyczna (artefakt claude.ai)

Strona może działać jako statyczny artefakt – bez serwera Next.js. Skrypty Next.js są wtedy usuwane,
a menu mobilne, pasek akcji i formularz obsługuje `site.js` (czysty JavaScript).

```bash
cd climaro
STATIC_EXPORT=1 npx next build              # eksport do out/
python3 -I artifact/build_artifact.py out artifact-dist
```

W `artifact-dist/` powstaje `climaro.html` (strona główna jako fragment – szkielet dokumentu dokłada platforma),
podstrony jako pełne dokumenty HTML i zdjęcia WebP. Linki są względne (`uslugi.html`, `kontakt.html#usluga-…`),
krój Archivo ładuje się z Google Fonts. Wymaga ImageMagick (`convert`) do zdjęć WebP.

Po zmianie zachowania komponentów (menu, pasek akcji, formularz) trzeba zaktualizować także `site.js`.
