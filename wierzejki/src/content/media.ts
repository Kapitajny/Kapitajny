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
  /** "contain" – zdjęcie produktu na białym tle pokazywane w całości, bez kadrowania. */
  fit?: "cover" | "contain";
}

export const MEDIA = {
  hero: {
    file: "hero-wedliny.jpg",
    alt: "Szynka z piersi indyka Wierzejki w kawałku i w plastrach na kamiennej desce",
    brief: "Szynka z piersi indyka na łupku; docelowo oryginał w wysokiej rozdzielczości",
    aspect: "16:9",
    credit: "Zdjęcie produktu przekazane przez ComputerIT (kadr 890×490 z oryginału 1200×674 px) – materiał firmy, użycie wymaga zgody",
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
    alt: "Półtusze wieprzowe zawieszone w chłodni",
    brief: "Półtusze w chłodni; docelowo wersja min. 2000 px szerokości",
    aspect: "3:2",
    credit: "Zdjęcie przekazane przez ComputerIT (547×365 px) – źródło i prawa do publikacji do potwierdzenia z firmą",
  },

  categoryCharcuterie: {
    file: "kategoria-wedliny.jpg",
    alt: "Pęta wędzonej kiełbasy Wierzejki na kamiennej desce, jedna przekrojona",
    brief: "Kiełbasy na łupku; docelowo oryginał w wysokiej rozdzielczości",
    aspect: "16:9",
    credit: "Zdjęcie produktu przekazane przez ComputerIT (kadr z oryginału 739×415 px) – materiał firmy, użycie wymaga zgody",
  },
  categoryReadyMeals: {
    file: "kategoria-garmaz.jpg",
    alt: "Opakowanie pierogów Wierzejki z linii Garmażerka",
    brief: "Opakowanie pierogów z linii Garmażerka; docelowo packshot w wysokiej rozdzielczości",
    aspect: "5:6",
    credit: "Zdjęcie opakowania produktu przekazane przez ComputerIT (248×299 px) – materiał firmy, użycie wymaga zgody",
    fit: "contain",
  },

  production: {
    file: "produkcja.jpg",
    alt: "Budynki zakładu Wierzejki z lotu ptaka, obok parking i pola",
    brief: "Zakład z lotu ptaka; docelowo wersja min. 2400 px szerokości",
    aspect: "16:9",
    credit: "Zdjęcie przekazane przez ComputerIT (1200×675 px) – źródło i prawa do publikacji do potwierdzenia z firmą",
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
  hamOnBoard: {
    file: "szynka-deska.jpg",
    alt: "Szynka w siatce i plastry szynki na drewnianej desce",
    brief: "Szynka w siatce na desce; docelowo packshot w wysokiej rozdzielczości",
    aspect: "1:1",
    credit: "Zdjęcie produktu przekazane przez ComputerIT (288×288 px) – materiał firmy, użycie wymaga zgody",
    fit: "contain",
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
