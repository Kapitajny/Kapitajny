import type { LegalContent } from "./types";

export const legalEn: LegalContent = {
  tokenLabels: { companyName: "company name", companyAddress: "registered address", nip: "NIP (tax ID)", regon: "REGON", email: "email address", phone: "phone" },
  terms: {
    sections: [
      {
        heading: "1. General",
        blocks: [
          {
            p: "These terms set out the rules for using the {{studio}} studio website and the “Book your tattoo” consultation form. The service is provided by {{companyName}}, {{companyAddress}}, NIP: {{nip}}. Contact: {{email}}, {{phone}}.",
          },
        ],
      },
      {
        heading: "2. Technical requirements",
        blocks: [{ p: "To use the website you need an internet-connected device and an up-to-date browser with JavaScript enabled." }],
      },
      {
        heading: "3. Consultation form",
        blocks: [
          {
            ol: [
              "The form is used to send the studio information about your tattoo idea so that a consultation can be prepared.",
              "Sending the form does not book an appointment or create a contract. The date and terms of the tattoo are agreed individually with the studio.",
              "The budget and preferred date given in the form are indicative only.",
              "You are responsible for the accuracy of the details you provide and for having the rights to the images you upload.",
              "Sending unlawful or offensive content, or content that infringes the rights of others, is not allowed.",
            ],
          },
        ],
      },
      {
        heading: "4. Price calculator",
        blocks: [
          {
            p: "The calculator in the Pricing section shows an estimated price range. It is not an offer within the meaning of the Polish Civil Code. The final price is set by the artist after an individual quote.",
          },
        ],
      },
      {
        heading: "5. Working together",
        blocks: [{ p: "[[the studio's rules: deposits, cancelling and rescheduling, touch-ups, client age, copyright in designs]]" }],
      },
      {
        heading: "6. Complaints about the website",
        blocks: [{ p: "Feedback and complaints about the website can be sent to {{email}}. We reply within [[response time, e.g. 14 days]]." }],
      },
      { heading: "7. Personal data", blocks: [{ p: "How we process personal data is described in the {{link:privacy}}." }] },
      { heading: "8. Final provisions", blocks: [{ p: "[[how the terms may change and when they take effect]]" }] },
    ],
  },
  privacy: {
    sections: [
      {
        heading: "1. Data controller",
        blocks: [
          {
            p: "The controller of your personal data is {{companyName}}, {{companyAddress}}, NIP: {{nip}}, REGON: {{regon}}. Contact for data protection matters: {{email}}.",
          },
        ],
      },
      {
        heading: "2. What data we process",
        blocks: [
          { p: "Through the “Book your tattoo” form you send us:" },
          {
            ul: [
              "contact details: full name, email address and, optionally, phone number,",
              "a description of your tattoo idea, its meaning and your preferences (style, placement, size, budget, preferred date),",
              "attached reference images and sketches.",
            ],
          },
          {
            p: "Please don't include health information or other sensitive data in the form unless it is necessary. If you send photos of bodies or of other people, make sure you have the right to do so. Images are resized in your browser before sending and their metadata (including GPS location) is removed.",
          },
        ],
      },
      {
        heading: "3. Purposes and legal bases",
        blocks: [
          {
            ul: [
              "responding to your request and preparing a consultation, i.e. steps taken at your request before entering into a contract (Art. 6(1)(b) GDPR),",
              "protecting the form against abuse and spam, e.g. limiting the number of requests from one IP address (the controller's legitimate interest, Art. 6(1)(f) GDPR),",
              "establishing, exercising or defending legal claims where necessary (Art. 6(1)(f) GDPR).",
            ],
          },
          { p: "We don't use form data for marketing and the form doesn't ask for marketing consent." },
        ],
      },
      {
        heading: "4. Recipients",
        blocks: [
          {
            p: "Data may be entrusted to providers of technical services to us: [[website hosting provider, email provider, any request-handling system and Cloudflare Turnstile (spam protection)]]. They process data only on our instructions. [[whether data is transferred outside the European Economic Area, and on what basis]]",
          },
        ],
      },
      { heading: "5. Retention", blocks: [{ p: "[[how long the studio keeps requests and attachments if no appointment follows, and after an appointment]]" }] },
      {
        heading: "6. Your rights",
        blocks: [
          { p: "You have the right to:" },
          {
            ul: [
              "access your data and receive a copy,",
              "rectify your data,",
              "have your data erased,",
              "restrict processing,",
              "data portability,",
              "object to processing based on legitimate interest,",
              "lodge a complaint with the President of the Personal Data Protection Office (UODO, ul. Stawki 2, 00-193 Warsaw).",
            ],
          },
          { p: "Providing data is voluntary, but without your name, email address and a description of your idea we can't respond to your request." },
        ],
      },
      {
        heading: "7. Cookies and browser storage",
        blocks: [
          {
            p: "The website doesn't use analytics or marketing cookies. If you choose the site language yourself, we remember that choice in a “lang” cookie and in browser storage (localStorage) for one year, solely to show the site in that language on your next visit.",
          },
          {
            p: "The form saves your answers in session storage (sessionStorage) so they aren't lost if you refresh the page. This data stays on your device and is removed when you submit the form or close the tab. [[update this section if the studio adds analytics or other tools]]",
          },
        ],
      },
      { heading: "8. Contact", blocks: [{ p: "For data protection matters, write to {{email}}. Rules for using the website are set out in the {{link:terms}}." }] },
    ],
  },
};
