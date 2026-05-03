"use client";

/**
 * SocialLoginButtons — preview port of MobileApp Apple/Google login buttons.
 *
 * Two dark pill buttons stacked beneath an "eller" divider. Web preview is
 * non-functional — the buttons just animate and call the click handler so
 * the visual matches the MobileApp design exactly.
 */

import { motion } from "framer-motion";
import { FontFamily, Neutral, Spacing } from "../constants";

interface SocialLoginButtonsProps {
  onApple?: () => void;
  onGoogle?: () => void;
  /** When true, only the Google button is shown (Apple is iOS-only in MobileApp). */
  hideApple?: boolean;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function SocialLoginButtons({
  onApple,
  onGoogle,
  hideApple = false,
}: SocialLoginButtonsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: Spacing.sm,
        marginTop: Spacing.sm,
        marginBottom: Spacing.sm,
      }}
    >
      {/* Divider with "eller" */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: Spacing.md,
          marginBottom: Spacing.md,
        }}
      >
        <div style={{ flex: 1, height: 1, backgroundColor: Neutral[300] }} />
        <span
          style={{
            marginLeft: Spacing.sm,
            marginRight: Spacing.sm,
            fontSize: 13,
            color: Neutral[600],
          }}
        >
          eller
        </span>
        <div style={{ flex: 1, height: 1, backgroundColor: Neutral[300] }} />
      </div>

      <SocialButton onClick={onGoogle} label="Fortsätt med Google">
        <GoogleMark />
      </SocialButton>

      {!hideApple && (
        <SocialButton onClick={onApple} label="Fortsätt med Apple">
          <AppleMark />
        </SocialButton>
      )}
    </div>
  );
}

function SocialButton({
  onClick,
  label,
  children,
}: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.97, opacity: 0.85 }}
      transition={PRESS_SPRING}
      style={{
        width: "100%",
        height: 50,
        borderRadius: 999,
        backgroundColor: Neutral[900],
        color: Neutral[100],
        border: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        fontSize: 15,
        fontFamily: FontFamily.brand,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {children}
      <span>{label}</span>
    </motion.button>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.71v2.26h2.9c1.7-1.57 2.69-3.88 2.69-6.61z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.46-.81 5.95-2.18l-2.9-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC04"
        d="M3.96 10.71A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="#FFFFFF" aria-hidden>
      <path d="M14.94 10.42c-.03-2.62 2.14-3.88 2.24-3.94-1.22-1.78-3.12-2.03-3.79-2.06-1.62-.16-3.16.95-3.98.95-.83 0-2.09-.93-3.43-.9-1.77.03-3.4 1.03-4.3 2.6-1.83 3.18-.47 7.88 1.32 10.46.87 1.27 1.91 2.69 3.27 2.64 1.32-.05 1.81-.85 3.4-.85 1.59 0 2.04.85 3.43.82 1.42-.02 2.32-1.29 3.18-2.56 1-1.46 1.42-2.88 1.44-2.95-.03-.01-2.76-1.06-2.78-4.21zM12.32 2.7c.73-.89 1.22-2.12.09-3.34-1.05.04-2.32.7-3.07 1.59-.67.78-1.27 2.04-.11 3.21 1.16.07 2.36-.6 3.09-1.46z" />
    </svg>
  );
}
