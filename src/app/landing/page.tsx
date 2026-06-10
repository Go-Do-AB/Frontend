"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/global/Navbar";
import { Footer } from "@/components/global/Footer";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Zap, List, Smartphone, Shield } from "lucide-react";
import Link from "next/link";
import { getStoredJwtPayload, getRolesFromPayload } from "@/lib/jwt";

function getInitialAuthState() {
  const payload = getStoredJwtPayload();
  if (!payload) return { isLoggedIn: false, isAdmin: false };

  const roles = getRolesFromPayload(payload);
  return { isLoggedIn: true, isAdmin: roles.includes("Admin") };
}

export default function Home() {
  const [{ isAdmin, isLoggedIn }, setAuthState] = useState({ isLoggedIn: false, isAdmin: false });

  useEffect(() => {
    setAuthState(getInitialAuthState());
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
            {isAdmin && (
              <Link href="/admin/moderation">
                <Button
                  variant="outline"
                  className="w-52 h-10 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg border-black/30 bg-white/50 hover:bg-white"
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Moderation
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

      <Footer />
    </main>
  );
}
