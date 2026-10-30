import Link from "next/link";
import { Photo } from "@/components/ui/Photo";

export function GalleryPreview() {
  return (
    <section aria-labelledby="wnetrza" className="border-t border-line">
      <div className="frame grid gap-4 py-24 sm:gap-6 md:grid-cols-12 lg:py-32">
        <div className="md:col-span-4 md:pr-6">
          <h2 id="wnetrza" className="text-[clamp(2.5rem,5vw,3.75rem)]">
            Wnętrza
          </h2>
          <p className="mt-6 max-w-sm text-taupe">
            Kremowe ryflowane zabudowy, aksamitne zasłony w kolorze czekolady i złote detale. Gabinety urządziliśmy tak, żeby od progu było w nich
            spokojnie.
          </p>
          <Link href="/galeria" className="link-quiet mt-8 inline-block text-sm font-medium">
            Zobacz galerię
          </Link>
        </div>

        <div className="relative mt-8 aspect-[2/3] overflow-hidden bg-blush md:col-span-3 md:mt-0 md:row-span-2 md:aspect-auto">
          <Photo image="interiorCorridor" sizes="(min-width: 768px) 24vw, 100vw" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden bg-blush">
            <Photo image="interiorLounge" sizes="(min-width: 768px) 20vw, 50vw" />
          </div>
          <div className="relative aspect-[4/5] self-end overflow-hidden bg-blush">
            <Photo image="detailManicureRed" sizes="(min-width: 768px) 20vw, 50vw" />
          </div>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden bg-blush md:col-span-5 md:col-start-8">
          <Photo image="interiorConsultation" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
