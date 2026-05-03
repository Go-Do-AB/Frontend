"use client";

/**
 * EventDetailScreen — port of MobileApp/app/event/[id].tsx.
 *
 * Layout: yellow hero (300dp) → floating top-row buttons (back + heart, calendar,
 * share) → subcategory label on hero bottom → rounded content sheet (overlaps hero
 * by 20dp) → title, date, tag chips, About/Organiser/Location/When sections →
 * inline action button row (Boka / Besök / Vägbeskrivning).
 *
 * NB: MobileApp does NOT use a sticky bottom CTA bar — actions live inline at the
 * end of the content sheet. The earlier preview had a sticky CTA; that's removed
 * here for parity with the current MobileApp design.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  CalendarPlus,
  Share2,
  Ticket,
  Navigation,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

import {
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
import { CalendarConfirmModal } from "../components/CalendarConfirmModal";

interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function EventDetailScreen({ eventId, onBack }: EventDetailScreenProps) {
  const event = MOCK_EVENTS.find((e) => e.id === eventId);
  const [favorited, setFavorited] = useState(false);
  const [showCalendarConfirm, setShowCalendarConfirm] = useState(false);

  if (!event) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-3"
        style={{ fontFamily: FontFamily.body }}
      >
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
            border: "none",
            cursor: "pointer",
          }}
        >
          Gå tillbaka
        </button>
      </div>
    );
  }

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

  const tagNames = (event.tags ?? []).map((t) => t.name).filter(Boolean);

  const subcategoryLabel = event.subcategories
    ?.map((s) => s.name)
    .filter(Boolean)
    .join(" · ");

  const dateAndTime = dateLabel
    ? timeLabel
      ? `${dateLabel} kl. ${timeLabel}`
      : dateLabel
    : "";

  const handleBook = () => {
    if (event.bookingUrl) {
      window.open(event.bookingUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleWebsite = () => {
    if (event.eventUrl) {
      window.open(event.eventUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDirections = () => {
    if (fullAddress) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleShare = async () => {
    if (typeof navigator === "undefined") return;
    const shareUrl = `https://godo-dev.nu/event/${event.id}`;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title: event.title, text: event.title, url: shareUrl });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      /* cancelled or denied */
    }
  };

  return (
    <div
      className="relative flex flex-col"
      style={{
        minHeight: "100%",
        fontFamily: FontFamily.body,
        backgroundColor: Surface.surface,
      }}
    >
      {/* ── Hero (300dp, yellow brand gradient) ─────────────────────── */}
      <div className="relative" style={{ height: 300 }}>
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${GodoYellow[500]}CC, ${GodoYellow[500]})`,
          }}
        />

        {/* Floating top row */}
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-between z-10"
          style={{
            paddingLeft: Spacing.screenPadding,
            paddingRight: Spacing.screenPadding,
            paddingTop: Spacing.sm,
          }}
        >
          <FloatingIconButton onClick={onBack} ariaLabel="Tillbaka">
            <ArrowLeft size={22} color={Neutral[800]} />
          </FloatingIconButton>

          <div className="flex items-center gap-2">
            <FloatingIconButton
              onClick={() => setFavorited((v) => !v)}
              ariaLabel={favorited ? "Ta bort favorit" : "Lägg till favorit"}
            >
              <Heart
                size={20}
                color={favorited ? "#E53E3E" : Neutral[800]}
                fill={favorited ? "#E53E3E" : "transparent"}
              />
            </FloatingIconButton>
            <FloatingIconButton
              onClick={() => setShowCalendarConfirm(true)}
              ariaLabel="Lägg till i kalendern"
            >
              <CalendarPlus size={20} color={Neutral[800]} />
            </FloatingIconButton>
            <FloatingIconButton onClick={handleShare} ariaLabel="Dela">
              <Share2 size={20} color={Neutral[800]} />
            </FloatingIconButton>
          </div>
        </div>

        {/* Subcategory label on hero bottom */}
        {subcategoryLabel && (
          <div
            className="absolute z-10"
            style={{
              left: Spacing.screenPadding,
              right: Spacing.screenPadding,
              bottom: 28,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#FFFFFF",
                textShadow: "0 1px 4px rgba(0,0,0,0.3)",
              }}
            >
              {subcategoryLabel}
            </span>
          </div>
        )}
      </div>

      {/* ── Content sheet ───────────────────────────────────────────── */}
      <div
        className="relative flex-1"
        style={{
          backgroundColor: Surface.surface,
          borderTopLeftRadius: Radii.sheet,
          borderTopRightRadius: Radii.sheet,
          marginTop: -20,
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          paddingTop: Spacing.lg,
          paddingBottom: Spacing.lg,
          minHeight: 400,
        }}
      >
        {/* Title */}
        <h1
          className="break-words"
          style={{
            fontSize: 24,
            fontWeight: 700,
            lineHeight: "30px",
            color: Neutral[800],
            marginBottom: 4,
          }}
        >
          {event.title}
        </h1>

        {/* Date + time */}
        {dateAndTime && (
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: Neutral[800],
              marginBottom: Spacing.sm,
            }}
          >
            {dateAndTime}
          </p>
        )}

        {/* Tag chips */}
        {tagNames.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: 6, marginBottom: Spacing.lg }}>
            {tagNames.map((name) => (
              <span
                key={`tag-${name}`}
                style={{
                  borderRadius: Radii.pill,
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: Neutral[100],
                  fontSize: 12,
                  fontWeight: 600,
                  color: Neutral[700],
                }}
              >
                {name}
              </span>
            ))}
          </div>
        )}

        {/* About */}
        {event.description && (
          <Section label="Om evenemanget" emphasized>
            <p
              className="break-words"
              style={{
                fontSize: 15,
                lineHeight: "22px",
                color: Neutral[700],
              }}
            >
              {event.description}
            </p>
          </Section>
        )}

        {/* Organiser */}
        {event.organiser && (
          <Section label="ARRANGÖR">
            <p style={{ fontSize: 15, lineHeight: "22px", color: Neutral[700] }}>
              {event.organiser}
            </p>
          </Section>
        )}

        {/* Location */}
        {fullAddress && (
          <Section label="PLATS">
            <p
              className="break-words"
              style={{ fontSize: 15, lineHeight: "22px", color: Neutral[700] }}
            >
              {fullAddress}
            </p>
          </Section>
        )}

        {/* When */}
        {dateAndTime && (
          <Section label="NÄR">
            <p style={{ fontSize: 15, lineHeight: "22px", color: Neutral[700] }}>
              {dateAndTime}
              {event.recurrence && (
                <span style={{ color: Neutral[500] }}> ({event.recurrence})</span>
              )}
            </p>
          </Section>
        )}

        {/* Action button row */}
        {(event.bookingUrl || event.eventUrl || fullAddress) && (
          <div
            className="flex"
            style={{ gap: 12, marginBottom: Spacing.lg, marginTop: Spacing.sm }}
          >
            {event.bookingUrl && (
              <ActionButton variant="primary" onClick={handleBook}>
                <Ticket size={18} color="#FFFFFF" />
                <span>Boka</span>
              </ActionButton>
            )}
            {event.eventUrl && (
              <ActionButton variant="yellow" onClick={handleWebsite}>
                <ExternalLink size={16} color={Surface.onPrimary} />
                <span>Besök webbplats</span>
              </ActionButton>
            )}
            {fullAddress && (
              <ActionButton variant="secondary" onClick={handleDirections}>
                <Navigation size={18} color={Neutral[800]} />
                <span>Vägbeskrivning</span>
              </ActionButton>
            )}
          </div>
        )}

        {/* Source attribution */}
        <div
          style={{
            paddingTop: 12,
            marginTop: Spacing.sm,
            borderTop: `1px solid ${Neutral[200]}`,
          }}
        >
          <p style={{ fontSize: Typography.meta.size, color: Neutral[500] }}>
            Källa:{" "}
            {event.sourceProvider === "helsingborg"
              ? "Helsingborg Events API"
              : "Go.Do"}
          </p>
        </div>
      </div>

      {/* ── Calendar confirm modal ──────────────────────────────────── */}
      <CalendarConfirmModal
        visible={showCalendarConfirm}
        title={event.title}
        date={dateAndTime}
        location={fullAddress || undefined}
        onClose={() => setShowCalendarConfirm(false)}
        onConfirm={() => setShowCalendarConfirm(false)}
      />
    </div>
  );
}

// ── Floating circular icon button (40×40) ──────────────────────────
function FloatingIconButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.92 }}
      transition={PRESS_SPRING}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.9)",
        boxShadow: Shadows.sm,
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 0,
      }}
    >
      {children}
    </motion.button>
  );
}

// ── Section with small label ───────────────────────────────────────
function Section({
  label,
  emphasized,
  children,
}: {
  label: string;
  emphasized?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: Spacing.lg }}>
      {emphasized ? (
        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: Neutral[800],
            marginBottom: 8,
          }}
        >
          {label}
        </h2>
      ) : (
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: Neutral[500],
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 4,
          }}
        >
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

// ── Action buttons ─────────────────────────────────────────────────
function ActionButton({
  variant,
  onClick,
  children,
}: {
  variant: "primary" | "yellow" | "secondary";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const isPrimary = variant === "primary";
  const isYellow = variant === "yellow";
  const bg = isPrimary
    ? Neutral[800]
    : isYellow
      ? GodoYellow[500]
      : "transparent";
  const color = isPrimary
    ? "#FFFFFF"
    : isYellow
      ? Surface.onPrimary
      : Neutral[800];
  const border = !isPrimary && !isYellow ? `1.5px solid ${Neutral[300]}` : "none";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97, opacity: 0.85 }}
      transition={PRESS_SPRING}
      style={{
        flex: 1,
        minHeight: 48,
        borderRadius: Radii.card,
        backgroundColor: bg,
        color,
        border,
        paddingLeft: 16,
        paddingRight: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        fontSize: 14,
        fontWeight: 600,
        fontFamily: FontFamily.body,
        cursor: "pointer",
      }}
    >
      {children}
    </motion.button>
  );
}
