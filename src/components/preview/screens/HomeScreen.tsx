"use client";

import { useState, useMemo } from "react";
import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_SHORT_LABELS,
  FontFamily,
  Typography,
  Spacing,
  Radii,
  Shadows,
  Neutral,
  GodoYellow,
  Surface,
} from "../constants";
import {
  Search,
  Check,
  ChevronRight,
  Grid3X3,
  CalendarRange,
  CalendarDays,
  Dribbble,
  Film,
  Landmark,
  Mountain,
  BookOpen,
  HeartPulse,
  Smile,
  X,
  Globe,
  ChevronLeft,
} from "lucide-react";
import { MOCK_EVENTS } from "../mockEvents";

// Category icon mapping matching the Expo app's Ionicons
const CATEGORY_ICONS: Record<number, React.ElementType> = {
  1: CalendarDays,
  2: Dribbble,
  3: Film,
  4: Landmark,
  5: Mountain,
  6: BookOpen,
  7: HeartPulse,
  8: Smile,
};

// Subcategories matching backend DataSeeder
const SUBCATEGORIES: Record<number, { code: number; label: string }[]> = {
  1: [
    { code: 101, label: "Festivaler & nöjen" },
    { code: 102, label: "Fritid & livsstil" },
    { code: 103, label: "Mässor & marknader" },
  ],
  2: [
    { code: 201, label: "Sport att utöva" },
    { code: 202, label: "Sport att titta på" },
    { code: 203, label: "Sport att prova" },
  ],
  3: [
    { code: 301, label: "Bio & film" },
    { code: 302, label: "Musik & konserter" },
    { code: 303, label: "Teater & shower" },
  ],
  4: [
    { code: 401, label: "Guidade turer" },
    { code: 402, label: "Konst & gallerier" },
    { code: 403, label: "Museer & sevärdheter" },
  ],
  5: [
    { code: 501, label: "Parker & leder" },
    { code: 502, label: "Mat & dryck" },
    { code: 503, label: "Utflykter & äventyr" },
  ],
  6: [
    { code: 601, label: "Föreläsningar" },
    { code: 602, label: "Lär dig..." },
    { code: 603, label: "Samlingar & möten" },
  ],
  7: [
    { code: 701, label: "Spa & bad" },
    { code: 702, label: "Stöd & samverkan" },
    { code: 703, label: "Trosaktiviteter" },
  ],
  8: [
    { code: 801, label: "0–4 år" },
    { code: 802, label: "5–10 år" },
    { code: 803, label: "11–15 år" },
  ],
};

// Derive available cities from mock events — only show cities that have events
const AVAILABLE_CITIES = Array.from(
  new Set(MOCK_EVENTS.map((e) => e.city).filter(Boolean) as string[]),
).sort((a, b) => a.localeCompare(b, "sv"));

// Swedish month/day names
const SV_MONTHS = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "September", "Oktober", "November", "December"];
const SV_DAYS_SHORT = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];

// Family-friendly order: Kids first, then broad→niche
const ALL_CATEGORIES = [8, 1, 3, 2, 5, 4, 6, 7];

interface HomeScreenProps {
  tagCodes: number[];
  selectedCategories: number[];
  searchText: string;
  cities: string[];
  startDate: string | null;
  endDate: string | null;
  onSearchChange: (text: string) => void;
  onToggleCity: (city: string) => void;
  onSetCities: (cities: string[]) => void;
  onDateRange: (start: string | null, end: string | null) => void;
  onTagsChange: (tagCodes: number[]) => void;
  onToggleCategory: (code: number) => void;
  onGoDo: (categoryCodes: number[]) => void;
  onSelectEvent: (eventId: string, categoryCode: number) => void;
}

