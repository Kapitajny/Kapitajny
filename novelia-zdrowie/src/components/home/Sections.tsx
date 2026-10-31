import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { mainProduct, products } from "@/data/products";
import { formatAmount, formatPrice } from "@/lib/format";
import { BuyNowButton } from "@/components/cart/BuyButtons";
import { Cover } from "@/components/product/Cover";
import { DeviceMockup } from "@/components/product/DeviceMockup";
import { PreviewGallery } from "@/components/product/PreviewGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { CheckIcon, CompassIcon, DeviceIcon, DownloadIcon, FileIcon, LeafIcon, LockIcon, SparkIcon, BookIcon, CardIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { FAQ_ITEMS } from "@/data/faq";

function SectionHead({ eyebrow, title, intro, light = false, center = false }: { eyebrow: string; title: ReactNode; intro?: ReactNode; light?: boolean; center?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className={`eyebrow ${light ? "!text-sage" : ""}`}>{eyebrow}</p>
      <span className={`gold-rule mt-5 ${center ? "mx-auto" : ""}`} />
      <h2 className={`mt-6 text-[clamp(2rem,1.3rem+2.6vw,3.25rem)] ${light ? "!text-cream" : ""}`}>{title}</h2>
      {intro && <div className={`mt-5 text-lg leading-relaxed ${light ? "text-cream/75" : "text-muted"}`}>{intro}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ 1. HERO */
export function Hero() {
  const p = mainProduct;
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-paper">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[42%] bg-beige/70 lg:block" />
      <div className="container-x relative grid items-center gap-14 pb-20 pt-8 sm:pt-12 lg:grid-cols-12 lg:gap-10 lg:pb-28 lg:pt-16">
        <div className="lg:col-span-6 xl:col-span-6">
          <p className="eyebrow">NOVELIA ZDROWIE · e-book</p>
          <h1 id="hero-title" className="mt-6 text-[clamp(2.5rem,1.6rem+3.8vw,4.6rem)] leading-[1.04]">
            Zdrowe jedzenie, które zmieści się <em className="font-normal italic text-olive">w&nbsp;Twoim dniu</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            „Zdrowiej każdego dnia” to 32 proste przepisy na śniadania, obiady, kolacje i przekąski, plan posiłków na 3 dni z listą zakupów oraz praktyczny poradnik –
            bez restrykcyjnych diet i skomplikowanych składników.
          </p>
          <ul className="mt-7 grid gap-2.5 text-[1rem] sm:grid-cols-2">
            {["Gramatury i wartości odżywcze", "Większość dań w 15–40 minut", "Plan na 3 dni + lista zakupów", "Zasady zbilansowanego talerza"].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckIcon size={20} className="mt-0.5 shrink-0 text-olive" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:gap-8">
            <div>
              <p className="text-sm text-muted">Cena e-booka</p>
              <p className="font-serif text-5xl leading-none text-forest">
                {formatAmount(p.price)} <span className="text-2xl">zł</span>
              </p>
            </div>
            <BuyNowButton slug={p.slug} label="Kup teraz" className="btn btn-primary w-full px-10 sm:w-auto" />
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <FileIcon size={18} className="text-olive" /> E-book PDF · A4 · 50 stron
            </span>
            <span className="inline-flex items-center gap-2">
              <DownloadIcon size={18} className="text-olive" /> Pobranie po potwierdzeniu płatności
            </span>
          </p>
        </div>

        <div className="lg:col-span-6 lg:pl-6 xl:pl-12">
          <DeviceMockup product={p} pageSrcs={["/images/ebooks/zdrowiej-kazdego-dnia/strona-11.jpg", "/images/ebooks/zdrowiej-kazdego-dnia/strona-22.jpg"]} priority />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 2. POZNAJ E-BOOKA */
export function MeetEbook() {
  const p = mainProduct;
  return (
    <section id="ebook" aria-labelledby="ebook-title" className="scroll-mt-20 bg-cream py-20 lg:py-28">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="mx-auto max-w-[22rem] lg:sticky lg:top-28">
              <Cover product={p} sizes="(min-width: 1024px) 22rem, 70vw" />
              <dl className="mt-8 grid grid-cols-2 gap-px bg-line text-center">
                {[
                  ["50", "stron A4"],
                  ["32", "przepisy"],
                  ["3 dni", "plan posiłków"],
                  ["PDF", "na każde urządzenie"],
                ].map(([v, l]) => (
                  <div key={l} className="bg-cream px-3 py-4">
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className="block font-serif text-2xl text-forest">{v}</span>
                      <span className="text-xs uppercase tracking-[0.16em] text-muted">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHead eyebrow="Poznaj e-booka" title={<span id="ebook-title">„Zdrowiej każdego dnia”</span>} intro={<p>{p.subtitle}.</p>} />
            <div className="mt-8 space-y-4 text-[1.05rem] leading-relaxed">
              {p.description.map((d) => (
                <p key={d}>{d}</p>
              ))}
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-2">
              <div>
                <h3 className="text-2xl">Najważniejsze korzyści</h3>
                <ul className="mt-5 space-y-3">
                  {p.benefits.map((b) => (
                    <li key={b} className="flex gap-3">
                      <CheckIcon size={20} className="mt-1 shrink-0 text-olive" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-forest p-7 text-cream sm:p-8">
                <h3 className="text-2xl !text-cream">Dla kogo jest ten e-book?</h3>
                <p className="mt-3 text-cream/75">Dla Ciebie, jeśli:</p>
                <ul className="mt-4 space-y-3">
                  {p.audience.map((a) => (
                    <li key={a} className="flex gap-3 text-cream/90">
                      <LeafIcon size={18} className="mt-1 shrink-0 text-gold-soft" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-14">
              <h3 className="text-2xl">Zajrzyj do środka</h3>
              <p className="mt-2 text-muted">Przykładowe strony publikacji – kliknij, aby powiększyć.</p>
              <div className="mt-6">
                <PreviewGallery pages={p.previews} title={p.title} />
              </div>
            </div>

            <div className="mt-12 flex flex-col items-start gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted">
                Format PDF · 50 stron · natychmiastowy dostęp po zaksięgowaniu płatności
              </p>
              <BuyNowButton slug={p.slug} label={`Kup e-book za ${formatPrice(p.price)}`} className="btn btn-primary w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 3. CO ZNAJDZIESZ W ŚRODKU */
const INSIDE = [
  { img: "podstawy", no: "I", title: "Podstawy świadomego odżywiania", text: "Jak komponować zbilansowany talerz, podstawowe grupy produktów, planowanie dnia i gotowanie z wyprzedzeniem.", pages: "s. 4–10" },
  { img: "sniadania", no: "II", title: "10 zdrowych śniadań", text: "Owsianka z gruszką, szakszuka, jaglanka kakaowa, placuszki owsiano-bananowe, wrapy na wynos i inne.", pages: "s. 11–20" },
  { img: "obiady", no: "III", title: "12 obiadów", text: "Kurczak z jednej blachy, curry z ciecierzycą, łosoś z fasolką, leczo z fasolą, pęczotto, miska z komosą.", pages: "s. 21–32" },
  { img: "kolacje", no: "IV", title: "6 lekkich kolacji", text: "Sałatka z pieczonym burakiem, krem z brokułu i groszku, frittata z pieczarkami, ciepła sałatka z soczewicą.", pages: "s. 33–38" },
  { img: "przekaski", no: "V", title: "4 przekąski", text: "Hummus z pieczonej papryki, kulki z daktyli i kakao, ciasteczka owsiane, pieczone jabłka ze skyrem.", pages: "s. 39–42" },
  { img: "planowanie", no: "VI", title: "Plan posiłków na 3 dni", text: "Gotowy plan dla dwóch osób z wykorzystaniem resztek, automatycznie zsumowana lista zakupów i organizacja kuchni.", pages: "s. 43–45" },
  { img: "poradnik", no: "VII", title: "Praktyczny poradnik", text: "Jak czytać etykiety, komponować urozmaicone posiłki, ograniczać marnowanie żywności – i jak utrzymać nowe nawyki.", pages: "s. 46–49" },
];

export function Inside() {
  return (
    <section id="w-srodku" aria-labelledby="inside-title" className="scroll-mt-20 py-20 lg:py-28">
      <div className="container-x">
        <SectionHead
          eyebrow="Co znajdziesz w środku?"
          title={<span id="inside-title">Siedem rozdziałów, jedna spójna całość</span>}
          intro={<p>Od zasad komponowania posiłków, przez 32 przepisy, po plan na 3 dni i praktyczny poradnik. Każdy przepis zawiera gramatury, czas, liczbę porcji i orientacyjne wartości odżywcze.</p>}
        />
        <ul className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {INSIDE.map((item, i) => (
            <Reveal as="li" key={item.no} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <div className="relative aspect-[4/3] overflow-hidden bg-beige">
                <Image src={`/images/ilustracje/${item.img}.jpg`} alt="" fill sizes="(min-width: 1024px) 26rem, (min-width: 640px) 45vw, 92vw" className="object-cover transition-transform duration-700 hover:scale-[1.03]" />
                <span className="absolute left-0 top-0 bg-paper px-3.5 py-2 font-serif text-lg text-forest">{item.no}</span>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="text-2xl">{item.title}</h3>
                <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-muted">{item.pages}</span>
              </div>
              <p className="mt-2 leading-relaxed text-muted">{item.text}</p>
            </Reveal>
          ))}
          <Reveal as="li" className="flex flex-col justify-center bg-forest p-8 text-cream sm:col-span-2 lg:col-span-2">
            <p className="eyebrow !text-sage">Uczciwie o wartościach odżywczych</p>
            <p className="mt-4 font-serif text-2xl leading-snug text-cream sm:text-3xl">
              Kaloryczność i makroskładniki obliczyliśmy na podstawie gramatur składników i ogólnodostępnych tabel składu żywności. Są orientacyjne – i tak je oznaczamy.
            </p>
            <p className="mt-4 text-cream/70">Publikacja ma charakter edukacyjny i nie zastępuje konsultacji z lekarzem lub dietetykiem.</p>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 4. DLACZEGO NOVELIA */
const PILLARS = [
  { icon: LeafIcon, title: "Świadome odżywianie", text: "Uczymy patrzeć na talerz całościowo: proporcje, różnorodność i jakość produktów zamiast liczenia każdej kalorii i listy zakazów." },
  { icon: CompassIcon, title: "Praktyczne rozwiązania", text: "Przepisy z produktów dostępnych w każdym sklepie, gotowanie na dwa dni, listy zakupów i plany, które da się wdrożyć od jutra." },
  { icon: BookIcon, title: "Przystępna wiedza", text: "Piszemy prostym językiem i nie obiecujemy cudów. Dzielimy się wiedzą, która pomaga podejmować własne, rozsądne decyzje." },
  { icon: SparkIcon, title: "Inspiracje na co dzień", text: "Zamienniki składników, pomysły na resztki i sezonowe warianty – tak, by zdrowa kuchnia nigdy się nie nudziła." },
];

export function WhyNovelia() {
  return (
    <section aria-labelledby="why-title" className="bg-forest py-20 text-cream lg:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHead
            light
            eyebrow="Dlaczego NOVELIA ZDROWIE?"
            title={<span id="why-title">Zdrowe nawyki zaczynają się od prostych wyborów</span>}
            intro={<p>Jesteśmy wydawnictwem cyfrowym, które tworzy przystępne publikacje o zdrowym odżywianiu – dla osób, które chcą jeść lepiej, ale żyją w prawdziwym, zabieganym świecie.</p>}
          />
          <div className="relative mt-10 hidden aspect-[4/3] overflow-hidden lg:block">
            <Image src="/images/ilustracje/smoothie.jpg" alt="" fill sizes="32rem" className="object-cover" />
          </div>
        </div>
        <ul className="grid gap-px self-start bg-cream/10 sm:grid-cols-2 lg:col-span-7">
          {PILLARS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} className="bg-forest p-7 sm:p-9">
              <span className="font-serif text-sm text-gold-soft">0{i + 1}</span>
              <Icon size={30} className="mt-4 text-gold-soft" />
              <h3 className="mt-5 text-2xl !text-cream">{title}</h3>
              <p className="mt-3 leading-relaxed text-cream/75">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 5. SKLEP */
export function ShopSection({ available }: { available: Record<string, boolean> }) {
  return (
    <section id="sklep" aria-labelledby="shop-title" className="scroll-mt-20 bg-cream py-20 lg:py-28">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Sklep NOVELIA" title={<span id="shop-title">Publikacje NOVELIA ZDROWIE</span>} intro={<p>E-booki w formacie PDF, gotowe do pobrania po opłaceniu zamówienia.</p>} />
          <Link href="/sklep" className="btn btn-outline self-start md:self-auto">
            Przejdź do sklepu
          </Link>
        </div>
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} available={available[product.slug] ?? false} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 6. JAK TO DZIAŁA */
const STEPS = [
  { icon: BookIcon, title: "Wybierasz e-book", text: "Dodajesz publikację do koszyka lub klikasz „Kup teraz”. Podajesz adres e-mail, na który wyślemy link." },
  { icon: CardIcon, title: "Dokonujesz płatności", text: "Płacisz bezpiecznie na stronie operatora płatności. Nie przechowujemy danych Twojej karty." },
  { icon: DownloadIcon, title: "Pobierasz publikację", text: "Po potwierdzeniu płatności link do pliku PDF pojawi się na ekranie i trafi na Twój adres e-mail." },
];

export function HowItWorks() {
  return (
    <section id="jak-to-dziala" aria-labelledby="how-title" className="scroll-mt-20 py-20 lg:py-28">
      <div className="container-x">
        <SectionHead center eyebrow="Jak to działa?" title={<span id="how-title">Trzy proste kroki</span>} />
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal as="li" key={title} className="relative border-t border-line pt-8 text-center md:text-left">
              <span className="absolute -top-px left-1/2 h-px w-16 -translate-x-1/2 bg-gold md:left-0 md:translate-x-0" />
              <span className="font-serif text-5xl text-sand">{i + 1}</span>
              <Icon size={28} className="mx-auto mt-4 text-olive md:mx-0" />
              <h3 className="mt-4 text-2xl">{title}</h3>
              <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted md:mx-0">{text}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <LockIcon size={18} className="text-olive" /> Szyfrowane połączenie i płatności
          </span>
          <span className="inline-flex items-center gap-2">
            <DeviceIcon size={18} className="text-olive" /> Telefon, tablet, komputer, czytnik PDF
          </span>
          <span className="inline-flex items-center gap-2">
            <DownloadIcon size={18} className="text-olive" /> Możliwość ponownego pobrania
          </span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 7. FAQ */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 bg-beige/60 py-20 lg:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHead eyebrow="FAQ" title={<span id="faq-title">Najczęstsze pytania</span>} intro={<p>Nie ma tu odpowiedzi na Twoje pytanie? <Link href="/kontakt" className="link text-forest">Napisz do nas</Link>.</p>} />
        </div>
        <div className="divide-y divide-sand border-y border-sand lg:col-span-8">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4 font-serif text-xl text-forest">
                {item.q}
                <span aria-hidden="true" className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-forest" />
                  <span className="absolute left-1/2 top-0 h-4 w-px bg-forest transition-transform duration-300 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <div className="pb-6 pr-10 leading-relaxed text-muted">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ 8. KOŃCOWE CTA */
export function FinalCta() {
  const p = mainProduct;
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden bg-forest-deep text-cream">
      <div className="container-x grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-24">
        <div className="order-2 lg:order-1 lg:col-span-7">
          <p className="eyebrow !text-sage">Zacznij jeszcze dziś</p>
          <span className="gold-rule mt-5" />
          <h2 id="cta-title" className="mt-6 text-[clamp(2.2rem,1.4rem+3vw,3.8rem)] !text-cream">
            Każdy lepszy wybór się liczy. Zacznij od jutrzejszego śniadania.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
            32 przepisy, plan posiłków na 3 dni i praktyczny poradnik w jednym pliku PDF. Pobierzesz go od razu po potwierdzeniu płatności.
          </p>
          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <p className="font-serif text-5xl leading-none text-gold-soft">
              {formatAmount(p.price)} <span className="text-2xl">zł</span>
            </p>
            <BuyNowButton slug={p.slug} label="Kup teraz" className="btn btn-gold w-full px-12 sm:w-auto" />
          </div>
        </div>
        <div className="order-1 mx-auto w-full max-w-[17rem] lg:order-2 lg:col-span-5 lg:max-w-[20rem]">
          <Cover product={p} sizes="20rem" />
        </div>
      </div>
    </section>
  );
}
