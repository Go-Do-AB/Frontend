import {
  CalendarDays,
  Users,
  Sparkles,
  Dribbble,
  Mountain,
  Film,
  Music,
  Theater,
  Paintbrush2,
  TreeDeciduous,
  BookOpen,
  GraduationCap,
  HeartPulse,
  Dumbbell,
  Home,
  Accessibility,
  Glasses,
  Ticket,
  TreePine,
  Landmark,
  Eye,
  Map,
  UtensilsCrossed,
  Compass,
  MessageCircle,
  Lightbulb,
  UsersRound,
  Waves,
  HandHeart,
  Church,
} from "lucide-react";
import { JSX } from "react";

// ────────────────────────────────────────────────────────────────
// 7 Categories / 21 Subcategories — aligned with backend DataSeeder
// Pattern: subcategory code = categoryCode * 100 + index
// ────────────────────────────────────────────────────────────────

export const subcategoriesMap: Record<
  number,
  { code: number; label: string; icon: React.ElementType }[]
> = {
  1: [
    { code: 101, label: "Festivaler & nöjen", icon: Sparkles },
    { code: 102, label: "Fritid & livsstil", icon: Users },
    { code: 103, label: "Mässor & marknader", icon: CalendarDays },
  ],
  2: [
    { code: 201, label: "Sport att utöva", icon: Dribbble },
    { code: 202, label: "Sport att titta på", icon: Eye },
    { code: 203, label: "Sport att prova", icon: Mountain },
  ],
  3: [
    { code: 301, label: "Bio & film", icon: Film },
    { code: 302, label: "Musik & konserter", icon: Music },
    { code: 303, label: "Teater & shower", icon: Theater },
  ],
  4: [
    { code: 401, label: "Guidade turer", icon: Map },
    { code: 402, label: "Konst & gallerier", icon: Paintbrush2 },
    { code: 403, label: "Museer & sevärdheter", icon: Landmark },
  ],
  5: [
    { code: 501, label: "Parker & leder", icon: TreeDeciduous },
    { code: 502, label: "Mat & dryck", icon: UtensilsCrossed },
    { code: 503, label: "Utflykter & äventyr", icon: Compass },
  ],
  6: [
    { code: 601, label: "Föreläsningar", icon: MessageCircle },
    { code: 602, label: "Lär dig...", icon: GraduationCap },
    { code: 603, label: "Samlingar & möten", icon: UsersRound },
  ],
  7: [
    { code: 701, label: "Spa & bad", icon: Waves },
    { code: 702, label: "Stöd & samverkan", icon: HandHeart },
    { code: 703, label: "Trosaktiviteter", icon: Church },
  ],
};

export const categoryOptions: { code: number; label: string; icon: React.ElementType }[] = [
  { code: 1, label: "Evenemang", icon: CalendarDays },
  { code: 2, label: "Idrott & sport", icon: Dribbble },
  { code: 3, label: "Underhållning", icon: Film },
  { code: 4, label: "Kultur & sevärdheter", icon: Landmark },
  { code: 5, label: "Upplevelser & äventyr", icon: Mountain },
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
