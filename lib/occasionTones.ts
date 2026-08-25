import type { Occasion } from "@/lib/types";

// Chaque occasion a sa propre nuance, toujours dérivée de la palette
// existante du produit. Source unique : les cartes d'occasion du tableau
// de bord et l'écran 1 du tunnel de création partagent cette même palette.

export const OCCASION_TONES: Record<
  Occasion,
  {
    chip: string;
    accentBorder: string;
    hoverArrow: string;
    dot: string;
  }
> = {
  anniversaire: {
    chip: "bg-occasion-anniversaire/10 text-occasion-anniversaire",
    accentBorder: "border-t-occasion-anniversaire",
    hoverArrow:
      "group-hover:bg-occasion-anniversaire/10 group-hover:text-occasion-anniversaire",
    dot: "bg-occasion-anniversaire",
  },

  amour: {
    chip: "bg-occasion-amour/10 text-occasion-amour",
    accentBorder: "border-t-occasion-amour",
    hoverArrow:
      "group-hover:bg-occasion-amour/10 group-hover:text-occasion-amour",
    dot: "bg-occasion-amour",
  },

  mariage: {
    chip: "bg-brand-light/10 text-brand-light",
    accentBorder: "border-t-brand-light",
    hoverArrow:
      "group-hover:bg-brand-light/10 group-hover:text-brand-light",
    dot: "bg-brand-light",
  },

  reussite: {
    chip: "bg-secondary/10 text-secondary",
    accentBorder: "border-t-secondary",
    hoverArrow:
      "group-hover:bg-secondary/10 group-hover:text-secondary",
    dot: "bg-secondary",
  },

  celebration: {
    chip: "bg-brand/10 text-brand",
    accentBorder: "border-t-brand",
    hoverArrow:
      "group-hover:bg-brand/10 group-hover:text-brand",
    dot: "bg-brand",
  },

  hommage: {
    chip: "bg-occasion-hommage/10 text-occasion-hommage",
    accentBorder: "border-t-occasion-hommage",
    hoverArrow:
      "group-hover:bg-occasion-hommage/10 group-hover:text-occasion-hommage",
    dot: "bg-occasion-hommage",
  },

  autre: {
    chip: "bg-ink-muted/10 text-ink-muted",
    accentBorder: "border-t-ink-muted",
    hoverArrow:
      "group-hover:bg-ink-muted/10 group-hover:text-ink-muted",
    dot: "bg-ink-muted",
  },
};

// Vignettes Explorer : un dégradé linéaire par occasion.
export const OCCASION_GRADIENTS: Record<Occasion, string> = {
  anniversaire: "from-occasion-anniversaire to-brand-light",
  amour: "from-occasion-amour to-brand",
  mariage: "from-brand-light to-secondary",
  reussite: "from-secondary to-brand",
  celebration: "from-brand to-brand-light",
  hommage: "from-occasion-hommage to-ink",
  autre: "from-ink-muted to-ink",
};