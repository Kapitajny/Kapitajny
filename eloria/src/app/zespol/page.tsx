import type { Metadata } from "next";
import { BookingCta } from "@/components/ui/BookingCta";
import { DemoNote } from "@/components/ui/DemoNote";
import { PageIntro } from "@/components/ui/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/JsonLd";
import { team } from "@/data/team";

export const metadata: Metadata = {
  title: "Nasz zespół",
  description: "Poznaj zespół ÉLORIA Aesthetic Clinic: lekarza medycyny estetycznej, kosmetologów i koordynatorkę pacjentek.",
  alternates: { canonical: "/zespol" },
  openGraph: { title: "Zespół | ÉLORIA Aesthetic Clinic", url: "/zespol" },
};

export default function TeamPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "Zespół", path: "/zespol" }])} />
      <PageIntro
        breadcrumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/zespol", label: "Zespół" },
        ]}
        title="Nasz zespół"
        lede="Lekarz, kosmetolodzy i koordynatorka pacjentek – niewielki zespół, który zna Twoją historię i pracuje na wspólnej dokumentacji."
      />

      <div className="frame space-y-24 pb-24 lg:space-y-36 lg:pb-32">
        {team.map((member, i) => {
          const reversed = i % 2 === 1;
          return (
            <article key={member.slug} id={member.slug} aria-labelledby={`${member.slug}-name`} className="grid scroll-mt-28 gap-y-10 md:grid-cols-12 md:gap-x-8">
              <div className={`md:col-span-5 ${reversed ? "md:order-2 md:col-start-8" : ""}`}>
                <div className={`relative aspect-[3/4] overflow-hidden bg-blush ${reversed ? "md:ml-auto" : ""} ${i === 0 ? "" : "md:w-11/12"}`}>
                  <Photo image={member.image} sizes="(min-width: 768px) 40vw, 100vw" />
                </div>
              </div>
              <div className={`md:col-span-6 md:self-center ${reversed ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                <p className="text-sm text-champagne-deep">{member.role}</p>
                <h2 id={`${member.slug}-name`} className="mt-3 text-[clamp(2.25rem,4.5vw,3.5rem)]">
                  {member.name}
                </h2>
                <div className="prose-body mt-8 text-base sm:text-lg">
                  {member.bio.map((p) => (
                    <p key={p.slice(0, 32)}>{p}</p>
                  ))}
                </div>
                <div className="mt-10 border-t border-line pt-6">
                  <h3 className="font-sans text-xs font-medium text-taupe">Zakres pracy</h3>
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-serif text-xl">
                    {member.focus.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          );
        })}
        <DemoNote>Osoby przedstawione na tej stronie są fikcyjne – projekt demonstracyjny. Przed publikacją podmień dane na informacje o prawdziwym zespole.</DemoNote>
      </div>

      <BookingCta title="Umów się na konsultację" />
    </>
  );
}
