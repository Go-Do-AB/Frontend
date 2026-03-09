"use client";

import {
  BRAND,
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
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
import { MOCK_EVENTS } from "../mockEvents";
import {
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
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
      <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ fontFamily: FontFamily.body }}>
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 48, height: 48, backgroundColor: Neutral[100] }}
        >
          <MapPin size={20} style={{ color: Neutral[500] }} />
        </div>
        <p style={{ fontSize: Typography.meta.size, color: Neutral[500] }}>
          Evenemanget hittades inte
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2"
          style={{
            fontSize: Typography.meta.size,
            fontWeight: 600,
            borderRadius: Radii.pill,
            backgroundColor: GodoYellow[500],
            color: Surface.onPrimary,
          }}
        >
          Gå tillbaka
        </button>
      </div>
    );
  }

  const categoryCode = event.categories?.[0]?.code ?? 1;
  const gradient = CATEGORY_GRADIENTS[categoryCode] ?? CATEGORY_GRADIENTS[1];

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
    <div className="relative flex flex-col" style={{ minHeight: "100%", fontFamily: FontFamily.body }}>
      {/* Hero section — 300px with category gradient */}
      <div className="relative" style={{ height: 300 }}>
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55))" }}
        />

        {/* Floating back, save & share buttons */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between pt-2 z-10" style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding }}>
          <button
            onClick={onBack}
            className="flex items-center justify-center rounded-full active:scale-95 transition-transform"
            style={{ width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.9)", boxShadow: Shadows.sm }}
          >
            <ArrowLeft size={22} style={{ color: Neutral[800] }} />
          </button>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center rounded-full active:scale-95 transition-transform"
              style={{ width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.9)", boxShadow: Shadows.sm }}
            >
              <Heart size={20} style={{ color: Neutral[800] }} />
            </button>
            <button
              className="flex items-center justify-center rounded-full active:scale-95 transition-transform"
              style={{ width: 40, height: 40, backgroundColor: "rgba(255,255,255,0.9)", boxShadow: Shadows.sm }}
            >
              <Share2 size={20} style={{ color: Neutral[800] }} />
            </button>
          </div>
        </div>

        {/* Category labels at bottom-left of hero */}
        <div className="absolute bottom-8 left-5 flex flex-wrap gap-1.5 z-10">
          {event.categories?.map((cat) => (
            <span
              key={cat.code}
              style={{ fontSize: Typography.meta.size, fontWeight: 600, color: "#FFFFFF", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* Content sheet — overlaps hero, rounded top (Radii.sheet = 24) */}
      <div
        className="relative flex-1"
        style={{
          backgroundColor: Surface.surface,
          borderTopLeftRadius: Radii.sheet,
          borderTopRightRadius: Radii.sheet,
          marginTop: -20,
          paddingBottom: hasCta ? 80 : 20,
        }}
      >
        <div style={{ paddingLeft: Spacing.screenPadding, paddingRight: Spacing.screenPadding, paddingTop: Spacing.lg }}>
          {/* Title */}
          <h1
            className="break-words mb-1"
            style={{
              fontSize: 24,
              fontWeight: 700,
              lineHeight: "30px",
              color: Neutral[800],
            }}
          >
            {event.title}
          </h1>

          {/* Category meta */}
          <p className="mb-1" style={{ fontSize: Typography.meta.size, color: Neutral[500] }}>
            {CATEGORY_SHORT_LABELS[categoryCode]}
            {event.subcategories?.[0] && ` · ${event.subcategories[0].name}`}
          </p>

          {/* Date */}
          {dateLabel && (
            <p className="mb-6" style={{ fontSize: Typography.cardTitle.size, fontWeight: 600, color: Neutral[800] }}>
              {dateLabel}
              {timeLabel && (
                <span style={{ color: Neutral[500], fontWeight: 400 }}> kl. {timeLabel}</span>
              )}
            </p>
          )}


          {/* About section */}
          {event.description && (
            <div className="mb-6">
              <h2 className="mb-2" style={{ fontSize: Typography.sectionTitle.size, fontWeight: Typography.sectionTitle.weight, color: Neutral[800] }}>
                Om evenemanget
              </h2>
              <p className="break-words" style={{ fontSize: Typography.body.size, lineHeight: `${Typography.body.lineHeight}px`, color: Neutral[700] }}>
                {event.description}
              </p>
            </div>
          )}

          {/* Organiser section */}
          {event.organiser && (
            <div className="mb-6">
              <p className="uppercase tracking-wider mb-1" style={{ fontSize: 11, fontWeight: 700, color: Neutral[500] }}>
                Arrangör
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 28, height: 28, backgroundColor: Neutral[100] }}
                >
                  <User size={14} style={{ color: Neutral[500] }} />
                </div>
                <p style={{ fontSize: Typography.body.size, color: Neutral[700] }}>{event.organiser}</p>
              </div>
            </div>
          )}

          {/* Location section */}
          {fullAddress && (
            <div className="mb-6">
              <p className="uppercase tracking-wider mb-1" style={{ fontSize: 11, fontWeight: 700, color: Neutral[500] }}>
                Plats
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 28, height: 28, backgroundColor: Neutral[100] }}
                >
                  <MapPin size={14} style={{ color: Neutral[500] }} />
                </div>
                <p className="break-words" style={{ fontSize: Typography.body.size, color: Neutral[700] }}>{fullAddress}</p>
              </div>
            </div>
          )}

          {/* Schedule section */}
          {event.hasSchedule && event.scheduleStartTime && (
            <div className="mb-6">
              <p className="uppercase tracking-wider mb-1" style={{ fontSize: 11, fontWeight: 700, color: Neutral[500] }}>
                Tider
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 28, height: 28, backgroundColor: Neutral[100] }}
                >
                  <Clock size={14} style={{ color: Neutral[500] }} />
                </div>
                <p style={{ fontSize: Typography.body.size, color: Neutral[700] }}>
                  {event.scheduleStartTime.substring(0, 5)}
                  {event.scheduleEndTime && ` – ${event.scheduleEndTime.substring(0, 5)}`}
                  {event.recurrence && (
                    <span style={{ color: Neutral[500] }}> ({event.recurrence})</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Source attribution */}
          <div className="pt-3 mt-2" style={{ borderTop: `1px solid ${Neutral[200]}` }}>
            <p style={{ fontSize: Typography.meta.size, color: Neutral[500] }}>
              Källa:{" "}
              {event.sourceProvider === "helsingborg" ? "Helsingborg Events API" : "Go.Do"}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA bar — matches GodoButton primary */}
      {hasCta && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20"
          style={{
            paddingLeft: Spacing.screenPadding,
            paddingRight: Spacing.screenPadding,
            paddingTop: 12,
            paddingBottom: Spacing.screenPadding,
            backgroundColor: Surface.surface,
            boxShadow: "0 -4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <button
            className="w-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] active:opacity-85"
            style={{
              minHeight: 48,
              borderRadius: Radii.button,
              backgroundColor: GodoYellow[500],
              color: Surface.onPrimary,
              fontSize: Typography.button.size,
              fontWeight: Typography.button.weight,
              fontFamily: FontFamily.body,
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
