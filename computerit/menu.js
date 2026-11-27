// computerit – obsługa pływającego menu
(function () {
  var nav = document.querySelector("[data-nav]");
  var toggle = nav.querySelector("[data-toggle]");
  var list = nav.querySelector(".cit-menu ul");
  var marker = nav.querySelector(".cit-marker");
  var links = Array.prototype.slice.call(nav.querySelectorAll(".cit-menu a"));

  function activeLink() {
    return nav.querySelector('.cit-menu a[aria-current="page"]') || links[0];
  }

  // Ustawia jasny znacznik dokładnie pod wskazanym linkiem i przyciemnia jego tekst
  function moveMarker(link) {
    if (!link) return;
    var offset = list.offsetLeft;
    marker.style.width = link.offsetWidth + "px";
    marker.style.setProperty("--x", offset + link.offsetLeft + "px");
    links.forEach(function (l) { l.classList.toggle("is-marked", l === link); });
  }

  function setActive(link) {
    links.forEach(function (l) { l.removeAttribute("aria-current"); });
    link.setAttribute("aria-current", "page");
    moveMarker(link);
  }

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
  }

  links.forEach(function (link) {
    link.addEventListener("mouseenter", function () { moveMarker(link); });
    link.addEventListener("focus", function () { moveMarker(link); });
    link.addEventListener("click", function () {
      setActive(link);
      setOpen(false);
    });
  });

  // Po zjechaniu kursorem znacznik wraca na aktywną sekcję
  list.addEventListener("mouseleave", function () { moveMarker(activeLink()); });
  list.addEventListener("focusout", function (e) {
    if (!list.contains(e.relatedTarget)) moveMarker(activeLink());
  });

  toggle.addEventListener("click", function () {
    setOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) setOpen(false);
  });

  // Gdy sekcje strony już istnieją, menu samo zaznacza tę, która jest na ekranie
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = links.find(function (l) { return l.getAttribute("href") === "#" + entry.target.id; });
        if (link) setActive(link);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    links.forEach(function (l) {
      var section = document.getElementById(l.getAttribute("href").slice(1));
      if (section) spy.observe(section);
    });
  }

  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { moveMarker(activeLink()); });

  // Pozycję znacznika liczymy po załadowaniu fontu, żeby trafiał w szerokość tekstu
  function ready() {
    marker.style.transition = "none";
    moveMarker(activeLink());
    marker.getBoundingClientRect();
    marker.style.transition = "";
    nav.classList.add("is-ready");
  }

  onScroll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(ready);
  } else {
    ready();
  }
})();
