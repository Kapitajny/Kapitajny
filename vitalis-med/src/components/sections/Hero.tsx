import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";
import { fleetTotal } from "@/data/fleet";

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
        <div aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-line lg:block" />
      </div>

      <div className="container-x relative">
        <div className="max-w-xl py-14 sm:py-16 lg:w-[46%] lg:max-w-none lg:py-28 xl:py-32">
          <p className="eyebrow hero-in">Ratownictwo medyczne · Transport sanitarny i medyczny</p>
          <h1 id="hero-title" className="h-display hero-in mt-6" style={{ ["--d" as string]: "80ms" }}>
            Profesjonalna pomoc medyczna. <span className="text-red">Bezpieczeństwo,</span> na którym możesz polegać.
          </h1>
          <p className="lead hero-in mt-7 max-w-[36rem]" style={{ ["--d" as string]: "160ms" }}>
            Zapewniamy profesjonalne ratownictwo medyczne, transport sanitarny i medyczny oraz kompleksową obsługę pacjentów. Działamy z myślą o
            bezpieczeństwie i komforcie każdego pacjenta.
          </p>
          <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "240ms" }}>
            <Link href="/uslugi" className="btn btn-dark">
              Poznaj nasze usługi
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link href="/kontakt" className="btn btn-outline">
              Skontaktuj się z nami
            </Link>
          </div>

          <dl className="hero-in mt-12 grid grid-cols-3 border-t border-line pt-6 lg:mt-16" style={{ ["--d" as string]: "320ms" }}>
            {[
              { k: "24/7", v: "całodobowa dyspozytornia" },
              { k: String(fleetTotal), v: "ambulansów we flocie" },
              { k: "NFZ", v: "w zakresie kontraktu" },
            ].map((item, i) => (
              <div key={item.k} className={i > 0 ? "border-l border-line pl-4 sm:pl-6" : "pr-4"}>
                <dt className="sr-only">{item.v}</dt>
                <dd className="font-display text-[1.75rem] font-semibold leading-none text-ink sm:text-3xl" style={{ fontStretch: "88%" }}>
                  {item.k}
                </dd>
                <dd className="mt-2 text-[0.9rem] leading-snug text-muted">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Pasek szybkiego kontaktu */}
      <div className="relative border-t border-line bg-white lg:absolute lg:bottom-0 lg:right-0 lg:w-[52%] lg:border-0 lg:bg-transparent">
        <div className="container-x lg:max-w-none lg:px-0">
          <a
            href={contact.phoneHref}
            className="group flex items-center gap-4 py-5 lg:ml-auto lg:w-fit lg:bg-white lg:px-7 lg:py-5 lg:shadow-[var(--shadow-soft)]"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red text-white">
              <Icon name="phone" size={20} />
            </span>
            <span>
              <span className="block text-sm text-muted">Zamówienia transportu – całą dobę</span>
              <span className="block font-display text-2xl font-semibold text-ink group-hover:text-red-dark" style={{ fontStretch: "90%" }}>
                {contact.phoneDisplay}
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
