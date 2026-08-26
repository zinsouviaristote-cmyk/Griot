// Decoupe un MP3 sur des frontieres de trame MPEG, sans jamais decoder ni
// reencoder l'audio. On lit uniquement les en-tetes de trame (sync word,
// bitrate, frequence d'echantillonnage, bit de padding) pour retrouver les
// limites de chaque trame et copier les octets bruts jusqu'a la duree visee.
// Cout CPU : un parsing lineaire d'en-tetes de 4 octets, de l'ordre de
// quelques milliers d'iterations pour une piste de 1 a 3 minutes -- largement
// sous la limite de 2s CPU d'une Edge Function, y compris en tache
// d'arriere-plan (waitUntil). Aucun decodage audio n'est jamais effectue ici.

const MPEG1_LAYER3_BITRATES_KBPS = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320,
] as const;

const MPEG2_LAYER3_BITRATES_KBPS = [
  0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160,
] as const;

const SAMPLE_RATES_BY_VERSION: Record<number, readonly number[]> = {
  // versionBits: 00 = MPEG2.5, 10 = MPEG2, 11 = MPEG1
  0b00: [11025, 12000, 8000],
  0b10: [22050, 24000, 16000],
  0b11: [44100, 48000, 32000],
};

interface MpegFrame {
  offset: number;
  length: number;
  samplesPerFrame: number;
  sampleRate: number;
}

// Saute un tag ID3v2 en tete de fichier s'il existe (non requis pour un MP3
// nu comme ceux renvoyes par l'API ElevenLabs, mais robuste si un jour un tag
// est ajoute en amont).
function skipId3v2(bytes: Uint8Array): number {
  if (bytes.length < 10) return 0;
  if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return 0; // "ID3"
  const size =
    ((bytes[6] & 0x7f) << 21) |
    ((bytes[7] & 0x7f) << 14) |
    ((bytes[8] & 0x7f) << 7) |
    (bytes[9] & 0x7f);
  return 10 + size;
}

function parseFrameHeader(bytes: Uint8Array, offset: number): MpegFrame | null {
  if (offset + 4 > bytes.length) return null;

  const b0 = bytes[offset];
  const b1 = bytes[offset + 1];
  const b2 = bytes[offset + 2];

  // Sync word : 11 bits a 1.
  if (b0 !== 0xff || (b1 & 0xe0) !== 0xe0) return null;

  const versionBits = (b1 >> 3) & 0b11;
  const layerBits = (b1 >> 1) & 0b11;
  if (layerBits !== 0b01) return null; // On ne traite que Layer III (celui d'ElevenLabs / mp3 standard).
  if (versionBits === 0b01) return null; // reserve

  const bitrateIndex = (b2 >> 4) & 0x0f;
  const sampleRateIndex = (b2 >> 2) & 0b11;
  const padding = (b2 >> 1) & 0b1;

  if (bitrateIndex === 0 || bitrateIndex === 0x0f) return null;
  if (sampleRateIndex === 0b11) return null;

  const sampleRates = SAMPLE_RATES_BY_VERSION[versionBits];
  if (!sampleRates) return null;
  const sampleRate = sampleRates[sampleRateIndex];

  const isMpeg1 = versionBits === 0b11;
  const bitrateTable = isMpeg1 ? MPEG1_LAYER3_BITRATES_KBPS : MPEG2_LAYER3_BITRATES_KBPS;
  const bitrateKbps = bitrateTable[bitrateIndex];
  if (!bitrateKbps) return null;

  const samplesPerFrame = isMpeg1 ? 1152 : 576;
  const bitrateBps = bitrateKbps * 1000;
  const frameLength =
    Math.floor((samplesPerFrame / 8) * bitrateBps / sampleRate) + padding;

  if (frameLength < 4) return null;

  return { offset, length: frameLength, samplesPerFrame, sampleRate };
}

export interface Mp3Analysis {
  // Debut de la premiere trame reconnue (apres un eventuel tag ID3v2).
  audioStart: number;
  // Offsets de fin de chaque trame, dans l'ordre.
  frameEndOffsets: number[];
  totalDurationMs: number;
}

export function analyzeMp3(bytes: Uint8Array): Mp3Analysis {
  let offset = skipId3v2(bytes);
  const audioStart = offset;
  const frameEndOffsets: number[] = [];
  let totalSamples = 0;
  let sampleRate = 44100;

  while (offset < bytes.length) {
    const frame = parseFrameHeader(bytes, offset);
    if (!frame) {
      // Resynchronisation : on avance d'un octet et on reessaie. Tolere les
      // eventuelles metadonnees de fin (tags ID3v1, APE) sans planter.
      offset += 1;
      continue;
    }
    if (frame.offset + frame.length > bytes.length) break;

    offset = frame.offset + frame.length;
    frameEndOffsets.push(offset);
    totalSamples += frame.samplesPerFrame;
    sampleRate = frame.sampleRate;
  }

  const totalDurationMs = (totalSamples / sampleRate) * 1000;

  return { audioStart, frameEndOffsets, totalDurationMs };
}

// Renvoie un MP3 autonome et valide, coupe sur la frontiere de trame la plus
// proche de `targetMs`, sans avoir touche au contenu des trames elles-memes.
export function clipMp3ToDuration(bytes: Uint8Array, targetMs: number): Uint8Array {
  const { frameEndOffsets } = analyzeMp3(bytes);

  if (frameEndOffsets.length === 0) {
    // Rien a decouper de facon fiable : on renvoie le fichier tel quel plutot
    // que de risquer de produire un extrait tronque au milieu d'une trame.
    return bytes;
  }

  // On avance trame par trame jusqu'a atteindre la duree visee.
  let cutOffset = frameEndOffsets[frameEndOffsets.length - 1];
  let cumulatedMs = 0;
  const samplesPerFrame = 1152; // Layer III MPEG1 -- cas standard des sorties ElevenLabs.
  const sampleRate = 44100;
  const msPerFrame = (samplesPerFrame / sampleRate) * 1000;

  for (const endOffset of frameEndOffsets) {
    cumulatedMs += msPerFrame;
    cutOffset = endOffset;
    if (cumulatedMs >= targetMs) break;
  }

  return bytes.subarray(0, cutOffset);
}