export function HomeScreen({
  selectedCategories,
  searchText,
  cities,
  startDate,
  endDate,
  onSearchChange,
  onToggleCity,
  onSetCities,
  onDateRange,
  onToggleCategory,
  onGoDo,
}: HomeScreenProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [selectedSubs, setSelectedSubs] = useState<Record<number, number[]>>({});
  const [showAll, setShowAll] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const maxReached = selectedCategories.length >= 3;

  const handleCategoryPress = (code: number) => {
    setExpandedCategory(expandedCategory === code ? null : code);
  };

  const handleSubPress = (catCode: number, subCode: number) => {
    setSelectedSubs((prev) => {
      const current = prev[catCode] ?? [];
      const next = current.includes(subCode)
        ? current.filter((c) => c !== subCode)
        : [...current, subCode];
      return { ...prev, [catCode]: next };
    });
    if (!selectedCategories.includes(catCode)) {
      onToggleCategory(catCode);
    }
  };

  const handleEverythingPress = (catCode: number) => {
    if (!selectedCategories.includes(catCode)) {
      onToggleCategory(catCode);
    }
  };

  const isCategorySelected = (code: number) => selectedCategories.includes(code);

  const row1 = ALL_CATEGORIES.slice(0, 4);
  const row2 = ALL_CATEGORIES.slice(4);

  // City display text
  const displayCity = cities.length > 0
    ? (cities.length <= 2 ? cities.join(", ") : `${cities.length} städer`)
    : "Alla städer";

  // Date display text
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  };
  const dateDisplayText = !startDate
    ? "Välj datum"
    : !endDate
      ? formatDate(startDate)
      : `${formatDate(startDate)} – ${formatDate(endDate)}`;

  // Filtered cities for modal search
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return AVAILABLE_CITIES;
    const q = citySearch.trim().toLowerCase();
    return AVAILABLE_CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [citySearch]);

  const renderSubcategorySection = (rowCodes: number[]) => {
    if (!expandedCategory || !rowCodes.includes(expandedCategory)) return null;
    const subs = SUBCATEGORIES[expandedCategory] ?? [];
    const darkColor = CATEGORY_COLORS[expandedCategory] ?? "#374151";
    const isSelected = isCategorySelected(expandedCategory);
    const chipDisabled = maxReached && !isSelected;

    return (
      <div
        className="w-full mb-2 transition-all"
        style={{ animation: "fadeIn 0.2s ease", paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding }}
      >
        <div className="flex justify-center mb-0">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: `8px solid ${darkColor}33`,
            }}
          />
        </div>
        <div
          className="flex flex-wrap py-2.5 pl-2.5"
          style={{ borderLeft: `3px solid ${darkColor}44`, gap: `${Spacing.sm}px` }}
        >
          {subs.map((sub) => {
            const active = (selectedSubs[expandedCategory] ?? []).includes(sub.code);
            return (
              <button
                key={sub.code}
                onClick={() => handleSubPress(expandedCategory, sub.code)}
                className="px-3.5 transition-colors"
                style={{
                  height: 36,
                  borderRadius: Radii.pill,
                  backgroundColor: active ? darkColor : Surface.elevated,
                  color: active ? "#FFFFFF" : darkColor,
                  border: active ? "none" : `1.5px solid ${darkColor}`,
                  opacity: chipDisabled && !active ? 0.4 : 1,
                  fontFamily: FontFamily.body,
                  fontSize: Typography.meta.size + 1,
                  fontWeight: 500,
                }}
                disabled={chipDisabled && !active}
              >
                {sub.label}
              </button>
            );
          })}
          <button
            onClick={() => handleEverythingPress(expandedCategory)}
            className="px-3.5 transition-colors"
            style={{
              height: 36,
              borderRadius: Radii.pill,
              backgroundColor: isCategorySelected(expandedCategory) ? darkColor : Surface.elevated,
              color: isCategorySelected(expandedCategory) ? "#FFFFFF" : darkColor,
              border: isCategorySelected(expandedCategory) ? "none" : `1.5px solid ${darkColor}`,
              opacity: chipDisabled && !isCategorySelected(expandedCategory) ? 0.4 : 1,
              fontFamily: FontFamily.body,
              fontSize: Typography.meta.size + 1,
              fontWeight: 600,
            }}
          >
            Allt
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-4 relative" style={{ backgroundColor: Surface.background }}>
      {/* Header — matches Expo Header component */}
      <div className="flex items-center justify-between pt-1 pb-2" style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding }}>
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: FontFamily.brand,
            color: Neutral[800],
            letterSpacing: 0.5,
          }}
        >
          Go.Do.
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center" style={{ gap: 4 }}>
            <button
              className="flex items-center justify-center"
              style={{ width: 48, height: 48, borderRadius: Radii.pill, fontSize: 22, opacity: 1 }}
              aria-label="Svenska"
            >
              🇸🇪
            </button>
            <button
              className="flex items-center justify-center"
              style={{ width: 48, height: 48, borderRadius: Radii.pill, fontSize: 22, opacity: 0.4 }}
              aria-label="English"
            >
              🇬🇧
            </button>
          </div>
          <button
            className="flex items-center justify-center rounded-full"
            style={{ width: 36, height: 36, backgroundColor: "transparent" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={Neutral[800]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Greeting — matches Expo: fontSize 20, weight 400, Neutral[700] */}
      <div style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, marginTop: 12, marginBottom: Spacing.screenPadding }}>
        <h1
          style={{
            fontSize: Typography.sectionTitle.size,
            fontWeight: Typography.body.weight,
            lineHeight: `28px`,
            color: Neutral[700],
            fontFamily: FontFamily.body,
          }}
        >
          Vad vill du göra?
        </h1>
      </div>

      {/* Search bar — matches Expo: h48, Radii.input (12), Neutral[100] bg */}
      <div style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, marginBottom: Spacing.screenPadding }}>
        <div
          className="flex items-center"
          style={{
            height: 48,
            backgroundColor: Neutral[100],
            borderRadius: Radii.input,
            paddingLeft: 14,
            paddingRight: 14,
            gap: 10,
          }}
        >
          <Search size={20} style={{ color: Neutral[500], flexShrink: 0 }} />
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Sök evenemang..."
            className="flex-1 bg-transparent outline-none"
            style={{
              color: Neutral[800],
              fontFamily: FontFamily.body,
              fontSize: Typography.body.size,
            }}
          />
          {searchText && (
            <button onClick={() => onSearchChange("")} className="flex-shrink-0">
              <X size={16} style={{ color: Neutral[500] }} />
            </button>
          )}
        </div>
      </div>

      {/* Max categories hint */}
      {maxReached && (
        <div className="flex items-center gap-1 mb-1" style={{ paddingLeft: Spacing.lg, paddingRight: Spacing.lg }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={Neutral[500]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          <span style={{ fontSize: Typography.caption.size, color: Neutral[500], fontFamily: FontFamily.body }}>
            Max 3 kategorier valda
          </span>
        </div>
      )}

      {/* Category grid — Row 1 */}
      <div className="flex justify-center" style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, gap: Spacing.sm, marginBottom: Spacing.sm }}>
        {row1.map((code) => (
          <CategoryTile
            key={code}
            code={code}
            selected={isCategorySelected(code)}
            disabled={maxReached && !isCategorySelected(code)}
            onPress={() => handleCategoryPress(code)}
          />
        ))}
      </div>
      {renderSubcategorySection(row1)}

      {/* Category grid — Row 2 */}
      <div className="flex justify-center" style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, gap: Spacing.sm, marginBottom: Spacing.sm }}>
        {row2.map((code) => (
          <CategoryTile
            key={code}
            code={code}
            selected={isCategorySelected(code)}
            disabled={maxReached && !isCategorySelected(code)}
            onPress={() => handleCategoryPress(code)}
          />
        ))}
      </div>
      {renderSubcategorySection(row2)}

      {/* Show All tile */}
      <div className="flex justify-center" style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, marginBottom: Spacing.sm }}>
        <button
          onClick={() => setShowAll(!showAll)}
          className="relative flex flex-col items-center justify-center transition-all active:scale-95"
          style={{
            width: "23%",
            aspectRatio: "0.88",
            borderRadius: Radii.card,
            backgroundColor: showAll ? Neutral[800] : Surface.elevated,
            border: showAll ? `2px solid ${Neutral[700]}` : `1px solid ${Neutral[200]}`,
            boxShadow: Shadows.sm,
            gap: 6,
          }}
        >
          {showAll && (
            <div
              className="absolute flex items-center justify-center"
              style={{
                top: 6, right: 6, width: 18, height: 18,
                borderRadius: 9, backgroundColor: GodoYellow[500],
              }}
            >
              <Check size={10} strokeWidth={3} style={{ color: Surface.onPrimary }} />
            </div>
          )}
          <Grid3X3 size={28} color={showAll ? "#FFFFFF" : Neutral[800]} strokeWidth={2} />
          <span
            className="text-center px-1"
            style={{
              fontSize: 11, fontWeight: 600,
              color: showAll ? "#FFFFFF" : Neutral[800],
              fontFamily: FontFamily.body,
            }}
          >
            Visa allt
          </span>
        </button>
      </div>

      {/* City picker row — opens modal */}
      <div style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, marginBottom: Spacing.sm }}>
        <button
          onClick={() => setShowCityModal(true)}
          className="w-full flex items-center gap-2"
          style={{
            height: 52,
            borderRadius: Radii.pill,
            paddingLeft: 14,
            paddingRight: 14,
            backgroundColor: Neutral[100],
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={Neutral[800]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="flex-1 text-left truncate" style={{ fontSize: Typography.cardTitle.size, fontWeight: 500, color: Neutral[700], fontFamily: FontFamily.body }}>
            {displayCity}
          </span>
          <ChevronRight size={16} style={{ color: Neutral[400] }} />
        </button>
      </div>

      {/* Date picker row — opens calendar modal */}
      <div style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, marginBottom: Spacing.screenPadding }}>
        <button
          onClick={() => setShowCalendarModal(true)}
          className="w-full flex items-center gap-2 border"
          style={{
            height: 52,
            borderRadius: Radii.pill,
            paddingLeft: 14,
            paddingRight: 14,
            backgroundColor: GodoYellow[50],
            borderColor: GodoYellow[200],
          }}
        >
          <CalendarRange size={20} style={{ color: Neutral[800] }} />
          <span className="flex-1 text-left truncate" style={{ fontSize: Typography.cardTitle.size, fontWeight: 500, color: Neutral[700], fontFamily: FontFamily.body }}>
            {dateDisplayText}
          </span>
          {startDate && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDateRange(null, null);
              }}
              className="flex-shrink-0 mr-1"
            >
              <X size={14} style={{ color: Neutral[500] }} />
            </button>
          )}
          <ChevronRight size={16} style={{ color: Neutral[400] }} />
        </button>
      </div>

      {/* Go.Do. button — matches Expo: h48, Radii.button (26), Calibri-Bold, letterSpacing 1 */}
      <div style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, marginBottom: Spacing.lg }}>
        <button
          onClick={() => onGoDo(selectedCategories.length > 0 ? selectedCategories : [1])}
          className="w-full transition-all active:scale-[0.97] active:opacity-85"
          style={{
            height: 56,
            borderRadius: Radii.button,
            backgroundColor: "#000000",
            color: "#FFFFFF",
            fontFamily: FontFamily.brand,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: Shadows.md,
          }}
        >
          Go.Do.
        </button>
      </div>

      {/* ── City selector modal ─────────────────────────────── */}
      {showCityModal && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={() => { setShowCityModal(false); setCitySearch(""); }}
        >
          <div
            className="max-h-[80%] flex flex-col"
            style={{ backgroundColor: Surface.surface, borderRadius: `${Radii.sheet}px ${Radii.sheet}px 0 0` }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center p-4" style={{ borderBottom: `1px solid ${Neutral[200]}` }}>
              <span className="flex-1" style={{ fontSize: Typography.sectionTitle.size, fontWeight: 700, color: Neutral[800], fontFamily: FontFamily.body }}>
                Välj stad
              </span>
              {cities.length > 0 && (
                <span
                  className="mr-3 px-2 py-0.5"
                  style={{ fontSize: Typography.caption.size, fontWeight: 700, borderRadius: Radii.pill, backgroundColor: Neutral[800], color: "#FFFFFF" }}
                >
                  {cities.length}
                </span>
              )}
              <button
                onClick={() => { setShowCityModal(false); setCitySearch(""); }}
                className="flex items-center justify-center rounded-full"
                style={{ width: 40, height: 40, backgroundColor: Neutral[800] }}
              >
                <X size={20} color="#FFFFFF" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-2">
              <div
                className="flex items-center border"
                style={{
                  height: 48,
                  paddingLeft: 12,
                  paddingRight: 12,
                  gap: Spacing.sm,
                  borderRadius: 10,
                  backgroundColor: Surface.surface,
                  borderColor: Neutral[300],
                }}
              >
                <Search size={18} style={{ color: Neutral[500] }} />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Sök stad..."
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: Typography.cardTitle.size, color: Neutral[800], fontFamily: FontFamily.body }}
                />
                {citySearch && (
                  <button onClick={() => setCitySearch("")}>
                    <X size={16} style={{ color: Neutral[500] }} />
                  </button>
                )}
              </div>
            </div>

            {/* Selected city chips */}
            {cities.length > 0 && (
              <div className="flex flex-wrap px-4 pb-2" style={{ gap: 6 }}>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => onToggleCity(city)}
                    className="flex items-center gap-1 px-2.5 py-1"
                    style={{ borderRadius: Radii.pill, fontSize: Typography.meta.size, fontWeight: 500, backgroundColor: Neutral[200], color: Neutral[800], fontFamily: FontFamily.body }}
                  >
                    {city}
                    <X size={12} style={{ color: Neutral[700] }} />
                  </button>
                ))}
              </div>
            )}

            {/* "All cities" row */}
            <button
              onClick={() => { onSetCities([]); setCitySearch(""); setShowCityModal(false); }}
              className="flex items-center mx-4 mb-1"
              style={{
                height: 48,
                paddingLeft: 14,
                paddingRight: 14,
                gap: 10,
                borderRadius: 10,
                backgroundColor: cities.length === 0 ? Neutral[800] : Neutral[100],
              }}
            >
              <Globe size={20} style={{ color: cities.length === 0 ? "#FFFFFF" : Neutral[500] }} />
              <span
                className="flex-1 text-left"
                style={{
                  fontSize: Typography.cardTitle.size,
                  fontWeight: 500,
                  color: cities.length === 0 ? "#FFFFFF" : Neutral[700],
                  fontFamily: FontFamily.body,
                }}
              >
                Alla städer
              </span>
              {cities.length === 0 && <Check size={18} color="#FFFFFF" />}
            </button>

            {/* City list */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {filteredCities.map((city) => {
                const checked = cities.includes(city);
                return (
                  <button
                    key={city}
                    onClick={() => onToggleCity(city)}
                    className="w-full flex items-center text-left"
                    style={{
                      height: 48,
                      paddingLeft: Spacing.md,
                      paddingRight: Spacing.md,
                      backgroundColor: checked ? Neutral[800] : "transparent",
                      borderBottom: `0.5px solid ${Neutral[200]}`,
                    }}
                  >
                    <span
                      className="flex items-center justify-center border mr-3"
                      style={{
                        width: 22, height: 22,
                        borderRadius: 4,
                        borderColor: checked ? "#FFFFFF" : Neutral[400],
                        backgroundColor: checked ? Neutral[800] : "transparent",
                      }}
                    >
                      {checked && <Check size={14} color="#FFFFFF" />}
                    </span>
                    <span
                      className="flex-1"
                      style={{
                        fontSize: Typography.cardTitle.size,
                        fontFamily: FontFamily.body,
                        color: checked ? "#FFFFFF" : Neutral[800],
                        fontWeight: checked ? 600 : 400,
                      }}
                    >
                      {city}
                    </span>
                  </button>
                );
              })}
              {filteredCities.length === 0 && (
                <p className="text-center py-10" style={{ fontSize: Typography.cardTitle.size, color: Neutral[500], fontFamily: FontFamily.body }}>
                  Inga städer hittades
                </p>
              )}
            </div>

            {/* Done button */}
            <div className="px-4 py-2">
              <button
                onClick={() => { setShowCityModal(false); setCitySearch(""); }}
                className="w-full"
                style={{
                  height: 48,
                  borderRadius: Radii.input,
                  backgroundColor: Neutral[800],
                  color: "#FFFFFF",
                  fontSize: Typography.button.size,
                  fontWeight: Typography.button.weight,
                  fontFamily: FontFamily.body,
                }}
              >
                {cities.length > 0 ? `Klar (${cities.length})` : "Klar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Calendar modal ──────────────────────────────────── */}
      {showCalendarModal && (
        <CalendarModal
          startDate={startDate}
          endDate={endDate}
          onDateRange={onDateRange}
          onClose={() => setShowCalendarModal(false)}
        />
      )}
    </div>
  );
}

