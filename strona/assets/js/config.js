/*
 * LUXURY MOVING – dane firmy. Jedyne miejsce do uzupełnienia przed publikacją.
 * Puste pola nie są wyświetlane. Sekcje „Opinie klientów” i „Z naszych realizacji”
 * pojawiają się dopiero, gdy wpiszesz poniżej prawdziwe opinie i zdjęcia.
 */
window.SITE = {
  phone: "500 999 777", // PRZYKŁADOWY numer z poprzedniej wersji strony – podmień na prawdziwy (też w index.html)
  email: "",            // np. "kontakt@luxurymoving.pl"
  companyLegal: "",     // pełna nazwa firmy i NIP – stopka
  formEndpoint: "wycena.php",

  /*
   * CENNIK – treść banknotów. Ceny brutto w złotych.
   *  price: liczba (np. 1000) albo null → na banknocie pojawi się „Wycena indywidualna”.
   *  Kolejność odpowiada banknotom na stronie: przeprowadzki, transport, usługi dodatkowe.
   */
  pricing: [
    { id: "przeprowadzki", name: "Przeprowadzki", price: 1000,
      scope: "Mieszkania, domy, biura i firmy. W mieście i między miastami." },
    { id: "transport", name: "Transport mebli", price: 150,
      scope: "Meble, AGD i RTV, rzeczy wielkogabarytowe i wyposażenie." },
    { id: "dodatkowe", name: "Usługi dodatkowe", price: null,
      scope: "Pomoc przy załadunku i rozładunku, demontaż i montaż mebli, opróżnianie mieszkań." }
  ],

  /* Prawdziwe opinie klientów, np. przepisane z wizytówki Google (za zgodą autora):
     { text: "Treść opinii", author: "Anna z Krakowa", source: "Google" } */
  reviews: [],

  /* Zdjęcia z prawdziwych realizacji (pliki wgraj do assets/img/realizacje/):
     { src: "assets/img/realizacje/plik.webp", alt: "Opis zdjęcia", caption: "Przeprowadzka, Kraków – Gdańsk" } */
  gallery: []
};
