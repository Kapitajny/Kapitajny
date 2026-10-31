# Katalog prywatny (poza repozytorium)

Zawartość tego katalogu **nie jest commitowana** (patrz `.gitignore`) i nie jest dostępna publicznie przez serwer WWW.

```
private/
  ebooks/
    zdrowiej-kazdego-dnia.pdf   ← pełny e-book (wydawany po opłaceniu zamówienia)
    zdrowe-sniadania.pdf        ← dodaj, aby uruchomić sprzedaż tej publikacji
    zdrowe-obiady.pdf           ← j.w.
    zdrowe-nawyki.pdf           ← j.w.
  ebook-source/                 ← edytowalne źródła e-booka (treść, ilustracje, skład, eksport PDF)
```

Produkt jest dostępny w sklepie tylko wtedy, gdy jego plik PDF istnieje w `private/ebooks/`
(sprawdzane przy budowaniu strony i przy każdym zamówieniu). Po dodaniu pliku przebuduj stronę (`npm run build`).
