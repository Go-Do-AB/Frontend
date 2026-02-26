"use client";

import { useMemo } from "react";
import { categoryOptions, filterOptions } from "@/lib/content/contentText";
import { EventDto } from "@/types/events";
import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_TINTS,
  CATEGORY_SHORT_LABELS,
  CATEGORY_GRADIENTS,
} from "../constants";
import { filterMockEvents } from "../mockEvents";
import {
  MapPin,
  CalendarDays,
  Bell,
  Search,
  Check,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface HomeScreenProps {
  tagCodes: number[];
  selectedCategories: number[];
  onTagsChange: (tagCodes: number[]) => void;
  onToggleCategory: (code: number) => void;
  onGoDo: (categoryCodes: number[]) => void;
  onSelectEvent: (eventId: string, categoryCode: number) => void;
}

export function HomeScreen({
  tagCodes,
  selectedCategories,
  onTagsChange,
  onToggleCategory,
  onGoDo,
  onSelectEvent,
}: HomeScreenProps) {
  const { items: events, totalCount } = useMemo(
    () =>
      filterMockEvents({
        categoryCodes: selectedCategories.length > 0 ? selectedCategories : undefined,
        tagCodes: tagCodes.length > 0 ? tagCodes : undefined,
        pageSize: 6,
      }),
    [tagCodes, selectedCategories],
  );

  const toggleTag = (code: number) => {
    onTagsChange(
      tagCodes.includes(code) ? tagCodes.filter((c) => c !== code) : [...tagCodes, code],
    );
  };

  return (
    <div className="pb-4">
      {/* Location header */}
      <div className="flex items-center justify-between px-5 pt-1 pb-2">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
          style={{ backgroundColor: BRAND.neutral100, color: BRAND.textBody }}
        >
          <MapPin size={13} />
          Helsingborg
          <ChevronDown size={12} />
        </button>
        <button
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full"
          style={{ backgroundColor: BRAND.neutral100 }}
        >
          <Bell size={16} style={{ color: BRAND.textBody }} />
        </button>
      </div>

      {/* Greeting */}
      <div className="px-5 pb-3">
        <h1
          className="text-[22px] font-bold leading-tight tracking-wide"
          style={{ color: BRAND.textPrimary, letterSpacing: "0.25px" }}
        >
          Hej! Vad letar du efter idag?
        </h1>
      </div>

      {/* Search bar */}
      <div className="px-5 pb-3">
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
          style={{ backgroundColor: BRAND.neutral100 }}
        >
          <Search size={16} style={{ color: BRAND.textSecondary }} />
          <span className="text-[13px]" style={{ color: BRAND.textSecondary }}>
            Sök evenemang...
          </span>
        </div>
      </div>

      {/* Date pill */}
      <div className="px-5 pb-3">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold border-2"
          style={{
            borderColor: BRAND.yellow,
            backgroundColor: BRAND.yellowLight,
            color: BRAND.onPrimary,
          }}
        >
          <CalendarDays size={14} />
          Välj datum
        </button>
      </div>

      {/* Category tiles — horizontal scroll */}
      <div className="mb-3">
        <div className="flex gap-2.5 overflow-x-auto pb-2 px-5 scrollbar-hide">
          {categoryOptions.map((cat) => {
            const Icon = cat.icon;
            const code = cat.code;
            const isSelected = selectedCategories.includes(code);
            const color = CATEGORY_COLORS[code];
            const tint = CATEGORY_TINTS[code];
            return (
              <button
                key={code}
                onClick={() => onToggleCategory(code)}
                className="relative flex-shrink-0 flex flex-col items-center justify-center rounded-2xl w-[80px] h-[90px] transition-all active:scale-95"
                style={{
                  backgroundColor: isSelected ? color : tint,
                  border: isSelected ? `2px solid ${BRAND.yellow}` : `1px solid ${color}15`,
                  boxShadow: isSelected
                    ? `0 2px 8px ${color}40`
                    : "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-1.5 right-1.5 w-[16px] h-[16px] rounded-full flex items-center justify-center"
                    style={{ backgroundColor: BRAND.yellow }}
                  >
                    <Check size={10} strokeWidth={3} style={{ color: BRAND.onPrimary }} />
                  </div>
                )}
                <Icon size={22} color={isSelected ? "#fff" : color} strokeWidth={2} />
                <span
                  className="text-[10px] font-semibold mt-1.5 leading-tight text-center"
                  style={{ color: isSelected ? "#fff" : color }}
                >
                  {CATEGORY_SHORT_LABELS[code]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tag filter chips */}
      <div className="flex gap-1.5 flex-wrap px-5 mb-3">
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

      {/* Go.Do! button */}
      <div className="px-5 mb-4">
        <button
          onClick={() => onGoDo(selectedCategories.length > 0 ? selectedCategories : [1])}
          className="w-full py-3.5 rounded-[26px] text-[16px] font-bold tracking-wide transition-all active:scale-[0.97]"
          style={{
            backgroundColor: BRAND.yellow,
            color: BRAND.onPrimary,
            boxShadow: "0 4px 12px rgba(243, 193, 14, 0.4)",
            letterSpacing: "0.5px",
          }}
        >
          Go.Do!
        </button>
      </div>

      {/* Upcoming section */}
      <div className="px-5 mb-2.5">
        <div className="flex items-center justify-between">
          <h2
            className="text-[16px] font-bold"
            style={{ color: BRAND.textPrimary, letterSpacing: "0.25px" }}
          >
            Kommande evenemang
          </h2>
          <span className="text-[11px] font-medium" style={{ color: BRAND.textSecondary }}>
            {totalCount} totalt
          </span>
        </div>
      </div>

      {/* Horizontal event cards */}
      <div className="flex gap-3 overflow-x-auto px-5 pb-3 scrollbar-hide">
        {events.slice(0, 5).map((event) => (
          <UpcomingCard
            key={event.id}
            event={event}
            onClick={() => onSelectEvent(event.id, event.categories?.[0]?.code ?? 1)}
          />
        ))}
      </div>

      {/* Featured carousel placeholder */}
      {events.length > 0 && (
        <div className="px-5 mb-2">
          <FeaturedCard event={events[0]} onClick={() => onSelectEvent(events[0].id, events[0].categories?.[0]?.code ?? 1)} />
        </div>
      )}

      {events.length === 0 && (
        <p className="text-center text-[12px] py-6" style={{ color: BRAND.textSecondary }}>
          Inga evenemang hittades
        </p>
      )}
    </div>
  );
}

function UpcomingCard({ event, onClick }: { event: EventDto; onClick: () => void }) {
  const catCode = event.categories?.[0]?.code ?? 1;
  const gradient = CATEGORY_GRADIENTS[catCode] ?? CATEGORY_GRADIENTS[1];
  const isFree = event.tags?.some((t) => t.code === 1001);
  const dateLabel = event.startDate
    ? format(new Date(event.startDate), "d MMM", { locale: sv })
    : "";

  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[200px] rounded-[18px] overflow-hidden text-left transition-transform active:scale-[0.97]"
      style={{
        backgroundColor: BRAND.surface,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Image placeholder with gradient */}
      <div
        className="relative h-[110px]"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        {/* Date badge */}
        {dateLabel && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-white text-[10px] font-bold" style={{ color: BRAND.textPrimary }}>
            {dateLabel}
          </span>
        )}
        {/* Free badge */}
        {isFree && (
          <span
            className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{ backgroundColor: BRAND.yellow, color: BRAND.onPrimary }}
          >
            Gratis
          </span>
        )}
      </div>
      <div className="p-3">
        <h3
          className="text-[13px] font-semibold leading-snug line-clamp-2 mb-1"
          style={{ color: BRAND.textPrimary }}
        >
          {event.title}
        </h3>
        <span className="flex items-center gap-1 text-[11px]" style={{ color: BRAND.textSecondary }}>
          <MapPin size={10} />
          {event.city}
        </span>
      </div>
    </button>
  );
}

function FeaturedCard({ event, onClick }: { event: EventDto; onClick: () => void }) {
  const catCode = event.categories?.[0]?.code ?? 1;
  const gradient = CATEGORY_GRADIENTS[catCode] ?? CATEGORY_GRADIENTS[1];
  const dateLabel = event.startDate
    ? format(new Date(event.startDate), "d MMM yyyy", { locale: sv })
    : "";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[18px] overflow-hidden transition-transform active:scale-[0.98]"
      style={{
        /* RGB animated border effect (static version for web) */
        padding: "2.5px",
        background: `linear-gradient(135deg, ${BRAND.yellow}, #F87171, #A78BFA, #60A5FA, #FB923C, #F472B6, ${BRAND.yellow})`,
        backgroundSize: "400% 400%",
        animation: "rgbShift 4s ease infinite",
      }}
    >
      <div
        className="relative h-[160px] rounded-[16px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {dateLabel && (
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold mb-2" style={{ color: BRAND.textPrimary }}>
              {dateLabel}
            </span>
          )}
          <h3 className="text-[17px] font-bold text-white leading-snug" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
            {event.title}
          </h3>
          <span className="flex items-center gap-1 text-[11px] text-white/80 mt-0.5">
            <MapPin size={10} />
            {event.city}
          </span>
        </div>
      </div>
    </button>
  );
}
