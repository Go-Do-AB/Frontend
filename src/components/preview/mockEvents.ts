/**
 * Mock events for the preview phone demo.
 *
 * Coverage:
 *  - 7 categories × 3 subcategories × 3 events = 63 events
 *  - Every tag (1001-1006) appears on at least 3 events
 *  - Realistic Swedish event titles/locations
 */

import { EventDto } from "@/types/events";

// ────────────────────────────────────────────────────────────────
// Category / subcategory / tag metadata
// ────────────────────────────────────────────────────────────────

const CATS: Record<number, { name: string; nameSv: string }> = {
  1: { name: "Events", nameSv: "Evenemang" },
  2: { name: "Sports & sporting activities", nameSv: "Idrott & sport" },
  3: { name: "Entertainment", nameSv: "Underhållning" },
  4: { name: "Culture & sights", nameSv: "Kultur & sevärdheter" },
  5: { name: "Adventure & activities", nameSv: "Upplevelser & äventyr" },
  6: { name: "Learn & explore", nameSv: "Lära & utforska" },
  7: { name: "Health & wellbeing", nameSv: "Hälsa & välmående" },
};

const SUBS: Record<number, { name: string; nameSv: string }> = {
  101: { name: "Festivals & fun", nameSv: "Festivaler & kul" },
  102: { name: "Leisure & lifestyle", nameSv: "Fritid & livsstil" },
  103: { name: "Fairs & markets", nameSv: "Mässor & marknader" },
  201: { name: "Sports to do", nameSv: "Sport att utöva" },
  202: { name: "Sports to watch", nameSv: "Sport att titta på" },
  203: { name: "Sports to try", nameSv: "Sport att prova" },
  301: { name: "Cinema & film", nameSv: "Bio & film" },
  302: { name: "Music & concerts", nameSv: "Musik & konserter" },
  303: { name: "Theater & shows", nameSv: "Teater & shower" },
  401: { name: "Guided tours", nameSv: "Guidade turer" },
  402: { name: "Art & galleries", nameSv: "Konst & gallerier" },
  403: { name: "Museums & sights", nameSv: "Museer & sevärdheter" },
  501: { name: "Parks & trails", nameSv: "Parker & stigar" },
  502: { name: "Food & drink activities", nameSv: "Mat & dryck" },
  503: { name: "Trips & adventures", nameSv: "Utflykter & äventyr" },
  601: { name: "Talks & lectures", nameSv: "Föreläsningar" },
  602: { name: "Learn to...", nameSv: "Lär dig..." },
  603: { name: "Gatherings & meetings", nameSv: "Träffar & möten" },
  701: { name: "Spas & pools", nameSv: "Spa & bad" },
  702: { name: "Support & interaction", nameSv: "Stöd & samverkan" },
  703: { name: "Activities of faith", nameSv: "Trosaktiviteter" },
};

const TAGS: Record<number, string> = {
  1001: "Free",
  1002: "Family-friendly",
  1003: "Indoor",
  1004: "Outdoor",
  1005: "Senior focus",
  1006: "Wheelchair accessible",
};

// ────────────────────────────────────────────────────────────────
// Helper to build one EventDto
// ────────────────────────────────────────────────────────────────

let _id = 0;
function evt(
  catCode: number,
  subCode: number,
  title: string,
  city: string,
  daysFromNow: number,
  tagCodes: number[] = [],
  extra?: Partial<EventDto>,
): EventDto {
  _id++;
  const start = new Date();
  start.setDate(start.getDate() + daysFromNow);
  const cat = CATS[catCode];
  const sub = SUBS[subCode];
  return {
    id: `mock-${_id.toString().padStart(3, "0")}`,
    organiser: "Go.Do Preview",
    organisationNumber: "",
    title,
    description: `Preview event — ${title}`,
    streetName: "",
    city,
    postalCode: "",
    isActive: true,
    createdAt: new Date().toISOString(),
    sourceProvider: "preview",
    startDate: start.toISOString(),
    categories: [{ code: catCode, name: cat.name, nameSv: cat.nameSv }],
    subcategories: [{ code: subCode, name: sub.name, nameSv: sub.nameSv, categoryCode: catCode }],
    tags: tagCodes.map((c) => ({ code: c, name: TAGS[c] })),
    ...extra,
  };
}

// ────────────────────────────────────────────────────────────────
// 63 mock events (3 per subcategory)
// Tags are distributed so each of the 6 tags covers ≥ 5 events
// ────────────────────────────────────────────────────────────────

