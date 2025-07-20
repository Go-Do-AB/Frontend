"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="w-full border-b bg-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo + Text */}
        <div className="flex items-center gap-3">
          <Image src="/images/godologo.png" alt="Logo" width={100} height={100} />
          <div>
            <h1 className="text-xl font-semibold border-b-2 border-black inline-block">Go.Do.</h1>
            <p className="text-sm italic text-gray-600">
              More to do. <span className="text-gray-500">Close to you.</span>
            </p>
          </div>
        </div>

        {/* Right: Search */}
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-white shadow-sm">
              <Input
                placeholder="Search..."
                className="w-48 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                onBlur={() => setShowSearch(false)}
                autoFocus
              />
              <Search className="w-4 h-4 text-gray-500" />
            </div>
          ) : (
            <Search
              className="w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          )}
        </div>
      </div>
    </header>
  );
}
