"use client";

/**
 * SubscriptionScreen — port of MobileApp/app/subscription.tsx.
 *
 * Header (back + title), current-plan card with PlanBadge, features list
 * card, and either "Manage subscription" button (Premium) or upgrade
 * area (Free).
 */

import { motion } from "framer-motion";
import {
  ChevronLeft,
  Check,
  ExternalLink,
  Star,
} from "lucide-react";
import {
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Shadows,
  Spacing,
  Surface,
} from "../constants";

interface SubscriptionScreenProps {
  isPremium: boolean;
  onBack: () => void;
  onUpgrade: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

const PREMIUM_FEATURES = [
  "Skapa egna listor av evenemang",
  "Få notiser om nya evenemang nära dig",
  "Lägg till evenemang i din kalender",
  "Hitta evenemang med Nära mig-radie",
  "Stöd den lokala scenens utveckling",
];

export function SubscriptionScreen({
  isPremium,
  onBack,
  onUpgrade,
}: SubscriptionScreenProps) {
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
          paddingTop: Spacing.sm,
          paddingBottom: Spacing.sm,
          borderBottom: `1px solid ${Neutral[200]}`,
          gap: Spacing.sm,
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
        <h1
          style={{
            fontSize: 24,
            fontFamily: FontFamily.brand,
            fontWeight: 700,
            color: Neutral[900],
            margin: 0,
          }}
        >
          Prenumeration
        </h1>
      </div>

      <div
        style={{
          padding: Spacing.screenPadding,
          display: "flex",
          flexDirection: "column",
          gap: Spacing.md,
        }}
      >
        {/* Current plan card */}
        <div
          style={{
            backgroundColor: Surface.surface,
            borderRadius: Radii.card,
            padding: Spacing.lg,
            boxShadow: Shadows.md,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: Neutral[500],
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: 0,
              marginBottom: 8,
            }}
          >
            Nuvarande plan
          </p>
          <PlanBadge isPremium={isPremium} />
          {isPremium && (
            <p
              style={{
                fontSize: 13,
                color: Neutral[600],
                margin: 0,
                marginTop: Spacing.xs,
              }}
            >
              Förnyas 12 augusti 2026
            </p>
          )}
        </div>

        {/* Features card */}
        <div
          style={{
            backgroundColor: Surface.surface,
            borderRadius: Radii.card,
            padding: Spacing.lg,
            boxShadow: Shadows.md,
          }}
        >
          <h2
            style={{
              fontSize: 16,
              fontFamily: FontFamily.brand,
              fontWeight: 700,
              color: Neutral[800],
              marginBottom: Spacing.sm,
              margin: 0,
            }}
          >
            Det här ingår i Premium
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: Spacing.sm,
            }}
          >
            {PREMIUM_FEATURES.map((feat) => (
              <li
                key={feat}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 999,
                    backgroundColor: GodoYellow[100],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check size={14} color={GodoYellow[700]} />
                </div>
                <span
                  style={{
                    fontSize: 14,
                    color: Neutral[700],
                    lineHeight: "20px",
                  }}
                >
                  {feat}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {isPremium ? (
          <motion.button
            type="button"
            onClick={onUpgrade}
            whileTap={{ scale: 0.97, opacity: 0.85 }}
            transition={PRESS_SPRING}
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              border: `1px solid ${Neutral[200]}`,
              backgroundColor: "transparent",
              borderRadius: Radii.button,
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: Spacing.lg,
              paddingRight: Spacing.lg,
              fontSize: 15,
              fontWeight: 500,
              color: Neutral[800],
              cursor: "pointer",
              fontFamily: FontFamily.body,
            }}
          >
            <span>Hantera prenumeration</span>
            <ExternalLink size={16} color={Neutral[500]} />
          </motion.button>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: Spacing.sm,
              paddingTop: Spacing.sm,
            }}
          >
            <p
              style={{
                fontSize: 18,
                fontFamily: FontFamily.brand,
                fontWeight: 700,
                color: Neutral[800],
                margin: 0,
              }}
            >
              Uppgradera till Premium
            </p>
            <p
              style={{
                fontSize: 14,
                color: Neutral[500],
                margin: 0,
              }}
            >
              49 kr / månad — avsluta när du vill
            </p>
            <motion.button
              type="button"
              onClick={onUpgrade}
              whileTap={{ scale: 0.97, opacity: 0.85 }}
              transition={PRESS_SPRING}
              style={{
                width: "100%",
                padding: 16,
                marginTop: 8,
                borderRadius: Radii.button,
                backgroundColor: GodoYellow[500],
                color: Surface.onPrimary,
                border: "none",
                fontSize: 16,
                fontFamily: FontFamily.brand,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Uppgradera
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanBadge({ isPremium }: { isPremium: boolean }) {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingLeft: 12,
        paddingRight: 14,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: isPremium ? GodoYellow[500] : Neutral[200],
        borderRadius: Radii.pill,
      }}
    >
      <Star
        size={16}
        color={isPremium ? "#2A2000" : Neutral[600]}
        fill={isPremium ? "#2A2000" : "transparent"}
      />
      <span
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: isPremium ? "#2A2000" : Neutral[700],
        }}
      >
        {isPremium ? "Premium" : "Gratis"}
      </span>
    </div>
  );
}
