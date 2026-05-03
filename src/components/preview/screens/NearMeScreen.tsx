"use client";

/**
 * NearMeScreen — port of MobileApp/app/near-me.tsx.
 *
 * Premium-only feature. Header (back + map/list toggle), radius slider
 * (10-50km), distance-sorted event list with km badges, map placeholder.
 * Uses fake event distances seeded from mockEvents to demonstrate the
 * design without requiring real geolocation.
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Map as MapIcon, List as ListIcon, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import {
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";
import { MOCK_EVENTS } from "../mockEvents";

interface NearMeScreenProps {
  onBack: () => void;
  onSelectEvent: (id: string) => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

// Fake distances seeded from event index so the same event always appears
// at the same distance. Range 0.4–14.6 km — covers default 10km radius.
function fakeDistance(eventId: string): number {
  const n = parseInt(eventId.replace("mock-", ""), 10) || 0;
  return Math.round((((n * 7) % 30) + 4) * 0.5 * 10) / 10;
}

export function NearMeScreen({ onBack, onSelectEvent }: NearMeScreenProps) {
  const [radiusKm, setRadiusKm] = useState(10);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const eventsInRadius = useMemo(() => {
    return MOCK_EVENTS.map((e) => ({ event: e, dist: fakeDistance(e.id) }))
      .filter(({ dist }) => dist <= radiusKm)
      .sort((a, b) => a.dist - b.dist);
  }, [radiusKm]);

  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: Surface.background,
        fontFamily: FontFamily.body,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          paddingTop: Spacing.md,
          paddingBottom: 12,
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Tillbaka"
          style={{
            padding: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ChevronLeft size={24} color={Neutral[800]} />
        </button>
        <h1
          style={{
            flex: 1,
            fontSize: 20,
            fontFamily: FontFamily.brand,
            fontWeight: 700,
            color: Neutral[900],
            margin: 0,
          }}
        >
          Nära mig
        </h1>
        <motion.button
          type="button"
          onClick={() => setViewMode((v) => (v === "list" ? "map" : "list"))}
          aria-label={viewMode === "list" ? "Visa karta" : "Visa lista"}
          whileTap={{ scale: 0.92 }}
          transition={PRESS_SPRING}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            backgroundColor: Neutral[100],
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {viewMode === "list" ? (
            <MapIcon size={18} color={Neutral[800]} />
          ) : (
            <ListIcon size={18} color={Neutral[800]} />
          )}
        </motion.button>
      </div>

      {/* Radius slider */}
      <div
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          paddingBottom: Spacing.md,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: Neutral[700] }}>
            Radie
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: Neutral[900],
              fontFamily: FontFamily.brand,
            }}
          >
            {radiusKm} km
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={50}
          step={5}
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value))}
          aria-label="Sökradie i kilometer"
          style={{
            width: "100%",
            accentColor: GodoYellow[500],
          }}
        />
      </div>

      {viewMode === "map" ? (
        <MapPlaceholder
          radiusKm={radiusKm}
          eventCount={eventsInRadius.length}
        />
      ) : (
        <div
          style={{
            paddingLeft: Spacing.screenPadding,
            paddingRight: Spacing.screenPadding,
            paddingBottom: 32,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {eventsInRadius.length === 0 ? (
            <div
              style={{
                paddingTop: Spacing.xl,
                paddingBottom: Spacing.xl,
                textAlign: "center",
                color: Neutral[500],
                fontSize: 14,
              }}
            >
              Inga evenemang inom {radiusKm} km.
            </div>
          ) : (
            eventsInRadius.map(({ event, dist }) => (
              <NearMeCard
                key={event.id}
                event={event}
                distance={dist}
                onClick={() => onSelectEvent(event.id)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NearMeCard({
  event,
  distance,
  onClick,
}: {
  event: (typeof MOCK_EVENTS)[number];
  distance: number;
  onClick: () => void;
}) {
  const code = event.categories?.[0]?.code ?? 1;
  const stripe = CATEGORY_COLORS[code] ?? "#374151";
  const gradient = CATEGORY_GRADIENTS[code] ?? ["#888", "#666"];
  const dateLabel = event.startDate
    ? format(parseISO(event.startDate), "d MMM", { locale: sv })
    : "";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99, opacity: 0.85 }}
      transition={PRESS_SPRING}
      style={{
        width: "100%",
        backgroundColor: Surface.surface,
        border: "none",
        borderRadius: Radii.card,
        padding: 12,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: FontFamily.body,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 4,
          alignSelf: "stretch",
          borderRadius: 2,
          backgroundColor: stripe,
        }}
      />
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: Neutral[800],
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: Neutral[500],
            margin: 0,
            marginTop: 2,
          }}
        >
          {dateLabel} · {event.city}
        </p>
      </div>
      {/* Distance badge */}
      <span
        style={{
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 4,
          paddingBottom: 4,
          backgroundColor: GodoYellow[100],
          color: GodoYellow[800],
          borderRadius: Radii.pill,
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {distance} km
      </span>
    </motion.button>
  );
}

function MapPlaceholder({
  radiusKm,
  eventCount,
}: {
  radiusKm: number;
  eventCount: number;
}) {
  return (
    <div
      style={{
        marginLeft: Spacing.screenPadding,
        marginRight: Spacing.screenPadding,
        marginBottom: 32,
        flex: 1,
        minHeight: 320,
        borderRadius: Radii.card,
        background:
          "linear-gradient(135deg, #E0F2FE 0%, #FEF3C7 50%, #DCFCE7 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Concentric radius circles */}
      <div
        style={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: `2px dashed ${GodoYellow[500]}`,
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `2px dashed ${GodoYellow[600]}`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: `${GodoYellow[500]}33`,
          border: `2px solid ${GodoYellow[600]}`,
        }}
      />
      {/* Center pin (user) */}
      <MapPin size={28} color={GodoYellow[700]} fill={GodoYellow[500]} />
      {/* Counter overlay */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          paddingLeft: 12,
          paddingRight: 12,
          paddingTop: 6,
          paddingBottom: 6,
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: Radii.pill,
          fontSize: 12,
          fontWeight: 700,
          color: Neutral[800],
        }}
      >
        {eventCount} evenemang inom {radiusKm} km
      </div>
    </div>
  );
}
