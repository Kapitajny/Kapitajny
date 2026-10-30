import type { ImageKey } from "@/config/images";

/**
 * Treatment catalogue. Medical content is illustrative for this concept and must be
 * reviewed and approved by the studio's medical staff before publication.
 */

export type CategorySlug = "aesthetic-medicine" | "skin-treatments" | "professional-cosmetology" | "skin-consultation";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** One sentence used in lists and the home page. */
  summary: string;
  intro: string;
  image: ImageKey;
}

export interface Treatment {
  slug: string;
  name: string;
  category: CategorySlug;
  lede: string;
  description: string[];
  duration: string;
  /** How the visit is usually planned – a description, not a promise. */
  course: string;
  /** Ordered steps of the visit. */
  process: { title: string; text: string }[];
  indications: string[];
  contraindications: string[];
  qualification: string;
  image: ImageKey;
}

export const categories: Category[] = [
  {
    slug: "aesthetic-medicine",
    name: "Aesthetic medicine",
    summary: "Physician-led procedures that work with your proportions, never against them.",
    intro:
      "Every aesthetic medicine procedure at VÉRA is performed by a physician and preceded by a medical interview. We plan in small, measured steps and agree on the result before anything is done.",
    image: "assessment",
  },
  {
    slug: "skin-treatments",
    name: "Skin treatments",
    summary: "Peels and microneedling planned as a course, matched to season and skin type.",
    intro:
      "Treatments that renew the skin's surface and support its structure. We plan them as a course, adjust them to the season and always pair them with home care you can actually keep up.",
    image: "serum",
  },
  {
    slug: "professional-cosmetology",
    name: "Professional cosmetology",
    summary: "Facials, massage and hand care performed by cosmetologists, unhurried and precise.",
    intro:
      "Hands-on care for the face and hands. Each ritual begins with a short skin check, so the products and techniques suit how your skin looks on the day, not on paper.",
    image: "facialRitual",
  },
  {
    slug: "skin-consultation",
    name: "Skin consultation",
    summary: "An hour to understand your skin before deciding on any treatment.",
    intro:
      "The starting point for most of our clients. A specialist assesses your skin, listens to what you want to change and proposes a plan – including the option of doing nothing at all.",
    image: "consultation",
  },
];

const standardMedicalContra = [
  "Pregnancy and breastfeeding",
  "Active skin infection, inflammation or cold sores in the treatment area",
  "Uncontrolled systemic illness or fever",
];

