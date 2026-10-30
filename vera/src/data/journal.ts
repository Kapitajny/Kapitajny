import type { ImageKey } from "@/config/images";

/** Journal entries. Educational content for the concept – to be reviewed by the studio's specialists. */

export interface JournalBlock {
  type: "p" | "h2" | "list" | "quote";
  text?: string;
  items?: string[];
}

export interface JournalEntry {
  slug: string;
  title: string;
  excerpt: string;
  topic: string;
  /** ISO date. */
  date: string;
  readingMinutes: number;
  author: string;
  image: ImageKey;
  body: JournalBlock[];
}

export const journal: JournalEntry[] = [
  {
    slug: "what-happens-at-a-first-consultation",
    title: "What happens at a first consultation",
    excerpt: "An hour, a mirror and a lot of questions. Here is what to expect – and what to bring.",
    topic: "At the studio",
    date: "2026-10-14",
    readingMinutes: 4,
    author: "Adam Lis",
    image: "consultation",
    body: [
      { type: "p", text: "Most people arrive at their first consultation with a photo, a treatment name or a worry. All three are good starting points. None of them is a decision." },
      { type: "h2", text: "We start with you, not the treatment" },
      { type: "p", text: "The first part of the visit is a conversation: what you would like to change, what you have tried, what you use at home and anything about your health we should know. There are no wrong answers, and nothing is booked at this stage." },
      { type: "h2", text: "Then we look closely" },
      { type: "p", text: "We assess your skin in daylight, sometimes with magnification. We look at texture, tone, hydration and how your face moves when you talk. With your permission, we take reference photos for your file." },
      { type: "h2", text: "What to bring" },
      {
        type: "list",
        items: [
          "A list of the skincare products you use, or photos of them",
          "Any medication or supplements you take regularly",
          "Notes on previous treatments – what, when and where",
        ],
      },
      { type: "h2", text: "What you leave with" },
      { type: "p", text: "A written plan that includes options, timing and costs. Sometimes the plan is home care for three months before anything else. Sometimes it is a referral to a doctor. Sometimes it is a treatment. You decide, in your own time." },
    ],
  },
  {
    slug: "sunscreen-in-winter",
    title: "Sunscreen in winter is not optional",
    excerpt: "Shorter days do not switch off UV. Why we ask about SPF before every peel – even in January.",
    topic: "Skin care",
    date: "2026-09-30",
    readingMinutes: 3,
    author: "Julia Sowa",
    image: "spf",
    body: [
      { type: "p", text: "Autumn and winter are when we plan most peels and microneedling courses. They are also when many people quietly drop their sunscreen. The two do not go well together." },
      { type: "h2", text: "UV doesn't take the winter off" },
      { type: "p", text: "UVA radiation, which contributes to pigmentation and skin ageing, is present all year round and passes through clouds and window glass. After a peel, freshly renewed skin is more sensitive to it." },
      { type: "h2", text: "A routine you will keep" },
      {
        type: "list",
        items: [
          "Apply a broad-spectrum SPF every morning as the last step of your routine",
          "Choose a texture you like – it is the one you will actually use",
          "Reapply when you spend longer outdoors, especially on snow",
        ],
      },
      { type: "quote", text: "The best sunscreen is the one you are happy to wear every single day." },
      { type: "p", text: "If you are in a treatment series with us, we will ask about SPF at each visit. It is not a formality: it is part of the treatment." },
    ],
  },
  {
    slug: "hydration-versus-moisture",
    title: "Hydrated or moisturised? The difference matters",
    excerpt: "Two words that are used as synonyms – and two different things your skin may need.",
    topic: "Skin care",
    date: "2026-09-09",
    readingMinutes: 5,
    author: "Adam Lis",
    image: "hydration",
    body: [
      { type: "p", text: "Dehydrated skin lacks water. Dry skin lacks oil. They can look similar – tight, dull, a little rough – but they call for slightly different care." },
      { type: "h2", text: "Signs of dehydration" },
      { type: "p", text: "Fine lines that appear when you gently push the skin, a feeling of tightness after cleansing, make-up that sits on the surface. Any skin type can be dehydrated, including oily skin." },
      { type: "h2", text: "What helps" },
      {
        type: "list",
        items: [
          "Humectants such as glycerin or hyaluronic acid, which attract water",
          "A moisturiser with emollients to keep that water in",
          "A gentle cleanser that does not strip the skin",
        ],
      },
      { type: "h2", text: "When to come in" },
      { type: "p", text: "If your skin stays tight and uncomfortable despite a consistent routine, a skin consultation can help find out why. Sometimes the answer is a treatment; more often it is a simpler routine." },
    ],
  },
];

export function getEntry(slug: string) {
  return journal.find((e) => e.slug === slug);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}
