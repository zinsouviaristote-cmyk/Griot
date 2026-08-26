import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPublicSongById } from "@/lib/supabase/publicAdapters";
import { TrackArt } from "@/components/player/TrackArt";
import { PublicSongAudioPlayer } from "@/components/player/PublicSongAudioPlayer";
import { Logo } from "@/components/ui/Logo";
import { fr } from "@/lib/i18n/dictionaries/fr";

// Page publique, sans compte requis — ce que reçoit qui que ce soit à qui le
// lien a été envoyé (WhatsApp, SMS…). Rendue en français uniquement (comme la
// landing) : aucune session, donc aucune langue d'interface à lire. La
// pochette (voir PublishedSong.imageUrl, déjà résolue au moment de la
// publication) sert aussi d'image d'aperçu du lien via opengraph-image.tsx,
// dans le même dossier.
function displayName(entry: NonNullable<Awaited<ReturnType<typeof fetchPublicSongById>>>): string {
  if (entry.publicTitle) return entry.publicTitle;
  if (!entry.hideFirstName) return entry.recipientFirstName;
  return fr.explorer.surpriseSong;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const entry = await fetchPublicSongById(params.id);
  if (!entry) return { title: "Griot" };
  const name = displayName(entry);
  const occasionLabel = fr.catalog.occasions[entry.occasion].label;
  return {
    title: `${name} — une chanson Griot`,
    description: `Une chanson pour ${occasionLabel.toLowerCase()}, offerte par ${entry.authorName} sur Griot.`,
  };
}

export default async function PublicSongPage({ params }: { params: { id: string } }) {
  const entry = await fetchPublicSongById(params.id);
  if (!entry) notFound();

  const name = displayName(entry);
  const occasionLabel = fr.catalog.occasions[entry.occasion].label;
  const styleLabel = fr.catalog.styles[entry.style].label;

  return (
    <div className="relative min-h-dvh overflow-hidden bg-page px-4 py-10">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <Logo />
        </Link>

        <div className="mt-8 w-full max-w-[240px]">
          <TrackArt occasion={entry.occasion} imageUrl={entry.imageUrl} className="aspect-square w-full rounded-feature shadow-card-hover" />
        </div>

        <p className="mt-6 font-display text-2xl font-bold text-ink">{name}</p>
        <p className="mt-1 text-sm text-ink-muted">
          {occasionLabel} · {styleLabel} · offerte par {entry.authorName}
        </p>

        <div className="mt-6 w-full rounded-feature border border-border bg-surface p-4 shadow-card">
          <PublicSongAudioPlayer publishedSongId={entry.id} audioUrl={entry.audioUrl} />
        </div>

        <Link
          href="/"
          className="mt-8 flex min-h-11 w-full items-center justify-center gap-2 rounded-control bg-brand px-5 text-sm font-semibold text-white transition-all duration-200 ease-magnetic hover:brightness-90 active:scale-[0.98]"
        >
          Créer ma propre chanson
        </Link>
      </div>
    </div>
  );
}
