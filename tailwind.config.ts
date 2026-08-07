import type { Config } from "tailwindcss";

// Système de tokens "Griot" — un studio d'écriture ouest-africain traduit en interface.
// Fond aubergine profond, accent magenta (le geste), accent or (la voix, la chaleur).
// Aucune valeur de couleur ou de dégradé ne doit être codée en dur dans un composant :
// tout passe par ces tokens.
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
        ink: {
          950: "#0F0813",
          900: "#180E1F",
          800: "#211329",
          700: "#2C1A36",
          600: "#3A2748",
        },
        line: {
          800: "#33223F",
          700: "#432C52",
          600: "#563A66",
        },
        paper: {
          100: "#F9F5F8",
          400: "#C3B2CB",
          500: "#A895B2",
          600: "#8A7796",
        },
        brand: {
          300: "#F6A0C0",
          400: "#F2679C",
          500: "#E8447A",
          600: "#C22F63",
          700: "#9C2350",
        },
        gold: {
          300: "#F9D48A",
          400: "#F5B84D",
          500: "#E8A33D",
          600: "#C6822A",
        },
        signal: {
          info: "#4E9BF2",
          "info-bg": "rgba(78,155,242,0.14)",
          preview: "#9D6FE0",
          "preview-bg": "rgba(157,111,224,0.16)",
          success: "#34C98E",
          "success-bg": "rgba(52,201,142,0.14)",
          warn: "#E8A33D",
          "warn-bg": "rgba(232,163,61,0.16)",
          error: "#F1495F",
          "error-bg": "rgba(241,73,95,0.14)",
          neutral: "#A895B2",
          "neutral-bg": "rgba(168,149,178,0.14)",
        },
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
      borderRadius: {
        control: "0.875rem",
        card: "1.5rem",
        panel: "1.75rem",
      },
      boxShadow: {
        card: "0 1px 0 rgba(255,255,255,0.03) inset, 0 14px 32px -16px rgba(6,2,10,0.65)",
        "card-hover":
          "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 40px -16px rgba(6,2,10,0.75)",
        "glow-brand": "0 10px 28px -10px rgba(232,68,122,0.5)",
        "glow-gold": "0 10px 28px -10px rgba(232,163,61,0.45)",
        "ring-focus": "0 0 0 3px rgba(232,68,122,0.25)",
      },
      backgroundImage: {
        "gradient-signature": "linear-gradient(135deg, #E8447A 0%, #E8A33D 100%)",
        "gradient-signature-soft":
          "linear-gradient(135deg, rgba(232,68,122,0.22) 0%, rgba(232,163,61,0.18) 100%)",
        "gradient-hero":
          "radial-gradient(120% 140% at 18% -10%, rgba(232,68,122,0.22) 0%, rgba(232,68,122,0) 55%), radial-gradient(90% 120% at 100% 0%, rgba(232,163,61,0.14) 0%, rgba(232,163,61,0) 60%)",
        "gradient-occasion-anniversaire": "linear-gradient(135deg, #E8447A 0%, #F5B84D 100%)",
        "gradient-occasion-amour": "linear-gradient(135deg, #C22F63 0%, #4A2159 100%)",
        "gradient-occasion-mariage": "linear-gradient(135deg, #E8C77A 0%, #8A5A34 100%)",
        "gradient-occasion-reussite": "linear-gradient(135deg, #2FBF8F 0%, #1A6E63 100%)",
        "gradient-occasion-hommage": "linear-gradient(135deg, #4A3259 0%, #1B1023 100%)",
        "gradient-disque": "conic-gradient(from 220deg, #E8447A, #E8A33D, #E8447A)",
        noise:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      backdropBlur: {
        panel: "16px",
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