export const MOCK_EVENTS: EventDto[] = [
  // ── Cat 1: Events ──────────────────────────────────────────
  // 101 Festivals & fun
  evt(1, 101, "Helsingborg Summer Festival", "Helsingborg", 5, [1001, 1004]),
  evt(1, 101, "Malmö Kulturnatt", "Malmö", 12, [1001, 1002]),
  evt(1, 101, "Lund Carnival", "Lund", 18, [1004, 1002]),
  // 102 Leisure & lifestyle
  evt(1, 102, "Outdoor Yoga in the Park", "Helsingborg", 3, [1001, 1004]),
  evt(1, 102, "Mindful Living Expo", "Malmö", 7, [1003]),
  evt(1, 102, "Sustainability Fair", "Lund", 14, [1003, 1006]),
  // 103 Fairs & markets
  evt(1, 103, "Helsingborg Flea Market", "Helsingborg", 2, [1001, 1004]),
  evt(1, 103, "Christmas Market at Stortorget", "Helsingborg", 9, [1002, 1004]),
  evt(1, 103, "Vintage & Design Fair", "Malmö", 20, [1003]),

  // ── Cat 2: Sports ──────────────────────────────────────────
  // 201 Sports to do
  evt(2, 201, "Parkrun Helsingborg", "Helsingborg", 1, [1001, 1004]),
  evt(2, 201, "Beach Volleyball Tournament", "Helsingborg", 8, [1004]),
  evt(2, 201, "Swim & Run Challenge", "Malmö", 15, [1004, 1006]),
  // 202 Sports to watch
  evt(2, 202, "HIF vs Malmö FF", "Helsingborg", 4, [1004]),
  evt(2, 202, "Swedish Cup Handball", "Lund", 11, [1003]),
  evt(2, 202, "Rowing Championship", "Malmö", 22, [1004, 1006]),
  // 203 Sports to try
  evt(2, 203, "Try Padel — Free Intro", "Helsingborg", 6, [1001, 1003]),
  evt(2, 203, "Climbing Wall Open Day", "Malmö", 10, [1003, 1002]),
  evt(2, 203, "Sailing Taster Session", "Helsingborg", 17, [1004]),

  // ── Cat 3: Entertainment ───────────────────────────────────
  // 301 Cinema & film
  evt(3, 301, "Outdoor Cinema: Midsommar", "Helsingborg", 3, [1004, 1002]),
  evt(3, 301, "Swedish Film Festival", "Malmö", 13, [1003]),
  evt(3, 301, "Documentary Screening Night", "Lund", 19, [1003, 1005]),
  // 302 Music & concerts
  evt(3, 302, "Jazz at Dunkers", "Helsingborg", 2, [1003]),
  evt(3, 302, "Symphonic Sunset Concert", "Helsingborg", 8, [1004, 1001]),
  evt(3, 302, "Indie Night at Babel", "Malmö", 16, [1003]),
  // 303 Theater & shows
  evt(3, 303, "Hamlet at Helsingborg Stadsteater", "Helsingborg", 5, [1003, 1006]),
  evt(3, 303, "Comedy Open Mic", "Malmö", 10, [1003]),
  evt(3, 303, "Children's Puppet Theatre", "Lund", 21, [1003, 1002]),

  // ── Cat 4: Culture & sights ────────────────────────────────
  // 401 Guided tours
  evt(4, 401, "Historic Helsingborg Walk", "Helsingborg", 1, [1004, 1005]),
  evt(4, 401, "Malmö Canal Boat Tour", "Malmö", 7, [1004, 1006]),
  evt(4, 401, "Cathedral & City Tour", "Lund", 14, [1004]),
  // 402 Art & galleries
  evt(4, 402, "Modern Art at Dunkers", "Helsingborg", 4, [1003, 1006]),
  evt(4, 402, "Gallery Night Malmö", "Malmö", 9, [1003, 1001]),
  evt(4, 402, "Street Art Walking Tour", "Helsingborg", 18, [1004, 1001]),
  // 403 Museums & sights
  evt(4, 403, "Fredriksdal Open-Air Museum", "Helsingborg", 2, [1004, 1002]),
  evt(4, 403, "Kulturen i Lund", "Lund", 11, [1003, 1002, 1006]),
  evt(4, 403, "Maritime Museum Day", "Malmö", 20, [1003, 1005]),

  // ── Cat 5: Adventure & activities ──────────────────────────
  // 501 Parks & trails
  evt(5, 501, "Söderåsen Nature Hike", "Helsingborg", 3, [1004, 1001]),
  evt(5, 501, "Pildammsparken Walk", "Malmö", 8, [1004]),
  evt(5, 501, "Botanical Garden Trail", "Lund", 15, [1004, 1002]),
  // 502 Food & drink activities
  evt(5, 502, "Helsingborg Food Walk", "Helsingborg", 5, [1004]),
  evt(5, 502, "Craft Beer Tasting", "Malmö", 12, [1003]),
  evt(5, 502, "Farm-to-Table Dinner", "Lund", 19, [1004]),
  // 503 Trips & adventures
  evt(5, 503, "Kayak Trip to Ven", "Helsingborg", 6, [1004]),
  evt(5, 503, "Helicopter Tour of Öresund", "Malmö", 14, [1004]),
  evt(5, 503, "Zipline Adventure Park", "Helsingborg", 22, [1004, 1002]),

  // ── Cat 6: Learn & explore ─────────────────────────────────
  // 601 Talks & lectures
  evt(6, 601, "Climate Action Talk", "Helsingborg", 2, [1003, 1001]),
  evt(6, 601, "AI & the Future of Work", "Malmö", 9, [1003]),
  evt(6, 601, "History of Helsingborg Lecture", "Helsingborg", 16, [1003, 1005]),
  // 602 Learn to...
  evt(6, 602, "Pottery Workshop", "Helsingborg", 4, [1003]),
  evt(6, 602, "Swedish for Beginners", "Malmö", 7, [1003, 1001]),
  evt(6, 602, "Photography Walk & Learn", "Lund", 13, [1004]),
  // 603 Gatherings & meetings
  evt(6, 603, "Board Game Café Night", "Helsingborg", 1, [1003, 1002]),
  evt(6, 603, "Tech Meetup Malmö", "Malmö", 10, [1003]),
  evt(6, 603, "Book Club at Stadsbiblioteket", "Helsingborg", 17, [1003, 1005]),

  // ── Cat 7: Health & wellbeing ──────────────────────────────
  // 701 Spas & pools
  evt(7, 701, "Tropical Bath — Filurum", "Helsingborg", 3, [1003, 1002]),
  evt(7, 701, "Kallbadhuset Dip & Sauna", "Helsingborg", 8, [1004, 1006]),
  evt(7, 701, "Aq-va-kul Swim Day", "Malmö", 15, [1003, 1002]),
  // 702 Support & interaction
  evt(7, 702, "Grief Support Circle", "Helsingborg", 5, [1003, 1005]),
  evt(7, 702, "New Parents Meetup", "Malmö", 12, [1003, 1002]),
  evt(7, 702, "Senior Social Hour", "Lund", 19, [1003, 1005, 1006]),
  // 703 Activities of faith
  evt(7, 703, "Mindfulness Meditation", "Helsingborg", 2, [1003, 1001]),
  evt(7, 703, "Church Choir Concert", "Lund", 9, [1003]),
  evt(7, 703, "Interfaith Dialogue Evening", "Malmö", 16, [1003, 1006]),
];

// ────────────────────────────────────────────────────────────────
// Client-side filter + paginate helper
// ────────────────────────────────────────────────────────────────

export interface MockFilter {
  categoryCodes?: number[];
  subcategoryCodes?: number[];
  tagCodes?: number[];
  pageSize?: number;
}

export function filterMockEvents(filter: MockFilter = {}): {
  items: EventDto[];
  totalCount: number;
} {
  let result = MOCK_EVENTS;

  if (filter.categoryCodes?.length) {
    result = result.filter((e) =>
      e.categories.some((c) => filter.categoryCodes!.includes(c.code)),
    );
  }

  if (filter.subcategoryCodes?.length) {
    result = result.filter((e) =>
      e.subcategories.some((s) => filter.subcategoryCodes!.includes(s.code)),
    );
  }

  if (filter.tagCodes?.length) {
    result = result.filter((e) =>
      filter.tagCodes!.every((tc) => e.tags.some((t) => t.code === tc)),
    );
  }

  // Sort by startDate ascending
  result = [...result].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const totalCount = result.length;
  const pageSize = filter.pageSize ?? 30;

  return {
    items: result.slice(0, pageSize),
    totalCount,
  };
}
