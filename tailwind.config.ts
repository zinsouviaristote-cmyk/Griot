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
        // Nuances d'occasion — dérivées du violet de marque (déclinaisons de teinte
        // et de luminosité autour de #630ed4), jamais des couleurs indépendantes.
        // Mariage et réussite réutilisent brand-light / secondary, déjà dans la
        // famille ; ces trois-là sont propres à ce rôle.
        occasion: {
          anniversaire: "#a855f7",
          amour: "#c026d3",
          hommage: "#4a3b66",
        },
        page: "rgb(var(--color-page) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        // outline-variant à faible opacité, tel que prescrit — pas un token opaque.
        border: "rgb(var(--color-border) / 0.5)",
        ink: {
          DEFAULT: "rgb(var(--color-ink) / <alpha-value>)",
          // Plancher de contraste : jamais plus clair que ça (lisibilité plein soleil).
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
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
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.95) translateY(-4px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "toast-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-16px)" },
        },
        "field-in": {
          "0%": { opacity: "0", transform: "translateY(-4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Panneau "Paroles" d'Explorer : glisse depuis la droite sur desktop
        // (le contenu principal se recentre dans l'espace restant), depuis le
        // bas sur mobile (voir sheet-up) — jamais le même geste, l'un pousse,
        // l'autre recouvre.
        "panel-in": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "sheet-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "heart-pop": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        // Symétrique de heart-pop pour le retrait d'un like — se contracte
        // au lieu de grossir, jamais le même mouvement joué à l'envers.
        "heart-unpop": {
          "0%": { transform: "scale(1)" },
          "35%": { transform: "scale(0.75)" },
          "100%": { transform: "scale(1)" },
        },
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        // Écran de chargement à la marque : le trait ondulé du logo (voir Logo.tsx)
        // se dessine puis s'efface en boucle lente — `pathLength=1` sur le <path>
        // ramène sa longueur réelle à 1, donc ce dasharray/dashoffset marche pour
        // n'importe quel tracé sans mesurer sa longueur en pixels.
        "draw-wave": {
          "0%, 8%": { strokeDashoffset: "1" },
          "50%": { strokeDashoffset: "0" },
          "92%, 100%": { strokeDashoffset: "-1" },
        },
        // Transition entre écrans du tunnel : glissement horizontal léger, pas de
        // rebond (courbe magnetic déjà utilisée ailleurs, monotone, sans dépassement).
        "step-slide": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        // Pastilles d'occasion du héros de la landing : dérive très lente et
        // légère, désynchronisée d'une pastille à l'autre via une durée et un
        // délai différents posés en style inline, jamais deux fois le même
        // keyframe défini pour ça.
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        // Bandeau d'occasions qui défile en boucle infinie sous le héros — le
        // contenu est dupliqué une fois dans le JSX, ce keyframe ne fait que
        // glisser d'exactement une moitié de la largeur totale.
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // Attire l'œil sur le champ vide sans jamais désactiver le bouton — un
        // léger refus horizontal, pas un tremblement d'erreur bruyant.
        "attn-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(3px)" },
          "60%": { transform: "translateX(-2px)" },
          "80%": { transform: "translateX(2px)" },
        },
      },
      animation: {
        "reveal-up": "reveal-up 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "spin-slow": "spin-slow 6s linear infinite",
        breathe: "breathe 3.2s ease-in-out infinite",
        "toast-in": "toast-in 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "toast-out": "toast-out 0.2s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "pop-in": "pop-in 0.15s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "field-in": "field-in 0.2s ease-out both",
        "panel-in": "panel-in 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "sheet-up": "sheet-up 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "heart-pop": "heart-pop 0.35s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "heart-unpop": "heart-unpop 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "wave-bar": "wave-bar 0.9s ease-in-out infinite",
        "draw-wave": "draw-wave 2.8s ease-in-out infinite",
        "step-slide": "step-slide 0.25s ease-out both",
        "attn-shake": "attn-shake 0.4s ease-in-out both",
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
