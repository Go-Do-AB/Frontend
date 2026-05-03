"use client";

/**
 * HomeScreen — Preview phone home.
 *
 * Mirrors MobileApp/app/(tabs)/index.tsx layout:
 *   Header (Go.Do + flags) → Greeting → Search → 3D Carousel
 *   → Clear All (when dirty) → City + Near Me row → Date pill → Go.Do! button
 *
 * Modals: City selector, Calendar (range), both anchored to the phone frame.
 */

import { useState, useMemo } from "react";
import {
  Search,
  X,
  MapPin,
  Compass,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Globe,
  Check,
  Lock,
  Bell,
} from "lucide-react";
import {
  GodoYellow,
  Neutral,
  Surface,
  Radii,
  Shadows,
  Spacing,
  Typography,
  FontFamily,
} from "../constants";
import { CategoryCarousel3D } from "../components/CategoryCarousel3D";
import { MOCK_EVENTS } from "../mockEvents";

// ── Helpers ─────────────────────────────────────────────────────────

const AVAILABLE_CITIES = Array.from(
  new Set(MOCK_EVENTS.map((e) => e.city).filter(Boolean) as string[]),
).sort((a, b) => a.localeCompare(b, "sv"));

const SV_MONTHS = [
  "Januari", "Februari", "Mars", "April", "Maj", "Juni",
  "Juli", "Augusti", "September", "Oktober", "November", "December",
];
const SV_DAYS_SHORT = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];

const formatSwedishDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
};

// ── Props ───────────────────────────────────────────────────────────

interface HomeScreenProps {
  /** Reserved (parent contract) — not used in this redesign */
  tagCodes: number[];
  /** Reserved (parent contract) — not used in this redesign */
  selectedCategories: number[];
  searchText: string;
  cities: string[];
  startDate: string | null;
  endDate: string | null;
  onSearchChange: (text: string) => void;
  onToggleCity: (city: string) => void;
  onSetCities: (cities: string[]) => void;
  onDateRange: (start: string | null, end: string | null) => void;
  /** Reserved (parent contract) — not used in this redesign */
  onTagsChange: (tagCodes: number[]) => void;
  /** Reserved (parent contract) — not used in this redesign */
  onToggleCategory: (code: number) => void;
  onGoDo: (categoryCodes: number[]) => void;
  /** Reserved (parent contract) — not used on home */
  onSelectEvent: (eventId: string, categoryCode: number) => void;
}

// ── Component ───────────────────────────────────────────────────────

