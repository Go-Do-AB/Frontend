"use client";

/**
 * RegisterScreen — preview port of MobileApp/app/(auth)/register.tsx.
 *
 * Header (back arrow), title + subtitle, email + password + confirm inputs,
 * primary submit button, social login buttons, "have account?" switch link.
 * Form is non-functional in the preview — submit dismisses the auth route
 * via onSuccess and shows a brief inline error if passwords don't match.
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  FontFamily,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";
import { SocialLoginButtons } from "../components/SocialLoginButtons";

interface RegisterScreenProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
  onSuccess: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function RegisterScreen({
  onBack,
  onSwitchToLogin,
  onSuccess,
}: RegisterScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (password !== confirmPassword) {
      setError("Lösenorden matchar inte");
      return;
    }
    setError(null);
    onSuccess();
  };

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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: Spacing.xl,
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

      {/* Title + subtitle */}
      <h1
        style={{
          fontSize: 28,
          fontFamily: FontFamily.brand,
          fontWeight: 700,
          color: Neutral[900],
          marginTop: -10,
          marginBottom: 8,
        }}
      >
        Skapa konto
      </h1>
      <p
        style={{
          fontSize: 15,
          color: Neutral[700],
          marginBottom: Spacing.xl,
          margin: 0,
          marginTop: 0,
        }}
      >
        Registrera dig för att spara favoriter, skapa listor och få notiser
        om dina favoritarrangörer.
      </p>

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
        style={inputStyle}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Lösenord"
        style={inputStyle}
      />

      {/* Confirm password */}
      <input
        type="password"
        placeholder="Bekräfta lösenord"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        aria-label="Bekräfta lösenord"
        style={inputStyle}
      />

      {error && (
        <p
          style={{
            fontSize: 14,
            color: "#EF4444",
            textAlign: "center",
            marginBottom: 12,
            marginTop: 0,
          }}
        >
          {error}
        </p>
      )}

      {/* Primary submit */}
      <motion.button
        type="button"
        onClick={handleSubmit}
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
        Skapa konto
      </motion.button>

      {/* Social */}
      <SocialLoginButtons onApple={onSuccess} onGoogle={onSuccess} />

      {/* Switch to login */}
      <button
        type="button"
        onClick={onSwitchToLogin}
        style={{
          alignSelf: "center",
          marginTop: 16,
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
          Har du redan ett konto?
        </span>
        <span
          style={{
            fontSize: 14,
            color: "#2B8ED4",
            textDecoration: "underline",
          }}
        >
          Logga in
        </span>
      </button>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
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
};
