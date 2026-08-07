import type { Config } from "tailwindcss";

// Système de tokens "Griot" — fond clair, une seule couleur de marque violette
// utilisée pleine (jamais en dégradé). La profondeur vient de l'écart entre
// `page` et `surface`, d'une bordure `border` de 1px et d'une ombre douce —
// jamais d'un halo flou coloré. Aucune couleur ne doit être codée en dur dans
// un composant : tout passe par ces tokens.
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
        brand: {
          DEFAULT: "#5A2D9C",
          vivid: "#7B3FE4",
          soft: "#F3EDFF",
        },
        page: "#FDFCFB",
        surface: "#FFFFFF",
        border: "#ECE8F2",
        ink: {
          DEFAULT: "#1A1523",
          muted: "#6B6478",
        },
        success: "#0E9F6E",
        warning: "#B45309",
        danger: "#DC2626",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: [
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
      // Un seul système de rayons pour toute l'application : `card`, partout où ce
      // n'est pas une pilule ou un cercle (badges, avatars, boutons ronds — rounded-full).
      borderRadius: {
        card: "1rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(26,21,35,0.04), 0 6px 16px -8px rgba(26,21,35,0.10)",
        "card-hover": "0 2px 4px rgba(26,21,35,0.05), 0 12px 28px -10px rgba(26,21,35,0.14)",
        "ring-focus": "0 0 0 3px rgba(123,63,228,0.18)",
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
      },
      animation: {
        "reveal-up": "reveal-up 0.5s cubic-bezier(0.25,0.46,0.45,0.94) both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "spin-slow": "spin-slow 6s linear infinite",
      },
      maxWidth: {
        shell: "1360px",
      },
      transitionTimingFunction: {
        magnetic: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};
export default config;
