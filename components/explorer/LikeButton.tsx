"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { hasLiked, recordLike } from "@/lib/explorer/likes";

// Toujours rendu "non aimé" côté serveur — l'état réel (par appareil, via
// localStorage) ne peut être connu qu'après montage, sinon on risque un
// décalage d'hydratation entre le HTML serveur et le premier rendu client.
export function LikeButton({
  publishedSongId,
  likes,
  size = "md",
}: {
  publishedSongId: string;
  likes: number;
  size?: "sm" | "md";
}) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likes);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    // Le compteur de base ne reflète jamais le like de cet appareil (rien n'est
    // persisté hors localStorage) : sans ce +1, un rechargement montrerait un
    // cœur plein à côté d'un chiffre qui, lui, serait retombé.
    if (hasLiked(publishedSongId)) {
      setLiked(true);
      setCount(likes + 1);
    }
  }, [publishedSongId, likes]);

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (liked) return;
    if (!recordLike(publishedSongId)) return;
    setLiked(true);
    setCount((current) => current + 1);
    setPopping(true);
  }

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      onAnimationEnd={() => setPopping(false)}
      disabled={liked}
      aria-pressed={liked}
      aria-label={liked ? "Chanson aimée" : "Aimer cette chanson"}
      className={`flex min-h-11 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
        liked ? "text-brand" : "text-ink-muted hover:text-brand"
      } disabled:cursor-default`}
    >
      <Heart
        className={`${iconSize} ${popping ? "animate-heart-pop" : ""}`}
        strokeWidth={1.5}
        fill={liked ? "currentColor" : "none"}
        aria-hidden="true"
      />
      <span className="font-mono tabular-nums">{count}</span>
    </button>
  );
}
