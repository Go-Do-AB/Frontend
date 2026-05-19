import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal/LegalLayout";
import { PrivacyPolicySv } from "@/components/legal/PrivacyPolicySv";

export const metadata: Metadata = {
  title: "Integritetspolicy | Go.Do",
  description:
    "Så samlar Go.Do AB in, använder och skyddar personuppgifter för Go.Do mobilapp, arrangörswebbplatsen och backend.",
  alternates: {
    canonical: "/sv/privacy",
    languages: {
      en: "/privacy",
      sv: "/sv/privacy",
    },
  },
};

export default function PrivacyPageSv() {
  return (
    <LegalLayout
      draftBannerText="UTKAST — väntar på granskning av juridiskt ombud före publik lansering."
      languageSwitch={{ label: "English", href: "/privacy" }}
      homeLabel="Tillbaka till Go.Do"
    >
      <PrivacyPolicySv />
    </LegalLayout>
  );
}
