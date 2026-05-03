"use client";

/**
 * CalendarConfirmModal — port of MobileApp/components/Events/CalendarConfirmModal.tsx.
 *
 * Bottom-sheet modal that confirms adding the event to the user's calendar.
 * Backdrop fades in; sheet slides up from bottom (framer-motion spring).
 */

import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
  FontFamily,
} from "../constants";

interface CalendarConfirmModalProps {
  visible: boolean;
  title: string;
  date: string;
  location?: string;
  onClose: () => void;
  onConfirm: () => void;
}

const SHEET_SPRING = { type: "spring" as const, damping: 24, stiffness: 240 };

export function CalendarConfirmModal({
  visible,
  title,
  date,
  location,
  onClose,
  onConfirm,
}: CalendarConfirmModalProps) {
  return (
    <AnimatePresence>
      {visible && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            fontFamily: FontFamily.body,
          }}
        >
          {/* Backdrop */}
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
              backgroundColor: "rgba(0,0,0,0.4)",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SHEET_SPRING}
            style={{
              position: "relative",
              backgroundColor: Surface.surface,
              borderTopLeftRadius: Radii.sheet,
              borderTopRightRadius: Radii.sheet,
              paddingLeft: Spacing.screenPadding,
              paddingRight: Spacing.screenPadding,
              paddingTop: 12,
              paddingBottom: 36,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Drag handle */}
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: Neutral[200],
                marginBottom: Spacing.lg,
              }}
            />

            {/* Icon */}
            <div style={{ marginBottom: Spacing.md }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: GodoYellow[100],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarIcon size={28} color={Neutral[800]} />
              </div>
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: Neutral[800],
                marginBottom: Spacing.md,
                textAlign: "center",
              }}
            >
              Lägg till i kalendern?
            </h2>

            {/* Details box */}
            <div
              style={{
                width: "100%",
                backgroundColor: Neutral[50],
                borderRadius: Radii.card,
                padding: Spacing.md,
                marginBottom: Spacing.lg,
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: Neutral[800],
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {title}
              </p>
              {date && (
                <p style={{ fontSize: 13, color: Neutral[500] }}>{date}</p>
              )}
              {location && (
                <p style={{ fontSize: 13, color: Neutral[500] }}>{location}</p>
              )}
            </div>

            {/* Confirm button */}
            <motion.button
              type="button"
              onClick={onConfirm}
              whileTap={{ scale: 0.97, opacity: 0.85 }}
              transition={{ type: "spring", damping: 18, stiffness: 320 }}
              style={{
                width: "100%",
                minHeight: 48,
                borderRadius: Radii.card,
                backgroundColor: GodoYellow[500],
                color: Neutral[800],
                border: "none",
                fontSize: 15,
                fontWeight: 700,
                marginBottom: Spacing.sm,
                cursor: "pointer",
                fontFamily: FontFamily.body,
              }}
            >
              Lägg till
            </motion.button>

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              style={{
                width: "100%",
                minHeight: 48,
                background: "transparent",
                border: "none",
                fontSize: 15,
                fontWeight: 600,
                color: Neutral[500],
                cursor: "pointer",
                fontFamily: FontFamily.body,
              }}
            >
              Avbryt
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