export function HomeScreen({
  searchText,
  cities,
  startDate,
  endDate,
  onSearchChange,
  onToggleCity,
  onSetCities,
  onDateRange,
  onGoDo,
}: HomeScreenProps) {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [showAllToggle, setShowAllToggle] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<{ [k: number]: number[] }>({});
  const [everything, setEverything] = useState<{ [k: number]: boolean }>({});
  const [showCityModal, setShowCityModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [lang, setLang] = useState<"sv" | "en">("sv");

  // Derived: which categories are picked (any sub or "everything")
  const selectedCategoryCodes = useMemo(() => {
    const codes = new Set<number>();
    Object.entries(everything).forEach(([k, v]) => {
      if (v) codes.add(Number(k));
    });
    Object.entries(selectedSubs).forEach(([k, v]) => {
      if (v.length > 0) codes.add(Number(k));
    });
    return [...codes];
  }, [everything, selectedSubs]);

  const hasSelection = selectedCategoryCodes.length > 0 || showAllToggle;

  const handleToggleSubcategory = (catCode: number, subCode: number | null) => {
    if (subCode === null) {
      setEverything((p) => ({ ...p, [catCode]: !p[catCode] }));
    } else {
      setSelectedSubs((p) => {
        const cur = p[catCode] ?? [];
        return {
          ...p,
          [catCode]: cur.includes(subCode)
            ? cur.filter((s) => s !== subCode)
            : [...cur, subCode],
        };
      });
    }
  };

  const handleClearAll = () => {
    setSelectedSubs({});
    setEverything({});
    setShowAllToggle(false);
    setExpandedCategory(null);
  };

  const handleGoDo = () => {
    const codes = selectedCategoryCodes.length > 0 ? selectedCategoryCodes : [1];
    onGoDo(codes);
  };

  const displayCity =
    cities.length > 0
      ? cities.length <= 2
        ? cities.join(", ")
        : `${cities.length} städer`
      : "Alla städer";

  const dateDisplayText = !startDate
    ? "Välj datum"
    : !endDate
      ? formatSwedishDate(startDate)
      : `${formatSwedishDate(startDate)} – ${formatSwedishDate(endDate)}`;

  return (
    <div className="relative pb-6" style={{ backgroundColor: Surface.background }}>
      {/* ── Header ─────────────────────────────────────── */}
      <div
        className="flex items-center justify-between"
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          paddingTop: Spacing.xs,
          paddingBottom: Spacing.sm,
        }}
      >
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
        <div className="flex items-center" style={{ gap: 4 }}>
          <button
            onClick={() => setLang("sv")}
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: Radii.pill,
              opacity: lang === "sv" ? 1 : 0.4,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Svenska"
          >
            <FlagSE />
          </button>
          <button
            onClick={() => setLang("en")}
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: Radii.pill,
              opacity: lang === "en" ? 1 : 0.4,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="English"
          >
            <FlagGB />
          </button>
          <button
            className="flex items-center justify-center"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Notifieringar"
          >
            <Bell size={20} color={Neutral[800]} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* ── Greeting ───────────────────────────────────── */}
      <div
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          marginTop: Spacing.sm,
          marginBottom: Spacing.md,
        }}
      >
        <h1
          style={{
            fontSize: Typography.sectionTitle.size,
            fontWeight: 400,
            lineHeight: "28px",
            color: Neutral[700],
            fontFamily: FontFamily.body,
            margin: 0,
          }}
        >
          {lang === "sv" ? "Vad vill du göra?" : "What do you want to do?"}
        </h1>
      </div>

      {/* ── Search bar ─────────────────────────────────── */}
      <div
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          marginBottom: Spacing.md,
        }}
      >
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
            placeholder={lang === "sv" ? "Sök evenemang..." : "Search events..."}
            className="flex-1 bg-transparent outline-none"
            style={{
              color: Neutral[800],
              fontFamily: FontFamily.body,
              fontSize: Typography.body.size,
            }}
          />
          {searchText && (
            <button
              onClick={() => onSearchChange("")}
              className="flex-shrink-0"
              style={{ background: "transparent", border: "none", cursor: "pointer" }}
              aria-label="Rensa sökning"
            >
              <X size={16} style={{ color: Neutral[500] }} />
            </button>
          )}
        </div>
      </div>

      {/* ── 3D Category Carousel ───────────────────────── */}
      <div style={{ paddingLeft: 4, paddingRight: 4, marginBottom: Spacing.sm }}>
        <CategoryCarousel3D
          expandedCategoryCode={expandedCategory}
          selectedSubcategoryCodes={selectedSubs}
          selectedCategoryEverything={everything}
          showAll={showAllToggle}
          onCenterPress={(code) =>
            setExpandedCategory((prev) => (prev === code ? null : code))
          }
          onToggleShowAll={() => setShowAllToggle((p) => !p)}
          onToggleSubcategory={handleToggleSubcategory}
        />
      </div>

      {/* ── Clear All ──────────────────────────────────── */}
      {hasSelection && (
        <div
          className="flex justify-center"
          style={{
            paddingLeft: Spacing.screenPadding,
            paddingRight: Spacing.screenPadding,
            marginBottom: Spacing.md,
          }}
        >
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 transition-all active:scale-95"
            style={{
              height: 36,
              paddingLeft: 14,
              paddingRight: 14,
              borderRadius: Radii.pill,
              backgroundColor: "#FFFFFF",
              border: `1.5px dashed ${Neutral[300]}`,
              cursor: "pointer",
            }}
          >
            <Trash2 size={16} color={Neutral[600]} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: Neutral[600],
                fontFamily: FontFamily.body,
              }}
            >
              {lang === "sv" ? "Rensa allt" : "Clear all"}
            </span>
          </button>
        </div>
      )}

      {/* ── City + Near Me row ─────────────────────────── */}
      <div
        className="flex"
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          gap: Spacing.sm,
          marginBottom: Spacing.sm,
        }}
      >
        <button
          onClick={() => setShowCityModal(true)}
          className="flex-1 flex items-center"
          style={{
            height: 52,
            borderRadius: Radii.pill,
            paddingLeft: 14,
            paddingRight: 14,
            backgroundColor: "#FFFFFF",
            border: `1px solid ${Neutral[200]}`,
            gap: 8,
            cursor: "pointer",
            boxShadow: Shadows.sm,
          }}
        >
          <MapPin size={18} color={Neutral[800]} strokeWidth={2} />
          <span
            className="flex-1 text-left truncate"
            style={{
              fontSize: Typography.cardTitle.size,
              fontWeight: 500,
              color: Neutral[700],
              fontFamily: FontFamily.body,
            }}
          >
            {displayCity}
          </span>
        </button>
        <button
          className="flex items-center"
          style={{
            height: 52,
            paddingLeft: 14,
            paddingRight: 14,
            borderRadius: Radii.pill,
            backgroundColor: GodoYellow[500],
            gap: 6,
            cursor: "pointer",
            border: "none",
            boxShadow: Shadows.sm,
          }}
          aria-label="Nära mig"
        >
          <Compass size={18} color="#000000" strokeWidth={2.5} />
          <span
            style={{
              fontSize: Typography.cardTitle.size,
              fontWeight: 700,
              color: "#000000",
              fontFamily: FontFamily.body,
            }}
          >
            {lang === "sv" ? "Nära mig" : "Near me"}
          </span>
          <Lock size={12} color="#000000" strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Date picker pill ───────────────────────────── */}
      <div
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          marginBottom: Spacing.md,
        }}
      >
        <button
          onClick={() => setShowCalendarModal(true)}
          className="w-full flex items-center"
          style={{
            height: 52,
            borderRadius: Radii.pill,
            paddingLeft: 14,
            paddingRight: 14,
            backgroundColor: GodoYellow[50],
            border: `1px solid ${GodoYellow[200]}`,
            gap: 8,
            cursor: "pointer",
          }}
        >
          <CalendarRange size={20} style={{ color: Neutral[800] }} />
          <span
            className="flex-1 text-left truncate"
            style={{
              fontSize: Typography.cardTitle.size,
              fontWeight: 500,
              color: Neutral[700],
              fontFamily: FontFamily.body,
            }}
          >
            {dateDisplayText}
          </span>
          {startDate && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onDateRange(null, null);
              }}
              className="flex items-center"
              style={{ marginRight: 4, cursor: "pointer" }}
              aria-label="Rensa datum"
            >
              <X size={14} style={{ color: Neutral[500] }} />
            </span>
          )}
        </button>
      </div>

      {/* ── Big black Go.Do! button ────────────────────── */}
      <div
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          marginBottom: Spacing.lg,
        }}
      >
        <button
          onClick={handleGoDo}
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
            border: "none",
            cursor: "pointer",
          }}
        >
          Go.Do.
        </button>
      </div>

      {/* ── City modal ─────────────────────────────────── */}
      {showCityModal && (
        <CityModal
          cities={cities}
          onToggleCity={onToggleCity}
          onSetCities={onSetCities}
          onClose={() => setShowCityModal(false)}
        />
      )}

      {/* ── Calendar modal ─────────────────────────────── */}
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

