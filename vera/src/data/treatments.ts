import type { ImageKey } from "@/config/images";

/**
 * TREATMENT CATALOGUE – DEMO CONTENT
 *
 * Descriptions, consultation steps, indications, contraindications, durations and qualification rules
 * were written for a demo concept and MUST be reviewed by the studio's medical staff before publication.
 * The copy is informational: no promised results, no before/after claims, no medicine brand names
 * (medical services and prescription medicines cannot be advertised to the public in Poland).
 */

export type CategorySlug = "aesthetic-medicine" | "skin-treatments" | "professional-cosmetology" | "skin-consultation";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** One line – used in the menu-like index on the home page. */
  line: string;
  intro: string;
  performedBy: string;
  image: ImageKey;
}

export interface Treatment {
  slug: string;
  category: CategorySlug;
  name: string;
  lede: string;
  summary: string;
  image: ImageKey;
  overview: string[];
  consultation: { title: string; text: string }[];
  indications: string[];
  contraindications: string[];
  contraindicationsNote?: string;
  qualification: string[];
  facts: { label: string; value: string }[];
}

export const categories: Category[] = [
  {
    slug: "aesthetic-medicine",
    name: "Aesthetic Medicine",
    line: "Physician-led, planned in stages.",
    intro:
      "Medical treatments performed by a physician after an in-person consultation. We plan in stages and review at each visit – the aim is to keep your features, not to replace them.",
    performedBy: "Physician",
    image: "catAesthetic",
  },
  {
    slug: "skin-treatments",
    name: "Skin Treatments",
    line: "Peels, microneedling and light therapy.",
    intro:
      "Targeted treatments for texture, tone and congestion, usually delivered as a course. Each session starts with a check of how your skin responded to the last one.",
    performedBy: "Cosmetologist, with physician oversight",
    image: "catSkin",
  },
  {
    slug: "professional-cosmetology",
    name: "Professional Cosmetology",
    line: "Facials that respect the skin barrier.",
    intro: "Hands-on facials with professional formulations. Thorough, unhurried and designed around the condition of your skin on the day.",
    performedBy: "Cosmetologist",
    image: "catCosmetology",
  },
  {
    slug: "skin-consultation",
    name: "Skin Consultation",
    line: "Start here when you're not sure.",
    intro: "An honest assessment of your skin and routine, with a written plan. The right first step if you don't yet know which treatment – if any – you need.",
    performedBy: "Skin therapist or physician",
    image: "catConsultation",
  },
];

const standardMedicalContra = [
  "Pregnancy and breastfeeding.",
  "Active infection, cold sores or inflammation in the treatment area.",
  "Autoimmune conditions during a flare-up.",
  "Bleeding disorders or anticoagulant medication.",
  "A tendency to form keloid scars.",
  "Known allergy to any component of the product.",
];

