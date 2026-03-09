"use client";

import { useMemo, useState } from "react";
import { categoryOptions, subcategoriesMap, filterOptions } from "@/lib/content/contentText";
import { EventDto } from "@/types/events";
import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_SHORT_LABELS,
  CATEGORY_EMOJIS,
  MOCK_LOCATIONS,
  HELSINGBORG_CENTER,
  FontFamily,
  Typography,
  Spacing,
  Radii,
  Shadows,
  Neutral,
  GodoYellow,
  Surface,
  CoolPastels,
} from "../constants";
import { filterMockEvents, SortMode } from "../mockEvents";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  ArrowUpDown,
  SlidersHorizontal,
  Map as MapIcon,
  List,
  Heart,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ResultsScreenProps {
  categoryCode: number;
  tagCodes: number[];
  showMap: boolean;
  searchText?: string;
  cities?: string[];
  startDate?: string | null;
  endDate?: string | null;
  onToggleMap: () => void;
  onTagsChange: (tagCodes: number[]) => void;
  onBack: () => void;
  onSelectEvent: (eventId: string) => void;
}

const SORT_OPTIONS: { mode: SortMode; label: string }[] = [
  { mode: "date_asc", label: "Datum (närmast)" },
  { mode: "date_desc", label: "Datum (längst bort)" },
  { mode: "alpha_asc", label: "A–Ö" },
];

