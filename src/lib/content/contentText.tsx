import {
  CalendarDays,
  Users,
  Dribbble,
  Mountain,
  Film,
  Landmark,
  BookOpen,
  HeartPulse,
  Smile,
  Home,
  Accessibility,
  Glasses,
  Ticket,
  TreePine,
} from "lucide-react";
import { JSX } from "react";

// ────────────────────────────────────────────────────────────────
// 8 Categories / 24 Subcategories — aligned with backend DataSeeder
// Pattern: subcategory code = categoryCode * 100 + index
// Display order: family-friendly first, then broad → niche
// ────────────────────────────────────────────────────────────────

export const subcategoriesMap: Record<number, { code: number; label: string }[]> = {
  8: [
    { code: 801, label: "0–4 år" },
    { code: 802, label: "5–10 år" },
    { code: 803, label: "11–15 år" },
  ],
  1: [
    { code: 101, label: "Festival & nöjen" },
    { code: 102, label: "Fritid & livsstil" },
    { code: 103, label: "Loppis, marknad & mässa" },
  ],
  3: [
    { code: 301, label: "Bio & film" },
    { code: 302, label: "Musik & konsert" },
    { code: 303, label: "Teater & föreställning" },
  ],
  2: [
    { code: 201, label: "Idrott att utöva" },
    { code: 202, label: "Sport att se på" },
    { code: 203, label: "Prova på" },
  ],
  5: [
    { code: 501, label: "Natur & vandring" },
    { code: 502, label: "Mat- och dryckupplevelser" },
    { code: 503, label: "Utflykt & äventyr" },
  ],
  4: [
    { code: 401, label: "Guidade turer" },
    { code: 402, label: "Konst & gallerier" },
    { code: 403, label: "Museum & sevärdheter" },
  ],
  6: [
    { code: 601, label: "Föreläsningar & samtal" },
    { code: 602, label: "Lär dig att…" },
    { code: 603, label: "Cirklar & mänskliga möten" },
  ],
  7: [
    { code: 701, label: "Spa & badhus" },
    { code: 702, label: "Stöd & samtal" },
    { code: 703, label: "Tro" },
  ],
};

// Display order: family-friendly first, then broad → niche
export const categoryOptions: { code: number; label: string; icon: React.ElementType }[] = [
  { code: 8, label: "Kul för barn", icon: Smile },
  { code: 1, label: "Evenemang", icon: CalendarDays },
  { code: 3, label: "Underhållning", icon: Film },
  { code: 2, label: "Idrott & sport", icon: Dribbble },
  { code: 5, label: "Upplevelser & äventyr", icon: Mountain },
  { code: 4, label: "Kultur & sevärdheter", icon: Landmark },
  { code: 6, label: "Lära & utforska", icon: BookOpen },
  { code: 7, label: "Hälsa & välmående", icon: HeartPulse },
];

// Filter tags (1001–1006) — matches backend Tag codebook
export const filterOptions: { code: number; label: string; icon: JSX.Element }[] = [
  { code: 1001, label: "Gratis", icon: <Ticket className="w-6 h-6 mb-2" /> },
  { code: 1002, label: "Familjevänligt", icon: <Users className="w-6 h-6 mb-2" /> },
  { code: 1003, label: "Inomhus", icon: <Home className="w-6 h-6 mb-2" /> },
  { code: 1004, label: "Utomhus", icon: <TreePine className="w-6 h-6 mb-2" /> },
  { code: 1005, label: "Seniorer", icon: <Glasses className="w-6 h-6 mb-2" /> },
  { code: 1006, label: "Rullstolsanpassat", icon: <Accessibility className="w-6 h-6 mb-2" /> },
];

// Category tile colors — one per category code, mirrors CategoryDark in mobile theme.ts
export const CATEGORY_COLORS: Record<number, string> = {
  1: "#FF0000", // Events — Red
  2: "#7030A0", // Sports — Purple
  3: "#000000", // Entertainment — Black
  4: "#3333CC", // Culture — Blue
  5: "#7F7F7F", // Adventure — Gray
  6: "#ED7D31", // Learn — Orange
  7: "#FF3399", // Health — Pink
  8: "#00B050", // Fun for Kids — Green
};
