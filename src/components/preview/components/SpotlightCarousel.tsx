"use client";

/**
 * SpotlightCarousel — Auto-rotating spotlight at the top of the results screen.
 *
 * Ported from MobileApp/components/Carousel/SpotlightCarousel.tsx.
 * 160dp height · 4s auto-rotate (pausable) · yellow glow border · spotlight
 * badge · left color stripe · framer-motion crossfade.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Pause, Play } from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  GodoYellow,
  Neutral,
  Surface,
  Radii,
} from "../constants";

export interface SpotlightItem {
  id: string;
  title: string;
  date?: string;
  categoryCode?: number;
}

interface SpotlightCarouselProps {
  events: SpotlightItem[];
  onEventPress: (id: string) => void;
}

export function SpotlightCarousel({ events, onEventPress }: SpotlightCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % events.length);
  }, [events.length]);

  useEffect(() => {
    if (!isPlaying || events.length <= 1) return;
    intervalRef.current = setInterval(advance, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, events.length, advance]);

  if (events.length === 0) return null;
  const current = events[activeIndex];
  if (!current) return null;

  const code = current.categoryCode ?? 1;
  const gradient = CATEGORY_GRADIENTS[code] ?? ["#888", "#666"];
  const stripe = CATEGORY_COLORS[code] ?? "#374151";

  return (
    <div style={{ paddingLeft: 16, paddingRight: 16, marginTop: 4 }}>
      <div
        style={{
          position: "relative",
          borderRadius: Radii.card + 2,
          border: `2px solid ${GodoYellow[400]}`,
          boxShadow: `0 2px 10px ${GodoYellow[500]}66`,
          backgroundColor: "#000",
          overflow: "hidden",
          height: 160,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={() => onEventPress(current.id)}
            type="button"
            aria-label={`Spotlight: ${current.title}`}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: Radii.card,
              borderLeft: `5px solid ${stripe}`,
              border: "none",
              padding: 0,
              cursor: "pointer",
              overflow: "hidden",
              background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            }}
          >
            {/* Left color stripe */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 5,
                backgroundColor: stripe,
              }}
            />

            {/* Darkening gradient for text legibility */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))",
              }}
            />

            {/* Spotlight badge — top-left */}
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 14,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: GodoYellow[500],
                borderRadius: Radii.pill,
                padding: "3px 10px",
              }}
            >
              <Star size={10} color={Surface.onPrimary} fill={Surface.onPrimary} />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: Surface.onPrimary,
                }}
              >
                Spotlight
              </span>
            </div>

            {/* Bottom overlay with date + title */}
            <div
              style={{
                position: "absolute",
                left: 14,
                right: 14,
                bottom: 14,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "flex-start",
              }}
            >
              {current.date && (
                <span
                  style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: Radii.pill,
                    padding: "3px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: Neutral[800],
                  }}
                >
                  {current.date}
                </span>
              )}
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#FFFFFF",
                  textAlign: "left",
                  textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {current.title}
              </span>
            </div>
          </motion.button>
        </AnimatePresence>

        {/* Pause / play */}
        {events.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((p) => !p);
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{
              position: "absolute",
              bottom: 10,
              right: 14,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            {isPlaying ? (
              <Pause size={14} color="#FFFFFF" fill="#FFFFFF" />
            ) : (
              <Play size={14} color="#FFFFFF" fill="#FFFFFF" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
