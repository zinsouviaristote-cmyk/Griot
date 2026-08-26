// Taxonomie d'erreurs commune a tous les fournisseurs de generation musicale.
// `retryable` pilote la logique de reessai (une seule fois, jamais en boucle) ;
// `userMessage` est ce qui remonte jusqu'a l'utilisateur, toujours en langage
// courant, jamais un code technique ni un message brut du fournisseur.

export type GenerationErrorCode =
  | "invalid_api_key"
  | "quota_exceeded"
  | "content_rejected"
  | "text_too_long"
  | "network_error"
  | "timeout"
  | "provider_error"
  | "internal_error";

const DEFAULT_MESSAGES: Record<GenerationErrorCode, string> = {
  invalid_api_key:
    "Le service de generation musicale est momentanement indisponible. Reessaie dans quelques minutes.",
  quota_exceeded:
    "Le quota de generation est atteint pour le moment. Reessaie un peu plus tard.",
  content_rejected:
    "Ces paroles n'ont pas pu etre mises en musique telles quelles. Essaie de les reformuler.",
  text_too_long:
    "Le texte est trop long pour cette generation. Raccourcis un peu tes paroles ou tes consignes de style.",
  network_error:
    "Une erreur reseau passagere a interrompu la generation. Reessaie.",
  timeout:
    "La generation a pris trop de temps et a ete interrompue. Reessaie.",
  provider_error:
    "Le service de generation musicale a rencontre un probleme. Reessaie dans quelques instants.",
  internal_error:
    "Une erreur inattendue est survenue. Reessaie, et si le probleme persiste contacte le support.",
};

const RETRYABLE_CODES = new Set<GenerationErrorCode>([
  "network_error",
  "timeout",
  "provider_error",
]);

export class GenerationError extends Error {
  readonly code: GenerationErrorCode;
  readonly retryable: boolean;
  readonly userMessage: string;

  constructor(code: GenerationErrorCode, message: string, userMessage?: string) {
    super(message);
    this.name = "GenerationError";
    this.code = code;
    this.retryable = RETRYABLE_CODES.has(code);
    this.userMessage = userMessage ?? DEFAULT_MESSAGES[code];
  }
}

// Convertit une erreur inconnue (exception JS brute, erreur fetch, etc.) en
// GenerationError classee. Tout ce qui n'est pas explicitement reconnu est
// traite comme non-reessayable par prudence (on ne veut jamais boucler sur
// une erreur qu'on ne comprend pas).
export function toGenerationError(err: unknown): GenerationError {
  if (err instanceof GenerationError) return err;

  if (err instanceof Error) {
    if (err.name === "AbortError") {
      return new GenerationError("timeout", err.message);
    }
    if (err.message.toLowerCase().includes("fetch failed") || err.message.toLowerCase().includes("network")) {
      return new GenerationError("network_error", err.message);
    }
    return new GenerationError("internal_error", err.message);
  }

  return new GenerationError("internal_error", String(err));
}

// Classe le statut HTTP d'une reponse fournisseur en code d'erreur applicatif.
export function classifyHttpStatus(status: number, detail: string): GenerationError {
  if (status === 401 || status === 403) {
    return new GenerationError("invalid_api_key", `HTTP ${status}: ${detail}`);
  }
  if (status === 402 || status === 429) {
    return new GenerationError("quota_exceeded", `HTTP ${status}: ${detail}`);
  }
  if (status === 422 || status === 400) {
    return new GenerationError("content_rejected", `HTTP ${status}: ${detail}`);
  }
  if (status === 408 || status === 504) {
    return new GenerationError("timeout", `HTTP ${status}: ${detail}`);
  }
  if (status >= 500) {
    return new GenerationError("provider_error", `HTTP ${status}: ${detail}`);
  }
  return new GenerationError("provider_error", `HTTP ${status}: ${detail}`);
}
