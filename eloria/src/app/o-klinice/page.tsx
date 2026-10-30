import type { Metadata } from "next";
import Image from "next/image";
import logo from "../../../public/brand/eloria-logo.png";
import { BookingCta } from "@/components/ui/BookingCta";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "O klinice",
  description:
    "ÉLORIA to kameralna klinika medycyny estetycznej i kosmetologii w Śródmieściu Warszawy. Poznaj nasze podejście, przebieg współpracy i standardy bezpieczeństwa.",
  alternates: { canonical: "/o-klinice" },
  openGraph: { title: "O klinice ÉLORIA", url: "/o-klinice" },
};

const journey = [
  { title: "Kontakt", text: "Dzwonisz lub wysyłasz zapytanie. Koordynatorka pomaga wybrać właściwą konsultację i termin." },
  { title: "Konsultacja", text: "Rozmowa z lekarzem lub kosmetologiem, wywiad i ocena skóry. Bez zobowiązań." },
  { title: "Plan", text: "Otrzymujesz propozycję postępowania na piśmie – z alternatywami, harmonogramem i kosztami." },
  { title: "Zabieg", text: "Po kwalifikacji i podpisaniu świadomej zgody, w terminie, który Ci odpowiada." },
  { title: "Opieka po zabiegu", text: "Zalecenia, kontakt w razie pytań i wizyta kontrolna, jeśli jest potrzebna." },
];

const standards = [
  { title: "Kwalifikacja i świadoma zgoda", text: "Przed każdym zabiegiem medycznym lekarz zbiera wywiad, omawia ryzyko i alternatywy. Zgodę podpisujesz po rozmowie." },
  { title: "Dokumentacja", text: "Prowadzimy dokumentację medyczną każdej pacjentki, a za zgodą – dokumentację fotograficzną postępów." },
  { title: "Higiena i materiały", text: "Pracujemy na materiałach jednorazowych i sterylizowanych narzędziach, zgodnie z procedurami sanitarnymi." },
  { title: "Legalne preparaty", text: "Stosujemy wyłącznie wyroby i preparaty dopuszczone do obrotu, z udokumentowanym pochodzeniem." },
  { title: "Prywatność", text: "Dane o zdrowiu przetwarzamy tylko w zakresie niezbędnym do udzielenia świadczeń i chronimy je zgodnie z RODO." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "O klinice", path: "/o-klinice" }])} />
      <PageIntro
        breadcrumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/o-klinice", label: "O klinice" },
        ]}
        title={
          <>
            Klinika, w której
            <br className="hidden sm:block" /> jest czas na rozmowę
          </>
        }
        lede="ÉLORIA to kameralna klinika medycyny estetycznej i kosmetologii w warszawskim Śródmieściu. Łączymy wiedzę lekarza i kosmetologa, żeby opieka nad skórą była spójna – od pierwszej rozmowy po wizytę kontrolną."
      />

      <section aria-labelledby="podejscie" className="frame grid gap-y-12 pb-24 md:grid-cols-12 md:gap-x-8 lg:pb-32">
        <div className="relative aspect-[4/5] overflow-hidden bg-blush md:col-span-5">
          <Photo image="aboutFacade" sizes="(min-width: 768px) 40vw, 100vw" />
        </div>
        <div className="md:col-span-6 md:col-start-7 md:pt-24">
          <h2 id="podejscie" className="text-[clamp(2.25rem,4vw,3.25rem)]">
            Nasze podejście
          </h2>
          <div className="prose-body mt-8 text-base sm:text-lg">
            <p>
              Medycyna estetyczna nie musi oznaczać pośpiechu ani pakietów zabiegów kupowanych „na zapas”. W ÉLORIA zaczynamy od rozmowy: o tym, co
              chcesz zmienić, co lubisz w swojej twarzy i ile czasu chcesz poświęcać pielęgnacji.
            </p>
            <p>
              Zabiegi lekarskie wykonuje lekarz, zabiegi pielęgnacyjne i terapie skóry – kosmetolodzy. Pracujemy na wspólnej dokumentacji, więc nie
              musisz opowiadać swojej historii od nowa przy każdej wizycie.
            </p>
            <p>Jeśli uznamy, że zabieg nie jest Ci potrzebny albo nie jest dla Ciebie bezpieczny, powiemy to wprost.</p>
          </div>
        </div>
      </section>

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-blush sm:aspect-[21/9]">
        <Photo image="aboutLight" sizes="100vw" />
      </div>

      <section aria-labelledby="wspolpraca" className="frame py-24 lg:py-32">
        <h2 id="wspolpraca" className="max-w-xl text-[clamp(2.25rem,4vw,3.25rem)]">
          Jak wygląda współpraca
        </h2>
        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {journey.map((step, i) => (
            <li key={step.title} className="border-t border-espresso/30 pt-6">
              <span aria-hidden="true" className="font-serif text-lg italic text-champagne-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-serif text-2xl">{step.title}</h3>
              <p className="mt-3 text-sm text-taupe">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="standardy" className="bg-blush">
        <div className="frame grid gap-y-12 py-24 lg:grid-cols-12 lg:gap-x-8 lg:py-32">
          <div className="lg:col-span-4">
            <h2 id="standardy" className="text-[clamp(2.25rem,4vw,3.25rem)]">
              Standardy bezpieczeństwa
            </h2>
            <p className="mt-6 max-w-sm text-taupe">Zasady, których przestrzegamy przy każdej wizycie – niezależnie od rodzaju zabiegu.</p>
          </div>
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {standards.map((s) => (
              <div key={s.title}>
                <dt className="font-serif text-2xl leading-tight">{s.title}</dt>
                <dd className="mt-3 text-sm text-taupe sm:text-base">{s.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="znak" className="frame grid items-center gap-y-12 py-24 md:grid-cols-12 md:gap-x-8 lg:py-32">
        <div className="mx-auto w-3/5 max-w-xs md:col-span-4 md:w-full">
          <Image src={logo} alt="Logo ÉLORIA Aesthetic Clinic: litera E z wpisanym profilem kobiecej twarzy, w łukowej ramie" sizes="(min-width: 768px) 30vw, 60vw" />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 id="znak" className="text-[clamp(2.25rem,4vw,3.25rem)]">
            Znak ÉLORIA
          </h2>
          <div className="prose-body mt-8 text-base sm:text-lg">
            <p>
              W literę E wpisany jest profil twarzy poprowadzony jedną, cienką linią. To przypomnienie, że w centrum każdej wizyty jest osoba – nie
              zabieg.
            </p>
            <p>Łukowa rama nawiązuje do okien warszawskich kamienic. Ten sam łuk powtarzamy na stronie, w kadrze gabinetu na stronie głównej.</p>
          </div>
        </div>
      </section>

      <BookingCta />
    </>
  );
}
