"use client";

/**
 * TabBar — bottom navigation for the preview phone mockup.
 *
 * Mirrors MobileApp/app/(tabs)/_layout.tsx — three visible tabs (Home, Saved,
 * Profile). Active tab tinted GodoYellow[500]; inactive Neutral[500]. Press
 * uses a framer-motion scale spring to mirror Reanimated press feel.
 */

import { motion } from "framer-motion";
import { Home, Heart, User } from "lucide-react";
import { GodoYellow, Neutral, Surface, FontFamily } from "../constants";

export type Tab = "home" | "favorites" | "profile";

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  favoritesCount?: number;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function TabBar({ active, onChange, favoritesCount = 0 }: TabBarProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        backgroundColor: Surface.surface,
        borderTop: `1px solid ${Neutral[200]}`,
        paddingTop: 4,
        paddingBottom: 8,
        fontFamily: FontFamily.body,
      }}
    >
      <TabItem
        active={active === "home"}
        onClick={() => onChange("home")}
        icon={<Home size={22} />}
        label="Hem"
      />
      <TabItem
        active={active === "favorites"}
        onClick={() => onChange("favorites")}
        icon={
          <Heart
            size={22}
            fill={favoritesCount > 0 ? "currentColor" : "transparent"}
          />
        }
        label="Sparat"
      />
      <TabItem
        active={active === "profile"}
        onClick={() => onChange("profile")}
        icon={<User size={22} />}
        label="Profil"
      />
    </div>
  );
}

function TabItem({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const tint = active ? GodoYellow[500] : Neutral[500];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      transition={PRESS_SPRING}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "6px 0",
        color: tint,
      }}
    >
      {icon}
      <span style={{ fontSize: 11, fontWeight: 500, color: tint }}>
        {label}
      </span>
    </motion.button>
  );
}
