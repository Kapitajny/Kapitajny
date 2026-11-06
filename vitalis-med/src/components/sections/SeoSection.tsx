import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Opisowy blok tekstu na dole strony głównej – informacje dla pacjentów i wyszukiwarek (wzorem serwisów placówek). */
export function SeoSection() {
  const { contact } = siteConfig;
  return (
    <section aria-labelledby="informacje-title" className="border-t border-line bg-white py-16 lg:py-20">
      <div className="container-x">
        <h2 id="informacje-title" className="text-[1.35rem]">
          Prywatne pogotowie ratunkowe i&nbsp;transport medyczny
        </h2>
        <div className="mt-8 grid gap-x-14 gap-y-8 text-[0.95rem] font-light leading-relaxed text-muted md:grid-cols-2">
          <div>
            <h3 className="text-[1.02rem] text-ink">Transport sanitarny i&nbsp;medyczny</h3>
            <p className="mt-2">
              Organizujemy przewozy pacjentów na badania, zabiegi i&nbsp;wizyty lekarskie, transport między szpitalami oraz przewóz pacjentów leżących
              z&nbsp;zniesieniem i&nbsp;wniesieniem. Rodzaj ambulansu i&nbsp;skład zespołu dobieramy do stanu pacjenta. Baza dyspozytorni mieści się
              w&nbsp;miejscowości {contact.city}, a&nbsp;przewozy realizujemy także na dalekie trasy, po wcześniejszej wycenie.
            </p>
          </div>
          <div>
            <h3 className="text-[1.02rem] text-ink">Świadczenia w&nbsp;ramach NFZ</h3>
            <p className="mt-2">
              W&nbsp;zakresie zawartej umowy z&nbsp;Narodowym Funduszem Zdrowia realizujemy transport sanitarny na podstawie zlecenia lekarza
              ubezpieczenia zdrowotnego. Zasady, wymagane dokumenty i&nbsp;różnice między świadczeniem NFZ a&nbsp;usługą prywatną opisujemy na stronie{" "}
              <Link href="/nfz" className="link-quiet text-ink">
                Świadczenia NFZ
              </Link>
              .
            </p>
          </div>
          <div>
            <h3 className="text-[1.02rem] text-ink">Zabezpieczenie medyczne wydarzeń</h3>
            <p className="mt-2">
              Przygotowujemy zabezpieczenie imprez masowych, sportowych, plenerowych i&nbsp;firmowych: zespoły medyczne, ambulanse i&nbsp;punkty pomocy
              medycznej dobrane do skali wydarzenia oraz obowiązujących wymagań.
            </p>
          </div>
          <div>
            <h3 className="text-[1.02rem] text-ink">Współpraca z&nbsp;placówkami i&nbsp;firmami</h3>
            <p className="mt-2">
              Szpitale, przychodnie, domy opieki i&nbsp;zakłady pracy mogą zawrzeć z&nbsp;nami umowę na stałą obsługę transportową z&nbsp;rozliczeniem
              miesięcznym. Zapytania przyjmujemy pod numerem{" "}
              <a href={contact.phoneHref} className="link-quiet text-ink">
                {contact.phoneDisplay}
              </a>{" "}
              lub przez{" "}
              <Link href="/kontakt#formularz" className="link-quiet text-ink">
                formularz kontaktowy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