// ── Flag SVGs (Windows lacks colour emoji for regional flags) ───────

function FlagSE() {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 16 10"
      aria-hidden="true"
      style={{ borderRadius: 2, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)" }}
    >
      <rect width="16" height="10" fill="#006AA7" />
      <rect x="5" y="0" width="2" height="10" fill="#FECC00" />
      <rect x="0" y="4" width="16" height="2" fill="#FECC00" />
    </svg>
  );
}

function FlagGB() {
  return (
    <svg
      width="26"
      height="18"
      viewBox="0 0 60 30"
      aria-hidden="true"
      style={{ borderRadius: 2, boxShadow: "0 0 0 0.5px rgba(0,0,0,0.15)" }}
    >
      <clipPath id="godo-fl-uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#godo-fl-uk-t)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

// ── City modal ──────────────────────────────────────────────────────

function CityModal({
  cities,
  onToggleCity,
  onSetCities,
  onClose,
}: {
  cities: string[];
  onToggleCity: (city: string) => void;
  onSetCities: (cities: string[]) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return AVAILABLE_CITIES;
    const q = search.trim().toLowerCase();
    return AVAILABLE_CITIES.filter((c) => c.toLowerCase().includes(q));
  }, [search]);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="max-h-[80%] flex flex-col"
        style={{
          backgroundColor: Surface.surface,
          borderRadius: `${Radii.sheet}px ${Radii.sheet}px 0 0`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center p-4"
          style={{ borderBottom: `1px solid ${Neutral[200]}` }}
        >
          <span
            className="flex-1"
            style={{
              fontSize: Typography.sectionTitle.size,
              fontWeight: 700,
              color: Neutral[800],
              fontFamily: FontFamily.body,
            }}
          >
            Välj stad
          </span>
          {cities.length > 0 && (
            <span
              className="mr-3 px-2 py-0.5"
              style={{
                fontSize: Typography.caption.size,
                fontWeight: 700,
                borderRadius: Radii.pill,
                backgroundColor: Neutral[800],
                color: "#FFFFFF",
              }}
            >
              {cities.length}
            </span>
          )}
          <button
            onClick={onClose}
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: Neutral[800],
              border: "none",
              cursor: "pointer",
            }}
            aria-label="Stäng"
          >
            <X size={20} color="#FFFFFF" />
          </button>
        </div>

        <div className="px-4 py-2">
          <div
            className="flex items-center"
            style={{
              height: 48,
              paddingLeft: 12,
              paddingRight: 12,
              gap: 8,
              borderRadius: 10,
              backgroundColor: Surface.surface,
              border: `1px solid ${Neutral[300]}`,
            }}
          >
            <Search size={18} style={{ color: Neutral[500] }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sök stad..."
              className="flex-1 bg-transparent outline-none"
              style={{
                fontSize: Typography.cardTitle.size,
                color: Neutral[800],
                fontFamily: FontFamily.body,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <X size={16} style={{ color: Neutral[500] }} />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            onSetCities([]);
            setSearch("");
            onClose();
          }}
          className="flex items-center mx-4 mb-1"
          style={{
            height: 48,
            paddingLeft: 14,
            paddingRight: 14,
            gap: 10,
            borderRadius: 10,
            backgroundColor: cities.length === 0 ? Neutral[800] : Neutral[100],
            border: "none",
            cursor: "pointer",
          }}
        >
          <Globe size={20} color={cities.length === 0 ? "#FFFFFF" : Neutral[500]} />
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

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.map((city) => {
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
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span
                  className="flex items-center justify-center mr-3"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    border: `1px solid ${checked ? "#FFFFFF" : Neutral[400]}`,
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
          {filtered.length === 0 && (
            <p
              className="text-center py-10"
              style={{
                fontSize: Typography.cardTitle.size,
                color: Neutral[500],
                fontFamily: FontFamily.body,
              }}
            >
              Inga städer hittades
            </p>
          )}
        </div>

        <div className="px-4 py-2">
          <button
            onClick={onClose}
            className="w-full"
            style={{
              height: 48,
              borderRadius: Radii.input,
              backgroundColor: Neutral[800],
              color: "#FFFFFF",
              fontSize: Typography.button.size,
              fontWeight: Typography.button.weight,
              fontFamily: FontFamily.body,
              border: "none",
              cursor: "pointer",
            }}
          >
            {cities.length > 0 ? `Klar (${cities.length})` : "Klar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Calendar modal ──────────────────────────────────────────────────

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
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
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
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else setViewMonth(viewMonth + 1);
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
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevMonth}
            className="flex items-center justify-center"
            style={{ width: 36, height: 36, background: "transparent", border: "none", cursor: "pointer" }}
            aria-label="Föregående månad"
          >
            <ChevronLeft size={20} style={{ color: Neutral[800] }} />
          </button>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: Neutral[800],
              fontFamily: FontFamily.body,
            }}
          >
            {SV_MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            onClick={nextMonth}
            className="flex items-center justify-center"
            style={{ width: 36, height: 36, background: "transparent", border: "none", cursor: "pointer" }}
            aria-label="Nästa månad"
          >
            <ChevronRight size={20} style={{ color: Neutral[800] }} />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {SV_DAYS_SHORT.map((d) => (
            <div
              key={d}
              className="text-center py-1"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: Neutral[500],
                fontFamily: FontFamily.body,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: 36 }} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const inRange = isInRange(day);
            const start = isStart(day);
            const end = isEnd(day);

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className="flex items-center justify-center"
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
                      : Neutral[700],
                  borderRadius: start && !endDate
                    ? "999px"
                    : start
                      ? "999px 0 0 999px"
                      : end
                        ? "0 999px 999px 0"
                        : 0,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

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
            border: "none",
            cursor: "pointer",
          }}
        >
          Go.Set.
        </button>
      </div>
    </div>
  );
}