export const treatments: Treatment[] = [
  /* ───────────── Aesthetic medicine ───────────── */
  {
    slug: "wrinkle-relaxing-treatment",
    name: "Wrinkle relaxing treatment",
    category: "aesthetic-medicine",
    lede: "Softening of expression lines on the forehead, between the brows and around the eyes, planned to keep your face expressive.",
    description: [
      "A prescription preparation is injected in very small doses into selected muscles to reduce how strongly they contract. Lines formed by repeated expressions become less visible over the following days.",
      "We aim for a rested face rather than a frozen one. The dose and the points are planned with you in front of a mirror, and a follow-up visit is part of the plan.",
    ],
    duration: "30 minutes",
    course: "One session with a follow-up visit about two weeks later",
    process: [
      { title: "Medical interview", text: "The physician asks about your health, medication and any previous procedures." },
      { title: "Facial analysis", text: "We look at your expressions together and agree which lines to soften and which to keep." },
      { title: "Treatment", text: "Small doses are placed with a fine needle. Most people describe it as brief pinpricks." },
      { title: "Follow-up", text: "About two weeks later we review the result and decide whether any adjustment is needed." },
    ],
    indications: ["Horizontal forehead lines", "Vertical lines between the brows", "Lines at the outer corners of the eyes"],
    contraindications: [
      ...standardMedicalContra,
      "Neuromuscular disorders",
      "Known allergy to any component of the preparation",
      "Certain medications – the physician reviews them during the interview",
    ],
    qualification:
      "Qualification is made by the physician during a consultation, after a medical interview and examination. The physician may decide that the treatment is not suitable for you or recommend postponing it.",
    image: "assessment",
  },
  {
    slug: "hyaluronic-acid-contouring",
    name: "Hyaluronic acid contouring",
    category: "aesthetic-medicine",
    lede: "Restoring volume and definition to lips, cheeks or jawline with hyaluronic acid fillers, in proportion to your features.",
    description: [
      "Hyaluronic acid is a substance naturally present in the skin. As a filler, it can restore volume that has diminished over time or gently define the lips, cheekbones and jawline.",
      "We work with modest amounts and your own proportions as the reference. Where it makes sense, we spread the result over two visits instead of one.",
    ],
    duration: "45–60 minutes",
    course: "Usually one session; the plan may include a top-up visit",
    process: [
      { title: "Medical interview", text: "Health questions, previous fillers and your expectations, discussed openly." },
      { title: "Proportion analysis", text: "We assess the face as a whole and mark the planned areas together." },
      { title: "Treatment", text: "After a topical anaesthetic, the preparation is placed with a needle or a cannula." },
      { title: "Aftercare and review", text: "You receive written aftercare instructions. We review the result at a follow-up visit." },
    ],
    indications: ["Loss of volume in the cheeks or temples", "Lip definition or hydration", "Softening of the nasolabial folds", "Jawline and chin contour"],
    contraindications: [
      ...standardMedicalContra,
      "Autoimmune disease in an active phase",
      "Blood clotting disorders or anticoagulant treatment",
      "Permanent filler previously placed in the area",
    ],
    qualification:
      "The physician qualifies you for treatment after a medical interview and examination. If your goals are better served by another approach – or by no treatment – you will hear it at the consultation.",
    image: "profile",
  },
  {
    slug: "skin-boosters",
    name: "Skin boosters",
    category: "aesthetic-medicine",
    lede: "Micro-injections of non-crosslinked hyaluronic acid to support skin hydration and texture on the face, neck and décolleté.",
    description: [
      "Skin boosters deliver a light, fluid form of hyaluronic acid into the skin in many tiny points. Their aim is better hydration and elasticity rather than added volume.",
      "They are usually planned as a short series, often in the cooler months, and combine well with consistent home care.",
    ],
    duration: "45 minutes",
    course: "Typically a series of two to three sessions several weeks apart",
    process: [
      { title: "Medical interview", text: "We check your health and recent treatments, and look at your skin in daylight." },
      { title: "Preparation", text: "The skin is cleansed and a topical anaesthetic is applied." },
      { title: "Treatment", text: "Small amounts are placed across the area with a fine needle." },
      { title: "Aftercare", text: "Small marks can be visible for a day or two. We explain what to avoid in the meantime." },
    ],
    indications: ["Dehydrated, dull skin", "Fine crepey lines on the neck or décolleté", "Skin that looks tired after summer"],
    contraindications: [...standardMedicalContra, "Autoimmune disease in an active phase", "Known allergy to hyaluronic acid preparations"],
    qualification: "Qualification by the physician during a consultation. The series is planned only after your skin has been assessed in person.",
    image: "hydration",
  },

  /* ───────────── Skin treatments ───────────── */
  {
    slug: "chemical-peel",
    name: "Chemical peel",
    category: "skin-treatments",
    lede: "Controlled exfoliation with acids chosen for your skin, to even out texture and tone.",
    description: [
      "A peel applies a selected acid or blend of acids that loosens the outer layer of the skin. Depending on the formula and concentration, it can refine texture, help with blemishes or even out tone.",
      "We favour gentle peels in a series over a single strong one, and we schedule them for the months with less sun.",
    ],
    duration: "40 minutes",
    course: "Usually a series of three to six sessions",
    process: [
      { title: "Skin check", text: "We assess your skin and ask about recent sun exposure, retinoids and other actives." },
      { title: "Preparation", text: "Cleansing and degreasing so the acid works evenly." },
      { title: "Peel", text: "The acid is applied and timed. A tingling or warm sensation is expected." },
      { title: "Neutralising and protection", text: "We finish with calming care and SPF, and give you home-care guidance." },
    ],
    indications: ["Uneven texture and enlarged pores", "Blemish-prone skin", "Uneven tone and post-blemish marks"],
    contraindications: [
      ...standardMedicalContra,
      "Recent sunburn or intensive tanning",
      "Oral retinoid treatment now or recently",
      "Open wounds or broken skin in the area",
    ],
    qualification: "Qualification by a specialist after a skin check. The type and strength of the peel are chosen individually and may change during the series.",
    image: "serum",
  },
  {
    slug: "microneedling",
    name: "Microneedling",
    category: "skin-treatments",
    lede: "Fine, controlled micro-punctures that encourage the skin's own renewal, for texture and firmness.",
    description: [
      "A device with very fine needles creates micro-channels in the skin. The skin's natural repair response is what supports smoother texture over time.",
      "Results build gradually across a series. The skin is usually pink for a day or two after each session.",
    ],
    duration: "60 minutes",
    course: "A series of three to four sessions about four weeks apart",
    process: [
      { title: "Skin check", text: "We check for contraindications and agree the areas to treat." },
      { title: "Preparation", text: "Cleansing and a topical anaesthetic for comfort." },
      { title: "Treatment", text: "The device is moved across the skin with a serum chosen for your skin." },
      { title: "Calming and aftercare", text: "A soothing mask, then clear instructions for the next days." },
    ],
    indications: ["Uneven texture", "Shallow acne scars", "Loss of firmness", "Enlarged pores"],
    contraindications: [...standardMedicalContra, "Active acne lesions in the area", "Tendency to keloid scarring", "Blood clotting disorders"],
    qualification: "Qualification by a specialist during a skin consultation. For some concerns we may refer you to a physician first.",
    image: "cream",
  },

  /* ───────────── Professional cosmetology ───────────── */
  {
    slug: "signature-facial",
    name: "VÉRA signature facial",
    category: "professional-cosmetology",
    lede: "Our ninety-minute facial: cleansing, gentle exfoliation, a mask chosen on the day and a long sculpting massage.",
    description: [
      "The facial is built around a short skin check at the start, so each step answers how your skin looks on the day. It combines careful cleansing, gentle exfoliation, a mask and a slow facial massage.",
      "It is a good first visit if you are new to professional care, and a good monthly routine if you are not.",
    ],
    duration: "90 minutes",
    course: "A single visit, or monthly as part of a care plan",
    process: [
      { title: "Skin check", text: "A few questions and a close look at your skin in good light." },
      { title: "Cleansing and exfoliation", text: "Double cleansing, then an exfoliation suited to your skin." },
      { title: "Mask and massage", text: "A mask chosen on the day and a sculpting face, neck and shoulder massage." },
      { title: "Finish and advice", text: "Final care with SPF and a short note on home care." },
    ],
    indications: ["Dull or tired-looking skin", "Dehydrated skin", "Anyone starting regular professional care"],
    contraindications: ["Active skin infection or cold sores", "Recent aesthetic medicine procedure in the area – please tell us", "Known allergy to cosmetic ingredients"],
    qualification: "No separate consultation is needed. The cosmetologist checks your skin at the start of the visit and adjusts or postpones steps if needed.",
    image: "facialMask",
  },
  {
    slug: "sculpting-face-massage",
    name: "Sculpting face massage",
    category: "professional-cosmetology",
    lede: "A manual massage of the face, neck and décolleté that relaxes tension and leaves the skin looking rested.",
    description: [
      "A slow, deep manual massage combining lymphatic drainage movements with work on the muscles of the face and jaw.",
      "Many clients book it on its own; it also pairs well with a facial or after a period of stress.",
    ],
    duration: "60 minutes",
    course: "A single visit or a short series",
    process: [
      { title: "Short interview", text: "We ask about tension, jaw clenching and anything we should avoid." },
      { title: "Preparation", text: "Light cleansing and a massage oil suited to your skin." },
      { title: "Massage", text: "Face, neck, décolleté and scalp, at a pace that lets you rest." },
      { title: "Finish", text: "Removal of excess oil and light care." },
    ],
    indications: ["Facial and jaw tension", "Puffiness", "Tired-looking skin"],
    contraindications: ["Active skin infection or inflammation", "Fever", "Recent filler treatment in the area – please tell us"],
    qualification: "No separate consultation is needed. Please mention any recent procedures when booking.",
    image: "facialRitual",
  },
  {
    slug: "hand-ritual",
    name: "Hand ritual and manicure",
    category: "professional-cosmetology",
    lede: "Exfoliation, a nourishing mask and precise nail care, finished in a classic shade or bare.",
    description: [
      "A complete treatment for hands that work hard: exfoliation, a nourishing mask, cuticle care and nail shaping.",
      "We finish with a long-wear polish in a short, considered palette – from nude to the studio's deep red – or simply with a buffed natural nail.",
    ],
    duration: "75 minutes",
    course: "Every three to four weeks",
    process: [
      { title: "Hand and nail check", text: "We look at the skin, the nails and any previous product to remove." },
      { title: "Exfoliation and mask", text: "A gentle scrub and a warm nourishing mask." },
      { title: "Nail care", text: "Cuticle care, shaping and preparation of the nail plate." },
      { title: "Finish", text: "Long-wear polish or a natural finish, and hand cream." },
    ],
    indications: ["Dry or rough hands", "Brittle nails", "Regular nail care"],
    contraindications: ["Fungal or bacterial nail infection", "Open wounds on the hands", "Known allergy to nail products"],
    qualification: "No separate consultation is needed. If we see signs of a nail infection, we will recommend seeing a doctor first.",
    image: "nailsBurgundy",
  },

  /* ───────────── Skin consultation ───────────── */
  {
    slug: "skin-consultation",
    name: "Skin consultation",
    category: "skin-consultation",
    lede: "An unhurried hour with a specialist to understand your skin and leave with a written plan.",
    description: [
      "We talk about what you would like to change, look at your skin closely in daylight and review your current routine. Then we explain what is realistic, what it involves and what it costs.",
      "You leave with a written plan. It can include treatments at the studio, home care only, or a referral to a doctor if something needs medical attention first.",
    ],
    duration: "60 minutes",
    course: "One visit; the plan is reviewed at your next appointment",
    process: [
      { title: "Conversation", text: "Your goals, your history with treatments and products, and your health." },
      { title: "Skin assessment", text: "A close look at your skin in daylight, with magnification where useful." },
      { title: "Options", text: "What could help, what each option involves, and what we would not recommend." },
      { title: "Written plan", text: "A summary of the plan and home care, sent to you after the visit." },
    ],
    indications: ["Before your first treatment at VÉRA", "When you are unsure what your skin needs", "When previous treatments did not meet your expectations"],
    contraindications: ["None for the consultation itself"],
    qualification: "Open to everyone over 18. Please bring a list of the products and medication you currently use.",
    image: "consultation",
  },
  {
    slug: "treatment-plan-review",
    name: "Treatment plan review",
    category: "skin-consultation",
    lede: "A short follow-up to see how your skin responds and adjust the plan for the next season.",
    description: [
      "Skin changes with the seasons, with hormones and with treatments. A review visit is a chance to compare with where you started and decide on the next steps together.",
    ],
    duration: "30 minutes",
    course: "Every few months, or whenever you have questions",
    process: [
      { title: "Comparison", text: "We compare your skin with the notes and photos from your first consultation." },
      { title: "Discussion", text: "What worked, what did not, and how your routine fits your life." },
      { title: "Updated plan", text: "Adjustments to treatments and home care for the coming months." },
    ],
    indications: ["Clients with an existing VÉRA plan", "Change of season", "Changes in your skin or health"],
    contraindications: ["None for the consultation itself"],
    qualification: "Available to clients after a skin consultation at VÉRA.",
    image: "spf",
  },
];

export function getCategory(slug: CategorySlug): Category {
  return categories.find((c) => c.slug === slug)!;
}

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export function treatmentsIn(category: CategorySlug): Treatment[] {
  return treatments.filter((t) => t.category === category);
}
