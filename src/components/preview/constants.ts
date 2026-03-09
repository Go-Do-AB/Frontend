/**
 * Preview design tokens — mirrors Expo app theme.ts exactly.
 *
 * Source of truth: MobileApp/constants/theme.ts
 * Font: Calibri-Bold for branding, system-ui for body text
 */

// ── Go.Do Yellow ramp (matches GodoYellow in theme.ts) ──────────────
export const GodoYellow = {
  50: "#FFFDF0",
  100: "#FFF9D6",
  200: "#FFF2AD",
  300: "#FFEA85",
  400: "#F7D84E",
  500: "#F3C10E", // Main brand
  600: "#D4A80C",
  700: "#B88C08",
  800: "#8A6906",
  900: "#5C4604",
} as const;

// ── Neutrals: warm grays (matches Neutral in theme.ts) ──────────────
export const Neutral = {
  0: "#FFFFFF",
  50: "#FAF8F3",   // Background (list areas)
  100: "#F5F2EB",
  200: "#E8E5DD",
  300: "#D1CEC6",
  400: "#AEABA3",
  500: "#8E8E93",  // Meta text
  600: "#6C6C70",
  700: "#3C3C43",  // Body text
  800: "#1C1C1E",  // Heading text
  900: "#0A0A0A",
} as const;

// ── Core surfaces (matches Surface in theme.ts) ─────────────────────
export const Surface = {
  background: "#F2C10E",  // Go.Do brand yellow
  surface: "#FFFEFA",     // Soft white
  elevated: "#FFFFFF",    // Pure white (cards with shadow)
  onPrimary: "#2A2000",   // Dark brown text on yellow
} as const;

// ── Typography (matches Typography in theme.ts) ─────────────────────
export const Typography = {
  hero:         { size: 28, weight: 700, lineHeight: 34 },
  sectionTitle: { size: 20, weight: 600, lineHeight: 26 },
  cardTitle:    { size: 16, weight: 600, lineHeight: 22 },
  body:         { size: 15, weight: 400, lineHeight: 22 },
  meta:         { size: 13, weight: 400, lineHeight: 18 },
  caption:      { size: 12, weight: 400, lineHeight: 16 },
  button:       { size: 16, weight: 600, lineHeight: 22 },
} as const;

// ── Font families ───────────────────────────────────────────────────
// Expo app uses Calibri-Bold for Go.Do branding, system font elsewhere
export const FontFamily = {
  brand: "'Calibri', 'Carlito', sans-serif",   // Go.Do logo + branded buttons
  body: "system-ui, -apple-system, sans-serif", // All body text
} as const;

// ── Spacing: 8pt grid (matches Spacing in theme.ts) ─────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  screenPadding: 20,
} as const;

// ── Border radii (matches Radii in theme.ts) ────────────────────────
export const Radii = {
  sm: 8,
  input: 12,
  card: 18,
  sheet: 24,
  button: 26,
  pill: 999,
} as const;

// ── CSS shadows (adapted from RN Shadows in theme.ts) ───────────────
export const Shadows = {
  sm: "0 1px 3px rgba(0,0,0,0.04)",
  md: "0 2px 8px rgba(0,0,0,0.06)",
  lg: "0 4px 16px rgba(0,0,0,0.08)",
} as const;

// ── CoolPastels (for event card styling) ────────────────────────────
export const CoolPastels = {
  secondary50: "#F4F0F9",   // Card background
  secondary100: "#E9E1F3",  // Card border
  neutral50: "#F8FAFC",
  neutral300: "#CBD5E1",
  neutral400: "#94A3B8",
  neutral800: "#1F2937",
} as const;

// ── Legacy BRAND alias (backwards-compatible) ───────────────────────
// Components reference BRAND.* — maps to proper tokens above
export const BRAND = {
  yellow: GodoYellow[500],
  yellowLight: GodoYellow[100],
  yellowDark: GodoYellow[600],
  yellow50: GodoYellow[50],
  yellow200: GodoYellow[200],
  yellow300: GodoYellow[300],
  onPrimary: Surface.onPrimary,
  background: Surface.background,
  surface: Surface.surface,
  elevated: Surface.elevated,
  textPrimary: Neutral[800],
  textBody: Neutral[700],
  textSecondary: Neutral[500],
  border: Neutral[200],
  neutral50: Neutral[50],
  neutral100: Neutral[100],
  neutral200: Neutral[200],
  neutral300: Neutral[300],
  neutral400: Neutral[400],
  neutral500: Neutral[500],
  neutral600: Neutral[600],
  neutral800: Neutral[800],
  neutral900: Neutral[900],
} as const;

// ── Category dark colors (matches CategoryDark in theme.ts) ─────────
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

// ── Category tints (matches CategoryTints in theme.ts) ──────────────
export const CATEGORY_TINTS: Record<number, string> = {
  1: "#FEF2F2",
  2: "#F5F3FF",
  3: "#EFF6FF",
  4: "#F0F9FF",
  5: "#F5F5F4",
  6: "#FFF7ED",
  7: "#FDF2F8",
  8: "#E8F8E8",
};

// ── Gradient pairs for hero sections ────────────────────────────────
export const CATEGORY_GRADIENTS: Record<number, [string, string]> = {
  1: ["#FCA5A5", "#F87171"],
  2: ["#C4B5FD", "#A78BFA"],
  3: ["#93C5FD", "#60A5FA"],
  4: ["#7DD3FC", "#38BDF8"],
  5: ["#A8A29E", "#78716C"],
  6: ["#FDBA74", "#FB923C"],
  7: ["#F9A8D4", "#F472B6"],
  8: ["#86EFAC", "#4ADE80"],
};

// ── Short labels (Swedish) ──────────────────────────────────────────
export const CATEGORY_SHORT_LABELS: Record<number, string> = {
  1: "Evenemang",
  2: "Idrott",
  3: "Underhållning",
  4: "Kultur",
  5: "Upplevelser",
  6: "Utforska",
  7: "Hälsa",
  8: "Kul för barn",
};

// ── Category icons for the map pins ─────────────────────────────────
export const CATEGORY_EMOJIS: Record<number, string> = {
  1: "🎉",
  2: "⚽",
  3: "🎭",
  4: "🏛️",
  5: "🏔️",
  6: "📚",
  7: "🧘",
  8: "🧒",
};

// ── GPS coordinates for mock events ─────────────────────────────────
export const HELSINGBORG_CENTER = { lat: 56.0465, lng: 12.6945 };
export const MOCK_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  Helsingborg: { lat: 56.0465, lng: 12.6945 },
  "Malmö": { lat: 55.6050, lng: 13.0038 },
  Lund: { lat: 55.7047, lng: 13.1910 },
  Landskrona: { lat: 55.8708, lng: 12.8301 },
  "Ängelholm": { lat: 56.2428, lng: 12.8622 },
  "Höganäs": { lat: 56.1996, lng: 12.5574 },
};
