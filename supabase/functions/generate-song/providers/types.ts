// Abstraction commune a tous les fournisseurs de generation musicale. Aucun
// code applicatif en dehors du dossier `providers/` ne doit connaitre le nom
// d'un fournisseur precis (ElevenLabs, factice ou autre).

export interface MusicGenerationRequest {
  // Paroles telles que validees par l'utilisateur, avec leurs balises de
  // structure ([Couplet]/[Refrain]/[Pont]/...) le cas echeant.
  lyrics: string;
  style: string;
  voiceType: "homme" | "femme" | null;
  positiveStyles: string[];
  negativeStyles: string[];
  // Duree visee pour la piste complete.
  requestedDurationMs: number;
}

export interface MusicGenerationResult {
  audioBytes: Uint8Array;
  contentType: string;
  // Identifiant renvoye par le fournisseur pour cette generation (song-id
  // ElevenLabs, ou equivalent). Jamais expose au client, uniquement journalise.
  providerSongId: string | null;
  modelId: string;
  processingMs: number;
}

export interface MusicProvider {
  readonly name: string;
  generate(req: MusicGenerationRequest): Promise<MusicGenerationResult>;
}
