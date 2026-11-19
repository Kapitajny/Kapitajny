import Image from "next/image";
import Link from "next/link";
import { workById, workSrc } from "@/config/work";
import { ArrowIcon } from "@/components/ui/Icons";
import { Pattern } from "@/components/ui/Pattern";
import { Reveal } from "@/components/ui/Reveal";
import { SectionMark } from "@/components/ui/SectionMark";

const MOTIFS = [
  { kanji: "龍", name: "Smok", reading: "ryū", meaning: "Siła, mądrość i opiekuńcza moc żywiołu wody." },
  { kanji: "鯉", name: "Karp koi", reading: "koi", meaning: "Wytrwałość i przemiana — karp, który pokonuje wodospad, staje się smokiem." },
  { kanji: "桜", name: "Kwiat wiśni", reading: "sakura", meaning: "Piękno i ulotność chwili." },
  { kanji: "波", name: "Fala", reading: "nami", meaning: "Potęga natury i nieustanny ruch życia." },
  { kanji: "虎", name: "Tygrys", reading: "tora", meaning: "Odwaga, siła i ochrona." },
  { kanji: "般若", name: "Maska Hannya", reading: "hannya", meaning: "Maska teatru nō — gniew i zazdrość, ale też talizman chroniący przed złem." },
];

const APPROACH_STEPS = [
  { title: "Rozmowa", text: "Poznajemy pomysł, jego znaczenie i efekt, który chcesz osiągnąć." },
  { title: "Koncepcja", text: "Na tej podstawie wybieramy kierunek i charakter projektu." },
  { title: "Kompozycja i wielkość", text: "Dopracowujemy układ, skalę i proporcje motywu." },
  { title: "Umiejscowienie", text: "Dobieramy miejsce na ciele, które najlepiej poprowadzi grafikę." },
];

const CRAFT = [
  { term: "Projekt", text: "Rysunek przygotowany z myślą o skórze, a nie przeniesiony wprost z ekranu." },
  { term: "Proporcja", text: "Skala motywu dobrana do miejsca i sylwetki." },
  { term: "Kompozycja", text: "Rytm elementów, tło i przestrzeń wokół motywu." },
  { term: "Precyzja linii", text: "Czysty, pewny kontur prowadzony z wyczuciem." },
  { term: "Kontrast", text: "Świadoma praca światłem, cieniem i czernią." },
  { term: "Ciało", text: "Grafika, która współgra z ruchem i kształtem ciała." },
];

const JOURNEY = [
  { numeral: "一", title: "Pierwszy kontakt", text: "Formularz lub wiadomość z opisem pomysłu." },
  { numeral: "二", title: "Konsultacja", text: "Rozmowa o motywie, stylu, wielkości i miejscu." },
  { numeral: "三", title: "Projekt", text: "Przygotowanie projektu dopasowanego do Ciebie." },
  { numeral: "四", title: "Wykonanie", text: "Sesja w spokojnej, komfortowej atmosferze." },
  { numeral: "五", title: "Pielęgnacja", text: "Wskazówki, jak dbać o tatuaż po sesji." },
];

const VALUES = [
  { kanji: "芸", name: "ARTISTRY", text: "Każdy projekt traktujemy jako indywidualną pracę artystyczną." },
  { kanji: "精", name: "PRECISION", text: "Dbamy o kompozycję, detale i jakość wykonania." },
  { kanji: "個", name: "INDIVIDUALITY", text: "Szanujemy osobisty charakter każdego pomysłu." },
  { kanji: "信", name: "TRUST", text: "Stawiamy na uczciwą komunikację, przejrzyste zasady i świadome decyzje klientów." },
];

