import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { specialists } from "@/data/specialists";

const offsets = ["", "sm:mt-24", "sm:mt-10"];

export function SpecialistsPreview() {
  return (
    <section aria-labelledby="specialists-title" className="shell py-24 sm:py-32 lg:py-40">
      <div className="grid gap-8 lg:grid-cols-12">
        <h2 id="specialists-title" className="display text-[clamp(3rem,7vw,6.25rem)] text-burgundy lg:col-span-7">
          Poznaj naszych
          <br />
          <span className="pl-[0.9em]">specjalistów</span>
        </h2>
        <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-stone">Trzy osoby, każda odpowiedzialna za inną część opieki. Od konsultacji po wizytę kontrolną spotykasz tego samego specjalistę.</p>
          <Link href="/specjalisci" className="link-line mt-5 inline-block text-sm font-semibold text-burgundy">
            O naszym zespole
          </Link>
        </div>
      </div>

      <ul className="mt-16 grid gap-14 sm:grid-cols-3 sm:gap-6 lg:mt-24 lg:gap-10">
        {specialists.map((s, i) => (
          <li key={s.slug} className={offsets[i]}>
            <Link href={`/specjalisci#${s.slug}`} className="group block">
              <div className="overflow-hidden">
                <Photo
                  image={s.image}
                  sizes="(min-width: 640px) 30vw, 100vw"
                  className="aspect-[4/5]"
                  imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-5 font-serif text-3xl">{s.name}</h3>
              <p className="mt-1 text-sm font-medium text-rose-deep">{s.role}</p>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-stone">{s.short}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
