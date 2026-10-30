import type { Metadata } from "next";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { BookingCta } from "@/components/ui/BookingCta";
import { PageIntro } from "@/components/ui/PageIntro";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { gallery, galleryGroups } from "@/data/gallery";
import { resolveImage } from "@/lib/images.server";

export const metadata: Metadata = {
  title: "Galeria – wnętrza kliniki",
  description: "Zobacz wnętrza ÉLORIA Aesthetic Clinic w Warszawie: gabinety zabiegowe, strefę oczekiwania i detale, które tworzą atmosferę kliniki.",
  alternates: { canonical: "/galeria" },
  openGraph: { title: "Galeria | ÉLORIA Aesthetic Clinic", url: "/galeria" },
};

export default function GalleryPage() {
  const items = gallery.map((item) => ({ ...item, image: resolveImage(item.image) }));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "Galeria", path: "/galeria" }])} />
      <PageIntro
        breadcrumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/galeria", label: "Galeria" },
        ]}
        title="Galeria"
        lede="Kremowe zabudowy, aksamit w kolorze czekolady, złote detale i dużo światła. Tak wyglądają miejsca, w których spędzisz czas podczas wizyty."
      />
      <section aria-label="Zdjęcia" className="frame pb-24 lg:pb-32">
        <GalleryGrid items={items} groups={galleryGroups} />
      </section>
      <BookingCta title="Zobacz klinikę na żywo" text="Pierwsza wizyta to zawsze konsultacja – to dobra okazja, żeby poznać zespół i wnętrza bez zobowiązań." />
    </>
  );
}
