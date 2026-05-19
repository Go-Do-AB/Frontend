import Link from "next/link";

/**
 * Site-wide footer with legal links.
 *
 * Kept intentionally small. The current site has no global footer; this is
 * the first one. Page authors should drop <Footer /> into any layout that
 * needs it. Mobile-app links are kept here so app-store listings can point
 * straight to /privacy.
 */
export function Footer() {
  return (
    <footer className="w-full border-t bg-white text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} Go.Do AB. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <span aria-hidden="true" className="text-gray-300">
            ·
          </span>
          <Link href="/sv/privacy" className="hover:underline">
            Integritetspolicy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
