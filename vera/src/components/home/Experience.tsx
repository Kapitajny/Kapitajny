import Link from "next/link";
import { bookingHref } from "@/config/site";
import { Photo } from "@/components/ui/Photo";

/** The visit is a real sequence, so the steps are numbered. */
export const visitSteps = [
  { title: "Consultation", text: "An unhurried conversation and a close look at your skin. Nothing is booked yet." },
  { title: "A written plan", text: "Options, timing and costs on paper – including what we would not recommend." },
  { title: "Treatment", text: "Performed by the specialist you met, in a private room, at a calm pace." },
  { title: "Follow-up", text: "We review the result together and adjust the plan for the next season." },
];

export function Experience() {
  return (
    <section aria-labelledby="experience-title" className="relative bg-ivory lg:pb-32">
      <Photo image="treatmentRoom" sizes="100vw" className="h-[62svh] min-h-[22rem] w-full lg:h-[88svh]" focus="58% 62%" />
      <div className="shell relative lg:-mt-64">
        <div className="bg-burgundy px-6 py-14 text-ivory sm:px-12 sm:py-16 lg:ml-auto lg:w-[64%] lg:px-16 lg:py-20">
          <h2 id="experience-title" className="display text-[clamp(2.75rem,6vw,5.25rem)]">
            The VÉRA
            <br />
            <span className="pl-[0.9em]">experience</span>
          </h2>
          <p className="mt-6 max-w-md text-ivory/80">Every visit follows the same four steps, whether you come for a facial or a medical procedure.</p>
          <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {visitSteps.map((step, i) => (
              <li key={step.title} className="border-t border-line-light pt-5">
                <span aria-hidden="true" className="font-serif text-4xl font-light text-rose">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-serif text-2xl">{step.title}</h3>
                <p className="mt-2 text-sm text-ivory/75">{step.text}</p>
              </li>
            ))}
          </ol>
          <Link href={bookingHref} className="btn btn-light mt-12">
            Book a consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
