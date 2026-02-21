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
    { code: 101, label: "Festivals & fun", icon: Sparkles },
    { code: 102, label: "Leisure & lifestyle", icon: Users },
    { code: 103, label: "Fairs & markets", icon: CalendarDays },
  ],
  2: [
    { code: 201, label: "Sports to do", icon: Dribbble },
    { code: 202, label: "Sports to watch", icon: Eye },
    { code: 203, label: "Sports to try", icon: Mountain },
  ],
  3: [
    { code: 301, label: "Cinema & film", icon: Film },
    { code: 302, label: "Music & concerts", icon: Music },
    { code: 303, label: "Theater & shows", icon: Theater },
  ],
  4: [
    { code: 401, label: "Guided tours", icon: Map },
    { code: 402, label: "Art & galleries", icon: Paintbrush2 },
    { code: 403, label: "Museums & sights", icon: Landmark },
  ],
  5: [
    { code: 501, label: "Parks & trails", icon: TreeDeciduous },
    { code: 502, label: "Food & drink activities", icon: UtensilsCrossed },
    { code: 503, label: "Trips & adventures", icon: Compass },
  ],
  6: [
    { code: 601, label: "Talks & lectures", icon: MessageCircle },
    { code: 602, label: "Learn to...", icon: GraduationCap },
    { code: 603, label: "Gatherings & meetings", icon: UsersRound },
  ],
  7: [
    { code: 701, label: "Spas & pools", icon: Waves },
    { code: 702, label: "Support & interaction", icon: HandHeart },
    { code: 703, label: "Activities of faith", icon: Church },
  ],
};

export const categoryOptions: { code: number; label: string; icon: React.ElementType }[] = [
  { code: 1, label: "Events", icon: CalendarDays },
  { code: 2, label: "Sports & sporting activities", icon: Dribbble },
  { code: 3, label: "Entertainment", icon: Film },
  { code: 4, label: "Culture & sights", icon: Landmark },
  { code: 5, label: "Adventure & activities", icon: Mountain },
  { code: 6, label: "Learn & explore", icon: BookOpen },
  { code: 7, label: "Health & wellbeing", icon: HeartPulse },
];

// Filter tags (1001–1006) — matches backend Tag codebook
export const filterOptions: { code: number; label: string; icon: JSX.Element }[] = [
  { code: 1001, label: "Free", icon: <Ticket className="w-6 h-6 mb-2" /> },
  { code: 1002, label: "Family-friendly", icon: <Users className="w-6 h-6 mb-2" /> },
  { code: 1003, label: "Indoor", icon: <Home className="w-6 h-6 mb-2" /> },
  { code: 1004, label: "Outdoor", icon: <TreePine className="w-6 h-6 mb-2" /> },
  { code: 1005, label: "Senior focus", icon: <Glasses className="w-6 h-6 mb-2" /> },
  { code: 1006, label: "Wheelchair accessible", icon: <Accessibility className="w-6 h-6 mb-2" /> },
];
