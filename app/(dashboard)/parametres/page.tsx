import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/SettingsView";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal } from "@/components/ui/Reveal";
import { mockSongs, mockUser } from "@/lib/data/mock-dashboard";
import { getMyPublishedSongs } from "@/lib/data/mock-explorer";
import { mockConnectedDevices } from "@/lib/data/mock-devices";

export const metadata: Metadata = {
  title: "Paramètres — Griot",
};

export default function ParametresPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <SectionTitle as="h1" size="lg">
        Paramètres
      </SectionTitle>
      <p className="mt-2 text-body-md text-ink-muted">Votre compte, vos notifications, vos données.</p>

      <Reveal delayMs={80} className="mt-6">
        <SettingsView
          user={mockUser}
          songCount={mockSongs.length}
          publishedCount={getMyPublishedSongs().length}
          devices={mockConnectedDevices}
        />
      </Reveal>
    </div>
  );
}
