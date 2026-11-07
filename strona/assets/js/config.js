/*
 * Dane firmy – jedyne miejsce do uzupełnienia przed publikacją.
 * Puste pola nie są wyświetlane. Sekcje „Opinie klientów” i „Z naszych realizacji”
 * pojawiają się dopiero, gdy wpiszesz poniżej prawdziwe opinie i zdjęcia.
 */
window.SITE = {
  phone: "500 999 777", // PRZYKŁADOWY numer – podmień na prawdziwy (też w index.html)
  email: "",            // np. "kontakt@uslugibusem.pl"
  companyLegal: "",     // pełna nazwa firmy i NIP – stopka
  formEndpoint: "wycena.php",

  /* Prawdziwe opinie klientów, np. przepisane z wizytówki Google (za zgodą autora):
     { text: "Treść opinii", author: "Anna z Krakowa", source: "Google" } */
  reviews: [],

  /* Zdjęcia z prawdziwych realizacji (pliki wgraj do assets/img/realizacje/):
     { src: "assets/img/realizacje/plik.webp", alt: "Opis zdjęcia", caption: "Przeprowadzka, Kraków – Gdańsk" } */
  gallery: []
};
