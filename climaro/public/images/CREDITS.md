# Pochodzenie zdjęć

Wszystkie zdjęcia pochodzą z serwisu Pexels i są używane na [licencji Pexels](https://www.pexels.com/license/)
(bezpłatne użycie komercyjne, dozwolona modyfikacja, bez obowiązku podawania autora). Pliki pobrano z `images.pexels.com`;
Next.js (`next/image`) serwuje je jako AVIF/WebP w rozmiarze dopasowanym do ekranu.

| Plik | Źródło | Autor | Użycie | Modyfikacje |
| --- | --- | --- | --- | --- |
| `hero-dom-pompa-ciepla.jpg` | https://www.pexels.com/photo/20046691/ | alpha innotec | Hero (szerokie ekrany) | Usunięte logo producenta z obudowy |
| `hero-dom-pompa-ciepla-pion.jpg` | jw. | alpha innotec | Hero (telefony) | Pionowy kadr 1200 × 1600 z powyższego |
| `pompa-ciepla-ogrod.jpg` | https://www.pexels.com/photo/38067300/ | alpha innotec | Usługa: pompy ciepła | Usunięte logo producenta z panelu |
| `klimatyzacja-jednostka.jpg` | https://www.pexels.com/photo/38788452/ | zob. strona zdjęcia | Usługa: klimatyzacja | – |
| `rekuperacja-czerpnie.jpg` | https://www.pexels.com/photo/6033459/ | zob. strona zdjęcia | Usługa: rekuperacja | – |
| `serwis-technik.jpg` | https://www.pexels.com/photo/5463575/ | José Andrés Pacheco Cortes | Usługa: serwis HVAC | Usunięte logo producenta z jednostki |
| `dach-jednostki.jpg` | https://www.pexels.com/photo/13109834/ | zob. strona zdjęcia | Strona główna: o firmie | – |
| `elewacja-noc.jpg` | https://www.pexels.com/photo/28567008/ | zob. strona zdjęcia | Tło zachęty do kontaktu | – |
| `rekuperacja-maszynownia.jpg` | https://www.pexels.com/photo/20046689/ | alpha innotec | O nas: nagłówek | – |
| `detal-pomiar.jpg` | https://www.pexels.com/photo/5463580/ | José Andrés Pacheco Cortes | O nas: zakres działalności | – |

Uwagi:

- Zdjęcia nie przedstawiają realizacji CLIMARO – to ilustracje usług. W realnym wdrożeniu najlepiej zastąpić je
  zdjęciami z własnych montaży (wtedy trzeba też na nowo ustawić punkty oznaczeń w `src/data/services.ts`
  i w `src/components/Hero.tsx`).
- Logo producentów usunięto, żeby zdjęcia nie sugerowały współpracy z konkretną marką.
