import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function NewsletterSection() {
  return (
    <section aria-labelledby="newsletter-title" className="border-t border-line py-16 md:py-24">
      <div className="wrap grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h2 id="newsletter-title" className="display text-[clamp(2.4rem,1rem+4.4vw,4.8rem)]">
            Pierwszy przy dropie
          </h2>
          <p className="mt-5 max-w-md text-muted">Jeden e-mail w dniu premiery nowej kolekcji. Bez codziennych promocji.</p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 lg:pt-3">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
