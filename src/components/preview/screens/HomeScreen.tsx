"use client";

import { useMemo } from "react";
import { categoryOptions, filterOptions } from "@/lib/content/contentText";
import { EventDto } from "@/types/events";
import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_TINTS,
  CATEGORY_SHORT_LABELS,
} from "../constants";
import { filterMockEvents } from "../mockEvents";
import { MapPin, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface HomeScreenProps {
  tagCodes: number[];
  onTagsChange: (tagCodes: number[]) => void;
  onSelectCategory: (code: number) => void;
  onSelectEvent: (eventId: string, categoryCode: number) => void;
}

export function HomeScreen({ tagCodes, onTagsChange, onSelectCategory, onSelectEvent }: HomeScreenProps) {
  const { items: events, totalCount } = useMemo(
    () => filterMockEvents({
      tagCodes: tagCodes.length > 0 ? tagCodes : undefined,
      pageSize: 8,
    }),
    [tagCodes],
  );

  const toggleTag = (code: number) => {
    onTagsChange(
      tagCodes.includes(code)
        ? tagCodes.filter((c) => c !== code)
        : [...tagCodes, code]
    );
  };

  return (
    <div className="px-4 pb-4">
      {/* Header */}
      <div className="pt-2 pb-3">
        <h1 className="text-[18px] font-bold text-gray-900 leading-tight">
          Hej!
        </h1>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Vad letar du efter idag?
        </p>
      </div>

      {/* Category tiles — horizontal scroll */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categoryOptions.map((cat) => {
            const Icon = cat.icon;
            const color = CATEGORY_COLORS[cat.code];
            const tint = CATEGORY_TINTS[cat.code];
            return (
              <button
                key={cat.code}
                onClick={() => onSelectCategory(cat.code)}
                className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl p-2.5 w-[76px] h-[76px] transition-transform active:scale-95"
                style={{ backgroundColor: tint }}
              >
                <Icon size={20} color={color} strokeWidth={2} />
                <span
                  className="text-[9px] font-semibold mt-1 leading-tight text-center"
                  style={{ color }}
                >
                  {CATEGORY_SHORT_LABELS[cat.code]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tag filter chips */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {filterOptions.map((tag) => {
          const active = tagCodes.includes(tag.code);
          return (
            <button
              key={tag.code}
              onClick={() => toggleTag(tag.code)}
              className="flex-shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors"
              style={{
                backgroundColor: active ? BRAND.yellow : BRAND.surface,
                color: active ? BRAND.textPrimary : BRAND.textSecondary,
                border: `1px solid ${active ? BRAND.yellow : BRAND.border}`,
              }}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Upcoming section header */}
      <div className="flex items-center justify-between mb-2.5">
        <h2
          className="text-[14px] font-bold"
          style={{ color: BRAND.textPrimary }}
        >
          Kommande evenemang
        </h2>
        <span className="text-[11px] font-medium" style={{ color: BRAND.textSecondary }}>
          {totalCount} totalt
        </span>
      </div>

      {/* Event cards */}
      <div className="flex flex-col gap-2.5">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onClick={() =>
              onSelectEvent(event.id, event.categories?.[0]?.code ?? 1)
            }
          />
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-center text-[12px] text-gray-400 py-6">
          Inga evenemang hittades
        </p>
      )}
    </div>
  );
}

function EventCard({
  event,
  onClick,
}: {
  event: EventDto;
  onClick: () => void;
}) {
  const categoryCode = event.categories?.[0]?.code ?? 1;
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];
  const tint = CATEGORY_TINTS[categoryCode] ?? CATEGORY_TINTS[1];

  const dateLabel = event.startDate
    ? format(new Date(event.startDate), "d MMM yyyy", { locale: sv })
    : event.isAlwaysOpen
      ? "Alltid öppet"
      : "Datum saknas";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden shadow-sm border transition-transform active:scale-[0.98]"
      style={{ borderColor: BRAND.border, backgroundColor: BRAND.surface }}
    >
      {/* Colored top bar */}
      <div className="h-1.5" style={{ backgroundColor: color }} />

      <div className="p-3">
        {/* Category badge */}
        <span
          className="inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5"
          style={{ backgroundColor: tint, color }}
        >
          {event.categories?.[0]?.name ?? "Event"}
        </span>

        <h3
          className="text-[13px] font-semibold leading-snug line-clamp-2 mb-1.5 break-words"
          style={{ color: BRAND.textPrimary }}
        >
          {event.title}
        </h3>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]" style={{ color: BRAND.textSecondary }}>
          {event.city && (
            <span className="flex items-center gap-1">
              <MapPin size={11} className="flex-shrink-0" />
              <span className="truncate max-w-[120px]">{event.city}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <CalendarDays size={11} className="flex-shrink-0" />
            {dateLabel}
          </span>
        </div>
      </div>
    </button>
  );
}
