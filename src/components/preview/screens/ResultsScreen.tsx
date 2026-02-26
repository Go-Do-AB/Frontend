"use client";

import { useMemo, useState } from "react";
import { categoryOptions, subcategoriesMap, filterOptions } from "@/lib/content/contentText";
import { EventDto } from "@/types/events";
import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_TINTS,
  CATEGORY_SHORT_LABELS,
  CATEGORY_EMOJIS,
  MOCK_LOCATIONS,
  HELSINGBORG_CENTER,
} from "../constants";
import { filterMockEvents } from "../mockEvents";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Navigation,
  ArrowUpDown,
  SlidersHorizontal,
  Map as MapIcon,
  List,
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ResultsScreenProps {
  categoryCode: number;
  tagCodes: number[];
  showMap: boolean;
  onToggleMap: () => void;
  onTagsChange: (tagCodes: number[]) => void;
  onBack: () => void;
  onSelectEvent: (eventId: string) => void;
}

export function ResultsScreen({
  categoryCode,
  tagCodes,
  showMap,
  onToggleMap,
  onTagsChange,
  onBack,
  onSelectEvent,
}: ResultsScreenProps) {
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const [nearMe, setNearMe] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const category = categoryOptions.find((c) => c.code === categoryCode);
  const subcategories = subcategoriesMap[categoryCode] ?? [];
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];
  const tint = CATEGORY_TINTS[categoryCode] ?? CATEGORY_TINTS[1];

  const toggleTag = (code: number) => {
    onTagsChange(
      tagCodes.includes(code) ? tagCodes.filter((c) => c !== code) : [...tagCodes, code],
    );
  };

  const { items: events, totalCount } = useMemo(
    () =>
      filterMockEvents({
        categoryCodes: [categoryCode],
        subcategoryCodes: selectedSub ? [selectedSub] : undefined,
        tagCodes: tagCodes.length > 0 ? tagCodes : undefined,
        pageSize: 15,
      }),
    [categoryCode, selectedSub, tagCodes],
  );

  return (
    <div style={{ backgroundColor: BRAND.background }}>
      {/* Compact header */}
      <div className="px-4 pt-1 pb-2" style={{ backgroundColor: BRAND.surface, borderBottom: `1px solid ${BRAND.border}` }}>
        <div className="flex items-center gap-2 mb-1.5">
          <button
            onClick={onBack}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-full active:opacity-70"
            style={{ backgroundColor: BRAND.neutral100 }}
          >
            <ArrowLeft size={16} style={{ color: BRAND.textBody }} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              {category && <category.icon size={16} color={color} strokeWidth={2} />}
              <h1 className="text-[15px] font-bold truncate" style={{ color: BRAND.textPrimary }}>
                {CATEGORY_SHORT_LABELS[categoryCode] ?? category?.label}
              </h1>
            </div>
          </div>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full"
            style={{ backgroundColor: BRAND.neutral100, color: BRAND.textSecondary }}
          >
            {totalCount}
          </span>
        </div>

        {/* Inline filter chips */}
        {(selectedSub || tagCodes.length > 0) && (
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {selectedSub && (
              <span
                className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ backgroundColor: BRAND.yellow, color: BRAND.onPrimary }}
              >
                {subcategories.find((s) => s.code === selectedSub)?.label}
              </span>
            )}
            {tagCodes.map((tc) => {
              const tag = filterOptions.find((f) => f.code === tc);
              return (
                <span
                  key={tc}
                  className="flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ backgroundColor: BRAND.yellow, color: BRAND.onPrimary }}
                >
                  {tag?.label}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1.5 px-4 py-2" style={{ backgroundColor: BRAND.surface }}>
        <ToolbarPill
          active={nearMe}
          onClick={() => setNearMe(!nearMe)}
          icon={<Navigation size={13} />}
          label="Nära mig"
        />
        <ToolbarPill
          active={showSort}
          onClick={() => { setShowSort(!showSort); setShowFilter(false); }}
          icon={<ArrowUpDown size={13} />}
          label="Sortera"
        />
        <ToolbarPill
          active={showFilter}
          onClick={() => { setShowFilter(!showFilter); setShowSort(false); }}
          icon={<SlidersHorizontal size={13} />}
          label="Filter"
        />
        <div className="flex-1" />
        <button
          onClick={onToggleMap}
          className="w-[34px] h-[34px] flex items-center justify-center rounded-full transition-colors"
          style={{
            backgroundColor: showMap ? BRAND.yellow : BRAND.neutral100,
            color: showMap ? BRAND.onPrimary : BRAND.textSecondary,
          }}
        >
          {showMap ? <List size={15} /> : <MapIcon size={15} />}
        </button>
      </div>

      {/* Sort dropdown */}
      {showSort && (
        <div className="mx-4 mb-2 rounded-xl overflow-hidden border" style={{ borderColor: BRAND.border, backgroundColor: BRAND.surface }}>
          {["Datum (närmast)", "Datum (längst bort)", "A-Ö"].map((opt) => (
            <button key={opt} className="w-full text-left px-4 py-2.5 text-[12px] font-medium hover:bg-gray-50 transition-colors" style={{ color: BRAND.textBody }}>
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Filter tags dropdown */}
      {showFilter && (
        <div className="flex gap-1.5 flex-wrap px-4 pb-2">
          {filterOptions.map((tag) => {
            const active = tagCodes.includes(tag.code);
            return (
              <button
                key={tag.code}
                onClick={() => toggleTag(tag.code)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: active ? BRAND.yellow : BRAND.neutral100,
                  color: active ? BRAND.onPrimary : BRAND.textSecondary,
                }}
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Subcategory filter chips */}
      {subcategories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto px-4 py-2 scrollbar-hide">
          <button
            onClick={() => setSelectedSub(null)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors"
            style={{
              backgroundColor: selectedSub === null ? color : BRAND.surface,
              color: selectedSub === null ? "#fff" : BRAND.textSecondary,
              border: `1px solid ${selectedSub === null ? color : BRAND.border}`,
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
                className="flex-shrink-0 px-2.5 py-1.5 rounded-full text-[10px] font-semibold transition-colors whitespace-nowrap"
                style={{
                  backgroundColor: active ? color : BRAND.surface,
                  color: active ? "#fff" : BRAND.textSecondary,
                  border: `1px solid ${active ? color : BRAND.border}`,
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
          <div className="flex flex-col gap-2 mt-1">
            {events.map((event) => (
              <ResultCard
                key={event.id}
                event={event}
                accentColor={color}
                tint={tint}
                onClick={() => onSelectEvent(event.id)}
              />
            ))}
          </div>

          {events.length === 0 && (
            <p className="text-center text-[12px] py-8" style={{ color: BRAND.textSecondary }}>
              Inga evenemang i denna kategori
            </p>
          )}

          {/* Pagination stub */}
          {events.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <span className="text-[10px]" style={{ color: BRAND.textSecondary }}>
                Visar 1-{events.length} av {totalCount}
              </span>
              <div className="flex gap-1 ml-2">
                {[1, 2, 3].map((p) => (
                  <button
                    key={p}
                    className="w-[30px] h-[30px] rounded-lg text-[11px] font-semibold flex items-center justify-center"
                    style={{
                      backgroundColor: p === 1 ? BRAND.yellow : BRAND.neutral100,
                      color: p === 1 ? BRAND.onPrimary : BRAND.textSecondary,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Provider info */}
          <div className="mt-3 text-center">
            <p className="text-[9px]" style={{ color: BRAND.neutral300 }}>
              Data: Go.Do + Helsingborg Events API
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarPill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 h-[34px] rounded-full text-[11px] font-medium transition-colors"
      style={{
        backgroundColor: active ? BRAND.yellow : BRAND.neutral100,
        color: active ? BRAND.onPrimary : BRAND.textSecondary,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function MapView({
  events,
  categoryCode,
  onSelectEvent,
}: {
  events: EventDto[];
  categoryCode: number;
  onSelectEvent: (eventId: string) => void;
}) {
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];
  const emoji = CATEGORY_EMOJIS[categoryCode] ?? "📍";

  // Group events by city for pin placement
  const cityGroups = useMemo(() => {
    const groups: Record<string, { events: EventDto[]; loc: { lat: number; lng: number } }> = {};
    for (const ev of events) {
      const city = ev.city || "Helsingborg";
      if (!groups[city]) {
        groups[city] = {
          events: [],
          loc: MOCK_LOCATIONS[city] ?? HELSINGBORG_CENTER,
        };
      }
      groups[city].events.push(ev);
    }
    return groups;
  }, [events]);

  return (
    <div className="relative" style={{ height: "380px" }}>
      {/* Map background with grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#E8F4E8",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        {/* Water areas */}
        <div className="absolute top-0 right-0 w-[40%] h-[35%] rounded-bl-[60px]" style={{ backgroundColor: "#B3D9F2" }} />
        <div className="absolute bottom-[10%] left-[5%] w-[15%] h-[12%] rounded-full" style={{ backgroundColor: "#B3D9F2" }} />

        {/* Roads */}
        <div className="absolute top-[30%] left-0 right-0 h-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
        <div className="absolute top-0 bottom-0 left-[35%] w-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
        <div className="absolute top-[60%] left-0 right-[30%] h-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
        <div className="absolute top-[15%] bottom-[20%] left-[65%] w-[2px]" style={{ backgroundColor: "#D1D5DB" }} />
      </div>

      {/* Map pins */}
      {Object.entries(cityGroups).map(([city, { events: cityEvents }], i) => {
        // Position pins roughly based on city
        const positions: Record<string, { top: string; left: string }> = {
          Helsingborg: { top: "30%", left: "40%" },
          "Malmö": { top: "65%", left: "55%" },
          Lund: { top: "55%", left: "30%" },
        };
        const pos = positions[city] ?? { top: `${30 + i * 20}%`, left: `${30 + i * 15}%` };

        return (
          <button
            key={city}
            onClick={() => cityEvents[0] && onSelectEvent(cityEvents[0].id)}
            className="absolute flex flex-col items-center -translate-x-1/2 -translate-y-full z-10 group"
            style={{ top: pos.top, left: pos.left }}
          >
            {/* Pin bubble */}
            <div
              className="relative px-2 py-1 rounded-xl flex items-center gap-1 shadow-md transition-transform group-hover:scale-110"
              style={{ backgroundColor: color }}
            >
              <span className="text-[12px]">{emoji}</span>
              <span className="text-[10px] font-bold text-white">{cityEvents.length}</span>
              {/* Pin arrow */}
              <div
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "5px solid transparent",
                  borderRight: "5px solid transparent",
                  borderTop: `6px solid ${color}`,
                }}
              />
            </div>
            {/* City label */}
            <span
              className="text-[9px] font-semibold mt-2 px-1.5 py-0.5 rounded bg-white/90 shadow-sm"
              style={{ color: BRAND.textPrimary }}
            >
              {city}
            </span>
          </button>
        );
      })}

      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-[8px] px-1.5 py-0.5 rounded bg-white/80" style={{ color: BRAND.textSecondary }}>
        Go.Do Map Preview
      </div>
    </div>
  );
}

function ResultCard({
  event,
  accentColor,
  tint,
  onClick,
}: {
  event: EventDto;
  accentColor: string;
  tint: string;
  onClick: () => void;
}) {
  const dateLabel = event.startDate
    ? format(new Date(event.startDate), "d MMM yyyy", { locale: sv })
    : event.isAlwaysOpen
      ? "Alltid öppet"
      : "Datum saknas";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[18px] overflow-hidden border transition-transform active:scale-[0.98]"
      style={{
        borderColor: BRAND.border,
        backgroundColor: BRAND.surface,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex">
        {/* Color strip */}
        <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />

        <div className="flex-1 p-3 min-w-0">
          {/* Colored dot + title */}
          <div className="flex items-start gap-2 mb-1">
            <div
              className="w-[14px] h-[14px] rounded-full flex-shrink-0 mt-0.5"
              style={{ backgroundColor: accentColor }}
            />
            <h3
              className="text-[13px] font-semibold leading-snug line-clamp-2 break-words"
              style={{ color: BRAND.textPrimary, letterSpacing: "0.25px" }}
            >
              {event.title}
            </h3>
          </div>

          {event.subcategories?.[0] && (
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5 ml-[22px]"
              style={{ backgroundColor: tint, color: accentColor }}
            >
              {event.subcategories[0].name}
            </span>
          )}

          <div
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] ml-[22px]"
            style={{ color: BRAND.textSecondary }}
          >
            {event.city && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="flex-shrink-0" />
                <span className="truncate max-w-[100px]">{event.city}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <CalendarDays size={11} className="flex-shrink-0" />
              {dateLabel}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
