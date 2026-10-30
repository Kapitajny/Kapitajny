import type { Dictionary } from "./pl";

/** Teksty strony po angielsku. Klucze muszą odpowiadać wersji polskiej (`pl.ts`). */
export const en: Dictionary = {
  meta: {
    title: "NOIR STUDIO – Photography studio in Warsaw",
    description:
      "NOIR STUDIO is a Warsaw photography studio for weddings, portraits, fashion, commercial work and personal stories – quiet, considered photographs made to outlast the day they were taken.",
    ogTitle: "NOIR STUDIO – Moments become timeless",
    ogLocale: "en_GB",
    notFoundTitle: "Page not found",
  },

  common: {
    skipToContent: "Skip to content",
    backToTop: "NOIR STUDIO, back to the top",
    city: "Warsaw",
    country: "Poland",
    visitsByAppointment: "Studio visits by appointment",
    placeholder: "Photograph to be added",
  },

  language: {
    label: "Site language",
    names: { pl: "Polski", en: "English" },
  },

  nav: {
    label: "Main",
    footerLabel: "Footer",
    menu: "Menu",
    menuDialog: "Site menu",
    close: "Close",
    items: { top: "Home", portfolio: "Portfolio", services: "Services", about: "About", contact: "Contact" },
  },

  hero: {
    titleLines: ["Moments", "become", "timeless."],
    subtitle: "Photography is the art of remembering.",
    cta: "Discover our work",
    scroll: "Scroll",
    scrollLabel: "Scroll to the portfolio",
  },

  portfolio: {
    title: "Selected work",
    lead: "Weddings, portraits, fashion, commercial commissions and the quieter stories of families at home. Choose a field to see the photographs we made there, then open any frame to view it large.",
    all: "All work",
    filterLabel: "Filter the portfolio by category",
    photos: { one: "photograph", other: "photographs" },
    showing: "{label}: {count} {photos}.",
    open: "Open “{title}” in full view",
    categories: {
      weddings: "Weddings",
      portraits: "Portraits",
      fashion: "Fashion",
      commercial: "Commercial",
      stories: "Personal Stories",
    },
    items: {
      weddingVows: { title: "Vows at the altar", place: "Church ceremony" },
      portraitStudio: { title: "Study in one light", place: "NOIR Studio, Warsaw" },
      fashionSummer: { title: "Summer, three pairs of sunglasses", place: "Studio lookbook" },
      commercialCamera: { title: "Camera against the sun", place: "Outdoor product shot" },
      storyMorning: { title: "Ninth month, in motion", place: "Maternity session in the studio" },
      weddingWalk: { title: "After the guests", place: "Wilanów, Warsaw" },
      portraitWindow: { title: "Shearling in autumn light", place: "Outdoor session" },
      fashionStreet: { title: "Black against the Palace", place: "Palace of Culture and Science, Warsaw" },
      commercialProduct: { title: "Portrait in a striped dress", place: "Painting reproduced for a catalogue" },
      storyKitchen: { title: "Sunday dough", place: "Lublin" },
      weddingDetails: { title: "The second earring", place: "Warsaw" },
      storySea: { title: "Baltic, January", place: "Łeba" },
      portraitHands: { title: "The pianist's hands", place: "Kraków" },
      fashionMotion: { title: "Black dress, half turn", place: "NOIR Studio, Warsaw" },
      commercialCraft: { title: "Saddle stitch", place: "Leather workshop, Poznań" },
      weddingDance: { title: "First dance, last candles", place: "Masuria" },
      storyLetters: { title: "Everything she kept", place: "Toruń" },
      commercialArchitecture: { title: "Facade at blue hour", place: "Gdańsk" },
      portraitArtist: { title: "Painter among canvases", place: "Łódź" },
      fashionDetail: { title: "Lapel and silver", place: "NOIR Studio, Warsaw" },
    },
  },

  lightbox: {
    dialog: "Photograph viewer",
    photo: "Photograph: {title}",
    counter: "Photograph",
    prev: "Prev",
    next: "Next",
    prevLabel: "Previous photograph",
    nextLabel: "Next photograph",
    close: "Close",
  },

  about: {
    title: "Behind every frame, there is a story.",
    name: "Maja Leśniak",
    role: "Founder and lead photographer",
    story: [
      "NOIR STUDIO began as a single rented room in central Warsaw: one camera, one light and a roll of grey paper. Maja had spent years assisting fashion photographers, learning how much of a picture is decided before the shutter is pressed.",
      "She wanted to bring that discipline to the photographs people actually keep: a wedding, a parent's hands, a child on a Saturday morning. The studio still works that way. We take fewer commissions than we could, and we stay with each one from the first conversation to the final print.",
    ],
    quote: "We would rather make one photograph you keep for forty years than three hundred you scroll past once.",
    principlesTitle: "How we work",
    principles: [
      {
        title: "Light first",
        text: "We read the light in a room before we take a camera out of the bag. Most of a good photograph is decided there.",
      },
      {
        title: "Direct less, notice more",
        text: "We give just enough direction to put people at ease, then step back and wait for the moment that would have happened anyway.",
      },
      {
        title: "Edit honestly",
        text: "Skin stays skin. We correct light and colour, remove what distracts, and leave the rest of the person alone.",
      },
    ],
    facts: [
      { term: "Behind the camera", detail: "Since 2012" },
      { term: "Studio", detail: "Śródmieście, Warsaw" },
      { term: "Works across", detail: "Poland and Europe" },
      { term: "Languages", detail: "Polish, English, Italian" },
    ],
  },

  services: {
    title: "Services",
    lead: "Every commission starts with a conversation about what the photographs are for. The scope below is where we usually begin; we shape the details, the schedule and the quote around your day or your brief.",
    scopeTitle: "What's included",
    items: {
      weddings: {
        name: "Wedding Photography",
        description:
          "We follow the day as it actually happens: the nerves before, the ceremony, the people who travelled to be there. We work quietly, direct only when it helps, and leave you with an archive your family will still open in thirty years.",
        scope: [
          "Half-day or full-day coverage",
          "Second photographer on request",
          "A short portrait session for the two of you",
          "Online gallery of edited photographs within six weeks",
          "Optional linen-bound album and archival prints",
        ],
        cta: "Inquire about your wedding",
      },
      portraits: {
        name: "Portrait Photography",
        description:
          "For people who need a portrait that looks like them on a good day, not like a filter: artists, authors, founders, actors. We talk first, then build the light around your face and the way you hold yourself.",
        scope: [
          "Ninety-minute session in our Warsaw studio or on location",
          "Advice on clothing and setting before the shoot",
          "Choosing the final frames together",
          "Eight to fifteen retouched portraits in full resolution",
          "Usage for press, books and personal brand",
        ],
        cta: "Inquire about a portrait",
      },
      fashion: {
        name: "Fashion Photography",
        description:
          "Editorials, lookbooks and campaigns for designers and brands. We start from the garment, its weight, cut and the way it moves, and build the set, the casting and the light around it.",
        scope: [
          "Creative concept and moodboard",
          "Casting, styling, hair and make-up coordination",
          "Studio or location production",
          "Retouching to an agreed standard",
          "Licences for print, web and social media",
        ],
        cta: "Inquire about a fashion project",
      },
      commercial: {
        name: "Commercial Photography",
        description:
          "Products, interiors, architecture and the people behind a business, photographed with the same care as our personal work and delivered in the formats your team actually uses.",
        scope: [
          "Pre-production call and shot list",
          "Product and still life in the studio",
          "Interiors and architecture on location",
          "Team and founder portraits",
          "Files prepared for web, print and marketplaces",
        ],
        cta: "Inquire about a commercial shoot",
      },
      personal: {
        name: "Personal Sessions",
        description:
          "Unhurried sessions at home or in a place that matters to you: a new baby, a family, a couple, a parent you want to remember exactly as they are. No studio props and very little posing.",
        scope: [
          "Two to three hours at home or a place you choose",
          "Black-and-white and colour edits",
          "Online gallery to share with family",
          "A small set of archival prints",
          "Gift vouchers available",
        ],
        cta: "Inquire about a personal session",
      },
    },
  },

  contact: {
    title: "Let's plan your photographs.",
    lead: "Tell us what you have in mind, roughly when, and who will be in front of the camera. We reply with available dates, an outline of the session and a quote.",
    studio: "Studio",
    visits: "Visits",
    visitsValue: "By appointment",
    email: "Email",
  },

  form: {
    name: "Full name",
    email: "Email address",
    session: "Type of session",
    sessionPlaceholder: "Choose a session",
    date: "Preferred date",
    optional: "(optional)",
    message: "Message",
    messagePlaceholder: "Where, who, and what the photographs are for.",
    submit: "Send inquiry",
    sending: "Sending inquiry…",
    demoNote: "Demo version: this form is not connected to the studio inbox yet, so inquiries are not delivered.",
    sent: "Inquiry sent. We reply to every message within two working days.",
    notConfigured: "This demo form is not connected to the studio inbox yet, so your inquiry was not sent.",
    keptText: "Your text is still in the form, so nothing is lost.",
    sendByEmail: "Send it by email instead",
    offline: "No connection. Check your internet connection and try again.",
    mail: {
      subject: "Inquiry: {session}",
      fallbackSession: "photography",
      name: "Name",
      date: "Preferred date",
      flexible: "flexible",
    },
    sessionTypes: {
      wedding: "Wedding photography",
      portrait: "Portrait photography",
      fashion: "Fashion photography",
      commercial: "Commercial photography",
      personal: "Personal session",
      other: "Something else",
    },
    errors: {
      nameMissing: "Enter your full name.",
      nameLong: "Keep your name under 120 characters.",
      emailMissing: "Enter your email address so we can reply.",
      emailInvalid: "Enter an email address in the format name@example.com.",
      session: "Choose the type of session.",
      dateInvalid: "Enter the date as day, month and year.",
      datePast: "Choose a date from today onwards.",
      messageShort: "Tell us a little about what you have in mind (at least 10 characters).",
      messageLong: "Keep your message under 3000 characters.",
    },
    api: {
      rateLimited: "Too many attempts. Wait a minute and try again.",
      badRequest: "The inquiry could not be read. Reload the page and try again.",
      tooLarge: "Your message is too long.",
      validation: "Some fields need your attention.",
      deliveryFailed: "Your inquiry could not be delivered. Try again in a few minutes.",
    },
  },

  footer: {
    note: "A fictional studio designed and built by {agency} as a demonstration project.",
  },

  notFound: {
    title: "This frame is empty.",
    text: "The page you were looking for doesn't exist or has moved.",
    back: "Back to the studio",
  },

  images: {
    heroDusk: "A photographer kneeling on a moorland ridge at dusk, a long lens on a tripod pointed across the valley",
    aboutPortrait: "The founder of NOIR STUDIO raising her camera, the lens pointed straight at the viewer",
    cameraSunset: "A camera on a tripod facing a low sun over a misty valley",
    cameraMountains: "A camera with a long lens on a tripod overlooking forested hills and distant mountains",
    weddingVows: "A bride and groom holding hands at the altar while a priest reads the vows, bridesmaids in blue behind them",
    weddingDance: "A couple's first dance in a dim ballroom lit by candles",
    weddingDetails: "A bride's hands fastening a pearl earring before the ceremony",
    weddingWalk: "Newlyweds walking away along a tree-lined avenue at dusk",
    portraitStudio: "A woman photographed against a plain dark backdrop with a single side light",
    portraitWindow: "A smiling man in a shearling leather coat and patterned scarf in warm evening light",
    portraitHands: "Close-up of an older pianist's hands resting on the keys",
    portraitArtist: "A painter in her studio among canvases, looking straight into the lens",
    fashionSummer: "Three laughing young women in sunglasses and summer clothes against a beige backdrop",
    fashionMotion: "Fabric of a black dress caught mid-turn against a white wall",
    fashionStreet: "Black-and-white photograph of a model in a black dress at a railing, the Palace of Culture and Science behind her",
    fashionDetail: "Detail of a tailored jacket lapel and a silver brooch",
    commercialCamera: "A hand raising a DSLR camera with a lens towards the sun against a pale sky",
    commercialProduct: "Reproduction of an oil painting: a woman in a striped dress holding a cup in a green armchair against a pink wall",
    commercialCraft: "A leatherworker's hands stitching a bag at a workbench",
    commercialArchitecture: "A modern office facade with repeating windows at blue hour",
    storyKitchen: "A grandmother and granddaughter baking together in a small kitchen",
    storyMorning: "Black-and-white photograph of a pregnant woman in jeans, her hair flying, against a light backdrop",
    storySea: "A father and son standing at the edge of the Baltic Sea in winter",
    storyLetters: "Hands sorting old family photographs and letters on a table",
    serviceWeddings: "A bride and groom holding hands at the altar during a church ceremony",
    servicePortraits: "Portrait of a smiling man in a shearling leather coat",
    serviceFashion: "Black-and-white photograph of a model in a black dress in front of the Palace of Culture and Science",
    serviceCommercial: "Reproduction of an oil painting of a woman holding a cup",
    servicePersonal: "Black-and-white photograph from a maternity session, a woman with flying hair",
  },
};