export function ResultsScreen({
  categoryCode,
  tagCodes,
  showMap,
  searchText,
  cities,
  startDate,
  endDate,
  onToggleMap,
  onTagsChange,
  onBack,
  onSelectEvent,
}: ResultsScreenProps) {
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("date_asc");

  const category = categoryOptions.find((c) => c.code === categoryCode);
  const subcategories = subcategoriesMap[categoryCode] ?? [];
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];

  const toggleTag = (code: number) => {
    onTagsChange(
      tagCodes.includes(code) ? tagCodes.filter((c) => c !== code) : [...tagCodes, code],
    );
  };

  const handleSort = (mode: SortMode) => {
    setSortMode(mode);
    setShowSort(false);
  };

  // City display text
  const cityDisplay = cities && cities.length > 0
    ? (cities.length <= 2 ? cities.join(", ") : `${cities.length} städer`)
    : "Alla städer";

  // Date display text
  const formatDateShort = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
  };
  const dateDisplay = !startDate
    ? "Välj datum"
    : !endDate
      ? formatDateShort(startDate)
      : `${formatDateShort(startDate)} – ${formatDateShort(endDate)}`;

  const { items: events, totalCount } = useMemo(
    () =>
      filterMockEvents({
        categoryCodes: [categoryCode],
        subcategoryCodes: selectedSub ? [selectedSub] : undefined,
        tagCodes: tagCodes.length > 0 ? tagCodes : undefined,
        searchText: searchText || undefined,
        cities: cities && cities.length > 0 ? cities : undefined,
        startDate,
        endDate,
        sortMode,
        pageSize: 30,
      }),
    [categoryCode, selectedSub, tagCodes, searchText, cities, startDate, endDate, sortMode],
  );

  return (
    <div style={{ backgroundColor: Surface.surface, fontFamily: FontFamily.body }}>
      {/* Compact header */}
      <div className="pt-1 pb-2" style={{ paddingLeft: Spacing.md, paddingRight: Spacing.md, backgroundColor: Surface.surface, borderBottom: `1px solid ${Neutral[200]}` }}>
        <div className="flex items-center gap-2 mb-1.5">
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full active:opacity-70"
            style={{ width: 36, height: 36, backgroundColor: Neutral[100] }}
          >
            <ArrowLeft size={16} style={{ color: Neutral[700] }} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              <span
                className="flex-shrink-0 px-2 py-0.5"
                style={{ borderRadius: Radii.pill, fontSize: Typography.caption.size - 2, fontWeight: 600, backgroundColor: color, color: "#FFFFFF" }}
              >
                {CATEGORY_SHORT_LABELS[categoryCode] ?? category?.label}
              </span>
              {selectedSub && (
                <span
                  className="flex-shrink-0 px-2 py-0.5"
                  style={{ borderRadius: Radii.pill, fontSize: Typography.caption.size - 2, fontWeight: 600, backgroundColor: GodoYellow[500], color: Surface.onPrimary }}
                >
                  {subcategories.find((s) => s.code === selectedSub)?.label}
                </span>
              )}
              {tagCodes.slice(0, 2).map((tc) => {
                const tag = filterOptions.find((f) => f.code === tc);
                return (
                  <span
                    key={tc}
                    className="flex-shrink-0 px-2 py-0.5"
                    style={{ borderRadius: Radii.pill, fontSize: Typography.caption.size - 2, fontWeight: 600, backgroundColor: GodoYellow[500], color: Surface.onPrimary }}
                  >
                    {tag?.label}
                  </span>
                );
              })}
              {tagCodes.length > 2 && (
                <span
                  className="flex-shrink-0 px-1.5 py-0.5"
                  style={{ borderRadius: Radii.pill, fontSize: Typography.caption.size - 2, fontWeight: 600, backgroundColor: Neutral[100], color: Neutral[500] }}
                >
                  +{tagCodes.length - 2}
                </span>
              )}
            </div>
          </div>
          <span
            className="px-2 py-0.5 flex-shrink-0"
            style={{ fontSize: 11, fontWeight: 600, borderRadius: Radii.pill, backgroundColor: Neutral[100], color: Neutral[500] }}
          >
            {totalCount}
          </span>
        </div>
      </div>

      {/* Toolbar — 3 equal buttons: Sort, Filter, Map */}
      <div className="flex items-center py-2" style={{ paddingLeft: Spacing.md, paddingRight: Spacing.md, gap: 6, backgroundColor: Surface.surface }}>
        <ToolbarPill active={showSort} onClick={() => { setShowSort(!showSort); setShowFilter(false); }} icon={<ArrowUpDown size={13} />} label="Sortera" />
        <ToolbarPill active={showFilter} onClick={() => { setShowFilter(!showFilter); setShowSort(false); }} icon={<SlidersHorizontal size={13} />} label="Filter" badge={tagCodes.length > 0 ? tagCodes.length : undefined} />
        <ToolbarPill active={showMap} onClick={onToggleMap} icon={showMap ? <List size={13} /> : <MapIcon size={13} />} label={showMap ? "Lista" : "Karta"} />
      </div>

      {/* Sort dropdown — functional */}
      {showSort && (
        <div className="mx-4 mb-2 overflow-hidden border" style={{ borderRadius: Radii.card, borderColor: Neutral[200], backgroundColor: Surface.surface }}>
          {SORT_OPTIONS.map((opt) => {
            const active = sortMode === opt.mode;
            return (
              <button
                key={opt.mode}
                onClick={() => handleSort(opt.mode)}
                className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors"
                style={{
                  fontSize: Typography.caption.size,
                  fontWeight: active ? 700 : 500,
                  color: active ? Neutral[800] : Neutral[700],
                  backgroundColor: active ? Neutral[100] : "transparent",
                }}
              >
                {active && <Check size={14} style={{ color: Neutral[800] }} />}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Filter tags dropdown — matches GodoChip filter variant */}
      {showFilter && (
        <div className="flex flex-wrap px-4 pb-2" style={{ gap: 6 }}>
          {filterOptions.map((tag) => {
            const active = tagCodes.includes(tag.code);
            return (
              <button
                key={tag.code}
                onClick={() => toggleTag(tag.code)}
                className="flex-shrink-0 flex items-center transition-colors"
                style={{
                  height: 36,
                  paddingLeft: 14,
                  paddingRight: 14,
                  borderRadius: Radii.pill,
                  gap: 6,
                  backgroundColor: active ? Neutral[200] : Surface.elevated,
                  color: active ? Neutral[800] : Neutral[600],
                  border: active ? `1.5px solid ${Neutral[500]}` : `1.5px solid ${Neutral[300]}`,
                  fontSize: Typography.meta.size + 1,
                  fontWeight: active ? 700 : 500,
                }}
              >
                {active && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {tag.label}
              </button>
            );
          })}
        </div>
      )}

      {/* City + Date display */}
      <div className="flex py-2" style={{ paddingLeft: Spacing.md, paddingRight: Spacing.md, gap: Spacing.sm }}>
        <div
          className="flex-1 flex items-center gap-1.5 px-3"
          style={{
            height: 40,
            borderRadius: Radii.pill,
            fontSize: Typography.caption.size,
            fontWeight: 500,
            backgroundColor: cities && cities.length > 0 ? GodoYellow[500] : Neutral[100],
            color: cities && cities.length > 0 ? Surface.onPrimary : Neutral[700],
          }}
        >
          <MapPin size={14} />
          <span className="flex-1 text-left truncate">{cityDisplay}</span>
        </div>
        <div
          className="flex-1 flex items-center gap-1.5 px-3"
          style={{
            height: 40,
            borderRadius: Radii.pill,
            fontSize: Typography.caption.size,
            fontWeight: 500,
            backgroundColor: startDate ? GodoYellow[500] : Neutral[100],
            color: startDate ? Surface.onPrimary : Neutral[700],
          }}
        >
          <CalendarDays size={14} />
          <span className="flex-1 text-left truncate">{dateDisplay}</span>
        </div>
      </div>

      {/* Subcategory filter chips — matches GodoChip category variant */}
      {subcategories.length > 0 && (
        <div className="flex overflow-x-auto px-4 py-2 scrollbar-hide" style={{ gap: 6 }}>
          <button
            onClick={() => setSelectedSub(null)}
            className="flex-shrink-0 px-3 transition-colors"
            style={{
              height: 36,
              borderRadius: Radii.pill,
              fontSize: 11,
              fontWeight: 600,
              backgroundColor: selectedSub === null ? color : Surface.surface,
              color: selectedSub === null ? "#fff" : Neutral[500],
              border: `1px solid ${selectedSub === null ? color : Neutral[200]}`,
            }}
          >
            Alla
          </button>
          {subcategories.map((sub) => {
            const active = selectedSub === sub.code;
            return (
              <button
                key={sub.code}
                onClick={() => setSelectedSub(active ? null : sub.code)}
                className="flex-shrink-0 px-2.5 transition-colors whitespace-nowrap"
                style={{
                  height: 36,
                  borderRadius: Radii.pill,
                  fontSize: Typography.caption.size - 2,
                  fontWeight: 600,
                  backgroundColor: active ? color : Surface.surface,
                  color: active ? "#fff" : Neutral[500],
                  border: `1px solid ${active ? color : Neutral[200]}`,
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Content: Map or List */}
      {showMap ? (
        <MapView events={events} categoryCode={categoryCode} onSelectEvent={onSelectEvent} />
      ) : (
        <div className="px-4 pb-4">
          {/* Active sort indicator */}
          {sortMode !== "date_asc" && (
            <div className="flex items-center gap-1.5 mb-2">
              <span style={{ fontSize: Typography.caption.size - 2, color: Neutral[500] }}>Sorterat:</span>
              <span
                className="px-2 py-0.5"
                style={{ fontSize: Typography.caption.size - 2, fontWeight: 600, borderRadius: Radii.pill, backgroundColor: Neutral[100], color: Neutral[700] }}
              >
                {SORT_OPTIONS.find((s) => s.mode === sortMode)?.label}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2 mt-1">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event.id)} />
            ))}
          </div>

          {events.length === 0 && (
            <p className="text-center py-8" style={{ fontSize: Typography.caption.size, color: Neutral[500] }}>
              Inga evenemang hittades med dessa filter
            </p>
          )}

          {events.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <span style={{ fontSize: Typography.caption.size - 2, color: Neutral[500] }}>
                Visar 1-{events.length} av {totalCount}
              </span>
              {totalCount > events.length && (
                <div className="flex gap-1 ml-2">
                  {[1, 2, 3].map((p) => (
                    <button
                      key={p}
                      className="flex items-center justify-center"
                      style={{
                        width: 30, height: 30,
                        borderRadius: Radii.sm,
                        fontSize: 11, fontWeight: 600,
                        backgroundColor: p === 1 ? GodoYellow[500] : Neutral[100],
                        color: p === 1 ? Surface.onPrimary : Neutral[500],
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-3 text-center">
            <p style={{ fontSize: 9, color: Neutral[300] }}>Data: Go.Do + Helsingborg Events API</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Toolbar pill ─────────────────────────────────────────────── */
function ToolbarPill({ active, onClick, icon, label, badge }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string; badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1 transition-colors"
      style={{
        height: 34,
        borderRadius: Radii.pill,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: FontFamily.body,
        backgroundColor: active ? GodoYellow[500] : Neutral[100],
        color: active ? Surface.onPrimary : Neutral[500],
      }}
    >
      {icon}
      {label}
      {badge !== undefined && badge > 0 && (
        <span
          className="ml-0.5 px-1.5 py-0.5"
          style={{ fontSize: 9, fontWeight: 700, borderRadius: Radii.pill, backgroundColor: Neutral[800], color: "#FFFFFF" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── Event card — matches Expo EventOne exactly ──────────────── */
function EventCard({ event, onClick }: { event: EventDto; onClick: () => void }) {
  const categoryCodes = event.categories?.map((c) => c.code) ?? [];
  const stripeColors = categoryCodes.slice(0, 3).map((code) => CATEGORY_COLORS[code] ?? "#374151");
  if (stripeColors.length === 0) stripeColors.push(CATEGORY_COLORS[1]!);

  const dateLabel = event.startDate
    ? format(new Date(event.startDate), "d MMM yyyy", { locale: sv })
    : event.isAlwaysOpen ? "Alltid öppet" : "Datum saknas";

  const displayTags: string[] = [];
  if (event.tags) {
    for (const tag of event.tags.slice(0, 4)) {
      displayTags.push(tag.name);
    }
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left overflow-hidden transition-transform active:scale-[0.98] flex"
      style={{
        minHeight: 48,
        borderRadius: Radii.sm,
        backgroundColor: CoolPastels.secondary50,
        border: `1px solid ${CoolPastels.secondary100}`,
        boxShadow: `2px 0 4px ${stripeColors[0]}59`,
      }}
    >
      {/* Color stripes (6px each, up to 3) */}
      <div className="flex flex-row flex-shrink-0">
        {stripeColors.map((clr, i) => (
          <div key={i} className="self-stretch" style={{ width: 6, backgroundColor: clr }} />
        ))}
      </div>

      {/* Card content */}
      <div className="flex-1 flex flex-col min-w-0" style={{ padding: 12, gap: 5 }}>
        {/* Title + heart */}
        <div className="flex items-start gap-2">
          <h3
            className="line-clamp-2 flex-1 break-words"
            style={{
              fontSize: Typography.cardTitle.size,
              fontWeight: Typography.cardTitle.weight,
              lineHeight: `${Typography.cardTitle.lineHeight}px`,
              color: CoolPastels.neutral800,
              fontFamily: FontFamily.body,
            }}
          >
            {event.title}
          </h3>
          <Heart size={22} className="flex-shrink-0 mt-0.5" style={{ color: CoolPastels.neutral400 }} />
        </div>

        {/* Meta row */}
        <div className="flex items-center" style={{ gap: 4, fontSize: Typography.meta.size + 1, color: "#64748B", fontFamily: FontFamily.body }}>
          {event.city && <span>{event.city},</span>}
          <span>{dateLabel}</span>
        </div>

        {/* Tags — dark badges matching Expo EventOne */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap justify-end mt-1" style={{ gap: 6 }}>
            {displayTags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: Typography.caption.size - 2,
                  fontWeight: 600,
                  paddingLeft: 6,
                  paddingRight: 6,
                  paddingTop: 2,
                  paddingBottom: 2,
                  borderRadius: 4,
                  backgroundColor: CoolPastels.neutral800,
                  color: "#FFFFFF",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

/* ── Map view ─────────────────────────────────────────────────── */
function MapView({ events, categoryCode, onSelectEvent }: {
  events: EventDto[]; categoryCode: number; onSelectEvent: (eventId: string) => void;
}) {
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];
  const emoji = CATEGORY_EMOJIS[categoryCode] ?? "📍";

  const cityGroups = useMemo(() => {
    const groups: Record<string, { events: EventDto[]; loc: { lat: number; lng: number } }> = {};
    for (const ev of events) {
      const city = ev.city || "Helsingborg";
      if (!groups[city]) {
        groups[city] = { events: [], loc: MOCK_LOCATIONS[city] ?? HELSINGBORG_CENTER };
      }
      groups[city].events.push(ev);
    }
    return groups;
  }, [events]);

  const positions: Record<string, { top: string; left: string }> = {
    Helsingborg: { top: "30%", left: "38%" },
    "Malmö": { top: "72%", left: "58%" },
    Lund: { top: "62%", left: "42%" },
    Landskrona: { top: "48%", left: "50%" },
    "Ängelholm": { top: "18%", left: "52%" },
    "Höganäs": { top: "22%", left: "30%" },
  };

  return (
    <div className="relative mx-4 overflow-hidden border" style={{ height: 380, borderRadius: Radii.card, borderColor: Neutral[200], boxShadow: Shadows.md }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#E8F4E8",
          backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      >
        <div className="absolute top-0 right-0 w-[40%] h-[35%] rounded-bl-[60px]" style={{ backgroundColor: "#B3D9F2" }} />
        <div className="absolute bottom-[10%] left-[5%] w-[15%] h-[12%] rounded-full" style={{ backgroundColor: "#B3D9F2" }} />
        <div className="absolute top-[30%] left-0 right-0 h-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
        <div className="absolute top-0 bottom-0 left-[35%] w-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
        <div className="absolute top-[60%] left-0 right-[30%] h-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
        <div className="absolute top-[15%] bottom-[20%] left-[65%] w-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
      </div>

      {Object.entries(cityGroups).map(([city, { events: cityEvents }], i) => {
        const pos = positions[city] ?? { top: `${25 + i * 12}%`, left: `${25 + i * 10}%` };
        return (
          <button
            key={city}
            onClick={() => cityEvents[0] && onSelectEvent(cityEvents[0].id)}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full z-10 group"
            style={{ top: pos.top, left: pos.left }}
          >
            <div
              className="relative px-2 py-1 flex items-center gap-1 shadow-md transition-transform group-hover:scale-110"
              style={{ borderRadius: Radii.input, backgroundColor: color }}
            >
              <span style={{ fontSize: 12 }}>{emoji}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#FFFFFF" }}>{cityEvents.length}</span>
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `6px solid ${color}` }}
              />
            </div>
            <span
              className="mt-2 px-1.5 py-0.5 bg-white/90 shadow-sm"
              style={{ fontSize: 9, fontWeight: 600, borderRadius: Radii.sm, color: Neutral[800] }}
            >
              {city}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-white/80" style={{ fontSize: 8, borderRadius: Radii.sm, color: Neutral[500] }}>
        Go.Do Map Preview
      </div>
    </div>
  );
}
