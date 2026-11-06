import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icons";
import { orderHref, siteConfig } from "@/config/site";
import { fleetTotal } from "@/data/fleet";

const actions: { href: string; title: string; icon: IconName }[] = [
  { href: "/cennik", title: "Cennik usług", icon: "card" },
  { href: "/nfz", title: "Świadczenia NFZ", icon: "document" },
  { href: "/flota", title: "Nasza flota", icon: "ambulance" },
];

export function Hero() {
  const { contact } = siteConfig;
  const facts = [
    { k: String(fleetTotal), v: "ambulansów typu T, S i P" },
    { k: "ok. 200", v: "pracowników medycznych" },
    { k: "24/7", v: "dyspozytornia transportu" },
  ];
  return (
    <section aria-labelledby="hero-title" className="bg-white pt-3 lg:pt-5">
      <div className="container-x">
        <div className="panel relative grid overflow-hidden lg:min-h-[36rem] lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)]">
          <div className="relative z-10 px-6 pb-8 pt-10 sm:px-10 lg:py-20 lg:pl-16 lg:pr-4">
            <h1 id="hero-title" className="h-display hero-in max-w-[19ch]">
              Profesjonalna pomoc medyczna. Bezpieczeństwo, na którym możesz polegać.
            </h1>
            <p className="lead hero-in mt-6 max-w-[34rem]" style={{ ["--d" as string]: "80ms" }}>
              Zapewniamy profesjonalne ratownictwo medyczne, transport sanitarny i&nbsp;medyczny oraz kompleksową obsługę pacjentów. Działamy z&nbsp;myślą
              o&nbsp;bezpieczeństwie i&nbsp;komforcie każdego pacjenta.
            </p>
            <div className="hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "160ms" }}>
              <Link href="/uslugi" className="btn btn-dark">
                Poznaj nasze usługi
              </Link>
              <Link href="/kontakt" className="btn btn-outline">
                Skontaktuj się z&nbsp;nami
              </Link>
            </div>
            <dl className="hero-in mt-12 grid max-w-[34rem] grid-cols-3 gap-3 sm:gap-4" style={{ ["--d" as string]: "240ms" }}>
              {facts.map((f) => (
                <div key={f.v} className="border-l border-line-strong pl-3 sm:pl-4">
                  <dt className="sr-only">{f.v}</dt>
                  <dd className="whitespace-nowrap text-[1.3rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.6rem]">{f.k}</dd>
                  <dd className="mt-1.5 text-[0.8rem] leading-snug text-muted sm:text-[0.88rem]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Wycięty z tła ambulans na jasnym panelu – jak postaci w serwisie CMP */}
          <div className="relative min-h-[16rem] sm:min-h-[22rem] lg:min-h-0">
            <div className="absolute inset-x-4 bottom-12 top-4 sm:inset-x-10 lg:bottom-[19%] lg:left-0 lg:right-12 lg:top-[16%]">
              <div aria-hidden="true" className="vehicle-shadow" />
              <Image
                src="/images/flota/ambulans-s-fiat.webp"
                alt="Ambulans specjalistyczny Vitalis Med w barwach ratownictwa medycznego"
                fill
                sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
                loading="eager"
                fetchPriority="high"
                quality={90}
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>

        {/* Pasek akcji nachodzący na panel – jak w serwisie LUX MED */}
        <nav aria-label="Szybki dostęp" className="relative z-10 mx-auto -mt-8 max-w-[68rem] px-3 sm:px-6 lg:-mt-11">
          <ul className="grid overflow-hidden rounded-[18px] border border-line bg-white shadow-[var(--shadow-soft)] sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
            <li>
              <Link href={orderHref()} className="flex h-full items-center gap-3 bg-red px-6 py-5 text-white transition-colors hover:bg-red-dark">
                <Icon name="ambulance" size={24} className="shrink-0" />
                <span className="font-semibold">Zamów transport medyczny</span>
              </Link>
            </li>
            {actions.map((a) => (
              <li key={a.href} className="border-line max-sm:border-t sm:[&:nth-child(n+3)]:border-t lg:border-l lg:[&:nth-child(n+3)]:border-t-0">
                <Link href={a.href} className="group flex h-full items-center gap-3 px-6 py-5 transition-colors hover:bg-mist">
                  <Icon name={a.icon} size={22} className="shrink-0 text-ink" />
                  <span className="font-semibold text-ink">{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-center text-[0.95rem] text-muted">
            Dyspozytor przyjmuje zgłoszenia całą dobę:{" "}
            <a href={contact.phoneHref} className="font-semibold text-ink underline-offset-4 hover:underline">
              {contact.phoneDisplay}
            </a>
          </p>
        </nav>
      </div>
    </section>
  );
}
