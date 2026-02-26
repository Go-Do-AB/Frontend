// Mobile app design tokens — matches the Go.Do Expo app accessibility-redesign

// ── Brand palette ─────────────────────────────────────────────────
export const BRAND = {
  yellow: "#F3C10E",
  yellowLight: "#FFF9D6",
  yellowDark: "#D4A80C",
  onPrimary: "#2A2000",
  background: "#FAF8F3",
  surface: "#FFFEFA",
  textPrimary: "#1C1C1E",
  textBody: "#3C3C43",
  textSecondary: "#8E8E93",
  border: "#E8E5DD",
  neutral100: "#F5F2EB",
  neutral200: "#E8E5DD",
  neutral300: "#D1CEC6",
} as const;

// ── Category dark colors (AAA contrast on white) ─────────────────
export const CATEGORY_COLORS: Record<number, string> = {
  1: "#991B1B", // Events — red
  2: "#581C87", // Sports — purple
  3: "#1E3A5F", // Entertainment — navy
  4: "#1E3A8A", // Culture — blue
  5: "#374151", // Adventure — gray
  6: "#7C2D12", // Learn — orange
  7: "#9D174D", // Health — pink
};

// ── Category tints (soft pastels for tile backgrounds) ────────────
export const CATEGORY_TINTS: Record<number, string> = {
  1: "#FEF2F2",
  2: "#F5F3FF",
  3: "#EFF6FF",
  4: "#F0F9FF",
  5: "#F5F5F4",
  6: "#FFF7ED",
  7: "#FDF2F8",
};

// ── Gradient pairs for hero sections ──────────────────────────────
export const CATEGORY_GRADIENTS: Record<number, [string, string]> = {
  1: ["#FCA5A5", "#F87171"],
  2: ["#C4B5FD", "#A78BFA"],
  3: ["#93C5FD", "#60A5FA"],
  4: ["#7DD3FC", "#38BDF8"],
  5: ["#A8A29E", "#78716C"],
  6: ["#FDBA74", "#FB923C"],
  7: ["#F9A8D4", "#F472B6"],
};

// ── Short labels (Swedish) ────────────────────────────────────────
export const CATEGORY_SHORT_LABELS: Record<number, string> = {
  1: "Evenemang",
  2: "Idrott",
  3: "Underhållning",
  4: "Kultur",
  5: "Upplevelser",
  6: "Utforska",
  7: "Hälsa",
};

// ── Category icons for the map pins ───────────────────────────────
export const CATEGORY_EMOJIS: Record<number, string> = {
  1: "🎉",
  2: "⚽",
  3: "🎭",
  4: "🏛️",
  5: "🏔️",
  6: "📚",
  7: "🧘",
};

// ── GPS coordinates for mock events (Helsingborg area) ────────────
export const HELSINGBORG_CENTER = { lat: 56.0465, lng: 12.6945 };
export const MOCK_LOCATIONS: Record<string, { lat: number; lng: number }> = {
  Helsingborg: { lat: 56.0465, lng: 12.6945 },
  "Malmö": { lat: 55.6050, lng: 13.0038 },
  Lund: { lat: 55.7047, lng: 13.1910 },
};