/* ── Category tile — matches Expo CategoryTile exactly ─────────── */
function CategoryTile({
  code,
  selected,
  disabled,
  onPress,
}: {
  code: number;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const dark = CATEGORY_COLORS[code] ?? "#374151";
  const Icon = CATEGORY_ICONS[code] ?? CalendarDays;
  const bgColor = disabled && !selected ? Neutral[300] : dark;

  return (
    <button
      onClick={() => !disabled && onPress()}
      className="relative flex flex-col items-center justify-center transition-all active:scale-95"
      style={{
        width: "23%",
        aspectRatio: "0.88",
        borderRadius: Radii.card,
        backgroundColor: bgColor,
        border: selected ? `2px solid ${GodoYellow[500]}` : "none",
        boxShadow: Shadows.sm,
        opacity: disabled && !selected ? 0.7 : 1,
        gap: 6,
      }}
    >
      {selected && (
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: 6, right: 6, width: 18, height: 18,
            borderRadius: 9, backgroundColor: GodoYellow[500],
          }}
        >
          <Check size={12} strokeWidth={3} style={{ color: dark }} />
        </div>
      )}
      <Icon size={28} color="#FFFFFF" strokeWidth={2} />
      <span
        className="text-center px-1 leading-tight"
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "#FFFFFF",
          fontFamily: FontFamily.body,
        }}
      >
        {CATEGORY_SHORT_LABELS[code]}
      </span>
    </button>
  );
}

