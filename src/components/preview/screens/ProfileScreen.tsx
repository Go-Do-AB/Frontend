"use client";

/**
 * ProfileScreen — placeholder logged-out state.
 *
 * The full version (avatar with initials, saved/lists counts, language toggle,
 * subscription badge, lists shortcut, logout) lands in Phase 8. For Phase 6
 * this shows the empty state with login + register CTAs that drive the
 * LoginPromptModal infrastructure.
 */

import { motion } from "framer-motion";
import { User } from "lucide-react";
import {
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";

interface ProfileScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function ProfileScreen({ onLogin, onRegister }: ProfileScreenProps) {
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
        <User size={40} color={GodoYellow[600]} />
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
        Ditt konto
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
        Logga in eller skapa ett konto för att spara favoriter, skapa listor
        och få personliga tips.
      </p>

      <div
        style={{
          marginTop: Spacing.sm,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 280,
          gap: Spacing.sm,
        }}
      >
        <motion.button
          type="button"
          onClick={onLogin}
          whileTap={{ scale: 0.97, opacity: 0.85 }}
          transition={PRESS_SPRING}
          style={{
            minHeight: 48,
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
        <motion.button
          type="button"
          onClick={onRegister}
          whileTap={{ scale: 0.97, opacity: 0.85 }}
          transition={PRESS_SPRING}
          style={{
            minHeight: 48,
            backgroundColor: GodoYellow[500],
            color: "#1A1A1A",
            border: "none",
            borderRadius: Radii.button,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FontFamily.body,
          }}
        >
          Skapa konto
        </motion.button>
      </div>
    </div>
  );
}
