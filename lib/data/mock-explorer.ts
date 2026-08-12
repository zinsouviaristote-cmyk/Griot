import type { MusicStyle, Occasion, PublishedSong } from "@/lib/types";

// Chansons publiées par "d'autres utilisateurs" — données de démonstration
// indépendantes de mockSongs (lib/data/mock-dashboard.ts), à l'exception des
// deux premières entrées ("mine: true"), qui représentent les publications
// réelles d'Aïcha (song_1, song_2) et alimentent le tableau de bord et Mes
// publications. Aucun appel réseau : à remplacer par une table `published_songs`
// en Phase 2, sans changer la forme consommée par Explorer et Mes publications.

interface RawEntry {
  firstName: string;
  occasion: Occasion;
  style: MusicStyle;
  hideFirstName?: boolean;
  publicTitle?: string;
}

// Pseudonymes des auteurs (celui qui offre, jamais le destinataire) — un
// bassin distinct des prénoms de destinataires ci-dessus pour qu'aucune carte
// ne mélange visuellement les deux rôles.
const AUTHOR_NAMES = [
  "Awa", "Kader", "Sokhna", "Yacouba", "Aminata", "Boubou", "Fatim", "Salif",
  "Aissata", "Moctar", "Cheick", "Rama", "Issa", "Djamila", "Ababacar", "Hawa",
  "Sory", "Nabou", "Alpha", "Marème", "Bineta", "Youssou", "Sira", "Lassana",
];

function authorNameFor(index: number): string {
  return AUTHOR_NAMES[index % AUTHOR_NAMES.length];
}

// Un nom à chanter : le vrai prénom quand l'auteur a choisi de le montrer,
// sinon "toi" — jamais "Chanson surprise" (réservé à l'affichage du titre),
// qui sonnerait faux glissé dans un couplet.
function nameForLyrics(entry: RawEntry): string {
  return entry.hideFirstName ? "toi" : entry.firstName;
}

// Un couplet court par occasion — gabarit unique, pas de vraie génération
// (celle-ci n'existe que dans le tunnel de création, voir lib/tunnel/lyricsEngine.ts) :
// Explorer n'a besoin que d'un aperçu et d'une surimpression, jamais d'un moteur complet.
const LYRICS_TEMPLATES: Record<Occasion, (name: string) => string[]> = {
  anniversaire: (name) => [
    `On souffle les bougies, ${name}, une année de plus à célébrer,`,
    "chaque instant avec toi restera gravé.",
    "Que cette chanson porte tous nos vœux,",
    "joyeux anniversaire, du fond de notre cœur.",
  ],
  amour: (name) => [
    `${name}, depuis que tu es là, tout semble plus clair,`,
    "ton sourire à lui seul efface l'hiver.",
    "Cette chanson dit ce que les mots n'osent pas,",
    `je t'aime, ${name}, et ça ne changera pas.`,
  ],
  mariage: (name) => [
    `Aujourd'hui ${name}, commence une nouvelle histoire,`,
    "deux cœurs réunis, une seule mémoire.",
    "Que la route soit longue et pleine de lumière,",
    "félicitations, que dure cette belle prière.",
  ],
  reussite: (name) => [
    `${name}, tu l'as fait, après tant d'efforts,`,
    "chaque nuit blanche a construit ce trésor.",
    "Cette victoire porte ton nom,",
    `bravo ${name}, savoure cette saison.`,
  ],
  hommage: (name) => [
    `${name}, ton souvenir ne s'efface pas,`,
    "dans chaque rire, tu es encore là.",
    "Cette chanson garde ta mémoire vivante,",
    `merci pour tout, ${name}, ton empreinte est marquante.`,
  ],
};

function lyricsFor(entry: RawEntry): string[] {
  return LYRICS_TEMPLATES[entry.occasion](nameForLyrics(entry));
}

