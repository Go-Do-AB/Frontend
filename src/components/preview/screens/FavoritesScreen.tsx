"use client";

/**
 * FavoritesScreen — placeholder logged-out empty state.
 *
 * The full version (signed-in: list of saved events with swipe-to-remove,
 * upcoming/past sections, refresh) lands in Phase 8. For Phase 6 this just
 * shows the empty state with a CTA that opens the LoginPromptModal —
 * proving the modal-stack infrastructure works across tabs.
 */

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import {
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";

interface FavoritesScreenProps {
  onLoginPrompt: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function FavoritesScreen({ onLoginPrompt }: FavoritesScreenProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100%",
        padding: Spacing.lg,
        gap: Spacing.md,
        fontFamily: FontFamily.body,
        backgroundColor: Surface.background,
      }}
    >
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: Radii.pill,
          backgroundColor: GodoYellow[100],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Heart size={40} color={GodoYellow[600]} />
      </div>

      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: Neutral[800],
          textAlign: "center",
          margin: 0,
        }}
      >
        Sparade evenemang
      </h1>

      <p
        style={{
          fontSize: 15,
          lineHeight: "22px",
          color: Neutral[600],
          textAlign: "center",
          maxWidth: 280,
          margin: 0,
        }}
      >
        Logga in för att spara evenemang du gillar och hitta tillbaka till
        dem senare.
      </p>

      <motion.button
        type="button"
        onClick={onLoginPrompt}
        whileTap={{ scale: 0.97, opacity: 0.85 }}
        transition={PRESS_SPRING}
        style={{
          marginTop: Spacing.sm,
          minHeight: 48,
          paddingLeft: 32,
          paddingRight: 32,
          backgroundColor: Neutral[800],
          color: "#FFFFFF",
          border: "none",
          borderRadius: Radii.button,
          fontSize: 16,
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
