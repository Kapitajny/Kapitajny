/*
 * Dane firmy – jedyne miejsce, które trzeba uzupełnić przed publikacją.
 * Puste pola są na stronie oznaczane jako „do uzupełnienia”, a przyciski „Zadzwoń”
 * prowadzą wtedy do sekcji Kontakt zamiast wybierać numer.
 */
window.SITE = {
  name: "Usługi Busem",
  phone: "",            // np. "+48 600 100 200"
  email: "",            // np. "kontakt@uslugibusem.pl"
  address: "",          // np. "ul. Przykładowa 1, 00-001 Warszawa" – włącza link do Google Maps
  companyLegal: "",     // pełna nazwa firmy, NIP – wyświetlane w stopce i klauzuli RODO
  googleReviewUrl: "",  // link „Wystaw opinię” z wizytówki Google
  googleProfileUrl: "", // link do wizytówki Google
  formEndpoint: "wycena.php",
  /* Prawdziwe opinie z Google, np.:
     { author: "Imię N.", rating: 5, date: "2026-10-12", text: "Treść opinii" } */
  reviews: []
};
