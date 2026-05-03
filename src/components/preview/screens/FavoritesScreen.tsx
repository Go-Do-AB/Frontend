"use client";

/**
 * FavoritesScreen — port of MobileApp/app/(tabs)/favorites.tsx.
 *
 * Signed-in: lists favourited events grouped into Upcoming + Past sections,
 * each row swipe-to-remove (visual via framer-motion drag with snap-back).
 * Logged out: empty state with login CTA.
 */

import { useMemo } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
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

interface FavoritesScreenProps {
  signedIn: boolean;
  favoriteIds: string[];
  onLoginPrompt: () => void;
  onRemove: (id: string) => void;
  onSelectEvent: (id: string) => void;
}

export function FavoritesScreen({
  signedIn,
  favoriteIds,
  onLoginPrompt,
  onRemove,
  onSelectEvent,
}: FavoritesScreenProps) {
  const events = useMemo(
    () => MOCK_EVENTS.filter((e) => favoriteIds.includes(e.id)),
    [favoriteIds],
  );

  const now = new Date();
  const upcoming = events.filter(
    (e) => !e.startDate || parseISO(e.startDate) >= now,
  );
  const past = events.filter(
    (e) => !!e.startDate && parseISO(e.startDate) < now,
  );

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
      {/* Top header */}
      <div
        style={{
          paddingLeft: Spacing.screenPadding,
          paddingRight: Spacing.screenPadding,
          paddingTop: Spacing.md,
          paddingBottom: Spacing.sm,
          display: "flex",
          flexDirection: "column",
          gap: Spacing.sm,
        }}
      >
        <h1
          style={{
            fontSize: 22,
            fontFamily: FontFamily.brand,
            fontWeight: 700,
            color: Neutral[900],
            margin: 0,
          }}
        >
          Sparade evenemang
        </h1>
      </div>

      {!signedIn ? (
        <LoggedOutEmpty onLoginPrompt={onLoginPrompt} />
      ) : events.length === 0 ? (
        <NoFavoritesEmpty />
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
          {upcoming.length > 0 && (
            <SectionHeader label="Kommande evenemang" />
          )}
          {upcoming.map((e) => (
            <SwipeCard
              key={e.id}
              event={e}
              onRemove={() => onRemove(e.id)}
              onSelect={() => onSelectEvent(e.id)}
            />
          ))}

          {past.length > 0 && <SectionHeader label="Tidigare evenemang" />}
          {past.map((e) => (
            <SwipeCard
              key={e.id}
              event={e}
              onRemove={() => onRemove(e.id)}
              onSelect={() => onSelectEvent(e.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        color: Neutral[700],
        textTransform: "uppercase",
        paddingTop: Spacing.md,
        paddingBottom: 6,
        margin: 0,
      }}
    >
      {label}
    </p>
  );
}

function SwipeCard({
  event,
  onRemove,
  onSelect,
}: {
  event: (typeof MOCK_EVENTS)[number];
  onRemove: () => void;
  onSelect: () => void;
}) {
  // framer-motion drag for swipe-to-remove visual
  const x = useMotionValue(0);
  const removeOpacity = useTransform(x, [-90, -30, 0], [1, 0.4, 0]);
  const cardBg = Surface.surface;

  const code = event.categories?.[0]?.code ?? 1;
  const stripe = CATEGORY_COLORS[code] ?? "#374151";
  const gradient = CATEGORY_GRADIENTS[code] ?? ["#888", "#666"];

  const dateLabel = event.startDate
    ? format(parseISO(event.startDate), "d MMM", { locale: sv })
    : "";

  return (
    <div style={{ position: "relative", height: 88 }}>
      {/* Underlay (red trash) revealed by swipe */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: Radii.card,
          backgroundColor: "#EF4444",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: 20,
          opacity: removeOpacity,
        }}
      >
        <Trash2 size={22} color="#FFFFFF" />
      </motion.div>

      {/* Foreground card */}
      <motion.button
        type="button"
        onClick={onSelect}
        drag="x"
        dragConstraints={{ left: -90, right: 0 }}
        dragElastic={0.1}
        style={{
          x,
          position: "absolute",
          inset: 0,
          backgroundColor: cardBg,
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
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) {
            // commit removal: animate off-screen then call onRemove
            animate(x, -360, { duration: 0.18 }).then(onRemove);
          } else {
            animate(x, 0, { type: "spring", damping: 24, stiffness: 280 });
          }
        }}
      >
        {/* Color stripe */}
        <div
          style={{
            width: 4,
            alignSelf: "stretch",
            borderRadius: 2,
            backgroundColor: stripe,
          }}
        />

        {/* Thumbnail (gradient placeholder) */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            flexShrink: 0,
          }}
        />

        {/* Text block */}
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
      </motion.button>
    </div>
  );
}

function NoFavoritesEmpty() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.sm,
        padding: Spacing.lg,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 999,
          backgroundColor: GodoYellow[100],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Heart size={36} color={GodoYellow[600]} />
      </div>
      <p
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: Neutral[800],
          margin: 0,
        }}
      >
        Inga sparade evenemang än
      </p>
      <p
        style={{
          fontSize: 14,
          color: Neutral[500],
          textAlign: "center",
          maxWidth: 260,
          margin: 0,
        }}
      >
        Tryck på hjärtat på ett evenemang för att spara det här.
      </p>
    </div>
  );
}

function LoggedOutEmpty({ onLoginPrompt }: { onLoginPrompt: () => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.sm,
        padding: Spacing.lg,
      }}
    >
      <Heart size={64} color={Neutral[400]} />
      <p
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: Neutral[900],
          margin: 0,
          marginTop: 8,
        }}
      >
        Sparade evenemang
      </p>
      <p
        style={{
          fontSize: 14,
          color: Neutral[700],
          textAlign: "center",
          margin: 0,
        }}
      >
        Logga in för att se dina sparade evenemang.
      </p>
      <motion.button
        type="button"
        onClick={onLoginPrompt}
        whileTap={{ scale: 0.97, opacity: 0.85 }}
        transition={{ type: "spring", damping: 18, stiffness: 320 }}
        style={{
          marginTop: 8,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 12,
          paddingBottom: 12,
          backgroundColor: GodoYellow[500],
          color: "#1A1A1A",
          border: "none",
          borderRadius: 24,
          fontSize: 15,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: FontFamily.body,
        }}
      >
        Logga in
      </motion.button>
    </div>
  );
}
