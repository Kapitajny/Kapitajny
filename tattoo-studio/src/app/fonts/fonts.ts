import localFont from "next/font/local";

/**
 * Fonty serwowane z własnego serwera — podzbiory generowane skryptem `scripts/subset-fonts.py`
 * (łacina z polskimi znakami + tylko kanji używane na stronie). Licencja: SIL OFL 1.1 (OFL.txt).
 */
export const shippori = localFont({
  src: [
    { path: "./shippori-mincho-400.woff2", weight: "400", style: "normal" },
    { path: "./shippori-mincho-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-shippori",
  display: "swap",
  fallback: ["Hiragino Mincho ProN", "Yu Mincho", "Georgia", "serif"],
});

export const zenKaku = localFont({
  src: [
    { path: "./zen-kaku-gothic-400.woff2", weight: "400", style: "normal" },
    { path: "./zen-kaku-gothic-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-zen-kaku",
  display: "swap",
  fallback: ["Hiragino Sans", "Yu Gothic", "system-ui", "sans-serif"],
});
