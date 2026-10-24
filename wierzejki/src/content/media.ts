/**
 * CENTRALNA MAPA ZDJĘĆ
 *
 * Wszystkie zdjęcia leżą w `public/images/wierzejki/`. Aby dodać lub wymienić zdjęcie, wgraj plik
 * o nazwie z pola `file` i przebuduj projekt (`npm run build`). Komponenty nie wymagają zmian.
 *
 * Dopóki pliku nie ma, w jego miejscu wyświetla się tonalna plansza z opisem kadru (`brief`) –
 * gotowa specyfikacja dla fotografa. W repozytorium nie ma zdjęć: dostęp do banków zdjęć był
 * zablokowany w środowisku, w którym powstała koncepcja, a zdjęcia zakładu muszą pochodzić od firmy.
 *
 * Każde zdjęcie wymaga potwierdzenia praw do użycia – wpisz źródło w `credit`.
 * Zdjęć poglądowych (np. stockowych) nigdy nie podpisuj tak, jakby przedstawiały zakład Wierzejki.
 */

export const MEDIA_DIR = "/images/wierzejki";

export interface MediaDefinition {
  file: string;
  alt: string;
  /** Opis kadru dla fotografa / art directora. */
  brief: string;
  /** Proporcje kadru (szerokość/wysokość) – informacyjnie. */
  aspect: string;
  /** Pochodzenie i licencja zdjęcia. `null` = brak zdjęcia. */
  credit: string | null;
  /** Czy zdjęcie musi być autentyczne (zakład, ludzie firmy), a nie poglądowe. */
  mustBeAuthentic?: boolean;
}

export const MEDIA = {
  hero: {
    file: "hero-wedliny.jpg",
    alt: "Wędzonki i kiełbasy ułożone na bukowej desce",
    brief: "Wędzonki i pęta kiełbasy na desce, ciemne tło, miękkie światło z boku",
    aspect: "4:5",
    credit: null,
  },
  aboutPlant: {
    file: "zaklad-pludy.jpg",
    alt: "Zakład Mięsny Wierzejki w Płudach z lotu ptaka – hale zakładu wśród pól, obok staw i droga dojazdowa",
    brief: "Zakład w Płudach z lotu ptaka; docelowo wersja min. 2000 px szerokości",
    aspect: "4:3",
    credit: "Zdjęcie przekazane przez ComputerIT (500×375 px) – źródło i prawa do publikacji do potwierdzenia z firmą",
    mustBeAuthentic: true,
  },
  aboutCraft: {
    file: "rzemioslo.jpg",
    alt: "Dłonie pracownika wiążące kiełbasę",
    brief: "Dłonie przy wiązaniu kiełbasy, zbliżenie, bez twarzy",
    aspect: "4:5",
    credit: null,
    mustBeAuthentic: true,
  },
  categoryMeat: {
    file: "kategoria-mieso.jpg",
    alt: "Elementy wieprzowe i wołowe na papierze rzeźniczym",
    brief: "Schab, karkówka i rostbef na szarym papierze rzeźniczym, widok z góry",
    aspect: "4:5",
    credit: null,
  },
  categoryCharcuterie: {
    file: "kategoria-wedliny.jpg",
    alt: "Pokrojone wędliny i kiełbasy na desce",
    brief: "Wędliny krojone w plastry i pęto kiełbasy, ujęcie pod kątem 45°",
    aspect: "4:5",
    credit: null,
  },
  categoryReadyMeals: {
    file: "kategoria-garmaz.jpg",
    alt: "Pierogi na talerzu, obok krokiety",
    brief: "Pierogi i krokiety na talerzu w domowej scenografii, jasne tło",
    aspect: "4:5",
    credit: null,
  },
  production: {
    file: "produkcja.jpg",
    alt: "Hala rozbioru w zakładzie w Płudach",
    brief: "Hala rozbioru: stanowiska, biała odzież robocza, szeroki kadr",
    aspect: "16:9",
    credit: null,
    mustBeAuthentic: true,
  },
  smokehouse: {
    file: "wedzarnia.jpg",
    alt: "Kiełbasy na kijach w komorze wędzarniczej",
    brief: "Kiełbasy zawieszone na kijach w wędzarni, ciepłe światło",
    aspect: "4:5",
    credit: null,
    mustBeAuthentic: true,
  },
  business: {
    file: "dla-biznesu.jpg",
    alt: "Załadunek towaru do samochodu chłodni",
    brief: "Załadunek skrzynek do chłodni przy rampie, ruch, poranek",
    aspect: "3:2",
    credit: null,
    mustBeAuthentic: true,
  },
  shop: {
    file: "sklep-firmowy.jpg",
    alt: "Pawilon handlowy ze stoiskiem patronackim Wierzejki – szyld „Mięso, wędliny, drób” i flaga firmy",
    brief: "Punkt sprzedaży z szyldem Wierzejki; docelowo wersja min. 2000 px szerokości",
    aspect: "3:2",
    credit: "Zdjęcie przekazane przez ComputerIT (547×365 px) – źródło i prawa do publikacji do potwierdzenia z firmą",
    mustBeAuthentic: true,
  },
  catalogMeat: {
    file: "katalog-mies-okladka.jpg",
    alt: "Okładka katalogu mięs Zakładu Mięsnego Wierzejki",
    brief: "Okładka katalogu mięs (materiał firmy)",
    aspect: "5:7",
    credit: "Okładka katalogu firmy przekazana przez ComputerIT – materiał Zakładu Mięsnego Wierzejki, użycie wymaga zgody",
  },
  careers: {
    file: "kariera.jpg",
    alt: "Pracownicy zakładu przy stanowisku pracy",
    brief: "Zespół przy stanowisku pracy, naturalne kadry, za zgodą osób",
    aspect: "4:5",
    credit: null,
    mustBeAuthentic: true,
  },
} satisfies Record<string, MediaDefinition>;

export type MediaKey = keyof typeof MEDIA;
