import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

// Fraunces porte uniquement les titres — deux graisses, un seul sous-ensemble latin.
// Le corps de texte reste sur la pile système (voir tailwind.config.ts, font-sans) :
// aucune police de corps ne traverse le réseau, l'essentiel du texte d'une page reste gratuit en Mo.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Griot — vos histoires en chanson",
  description:
    "Racontez une histoire, écoutez l'extrait gratuitement, payez par Mobile Money pour recevoir la chanson complète.",
};

export const viewport: Viewport = {
  themeColor: "#FDFCFB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={fraunces.variable}>
      <body>{children}</body>
    </html>
  );
}
