"use client";

/**
 * CreateListModal — bottom-sheet for naming a new user list.
 *
 * Animated drop-in matching the other preview modals. The submit button is
 * disabled until the list has a name.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListPlus } from "lucide-react";
import {
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";

interface CreateListModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

const SHEET_SPRING = { type: "spring" as const, damping: 24, stiffness: 240 };

// Inner sheet is a separate component so its useState resets cleanly each
// time the modal mounts (no effect-based reset needed).
function CreateListSheet({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const canSubmit = name.trim().length > 0;

  return (
    <>
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
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            backgroundColor: Neutral[200],
            marginBottom: Spacing.lg,
          }}
        />

        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: GodoYellow[100],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: Spacing.md,
          }}
        >
          <ListPlus size={28} color={Neutral[800]} />
        </div>

        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: Neutral[800],
            marginBottom: Spacing.md,
            textAlign: "center",
            margin: 0,
          }}
        >
          Skapa ny lista
        </h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Listnamn"
          autoFocus
          maxLength={40}
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            backgroundColor: Surface.surface,
            color: Neutral[900],
            border: `1px solid ${Neutral[300]}`,
            borderRadius: Radii.input,
            marginBottom: Spacing.md,
            outline: "none",
            fontFamily: FontFamily.body,
          }}
        />

        <motion.button
          type="button"
          onClick={() => {
            if (canSubmit) onCreate(name.trim());
          }}
          disabled={!canSubmit}
          whileTap={canSubmit ? { scale: 0.97, opacity: 0.85 } : undefined}
          transition={{ type: "spring", damping: 18, stiffness: 320 }}
          style={{
            width: "100%",
            minHeight: 48,
            backgroundColor: GodoYellow[500],
            color: Neutral[800],
            border: "none",
            borderRadius: Radii.card,
            fontSize: 15,
            fontWeight: 700,
            cursor: canSubmit ? "pointer" : "not-allowed",
            opacity: canSubmit ? 1 : 0.5,
            marginBottom: Spacing.sm,
            fontFamily: FontFamily.body,
          }}
        >
          Skapa lista
        </motion.button>

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
    </>
  );
}

export function CreateListModal({
  visible,
  onClose,
  onCreate,
}: CreateListModalProps) {
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
          <CreateListSheet onClose={onClose} onCreate={onCreate} />
        </div>
      )}
    </AnimatePresence>
  );
}
