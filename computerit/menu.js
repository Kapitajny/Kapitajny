// computerit – obsługa pływającego menu
(function () {
  var nav = document.querySelector("[data-nav]");
  var toggle = nav.querySelector("[data-toggle]");
  var links = nav.querySelectorAll(".cit-menu a");

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  }

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  // Zaznacz kliknięty link jako aktywny i zamknij menu na telefonie
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      links.forEach(function (l) { l.removeAttribute("aria-current"); });
      link.setAttribute("aria-current", "page");
      setOpen(false);
    });
  });

  // Mocniejszy cień po przewinięciu strony
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
})();
