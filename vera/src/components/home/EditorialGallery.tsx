import { Gallery } from "@/components/gallery/Gallery";
import { gallery } from "@/data/gallery";

export function EditorialGallery() {
  return (
    <section aria-labelledby="gallery-title" className="bg-powder py-24 sm:py-32 lg:py-40">
      <div className="shell">
        <div className="mb-14 grid gap-6 lg:mb-20 lg:grid-cols-12">
          <h2 id="gallery-title" className="display text-[clamp(3rem,7vw,6.25rem)] text-burgundy lg:col-span-6">
            Galeria
            <br />
            <span className="pl-[0.9em]">studia</span>
          </h2>
          <p className="max-w-sm text-black/80 lg:col-span-4 lg:col-start-9 lg:self-end">
            Tekstury, rytuały i wnętrza studia. Wybierz zdjęcie, aby je powiększyć; strzałkami przechodzisz między zdjęciami.
          </p>
        </div>
        <Gallery items={gallery} />
      </div>
    </section>
  );
}
