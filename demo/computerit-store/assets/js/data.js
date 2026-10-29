/* ComputerIT Store — katalog demonstracyjny.
   Marki, nazwy, ceny, stany i parametry są FIKCYJNE. Ceny w groszach (49900 = 499,00 zł). */
window.STORE = (() => {
  "use strict";

  const COLORS = {
    grafit: { name: "Grafit", hex: "#3b3f46" },
    srebrny: { name: "Srebrny", hex: "#c8ccd2" },
    czarny: { name: "Czarny", hex: "#202226" },
    mgla: { name: "Mgła", hex: "#e4e2dc" },
    bialy: { name: "Biały", hex: "#f1f1ef" },
    piasek: { name: "Piasek", hex: "#d6cbb8" },
    kobalt: { name: "Kobalt", hex: "#2346ff" },
  };

  const CATEGORIES = [
    { id: "laptopy", name: "Laptopy" },
    { id: "monitory", name: "Monitory" },
    { id: "peryferia", name: "Klawiatury i myszy" },
    { id: "audio", name: "Audio" },
    { id: "akcesoria", name: "Akcesoria" },
    { id: "siec", name: "Sieć i wideo" },
  ];

  const PRODUCTS = [
    {
      slug: "aero-14", name: "Aero 14", category: "laptopy", art: "laptop", featured: 1, isNew: true,
      tagline: "Lekki laptop 14″ do pracy w podróży",
      description: "Aluminiowa obudowa, matowy ekran 2,8K i bateria na cały dzień pracy biurowej. Dwa porty USB-C z ładowaniem i czytnik kart microSD.",
      colors: ["grafit", "srebrny"],
      options: [
        { id: "16-512", name: "16 GB RAM · 512 GB SSD", price: 499900 },
        { id: "32-1tb", name: "32 GB RAM · 1 TB SSD", price: 599900 },
      ],
      stock: 8,
      specs: [["Ekran", "14″, 2880 × 1800, matowy, 120 Hz"], ["Waga", "1,24 kg"], ["Porty", "2 × USB-C, USB-A, microSD, jack 3,5 mm"], ["Bateria", "70 Wh"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "forge-16", name: "Forge 16", category: "laptopy", art: "laptop", featured: 4,
      tagline: "Stacja robocza 16″ do grafiki i montażu",
      description: "Ekran o szerokim pokryciu barw, wydajne chłodzenie i komplet portów, w tym HDMI 2.1 oraz czytnik kart SD w pełnym rozmiarze.",
      colors: ["czarny"],
      options: [
        { id: "32-1tb", name: "32 GB RAM · 1 TB SSD", price: 749900 },
        { id: "64-2tb", name: "64 GB RAM · 2 TB SSD", price: 929900 },
      ],
      stock: 3,
      specs: [["Ekran", "16″, 3200 × 2000, 165 Hz, 100% DCI-P3"], ["Waga", "2,1 kg"], ["Porty", "2 × USB-C, 2 × USB-A, HDMI 2.1, SD, RJ-45"], ["Bateria", "90 Wh"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "lumen-27", name: "Lumen 27 4K", category: "monitory", art: "monitor", featured: 2,
      tagline: "Monitor 27″ 4K z USB-C 90 W",
      description: "Jeden kabel do obrazu, danych i ładowania laptopa. Fabrycznie skalibrowany panel IPS i stopa z regulacją wysokości.",
      colors: ["czarny", "srebrny"],
      options: [{ id: "std", name: "Wersja standardowa", price: 189900 }],
      stock: 12,
      specs: [["Matryca", "27″ IPS, 3840 × 2160, 60 Hz"], ["Złącza", "USB-C 90 W, HDMI 2.0, DisplayPort 1.4"], ["Regulacja", "wysokość, pochylenie, pivot"], ["Gwarancja", "36 miesięcy"]],
    },
    {
      slug: "lumen-34-ultra", name: "Lumen 34 Ultra", category: "monitory", art: "ultrawide",
      tagline: "Zakrzywiony monitor 34″ 144 Hz",
      description: "Panoramiczny ekran do pracy na wielu oknach i płynnej rozgrywki. Wbudowany przełącznik KVM dla dwóch komputerów.",
      colors: ["czarny"],
      options: [{ id: "std", name: "Wersja standardowa", price: 259900 }],
      stock: 5,
      specs: [["Matryca", "34″ VA, 3440 × 1440, 144 Hz, krzywizna 1500R"], ["Złącza", "USB-C 65 W, 2 × HDMI, DisplayPort"], ["Funkcje", "KVM, obraz w obrazie"], ["Gwarancja", "36 miesięcy"]],
    },
    {
      slug: "keystone-tkl", name: "Keystone TKL", category: "peryferia", art: "keyboard", featured: 3, isNew: true,
      tagline: "Klawiatura mechaniczna 80%",
      description: "Aluminiowa rama, wymienne przełączniki liniowe i trzy tryby połączenia: kabel, 2,4 GHz i Bluetooth.",
      colors: ["grafit", "mgla"],
      options: [
        { id: "linear", name: "Przełączniki liniowe", price: 44900 },
        { id: "tactile", name: "Przełączniki taktylne", price: 46900 },
      ],
      stock: 20,
      specs: [["Układ", "80% (TKL), ISO/ANSI"], ["Łączność", "USB-C, 2,4 GHz, Bluetooth 5.1"], ["Bateria", "4000 mAh"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "glide-pro", name: "Glide Pro", category: "peryferia", art: "mouse",
      tagline: "Bezprzewodowa mysz z cichymi przyciskami",
      description: "Wyprofilowany kształt, przewijanie z trybem swobodnym i parowanie z trzema urządzeniami.",
      colors: ["grafit", "bialy"],
      options: [{ id: "std", name: "Wersja standardowa", price: 27900 }],
      stock: 30,
      specs: [["Sensor", "8000 DPI"], ["Łączność", "2,4 GHz, Bluetooth"], ["Zasilanie", "akumulator, USB-C"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "halo-anc", name: "Halo ANC", category: "audio", art: "headphones", featured: 5,
      tagline: "Słuchawki nauszne z redukcją szumów",
      description: "Aktywna redukcja szumów, tryb kontaktu z otoczeniem i miękkie poduszki z pianki z pamięcią kształtu.",
      colors: ["grafit", "piasek", "kobalt"],
      options: [{ id: "std", name: "Wersja standardowa", price: 89900 }],
      stock: 9,
      specs: [["Przetworniki", "40 mm"], ["Czas pracy", "do 40 h (ANC wyłączone)"], ["Łączność", "Bluetooth 5.3, multipoint, jack 3,5 mm"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "pulse-mini", name: "Pulse Mini", category: "audio", art: "speaker",
      tagline: "Przenośny głośnik Bluetooth",
      description: "Pełne brzmienie z kompaktowej obudowy, odporność na zachlapanie i pasek do zawieszenia.",
      colors: ["grafit", "kobalt", "piasek"],
      options: [{ id: "std", name: "Wersja standardowa", price: 34900 }],
      stock: 0,
      specs: [["Moc", "20 W"], ["Czas pracy", "do 14 h"], ["Odporność", "IP67"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "dock-8in1", name: "Dock 8-in-1", category: "akcesoria", art: "hub",
      tagline: "Hub USB-C z HDMI 4K i Ethernetem",
      description: "Osiem portów w aluminiowej obudowie: HDMI 4K60, dwa USB-A, USB-C z ładowaniem 100 W, Ethernet i czytniki kart.",
      colors: ["grafit", "srebrny"],
      options: [{ id: "std", name: "Wersja standardowa", price: 32900 }],
      stock: 25,
      specs: [["Porty", "HDMI, 2 × USB-A, USB-C PD 100 W, RJ-45, SD, microSD, USB-C dane"], ["Przewód", "20 cm"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "vault-ssd", name: "Vault SSD", category: "akcesoria", art: "ssd",
      tagline: "Szybki dysk przenośny USB-C",
      description: "Do 1050 MB/s odczytu, obudowa odporna na upadki i szyfrowanie sprzętowe.",
      colors: ["grafit", "srebrny"],
      options: [
        { id: "1tb", name: "1 TB", price: 44900 },
        { id: "2tb", name: "2 TB", price: 74900 },
      ],
      stock: 14,
      specs: [["Transfer", "do 1050 MB/s"], ["Złącze", "USB-C 3.2 Gen 2"], ["Szyfrowanie", "AES-256"], ["Gwarancja", "36 miesięcy"]],
    },
    {
      slug: "charge-100", name: "Charge 100 W", category: "akcesoria", art: "charger", isNew: true,
      tagline: "Ładowarka GaN z trzema portami",
      description: "Naładuje laptopa, telefon i słuchawki jednocześnie. Składane bolce i kompaktowe wymiary.",
      colors: ["bialy", "grafit"],
      options: [{ id: "std", name: "Wersja standardowa", price: 21900 }],
      stock: 40,
      specs: [["Moc", "100 W (maks. na jednym porcie)"], ["Porty", "2 × USB-C, USB-A"], ["Technologia", "GaN"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "mesh-duo", name: "Mesh 6E Duo", category: "siec", art: "router",
      tagline: "System Wi-Fi 6E — zestaw dwóch modułów",
      description: "Stabilny zasięg w całym mieszkaniu lub domu. Konfiguracja w aplikacji w kilka minut.",
      colors: ["bialy"],
      options: [
        { id: "duo", name: "Zestaw 2 szt.", price: 119900 },
        { id: "trio", name: "Zestaw 3 szt.", price: 164900 },
      ],
      stock: 6,
      specs: [["Standard", "Wi-Fi 6E, trójpasmowy"], ["Zasięg", "do 250 m² (zestaw 2 szt.)"], ["Porty", "2 × 2,5 GbE na moduł"], ["Gwarancja", "24 miesiące"]],
    },
    {
      slug: "frame-4k", name: "Frame 4K", category: "siec", art: "webcam",
      tagline: "Kamera internetowa 4K z zasłonką",
      description: "Automatyczna ekspozycja, dwa mikrofony z redukcją szumów i fizyczna zasłonka obiektywu.",
      colors: ["czarny"],
      options: [{ id: "std", name: "Wersja standardowa", price: 49900 }],
      stock: 11,
      specs: [["Rozdzielczość", "4K 30 kl./s, 1080p 60 kl./s"], ["Pole widzenia", "65°–90°"], ["Złącze", "USB-C"], ["Gwarancja", "24 miesiące"]],
    },
  ];

  const SHIPPING = [
    { id: "kurier", name: "Kurier", eta: "1–2 dni robocze", price: 1900 },
    { id: "automat", name: "Automat paczkowy", eta: "1–2 dni robocze", price: 1400 },
    { id: "odbior", name: "Odbiór osobisty", eta: "po potwierdzeniu e-mail", price: 0 },
  ];
  const FREE_SHIPPING_FROM = 99900;
  const MAX_QTY = 10;

  const bySlug = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));
  const fromPrice = (p) => Math.min(...p.options.map((o) => o.price));

  return { COLORS, CATEGORIES, PRODUCTS, SHIPPING, FREE_SHIPPING_FROM, MAX_QTY, bySlug, fromPrice };
})();
