import type { Metadata } from "next";
import { site } from "@/config/site";
import { Crumbs } from "@/components/ui/Crumbs";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How VÉRA Aesthetic Studio processes personal data sent through this website, and your rights under the GDPR.",
  alternates: { canonical: "/privacy" },
};

const Fill = ({ value, label }: { value: string | null; label: string }) => (value ? <>{value}</> : <mark className="bg-powder px-1 text-black">[{label} – to be completed]</mark>);

export default function PrivacyPage() {
  const { contact, controller } = site;
  const sections: { title: string; body: React.ReactNode }[] = [
    {
      title: "Who is responsible for your data",
      body: (
        <p>
          The controller of your personal data is <Fill value={controller.companyName} label="company name" />, operating {site.fullName} at {contact.street},{" "}
          {contact.postalCode} {contact.city}, tax ID <Fill value={controller.nip} label="NIP" />. Contact: {contact.email}, {contact.phone}.
        </p>
      ),
    },
    {
      title: "What we collect and why",
      body: (
        <ul>
          <li>Contact form – name, e-mail, optional phone and your message; to reply to you (Art. 6(1)(a) and (f) GDPR).</li>
          <li>Consultation request – name, phone, e-mail, chosen area or treatment and preferred times; to arrange your visit (Art. 6(1)(a) and (b) GDPR).</li>
          <li>Phone and e-mail – whatever you share with us; to handle your enquiry (Art. 6(1)(f) GDPR).</li>
        </ul>
      ),
    },
    {
      title: "Health information",
      body: (
        <p>
          Please don&apos;t send health details through the website. Health information is collected only during your visit, in your medical record, under Art.
          9(2)(h) GDPR and Polish patient-rights law.
        </p>
      ),
    },
    {
      title: "Who receives your data",
      body: (
        <p>
          Service providers acting on our instructions: website hosting, e-mail, and the system that receives form submissions – <Fill value={null} label="list of providers" />.
        </p>
      ),
    },
    {
      title: "How long we keep it",
      body: <p>Form data is kept while we handle your request and then for the limitation period of any claims. Medical records are kept for the period required by law.</p>,
    },
    {
      title: "Your rights",
      body: (
        <ul>
          <li>access and a copy of your data,</li>
          <li>rectification, erasure or restriction of processing,</li>
          <li>data portability and objection to processing based on legitimate interest,</li>
          <li>withdrawing consent at any time (without affecting earlier processing),</li>
          <li>lodging a complaint with the President of the Personal Data Protection Office (UODO).</li>
        </ul>
      ),
    },
    {
      title: "Cookies and third parties",
      body: (
        <p>
          This website doesn&apos;t use analytics or marketing cookies. Fonts are served from our own server. Google Maps and Instagram open only when you click their
          links. If we add analytics in the future, we&apos;ll ask for your consent first.
        </p>
      ),
    },
  ];

  return (
    <div className="wrap pb-24 pt-[calc(var(--bar)+2.5rem)] lg:pb-32">
      <Crumbs items={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy policy" }]} />
      <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
        <header className="lg:col-span-4">
          <h1 className="display-lg lg:sticky lg:top-28">Privacy policy</h1>
        </header>
        <div className="lg:col-span-7 lg:col-start-6">
          <DemoNote>Draft prepared for a ComputerIT demo concept. It must be completed with the controller&apos;s details and reviewed by a lawyer or data protection officer before launch.</DemoNote>
          <ol className="mt-12 space-y-12">
            {sections.map((s, i) => (
              <li key={s.title} className="grid gap-4 border-t border-black/15 pt-6 sm:grid-cols-[3rem_1fr]">
                <span aria-hidden="true" className="font-display text-2xl italic text-rose-deep">
                  {i + 1}
                </span>
                <section>
                  <h2 className="font-display text-3xl leading-tight">{s.title}</h2>
                  <div className="mt-4 space-y-3 text-black/80 [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-2">{s.body}</div>
                </section>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
