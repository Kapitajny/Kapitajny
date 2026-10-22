import { Clock, Mail, Phone, Pin } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";

/** Schematyczna mapa – świadomie bez zewnętrznych usług i bez współrzędnych prawdziwego miejsca. */
function DemoMap() {
  // Kwartały między ulicami (x, y, szerokość, wysokość) – bez współrzędnych prawdziwego miejsca.
  const blocks = [
    [16, 16, 92, 70], [124, 16, 120, 70], [260, 16, 124, 70],
    [16, 102, 92, 110], [124, 102, 56, 110], [196, 102, 48, 110], [260, 102, 124, 52], [260, 170, 124, 42],
    [16, 228, 92, 80], [124, 228, 120, 80], [260, 228, 56, 80], [332, 228, 52, 80],
    [16, 324, 168, 90], [200, 324, 184, 90],
    [16, 430, 92, 54], [124, 430, 260, 54],
  ];
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ivory ring-1 ring-cocoa/10 lg:aspect-[4/5]">
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label="Schematyczna mapa z zaznaczoną lokalizacją demonstracyjną studia">
        {blocks.map(([x, y, w, h]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} rx="10" fill="#E8CFCF" />
        ))}
        {/* Skwer przy studiu. */}
        <rect x="124" y="228" width="120" height="80" rx="10" fill="#A86F79" opacity="0.28" />
        <path d="M-10 470C80 430 70 340 160 318s150-30 190-120 40-150 70-210" fill="none" stroke="#F7F2EE" strokeWidth="18" strokeLinecap="round" />
        <path d="M-10 470C80 430 70 340 160 318s150-30 190-120 40-150 70-210" fill="none" stroke="#A86F79" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />
        <g transform="translate(212 196)">
          <circle r="30" fill="#743D4B" opacity="0.14" />
          <path d="M0 8s-14-12.5-14-24a14 14 0 0 1 28 0C14-4 0 8 0 8Z" fill="#743D4B" />
          <circle cy="-16" r="5" fill="#F7F2EE" />
        </g>
      </svg>
      <p className="absolute bottom-4 left-4 right-4 rounded-2xl bg-cocoa px-4 py-3 text-sm text-ivory sm:right-auto">
        <span className="font-semibold">Swoboda – studio tańca</span>
        <span className="block text-blush">Lokalizacja demonstracyjna, mapa poglądowa</span>
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
          <h2 id="kontakt-title" className="h2 text-wine">
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
