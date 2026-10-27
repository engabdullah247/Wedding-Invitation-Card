import type { Metadata } from "next";
import { Closing } from "@/components/Closing";
import { EventDetails } from "@/components/EventDetails";
import { FamilyDetails } from "@/components/FamilyDetails";
import { Hero } from "@/components/Hero";
import { MusicButton } from "@/components/MusicButton";

export const metadata: Metadata = {
  alternates: { canonical: "/invitation" },
};

export default function InvitationPage() {
  return (
    <div className="invitation">
      <div className="invitation__music">
        <MusicButton />
      </div>
      <Hero />
      <main>
        <EventDetails />
        <FamilyDetails />
      </main>
      <Closing />
    </div>
  );
}
