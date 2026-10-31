import Image from "next/image";
import type { Product } from "@/data/products";

/**
 * Prezentacja e-booka na tablecie (okładka) i telefonie (przykładowa strona) – wyłącznie CSS,
 * bez ingerencji w samą okładkę.
 */
export function DeviceMockup({ product, pageSrcs, priority = false }: { product: Product; pageSrcs: string[]; priority?: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div aria-hidden="true" className="absolute -inset-x-6 bottom-[-6%] top-[12%] rounded-[50%] bg-forest/10 blur-3xl" />
      {/* Tablet */}
      <div className="relative ml-auto w-[82%] rounded-[2rem] bg-[#1d1f1c] p-[3.2%] shadow-lift ring-1 ring-black/40">
        <div className="relative overflow-hidden rounded-[1.15rem] bg-forest">
          <div className="relative aspect-[1410/2250]">
            <Image src={product.cover.src} alt={product.cover.alt} fill priority={priority} sizes="(min-width: 1024px) 28rem, 80vw" className="object-cover" />
          </div>
        </div>
        <span aria-hidden="true" className="absolute left-1/2 top-[1.3%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/15" />
      </div>
      {/* Telefon */}
      <div className="absolute bottom-[-4%] left-0 w-[34%] rounded-[1.5rem] bg-[#1d1f1c] p-[1.6%] shadow-lift ring-1 ring-black/40">
        {/* Strony PDF przewijane na ekranie telefonu */}
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.1rem] bg-[#e9e6df]">
          <div className="absolute inset-x-0 top-0 space-y-[3%]">
            {pageSrcs.map((src, i) => (
              <div key={src} className="relative aspect-[210/297] w-full bg-paper shadow-sm">
                <Image src={src} alt={i === 0 ? "Przykładowe strony e-booka wyświetlone na telefonie" : ""} fill sizes="(min-width: 1024px) 12rem, 30vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
