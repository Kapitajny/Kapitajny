/**
 * Pionowy znacznik sekcji (tategaki): japońska nazwa sekcji czytana z góry na dół
 * oraz jej transkrypcja. Pełni rolę „mapy” strony zamiast etykiet nad nagłówkami.
 */
export function SectionMark({
  kanji,
  reading,
  className = "",
}: {
  kanji: string;
  reading: string;
  className?: string;
}) {
  return (
    <div className={`flex select-none items-start gap-2 ${className}`} aria-hidden="true">
      <span className="tategaki text-2xl font-medium">{kanji}</span>
      <span className="tategaki pt-1 font-gothic text-2xs tracking-[0.3em] opacity-60">{reading}</span>
    </div>
  );
}
