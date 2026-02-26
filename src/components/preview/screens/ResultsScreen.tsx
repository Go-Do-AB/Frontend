"use client";

import { useMemo, useState } from "react";
import { categoryOptions, subcategoriesMap, filterOptions } from "@/lib/content/contentText";
import { EventDto } from "@/types/events";
import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_TINTS,
  CATEGORY_SHORT_LABELS,
} from "../constants";
import { filterMockEvents } from "../mockEvents";
import { ArrowLeft, MapPin, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface ResultsScreenProps {
  categoryCode: number;
  tagCodes: number[];
  onTagsChange: (tagCodes: number[]) => void;
  onBack: () => void;
  onSelectEvent: (eventId: string) => void;
}

export function ResultsScreen({
  categoryCode,
  tagCodes,
  onTagsChange,
  onBack,
  onSelectEvent,
}: ResultsScreenProps) {
  const [selectedSub, setSelectedSub] = useState<number | null>(null);
  const category = categoryOptions.find((c) => c.code === categoryCode);
  const subcategories = subcategoriesMap[categoryCode] ?? [];
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];
  const tint = CATEGORY_TINTS[categoryCode] ?? CATEGORY_TINTS[1];

  const toggleTag = (code: number) => {
    onTagsChange(
      tagCodes.includes(code)
        ? tagCodes.filter((c) => c !== code)
        : [...tagCodes, code]
    );
  };

  const { items: events, totalCount } = useMemo(
    () => filterMockEvents({
      categoryCodes: [categoryCode],
      subcategoryCodes: selectedSub ? [selectedSub] : undefined,
      tagCodes: tagCodes.length > 0 ? tagCodes : undefined,
      pageSize: 12,
    }),
    [categoryCode, selectedSub, tagCodes],
  );

  return (
    <div>
      {/* Header */}
      <div className="px-4 pt-1 pb-3" style={{ backgroundColor: tint }}>
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[13px] font-medium mb-2 active:opacity-70"
          style={{ color }}
        >
          <ArrowLeft size={16} />
          Tillbaka
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {category && (
              <category.icon size={20} color={color} strokeWidth={2} />
            )}
            <h1 className="text-[17px] font-bold" style={{ color }}>
              {CATEGORY_SHORT_LABELS[categoryCode] ?? category?.label}
            </h1>
          </div>
          <span className="text-[11px] font-medium" style={{ color: BRAND.textSecondary }}>
            {totalCount} evenemang
          </span>
        </div>
      </div>

      {/* Subcategory filter chips */}
      {subcategories.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto px-4 py-2.5 scrollbar-hide">
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

      {/* Tag filter chips */}
      <div className="flex gap-1.5 flex-wrap px-4 pb-2">
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

      {/* Results */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-2.5 mt-1">
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
          <p className="text-center text-[12px] text-gray-400 py-8">
            Inga evenemang i denna kategori
          </p>
        )}
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
      className="w-full text-left rounded-2xl overflow-hidden shadow-sm border transition-transform active:scale-[0.98]"
      style={{ borderColor: BRAND.border, backgroundColor: BRAND.surface }}
    >
      <div className="flex">
        {/* Color strip */}
        <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: accentColor }} />

        <div className="flex-1 p-3 min-w-0">
          <h3
            className="text-[13px] font-semibold leading-snug line-clamp-2 mb-1 break-words"
            style={{ color: BRAND.textPrimary }}
          >
            {event.title}
          </h3>

          {event.subcategories?.[0] && (
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-1.5"
              style={{ backgroundColor: tint, color: accentColor }}
            >
              {event.subcategories[0].name}
            </span>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px]" style={{ color: BRAND.textSecondary }}>
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
