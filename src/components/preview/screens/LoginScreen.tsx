"use client";

/**
 * LoginScreen — preview port of MobileApp/app/(auth)/login.tsx.
 *
 * Header (back arrow), title, email + password inputs, primary submit button,
 * "no account?" switch link, social login buttons. The form is non-functional
 * in the preview — submit just calls onClose to dismiss the auth route.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";
import { SocialLoginButtons } from "../components/SocialLoginButtons";

interface LoginScreenProps {
  onBack: () => void;
  onSwitchToRegister: () => void;
  onSuccess: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function LoginScreen({
  onBack,
  onSwitchToRegister,
  onSuccess,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: Surface.background,
        padding: Spacing.screenPadding,
        paddingTop: 32,
        fontFamily: FontFamily.body,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header — back button only (lang toggle lives on home for the preview) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: Spacing.lg,
        }}
      >
        <motion.button
          type="button"
          onClick={onBack}
          aria-label="Tillbaka"
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
          <ArrowLeft size={20} color={Neutral[800]} />
        </motion.button>
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 28,
          fontFamily: FontFamily.brand,
          fontWeight: 700,
          color: Neutral[900],
          marginBottom: Spacing.xl,
          marginTop: 0,
        }}
      >
        Logga in
      </h1>

      {/* Email */}
      <input
        type="email"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect="off"
        placeholder="E-post"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="E-post"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          backgroundColor: Surface.surface,
          color: Neutral[900],
          border: `1px solid ${Neutral[900]}`,
          borderRadius: Radii.input,
          marginBottom: 12,
          fontFamily: FontFamily.body,
          outline: "none",
        }}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Lösenord"
        style={{
          width: "100%",
          padding: 14,
          fontSize: 16,
          backgroundColor: Surface.surface,
          color: Neutral[900],
          border: `1px solid ${Neutral[900]}`,
          borderRadius: Radii.input,
          marginBottom: 12,
          fontFamily: FontFamily.body,
          outline: "none",
        }}
      />

      {/* Primary submit */}
      <motion.button
        type="button"
        onClick={canSubmit ? onSuccess : undefined}
        disabled={!canSubmit}
        whileTap={canSubmit ? { scale: 0.97, opacity: 0.85 } : undefined}
        transition={PRESS_SPRING}
        style={{
          width: "100%",
          padding: 16,
          marginTop: 8,
          backgroundColor: Neutral[900],
          color: Neutral[0],
          border: "none",
          borderRadius: Radii.button,
          fontSize: 16,
          fontFamily: FontFamily.brand,
          fontWeight: 700,
          opacity: canSubmit ? 1 : 0.5,
          cursor: canSubmit ? "pointer" : "not-allowed",
        }}
      >
        Logga in
      </motion.button>

      {/* Switch to register */}
      <button
        type="button"
        onClick={onSwitchToRegister}
        style={{
          alignSelf: "center",
          marginTop: 24,
          padding: 8,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontFamily: FontFamily.body,
          display: "flex",
          flexDirection: "row",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 14, color: Neutral[900] }}>
          Har du inget konto?
        </span>
        <span
          style={{
            fontSize: 14,
            color: "#2B8ED4",
            textDecoration: "underline",
          }}
        >
          Skapa konto
        </span>
      </button>

      {/* Social */}
      <SocialLoginButtons onApple={onSuccess} onGoogle={onSuccess} />

      {/* Brand spacer */}
      <div style={{ height: 24, color: GodoYellow[500] }} />
    </div>
  );
}
