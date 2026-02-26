"use client";

import { BRAND } from "./constants";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex items-center justify-center">
      {/* Outer bezel */}
      <div
        className="relative rounded-[50px] p-3 shadow-2xl"
        style={{
          backgroundColor: "#1A1A1A",
          width: "min(420px, 90vw)",
          aspectRatio: "9 / 19.5",
        }}
      >
        {/* Dynamic island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[100px] h-[28px] bg-black rounded-full" />

        {/* Screen area */}
        <div
          className="relative w-full h-full rounded-[38px] overflow-hidden flex flex-col"
          style={{ backgroundColor: BRAND.background }}
        >
          {/* Status bar */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-6 pt-8 pb-1 text-[11px] font-semibold"
            style={{ color: BRAND.textBody }}
          >
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
                <rect x="0" y="7" width="3" height="4" rx="0.5" />
                <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
                <rect x="9" y="2" width="3" height="9" rx="0.5" />
                <rect x="13.5" y="0" width="3" height="11" rx="0.5" opacity="0.3" />
              </svg>
              <svg width="22" height="11" viewBox="0 0 22 11" fill="currentColor">
                <rect x="0" y="0" width="20" height="11" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                <rect x="1.5" y="1.5" width="14" height="8" rx="1" />
                <rect x="21" y="3" width="1.5" height="5" rx="0.5" />
              </svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {children}
          </div>

          {/* Home indicator */}
          <div className="flex-shrink-0 flex justify-center pb-2 pt-1">
            <div className="w-[120px] h-[4px] rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.15)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
