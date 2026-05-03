"use client";

/**
 * ListsScreen — port of MobileApp/app/lists.tsx.
 *
 * Premium-only feature. Header (back + add), list cards with name + count,
 * empty state, premium-gated state when not premium.
 */

import { motion } from "framer-motion";
import { ChevronLeft, Plus, List as ListIcon, ChevronRight, Trash2 } from "lucide-react";
import {
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";

export interface MockList {
  id: string;
  name: string;
  eventIds: string[];
}

interface ListsScreenProps {
  isPremium: boolean;
  lists: MockList[];
  onBack: () => void;
  onCreate: () => void;
  onSelectList: (id: string) => void;
  onDeleteList: (id: string) => void;
  onUpgrade: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function ListsScreen({
  isPremium,
  lists,
  onBack,
  onCreate,
  onSelectList,
  onDeleteList,
  onUpgrade,
}: ListsScreenProps) {
  if (!isPremium) {
    return (
      <div style={shellStyle}>
        <Header onBack={onBack} title="Mina listor" rightAction={null} />
        <div style={centerStyle}>
          <span style={{ fontSize: 40 }}>⭐</span>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: Neutral[800],
              margin: 0,
              marginTop: 8,
            }}
          >
            Listor är en Premium-funktion
          </h2>
          <p
            style={{
              fontSize: 14,
              color: Neutral[500],
              textAlign: "center",
              margin: 0,
              maxWidth: 260,
            }}
          >
            Uppgradera för att skapa egna listor av dina favoritevent.
          </p>
          <motion.button
            type="button"
            onClick={onUpgrade}
            whileTap={{ scale: 0.97, opacity: 0.85 }}
            transition={PRESS_SPRING}
            style={ctaButtonStyle}
          >
            Uppgradera
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div style={shellStyle}>
      <Header
        onBack={onBack}
        title="Mina listor"
        rightAction={
          <motion.button
            type="button"
            onClick={onCreate}
            aria-label="Skapa lista"
            whileTap={{ scale: 0.92 }}
            transition={PRESS_SPRING}
            style={iconButtonStyle}
          >
            <Plus size={26} color={Neutral[800]} />
          </motion.button>
        }
      />

      {lists.length === 0 ? (
        <div style={centerStyle}>
          <ListIcon size={56} color={Neutral[400]} />
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: Neutral[800],
              margin: 0,
              marginTop: 8,
            }}
          >
            Inga listor än
          </h2>
          <p
            style={{
              fontSize: 14,
              color: Neutral[500],
              textAlign: "center",
              margin: 0,
            }}
          >
            Skapa din första lista och samla evenemang som hör ihop.
          </p>
          <motion.button
            type="button"
            onClick={onCreate}
            whileTap={{ scale: 0.97, opacity: 0.85 }}
            transition={PRESS_SPRING}
            style={ctaButtonStyle}
          >
            Skapa lista
          </motion.button>
        </div>
      ) : (
        <div
          style={{
            paddingLeft: Spacing.screenPadding,
            paddingRight: Spacing.screenPadding,
            paddingBottom: 32,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onSelect={() => onSelectList(list.id)}
              onDelete={() => onDeleteList(list.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ListCard({
  list,
  onSelect,
  onDelete,
}: {
  list: MockList;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      style={{
        position: "relative",
        backgroundColor: Surface.surface,
        borderRadius: Radii.card,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <motion.button
        type="button"
        onClick={onSelect}
        whileTap={{ scale: 0.99, opacity: 0.85 }}
        transition={PRESS_SPRING}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          padding: 16,
          paddingRight: 56,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          fontFamily: FontFamily.body,
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: GodoYellow[100],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ListIcon size={20} color={GodoYellow[600]} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: Neutral[800],
              margin: 0,
            }}
          >
            {list.name}
          </p>
          <p
            style={{
              fontSize: 12,
              color: Neutral[500],
              margin: 0,
              marginTop: 2,
            }}
          >
            {list.eventIds.length} evenemang
          </p>
        </div>
        <ChevronRight size={18} color={Neutral[400]} />
      </motion.button>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Ta bort lista"
        style={{
          position: "absolute",
          top: 12,
          right: 36,
          width: 32,
          height: 32,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Trash2 size={16} color={Neutral[400]} />
      </button>
    </div>
  );
}

function Header({
  onBack,
  title,
  rightAction,
}: {
  onBack: () => void;
  title: string;
  rightAction: React.ReactNode | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: Spacing.screenPadding,
        paddingRight: Spacing.screenPadding,
        paddingTop: Spacing.md,
        paddingBottom: 12,
        gap: 8,
      }}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="Tillbaka"
        style={iconButtonStyle}
      >
        <ChevronLeft size={24} color={Neutral[800]} />
      </button>
      <h1
        style={{
          flex: 1,
          fontSize: 20,
          fontFamily: FontFamily.brand,
          fontWeight: 700,
          color: Neutral[900],
          margin: 0,
        }}
      >
        {title}
      </h1>
      {rightAction}
    </div>
  );
}

const shellStyle: React.CSSProperties = {
  minHeight: "100%",
  backgroundColor: Surface.background,
  fontFamily: FontFamily.body,
  display: "flex",
  flexDirection: "column",
};

const centerStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  padding: Spacing.screenPadding,
};

const iconButtonStyle: React.CSSProperties = {
  padding: 4,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const ctaButtonStyle: React.CSSProperties = {
  marginTop: 8,
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 12,
  paddingBottom: 12,
  backgroundColor: GodoYellow[500],
  color: "#1A1A1A",
  border: "none",
  borderRadius: Radii.pill,
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: FontFamily.body,
};