const COMMUNITY_ENTRIES: RawEntry[] = [
  { firstName: "Mariam", occasion: "anniversaire", style: "afrobeat" },
  { firstName: "Ousmane", occasion: "reussite", style: "coupe_decale", publicTitle: "Bravo champion" },
  { firstName: "Aïssatou", occasion: "amour", style: "zouk", hideFirstName: true },
  { firstName: "Boubacar", occasion: "mariage", style: "ballade_acoustique", publicTitle: "Pour la vie" },
  { firstName: "Khadija", occasion: "anniversaire", style: "gospel" },
  { firstName: "Seydou", occasion: "hommage", style: "gospel", hideFirstName: true, publicTitle: "En ta mémoire" },
  { firstName: "Adama", occasion: "reussite", style: "afrobeat" },
  { firstName: "Rokia", occasion: "amour", style: "zouk" },
  { firstName: "Cheikh", occasion: "anniversaire", style: "coupe_decale", hideFirstName: true },
  { firstName: "Bintou", occasion: "mariage", style: "ballade_acoustique" },
  { firstName: "Lamine", occasion: "reussite", style: "afrobeat", publicTitle: "Objectif atteint" },
  { firstName: "Djeneba", occasion: "amour", style: "zouk" },
  { firstName: "Modibo", occasion: "anniversaire", style: "gospel" },
  { firstName: "Nafissatou", occasion: "mariage", style: "ballade_acoustique", hideFirstName: true },
  { firstName: "Abou", occasion: "hommage", style: "ballade_acoustique", hideFirstName: true, publicTitle: "Toujours avec nous" },
  { firstName: "Kadiatou", occasion: "anniversaire", style: "afrobeat" },
  { firstName: "Souleymane", occasion: "amour", style: "coupe_decale" },
  { firstName: "Mamadou", occasion: "reussite", style: "gospel" },
  { firstName: "Fanta", occasion: "anniversaire", style: "zouk" },
  { firstName: "Ibrahima", occasion: "mariage", style: "afrobeat", publicTitle: "Un nouveau chapitre" },
  { firstName: "Coumba", occasion: "amour", style: "ballade_acoustique", hideFirstName: true },
  { firstName: "Idrissa", occasion: "reussite", style: "coupe_decale" },
  { firstName: "Habibatou", occasion: "anniversaire", style: "gospel" },
  { firstName: "Habib", occasion: "hommage", style: "ballade_acoustique", hideFirstName: true },
  { firstName: "Mariame", occasion: "amour", style: "zouk", publicTitle: "Rien que pour toi" },
  { firstName: "Oumar", occasion: "mariage", style: "coupe_decale" },
  { firstName: "Ndeye", occasion: "reussite", style: "afrobeat" },
  { firstName: "Alassane", occasion: "anniversaire", style: "ballade_acoustique" },
  { firstName: "Ramata", occasion: "amour", style: "gospel" },
  { firstName: "Fousseni", occasion: "mariage", style: "zouk" },
];

// Déterministe (jamais Math.random) : un rendu identique serveur/client, tout
// en donnant à chaque carte des compteurs qui ne se ressemblent pas.
function seededLikes(index: number): number {
  return ((index * 53 + 17) % 480) + 4;
}
function seededListens(index: number, likes: number): number {
  return likes + ((index * 29 + 41) % 900) + 30;
}
function seededDownloads(index: number, likes: number): number {
  return Math.round(likes * 0.35) + ((index * 13 + 7) % 40);
}
function seededDaysAgo(index: number): number {
  return (index * 3 + 1) % 52;
}
function isoDaysAgo(days: number): string {
  const date = new Date(2026, 7, 9); // 2026-08-09, la date de référence du produit
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

const community: PublishedSong[] = COMMUNITY_ENTRIES.map((entry, index) => ({
  id: `pub_${index + 3}`,
  sourceSongId: null,
  mine: false,
  recipientFirstName: entry.firstName,
  hideFirstName: entry.hideFirstName ?? false,
  publicTitle: entry.publicTitle ?? null,
  occasion: entry.occasion,
  style: entry.style,
  audioUrl: "/mock-audio.wav",
  likes: seededLikes(index),
  listens: seededListens(index, seededLikes(index)),
  downloads: seededDownloads(index, seededLikes(index)),
  publishedAt: isoDaysAgo(seededDaysAgo(index)),
  authorName: authorNameFor(index),
  lyrics: lyricsFor(entry),
}));

// Les deux publications d'Aïcha elle-même — visibles à la fois dans Explorer
// (mêlées aux autres, comme n'importe quelle publication) et dans Mes
// publications (filtrées sur `mine`). Alimentent aussi la 5e carte du tableau
// de bord (lib/data/mock-dashboard.ts).
export const mockPublishedSongs: PublishedSong[] = [
  {
    id: "pub_1",
    sourceSongId: "song_1",
    mine: true,
    recipientFirstName: "Fatou",
    hideFirstName: false,
    publicTitle: null,
    occasion: "anniversaire",
    style: "afrobeat",
    audioUrl: "/mock-audio.wav",
    likes: 128,
    listens: 340,
    downloads: 58,
    publishedAt: "2026-08-03",
    authorName: "Aïcha",
    lyrics: LYRICS_TEMPLATES.anniversaire("Fatou"),
  },
  {
    id: "pub_2",
    sourceSongId: "song_2",
    mine: true,
    recipientFirstName: "Moussa",
    hideFirstName: true,
    publicTitle: "Objectif décroché",
    occasion: "reussite",
    style: "coupe_decale",
    audioUrl: "/mock-audio.wav",
    likes: 76,
    listens: 210,
    downloads: 33,
    publishedAt: "2026-07-29",
    authorName: "Aïcha",
    lyrics: LYRICS_TEMPLATES.reussite("toi"),
  },
  ...community,
];

export function getPublicDisplayName(entry: PublishedSong, t: (key: string) => string): string {
  if (entry.publicTitle) return entry.publicTitle;
  if (!entry.hideFirstName) return entry.recipientFirstName;
  return t("explorer.surpriseSong");
}

export function getPublishedEntryForSong(songId: string): PublishedSong | undefined {
  return mockPublishedSongs.find((entry) => entry.sourceSongId === songId);
}

export function getMyPublishedSongs(): PublishedSong[] {
  return mockPublishedSongs.filter((entry) => entry.mine);
}
