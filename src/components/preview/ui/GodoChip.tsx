"use client";

import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { GodoYellow, Neutral, Surface, Radii } from "../constants";

type Variant = "default" | "filter";

interface GodoChipProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  icon?: ReactNode;
  /** Category color for subcategory chips — overrides default styling */
  categoryColor?: string;
  /** "default" = yellow when active | "filter" = outlined with checkmark */
  variant?: Variant;
}

export function GodoChip({
  label,
  active = false,
  disabled = false,
  onClick,
  onRemove,
  icon,
  categoryColor,
  variant = "default",
}: GodoChipProps) {
  const isFilter = variant === "filter";

  let chipStyle: React.CSSProperties = {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    padding: "0 14px",
    borderRadius: Radii.pill,
    gap: 6,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    fontSize: 14,
    fontWeight: 500,
    color: Neutral[700],
    backgroundColor: Neutral[100],
    transition: "background-color 120ms ease, border-color 120ms ease",
  };

  let labelColor: string = Neutral[700];
  let labelWeight: 500 | 600 = 500;

  if (isFilter) {
    chipStyle = {
      ...chipStyle,
      backgroundColor: active ? Neutral[200] : "#FFFFFF",
      border: `1.5px solid ${active ? Neutral[500] : Neutral[300]}`,
    };
    labelColor = active ? Neutral[800] : Neutral[600];
    labelWeight = active ? 600 : 500;
  } else if (categoryColor) {
    chipStyle = {
      ...chipStyle,
      backgroundColor: active ? categoryColor : "#FFFFFF",
      border: active ? "none" : `1.5px solid ${categoryColor}`,
    };
    labelColor = active ? "#FFFFFF" : categoryColor;
    labelWeight = 600;
  } else if (active) {
    chipStyle = { ...chipStyle, backgroundColor: GodoYellow[500] };
    labelColor = Surface.onPrimary;
  }

  return (
    <button
      type="button"
      style={chipStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={active}
    >
      {isFilter && active && <Check size={16} color={Neutral[800]} />}
      {icon}
      <span
        style={{
          color: labelColor,
          fontWeight: labelWeight,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
      {onRemove && active && (
        <span
          role="button"
          aria-label={`Remove ${label}`}
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onRemove();
            }
          }}
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: categoryColor ? "#FFFFFF" : labelColor,
            marginLeft: 2,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </span>
      )}
    </button>
  );
}
