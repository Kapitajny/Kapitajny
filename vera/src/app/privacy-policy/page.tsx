import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DemoNote } from "@/components/ui/DemoNote";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How VÉRA Aesthetic Studio processes personal data sent through this website.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: { title: "Privacy policy | VÉRA Aesthetic Studio", url: "/privacy-policy" },
};

const toc = [
  { id: "controller", label: "Who is responsible for your data" },
  { id: "data", label: "What data we process and why" },
  { id: "recipients", label: "Who receives the data" },
  { id: "retention", label: "How long we keep it" },
  { id: "rights", label: "Your rights" },
  { id: "cookies", label: "Cookies and analytics" },
  { id: "changes", label: "Changes to this policy" },
];

export default function PrivacyPolicyPage() {
  const { contact, address } = siteConfig;
  return (
    <div className="shell grid gap-14 pb-28 pt-[calc(var(--header-h)+3rem)] lg:grid-cols-12 lg:gap-8 lg:pt-[calc(var(--header-h)+5rem)]">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <Breadcrumbs
            items={[
              { href: "/", label: "Home" },
              { href: "/privacy-policy", label: "Privacy policy" },
            ]}
          />
          <h1 className="display mt-10 text-[clamp(3rem,6vw,5.5rem)] text-burgundy">Privacy policy</h1>
          <p className="mt-6 text-sm text-stone">Draft version, last updated 30 October 2026.</p>
          <nav aria-label="Sections" className="mt-10 hidden lg:block">
            <ol className="space-y-2.5 border-l border-line pl-5 text-sm">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-stone hover:text-burgundy">
                    {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>

      <div className="lg:col-span-7 lg:col-start-6">
        <DemoNote className="mb-12">
          This is a draft prepared for a demonstration site. The studio&apos;s legal details, processors and retention periods must be completed and the whole
          text reviewed by a lawyer before publication.
        </DemoNote>

        <div className="prose-vera">
          <h2 id="controller" className="!mt-0">
            Who is responsible for your data
          </h2>
          <p>
            The controller of personal data sent through this website is {siteConfig.fullName}, {address.street}, {address.postalCode} {address.city} (company
            details to be completed). You can contact us about your data at <a href={`mailto:${contact.email}`}>{contact.email}</a> or by phone at{" "}
            <a href={contact.phoneHref}>{contact.phone}</a>.
          </p>

          <h2 id="data">What data we process and why</h2>
          <h3>Contact form</h3>
          <p>
            Your name, e-mail address, optional phone number and the content of your message, to reply to you. The legal basis is your consent (Art. 6(1)(a)
            GDPR) and our legitimate interest in answering enquiries (Art. 6(1)(f) GDPR).
          </p>
          <h3>Consultation request</h3>
          <p>
            Your name, phone number, e-mail address, the area or treatment you are interested in, your preferred days and times, and an optional note. We use
            them to contact you and arrange a consultation (Art. 6(1)(b) GDPR – steps taken at your request before entering into a contract).
          </p>
          <p>
            Please do not send health information through the website. Your medical history is collected in person, during the consultation, and documented
            according to the rules for medical records.
          </p>

          <h2 id="recipients">Who receives the data</h2>
          <p>
            Form submissions are passed to the studio&apos;s reception through a technical integration provider and our e-mail provider (to be named). These
            providers process data only on our instructions. We do not sell your data or use it for advertising.
          </p>

          <h2 id="retention">How long we keep it</h2>
          <ul>
            <li>Messages from the contact form – for as long as needed to handle the matter, and no longer than 12 months.</li>
            <li>Consultation requests that did not lead to a visit – up to 6 months.</li>
            <li>Data of clients who visited the studio – according to the law on medical records.</li>
          </ul>

          <h2 id="rights">Your rights</h2>
          <p>
            You have the right to access your data, to have it corrected or erased, to restrict its processing, to data portability and to object. Where we
            rely on consent, you can withdraw it at any time without affecting earlier processing. You may also lodge a complaint with the President of the
            Personal Data Protection Office (PUODO).
          </p>

          <h2 id="cookies">Cookies and analytics</h2>
          <p>
            This website uses only the technical storage needed for it to work. It does not use analytics or advertising cookies. If that changes, this policy
            will be updated and you will be asked for consent first.
          </p>

          <h2 id="changes">Changes to this policy</h2>
          <p>When this policy changes, the new version is published on this page with its date.</p>
        </div>
      </div>
    </div>
  );
}
