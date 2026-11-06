import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icons";
import { orderHref, siteConfig } from "@/config/site";

const quickLinks: { href: string; title: string; text: string; icon: IconName }[] = [
  { href: orderHref(), title: "Zamów transport", text: "Formularz zapytania", icon: "ambulance" },
  { href: "/cennik", title: "Cennik usług", text: "Ceny usług prywatnych", icon: "card" },
  { href: "/nfz", title: "Świadczenia NFZ", text: "Zasady i zakres umowy", icon: "document" },
  { href: "/flota", title: "Nasza flota", text: "Typy T, S i P", icon: "shield" },
];

export function Hero() {
  const { contact } = siteConfig;
  return (
    <section aria-labelledby="hero-title" className="bg-white pt-6 lg:pt-8">
      <div className="container-x">
        {/* Baner w obrębie strony: tekst na jasnym panelu, prawdziwe zdjęcie ambulansu po prawej */}
        <div className="panel grid overflow-hidden lg:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-6 py-10 sm:px-10 lg:order-1 lg:px-14 lg:py-16">
            <h1 id="hero-title" className="h-display hero-in max-w-xl">
              Profesjonalna pomoc medyczna. Bezpieczeństwo, na którym możesz polegać.
            </h1>
            <p className="hero-in mt-5 max-w-xl text-[1.08rem] leading-relaxed" style={{ ["--d" as string]: "80ms" }}>
              Zapewniamy profesjonalne ratownictwo medyczne, transport sanitarny i&nbsp;medyczny oraz kompleksową obsługę pacjentów. Działamy z&nbsp;myślą
              o&nbsp;bezpieczeństwie i&nbsp;komforcie każdego pacjenta.
            </p>
            <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "160ms" }}>
              <Link href="/uslugi" className="btn btn-primary">
                Poznaj nasze usługi
              </Link>
              <Link href="/kontakt" className="btn btn-outline">
                Skontaktuj się z&nbsp;nami
              </Link>
            </div>
          </div>
          <div className="relative order-1 aspect-[3/2] lg:order-2 lg:aspect-auto lg:min-h-[26rem]">
            <Image
              src="/images/flota/baner-ambulans.webp"
              alt="Ambulans w barwach ratownictwa medycznego"
              fill
              sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
              loading="eager"
              fetchPriority="high"
              quality={85}
              className="object-cover"
            />
          </div>
        </div>

        {/* Szybki dostęp – jak w serwisach przychodni i szpitali */}
        <nav aria-label="Szybki dostęp" className="mt-4">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <li className="sm:col-span-2 lg:col-span-1">
              <a href={contact.phoneHref} className="flex h-full items-center gap-4 rounded-[8px] bg-red p-5 text-white transition-colors hover:bg-red-dark">
                <Icon name="phone" size={26} className="shrink-0" />
                <span>
                  <span className="block text-sm text-white/90">Dyspozytornia 24/7</span>
                  <span className="block text-xl font-black">{contact.phoneDisplay}</span>
                </span>
              </a>
            </li>
            {quickLinks.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="card card-lift flex h-full items-center gap-3 p-4">
                  <span className="icon-badge h-11 w-11">
                    <Icon name={q.icon} size={20} />
                  </span>
                  <span>
                    <span className="block whitespace-nowrap font-bold text-ink">{q.title}</span>
                    <span className="block text-sm text-muted">{q.text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
