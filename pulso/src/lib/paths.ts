/** Ścieżka z uwzględnieniem podkatalogu publikacji (np. GitHub Pages: /demo/pulso). */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
