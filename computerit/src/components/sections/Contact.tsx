import type { CSSProperties } from "react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "./ContactForm";

const steps = [
  { title: "Wysyłasz zapytanie", text: "Kilka zdań o firmie i projekcie wystarczy na początek." },
  { title: "Rozmawiamy o szczegółach", text: "Doprecyzowujemy cele, zakres i termin realizacji." },
  { title: "Otrzymujesz propozycję", text: "Zakres prac i wycenę dopasowaną do ustaleń." },
];

export function Contact() {
  const { email, phone } = siteConfig.contact;

  return (
    <section id="kontakt" tabIndex={-1} aria-labelledby="kontakt-title" className="section bg-cloud outline-none">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 id="kontakt-title" className="reveal title-xl max-w-[14ch]">
            Masz pomysł na swoją stronę internetową?
          </h2>
          <p className="reveal lead mt-6 max-w-[30rem] text-ink/80" style={{ "--d": "120ms" } as CSSProperties}>
            Opowiedz mi o swoim projekcie. Wspólnie stworzymy rozwiązanie dopasowane do Twojego biznesu.
          </p>

          <ol className="reveal mt-12 space-y-6" style={{ "--d": "200ms" } as CSSProperties}>
            {steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3">
                <span aria-hidden="true" className="wide text-[1.0625rem] font-medium text-sky tabular-nums">
                  {i + 1}.
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="mt-1 text-slate">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {(email || phone) && (
            <dl className="reveal mt-12 space-y-3 border-t border-ink/12 pt-8">
              {email && (
                <div className="flex flex-wrap gap-x-4">
                  <dt className="w-20 text-slate">E-mail</dt>
                  <dd>
                    <a href={`mailto:${email}`} className="link-underline font-medium">
                      {email}
                    </a>
                  </dd>
                </div>
              )}
              {phone && (
                <div className="flex flex-wrap gap-x-4">
                  <dt className="w-20 text-slate">Telefon</dt>
                  <dd>
                    <a href={`tel:${phone.replace(/\s+/g, "")}`} className="link-underline font-medium">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>

        <div className="reveal relative lg:col-span-7" style={{ "--d": "150ms" } as CSSProperties}>
          <ContactForm fallbackEmail={email} />
        </div>
      </div>
    </section>
  );
}
