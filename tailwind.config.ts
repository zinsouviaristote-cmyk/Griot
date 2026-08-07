import type { Config } from "tailwindcss";

// Système de tokens "Griot" — repris du design system fourni (Luminous Harmonic),
// corrigé pour respecter les interdits du produit : un seul violet plein (jamais de
// dégradé), aucune translucidité ni flou d'arrière-plan sur les cartes, contraste
// texte relevé pour rester lisible en plein soleil sur un écran d'entrée de gamme.
// Aucune couleur, taille de police ou rayon ne doit être codé en dur dans un composant.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Un seul violet pour tous les boutons principaux et états actifs (aplat,
        // jamais de dégradé). `brand-light` est l'unique variante claire sanctionnée
        // par la palette — réservée à distinguer deux statuts, jamais utilisée sur un
        // bouton. `secondary` est l'indigo rare : 1 à 2 éléments dans toute l'app.
        brand: {
          DEFAULT: "#630ed4",
          light: "#7c3aed",
          soft: "#eaddff",
        },
        secondary: "#4b41e1",
        page: "#f7f9fb",
        surface: "#ffffff",
        // outline-variant à faible opacité, tel que prescrit — pas un token opaque.
        border: "rgba(204,195,216,0.5)",
        ink: {
          DEFAULT: "#191c1e",
          // Plancher de contraste : jamais plus clair que ça (lisibilité plein soleil).
          muted: "#4a4455",
        },
        success: "#0e9f6e",
        warning: "#b45309",
        danger: "#ba1a1a",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: [
          "var(--font-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      // Échelle typographique nommée du design system — utiliser ces classes
      // (text-headline-lg, text-body-md, …) plutôt que text-lg/text-2xl au hasard.
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      // Trois rayons, un par catégorie d'élément — jamais mélangés au hasard :
      // control = boutons & champs, card = cartes, feature = cartes principales.
      borderRadius: {
        control: "0.5rem",
        card: "1rem",
        feature: "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(25,28,30,0.04), 0 6px 16px -8px rgba(25,28,30,0.10)",
        "card-hover": "0 2px 4px rgba(25,28,30,0.05), 0 12px 28px -10px rgba(25,28,30,0.14)",
        "ring-focus": "0 0 0 3px rgba(99,14,212,0.18)",
      },
      keyframes: {
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        // Dérive du décor de fond (cordes) — amplitude de quelques pixels seulement.
        // Trois variantes pour désynchroniser les cordes entre elles, jamais le même
        // battement : ça se sentirait au lieu de se voir, ce qui est le but, mais un
        // mouvement synchronisé attirerait l'œil malgré tout.
        "drift-a": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(4px)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "drift-c": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(3px)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "spin-slow": "spin-slow 6s linear infinite",
        "drift-a": "drift-a 28s ease-in-out infinite",
        "drift-b": "drift-b 34s ease-in-out infinite",
        "drift-c": "drift-c 24s ease-in-out infinite",
      },
      maxWidth: {
        shell: "1440px",
      },
      transitionTimingFunction: {
        magnetic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};
export default config;
