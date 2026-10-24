import Link from "next/link";

export function DemoBar() {
  return (
    <div className="bg-navy text-[0.8125rem] text-on-navy">
      <p className="shell flex min-h-9 flex-wrap items-center gap-x-2 py-1.5">
        <span className="font-semibold text-gold">Wersja demonstracyjna.</span>
        <span>Marka fikcyjna, ceny przykładowe, płatności nie są realizowane.</span>
        <Link href="/o-nas#o-projekcie" className="underline underline-offset-2 hover:text-white">
          O projekcie
        </Link>
      </p>
    </div>
  );
}
