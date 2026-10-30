import type { ImageKey } from "@/config/images";

/** JOURNAL – demo articles. Health-related statements need review by the studio's specialists. */
export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: string;
  date: string; // ISO
  readingMinutes: number;
  image: ImageKey;
  body: { heading?: string; text: string }[];
}

export const articles: Article[] = [
  {
    slug: "daylight-and-your-skin",
    title: "Daylight and your skin",
    dek: "Why sun protection matters every day of the year – and how to choose an SPF you will actually wear.",
    category: "Skin care",
    date: "2026-10-12",
    readingMinutes: 4,
    image: "journalDaylight",
    body: [
      { text: "Ultraviolet light reaches your skin on cloudy days, through windows and in winter. Over time it is one of the main external factors behind uneven tone and the loss of firmness." },
      { heading: "Every day, not only on holiday", text: "Daily protection works best when it is simple: one product you like, applied every morning as the last step of your routine." },
      { heading: "Choosing a texture", text: "The best SPF is the one you will use. Oily skin often prefers fluids and gels, dry skin creams. If one formula stings or feels heavy, try another – the protection factor matters more than the brand." },
      { heading: "Around treatments", text: "After peels, microneedling and many other treatments, sun protection is part of aftercare. Your specialist will tell you exactly how long to be especially careful." },
    ],
  },
  {
    slug: "your-first-consultation",
    title: "What happens at your first consultation",
    dek: "No pressure, no packages – a step-by-step look at the first hour at VÉRA.",
    category: "At the studio",
    date: "2026-09-28",
    readingMinutes: 3,
    image: "journalFirstVisit",
    body: [
      { text: "The first visit is a conversation. We want to understand your skin, your health and what you'd like to achieve before anyone suggests a treatment." },
      { heading: "Before you arrive", text: "Come without make-up if you can, and bring a list of your medication and skincare products. Photos of product labels are fine." },
      { heading: "In the room", text: "We'll talk through your history, assess your skin in daylight and answer your questions. Photos are taken only with your consent." },
      { heading: "Afterwards", text: "You leave with written notes. There is no obligation to book anything – many clients take a few days to decide." },
    ],
  },
  {
    slug: "skin-barrier-explained",
    title: "The skin barrier, explained",
    dek: "Tightness, stinging and sudden sensitivity are often signs of a stressed barrier. Here's what helps.",
    category: "Skin care",
    date: "2026-09-08",
    readingMinutes: 5,
    image: "journalBarrier",
    body: [
      { text: "The outermost layer of the skin keeps water in and irritants out. When it is disrupted – by over-exfoliation, harsh cleansers or weather – skin can feel tight, sting and react to products it used to tolerate." },
      { heading: "Do less for a while", text: "Pause strong exfoliants and retinoids, use a gentle cleanser and a moisturiser without fragrance. A short, simple routine gives the skin room to recover." },
      { heading: "When to ask for help", text: "If irritation persists for more than a couple of weeks, or you notice rashes or swelling, book a consultation. Some conditions need a medical opinion." },
    ],
  },
  {
    slug: "planning-treatments-around-your-calendar",
    title: "Planning treatments around your calendar",
    dek: "Weddings, holidays, big presentations – how far ahead to book, and what to avoid in the last weeks.",
    category: "Planning",
    date: "2026-08-21",
    readingMinutes: 3,
    image: "journalCalendar",
    body: [
      { text: "The most common request we hear is “I have an event in two weeks”. Some treatments are fine at short notice; others need time for the skin to settle." },
      { heading: "Two to three months ahead", text: "That's the ideal window for courses such as peels or microneedling, and for any medical treatment that may need a review appointment." },
      { heading: "The last two weeks", text: "Stick to what your skin already knows. A calming facial or LED session is a better choice than trying something new." },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}
