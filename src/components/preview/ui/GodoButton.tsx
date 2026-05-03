"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  GodoYellow,
  Neutral,
  Surface,
  Radii,
  FontFamily,
} from "../constants";

type Variant = "primary" | "secondary" | "ghost";
type Size = "default" | "small";

interface GodoButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label: string;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  brandFont?: boolean;
}

const SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export const GodoButton = forwardRef<HTMLButtonElement, GodoButtonProps>(
  function GodoButton(
    {
      label,
      variant = "primary",
      size = "default",
      icon,
      brandFont = false,
      disabled,
      style,
      ...rest
    },
    ref,
  ) {
    const variantStyles: Record<Variant, React.CSSProperties> = {
      primary: {
        background: GodoYellow[500],
        color: Surface.onPrimary,
      },
      secondary: {
        background: "transparent",
        color: Neutral[800],
        border: `1.5px solid ${GodoYellow[500]}`,
      },
      ghost: {
        background: "transparent",
        color: Neutral[800],
      },
    };

    return (
      <motion.button
        ref={ref}
        whileTap={disabled ? undefined : { scale: 0.98, opacity: 0.85 }}
        transition={SPRING}
        disabled={disabled}
        style={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: size === "small" ? 40 : 48,
          padding: size === "small" ? "0 16px" : "0 24px",
          borderRadius: Radii.button,
          gap: 8,
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "22px",
          fontFamily: brandFont ? FontFamily.brand : FontFamily.body,
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          border: "none",
          ...variantStyles[variant],
          ...style,
        }}
        {...(rest as HTMLMotionProps<"button">)}
      >
        {icon}
        <span>{label}</span>
      </motion.button>
    );
  },
);
