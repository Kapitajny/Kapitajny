import { Gallery } from "@/components/gallery/Gallery";
import { gallery } from "@/data/gallery";

export function Moodboard() {
  return (
    <section aria-labelledby="mood-title" className="bg-blush py-20 sm:py-28">
      <div className="shell">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <h2 id="mood-title" className="script text-[clamp(2.4rem,6vw,4.25rem)]">
            Z naszego studia
          </h2>
          <p className="mt-4 font-light text-stone">Tekstury, rytuały i wnętrza. Kliknij zdjęcie, aby je powiększyć.</p>
        </div>
        <Gallery items={gallery} />
      </div>
    </section>
  );
}
