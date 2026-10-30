import Link from "next/link";
import { Photo } from "@/components/ui/Photo";
import { team } from "@/data/team";

export function TeamPreview() {
  return (
    <section aria-labelledby="zespol">
      <div className="frame py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="zespol" className="max-w-xl text-[clamp(2.5rem,5vw,3.75rem)]">
            Osoby, które Cię przyjmą
          </h2>
          <Link href="/zespol" className="link-quiet text-sm font-medium">
            Poznaj zespół
          </Link>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {team.map((member, i) => (
            <li key={member.slug} className={i % 2 === 1 ? "translate-y-10 lg:translate-y-16" : ""}>
              <Link href={`/zespol#${member.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-blush">
                  <Photo image={member.image} sizes="(min-width: 1024px) 22vw, 46vw" className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.03]" />
                </div>
                <h3 className="mt-5 font-serif text-xl leading-snug sm:text-2xl">{member.name}</h3>
                <p className="mt-1 text-sm text-taupe">{member.role}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
