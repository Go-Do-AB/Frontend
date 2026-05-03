"use client";

/**
 * ListDetailScreen — events inside a single user list.
 *
 * Header (back + list name + count), list of event cards (matches
 * FavoritesScreen card visual), empty state if list has no events yet.
 */

import { motion } from "framer-motion";
import { ChevronLeft, ListPlus } from "lucide-react";
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
import type { MockList } from "./ListsScreen";

interface ListDetailScreenProps {
  list: MockList;
  onBack: () => void;
  onSelectEvent: (id: string) => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function ListDetailScreen({
  list,
  onBack,
  onSelectEvent,
}: ListDetailScreenProps) {
  const events = MOCK_EVENTS.filter((e) => list.eventIds.includes(e.id));

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
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronLeft size={24} color={Neutral[800]} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: 20,
              fontFamily: FontFamily.brand,
              fontWeight: 700,
              color: Neutral[900],
              margin: 0,
            }}
          >
            {list.name}
          </h1>
          <p
            style={{
              fontSize: 12,
              color: Neutral[500],
              margin: 0,
              marginTop: 2,
            }}
          >
            {events.length} evenemang
          </p>
        </div>
      </div>

      {events.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
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
            <ListPlus size={32} color={GodoYellow[600]} />
          </div>
          <p
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: Neutral[800],
              margin: 0,
            }}
          >
            Listan är tom
          </p>
          <p
            style={{
              fontSize: 14,
              color: Neutral[500],
              textAlign: "center",
              maxWidth: 240,
              margin: 0,
            }}
          >
            Lägg till evenemang till listan från valfri eventsida.
          </p>
        </div>
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
          {events.map((event) => {
            const code = event.categories?.[0]?.code ?? 1;
            const stripe = CATEGORY_COLORS[code] ?? "#374151";
            const gradient =
              CATEGORY_GRADIENTS[code] ?? ["#888", "#666"];
            const dateLabel = event.startDate
              ? format(parseISO(event.startDate), "d MMM", { locale: sv })
              : "";

            return (
              <motion.button
                key={event.id}
                type="button"
                onClick={() => onSelectEvent(event.id)}
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
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
