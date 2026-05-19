import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { PrivacyPolicyEn } from "@/components/legal/PrivacyPolicyEn";

export const metadata: Metadata = {
  title: "Privacy Policy | Go.Do",
  description:
    "How Go.Do AB collects, uses, and protects personal data for the Go.Do mobile app, organiser website, and backend.",
  alternates: {
    canonical: "/privacy",
    languages: {
      en: "/privacy",
      sv: "/sv/privacy",
    },
  },
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      draftBannerText="DRAFT — pending review by legal counsel before public launch."
      languageSwitch={{ label: "Svenska", href: "/sv/privacy" }}
      homeLabel="Back to Go.Do"
    >
      <PrivacyPolicyEn />
    </LegalLayout>
  );
}
