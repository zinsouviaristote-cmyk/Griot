import type { Metadata } from "next";
import { ParametresPageBody } from "@/components/settings/ParametresPageBody";
import { mockSongs, mockUser } from "@/lib/data/mock-dashboard";
import { getMyPublishedSongs } from "@/lib/data/mock-explorer";

export const metadata: Metadata = {
  title: "Paramètres : Griot",
};

export default function ParametresPage() {
  return (
    <ParametresPageBody user={mockUser} songCount={mockSongs.length} publishedCount={getMyPublishedSongs().length} />
  );
}
