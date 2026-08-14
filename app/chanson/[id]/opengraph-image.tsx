import { ImageResponse } from "next/og";
import { getPublishedSongById } from "@/lib/data/mock-explorer";
import { fr } from "@/lib/i18n/dictionaries/fr";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dégradés par occasion, en hex bruts — les mêmes teintes que OCCASION_GRADIENTS
// (lib/occasionTones.ts), mais Satori (moteur de ce générateur d'image) ne
// comprend pas les classes Tailwind : les valeurs doivent être répétées ici en
// clair, jamais recalculées différemment.
const OCCASION_GRADIENT_HEX: Record<string, [string, string]> = {
  anniversaire: ["#a855f7", "#7c3aed"],
  amour: ["#c026d3", "#630ed4"],
  mariage: ["#7c3aed", "#4b41e1"],
  reussite: ["#4b41e1", "#630ed4"],
  hommage: ["#4a3b66", "#191c1e"],
};

function displayName(entry: NonNullable<ReturnType<typeof getPublishedSongById>>): string {
  if (entry.publicTitle) return entry.publicTitle;
  if (!entry.hideFirstName) return entry.recipientFirstName;
  return fr.explorer.surpriseSong;
}

// Aperçu du lien (WhatsApp, iMessage…) — jamais un rectangle gris : l'image de
// la chanson si elle existe, sinon le même dégradé d'occasion que la pochette
// dans l'app, jamais une image cassée ou un fond neutre.
export default async function OpengraphImage({ params }: { params: { id: string } }) {
  const entry = getPublishedSongById(params.id);
  const [from, to] = OCCASION_GRADIENT_HEX[entry?.occasion ?? "anniversaire"];
  const name = entry ? displayName(entry) : "Griot";
  const occasionLabel = entry ? fr.catalog.occasions[entry.occasion].label : null;

  if (entry?.imageUrl) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={entry.imageUrl} width={1200} height={630} style={{ objectFit: "cover" }} alt="" />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 64,
              background: "linear-gradient(to top, rgba(25,28,30,0.85), rgba(25,28,30,0))",
            }}
          >
            <span style={{ fontSize: 56, fontWeight: 700, color: "white" }}>{name}</span>
            {occasionLabel && <span style={{ fontSize: 28, color: "rgba(255,255,255,0.8)", marginTop: 8 }}>{occasionLabel} · Griot</span>}
          </div>
        </div>
      ),
      size,
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: `linear-gradient(135deg, ${from}, ${to})`,
        }}
      >
        <span style={{ fontSize: 40, fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: 4, textTransform: "uppercase" }}>
          Griot
        </span>
        <span style={{ marginTop: 24, fontSize: 72, fontWeight: 700, color: "white" }}>{name}</span>
        {occasionLabel && <span style={{ marginTop: 16, fontSize: 32, color: "rgba(255,255,255,0.85)" }}>{occasionLabel}</span>}
      </div>
    ),
    size,
  );
}