export const treatments: Treatment[] = [
  // ── Aesthetic Medicine ───────────────────────────────────────────────────
  {
    slug: "physician-consultation",
    category: "aesthetic-medicine",
    name: "Physician Consultation",
    lede: "A conversation with our physician about what you'd like to change – and what you'd like to keep.",
    summary: "Assessment, medical history and a written plan.",
    image: "txConsultation",
    overview: [
      "Every aesthetic medicine treatment at VÉRA begins here. The physician takes your medical history, asks about previous treatments and listens to what you want to achieve.",
      "Your face is assessed at rest and in motion, in daylight. You'll discuss realistic options, their limits and possible side effects – including the option of doing nothing at all.",
      "The consultation carries no obligation to book a treatment. You leave with a written summary.",
    ],
    consultation: [
      { title: "Medical history", text: "Health conditions, medication, allergies and previous treatments." },
      { title: "Your priorities", text: "What bothers you, what you like about your face, how much change feels right." },
      { title: "Assessment", text: "Proportions, skin quality and expression – with photos only if you agree." },
      { title: "Written plan", text: "Recommended steps, alternatives, an approximate timeline and costs." },
    ],
    indications: [
      "You are considering your first aesthetic treatment.",
      "You'd like a second opinion before deciding.",
      "You want earlier treatments brought together into one plan.",
    ],
    contraindicationsNote: "The consultation itself has no contraindications. The physician will discuss those relevant to any treatment you consider, for example:",
    contraindications: standardMedicalContra.slice(0, 4),
    qualification: [
      "The consultation is the qualification step for all physician-led treatments. The decision to treat is made together, once your history and contraindications have been reviewed.",
      "Please bring a list of your medication and any notes from previous treatments.",
    ],
    facts: [
      { label: "With", value: "Physician" },
      { label: "Duration", value: "45–60 min" },
      { label: "You receive", value: "Written plan" },
    ],
  },
  {
    slug: "facial-aesthetic-treatments",
    category: "aesthetic-medicine",
    name: "Facial Aesthetic Treatments",
    lede: "Physician-led treatments chosen for the structure of your face, aiming for change that keeps your expression.",
    summary: "Subtle, staged medical treatments for the face.",
    image: "txFacial",
    overview: [
      "This group covers medical treatments that may soften expression lines, rebalance selected areas or improve hydration and elasticity. The method and product are chosen only after a consultation.",
      "We prefer small steps with a review in between to one large correction. Treatments take place in a medical room using products authorised for use in the EU, and each step is documented.",
      "How you respond, and how long any effect lasts, depends on individual factors and cannot be guaranteed.",
    ],
    consultation: [
      { title: "Consultation", text: "History, facial assessment, expectations and contraindications." },
      { title: "Consent and preparation", text: "Procedure and possible complications explained, written consent, skin cleansed; local anaesthetic if needed." },
      { title: "Treatment", text: "Performed by the physician, usually within an hour." },
      { title: "Aftercare and review", text: "Written aftercare advice and a follow-up appointment." },
    ],
    indications: [
      "Expression lines in the upper face.",
      "Loss of volume or changed proportions in selected areas.",
      "Dehydrated skin with reduced elasticity.",
    ],
    contraindications: [...standardMedicalContra, "Neuromuscular disorders – for some procedures."],
    qualification: [
      "Only the physician can qualify you for a facial aesthetic treatment, during a consultation beforehand. The physician may postpone treatment or suggest an alternative if that is safer.",
      "We do not perform aesthetic medicine treatments on anyone under 18.",
    ],
    facts: [
      { label: "With", value: "Physician" },
      { label: "Before", value: "Consultation required" },
      { label: "Review", value: "Usually after 2–4 weeks" },
    ],
  },
  {
    slug: "skin-revitalisation",
    category: "aesthetic-medicine",
    name: "Skin Revitalisation",
    lede: "A course of medical treatments supporting hydration, density and the overall quality of the skin.",
    summary: "A course focused on skin quality, not features.",
    image: "txRevitalisation",
    overview: [
      "Rather than changing features, these treatments focus on the skin itself – its hydration, density and tone – on the face, neck, décolletage or hands.",
      "A course of sessions a few weeks apart is usually recommended, supported by home care. The plan is reviewed at every visit.",
    ],
    consultation: [
      { title: "Consultation", text: "Skin assessment and choice of method and number of sessions." },
      { title: "Preparation", text: "Cleansing, disinfection and anaesthetic cream." },
      { title: "Treatment", text: "Performed by the physician in the agreed area." },
      { title: "Aftercare", text: "Advice for the first days and the date of the next session." },
    ],
    indications: ["Dull, dehydrated skin.", "Reduced firmness and fine lines.", "Neck, décolletage or hands that need revitalising."],
    contraindications: [...standardMedicalContra.slice(0, 4), "Fresh tan or recent peels – depending on the method."],
    qualification: ["Qualification takes place during the consultation and is confirmed again before each session in the course."],
    facts: [
      { label: "With", value: "Physician" },
      { label: "Course", value: "Usually 2–4 sessions" },
      { label: "Afterwards", value: "Possible redness and small bumps" },
    ],
  },

  // ── Skin Treatments ──────────────────────────────────────────────────────
  {
    slug: "chemical-peels",
    category: "skin-treatments",
    name: "Chemical Peels",
    lede: "Controlled exfoliation with acids chosen for your skin type – for uneven tone, congestion and texture.",
    summary: "Acid exfoliation planned as a course.",
    image: "txPeel",
    overview: [
      "A peel removes the outermost layer of dead skin cells in a controlled way. Strength and type of acid are matched to your skin and adjusted from session to session.",
      "Peels are best planned for autumn and winter, with strict daily sun protection in between.",
    ],
    consultation: [
      { title: "Skin check", text: "History of sensitivity, medication and sun exposure." },
      { title: "Preparation", text: "Cleansing and protecting sensitive areas." },
      { title: "Peel", text: "Applied in layers, with the time watched closely." },
      { title: "Neutralising and protection", text: "Calming mask and SPF." },
    ],
    indications: ["Uneven tone and post-inflammatory marks.", "Congestion and enlarged pores.", "Rough texture."],
    contraindications: [
      "Pregnancy and breastfeeding – for most acids.",
      "Isotretinoin, currently or in recent months.",
      "Active cold sores or skin infection.",
      "Fresh tan or sunburn.",
    ],
    qualification: ["Before the first peel the cosmetologist reviews your history and skin. A patch test may be suggested for sensitive skin."],
    facts: [
      { label: "With", value: "Cosmetologist" },
      { label: "Course", value: "Usually 3–6 sessions" },
      { label: "Season", value: "Autumn and winter" },
    ],
  },
  {
    slug: "microneedling",
    category: "skin-treatments",
    name: "Microneedling",
    lede: "Controlled micro-channels created with a sterile device to support skin renewal – planned as a course.",
    summary: "Texture and post-acne marks, as a course.",
    image: "txMicroneedling",
    overview: [
      "Microneedling uses a sterile, single-use cartridge to create tiny controlled channels in the skin. It is often chosen for texture and post-acne marks.",
      "The skin is usually red for a day or two afterwards. Sessions are spaced several weeks apart.",
    ],
    consultation: [
      { title: "Assessment", text: "Skin check and medical history." },
      { title: "Preparation", text: "Cleansing, disinfection and anaesthetic cream." },
      { title: "Treatment", text: "Needle depth adjusted to each area." },
      { title: "Aftercare", text: "Calming care, SPF and a written routine for the next days." },
    ],
    indications: ["Post-acne marks.", "Uneven texture.", "Enlarged pores."],
    contraindications: [
      "Active acne or skin infection in the area.",
      "Isotretinoin, currently or in recent months.",
      "A tendency to form keloid scars.",
      "Bleeding disorders or anticoagulant medication.",
      "Pregnancy and breastfeeding.",
    ],
    qualification: ["Qualification by the cosmetologist; in some cases the physician will review your history first."],
    facts: [
      { label: "With", value: "Cosmetologist" },
      { label: "Course", value: "Usually 3–4 sessions" },
      { label: "Downtime", value: "1–2 days of redness" },
    ],
  },
  {
    slug: "led-light-therapy",
    category: "skin-treatments",
    name: "LED Light Therapy",
    lede: "A gentle, non-invasive session under a professional LED panel – often paired with other treatments.",
    summary: "Gentle, non-invasive, no downtime.",
    image: "txLed",
    overview: [
      "LED therapy uses specific wavelengths of light. It is comfortable, requires no downtime and is often used to calm skin after more active treatments.",
      "Your eyes are protected throughout. Sessions can be booked alone or added to a facial.",
    ],
    consultation: [
      { title: "Quick check", text: "Medication and light sensitivity." },
      { title: "Cleansing", text: "Skin prepared without make-up." },
      { title: "Light session", text: "Around 20 minutes under the panel, eyes protected." },
      { title: "Finish", text: "Moisturiser and SPF." },
    ],
    indications: ["Skin that feels reactive after treatments.", "Dull, tired-looking skin.", "As a calming add-on to a facial."],
    contraindications: ["Photosensitising medication.", "Photosensitive epilepsy.", "Eye conditions sensitive to light – please consult your doctor."],
    qualification: ["A short questionnaire before the first session."],
    facts: [
      { label: "With", value: "Cosmetologist" },
      { label: "Duration", value: "About 30 min" },
      { label: "Downtime", value: "None" },
    ],
  },

  // ── Professional Cosmetology ─────────────────────────────────────────────
  {
    slug: "signature-facial",
    category: "professional-cosmetology",
    name: "The VÉRA Facial",
    lede: "Our signature facial: cleansing, sculpting massage and a mask chosen on the day for your skin.",
    summary: "Cleansing, sculpting massage and a tailored mask.",
    image: "txSignatureFacial",
    overview: [
      "A hands-on facial built around a sculpting massage of the face, neck and décolletage. Products and the mask are chosen after a quick look at your skin on the day.",
      "It is designed as time out, too – phones away, no rush.",
    ],
    consultation: [
      { title: "Skin check", text: "What your skin needs today." },
      { title: "Cleansing", text: "Double cleanse and a gentle exfoliation." },
      { title: "Sculpting massage", text: "Face, neck and décolletage." },
      { title: "Mask and finish", text: "Tailored mask, serum, moisturiser, SPF." },
    ],
    indications: ["Tired, dull skin.", "Tension in the jaw and face.", "Regular professional care."],
    contraindications: ["Active skin infection.", "Open wounds or sunburn.", "Fever – for the massage."],
    qualification: ["A short questionnaire before the facial. Let us know about pregnancy and allergies – we'll adjust the products."],
    facts: [
      { label: "With", value: "Cosmetologist" },
      { label: "Duration", value: "75 min" },
      { label: "Make-up", value: "Best skipped until the next day" },
    ],
  },
  {
    slug: "deep-cleansing-facial",
    category: "professional-cosmetology",
    name: "Deep Cleansing Facial",
    lede: "A thorough but gentle cleanse for congested skin, finished with a calming mask.",
    summary: "Thorough cleansing for congested skin.",
    image: "txCleansing",
    overview: [
      "For blackheads and congestion. We combine enzyme exfoliation, steam, careful manual extraction and a calming mask – without stripping the skin barrier.",
      "If your skin needs medical diagnosis first, for example in moderate or severe acne, we'll suggest seeing our physician.",
    ],
    consultation: [
      { title: "Skin check", text: "Under a magnifying lamp." },
      { title: "Softening", text: "Enzyme exfoliation and steam." },
      { title: "Extraction", text: "Manual, careful, hygienic." },
      { title: "Calming", text: "Soothing mask and SPF." },
    ],
    indications: ["Blackheads and congestion.", "Oily or combination skin.", "Preparing skin for a course of treatments."],
    contraindications: ["Severe active inflammation.", "Skin infection.", "Isotretinoin, currently or recently.", "Sunburn."],
    qualification: ["The cosmetologist checks your skin at the start of the visit."],
    facts: [
      { label: "With", value: "Cosmetologist" },
      { label: "Duration", value: "90 min" },
      { label: "Frequency", value: "Every 4–6 weeks" },
    ],
  },

  // ── Skin Consultation ────────────────────────────────────────────────────
  {
    slug: "skin-analysis",
    category: "skin-consultation",
    name: "Skin Analysis",
    lede: "A close look at your skin and your routine – with honest advice on what is worth doing.",
    summary: "Assessment and honest recommendations.",
    image: "txSkinAnalysis",
    overview: [
      "For anyone who wants to understand their skin before choosing treatments. We assess your skin, go through your current routine and explain which treatments could make sense for you – and which wouldn't.",
      "If something needs a medical opinion, we'll refer you to our physician.",
    ],
    consultation: [
      { title: "Conversation", text: "Your concerns and daily routine." },
      { title: "Analysis", text: "Skin type and current condition, under magnification." },
      { title: "Recommendations", text: "Simple changes and possible treatments." },
      { title: "Next steps", text: "A follow-up plan or a physician consultation if needed." },
    ],
    indications: ["You don't know where to start.", "Your skin has changed recently.", "You're unsure about the products you use."],
    contraindicationsNote: "A skin analysis has no contraindications.",
    contraindications: [],
    qualification: ["No qualification needed. Please come without make-up and bring a list of your products."],
    facts: [
      { label: "With", value: "Skin therapist" },
      { label: "Duration", value: "45 min" },
      { label: "You receive", value: "Written notes" },
    ],
  },
  {
    slug: "personal-skincare-plan",
    category: "skin-consultation",
    name: "Personal Skincare Plan",
    lede: "A written plan for home care and in-studio treatments over the next months – realistic and easy to follow.",
    summary: "A written plan for the months ahead.",
    image: "txSkincarePlan",
    overview: [
      "We organise your routine: what to use morning and evening, in which order, and how it fits with treatments in the studio.",
      "You don't need to buy specific brands. If your products work, they stay in the plan.",
    ],
    consultation: [
      { title: "Skin and routine", text: "Bring your products or photos of their labels." },
      { title: "Priorities", text: "What to start with, and what to leave alone for now." },
      { title: "Written plan", text: "Morning, evening and a treatment calendar." },
      { title: "Review", text: "A check-in after 6–8 weeks." },
    ],
    indications: ["No results despite a regular routine.", "Too many products.", "A new life stage – pregnancy, a move, a new climate."],
    contraindicationsNote: "A skincare plan has no contraindications. Skin changes that need diagnosis are referred to a physician.",
    contraindications: [],
    qualification: ["No qualification needed."],
    facts: [
      { label: "With", value: "Skin therapist" },
      { label: "Duration", value: "60 min" },
      { label: "Review", value: "After 6–8 weeks" },
    ],
  },
];

export const getTreatment = (slug: string) => treatments.find((t) => t.slug === slug);
export const getCategory = (slug: CategorySlug) => categories.find((c) => c.slug === slug)!;
export const treatmentsIn = (slug: CategorySlug) => treatments.filter((t) => t.category === slug);
