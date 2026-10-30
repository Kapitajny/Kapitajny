const steps = [
  { title: "Consultation", text: "An unhurried conversation, a skin assessment and your medical history. No obligation." },
  { title: "Your plan", text: "A written plan with options, timing and costs – you decide in your own time." },
  { title: "Treatment", text: "In a calm private room, after consent and with every step explained." },
  { title: "Aftercare", text: "Written advice, a direct line for questions and a review visit when needed." },
];

export function Experience() {
  return (
    <section aria-labelledby="experience-title" className="bg-black text-ivory">
      <div className="wrap py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="experience-title" className="display-lg lg:col-span-7">
            The VÉRA <span className="italic text-rose">Experience</span>
          </h2>
          <p className="max-w-md text-ivory/70 lg:col-span-4 lg:col-start-9">Four steps, the same for every client – whether you come for a facial or a medical treatment.</p>
        </div>
        <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-8">
          <span aria-hidden="true" className="absolute left-0 right-0 top-0 hidden h-px bg-ivory/20 lg:block" />
          {steps.map((step, i) => (
            <li key={step.title} className="relative lg:pt-12">
              <span aria-hidden="true" className="font-display text-[4.25rem] leading-none text-rose">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="absolute left-0 top-0 hidden size-2 -translate-y-1/2 rounded-full bg-rose lg:block" />
              <h3 className="mt-6 font-display text-3xl">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm text-ivory/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
