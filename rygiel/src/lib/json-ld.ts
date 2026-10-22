/** JSON.stringify nie chroni przed zamknięciem znacznika <script> – zamieniamy znaki istotne dla HTML na sekwencje Unicode. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
