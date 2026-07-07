import Link from "next/link";
import { XCircle } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Betalning avbruten | Go.Do.",
};

// Stripe redirects here when the organiser aborts or cancels the Checkout.
// The page is public (no auth guard). Nothing has been charged.
export default function SpotlightCancelPage() {
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
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-semibold text-black">
                Betalningen avbröts
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-center">
              <p className="text-black">Inga pengar har dragits.</p>
              <p className="text-sm text-black/70">
                Du kan försöka igen när du vill — öppna ditt evenemang under Mina evenemang och
                klicka på Spotlight.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Link href="/my-events" className="w-full">
                <Button className="w-full bg-black text-white hover:bg-black/90">
                  Försök igen — Mina evenemang
                </Button>
              </Link>
              <Link href="/landing" className="w-full">
                <Button variant="outline" className="w-full">
                  Till startsidan
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </main>
  );
}
