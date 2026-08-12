import type { Metadata } from "next";
import { PublicationsPageBody } from "@/components/publications/PublicationsPageBody";
import { mockSongs } from "@/lib/data/mock-dashboard";

export const metadata: Metadata = {
  title: "Mes publications : Griot",
};

export default function PublicationsPage() {
  return <PublicationsPageBody songs={mockSongs} />;
}
