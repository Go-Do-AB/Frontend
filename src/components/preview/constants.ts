// Mobile app design tokens — matches the Go.Do Expo app visual identity

export const BRAND = {
  yellow: "#F3C10E",
  yellowLight: "#FFF8DC",
  background: "#FAF8F3",
  surface: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
} as const;

// Category colors — strong, used for icons and accents
export const CATEGORY_COLORS: Record<number, string> = {
  1: "#991B1B", // Events — red
  2: "#581C87", // Sports — purple
  3: "#1E3A5F", // Entertainment — navy
  4: "#1E3A8A", // Culture — blue
  5: "#374151", // Adventure — gray
  6: "#7C2D12", // Learn — orange
  7: "#9D174D", // Health — pink
};

// Category tints — pastel backgrounds for tiles
export const CATEGORY_TINTS: Record<number, string> = {
  1: "#FEE2E2", // red-100
  2: "#F3E8FF", // purple-100
  3: "#DBEAFE", // blue-100 (navy tint)
  4: "#DBEAFE", // blue-100
  5: "#F3F4F6", // gray-100
  6: "#FFEDD5", // orange-100
  7: "#FCE7F3", // pink-100
};

// Gradient pairs for hero sections in detail screen
export const CATEGORY_GRADIENTS: Record<number, [string, string]> = {
  1: ["#991B1B", "#DC2626"],
  2: ["#581C87", "#7C3AED"],
  3: ["#1E3A5F", "#3B82F6"],
  4: ["#1E3A8A", "#60A5FA"],
  5: ["#374151", "#6B7280"],
  6: ["#7C2D12", "#EA580C"],
  7: ["#9D174D", "#EC4899"],
};

// Short labels for category tiles (mobile-friendly)
export const CATEGORY_SHORT_LABELS: Record<number, string> = {
  1: "Events",
  2: "Sports",
  3: "Entertainment",
  4: "Culture",
  5: "Adventure",
  6: "Learn",
  7: "Health",
};
