import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface ResilientChannelOptions<T> {
  channelName: string;
  table: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  filter?: string;

  // Reçoit directement la ligne après modification (`payload.new`) — cette
  // primitive ne sert, pour l'instant, qu'à réconcilier un état à partir de la
  // ligne courante (INSERT/UPDATE), jamais à réagir à une suppression.
  onChange: (row: T) => void;

  // Appelé dès que l'abonnement est confirmé, puis à chaque reconnexion
  // (erreur de canal, coupure réseau détectée via l'événement `online`) —
  // c'est ce qui rattrape un changement survenu pendant l'absence, avant que
  // le canal ne soit rétabli. Doit relire l'état exact depuis la base.
  onResync: () => void;
}

// Primitive partagée pour tout abonnement Realtime "un écran = un canal" :
// ouverture, reconnexion avec backoff sur erreur/timeout/fermeture, et
// resynchronisation explicite au retour du réseau (cible 3G, coupures
// fréquentes) — sans ce filet, un événement manqué pendant une coupure ne
// serait jamais rattrapé, l'écran resterait figé sur un état périmé.
export function createResilientChannel<T>(options: ResilientChannelOptions<T>): () => void {
  const supabase = createClient();
  let channel: RealtimeChannel | null = null;
  let reconnectTimer: number | null = null;
  let closed = false;

  function open() {
    if (closed) return;
    channel = supabase
      .channel(options.channelName)
      .on(
        "postgres_changes",
        {
          event: options.event ?? "*",
          schema: "public",
          table: options.table,
          filter: options.filter,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const row = payload.new as T | undefined;
          if (row && Object.keys(row).length > 0) options.onChange(row);
        },
      )
      .subscribe((status) => {
        if (closed) return;
        if (status === "SUBSCRIBED") {
          options.onResync();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
          scheduleReconnect();
        }
      });
  }

  function scheduleReconnect() {
    if (closed || reconnectTimer !== null) return;
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null;
      teardownChannel();
      open();
    }, 3000);
  }

  function handleOnline() {
    if (closed) return;
    options.onResync();
    teardownChannel();
    open();
  }

  function teardownChannel() {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
    if (reconnectTimer !== null) {
      window.clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  }

  window.addEventListener("online", handleOnline);
  open();

  return () => {
    closed = true;
    teardownChannel();
    window.removeEventListener("online", handleOnline);
  };
}
