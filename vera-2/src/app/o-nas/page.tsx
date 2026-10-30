import type { Metadata } from "next";
import { CtaBand } from "@/components/ui/CtaBand";
import { PageHead } from "@/components/ui/PageHead";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "O nas",
  description: "VÉRA to kameralne studio medycyny estetycznej i pielęgnacji skóry dla kobiet. Zaczynamy od rozmowy i pracujemy małymi krokami.",
  alternates: { canonical: "/o-nas" },
  openGraph: { title: "O VÉRA Aesthetic Studio", url: "/o-nas" },
};

const promises = [
  { title: "Zawsze najpierw rozmowa", text: "Nie wykonujemy żadnego zabiegu bez konsultacji – nawet jeśli robiłaś go już gdzie indziej." },
  { title: "Bez pakietów na siłę", text: "Serię proponujemy tylko wtedy, gdy Twoja skóra jej potrzebuje. Możesz ją przerwać w każdej chwili." },
  { title: "Bez obietnic bez pokrycia", text: "Mówimy, czego realnie można się spodziewać. Nigdy nie gwarantujemy efektów, bo każda skóra reaguje inaczej." },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        crumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/o-nas", label: "O nas" },
        ]}
        title="Miejsce, w którym możesz zwolnić"
        lede={
          <>
            Nazwa VÉRA pochodzi od łacińskiego <em>vera</em> – prawdziwa. Stworzyliśmy studio dla kobiet, które chcą o siebie dbać i pozostać sobą.
          </>
        }
      />

      {/* Dwa owale nachodzące na siebie – recepcja i gabinet. */}
      <section aria-label="Studio" className="shell">
        <div className="relative mx-auto flex max-w-3xl items-center justify-center">
          <Photo image="treatmentRoom" sizes="(min-width: 640px) 40vw, 60vw" className="oval aspect-[3/4] w-[58%] sm:w-[46%]" focus="60% 55%" />
          <Photo
            image="reception"
            sizes="(min-width: 640px) 32vw, 45vw"
            className="oval -ml-[12%] mt-[18%] aspect-[3/4] w-[44%] border-[6px] border-ivory sm:w-[36%]"
            focus="22% 60%"
          />
        </div>
        <p className="mt-6 text-center text-xs text-stone">Gabinet zabiegowy i recepcja studia.</p>
      </section>

      <section aria-labelledby="story-title" className="shell py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="story-title" className="script text-[clamp(2.4rem,6vw,4rem)]">
            Mniej, ale lepiej
          </h2>
          <div className="mt-8 space-y-5 text-lg font-light leading-relaxed text-black/80">
            <p>
              Wiele kobiet przychodzi do nas po zabiegach, które były za mocne, za szybkie albo po prostu nie dla nich. Dlatego u nas nic nie dzieje się w
              pośpiechu.
            </p>
            <p>
              Pierwsza wizyta to zawsze konsultacja z osobą, która będzie się Tobą opiekować. Rozmawiamy, oglądamy skórę w dziennym świetle i dajemy Ci plan na
              piśmie. Decyzję podejmujesz Ty – w swoim tempie.
            </p>
            <p>Zabiegi medycyny estetycznej wykonuje lekarz. Zabiegi na twarz, peelingi i pielęgnację dłoni – kosmetolodzy.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="promise-title" className="bg-blush py-20 sm:py-28">
        <div className="shell">
          <h2 id="promise-title" className="script text-center text-[clamp(2.4rem,6vw,4rem)]">
            Co Ci obiecujemy
          </h2>
          <ul className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-3">
            {promises.map((p) => (
              <li key={p.title} className="rounded-[2rem] bg-ivory px-7 py-9 text-center">
                <span aria-hidden="true" className="mx-auto mb-5 block h-3 w-5 rounded-full bg-rose" />
                <h3 className="script text-2xl leading-tight">{p.title}</h3>
                <p className="mt-3 text-sm font-light text-stone">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="calm-title" className="shell py-20 sm:py-28">
        <div className="mx-auto grid max-w-5xl items-center gap-12 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-16">
          <Photo image="facialRitual" sizes="(min-width: 640px) 30vw, 70vw" className="capsule mx-auto aspect-[9/14] w-[min(70vw,18rem)]" />
          <div className="text-center sm:text-left">
            <h2 id="calm-title" className="script text-[clamp(2.2rem,5vw,3.4rem)]">
              Tylko Ty i Twoja specjalistka
            </h2>
            <p className="mt-6 font-light text-black/80">
              Dwa gabinety, jedna recepcja i żadnej poczekalni pełnej obcych osób. Wizyty planujemy z zapasem, więc nikt Cię nie pogania, a Ty nie czekasz.
            </p>
            <p className="mt-4 font-light text-black/80">Studio jest na parterze, z wejściem bez schodów od strony dziedzińca.</p>
          </div>
        </div>
      </section>

      <CtaBand title="Poznajmy się" text="Konsultacja to godzina tylko dla Ciebie i pisemny plan do zabrania do domu. Do niczego nie zobowiązuje." />
    </>
  );
}
