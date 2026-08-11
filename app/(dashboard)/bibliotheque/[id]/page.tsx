import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SongDetailView } from "@/components/dashboard/detail/SongDetailView";
import { getSongById } from "@/lib/data/mock-dashboard";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const song = getSongById(params.id);
  return { title: song ? `${song.recipientFirstName} — Griot` : "Chanson introuvable — Griot" };
}

export default function SongDetailPage({ params }: { params: { id: string } }) {
  const song = getSongById(params.id);
  if (!song) notFound();

  return <SongDetailView song={song} />;
}
