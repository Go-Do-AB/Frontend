"use client";

/**
 * LoginPromptModal — port of MobileApp/components/Auth/LoginPromptModal.tsx.
 *
 * Bottom-sheet shown when an unauthenticated user taps a gated action
 * (favourites, near-me, profile). Backdrop fades; sheet slides up with
 * framer-motion spring.
 */

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart } from "lucide-react";
import { GodoYellow, Neutral, Radii, Spacing, FontFamily } from "../constants";

interface LoginPromptModalProps {
  visible: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const SHEET_SPRING = { type: "spring" as const, damping: 24, stiffness: 240 };

export function LoginPromptModal({
  visible,
  onClose,
  onLogin,
  onRegister,
}: LoginPromptModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            fontFamily: FontFamily.body,
          }}
        >
          <motion.button
            type="button"
            aria-label="Stäng"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET_SPRING}
            style={{
              position: "relative",
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: Radii.sheet,
              borderTopRightRadius: Radii.sheet,
              paddingLeft: Spacing.screenPadding,
              paddingRight: Spacing.screenPadding,
              paddingTop: Spacing.lg,
              paddingBottom: 40,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Stäng"
              style={{
                position: "absolute",
                top: Spacing.md,
                right: Spacing.screenPadding,
                width: 44,
                height: 44,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={22} color={Neutral[500]} />
            </button>

            <div style={{ marginTop: 8, marginBottom: 4 }}>
              <Heart size={40} color={GodoYellow[500]} />
            </div>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                textAlign: "center",
                color: Neutral[800],
                margin: 0,
              }}
            >
              Spara dina favoriter
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: "22px",
                textAlign: "center",
                color: Neutral[600],
                marginBottom: 8,
                margin: 0,
              }}
            >
              Logga in för att spara evenemang du gillar och hålla koll på
              det som händer.
            </p>

            <motion.button
              type="button"
              onClick={onLogin}
              whileTap={{ scale: 0.97, opacity: 0.85 }}
              transition={{ type: "spring", damping: 18, stiffness: 320 }}
              style={{
                width: "100%",
                minHeight: 48,
                backgroundColor: "#1C1C1E",
                color: "#FFFFFF",
                borderRadius: Radii.button,
                border: "none",
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
              transition={{ type: "spring", damping: 18, stiffness: 320 }}
              style={{
                width: "100%",
                minHeight: 48,
                backgroundColor: GodoYellow[500],
                color: "#1A1A1A",
                borderRadius: Radii.button,
                border: "none",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: FontFamily.body,
              }}
            >
              Skapa konto
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
