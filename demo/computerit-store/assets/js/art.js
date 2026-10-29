/* ComputerIT Store — ilustracje produktów generowane jako SVG (kolor = wybrany wariant).
   W sklepie produkcyjnym zastępuje się je zdjęciami produktów. */
window.STORE_ART = (() => {
  "use strict";
  let uid = 0;

  // Rozjaśnienie / przyciemnienie koloru HEX (amt: -1…1).
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
      Math.round(amt >= 0 ? c + (255 - c) * amt : c * (1 + amt)),
    );
    return `#${ch.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  }
  const isLight = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return ((n >> 16) & 255) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11 > 150;
  };

  const shadow = (cx, cy, rx, ry = 10) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#000" opacity=".12" filter="url(#b${uid})"/>`;
  const grad = (id, a, b, vertical = true) =>
    `<linearGradient id="${id}${uid}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  const screen = () =>
    `<linearGradient id="scr${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2346ff"/><stop offset=".55" stop-color="#6a7dff"/><stop offset="1" stop-color="#e9e6ff"/></linearGradient>`;

  const draw = {
    laptop(c) {
      return `<defs>${grad("body", shade(c, 0.18), shade(c, -0.12))}${screen()}</defs>
        ${shadow(240, 292, 190, 12)}
        <rect x="96" y="46" width="288" height="196" rx="12" fill="${shade(c, -0.25)}"/>
        <rect x="104" y="54" width="272" height="180" rx="6" fill="#0d0f14"/>
        <rect x="110" y="60" width="260" height="168" rx="3" fill="url(#scr${uid})"/>
        <path d="M110 200 C 180 150, 260 230, 370 160 L370 228 L110 228Z" fill="#fff" opacity=".18"/>
        <circle cx="240" cy="50" r="2" fill="#555"/>
        <path d="M58 248 H422 L404 280 Q400 286 392 286 H88 Q80 286 76 280 Z" fill="url(#body${uid})"/>
        <rect x="58" y="244" width="364" height="8" rx="4" fill="${shade(c, 0.3)}"/>
        <rect x="206" y="244" width="68" height="6" rx="3" fill="${shade(c, -0.2)}"/>`;
    },
    monitor(c) {
      return `<defs>${grad("body", shade(c, 0.15), shade(c, -0.15))}${screen()}</defs>
        ${shadow(240, 314, 120, 10)}
        <rect x="222" y="226" width="36" height="74" fill="url(#body${uid})"/>
        <path d="M168 300 H312 Q318 300 318 306 V312 H162 V306 Q162 300 168 300Z" fill="${shade(c, 0.1)}"/>
        <rect x="52" y="30" width="376" height="218" rx="8" fill="${shade(c, -0.2)}"/>
        <rect x="58" y="36" width="364" height="200" rx="3" fill="url(#scr${uid})"/>
        <path d="M58 190 C 150 120, 280 230, 422 130 L422 236 L58 236Z" fill="#fff" opacity=".16"/>
        <rect x="52" y="236" width="376" height="12" rx="0" fill="${shade(c, 0.05)}"/>
        <circle cx="400" cy="242" r="2" fill="#7cd38c"/>`;
    },
    ultrawide(c) {
      return `<defs>${grad("body", shade(c, 0.15), shade(c, -0.15))}${screen()}</defs>
        ${shadow(240, 316, 140, 10)}
        <rect x="224" y="218" width="32" height="84" fill="url(#body${uid})"/>
        <path d="M160 302 H320 Q326 302 326 308 V314 H154 V308 Q154 302 160 302Z" fill="${shade(c, 0.1)}"/>
        <path d="M18 62 Q240 36 462 62 V236 Q240 214 18 236 Z" fill="${shade(c, -0.2)}"/>
        <path d="M26 70 Q240 46 454 70 V224 Q240 202 26 224 Z" fill="url(#scr${uid})"/>
        <path d="M26 190 C 140 130, 300 220, 454 140 V224 Q240 202 26 224Z" fill="#fff" opacity=".15"/>`;
    },
    keyboard(c) {
      const keyFill = isLight(c) ? shade(c, -0.12) : shade(c, 0.12);
      const keyTop = isLight(c) ? "#fbfbfa" : shade(c, 0.24);
      const U = 20.5, GAP = 3, X0 = 52, Y0 = 130, ROW = 26;
      const key = (x, y, units, accent) => {
        const w = units * U - GAP;
        return `<rect x="${x}" y="${y}" width="${w}" height="22" rx="4" fill="${keyFill}"/><rect x="${x + 2}" y="${y + 1.5}" width="${w - 4}" height="16" rx="3" fill="${accent ? "#2346ff" : keyTop}"/>`;
      };
      // szerokości klawiszy w jednostkach (każdy rząd = 15 jednostek)
      const rows = [
        Array(15).fill(1),
        [1.5, ...Array(12).fill(1), 1.5],
        [1.75, ...Array(11).fill(1), 2.25],
        [2.25, ...Array(10).fill(1), 2.75],
        [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25],
      ];
      let keys = "";
      rows.forEach((units, r) => {
        let x = X0;
        units.forEach((u, i) => {
          keys += key(x, Y0 + r * ROW, u, r === 0 && i === 0);
          x += u * U;
        });
      });
      const NAV = X0 + 15.5 * U;
      [0, 1].forEach((r) => [0, 1, 2].forEach((j) => (keys += key(NAV + j * U, Y0 + r * ROW, 1))));
      keys += key(NAV + U, Y0 + 3 * ROW, 1);
      [0, 1, 2].forEach((j) => (keys += key(NAV + j * U, Y0 + 4 * ROW, 1)));
      return `<defs>${grad("body", shade(c, 0.12), shade(c, -0.18))}</defs>
        ${shadow(240, 278, 210, 12)}
        <rect x="36" y="114" width="408" height="158" rx="14" fill="url(#body${uid})"/>
        <rect x="36" y="114" width="408" height="6" rx="3" fill="#fff" opacity=".25"/>
        ${keys}`;
    },
    mouse(c) {
      return `<defs>${grad("body", shade(c, 0.22), shade(c, -0.18), false)}</defs>
        ${shadow(240, 300, 80, 12)}
        <path d="M240 44 C 300 44 322 110 322 180 C 322 260 286 300 240 300 C 194 300 158 260 158 180 C 158 110 180 44 240 44 Z" fill="url(#body${uid})"/>
        <path d="M240 44 V 140" stroke="${shade(c, -0.3)}" stroke-width="2"/>
        <path d="M160 150 Q 240 166 320 150" stroke="${shade(c, -0.25)}" stroke-width="1.5" fill="none" opacity=".5"/>
        <rect x="233" y="74" width="14" height="40" rx="7" fill="${shade(c, -0.35)}"/>
        <rect x="236" y="80" width="8" height="28" rx="4" fill="#2346ff"/>
        <path d="M200 70 C 214 56 228 52 236 52" stroke="#fff" stroke-opacity=".45" stroke-width="5" stroke-linecap="round" fill="none"/>`;
    },
    headphones(c) {
      return `<defs>${grad("body", shade(c, 0.2), shade(c, -0.2))}</defs>
        ${shadow(240, 316, 150, 10)}
        <path d="M120 200 C 110 90 170 40 240 40 C 310 40 370 90 360 200" fill="none" stroke="${shade(c, -0.15)}" stroke-width="22" stroke-linecap="round"/>
        <path d="M128 196 C 120 100 175 54 240 54 C 305 54 360 100 352 196" fill="none" stroke="${shade(c, 0.25)}" stroke-width="4" stroke-linecap="round" opacity=".6"/>
        <rect x="88" y="168" width="84" height="138" rx="40" fill="url(#body${uid})"/>
        <rect x="308" y="168" width="84" height="138" rx="40" fill="url(#body${uid})"/>
        <rect x="150" y="180" width="30" height="114" rx="15" fill="${shade(c, -0.45)}"/>
        <rect x="300" y="180" width="30" height="114" rx="15" fill="${shade(c, -0.45)}"/>
        <rect x="104" y="190" width="10" height="34" rx="5" fill="#fff" opacity=".3"/>`;
    },
    speaker(c) {
      let dots = "";
      for (let y = 112; y < 270; y += 12) for (let x = 186; x < 296; x += 12) dots += `<circle cx="${x + ((y / 12) % 2) * 6}" cy="${y}" r="2.2" fill="${shade(c, -0.35)}"/>`;
      return `<defs>${grad("body", shade(c, -0.2), shade(c, 0.2), false)}<clipPath id="cl${uid}"><rect x="176" y="100" width="128" height="180" rx="10"/></clipPath></defs>
        ${shadow(240, 312, 90, 10)}
        <rect x="164" y="70" width="152" height="240" rx="38" fill="url(#body${uid})"/>
        <g clip-path="url(#cl${uid})">${dots}</g>
        <rect x="224" y="78" width="32" height="8" rx="4" fill="${shade(c, -0.4)}"/>
        <path d="M316 120 C 350 120 350 170 316 170" stroke="${shade(c, -0.3)}" stroke-width="8" fill="none"/>
        <rect x="174" y="80" width="10" height="210" rx="5" fill="#fff" opacity=".18"/>`;
    },
    hub(c) {
      const port = (x, w, h = 10) => `<rect x="${x}" y="${178 - h / 2}" width="${w}" height="${h}" rx="2" fill="#15171b"/>`;
      return `<defs>${grad("body", shade(c, 0.25), shade(c, -0.2))}</defs>
        ${shadow(250, 222, 170, 10)}
        <path d="M70 178 C 40 178 30 140 40 110 C 50 80 30 60 14 56" stroke="#1b1d21" stroke-width="9" fill="none" stroke-linecap="round"/>
        <rect x="70" y="140" width="340" height="76" rx="18" fill="url(#body${uid})"/>
        <rect x="70" y="140" width="340" height="6" rx="3" fill="#fff" opacity=".35"/>
        ${port(110, 30, 12)}${port(156, 26)}${port(194, 26)}${port(236, 18, 7)}${port(266, 18, 7)}${port(298, 26, 18)}${port(338, 34, 4)}${port(380, 16, 3)}
        <circle cx="96" cy="178" r="3" fill="#7cd38c"/>`;
    },
    ssd(c) {
      return `<defs>${grad("body", shade(c, 0.25), shade(c, -0.2), false)}</defs>
        ${shadow(240, 290, 130, 10)}
        <path d="M330 150 C 400 150 410 220 450 230" stroke="#1b1d21" stroke-width="8" fill="none" stroke-linecap="round"/>
        <rect x="140" y="70" width="190" height="210" rx="22" fill="url(#body${uid})"/>
        <rect x="152" y="82" width="166" height="186" rx="14" fill="none" stroke="${shade(c, -0.25)}" stroke-width="2"/>
        <text x="235" y="186" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="20" letter-spacing="4" fill="${isLight(c) ? shade(c, -0.45) : shade(c, 0.45)}">VAULT</text>
        <circle cx="235" cy="240" r="4" fill="#2346ff"/>
        <rect x="320" y="142" width="16" height="16" rx="3" fill="#15171b"/>`;
    },
    charger(c) {
      const dark = isLight(c) ? "#9aa0a6" : shade(c, -0.4);
      return `<defs>${grad("body", shade(c, 0.12), shade(c, -0.12))}</defs>
        ${shadow(236, 296, 110, 10)}
        <path d="M160 100 L300 100 Q330 100 330 130 L330 270 Q330 290 310 290 L180 290 Q160 290 160 270 Z" fill="url(#body${uid})"/>
        <rect x="200" y="136" width="44" height="14" rx="7" fill="${dark}"/>
        <rect x="200" y="166" width="44" height="14" rx="7" fill="${dark}"/>
        <rect x="200" y="198" width="44" height="16" rx="3" fill="${dark}"/>
        <text x="245" y="262" text-anchor="middle" font-family="Manrope, sans-serif" font-weight="800" font-size="16" fill="${dark}">100W</text>
        <rect x="128" y="160" width="34" height="12" rx="6" fill="#c9ccd1"/>
        <rect x="128" y="220" width="34" height="12" rx="6" fill="#c9ccd1"/>`;
    },
    router(c) {
      const tower = (x, h) => `<rect x="${x}" y="${300 - h}" width="96" height="${h}" rx="30" fill="url(#body${uid})"/><rect x="${x + 10}" y="${300 - h + 10}" width="10" height="${h - 40}" rx="5" fill="#fff" opacity=".5"/><circle cx="${x + 48}" cy="${300 - h + 26}" r="4" fill="#2346ff"/>`;
      return `<defs>${grad("body", shade(c, 0.1), shade(c, -0.1), false)}</defs>
        ${shadow(240, 304, 160, 10)}
        ${tower(118, 210)}${tower(266, 210)}
        <path d="M216 120 a 40 40 0 0 1 48 0 M226 134 a 22 22 0 0 1 28 0" stroke="#2346ff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="240" cy="148" r="5" fill="#2346ff"/>`;
    },
    webcam(c) {
      return `<defs>${grad("body", shade(c, 0.2), shade(c, -0.15))}<radialGradient id="lens${uid}"><stop offset="0" stop-color="#4a6bff"/><stop offset=".35" stop-color="#101320"/><stop offset="1" stop-color="#05060a"/></radialGradient></defs>
        ${shadow(240, 302, 120, 10)}
        <path d="M200 196 L180 296 H300 L280 196 Z" fill="${shade(c, -0.1)}"/>
        <rect x="80" y="110" width="320" height="96" rx="48" fill="url(#body${uid})"/>
        <circle cx="240" cy="158" r="36" fill="${shade(c, -0.4)}"/>
        <circle cx="240" cy="158" r="27" fill="url(#lens${uid})"/>
        <circle cx="231" cy="149" r="6" fill="#fff" opacity=".55"/>
        <circle cx="140" cy="158" r="5" fill="${shade(c, -0.45)}"/><circle cx="340" cy="158" r="5" fill="${shade(c, -0.45)}"/>
        <circle cx="300" cy="140" r="3" fill="#7cd38c"/>
        <rect x="96" y="118" width="120" height="8" rx="4" fill="#fff" opacity=".18"/>`;
    },
  };

  /** Zwraca znacznik <svg> dla produktu w danym kolorze. */
  function render(product, colorId, { label = true } = {}) {
    uid += 1;
    const color = window.STORE.COLORS[colorId] ?? window.STORE.COLORS[product.colors[0]];
    const body = draw[product.art](color.hex);
    const a11y = label ? `role="img" aria-label="${product.name} — kolor ${color.name.toLowerCase()} (ilustracja)"` : `aria-hidden="true"`;
    return `<svg viewBox="0 0 480 340" ${a11y} xmlns="http://www.w3.org/2000/svg"><defs><filter id="b${uid}" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="7"/></filter></defs>${body}</svg>`;
  }

  return { render };
})();
