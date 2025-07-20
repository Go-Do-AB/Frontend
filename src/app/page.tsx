import { Navbar } from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
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
        <div className="max-w-md text-right">
          <p className="text-lg font-medium mb-4">
            Are you organizing an event? <br />
            Make it visible on <span className="font-bold">Go.Do.</span>
          </p>
          <Link href="/create-event">
            <Button
              variant="default"
              className="w-52 h-12 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
            >
              Create an Event
              <CalendarPlus className="mr-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
