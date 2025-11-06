import {
  BabyIcon,
  PersonStandingIcon,
  SmileIcon,
  CalendarDays,
  Users,
  Landmark,
  Sparkles,
  Tent,
  Dribbble,
  Bike,
  Mountain,
  Star,
  Film,
  Clapperboard,
  Paintbrush2,
  TreeDeciduous,
  BookOpen,
  GraduationCap,
  Book,
  HeartPulse,
  Dumbbell,
  Baby,
  Home,
  Accessibility,
  Glasses,
  Ticket,
  TreePine,
} from "lucide-react";
import { JSX } from "react";

export const subcategoriesMap: Record<
  number,
  { code: number; label: string; icon: React.ElementType }[]
> = {
   // 1 — Events
  1: [
    { code: 101, label: "Festivals & fun", icon: Sparkles },
    { code: 102, label: "Leisure & lifestyle", icon: Users },
    { code: 103, label: "Fairs & markets", icon: Landmark },
  ],

  // 2 — Sports & sporting activities
  2: [
    { code: 201, label: "Sports to do", icon: Dumbbell },
    { code: 202, label: "Sports to watch", icon: Dribbble },
    { code: 203, label: "Sports to try", icon: Bike },
  ],

  // 3 — Entertainment
  3: [
    { code: 301, label: "Cinema & film", icon: Film },
    { code: 302, label: "Music & concerts", icon: Sparkles },
    { code: 303, label: "Theater & shows", icon: Clapperboard },
  ],

  // 4 — Culture & sights
  4: [
    { code: 401, label: "Guided tours", icon: Landmark },
    { code: 402, label: "Art & galleries", icon: Paintbrush2 },
    { code: 403, label: "Museums & sights", icon: Landmark },
  ],

  // 5 — Adventure & activities
  5: [
    { code: 501, label: "Parks & trails", icon: TreeDeciduous },
    { code: 502, label: "Food & drink activities", icon: Tent },
    { code: 503, label: "Trips & adventures", icon: Mountain },
  ],

  // 6 — Learn & explore
  6: [
    { code: 601, label: "Talks & lectures", icon: Book },
    { code: 602, label: "Learn to…", icon: GraduationCap },
    { code: 603, label: "Gatherings & meetings", icon: Users },
  ],

  // 7 — Health & wellbeing
  7: [
    { code: 701, label: "Spas & pools", icon: HeartPulse },
    { code: 702, label: "Support & interaction", icon: Users },
    { code: 703, label: "Activities of faith", icon: Book },
  ],
};

// Category list
export const categoryOptions: {
  code: number;
  label: string;
  icon: React.ElementType;
}[] = [
  { code: 1, label: "Events", icon: CalendarDays },
  { code: 2, label: "Sports & sporting activities", icon: Dribbble },
  { code: 3, label: "Entertainment", icon: Clapperboard },
  { code: 4, label: "Culture & sights", icon: Landmark },
  { code: 5, label: "Adventure & activities", icon: Mountain },
  { code: 6, label: "Learn & explore", icon: BookOpen },
  { code: 7, label: "Health & wellbeing", icon: HeartPulse },
];

// Tag list
export const filterOptions: { code: number; label: string; icon: JSX.Element }[] = [
  { code: 1001, label: "Free", icon: <Ticket className="w-6 h-6 mb-2" /> },
  { code: 1002, label: "Family-friendly", icon: <Users className="w-6 h-6 mb-2" /> },
  { code: 1003, label: "Indoor", icon: <Home className="w-6 h-6 mb-2" /> },
  { code: 1004, label: "Outdoor", icon: <TreePine className="w-6 h-6 mb-2" /> },
  { code: 1005, label: "Senior focus", icon: <Glasses className="w-6 h-6 mb-2" /> },
  { code: 1006, label: "Wheelchair accessible", icon: <Accessibility className="w-6 h-6 mb-2" /> },
];
