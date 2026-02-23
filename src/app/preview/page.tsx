"use client";

import { AppPreview } from "@/components/preview/AppPreview";
import { Navbar } from "@/components/global/Navbar";
import {
  CalendarDays,
  Layers,
  Smartphone,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function PreviewPage() {
  return (
    <main className="min-h-screen flex flex-col bg-yellow-400 text-black">
      <Navbar />

      <section className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 sm:px-10 py-10 lg:py-6">
        {/* Left: Marketing content */}
        <div className="w-full max-w-lg text-center lg:text-left">
          <div className="flex items-center gap-3 justify-center lg:justify-start mb-5">
            <Image
              src="/images/godologo.png"
              alt="Go.Do. logo"
              width={56}
              height={56}
            />
            <span className="text-3xl font-extrabold tracking-tight">
              Go.Do.
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Experience the app
          </h1>
          <p className="text-lg mb-8 leading-relaxed">
            Browse real events happening near you. Try the interactive preview
            — the same experience you&apos;ll get in the mobile app.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Feature
              icon={<Layers size={20} />}
              title="7 Categories"
              desc="From sports to culture"
            />
            <Feature
              icon={<CalendarDays size={20} />}
              title="Live Events"
              desc="Real-time data from API"
            />
            <Feature
              icon={<Zap size={20} />}
              title="Instant Filters"
              desc="Find what you love"
            />
            <Feature
              icon={<Smartphone size={20} />}
              title="Native Feel"
              desc="Just like the real app"
            />
          </div>

          {/* App store badges — full width, centered, larger */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="flex items-center justify-center gap-3 w-full sm:flex-1 px-5 py-3.5 bg-black text-white rounded-xl cursor-not-allowed">
              <svg width="24" height="28" viewBox="0 0 20 24" fill="currentColor" className="flex-shrink-0">
                <path d="M15.77 12.51c-.02-2.26 1.84-3.34 1.93-3.4-1.05-1.54-2.69-1.75-3.27-1.78-1.39-.14-2.72.82-3.43.82-.71 0-1.81-.8-2.97-.78-1.53.02-2.94.89-3.73 2.26-1.59 2.76-.41 6.85 1.14 9.09.76 1.1 1.66 2.33 2.84 2.28 1.14-.05 1.57-.73 2.95-.73s1.76.73 2.97.71c1.23-.02 2-1.12 2.75-2.22.87-1.27 1.22-2.5 1.24-2.57-.03-.01-2.39-.92-2.42-3.68z" />
                <path d="M13.46 5.63c.63-.76 1.05-1.82.93-2.88-.9.04-1.99.6-2.64 1.35-.58.67-1.08 1.74-.95 2.77 1.01.08 2.03-.51 2.66-1.24z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-none opacity-80">Coming soon on</div>
                <div className="text-[16px] font-semibold leading-tight">App Store</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 w-full sm:flex-1 px-5 py-3.5 bg-black text-white rounded-xl cursor-not-allowed">
              <svg width="22" height="24" viewBox="0 0 18 20" fill="currentColor" className="flex-shrink-0">
                <path d="M1.24 0.44l8.26 8.26 2.5-2.75L2.66 0.07C2.19-0.19 1.67-0.01 1.24 0.44z" />
                <path d="M0.62 1.22C0.54 1.46 0.5 1.73 0.5 2.02v15.96c0 0.29 0.04 0.56 0.12 0.8l8.38-8.38L0.62 1.22z" />
                <path d="M1.24 19.56c0.43 0.45 0.95 0.63 1.42 0.37L12 14.05l-2.5-2.75-8.26 8.26z" />
                <path d="M16.16 8.52l-2.84-1.59-2.72 2.99 2.72 2.72 2.84-1.59c0.8-0.45 0.8-1.18 0-1.53z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] leading-none opacity-80">Coming soon on</div>
                <div className="text-[16px] font-semibold leading-tight">Google Play</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Phone mockup */}
        <div className="flex-shrink-0">
          <AppPreview />
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 text-left">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-black/10">
        {icon}
      </div>
      <div>
        <p className="text-[13px] font-semibold">{title}</p>
        <p className="text-[11px] opacity-70">{desc}</p>
      </div>
    </div>
  );
}
