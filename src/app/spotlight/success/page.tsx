"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, CheckCircle } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Stripe redirects here after a completed Checkout with ?session_id=cs_...
// The page is public (no auth guard) — activation happens server-side via webhook.
function SpotlightSuccessInner() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="min-h-screen flex flex-col bg-brand text-black">
      <section className="flex flex-1 flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 px-4 sm:px-8 lg:px-16 py-10 lg:py-20">
        <div className="text-center lg:text-left shrink-0">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-2 lg:mb-4">Go.Do.</h2>
          <p className="text-lg sm:text-xl lg:text-2xl">More to do. Close to you.</p>
        </div>

        <div className="w-full max-w-md">
          <Card className="shadow-lg border-black/10 bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-black">
                Betalningen är mottagen
              </CardTitle>
              <p className="text-sm text-black/70 mt-2">Tack för ditt köp!</p>
            </CardHeader>

            <CardContent className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 text-black">
                <Sparkles className="h-4 w-4 text-[#F3C10E]" />
                <p>Din spotlight aktiveras inom någon minut.</p>
              </div>
              <p className="text-sm text-black/70">
                Vi bekräftar betalningen automatiskt i bakgrunden — du behöver inte göra något
                mer. Ett kvitto skickas från Stripe till din e-post.
              </p>
              {sessionId && (
                <p className="text-xs text-black/50 break-all">Referens: {sessionId}</p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Link href="/my-events" className="w-full">
                <Button className="w-full bg-black text-white hover:bg-black/90">
                  Till mina evenemang
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}

export default function SpotlightSuccessPage() {
  return (
    <React.Suspense fallback={null}>
      <SpotlightSuccessInner />
    </React.Suspense>
  );
}
