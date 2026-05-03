"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Surface, Radii } from "../constants";

const RAINBOW = [
  "#FF6B6B", // red
  "#FECA57", // yellow
  "#48DBFB", // cyan
  "#FF9FF3", // pink
  "#54A0FF", // blue
  "#5F27CD", // purple
  "#FF6B6B", // back to red — seamless loop
];

const POSITIONS = [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1];

interface RGBBorderCardProps extends HTMLAttributes<HTMLDivElement> {
  borderWidth?: number;
  children?: ReactNode;
}

export function RGBBorderCard({
  borderWidth = 2.5,
  style,
  children,
  ...rest
}: RGBBorderCardProps) {
  const reduce = useReducedMotion();

  const outerStyle: React.CSSProperties = {
    borderStyle: "solid",
    borderWidth,
    borderRadius: Radii.card + borderWidth,
    overflow: "hidden",
    ...style,
  };

  const innerStyle: React.CSSProperties = {
    backgroundColor: Surface.surface,
    borderRadius: Radii.card,
    overflow: "hidden",
  };

  if (reduce) {
    return (
      <div style={{ ...outerStyle, borderColor: "#FECA57" }} {...rest}>
        <div style={innerStyle}>{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      style={outerStyle}
      animate={{ borderColor: RAINBOW }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
        times: POSITIONS,
      }}
      {...(rest as React.ComponentProps<typeof motion.div>)}
    >
      <div style={innerStyle}>{children}</div>
    </motion.div>
  );
}
