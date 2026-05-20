import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moderation | GODO Admin",
};

export default function ModerationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
