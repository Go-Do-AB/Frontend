"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Zap, List, Smartphone } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsLoggedIn(true);

      // Check for Admin role in JWT claims
      // .NET puts roles in "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      // or just "role" depending on configuration
      const roles =
        payload.role ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
        [];

      // Roles can be a string (single role) or array (multiple roles)
      const roleArray = Array.isArray(roles) ? roles : [roles];
      setIsAdmin(roleArray.includes("Admin"));
    } catch {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 flex justify-between items-center bg-yellow-400 text-black px-10 py-20 relative">
        {/* Left: Brand */}
        <div>
          <h2 className="text-6xl font-extrabold mb-4">Go.Do.</h2>
          <p className="text-2xl">More to do. Close to you.</p>
        </div>

        {/* Right: Call to Action */}
        <div className="max-w-md text-right space-y-4">
          <p className="text-lg font-medium mb-4">
            Are you organizing an event? <br />
            Make it visible on <span className="font-bold">Go.Do.</span>
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/create-event">
              <Button
                variant="default"
                className="w-52 h-12 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
              >
                Create an Event
                <CalendarPlus className="mr-2 h-4 w-4" />
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/quick-create">
                <Button
                  variant="outline"
                  className="w-52 h-10 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg border-black/30 bg-white/50 hover:bg-white"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Add Place
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link href="/my-events">
                <Button
                  variant="outline"
                  className="w-52 h-10 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg border-black/30 bg-white/50 hover:bg-white"
                >
                  <List className="mr-2 h-4 w-4" />
                  My Events
                </Button>
              </Link>
            )}
          </div>
          <Link href="/preview">
              <Button
                variant="outline"
                className="w-52 h-10 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg border-black/30 bg-white/50 hover:bg-white"
              >
                <Smartphone className="mr-2 h-4 w-4" />
                Try the App
              </Button>
            </Link>
          {!isLoggedIn && (
            <p className="text-xs text-gray-600">
              <Link href="/login" className="underline">
                Log in
              </Link>{" "}
              to manage your events
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
