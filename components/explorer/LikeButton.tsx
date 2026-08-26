"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { toggleSongLike } from "@/lib/supabase/dataAdapters";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// `initialLiked`/`likes` reflètent l'état réel en base au moment du
// chargement (voir song_likes, RPC toggle_song_like) — jamais localStorage :
// aimer une chanson est un geste d'un compte, pas d'un appareil.
export function LikeButton({
  publishedSongId,
  likes,
  initialLiked = false,
  size = "md",
}: {
  publishedSongId: string;
  likes: number;
  initialLiked?: boolean;
  size?: "sm" | "md";
}) {
  const { t } = useLanguage();
  const showToast = useToast();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likes);
  const [popping, setPopping] = useState(false);
  const [pending, setPending] = useState(false);

  // Réconciliation avec le like d'un⋅e autre utilisateur⋅rice sur cette même
  // chanson (voir l'abonnement Realtime sur published_songs dans
  // ExplorerFeed) — jamais pendant notre propre geste en attente, pour ne pas
  // écraser l'affichage optimiste avant que le serveur ait répondu.
  useEffect(() => {
    if (pending) return;
    setCount(likes);
  }, [likes, pending]);

  // Réversible : un second appui retire le like et décrémente le compteur —
  // symétrique dans les deux sens, jamais un geste à sens unique. Le geste
  // s'affiche instantanément (avant la réponse du serveur) puis se réconcilie
  // avec elle — et, pour tout autre spectateur de cette chanson, avec
  // l'événement Realtime sur published_songs (voir ExplorerFeed).
  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;
    const previousLiked = liked;
    const previousCount = count;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((current) => Math.max(0, current + (nextLiked ? 1 : -1)));
    setPopping(true);
    setPending(true);
    try {
      const result = await toggleSongLike(publishedSongId);
      setLiked(result.liked);
      setCount(result.likesCount);
    } catch (error) {
      setLiked(previousLiked);
      setCount(previousCount);
      showToast(error instanceof Error ? error.message : t("explorer.likeButton.like"), "danger");
    } finally {
      setPending(false);
    }
  }

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={handleClick}
      onAnimationEnd={() => setPopping(false)}
      aria-pressed={liked}
      aria-label={liked ? t("explorer.likeButton.liked") : t("explorer.likeButton.like")}
      className={`flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-150 ${
        liked ? "text-brand" : "text-ink-muted hover:text-brand"
      }`}
    >
      <Heart
        className={`${iconSize} ${popping ? (liked ? "animate-heart-pop" : "animate-heart-unpop") : ""}`}
        strokeWidth={1.5}
        fill={liked ? "currentColor" : "none"}
        aria-hidden="true"
      />
      <span className="font-mono tabular-nums">{count}</span>
    </button>
  );
}
