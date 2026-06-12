"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { UnverifiedEmailBanner } from "@/components/global/UnverifiedEmailBanner";

export function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("accessToken"));
  }, []);
  const router = useRouter();

  // logout
  const onLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
    } catch {}
    try {
      const common = api.defaults.headers.common as Record<string, string | undefined>;
      delete common.Authorization;
    } catch {}
    setIsLoggedIn(false);
    router.replace("/login");
  };

  return (
    <>
      <header className="w-full bg-brand p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo + Text */}
          <Link href="/landing" className="flex items-center gap-3">
            <Image src="/images/godologo.png" alt="Logo" width={100} height={100} />
            <h1 className="text-xl font-semibold border-b-2 border-black inline-block">Go.Do.</h1>
          </Link>

          {/* Right: Search */}
          <div className="flex items-center gap-2">
            {showSearch ? (
              <div className="flex items-center gap-2 border rounded-md px-2 py-1 bg-white shadow-sm">
                <Input
                  placeholder="Sök..."
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

            {/* profile + logout buttons — only when logged in */}
            {isLoggedIn && (
              <Button variant="outline" size="sm" onClick={() => router.push("/profile")}>
                Profil
              </Button>
            )}
            {isLoggedIn && (
              <Button variant="outline" size="sm" onClick={onLogout}>
                Logga ut
              </Button>
            )}
          </div>
        </div>
      </header>
      <UnverifiedEmailBanner />
    </>
  );
}
