import { Archivo } from "next/font/google";

/** Archivo – zmienna szerokość 62–125: „głos sygnału” (szeroki) i „głos ulicy” (ściśnięty) w jednej rodzinie. */
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});
