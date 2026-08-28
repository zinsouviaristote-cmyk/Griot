"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  Clock, 
  User, 
  Music2, 
  Coins, 
  Loader2, 
  X
} from 'lucide-react';
import { styleCatalog } from '@/lib/tunnel/types';
import { styleLabel } from '@/lib/i18n/catalog';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { MusicStyle } from '@/lib/types';
import { useUserProfile } from '@/lib/hooks/useUserProfile';

export function CreateSongHero() {
  const { t } = useLanguage();
  const router = useRouter();
  const supabase = createClient();
  const { profile } = useUserProfile();
  const creditBalance = profile?.creditBalance ?? 0;

  const [activeTab, setActiveTab] = useState<'marche' | 'generations' | 'enregistre'>('marche');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number>(60);
  const [voiceType, setVoiceType] = useState<'homme' | 'femme' | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedStyle) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Veuillez vous connecter pour générer une chanson.");

      const { data: song, error: songError } = await supabase
        .from('songs')
        .insert({
          user_id: user.id,
          style: selectedStyle,
          story_prompt: prompt,
          duration_seconds: durationSeconds,
          status: 'generating',
          occasion: 'autre',
          recipient_first_name: 'toi',
          relationship: 'autre',
        })
        .select('id')
        .single();

      if (songError || !song) throw new Error("Impossible d'initialiser la chanson.");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Session expirée.");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-song`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            songId: song.id,
            voiceType
          })
        }
      );

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || resData.error || "Une erreur est survenue.");
      }

      router.push(`/mes-creations?attemptId=${resData.attemptId}`);
    } catch (err: unknown) {
      console.error('Erreur de génération:', err);
      const message = err instanceof Error ? err.message : 'Une erreur est survenue lors de la génération.';
      setErrorMessage(message);
      setIsGenerating(false);
    }
  };

  const availableStyles = styleCatalog;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Barre d'onglets */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('marche')}
            className={`pb-3 -mb-3 transition-colors ${
              activeTab === 'marche'
                ? 'border-b-2 border-brand text-ink font-semibold'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Créer
          </button>
          <button
            onClick={() => {
              setActiveTab('generations');
              router.push('/historiques');
            }}
            className={`pb-3 -mb-3 transition-colors ${
              activeTab === 'generations'
                ? 'border-b-2 border-brand text-ink font-semibold'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            Historiques
          </button>
        </div>
      </div>

      {/* Carte Studio */}
      <div className="bg-surface border border-border rounded-2xl shadow-card p-5 space-y-4 relative overflow-hidden">
        {/* Suggestions de styles */}
        {showSuggestions && (
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
            <div className="flex items-center gap-2">
              {availableStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border whitespace-nowrap ${
                    selectedStyle === style.id
                      ? 'border-brand bg-brand-soft text-brand'
                      : 'border-border bg-surface text-ink-muted'
                  }`}
                >
                  {styleLabel(t, style.id)}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSuggestions(false)}
              className="p-1 text-ink-muted hover:text-ink rounded-lg hover:bg-brand-soft/50"
              title="Masquer les suggestions"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zone de texte */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décrivez votre chanson, une histoire ou collez directement des paroles..."
            rows={3}
            className="w-full text-sm text-ink placeholder:text-ink-muted bg-transparent border-none focus:outline-none resize-none p-1"
          />
        </div>

        {/* Contrôles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-border gap-3 sm:gap-0">
          <div className="flex items-center gap-2 text-xs text-ink-muted flex-wrap">
            {/* Durée */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-page border border-border">
              <Clock className="w-3.5 h-3.5 text-ink-muted" />
              <select
                value={durationSeconds}
                onChange={(e) => setDurationSeconds(Number(e.target.value))}
                className="bg-transparent border-none text-xs text-ink font-medium focus:outline-none cursor-pointer [&>option]:bg-surface [&>option]:text-ink"
              >
                <option value={30}>0:30</option>
                <option value={60}>1:00</option>
                <option value={90}>1:30</option>
                <option value={120}>2:00</option>
              </select>
            </div>

            {/* Voix */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-page border border-border">
              <User className="w-3.5 h-3.5 text-ink-muted" />
              <select
                value={voiceType ?? ''}
                onChange={(e) => setVoiceType((e.target.value as 'homme' | 'femme') || null)}
                className="bg-transparent border-none text-xs text-ink font-medium focus:outline-none cursor-pointer [&>option]:bg-surface [&>option]:text-ink"
              >
                <option value="">Voix : Auto</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Crédits */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-soft text-brand text-xs font-semibold">
              <Coins className="w-3.5 h-3.5" />
              <span>{creditBalance} Note{creditBalance > 1 ? 's' : ''}</span>
            </div>

            {/* Bouton Générer */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !selectedStyle}
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-40 transition shadow-card flex-1 sm:flex-none justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Music2 className="w-3.5 h-3.5" />
                  Générer
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="text-xs text-danger mt-2 font-medium">
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}