import type { Metadata } from "next";
import { ParametresPageBody } from "@/components/settings/ParametresPageBody";
import { mockSongs } from "@/lib/data/mock-dashboard";
import { getMyPublishedSongs } from "@/lib/data/mock-explorer";
import { fetchServerUserProfile } from "@/lib/supabase/serverDataAdapters";

export const metadata: Metadata = {
  title: "Paramètres : Griot",
};

export default async function ParametresPage() {
  const user = await fetchServerUserProfile();
  return <ParametresPageBody user={user} songCount={mockSongs.length} publishedCount={getMyPublishedSongs().length} />;
}
