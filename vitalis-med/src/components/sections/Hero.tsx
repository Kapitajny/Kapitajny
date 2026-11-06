import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";

export function Hero() {
  const { contact } = siteConfig;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line bg-white">
      {/* Zdjęcie: na dużych ekranach wypełnia prawą połowę aż do krawędzi okna */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[52%]">
        <Image
          src="/images/flota/hero-flota.webp"
          alt="Nowoczesne ambulanse Mercedes-Benz Sprinter z włączonymi sygnałami świetlnymi przed bazą"
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          loading="eager"
          fetchPriority="high"
          quality={85}
          className="object-cover object-[62%_50%]"
        />
      </div>

      <div className="container-x relative">
        <div className="max-w-xl py-14 sm:py-16 lg:w-[44%] lg:max-w-none lg:py-24 xl:py-28">
          <h1 id="hero-title" className="h-display hero-in">
            Profesjonalna pomoc medyczna. Bezpieczeństwo, na którym możesz polegać.
          </h1>
          <p className="lead hero-in mt-7 max-w-[36rem]" style={{ ["--d" as string]: "100ms" }}>
            Zapewniamy profesjonalne ratownictwo medyczne, transport sanitarny i medyczny oraz kompleksową obsługę pacjentów. Działamy z myślą
            o bezpieczeństwie i komforcie każdego pacjenta.
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "200ms" }}>
            <Link href="/uslugi" className="btn btn-dark">
              Poznaj nasze usługi
            </Link>
            <Link href="/kontakt" className="btn btn-outline">
              Skontaktuj się z nami
            </Link>
          </div>

          {/* Najważniejsza informacja dla osoby szukającej transportu: numer dyspozytorni. */}
          <a
            href={contact.phoneHref}
            className="hero-in group mt-12 flex items-center gap-5 border-t border-line pt-8 lg:mt-16"
            style={{ ["--d" as string]: "300ms" }}
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red text-white transition-colors group-hover:bg-red-dark">
              <Icon name="phone" size={24} />
            </span>
            <span>
              <span className="block text-[0.95rem] text-muted">Dyspozytornia transportu, całą dobę</span>
              <span
                className="mt-0.5 block font-display text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.4rem]"
                style={{ fontStretch: "86%" }}
              >
                {contact.phoneDisplay}
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
