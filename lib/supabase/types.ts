export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SongStatus =
  | "draft"
  | "generating"
  | "preview_ready"
  | "awaiting_payment"
  | "paid"
  | "delivered"
  | "failed";

export type CreditMotif = "achat" | "essai" | "remboursement";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          email: string
          phone: string | null
          photo_url: string | null
          credit_balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          email: string
          phone?: string | null
          photo_url?: string | null
          credit_balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          email?: string
          phone?: string | null
          photo_url?: string | null
          credit_balance?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          first_name: string
          relationship: string
          birthday: string
          phone: string | null
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          relationship: string
          birthday: string
          phone?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          relationship?: string
          birthday?: string
          phone?: string | null
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      songs: {
        Row: {
          id: string
          user_id: string
          contact_id: string | null
          recipient_first_name: string
          relationship: string
          occasion: string
          style: string
          status: string
          story_prompt: string | null
          audio_path: string | null
          preview_audio_path: string | null
          lyrics: string | null
          duration_seconds: number | null
          listens_count: number
          image_url: string | null
          first_attempt_used: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          contact_id?: string | null
          recipient_first_name: string
          relationship: string
          occasion: string
          style: string
          status?: string
          story_prompt?: string | null
          audio_path?: string | null
          preview_audio_path?: string | null
          lyrics?: string | null
          duration_seconds?: number | null
          listens_count?: number
          image_url?: string | null
          first_attempt_used?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          contact_id?: string | null
          recipient_first_name?: string
          relationship?: string
          occasion?: string
          style?: string
          status?: string
          story_prompt?: string | null
          audio_path?: string | null
          preview_audio_path?: string | null
          lyrics?: string | null
          duration_seconds?: number | null
          listens_count?: number
          image_url?: string | null
          first_attempt_used?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      generation_attempts: {
        Row: {
          id: string
          song_id: string
          user_id: string
          attempt_number: number
          is_free: boolean
          prompt_snapshot: string
          lyrics_version: string | null
          audio_path: string | null
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          song_id: string
          user_id: string
          attempt_number: number
          is_free?: boolean
          prompt_snapshot: string
          lyrics_version?: string | null
          audio_path?: string | null
          status: string
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          song_id?: string
          user_id?: string
          attempt_number?: number
          is_free?: boolean
          prompt_snapshot?: string
          lyrics_version?: string | null
          audio_path?: string | null
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          motif: string
          label_key: string
          label_params: Json
          delta: number
          balance_after: number
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          motif: string
          label_key: string
          label_params?: Json
          delta: number
          balance_after: number
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          motif?: string
          label_key?: string
          label_params?: Json
          delta?: number
          balance_after?: number
          reference_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          user_id: string
          song_id: string | null
          pack_id: string | null
          amount_fcfa: number
          payment_method: string
          provider_transaction_id: string | null
          status: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          song_id?: string | null
          pack_id?: string | null
          amount_fcfa: number
          payment_method: string
          provider_transaction_id?: string | null
          status?: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          song_id?: string | null
          pack_id?: string | null
          amount_fcfa?: number
          payment_method?: string
          provider_transaction_id?: string | null
          status?: string
          created_at?: string
          completed_at?: string | null
        }
        Relationships: []
      }
      published_songs: {
        Row: {
          id: string
          user_id: string
          source_song_id: string | null
          recipient_first_name: string
          hide_first_name: boolean
          public_title: string | null
          occasion: string
          style: string
          audio_url: string
          image_url: string | null
          lyrics: string[]
          likes_count: number
          listens_count: number
          downloads_count: number
          published_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_song_id?: string | null
          recipient_first_name: string
          hide_first_name?: boolean
          public_title?: string | null
          occasion: string
          style: string
          audio_url: string
          image_url?: string | null
          lyrics?: string[]
          likes_count?: number
          listens_count?: number
          downloads_count?: number
          published_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_song_id?: string | null
          recipient_first_name?: string
          hide_first_name?: boolean
          public_title?: string | null
          occasion?: string
          style?: string
          audio_url?: string
          image_url?: string | null
          lyrics?: string[]
          likes_count?: number
          listens_count?: number
          downloads_count?: number
          published_at?: string
          created_at?: string
        }
        Relationships: []
      }
      song_likes: {
        Row: {
          id: string
          user_id: string
          published_song_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          published_song_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          published_song_id?: string
          created_at?: string
        }
        Relationships: []
      }
      song_listens_log: {
        Row: {
          id: string
          user_id: string | null
          song_id: string | null
          published_song_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          song_id?: string | null
          published_song_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          song_id?: string | null
          published_song_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_shared_songs: {
        Row: {
          id: string
          recipient_first_name: string
          relationship: string
          occasion: string
          style: string
          duration_seconds: number | null
          preview_audio_path: string | null
          image_url: string | null
          created_at: string
        }
        Relationships: []
      }
    }
    Functions: {
      request_song_generation: {
        Args: {
          p_song_id: string
          p_prompt: string
        }
        Returns: Json
      }
      process_payment_webhook: {
        Args: {
          p_provider_tx_id: string
          p_user_id: string
          p_amount: number
          p_pack_id: string | null
          p_song_id: string | null
          p_payment_method: string | null
        }
        Returns: Json
      }
      increment_listen: {
        Args: {
          p_song_id: string | null
          p_published_song_id: string | null
        }
        Returns: void
      }
    }
    Enums: {
      song_status: SongStatus
      credit_motif: CreditMotif
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
