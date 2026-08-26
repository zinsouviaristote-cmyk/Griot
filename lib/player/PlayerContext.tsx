"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Occasion } from "@/lib/types";

// Un seul lecteur, un seul <audio> réel pour toute l'application — c'est ce qui
// garantit "un seul audio joue à la fois" sans coordination manuelle entre les
// pages. Monté une fois à la racine (voir app/layout.tsx) pour survivre à la
// navigation côté client : une page qui change ne démonte jamais ce provider.
export interface PlayerTrack {
  id: string;
  title: string;
  subtitle: string;
  occasion: Occasion;
  audioUrl: string;
  // Présents seulement si la piste correspond à une publication Explorer — c'est
  // ce qui décide si le cœur du lecteur est un vrai bouton "aimer" (avec compteur
  // public) ou une icône statique (rien à aimer tant que ce n'est pas publié).
  publishedId?: string;
  likes?: number;
  likedByMe?: boolean;
  // Pochette déjà résolue (voir resolveSongArt, lib/songArt.ts) — jamais
  // recalculée ici : `null`/absente veut dire "dégradé d'occasion".
  imageUrl?: string | null;
  // Marque une piste lancée DEPUIS Explorer — jamais posé sur une piste lancée
  // depuis la bibliothèque ou la fiche d'une chanson, même si celle-ci est par
  // ailleurs publiée. C'est ce qui permet de couper l'audio et de faire
  // disparaître le lecteur dès qu'on quitte Explorer (voir l'effet plus bas) :
  // une piste qui appartient à l'utilisateur, elle, a le droit de le suivre.
  origin?: "explorer";
}

interface PlayerState {
  current: PlayerTrack | null;
  queue: PlayerTrack[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  expanded: boolean;
  // Rejoue la même piste en boucle plutôt que d'avancer à la suivante — bouton
  // "répétition" du lecteur immersif d'Explorer (voir FeedScreen).
  repeatOne: boolean;
}

interface PlayerContextValue extends PlayerState {
  play: (track: PlayerTrack, queue?: PlayerTrack[]) => void;
  toggle: () => void;
  stop: () => void;
  seekTo: (fraction: number) => void;
  next: () => void;
  prev: () => void;
  setVolume: (volume: number) => void;
  setExpanded: (expanded: boolean) => void;
  toggleRepeatOne: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<PlayerState>({
    current: null,
    queue: [],
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    expanded: false,
    repeatOne: false,
  });
  // Miroir synchrone de `state`, lu par les actions ci-dessous — jamais un
  // `setState(s => ...)` porteur d'effet de bord (charger une source, appeler
  // `.play()`) : le mode strict de React invoque deux fois la fonction passée à
  // un setter pour vérifier sa pureté, ce qui double alors l'effet de bord lui-même
  // (deux `.play()` coup sur coup, l'un interrompant l'autre).
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    function onTimeUpdate() {
      if (!audio) return;
      setState((s) => ({ ...s, currentTime: audio.currentTime }));
    }
    function onLoadedMetadata() {
      if (!audio) return;
      setState((s) => ({ ...s, duration: audio.duration || 0 }));
    }
    function onPlay() {
      setState((s) => ({ ...s, isPlaying: true }));
    }
    function onPause() {
      setState((s) => ({ ...s, isPlaying: false }));
    }
    function onEnded() {
      const s = stateRef.current;
      if (s.repeatOne && audio) {
        audio.currentTime = 0;
        void audio.play();
        return;
      }
      const index = s.queue.findIndex((t) => t.id === s.current?.id);
      const nextTrack = index >= 0 ? s.queue[index + 1] : undefined;
      if (nextTrack && audio) {
        audio.src = nextTrack.audioUrl;
        audio.currentTime = 0;
        void audio.play();
        setState((prev) => ({ ...prev, current: nextTrack, currentTime: 0 }));
      } else {
        setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }));
      }
    }
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const play = useCallback((track: PlayerTrack, queue?: PlayerTrack[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextQueue = queue ?? [track];
    const s = stateRef.current;
    if (s.current?.id === track.id) {
      void audio.play();
      setState((prev) => ({ ...prev, queue: nextQueue }));
      return;
    }
    audio.src = track.audioUrl;
    audio.currentTime = 0;
    void audio.play();
    setState((prev) => ({ ...prev, current: track, queue: nextQueue, currentTime: 0, duration: 0 }));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !stateRef.current.current) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, []);

  // Coupe net et vide `current` — contrairement à une pause, le lecteur
  // persistant disparaît complètement (il se cache dès que `current` est nul).
  // Utilisé quand on quitte Explorer avec une piste d'Explorer en cours : rien
  // ne doit continuer à jouer, ni rester affiché, hors de la page.
  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setState((s) => ({ ...s, current: null, queue: [], isPlaying: false, currentTime: 0, duration: 0 }));
  }, []);

  const seekTo = useCallback((fraction: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = fraction * audio.duration;
    setState((s) => ({ ...s, currentTime: audio.currentTime }));
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    const audio = audioRef.current;
    if (!audio) return;
    const s = stateRef.current;
    const index = s.queue.findIndex((t) => t.id === s.current?.id);
    const target = s.queue[index + direction];
    if (!target) return;
    audio.src = target.audioUrl;
    audio.currentTime = 0;
    void audio.play();
    setState((prev) => ({ ...prev, current: target, currentTime: 0, duration: 0 }));
  }, []);

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => step(-1), [step]);

  const setVolume = useCallback((volume: number) => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
    setState((s) => ({ ...s, volume }));
  }, []);

  const setExpanded = useCallback((expanded: boolean) => {
    setState((s) => ({ ...s, expanded }));
  }, []);

  const toggleRepeatOne = useCallback(() => {
    setState((s) => ({ ...s, repeatOne: !s.repeatOne }));
  }, []);

  // La lecture d'Explorer est confinée à Explorer : dès que la route change et
  // que ce n'est plus "/explorer", une piste d'origine Explorer encore en
  // cours est coupée. Une piste de la bibliothèque/fiche chanson n'a pas ce
  // marqueur `origin` — elle n'est jamais concernée, elle suit l'utilisateur
  // partout, comme prévu.
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/explorer") return;
    if (stateRef.current.current?.origin === "explorer") stop();
  }, [pathname, stop]);

  const index = state.queue.findIndex((t) => t.id === state.current?.id);
  const hasNext = index >= 0 && index < state.queue.length - 1;
  const hasPrev = index > 0;

  const value = useMemo<PlayerContextValue>(
    () => ({
      ...state,
      play,
      toggle,
      stop,
      seekTo,
      next,
      prev,
      setVolume,
      setExpanded,
      toggleRepeatOne,
      hasNext,
      hasPrev,
    }),
    [state, play, toggle, stop, seekTo, next, prev, setVolume, setExpanded, toggleRepeatOne, hasNext, hasPrev],
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  );
}

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer doit être appelé sous PlayerProvider");
  return ctx;
}