/* ── Calendar modal (Swedish, range selection) ──────────────── */
function CalendarModal({
  startDate,
  endDate,
  onDateRange,
  onClose,
}: {
  startDate: string | null;
  endDate: string | null;
  onDateRange: (start: string | null, end: string | null) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-based

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  // Monday=0 based first day offset
  const firstDayOfWeek = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7;

  const toIso = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${viewYear}-${m}-${d}`;
  };

  const handleDayClick = (day: number) => {
    const date = toIso(day);
    if (!startDate || (startDate && endDate)) {
      onDateRange(date, null);
    } else if (date < startDate) {
      onDateRange(date, null);
    } else if (date === startDate) {
      onDateRange(startDate, null);
    } else {
      onDateRange(startDate, date);
    }
  };

  const isInRange = (day: number) => {
    if (!startDate) return false;
    const iso = toIso(day);
    if (!endDate) return iso === startDate;
    return iso >= startDate && iso <= endDate;
  };

  const isStart = (day: number) => startDate === toIso(day);
  const isEnd = (day: number) => endDate === toIso(day);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else { setViewMonth(viewMonth - 1); }
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else { setViewMonth(viewMonth + 1); }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: Surface.surface,
          borderRadius: `${Radii.sheet}px ${Radii.sheet}px 0 0`,
          boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
            <ChevronLeft size={20} style={{ color: Neutral[800] }} />
          </button>
          <span style={{ fontSize: 22, fontWeight: 700, color: Neutral[800], fontFamily: FontFamily.body }}>
            {SV_MONTHS[viewMonth]} {viewYear}
          </span>
          <button onClick={nextMonth} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
            <ChevronRight size={20} style={{ color: Neutral[800] }} />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {SV_DAYS_SHORT.map((d) => (
            <div key={d} className="text-center py-1" style={{ fontSize: 11, fontWeight: 700, color: Neutral[500], fontFamily: FontFamily.body }}>
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: 36 }} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const inRange = isInRange(day);
            const start = isStart(day);
            const end = isEnd(day);
            const todayStr = today.toISOString().slice(0, 10);
            const isToday = toIso(day) === todayStr;

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className="flex items-center justify-center transition-colors"
                style={{
                  height: 36,
                  fontFamily: FontFamily.body,
                  fontSize: Typography.meta.size + 1,
                  fontWeight: 600,
                  backgroundColor: start || end
                    ? GodoYellow[500]
                    : inRange
                      ? GodoYellow[200]
                      : "transparent",
                  color: start || end
                    ? Surface.onPrimary
                    : inRange
                      ? Neutral[800]
                      : isToday
                        ? Neutral[800]
                        : Neutral[700],
                  borderRadius: start
                    ? "999px 0 0 999px"
                    : end
                      ? "0 999px 999px 0"
                      : start && !endDate
                        ? "999px"
                        : "0",
                  ...(start && !endDate ? { borderRadius: "999px" } : {}),
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Go.Set. button — matches Expo branded button: Calibri-Bold */}
        <button
          onClick={onClose}
          className="w-full mt-4 active:opacity-85 active:scale-[0.98]"
          style={{
            height: 48,
            borderRadius: Radii.button,
            backgroundColor: GodoYellow[500],
            color: Surface.onPrimary,
            fontFamily: FontFamily.brand,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          Go.Set.
        </button>
      </div>
    </div>
  );
}