export function About() {
  const approachImage = workById("lotus-hip");
  const craftImage = workById("money-mask");

  return (
    <section id="about" aria-labelledby="about-title" className="relative">
      {/* 4.1 — Our Philosophy */}
      <div className="page-x border-t border-sumi/15 pb-20 pt-24 sm:pb-28 sm:pt-32">
        <div className="grid gap-10 lg:grid-cols-12">
          <SectionMark kanji="私たち" reading="about us" className="hidden lg:col-span-1 lg:flex" />
          <Reveal className="lg:col-span-5">
            <h2 id="about-title" className="display display-lg">
              <span className="sr-only">About us. </span>
              MORE THAN INK. A FORM OF ART.
            </h2>
          </Reveal>
          <div className="prose-mincho lg:col-span-5 lg:col-start-8 lg:pt-3">
            <p>
              Tatuaż to coś więcej niż obraz naniesiony na skórę. To osobista historia, emocje, symbolika i sposób wyrażania
              własnej tożsamości.
            </p>
            <p>
              W naszym studio wierzymy, że każdy projekt powinien mieć swój charakter i znaczenie. Nie tworzymy tatuaży według
              jednego schematu. Każdy pomysł traktujemy indywidualnie, zwracając uwagę na estetykę, kompozycję, detale
              i osobiste oczekiwania klienta.
            </p>
            <p>
              Inspirujemy się japońską sztuką, w której znaczenie mają nie tylko przedstawione motywy, ale również ich
              symbolika, proporcje i harmonia.
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-kinari">
        <div className="text-sumi/[0.11]">
          <Pattern kind="asanoha" strokeWidth={0.7} scale={1.15} />
        </div>
        <div className="page-x relative py-20 sm:py-28">
          <Reveal as="blockquote" className="mx-auto max-w-[56rem] bg-kinari px-2 py-6 text-center sm:px-10">
            <p className="font-mincho text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.45] text-pretty">
              Naszym celem jest tworzenie prac, które pozostają wartościowe zarówno wizualnie, jak i emocjonalnie.
            </p>
          </Reveal>
        </div>
      </div>

      {/* 4.2 — Japanese Heritage */}
      <div className="page-x relative overflow-hidden py-24 sm:py-32">
        <div className="absolute -right-24 top-0 hidden h-[26rem] w-[26rem] text-sumi/[0.09] [mask-image:radial-gradient(circle_at_70%_30%,black,transparent_70%)] md:block">
          <Pattern kind="seigaiha" strokeWidth={0.8} />
        </div>
        <div className="relative grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-2">
            <Reveal>
              <h3 className="display display-md">ROOTED IN JAPANESE ART.</h3>
            </Reveal>
            <div className="prose-mincho mt-8">
              <p>Japońska sztuka tatuażu posiada bogatą tradycję, w której każdy motyw może opowiadać własną historię.</p>
              <p>
                Smoki, karpie koi, kwiaty wiśni, fale, tygrysy czy maski Hannya to nie tylko efektowne wzory. Są częścią
                kultury wizualnej pełnej symboliki i odniesień do natury, siły, przemiany oraz ludzkich doświadczeń.
              </p>
              <p>Czerpiemy inspirację z tej tradycji, jednocześnie traktując ją jako punkt wyjścia do współczesnej interpretacji.</p>
              <p>Zależy nam na szacunku do źródeł inspiracji, świadomym projektowaniu i dopracowanej kompozycji.</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 border-l border-t border-sumi/15 self-start sm:grid-cols-3 lg:col-span-5 lg:col-start-8 lg:grid-cols-2">
            {MOTIFS.map((motif) => (
              <div key={motif.reading} className="flex flex-col border-b border-r border-sumi/15 p-5 sm:p-6">
                <span aria-hidden="true" className="font-mincho text-[2.6rem] leading-none">
                  {motif.kanji}
                </span>
                <dt className="mt-5 font-mincho text-lg">
                  {motif.name}
                  <span className="ml-2 font-gothic text-2xs tracking-[0.15em] text-nezumi">{motif.reading}</span>
                </dt>
                <dd className="mt-2 font-gothic text-xs leading-relaxed text-nezumi">{motif.meaning}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 4.3 — Individual Approach */}
      <div className="page-x bg-washi-2 py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal variant="wipe" className="relative aspect-[588/447] overflow-hidden lg:col-span-6">
            <Image
              src={workSrc(approachImage)}
              alt={approachImage.alt}
              fill
              quality={85}
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
          </Reveal>
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal>
              <h3 className="display display-md">YOUR STORY. YOUR DESIGN. YOUR TATTOO.</h3>
            </Reveal>
            <div className="prose-mincho mt-8">
              <p>
                Każdy człowiek ma inną historię, estetykę i pomysł na siebie. Dlatego proces tworzenia tatuażu rozpoczynamy od
                rozmowy i poznania oczekiwań klienta.
              </p>
              <p>
                Chcemy zrozumieć, co stoi za danym pomysłem, jakie znaczenie ma wybrany motyw i jaki efekt wizualny klient chce
                osiągnąć.
              </p>
              <p>Na tej podstawie dobierana jest koncepcja projektu, jego kompozycja, wielkość oraz umiejscowienie na ciele.</p>
              <p>
                Nie chodzi wyłącznie o odwzorowanie pomysłu. Chodzi o stworzenie projektu, który będzie przemyślany
                i dopasowany do konkretnej osoby.
              </p>
            </div>
          </div>
        </div>

        <ol className="mt-20 grid gap-px border-y border-sumi/15 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {APPROACH_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-5 py-7 sm:pr-8 lg:flex-col lg:gap-4">
              <span className="font-mincho text-sm tabular-nums text-nezumi" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-mincho text-xl">{step.title}</p>
                <p className="mt-2 max-w-[22rem] font-gothic text-sm leading-relaxed text-nezumi">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* 4.4 — Artistry & Craftsmanship */}
      <div className="on-dark relative overflow-hidden bg-sumi py-24 text-washi sm:py-32">
        <div className="page-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <h3 className="display display-lg">EVERY DETAIL MATTERS.</h3>
            </Reveal>
            <div className="prose-mincho mt-10 text-washi/85">
              <p>Dobry tatuaż wymaga znacznie więcej niż umiejętności wykonania wzoru.</p>
              <p>
                Liczy się projekt, proporcja, odpowiednia kompozycja, precyzja linii, praca z kontrastem oraz zrozumienie tego,
                jak grafika będzie prezentować się na ludzkim ciele.
              </p>
              <p>W naszym podejściu estetyka i jakość wykonania są równie ważne.</p>
              <p>Zwracamy uwagę na detale, ponieważ to właśnie one decydują o charakterze całej pracy.</p>
            </div>
          </div>
          <Reveal variant="wipe" className="relative aspect-[4/5] overflow-hidden lg:col-span-5 lg:col-start-8">
            <Image
              src={workSrc(craftImage)}
              alt={craftImage.alt}
              fill
              quality={85}
              sizes="(min-width: 1024px) 38vw, 92vw"
              className="object-cover object-top"
            />
          </Reveal>
        </div>

        <dl className="page-x mt-20 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {CRAFT.map((item) => (
            <div key={item.term} className="border-t border-washi/15 py-6">
              <dt className="font-mincho text-xl">{item.term}</dt>
              <dd className="mt-2 font-gothic text-sm leading-relaxed text-usuzumi">{item.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* 4.5 — The Experience */}
      <div className="page-x py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:col-start-2">
            <Reveal>
              <h3 className="display display-md">A SPACE FOR CREATIVITY.</h3>
            </Reveal>
          </div>
          <div className="prose-mincho lg:col-span-5 lg:col-start-8">
            <p>Wizyta w studiu tatuażu powinna być przemyślanym i komfortowym doświadczeniem.</p>
            <p>
              Zależy nam na atmosferze, w której można spokojnie porozmawiać o swoim pomyśle, poznać proces projektowania
              i świadomie podjąć decyzję o wykonaniu tatuażu.
            </p>
            <p>Stawiamy na komunikację, przejrzystość i indywidualne podejście na każdym etapie współpracy.</p>
            <p>
              Od pierwszego kontaktu, przez konsultację i przygotowanie projektu, aż po wykonanie tatuażu i wskazówki dotyczące
              pielęgnacji.
            </p>
          </div>
        </div>

        <ol className="relative mt-20 grid gap-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-5 lg:gap-6" aria-label="Etapy współpracy">
          <span aria-hidden="true" className="absolute left-0 right-0 top-[1.6rem] hidden h-px bg-sumi/20 lg:block" />
          {JOURNEY.map((step) => (
            <li key={step.title} className="relative">
              <span
                aria-hidden="true"
                className="relative flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-sumi/25 bg-washi font-mincho text-xl"
              >
                {step.numeral}
              </span>
              <p className="mt-5 font-mincho text-xl">{step.title}</p>
              <p className="mt-2 max-w-[16rem] font-gothic text-sm leading-relaxed text-nezumi">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* 4.6 — Our Values */}
      <div className="relative overflow-hidden bg-kinari">
        <div className="text-sumi/[0.08]">
          <Pattern kind="kumiko" strokeWidth={0.8} scale={1.4} />
        </div>
        <div className="page-x relative py-24 sm:py-28">
          <h3 className="font-mincho text-2xl">Our values</h3>
          <ul className="mt-12 grid border-sumi/20 sm:grid-cols-2 lg:grid-cols-4 lg:border-l">
            {VALUES.map((value) => (
              <li key={value.name} className="border-t border-sumi/20 bg-kinari/80 py-8 lg:border-r lg:border-t-0 lg:px-8 lg:py-4">
                <span aria-hidden="true" className="block font-mincho text-[4.5rem] leading-none">
                  {value.kanji}
                </span>
                <p className="mt-8 font-gothic text-sm font-medium tracking-[0.24em]">{value.name}</p>
                <p className="mt-3 max-w-[18rem] font-mincho text-base leading-relaxed">{value.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4.7 — Zakończenie */}
      <div className="page-x py-28 sm:py-40">
        <div className="mx-auto max-w-[68rem]">
          <Reveal>
            <h3 className="display display-xl">ART THAT BECOMES PART OF YOU.</h3>
          </Reveal>
          <div className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-[32rem] font-mincho text-lg leading-[1.85]">
              Odkryj sztukę tatuażu inspirowaną Japonią. Poznaj nasze prace, opowiedz nam o swoim pomyśle i rozpocznij proces
              tworzenia własnego projektu.
            </p>
            <Link href="/rezerwacja" className="btn btn-ink shrink-0">
              START YOUR TATTOO JOURNEY
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
