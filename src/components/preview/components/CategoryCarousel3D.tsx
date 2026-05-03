"use client";

/**
 * CategoryCarousel3D — Cover-flow 3D category picker.
 *
 * Ported from MobileApp/components/HomeSwipe/CategoryCarousel3D.tsx
 * (Reanimated → framer-motion). Geometry, transforms and spring config are
 * matched to the mobile original; gesture-driven drag with ring-modulus index.
 *
 * prefers-reduced-motion → flat horizontal-scroll fallback.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  animate,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import {
  Calendar,
  Trophy,
  Music,
  Palette,
  Compass,
  BookOpen,
  Heart,
  Smile,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  CATEGORIES,
  SHOW_ALL_CODE,
  getCategory,
  type CategoryDef,
} from "../categories";
import {
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  CATEGORY_TINTS,
  Neutral,
  Shadows,
} from "../constants";

// ── Geometry constants (mirror mobile) ──────────────────────────────
const CARD_WIDTH_RATIO = 0.42;       // 42% of carousel width
const CARD_HEIGHT_RATIO = 1.2;       // height = width × 1.2
const SIDE_OFFSET_RATIO = 0.72;      // adjacent card center offset
const FLAT_CARD_WIDTH_RATIO = 0.35;
const SWIPE_THRESHOLD_PX = 40;

const SPRING = { type: "spring" as const, damping: 18, stiffness: 150, mass: 0.8 };
const DROPDOWN_SPRING = { type: "spring" as const, damping: 20, stiffness: 200 };

const SHOW_ALL_CATEGORY: CategoryDef = {
  code: SHOW_ALL_CODE,
  label: "Visa allt",
  subcategories: [],
};

const CATEGORY_ICONS: Record<number, typeof Calendar> = {
  [SHOW_ALL_CODE]: LayoutGrid,
  1: Calendar,
  2: Trophy,
  3: Music,
  4: Palette,
  5: Compass,
  6: BookOpen,
  7: Heart,
  8: Smile,
};

// ── Public API ──────────────────────────────────────────────────────

export interface CategoryCarousel3DProps {
  expandedCategoryCode: number | null;
  selectedSubcategoryCodes: { [categoryCode: number]: number[] };
  selectedCategoryEverything: { [categoryCode: number]: boolean };
  showAll: boolean;
  onCenterPress: (categoryCode: number) => void;
  onToggleShowAll: () => void;
  onToggleSubcategory: (categoryCode: number, subcategoryCode: number | null) => void;
}

export function CategoryCarousel3D(props: CategoryCarousel3DProps) {
  const reduce = useReducedMotion();
  const [containerWidth, setContainerWidth] = useState(360);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > 0) setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {reduce ? (
        <FlatFallback {...props} containerWidth={containerWidth} />
      ) : (
        <Carousel3DInner {...props} containerWidth={containerWidth} />
      )}
    </div>
  );
}

// ── 3D inner ────────────────────────────────────────────────────────

interface InnerProps extends CategoryCarousel3DProps {
  containerWidth: number;
}

function Carousel3DInner({
  expandedCategoryCode,
  selectedSubcategoryCodes,
  selectedCategoryEverything,
  showAll,
  onCenterPress,
  onToggleShowAll,
  onToggleSubcategory,
  containerWidth,
}: InnerProps) {
  const allItems = useMemo(() => [SHOW_ALL_CATEGORY, ...CATEGORIES], []);
  const count = allItems.length;

  const cardWidth = containerWidth * CARD_WIDTH_RATIO;
  const cardHeight = cardWidth * CARD_HEIGHT_RATIO;
  const sideOffset = cardWidth * SIDE_OFFSET_RATIO;

  const activeIndex = useMotionValue(0);
  const dragOffset = useMotionValue(0);
  const lastSnappedIndex = useRef(0);

  const expandedCat = expandedCategoryCode != null ? getCategory(expandedCategoryCode) : null;

  const onSnap = useCallback(
    (newIndex: number) => {
      if (count === 0) return;
      const normalized = ((newIndex % count) + count) % count;
      if (normalized !== lastSnappedIndex.current) {
        lastSnappedIndex.current = normalized;
      }
    },
    [count],
  );

  const handleCardPress = useCallback(
    (code: number, cardIndex: number) => {
      const current = Math.round(activeIndex.get());
      const currentNorm = ((current % count) + count) % count;
      let diff = cardIndex - currentNorm;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;

      if (diff !== 0) {
        const newIndex = current + diff;
        animate(activeIndex, newIndex, SPRING);
        animate(dragOffset, 0, SPRING);
        lastSnappedIndex.current = ((newIndex % count) + count) % count;
        return;
      }

      // Already centered — fire the action
      if (code === SHOW_ALL_CODE) {
        onToggleShowAll();
      } else {
        onCenterPress(code);
      }
    },
    [activeIndex, dragOffset, count, onCenterPress, onToggleShowAll],
  );

  const navigate = useCallback(
    (direction: 1 | -1) => {
      const newIndex = Math.round(activeIndex.get()) + direction;
      animate(activeIndex, newIndex, SPRING);
      animate(dragOffset, 0, SPRING);
      onSnap(newIndex);
    },
    [activeIndex, dragOffset, onSnap],
  );

  const handlePan = useCallback(
    (_e: PointerEvent, info: PanInfo) => {
      dragOffset.set(info.offset.x);
    },
    [dragOffset],
  );

  const handlePanEnd = useCallback(
    (_e: PointerEvent, info: PanInfo) => {
      let newIndex = activeIndex.get();
      if (info.offset.x < -SWIPE_THRESHOLD_PX) newIndex += 1;
      else if (info.offset.x > SWIPE_THRESHOLD_PX) newIndex -= 1;
      else newIndex = Math.round(newIndex);

      animate(activeIndex, newIndex, SPRING);
      animate(dragOffset, 0, SPRING);
      onSnap(newIndex);
    },
    [activeIndex, dragOffset, onSnap],
  );

  // Subcategory dropdown height (mirror mobile: rows × 52 + 32)
  const subCount = expandedCat ? expandedCat.subcategories.length + 1 : 0;
  const rows = Math.ceil(subCount / 2);
  const targetHeight = expandedCat ? rows * 52 + 32 : 0;

  return (
    <div style={{ width: "100%", overflow: "visible", marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Föregående kategori"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 20,
          }}
        >
          <ChevronLeft size={24} color="#000000" />
        </button>

        <motion.div
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          style={{
            flex: 1,
            height: cardHeight,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            touchAction: "pan-y",
            cursor: "grab",
          }}
        >
          {allItems.map((cat, index) => (
            <CarouselCard3D
              key={cat.code}
              category={cat}
              index={index}
              count={count}
              activeIndex={activeIndex}
              dragOffset={dragOffset}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              sideOffset={sideOffset}
              isExpanded={expandedCategoryCode === cat.code}
              isShowAll={cat.code === SHOW_ALL_CODE}
              showAllActive={showAll}
              hasSelection={
                cat.code === SHOW_ALL_CODE
                  ? showAll
                  : (selectedSubcategoryCodes[cat.code]?.length ?? 0) > 0 ||
                    selectedCategoryEverything[cat.code] === true
              }
              onPress={() => handleCardPress(cat.code, index)}
            />
          ))}
        </motion.div>

        <button
          type="button"
          onClick={() => navigate(1)}
          aria-label="Nästa kategori"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            zIndex: 20,
          }}
        >
          <ChevronRight size={24} color="#000000" />
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{
          height: targetHeight,
          opacity: targetHeight > 60 ? 1 : targetHeight > 20 ? 0.5 : 0,
          marginTop: expandedCat ? 16 : 0,
        }}
        transition={DROPDOWN_SPRING}
        style={{
          width: "100%",
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: 8,
          overflow: "hidden",
        }}
      >
        {expandedCat && (
          <SubcategoryButtons
            expandedCat={expandedCat}
            selectedSubcategoryCodes={selectedSubcategoryCodes}
            selectedCategoryEverything={selectedCategoryEverything}
            onToggleSubcategory={onToggleSubcategory}
          />
        )}
      </motion.div>
    </div>
  );
}

// ── 3D Card ─────────────────────────────────────────────────────────

interface CarouselCard3DProps {
  category: CategoryDef;
  index: number;
  count: number;
  activeIndex: MotionValue<number>;
  dragOffset: MotionValue<number>;
  cardWidth: number;
  cardHeight: number;
  sideOffset: number;
  isExpanded: boolean;
  isShowAll: boolean;
  showAllActive: boolean;
  hasSelection: boolean;
  onPress: () => void;
}

function CarouselCard3D({
  category,
  index,
  count,
  activeIndex,
  dragOffset,
  cardWidth,
  cardHeight,
  sideOffset,
  isExpanded,
  isShowAll,
  showAllActive,
  hasSelection,
  onPress,
}: CarouselCard3DProps) {
  const Icon = CATEGORY_ICONS[category.code] ?? LayoutGrid;
  const dark = isShowAll ? Neutral[800] : (CATEGORY_COLORS[category.code] ?? "#374151");
  const gradient: [string, string] = isShowAll
    ? ["#FFFFFF", "#F5F2EB"]
    : (CATEGORY_GRADIENTS[category.code] ?? ["#888", "#666"]);
  const cardBg = isShowAll ? "#FFFFFF" : dark;
  const wrapperBg = isShowAll ? Neutral[200] : gradient[0];

  // Combined offset = ring-modulus(index - (activeIndex - dragOffset/(cardWidth*0.8)))
  const offset = useTransform([activeIndex, dragOffset], (vals) => {
    const av = vals[0] as number;
    const dv = vals[1] as number;
    const dragNormalized = dv / (cardWidth * 0.8);
    const continuous = av - dragNormalized;
    let off = index - continuous;
    return (((off % count) + count + count / 2) % count) - count / 2;
  });

  const translateX = useTransform(
    offset,
    [-1.5, -1, 0, 1, 1.5],
    [-sideOffset * 1.3, -sideOffset, 0, sideOffset, sideOffset * 1.3],
    { clamp: true },
  );
  const scale = useTransform(
    offset,
    [-1.5, -1, 0, 1, 1.5],
    [0.5, 0.7, 1, 0.7, 0.5],
    { clamp: true },
  );
  const rotateY = useTransform(offset, [-1, 0, 1], [35, 0, -35], { clamp: true });
  const opacity = useTransform(
    offset,
    [-1.8, -1.2, -0.8, 0, 0.8, 1.2, 1.8],
    [0, 0.4, 0.7, 1, 0.7, 0.4, 0],
    { clamp: true },
  );
  const visibility = useTransform(offset, (o) => (Math.abs(o) <= 1.8 ? "visible" : "hidden"));
  const zIndex = useTransform(offset, (o) => {
    const a = Math.abs(o);
    if (a < 0.5) return 10;
    if (a < 1.5) return 5;
    return 1;
  });

  const showAllSelected = isShowAll && showAllActive;

  return (
    <motion.div
      style={{
        position: "absolute",
        width: cardWidth,
        height: cardHeight,
        borderRadius: 20,
        padding: 2.5,
        border: `0.5px solid ${isShowAll ? Neutral[300] : "#000000"}`,
        backgroundColor: wrapperBg,
        translateX,
        scale,
        rotateY,
        perspective: 800,
        opacity,
        zIndex,
        visibility,
      }}
    >
      <button
        type="button"
        onClick={onPress}
        aria-label={category.label}
        aria-expanded={isExpanded}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 18,
          backgroundColor: cardBg,
          border: isShowAll
            ? `2px solid ${showAllSelected ? Neutral[800] : Neutral[300]}`
            : "none",
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          ...(showAllSelected ? { backgroundColor: Neutral[50] } : {}),
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isShowAll ? Neutral[100] : "rgba(255,255,255,0.15)",
            border: `1px solid ${isShowAll ? Neutral[300] : "rgba(255,255,255,0.25)"}`,
          }}
        >
          <Icon size={36} color={isShowAll ? Neutral[800] : "#FFFFFF"} />
        </div>
        <span
          style={{
            color: isShowAll ? Neutral[800] : "#FFFFFF",
            fontWeight: 700,
            fontSize: 15,
            lineHeight: "20px",
            textAlign: "center",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {category.label}
        </span>

        {hasSelection && !isExpanded && !isShowAll && (
          <SelectionBadge bg={gradient[1]} borderColor={gradient[0]} />
        )}
        {showAllSelected && <SelectionBadge bg={Neutral[800]} borderColor="#FFFFFF" />}
        {!isShowAll && isExpanded && (
          <div
            style={{
              position: "absolute",
              bottom: 6,
              left: 0,
              right: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ChevronDown size={18} color="rgba(255,255,255,0.8)" />
          </div>
        )}
      </button>
    </motion.div>
  );
}

function SelectionBadge({ bg, borderColor }: { bg: string; borderColor: string }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        border: `2px solid ${borderColor}`,
        zIndex: 2,
      }}
    >
      <Check size={14} color="#FFFFFF" strokeWidth={3} />
    </div>
  );
}

// ── Subcategory buttons (shared between 3D & flat) ──────────────────

function SubcategoryButtons({
  expandedCat,
  selectedSubcategoryCodes,
  selectedCategoryEverything,
  onToggleSubcategory,
}: {
  expandedCat: CategoryDef;
  selectedSubcategoryCodes: { [k: number]: number[] };
  selectedCategoryEverything: { [k: number]: boolean };
  onToggleSubcategory: (catCode: number, subCode: number | null) => void;
}) {
  const dark = CATEGORY_COLORS[expandedCat.code] ?? "#374151";
  const tint = CATEGORY_TINTS[expandedCat.code] ?? Neutral[50];

  const isSubSelected = (subCode: number | null) => {
    if (subCode === null) return selectedCategoryEverything[expandedCat.code] === true;
    return (selectedSubcategoryCodes[expandedCat.code] ?? []).includes(subCode);
  };

  const renderButton = (subCode: number | null, label: string, extraStyle?: React.CSSProperties) => {
    const selected = isSubSelected(subCode);
    return (
      <button
        type="button"
        key={subCode ?? "everything"}
        onClick={() => onToggleSubcategory(expandedCat.code, subCode)}
        aria-pressed={selected}
        style={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "10px 14px",
          borderRadius: 20,
          border: `${selected ? 2 : 1.5}px solid ${selected ? dark : dark + "40"}`,
          minHeight: 40,
          backgroundColor: tint,
          gap: 8,
          cursor: "pointer",
          ...extraStyle,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: dark,
            flexShrink: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
        {selected && (
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: dark,
              border: `1px solid ${dark}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={14} color="#FFFFFF" strokeWidth={3} />
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 5,
      }}
    >
      {expandedCat.subcategories.map((sub) => renderButton(sub.code, sub.label))}
      {renderButton(null, "Allt", { marginTop: 4 })}
    </div>
  );
}

// ── Reduce-motion fallback ──────────────────────────────────────────

function FlatFallback({
  expandedCategoryCode,
  selectedSubcategoryCodes,
  selectedCategoryEverything,
  showAll,
  onCenterPress,
  onToggleShowAll,
  onToggleSubcategory,
  containerWidth,
}: InnerProps) {
  const allItems = useMemo(() => [SHOW_ALL_CATEGORY, ...CATEGORIES], []);
  const flatCardWidth = containerWidth * FLAT_CARD_WIDTH_RATIO;
  const expandedCat = expandedCategoryCode != null ? getCategory(expandedCategoryCode) : null;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 12,
          padding: "0 12px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
      >
        {allItems.map((cat) => {
          const isShowAll = cat.code === SHOW_ALL_CODE;
          const Icon = CATEGORY_ICONS[cat.code] ?? LayoutGrid;
          const dark = isShowAll ? Neutral[800] : (CATEGORY_COLORS[cat.code] ?? "#374151");
          const gradient = isShowAll
            ? (["#FFFFFF", "#F5F2EB"] as [string, string])
            : (CATEGORY_GRADIENTS[cat.code] ?? ["#888", "#666"]);
          const isExpanded = expandedCategoryCode === cat.code;
          const hasSelection = isShowAll
            ? showAll
            : (selectedSubcategoryCodes[cat.code]?.length ?? 0) > 0 ||
              selectedCategoryEverything[cat.code] === true;

          return (
            <button
              type="button"
              key={cat.code}
              onClick={() => (isShowAll ? onToggleShowAll() : onCenterPress(cat.code))}
              aria-label={cat.label}
              aria-expanded={isExpanded}
              style={{
                position: "relative",
                width: flatCardWidth,
                height: flatCardWidth * 1.15,
                borderRadius: 18,
                backgroundColor: isShowAll ? "#FFFFFF" : gradient[1],
                border: isShowAll
                  ? `2px solid ${showAll ? Neutral[800] : Neutral[300]}`
                  : isExpanded
                    ? `2.5px solid ${gradient[0]}`
                    : "none",
                boxShadow: isExpanded ? Shadows.lg : Shadows.md,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "12px 10px",
                cursor: "pointer",
                scrollSnapAlign: "start",
                flex: "0 0 auto",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: dark + "30",
                }}
              >
                <Icon size={28} color={isShowAll ? Neutral[800] : "#FFFFFF"} />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: isShowAll ? Neutral[800] : "#FFFFFF",
                  textAlign: "center",
                  lineHeight: "18px",
                }}
              >
                {cat.label}
              </span>
              {hasSelection && !isExpanded && (
                <SelectionBadge
                  bg={isShowAll ? Neutral[800] : gradient[1]}
                  borderColor={isShowAll ? "#FFFFFF" : gradient[0]}
                />
              )}
            </button>
          );
        })}
      </div>

      {expandedCat && (
        <div style={{ marginTop: 12, padding: "0 8px" }}>
          <SubcategoryButtons
            expandedCat={expandedCat}
            selectedSubcategoryCodes={selectedSubcategoryCodes}
            selectedCategoryEverything={selectedCategoryEverything}
            onToggleSubcategory={onToggleSubcategory}
          />
        </div>
      )}
    </div>
  );
}

