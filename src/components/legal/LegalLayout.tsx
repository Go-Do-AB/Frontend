import Link from "next/link";
import { DraftBanner } from "./DraftBanner";

interface LegalLayoutProps {
  draftBannerText: string;
  languageSwitch: {
    label: string;
    href: string;
  };
  homeLabel: string;
  children: React.ReactNode;
}

/**
 * Shared chrome for legal pages (privacy, terms, etc.).
 * Keeps the actual policy content (which is long) out of the layout file
 * so each component stays focused and easy to review.
 */
export function LegalLayout({
  draftBannerText,
  languageSwitch,
  homeLabel,
  children,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DraftBanner text={draftBannerText} />

      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between text-sm">
          <Link href="/landing" className="font-semibold text-gray-900 hover:underline">
            Go.Do.
          </Link>
          <div className="flex items-center gap-4">
            <Link href={languageSwitch.href} className="text-gray-700 hover:underline">
              {languageSwitch.label}
            </Link>
            <Link href="/landing" className="text-gray-700 hover:underline">
              {homeLabel}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <article className="prose prose-sm sm:prose-base max-w-none">{children}</article>
      </main>
    </div>
  );
}
