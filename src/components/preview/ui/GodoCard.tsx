"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Surface, Radii, Shadows } from "../constants";

interface GodoCardProps extends HTMLAttributes<HTMLDivElement> {
  onPress?: () => void;
  noPadding?: boolean;
  children?: ReactNode;
}

const PRESS_SPRING = { type: "spring" as const, damping: 15, stiffness: 280 };

export const GodoCard = forwardRef<HTMLDivElement, GodoCardProps>(
  function GodoCard({ onPress, noPadding, style, children, ...rest }, ref) {
    const baseStyle: React.CSSProperties = {
      backgroundColor: Surface.surface,
      borderRadius: Radii.card,
      padding: noPadding ? 0 : 16,
      boxShadow: Shadows.md,
      ...style,
    };

    if (!onPress) {
      return (
        <div ref={ref} style={baseStyle} {...rest}>
          {children}
        </div>
      );
    }

    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        transition={PRESS_SPRING}
        onClick={onPress}
        style={{
          ...baseStyle,
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
          font: "inherit",
        }}
        {...(rest as HTMLMotionProps<"button">)}
      >
        {children}
      </motion.button>
    );
  },
);
