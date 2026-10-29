"use client";

/** Ostatnia linia obrony: błąd w głównym layoucie. Musi zawierać własne <html> i <body>. */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="pl">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "3rem 1.5rem", color: "#243244", maxWidth: "40rem", margin: "0 auto" }}>
        <h1 style={{ color: "#10243A", fontSize: "2rem", lineHeight: 1.2 }}>Serwis jest chwilowo niedostępny</h1>
        <p style={{ marginTop: "1rem" }}>Wystąpił błąd uniemożliwiający wyświetlenie strony. Spróbuj ponownie za chwilę.</p>
        <button
          type="button"
          onClick={() => retry()}
          style={{ marginTop: "1.5rem", padding: "0.75rem 1.25rem", background: "#246BFD", color: "#fff", border: 0, borderRadius: 8, fontSize: "1rem", cursor: "pointer" }}
        >
          Spróbuj ponownie
        </button>
      </body>
    </html>
  );
}
