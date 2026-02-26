"use client";

import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  CATEGORY_TINTS,
  CATEGORY_SHORT_LABELS,
} from "../constants";
import { MOCK_EVENTS } from "../mockEvents";
import {
  ArrowLeft,
  Share2,
  MapPin,
  CalendarDays,
  Clock,
  ExternalLink,
  User,
  Navigation,
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
}

export function EventDetailScreen({ eventId, onBack }: EventDetailScreenProps) {
  const event = MOCK_EVENTS.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div
          className="w-[48px] h-[48px] rounded-full flex items-center justify-center"
          style={{ backgroundColor: BRAND.neutral100 }}
        >
          <MapPin size={20} style={{ color: BRAND.textSecondary }} />
        </div>
        <p className="text-[13px]" style={{ color: BRAND.textSecondary }}>
          Evenemanget hittades inte
        </p>
        <button
          onClick={onBack}
          className="text-[13px] font-semibold px-4 py-2 rounded-full"
          style={{ backgroundColor: BRAND.yellow, color: BRAND.onPrimary }}
        >
          Gå tillbaka
        </button>
      </div>
    );
  }

  const categoryCode = event.categories?.[0]?.code ?? 1;
  const gradient = CATEGORY_GRADIENTS[categoryCode] ?? CATEGORY_GRADIENTS[1];
  const color = CATEGORY_COLORS[categoryCode] ?? CATEGORY_COLORS[1];
  const tint = CATEGORY_TINTS[categoryCode] ?? CATEGORY_TINTS[1];

  const dateLabel = event.startDate
    ? format(new Date(event.startDate), "EEEE d MMMM yyyy", { locale: sv })
    : event.isAlwaysOpen
      ? "Alltid öppet"
      : null;

  const timeLabel = event.startDate
    ? format(new Date(event.startDate), "HH:mm")
    : event.scheduleStartTime
      ? event.scheduleStartTime.substring(0, 5)
      : null;

  const fullAddress = [event.streetName, event.houseNumber, event.city]
    .filter(Boolean)
    .join(", ");

  const hasCta = event.bookingUrl || event.eventUrl || fullAddress;
  const ctaLabel = event.bookingUrl
    ? "Boka biljetter"
    : event.eventUrl
      ? "Besök webbplats"
      : fullAddress
        ? "Vägbeskrivning"
        : "";

  return (
    <div className="relative flex flex-col" style={{ backgroundColor: BRAND.yellow, minHeight: "100%" }}>
      {/* Hero section — 300dp with category gradient */}
      <div className="relative" style={{ height: "260px" }}>
        {/* Category gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          }}
        />
        {/* Dark scrim overlay — bottom vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55))",
          }}
        />

        {/* Floating back & share buttons */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-2 z-10">
          <button
            onClick={onBack}
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <ArrowLeft size={22} style={{ color: BRAND.textPrimary }} />
          </button>
          <button
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <Share2 size={20} style={{ color: BRAND.textPrimary }} />
          </button>
        </div>

        {/* Hero tag pills — positioned at bottom-left of hero */}
        {event.tags && event.tags.length > 0 && (
          <div className="absolute bottom-8 left-5 flex flex-wrap gap-1.5 z-10">
            {event.tags.map((tag) => (
              <span
                key={tag.code}
                className="px-2.5 py-1 rounded-full text-[12px] font-semibold"
                style={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  color: BRAND.textPrimary,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content sheet — overlaps hero by -20px, rounded yellow corners */}
      <div
        className="relative flex-1"
        style={{
          backgroundColor: BRAND.surface,
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
          marginTop: "-20px",
          paddingBottom: hasCta ? "80px" : "20px",
        }}
      >
        <div className="px-5 pt-6">
          {/* Title */}
          <h1
            className="text-[24px] font-bold leading-snug break-words mb-1"
            style={{ color: BRAND.textPrimary }}
          >
            {event.title}
          </h1>

          {/* Category meta */}
          <p className="text-[13px] mb-1" style={{ color: BRAND.textSecondary }}>
            {CATEGORY_SHORT_LABELS[categoryCode]}
            {event.subcategories?.[0] && ` · ${event.subcategories[0].name}`}
          </p>

          {/* Date */}
          {dateLabel && (
            <p
              className="text-[16px] font-semibold mb-6"
              style={{ color: BRAND.textPrimary }}
            >
              {dateLabel}
              {timeLabel && (
                <span style={{ color: BRAND.textSecondary, fontWeight: 400 }}>
                  {" "}
                  kl. {timeLabel}
                </span>
              )}
            </p>
          )}

          {/* Category & subcategory pills */}
          {(event.categories?.length > 0 || event.subcategories?.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {event.categories?.map((cat) => (
                <span
                  key={cat.code}
                  className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: tint, color }}
                >
                  {cat.name}
                </span>
              ))}
              {event.subcategories?.map((sub) => (
                <span
                  key={sub.code}
                  className="text-[10px] font-medium px-2.5 py-1 rounded-full border"
                  style={{ borderColor: BRAND.border, color: BRAND.textSecondary }}
                >
                  {sub.name}
                </span>
              ))}
            </div>
          )}

          {/* About section */}
          {event.description && (
            <div className="mb-6">
              <h2
                className="text-[20px] font-semibold mb-2"
                style={{ color: BRAND.textPrimary }}
              >
                Om evenemanget
              </h2>
              <p
                className="text-[15px] leading-relaxed break-words"
                style={{ color: BRAND.textBody }}
              >
                {event.description}
              </p>
            </div>
          )}

          {/* Organiser section */}
          {event.organiser && (
            <div className="mb-6">
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-1"
                style={{ color: BRAND.textSecondary }}
              >
                Arrangör
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: BRAND.neutral100 }}
                >
                  <User size={14} style={{ color: BRAND.textSecondary }} />
                </div>
                <p className="text-[15px]" style={{ color: BRAND.textBody }}>
                  {event.organiser}
                </p>
              </div>
            </div>
          )}

          {/* Location section */}
          {fullAddress && (
            <div className="mb-6">
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-1"
                style={{ color: BRAND.textSecondary }}
              >
                Plats
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: BRAND.neutral100 }}
                >
                  <MapPin size={14} style={{ color: BRAND.textSecondary }} />
                </div>
                <p className="text-[15px] break-words" style={{ color: BRAND.textBody }}>
                  {fullAddress}
                </p>
              </div>
            </div>
          )}

          {/* Schedule section */}
          {event.hasSchedule && event.scheduleStartTime && (
            <div className="mb-6">
              <p
                className="text-[11px] font-bold uppercase tracking-wider mb-1"
                style={{ color: BRAND.textSecondary }}
              >
                Tider
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-[28px] h-[28px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: BRAND.neutral100 }}
                >
                  <Clock size={14} style={{ color: BRAND.textSecondary }} />
                </div>
                <p className="text-[15px]" style={{ color: BRAND.textBody }}>
                  {event.scheduleStartTime.substring(0, 5)}
                  {event.scheduleEndTime && ` – ${event.scheduleEndTime.substring(0, 5)}`}
                  {event.recurrence && (
                    <span style={{ color: BRAND.textSecondary }}> ({event.recurrence})</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Source attribution */}
          <div
            className="pt-3 mt-2"
            style={{ borderTop: `1px solid ${BRAND.neutral200}` }}
          >
            <p className="text-[13px]" style={{ color: BRAND.textSecondary }}>
              Källa:{" "}
              {event.sourceProvider === "helsingborg"
                ? "Helsingborg Events API"
                : "Go.Do"}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA bar */}
      {hasCta && (
        <div
          className="absolute bottom-0 left-0 right-0 px-5 py-3 pb-5 z-20"
          style={{
            backgroundColor: BRAND.surface,
            boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <button
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[26px] text-[16px] font-semibold transition-all active:scale-[0.98] active:opacity-85"
            style={{
              backgroundColor: BRAND.yellow,
              color: BRAND.onPrimary,
              minHeight: "48px",
            }}
          >
            {event.bookingUrl && <ExternalLink size={16} />}
            {!event.bookingUrl && event.eventUrl && <ExternalLink size={16} />}
            {!event.bookingUrl && !event.eventUrl && fullAddress && <Navigation size={16} />}
            {ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}
