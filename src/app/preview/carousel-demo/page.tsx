"use client";

/**
 * Phase 2 verification page — minimal harness to view the 3D carousel
 * in isolation. Will be removed in Phase 9 once Phase 3 wires the carousel
 * into the real /preview HomeScreen.
 */

import { useState } from "react";
import { PhoneFrame } from "@/components/preview/PhoneFrame";
import { CategoryCarousel3D } from "@/components/preview/components/CategoryCarousel3D";

export default function CarouselDemoPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [subs, setSubs] = useState<{ [k: number]: number[] }>({});
  const [everything, setEverything] = useState<{ [k: number]: boolean }>({});

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#1a1a1a",
      }}
    >
      <PhoneFrame>
        <div style={{ padding: "24px 12px", display: "flex", flexDirection: "column", gap: 16 }}>
          <h1
            style={{
              fontFamily: "var(--font-brand), Calibri, system-ui, sans-serif",
              fontSize: 22,
              fontWeight: 700,
              textAlign: "center",
              margin: 0,
              color: "#1C1C1E",
            }}
          >
            Go.Do.
          </h1>
          <p
            style={{
              textAlign: "center",
              margin: 0,
              fontSize: 15,
              color: "#3C3C43",
            }}
          >
            Vad vill du göra?
          </p>
          <CategoryCarousel3D
            expandedCategoryCode={expanded}
            selectedSubcategoryCodes={subs}
            selectedCategoryEverything={everything}
            showAll={showAll}
            onCenterPress={(code) =>
              setExpanded((prev) => (prev === code ? null : code))
            }
            onToggleShowAll={() => setShowAll((p) => !p)}
            onToggleSubcategory={(catCode, subCode) => {
              if (subCode === null) {
                setEverything((prev) => ({
                  ...prev,
                  [catCode]: !prev[catCode],
                }));
              } else {
                setSubs((prev) => {
                  const cur = prev[catCode] ?? [];
                  return {
                    ...prev,
                    [catCode]: cur.includes(subCode)
                      ? cur.filter((s) => s !== subCode)
                      : [...cur, subCode],
                  };
                });
              }
            }}
          />
        </div>
      </PhoneFrame>
    </main>
  );
}
