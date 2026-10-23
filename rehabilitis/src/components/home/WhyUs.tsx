const VALUES = [
  {
    title: "Indywidualne podejście",
    text: "Terapię układamy wokół Twoich potrzeb, możliwości i codziennych zajęć, a nie według gotowego schematu.",
  },
  {
    title: "Zrozumiałe wyjaśnienia",
    text: "Mówimy prostym językiem, co robimy i dlaczego. Na każdym etapie możesz zadać pytanie.",
  },
  {
    title: "Komfort i bezpieczeństwo",
    text: "Pracujemy w tempie, które jest dla Ciebie akceptowalne, i reagujemy na to, jak się czujesz podczas wizyty.",
  },
  {
    title: "Plan, który ma cel",
    text: "Plan uwzględnia to, do czego chcesz wrócić: do pracy, sportu czy swobodnego spaceru. Zmieniamy go razem z postępami.",
  },
];

export function WhyUs() {
  return (
    <section aria-labelledby="dlaczego-title" className="section-y bg-forest text-white">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 id="dlaczego-title" className="h2 !text-white">
            Dlaczego warto wybrać nasz gabinet?
          </h2>
          <p className="mt-4 max-w-md text-white/80">Na każdej wizycie wiesz, co robimy i dlaczego. O kolejnych krokach decydujemy razem.</p>
        </div>
        <dl className="divide-y divide-white/20 border-y border-white/20">
          {VALUES.map((value) => (
            <div key={value.title} className="grid gap-2 py-6 sm:grid-cols-[13rem_1fr] sm:gap-8">
              <dt className="text-lg font-semibold text-white">{value.title}</dt>
              <dd className="text-white/85">{value.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
