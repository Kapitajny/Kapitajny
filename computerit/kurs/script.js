/* =========================================================================
   Kurs tworzenia stron internetowych – computerit
   Skrypty wspólne dla wszystkich podstron
   ========================================================================= */

document.addEventListener("DOMContentLoaded", function () {
  ustawMenuMobilne();
  ustawRokWStopce();
  ustawFormularz();
});

/* -------------------------------------------------------------------------
   Menu na telefonie: przycisk „Menu” otwiera i zamyka listę linków
   ------------------------------------------------------------------------- */
function ustawMenuMobilne() {
  var przycisk = document.querySelector(".menu__przycisk");
  var menu = document.getElementById("menu");
  if (!przycisk || !menu) return;

  function zamknij() {
    menu.classList.remove("menu--otwarte");
    przycisk.setAttribute("aria-expanded", "false");
  }

  przycisk.addEventListener("click", function () {
    var otwarte = menu.classList.toggle("menu--otwarte");
    przycisk.setAttribute("aria-expanded", otwarte ? "true" : "false");
  });

  // Zamknij po kliknięciu poza menu
  document.addEventListener("click", function (zdarzenie) {
    if (!menu.contains(zdarzenie.target) && !przycisk.contains(zdarzenie.target)) zamknij();
  });

  // Zamknij klawiszem Esc
  document.addEventListener("keydown", function (zdarzenie) {
    if (zdarzenie.key === "Escape" && menu.classList.contains("menu--otwarte")) {
      zamknij();
      przycisk.focus();
    }
  });
}

/* -------------------------------------------------------------------------
   Aktualny rok w stopce
   ------------------------------------------------------------------------- */
function ustawRokWStopce() {
  var rok = document.getElementById("rok");
  if (rok) rok.textContent = new Date().getFullYear();
}

/* -------------------------------------------------------------------------
   Formularz zapisu: sprawdzanie pól i wysyłka
   ------------------------------------------------------------------------- */
function ustawFormularz() {
  var formularz = document.getElementById("formularz-zapisu");
  if (!formularz) return;

  var komunikat = formularz.querySelector(".formularz__komunikat");
  var przyciskWyslij = formularz.querySelector('button[type="submit"]');
  var wzorEmail = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;

  // Pakiet wybrany w cenniku (np. kontakt.html?pakiet=standard)
  var pakiet = new URLSearchParams(window.location.search).get("pakiet");
  if (pakiet && formularz.pakiet) {
    var opcja = formularz.pakiet.querySelector('option[value="' + pakiet + '"]');
    if (opcja) formularz.pakiet.value = pakiet;
  }

  // Reguły dla każdego pola: zwracają treść błędu albo pusty tekst
  var reguly = {
    imie: function (wartosc) {
      if (!wartosc.trim()) return "Podaj swoje imię.";
      if (wartosc.trim().length < 2) return "Imię jest za krótkie.";
      return "";
    },
    email: function (wartosc) {
      if (!wartosc.trim()) return "Podaj adres e-mail.";
      if (!wzorEmail.test(wartosc.trim())) return "Ten adres e-mail wygląda na niepoprawny.";
      return "";
    },
    telefon: function (wartosc) {
      var cyfry = wartosc.replace(/[^0-9]/g, "");
      if (wartosc.trim() && (cyfry.length < 9 || cyfry.length > 12)) return "Numer telefonu powinien mieć 9 cyfr (lub z kierunkowym).";
      return "";
    },
    pakiet: function (wartosc) {
      return wartosc ? "" : "Wybierz pakiet kursu.";
    },
    wiadomosc: function (wartosc) {
      if (wartosc.length > 1000) return "Wiadomość może mieć najwyżej 1000 znaków.";
      return "";
    },
    zgoda: function (wartosc, pole) {
      return pole.checked ? "" : "Zaznacz zgodę, abyśmy mogli odpowiedzieć.";
    }
  };

  function sprawdzPole(nazwa) {
    var pole = formularz.elements[nazwa];
    if (!pole) return true;
    var blad = reguly[nazwa](pole.value, pole);
    var opakowanie = pole.closest(".pole, .zgoda");
    var miejsceBledu = document.getElementById("blad-" + nazwa);

    if (miejsceBledu) miejsceBledu.textContent = blad;
    if (opakowanie) opakowanie.classList.toggle("pole--blad", Boolean(blad));
    pole.setAttribute("aria-invalid", blad ? "true" : "false");
    return !blad;
  }

  // Sprawdzaj pole po wyjściu z niego, a po błędzie – na bieżąco
  Object.keys(reguly).forEach(function (nazwa) {
    var pole = formularz.elements[nazwa];
    if (!pole) return;
    pole.addEventListener("blur", function () {
      sprawdzPole(nazwa);
    });
    pole.addEventListener("input", function () {
      if (pole.getAttribute("aria-invalid") === "true") sprawdzPole(nazwa);
    });
    pole.addEventListener("change", function () {
      if (pole.type === "checkbox" || pole.tagName === "SELECT") sprawdzPole(nazwa);
    });
  });

  function pokazKomunikat(tekst, rodzaj) {
    komunikat.textContent = tekst;
    komunikat.className = "formularz__komunikat formularz__komunikat--" + rodzaj;
    komunikat.focus();
  }

  formularz.addEventListener("submit", function (zdarzenie) {
    zdarzenie.preventDefault();

    var wszystkoOk = true;
    var pierwszyBlad = null;
    Object.keys(reguly).forEach(function (nazwa) {
      if (!sprawdzPole(nazwa)) {
        wszystkoOk = false;
        if (!pierwszyBlad) pierwszyBlad = formularz.elements[nazwa];
      }
    });

    if (!wszystkoOk) {
      pokazKomunikat("Popraw zaznaczone pola i wyślij ponownie.", "blad");
      if (pierwszyBlad) pierwszyBlad.focus();
      return;
    }

    var adres = formularz.getAttribute("action");

    // Tryb demo: adres wysyłki nie został jeszcze ustawiony
    if (!adres || adres.indexOf("TWOJ-ID") !== -1) {
      pokazKomunikat("Dziękujemy! Formularz działa poprawnie (tryb demo – ustaw adres wysyłki w kontakt.html, aby wiadomości trafiały na Twój e-mail).", "sukces");
      formularz.reset();
      return;
    }

    przyciskWyslij.disabled = true;
    przyciskWyslij.textContent = "Wysyłanie…";

    fetch(adres, {
      method: "POST",
      body: new FormData(formularz),
      headers: { Accept: "application/json" }
    })
      .then(function (odpowiedz) {
        if (!odpowiedz.ok) throw new Error("Błąd wysyłki");
        pokazKomunikat("Dziękujemy za zapis! Odpowiemy na Twój e-mail w ciągu 24 godzin.", "sukces");
        formularz.reset();
      })
      .catch(function () {
        pokazKomunikat("Nie udało się wysłać formularza. Spróbuj ponownie albo napisz na adres e-mail podany obok.", "blad");
      })
      .finally(function () {
        przyciskWyslij.disabled = false;
        przyciskWyslij.textContent = "Zapisz się na kurs";
      });
  });
}
