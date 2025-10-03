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
  1: [
    { code: 101, label: "0-4", icon: BabyIcon },
    { code: 102, label: "5-10", icon: PersonStandingIcon },
    { code: 103, label: "11-15", icon: SmileIcon },
  ],
  2: [
    { code: 201, label: "Concerts", icon: CalendarDays },
    { code: 202, label: "Markets", icon: Users },
    { code: 203, label: "Conventions", icon: Landmark },
    { code: 204, label: "Festivals", icon: Sparkles },
    { code: 205, label: "Street Events", icon: Tent },
  ],
  3: [
    { code: 301, label: "Football", icon: Dribbble },
    { code: 302, label: "Running", icon: Bike },
    { code: 303, label: "Cycling", icon: Bike },
    { code: 304, label: "Swimming", icon: Dribbble },
    { code: 305, label: "Winter Sports", icon: Mountain },
    { code: 306, label: "Other", icon: Star },
  ],
  4: [
    { code: 401, label: "Movies", icon: Film },
    { code: 402, label: "Comedy", icon: Clapperboard },
    { code: 403, label: "Nightlife", icon: Sparkles },
    { code: 404, label: "Theater", icon: Clapperboard },
    { code: 405, label: "Shows", icon: Star },
  ],
  5: [
    { code: 501, label: "Museums", icon: Landmark },
    { code: 502, label: "Art", icon: Paintbrush2 },
    { code: 503, label: "Architecture", icon: Landmark },
    { code: 504, label: "Historical Sites", icon: Landmark },
    { code: 505, label: "Galleries", icon: Landmark },
  ],
  6: [
    { code: 601, label: "Hiking", icon: Mountain },
    { code: 602, label: "Escape Rooms", icon: Sparkles },
    { code: 603, label: "Climbing", icon: Mountain },
    { code: 604, label: "Zipline", icon: TreeDeciduous },
    { code: 605, label: "Amusement Parks", icon: Tent },
  ],
  7: [
    { code: 701, label: "Workshops", icon: BookOpen },
    { code: 702, label: "Courses", icon: GraduationCap },
    { code: 703, label: "Lectures", icon: Book },
    { code: 704, label: "Science Centers", icon: Sparkles },
    { code: 705, label: "Library Events", icon: Book },
  ],
  8: [
    { code: 801, label: "Yoga", icon: HeartPulse },
    { code: 802, label: "Meditation", icon: HeartPulse },
    { code: 803, label: "Spa", icon: HeartPulse },
    { code: 804, label: "Nature Walks", icon: TreeDeciduous },
    { code: 805, label: "Fitness Classes", icon: Dumbbell },
  ],
};

export const categoryOptions: { code: number; label: string; icon: React.ElementType }[] = [
  { code: 1, label: "Fun for Kids", icon: Baby },
  { code: 2, label: "Events", icon: CalendarDays },
  { code: 3, label: "Sports", icon: Dribbble },
  { code: 4, label: "Entertainment", icon: Clapperboard },
  { code: 5, label: "Culture & Sights", icon: Landmark },
  { code: 6, label: "Experiences & Adventures", icon: Mountain },
  { code: 7, label: "Learn & Explore", icon: BookOpen },
  { code: 8, label: "Health & Wellbeing", icon: HeartPulse },
];

// Here filters could be GUIDs if your BE provides them.
// For now I’ll use simple string IDs.
export const filterOptions: { code: string; label: string; icon: JSX.Element }[] = [
  {
    code: "A0AA8B3B-153B-4504-BE03-259236AB9677",
    label: "Outdoor",
    icon: <TreePine className="w-6 h-6 mb-2" />,
  },
  {
    code: "BCDE2E29-78BD-496F-AFCF-3C65DF898AA1",
    label: "Senior focus",
    icon: <Glasses className="w-6 h-6 mb-2" />,
  },
  {
    code: "48987691-B0DE-43A8-9A26-5E74736F853F",
    label: "Family-friendly",
    icon: <Users className="w-6 h-6 mb-2" />,
  },
  {
    code: "0A710366-C231-4AE1-BEED-B67A9927D5C4",
    label: "Wheelchair accessible",
    icon: <Accessibility className="w-6 h-6 mb-2" />,
  },
  {
    code: "A288C40B-4F85-4880-BD6C-C9A1B32CCCE5",
    label: "Free",
    icon: <Ticket className="w-6 h-6 mb-2" />,
  },
  {
    code: "7294E109-1786-4AB6-83B5-8DDAE8358B83",
    label: "Indoor",
    icon: <Home className="w-6 h-6 mb-2" />,
  },
];
