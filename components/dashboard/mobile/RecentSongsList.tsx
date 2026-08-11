import { Music4 } from "lucide-react";
import { SongCardMobile } from "@/components/dashboard/SongCardMobile";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Song } from "@/lib/types";

export function RecentSongsList({ songs }: { songs: Song[] }) {
  if (songs.length === 0) {
    return (
      <EmptyState
        icon={Music4}
        title="Aucune chanson pour l'instant"
        description="Votre première chanson apparaîtra ici dès que vous l'aurez commencée. Ça prend deux minutes."
        actionLabel="Créer ma première chanson"
        actionHref="/creer"
      />
    );
  }

  return (
    <div>
      <SectionTitle>Chansons récentes</SectionTitle>
      <div className="mt-3 flex flex-col gap-3">
        {songs.map((song, index) => (
          <Reveal key={song.id} delayMs={index * 150}>
            <SongCardMobile song={song} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
