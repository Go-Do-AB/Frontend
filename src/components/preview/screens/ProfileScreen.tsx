"use client";

/**
 * ProfileScreen — port of MobileApp/app/(tabs)/profile.tsx.
 *
 * Renders the signed-in account card (avatar, email, three nav rows for
 * saved events / my lists / subscription, logout) when signed in. Falls
 * back to the empty state with login + register CTAs otherwise.
 */

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  List as ListIcon,
  Star,
  ChevronRight,
  Compass,
} from "lucide-react";
import {
  FontFamily,
  GodoYellow,
  Neutral,
  Radii,
  Spacing,
  Surface,
} from "../constants";

interface ProfileScreenProps {
  signedIn: boolean;
  user: { initials: string; email: string } | null;
  favoritesCount: number;
  listsCount: number;
  isPremium: boolean;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  onOpenSaved: () => void;
  onOpenLists: () => void;
  onOpenNearMe: () => void;
  onOpenSubscription: () => void;
}

const PRESS_SPRING = { type: "spring" as const, damping: 18, stiffness: 320 };

export function ProfileScreen({
  signedIn,
  user,
  favoritesCount,
  listsCount,
  isPremium,
  onLogin,
  onRegister,
  onLogout,
  onOpenSaved,
  onOpenLists,
  onOpenNearMe,
  onOpenSubscription,
}: ProfileScreenProps) {
  return (
    <div
      style={{
        minHeight: "100%",
        padding: Spacing.screenPadding,
        backgroundColor: Surface.background,
        fontFamily: FontFamily.body,
      }}
    >
      {/* Top row — back placeholder for visual symmetry */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Spacing.md,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            backgroundColor: Neutral[100],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft size={20} color={Neutral[800]} />
        </div>
      </div>

      {/* Hero title */}
      <h1
        style={{
          fontSize: 28,
          fontFamily: FontFamily.brand,
          fontWeight: 700,
          color: Neutral[900],
          marginTop: Spacing.md,
          marginBottom: Spacing.lg,
        }}
      >
        Profil
      </h1>

      {signedIn && user ? (
        <SignedInCard
          user={user}
          favoritesCount={favoritesCount}
          listsCount={listsCount}
          isPremium={isPremium}
          onOpenSaved={onOpenSaved}
          onOpenLists={onOpenLists}
          onOpenNearMe={onOpenNearMe}
          onOpenSubscription={onOpenSubscription}
          onLogout={onLogout}
        />
      ) : (
        <LoggedOutCard onLogin={onLogin} onRegister={onRegister} />
      )}
    </div>
  );
}

function SignedInCard({
  user,
  favoritesCount,
  listsCount,
  isPremium,
  onOpenSaved,
  onOpenLists,
  onOpenNearMe,
  onOpenSubscription,
  onLogout,
}: {
  user: { initials: string; email: string };
  favoritesCount: number;
  listsCount: number;
  isPremium: boolean;
  onOpenSaved: () => void;
  onOpenLists: () => void;
  onOpenNearMe: () => void;
  onOpenSubscription: () => void;
  onLogout: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: Surface.surface,
        borderRadius: Radii.card,
        padding: Spacing.lg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          backgroundColor: GodoYellow[500],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontFamily: FontFamily.brand,
            fontWeight: 700,
            color: "#2A2000",
          }}
        >
          {user.initials}
        </span>
      </div>

      <p
        style={{
          fontSize: 14,
          color: Neutral[800],
          marginBottom: Spacing.md,
          margin: 0,
          marginTop: 0,
        }}
      >
        {user.email}
      </p>

      <NavRow
        icon={
          <Heart
            size={20}
            color={Neutral[800]}
            fill={favoritesCount > 0 ? Neutral[800] : "transparent"}
          />
        }
        label="Sparade evenemang"
        right={
          favoritesCount > 0 ? (
            <CountPill value={favoritesCount} />
          ) : null
        }
        onClick={onOpenSaved}
      />

      <NavRow
        icon={<ListIcon size={20} color={Neutral[800]} />}
        label="Mina listor"
        right={
          listsCount > 0 ? (
            <CountPill value={listsCount} />
          ) : (
            <span style={{ fontSize: 12, color: Neutral[500] }}>Inga listor än</span>
          )
        }
        onClick={onOpenLists}
      />

      <NavRow
        icon={<Compass size={20} color={Neutral[800]} />}
        label="Nära mig"
        right={
          isPremium ? null : (
            <span style={{ fontSize: 11, fontWeight: 700, color: GodoYellow[700] }}>
              PREMIUM
            </span>
          )
        }
        onClick={onOpenNearMe}
      />

      <NavRow
        icon={<Star size={20} color={Neutral[800]} />}
        label="Prenumeration"
        right={
          <span
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 3,
              paddingBottom: 3,
              borderRadius: Radii.pill,
              backgroundColor: isPremium ? GodoYellow[500] : Neutral[200],
              color: isPremium ? "#2A2000" : Neutral[600],
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {isPremium ? "Premium" : "Gratis"}
          </span>
        }
        onClick={onOpenSubscription}
      />

      <motion.button
        type="button"
        onClick={onLogout}
        whileTap={{ scale: 0.97, opacity: 0.85 }}
        transition={PRESS_SPRING}
        style={{
          marginTop: 8,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 28,
          paddingRight: 28,
          background: "transparent",
          border: `1.5px solid #EF4444`,
          borderRadius: Radii.button,
          color: "#EF4444",
          fontSize: 15,
          fontFamily: FontFamily.brand,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Logga ut
      </motion.button>
    </div>
  );
}

function LoggedOutCard({
  onLogin,
  onRegister,
}: {
  onLogin: () => void;
  onRegister: () => void;
}) {
  return (
    <div
      style={{
        backgroundColor: Surface.surface,
        borderRadius: Radii.card,
        padding: Spacing.lg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: Spacing.sm,
      }}
    >
      <p
        style={{
          fontSize: 15,
          color: Neutral[700],
          textAlign: "center",
          margin: 0,
        }}
      >
        Logga in eller skapa ett konto för att spara favoriter, skapa listor
        och få personliga tips.
      </p>

      <motion.button
        type="button"
        onClick={onLogin}
        whileTap={{ scale: 0.97, opacity: 0.85 }}
        transition={PRESS_SPRING}
        style={{
          width: "100%",
          padding: 14,
          backgroundColor: Neutral[900],
          color: "#FFFFFF",
          border: "none",
          borderRadius: Radii.button,
          fontSize: 16,
          fontFamily: FontFamily.brand,
          fontWeight: 700,
          cursor: "pointer",
          marginTop: 4,
        }}
      >
        Logga in
      </motion.button>

      <button
        type="button"
        onClick={onRegister}
        style={{
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
        <span style={{ fontSize: 14, color: Neutral[800] }}>
          Har du inget konto?
        </span>
        <span
          style={{
            fontSize: 14,
            color: "#2B8ED4",
            textDecoration: "underline",
          }}
        >
          Skapa konto
        </span>
      </button>
    </div>
  );
}

function NavRow({
  icon,
  label,
  right,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  right: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.99, opacity: 0.85 }}
      transition={PRESS_SPRING}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingTop: 14,
        paddingBottom: 14,
        paddingLeft: 4,
        paddingRight: 4,
        background: "transparent",
        border: "none",
        borderTop: `1px solid ${Neutral[200]}`,
        borderBottom: `1px solid ${Neutral[200]}`,
        marginBottom: 12,
        cursor: "pointer",
        fontFamily: FontFamily.body,
      }}
    >
      {icon}
      <span
        style={{
          flex: 1,
          fontSize: 15,
          fontWeight: 500,
          color: Neutral[800],
          textAlign: "left",
        }}
      >
        {label}
      </span>
      {right}
      <ChevronRight size={18} color={Neutral[400]} />
    </motion.button>
  );
}

function CountPill({ value }: { value: number }) {
  return (
    <span
      style={{
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: Radii.pill,
        backgroundColor: Neutral[200],
        color: Neutral[600],
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {value}
    </span>
  );
}
