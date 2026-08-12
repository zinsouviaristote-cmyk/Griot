import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Manrope } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import { PlayerProvider } from "@/lib/player/PlayerContext";
import { PersistentPlayerBar } from "@/components/player/PersistentPlayerBar";
import "./globals.css";

// Manrope porte les titres (600/700/800) — géométrique, architecturé.
// Hanken Grotesk porte le corps, les labels et les données — grande lisibilité,
// personnalité technique. Sous-ensemble latin uniquement, seules les graisses
// utilisées par l'échelle typographique (voir tailwind.config.ts, fontSize).
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Griot — vos histoires en chanson",
  description:
    "Racontez une histoire, écoutez l'extrait gratuitement, payez par Mobile Money pour recevoir la chanson complète.",
};

export const viewport: Viewport = {
  themeColor: "#f7f9fb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${manrope.variable} ${hankenGrotesk.variable}`}>
      <body className="font-sans">
        <ToastProvider>
          <PlayerProvider>
            {children}
            <PersistentPlayerBar />
          </PlayerProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
