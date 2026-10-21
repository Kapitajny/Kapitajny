import { Clock, Mail, Phone, Pin } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";

/** Schematyczna mapa – świadomie bez zewnętrznych usług i bez współrzędnych prawdziwego miejsca. */
function DemoMap() {
  // Siatka ulic: główne arterie (szersze) i uliczki osiedlowe; rzeka przecina mapę po skosie.
  const majorX = [60, 210, 340];
  const majorY = [90, 250, 400];
  const minorX = [20, 110, 160, 265, 300, 385];
  const minorY = [40, 140, 190, 300, 350, 460];
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-blush lg:aspect-[4/5]">
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Schematyczna mapa z zaznaczoną lokalizacją demonstracyjną studia">
        <g fill="none" stroke="#F7F2EE" strokeLinecap="square">
          {minorX.map((x) => (
            <path key={`mx${x}`} d={`M${x} -10V510`} strokeWidth="3" />
          ))}
          {minorY.map((y) => (
            <path key={`my${y}`} d={`M-10 ${y}H410`} strokeWidth="3" />
          ))}
          {majorX.map((x) => (
            <path key={`Mx${x}`} d={`M${x} -10V510`} strokeWidth="9" />
          ))}
          {majorY.map((y) => (
            <path key={`My${y}`} d={`M-10 ${y}H410`} strokeWidth="9" />
          ))}
        </g>
        <path d="M-20 470C70 420 90 330 170 300s120-40 160-130 70-120 100-150" fill="none" stroke="#F7F2EE" strokeWidth="22" strokeLinecap="round" />
        <path d="M-20 470C70 420 90 330 170 300s120-40 160-130 70-120 100-150" fill="none" stroke="#A86F79" strokeWidth="1.2" strokeDasharray="1 7" strokeLinecap="round" />
        <rect x="222" y="196" width="34" height="40" fill="#A86F79" opacity="0.4" />
        <rect x="70" y="150" width="80" height="34" fill="#A86F79" opacity="0.18" />
        <g transform="translate(239 196)">
          <circle r="30" fill="#743D4B" opacity="0.14" />
          <path d="M0 8s-14-12.5-14-24a14 14 0 0 1 28 0C14-4 0 8 0 8Z" fill="#743D4B" />
          <circle cy="-16" r="5" fill="#F7F2EE" />
        </g>
      </svg>
      <p className="absolute bottom-4 left-4 right-4 bg-ivory px-4 py-3 text-sm sm:right-auto">
        <span className="font-semibold">Swoboda – studio tańca</span>
        <span className="block">Lokalizacja demonstracyjna – mapa poglądowa</span>
      </p>
    </div>
  );
}

export function Contact() {
  const { contact } = siteConfig;
  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="eyebrow">Kontakt i lokalizacja</p>
          <h2 id="kontakt-title" className="h2 mt-5 text-wine">
            Porozmawiajmy o Twoim pierwszym kroku
          </h2>
          <p className="mt-6 prose-measure">Masz pytanie o grupę, poziom albo karnet? Zadzwoń lub napisz – odpowiadamy w godzinach kontaktu.</p>

          <ul className="mt-10 space-y-6">
            <li className="flex gap-4">
              <Pin size={22} className="mt-1 shrink-0 text-wine" />
              <div>
                <p className="font-semibold">Adres</p>
                <address className="not-italic">
                  {contact.street}, {contact.city}
                </address>
                <p className="text-sm">Adres demonstracyjny</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone size={22} className="mt-1 shrink-0 text-wine" />
              <div>
                <p className="font-semibold">Telefon</p>
                <a href={contact.phoneHref} className="link">
                  {contact.phoneDisplay}
                </a>
                <p className="text-sm">Numer demonstracyjny</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail size={22} className="mt-1 shrink-0 text-wine" />
              <div>
                <p className="font-semibold">E-mail</p>
                <a href={`mailto:${contact.email}`} className="link break-all">
                  {contact.email}
                </a>
                <p className="text-sm">Adres demonstracyjny</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock size={22} className="mt-1 shrink-0 text-wine" />
              <div>
                <p className="font-semibold">Godziny kontaktu</p>
                <dl>
                  {contact.hours.map((row) => (
                    <div key={row.days} className="flex flex-wrap gap-x-3">
                      <dt>{row.days}:</dt>
                      <dd>{row.time}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href={contact.phoneHref} className="btn btn-primary">
              <Phone size={18} /> Zadzwoń
            </a>
            <a href={`mailto:${contact.email}?subject=${encodeURIComponent("Pytanie o zajęcia")}`} className="btn btn-secondary">
              <Mail size={18} /> Napisz e-mail
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 lg:self-start">
          <DemoMap />
        </div>
      </div>
    </section>
  );
}
