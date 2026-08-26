export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      contacts: {
        Row: {
          birthday: string
          created_at: string
          first_name: string
          id: string
          note: string | null
          phone: string | null
          relationship: string
          updated_at: string
          user_id: string
        }
        Insert: {
          birthday: string
          created_at?: string
          first_name: string
          id?: string
          note?: string | null
          phone?: string | null
          relationship: string
          updated_at?: string
          user_id: string
        }
        Update: {
          birthday?: string
          created_at?: string
          first_name?: string
          id?: string
          note?: string | null
          phone?: string | null
          relationship?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          balance_after: number
          created_at: string
          delta: number
          id: string
          label_key: string
          label_params: Json | null
          motif: Database["public"]["Enums"]["credit_motif"]
          reference_id: string | null
          user_id: string
        }
        Insert: {
          balance_after: number
          created_at?: string
          delta: number
          id?: string
          label_key: string
          label_params?: Json | null
          motif: Database["public"]["Enums"]["credit_motif"]
          reference_id?: string | null
          user_id: string
        }
        Update: {
          balance_after?: number
          created_at?: string
          delta?: number
          id?: string
          label_key?: string
          label_params?: Json | null
          motif?: Database["public"]["Enums"]["credit_motif"]
          reference_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      generation_attempts: {
        Row: {
          attempt_number: number
          audio_path: string | null
          created_at: string
          elevenlabs_song_id: string | null
          error_code: string | null
          error_message: string | null
          id: string
          is_free: boolean
          lyrics_version: string | null
          model_id: string | null
          preview_audio_path: string | null
          processing_ms: number | null
          prompt_snapshot: string
          provider: string | null
          requested_duration_ms: number | null
          retried: boolean
          song_id: string
          status: string
          style: string | null
          text_length: number | null
          updated_at: string
          user_id: string
          voice_type: string | null
        }
        Insert: {
          attempt_number: number
          audio_path?: string | null
          created_at?: string
          elevenlabs_song_id?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          is_free?: boolean
          lyrics_version?: string | null
          model_id?: string | null
          preview_audio_path?: string | null
          processing_ms?: number | null
          prompt_snapshot: string
          provider?: string | null
          requested_duration_ms?: number | null
          retried?: boolean
          song_id: string
          status: string
          style?: string | null
          text_length?: number | null
          updated_at?: string
          user_id: string
          voice_type?: string | null
        }
        Update: {
          attempt_number?: number
          audio_path?: string | null
          created_at?: string
          elevenlabs_song_id?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          is_free?: boolean
          lyrics_version?: string | null
          model_id?: string | null
          preview_audio_path?: string | null
          processing_ms?: number | null
          prompt_snapshot?: string
          provider?: string | null
          requested_duration_ms?: number | null
          retried?: boolean
          song_id?: string
          status?: string
          style?: string | null
          text_length?: number | null
          updated_at?: string
          user_id?: string
          voice_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generation_attempts_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "public_shared_songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_attempts_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generation_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      music_style_prompts: {
        Row: {
          negative_styles: string[]
          positive_styles: string[]
          prompt_template: string | null
          style: string
          updated_at: string
        }
        Insert: {
          negative_styles?: string[]
          positive_styles?: string[]
          prompt_template?: string | null
          style: string
          updated_at?: string
        }
        Update: {
          negative_styles?: string[]
          positive_styles?: string[]
          prompt_template?: string | null
          style?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_fcfa: number
          completed_at: string | null
          created_at: string
          id: string
          pack_id: string | null
          payment_method: string
          provider_transaction_id: string | null
          song_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount_fcfa: number
          completed_at?: string | null
          created_at?: string
          id?: string
          pack_id?: string | null
          payment_method: string
          provider_transaction_id?: string | null
          song_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount_fcfa?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          pack_id?: string | null
          payment_method?: string
          provider_transaction_id?: string | null
          song_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "public_shared_songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          credit_balance: number
          email: string
          first_name: string
          id: string
          is_admin: boolean
          phone: string | null
          photo_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          credit_balance?: number
          email: string
          first_name: string
          id: string
          is_admin?: boolean
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          credit_balance?: number
          email?: string
          first_name?: string
          id?: string
          is_admin?: boolean
          phone?: string | null
          photo_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      published_songs: {
        Row: {
          audio_url: string
          author_name: string
          author_photo_url: string | null
          created_at: string
          downloads_count: number
          hide_first_name: boolean
          id: string
          image_url: string | null
          likes_count: number
          listens_count: number
          lyrics: string[]
          occasion: string
          public_title: string | null
          published_at: string
          recipient_first_name: string
          source_song_id: string | null
          style: string
          user_id: string
        }
        Insert: {
          audio_url: string
          author_name?: string
          author_photo_url?: string | null
          created_at?: string
          downloads_count?: number
          hide_first_name?: boolean
          id?: string
          image_url?: string | null
          likes_count?: number
          listens_count?: number
          lyrics?: string[]
          occasion: string
          public_title?: string | null
          published_at?: string
          recipient_first_name: string
          source_song_id?: string | null
          style: string
          user_id: string
        }
        Update: {
          audio_url?: string
          author_name?: string
          author_photo_url?: string | null
          created_at?: string
          downloads_count?: number
          hide_first_name?: boolean
          id?: string
          image_url?: string | null
          likes_count?: number
          listens_count?: number
          lyrics?: string[]
          occasion?: string
          public_title?: string | null
          published_at?: string
          recipient_first_name?: string
          source_song_id?: string | null
          style?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_songs_source_song_id_fkey"
            columns: ["source_song_id"]
            isOneToOne: false
            referencedRelation: "public_shared_songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_songs_source_song_id_fkey"
            columns: ["source_song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "published_songs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      song_likes: {
        Row: {
          created_at: string
          id: string
          published_song_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          published_song_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          published_song_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "song_likes_published_song_id_fkey"
            columns: ["published_song_id"]
            isOneToOne: false
            referencedRelation: "published_songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      song_listens_log: {
        Row: {
          created_at: string
          id: string
          published_song_id: string | null
          song_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          published_song_id?: string | null
          song_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          published_song_id?: string | null
          song_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "song_listens_log_published_song_id_fkey"
            columns: ["published_song_id"]
            isOneToOne: false
            referencedRelation: "published_songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_listens_log_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "public_shared_songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_listens_log_song_id_fkey"
            columns: ["song_id"]
            isOneToOne: false
            referencedRelation: "songs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_listens_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      songs: {
        Row: {
          audio_path: string | null
          contact_id: string | null
          created_at: string
          duration_seconds: number | null
          first_attempt_used: boolean
          id: string
          image_url: string | null
          listens_count: number
          lyrics: string | null
          occasion: string
          preview_audio_path: string | null
          recipient_first_name: string
          relationship: string
          status: Database["public"]["Enums"]["song_status"]
          story_prompt: string | null
          style: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_path?: string | null
          contact_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          first_attempt_used?: boolean
          id?: string
          image_url?: string | null
          listens_count?: number
          lyrics?: string | null
          occasion: string
          preview_audio_path?: string | null
          recipient_first_name: string
          relationship: string
          status?: Database["public"]["Enums"]["song_status"]
          story_prompt?: string | null
          style: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_path?: string | null
          contact_id?: string | null
          created_at?: string
          duration_seconds?: number | null
          first_attempt_used?: boolean
          id?: string
          image_url?: string | null
          listens_count?: number
          lyrics?: string | null
          occasion?: string
          preview_audio_path?: string | null
          recipient_first_name?: string
          relationship?: string
          status?: Database["public"]["Enums"]["song_status"]
          story_prompt?: string | null
          style?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "songs_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "songs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_shared_songs: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          id: string | null
          image_url: string | null
          occasion: string | null
          preview_audio_path: string | null
          recipient_first_name: string | null
          relationship: string | null
          style: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string | null
          image_url?: string | null
          occasion?: string | null
          preview_audio_path?: string | null
          recipient_first_name?: string | null
          relationship?: string | null
          style?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          id?: string | null
          image_url?: string | null
          occasion?: string | null
          preview_audio_path?: string | null
          recipient_first_name?: string | null
          relationship?: string | null
          style?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      fail_song_generation: {
        Args: {
          p_attempt_id: string
          p_error_code: string
          p_error_message: string
          p_model_id?: string
          p_provider?: string
        }
        Returns: Json
      }
      finalize_song_generation: {
        Args: {
          p_attempt_id: string
          p_audio_path: string
          p_duration_seconds: number
          p_elevenlabs_song_id: string
          p_model_id: string
          p_preview_audio_path: string
          p_processing_ms: number
          p_provider: string
          p_requested_duration_ms: number
          p_style: string
          p_text_length: number
          p_voice_type: string
        }
        Returns: Json
      }
      get_admin_overview_data: { Args: never; Returns: Json }
      get_admin_recent_songs: {
        Args: never
        Returns: {
          audio_path: string | null
          contact_id: string | null
          created_at: string
          duration_seconds: number | null
          first_attempt_used: boolean
          id: string
          image_url: string | null
          listens_count: number
          lyrics: string | null
          occasion: string
          preview_audio_path: string | null
          recipient_first_name: string
          relationship: string
          status: Database["public"]["Enums"]["song_status"]
          story_prompt: string | null
          style: string
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "songs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_admin_stats: { Args: never; Returns: Json }
      increment_download: {
        Args: { p_published_song_id: string }
        Returns: undefined
      }
      increment_listen: {
        Args: { p_published_song_id?: string; p_song_id?: string }
        Returns: undefined
      }
      process_payment_webhook: {
        Args: {
          p_amount: number
          p_pack_id?: string
          p_payment_method?: string
          p_provider_tx_id: string
          p_song_id?: string
          p_user_id: string
        }
        Returns: Json
      }
      reconcile_stuck_generation_attempts: {
        Args: { p_timeout_minutes?: number }
        Returns: number
      }
      request_song_generation: {
        Args: { p_prompt: string; p_song_id: string }
        Returns: Json
      }
      toggle_song_like: { Args: { p_published_song_id: string }; Returns: Json }
    }
    Enums: {
      credit_motif: "achat" | "essai" | "remboursement"
      song_status:
        | "draft"
        | "generating"
        | "preview_ready"
        | "awaiting_payment"
        | "paid"
        | "delivered"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      credit_motif: ["achat", "essai", "remboursement"],
      song_status: [
        "draft",
        "generating",
        "preview_ready",
        "awaiting_payment",
        "paid",
        "delivered",
        "failed",
      ],
    },
  },
} as const
