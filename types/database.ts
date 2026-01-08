export interface Database {
  public: {
    Tables: {
      trump_entries: {
        Row: {
          id: string
          entry_number: number
          title: string
          date_occurred: string | null
          phase: string
          category: string
          subcategory: string | null
          synopsis: string
          keywords: string[]
          financial_cost: number | null
          danger_score: number
          lawlessness_score: number
          insanity_score: number
          absurdity_score: number
          social_media_score: number
          media_attention_score: number
          fact_check: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['trump_entries']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['trump_entries']['Insert']>
      }
      trump_sources: {
        Row: {
          id: string
          entry_id: string
          source_title: string
          source_url: string
          source_date: string | null
          is_primary: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trump_sources']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trump_sources']['Insert']>
      }
      trump_entry_links: {
        Row: {
          id: string
          from_entry_id: string
          to_entry_id: string
          relationship_type: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trump_entry_links']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trump_entry_links']['Insert']>
      }
      user_comments: {
        Row: {
          id: string
          entry_id: string
          user_name: string
          user_email: string
          comment_text: string
          is_approved: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_comments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_comments']['Insert']>
      }
      user_scores: {
        Row: {
          id: string
          entry_id: string
          user_id: string | null
          danger_score: number
          lawlessness_score: number
          insanity_score: number
          absurdity_score: number
          social_media_score: number
          media_attention_score: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_scores']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['user_scores']['Insert']>
      }
      trump_import_errors: {
        Row: {
          id: string
          import_timestamp: string
          error_message: string
          entry_data: any
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trump_import_errors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trump_import_errors']['Insert']>
      }
    }
  }
}

export type TrumpEntry = Database['public']['Tables']['trump_entries']['Row']
export type TrumpSource = Database['public']['Tables']['trump_sources']['Row']
export type TrumpEntryLink = Database['public']['Tables']['trump_entry_links']['Row']
export type UserComment = Database['public']['Tables']['user_comments']['Row']
export type UserScore = Database['public']['Tables']['user_scores']['Row']
export type TrumpImportError = Database['public']['Tables']['trump_import_errors']['Row']

export interface AggregatedUserScore {
  entry_id: string
  avg_danger_score: number
  avg_lawlessness_score: number
  avg_insanity_score: number
  avg_absurdity_score: number
  avg_social_media_score: number
  avg_media_attention_score: number
  total_votes: number
}

// Neon Database View: ai_complete_trump_data
export interface AICompleteTrumpData {
  entry_number: number
  title: string
  synopsis: string
  category: string
  subcategory: string | null
  phase: string
  age: number | null
  start_year: number | null
  date_start: string | null
  date_end: string | null
  duration_days: number | null
  fucked_up_score: string
  fucked_up_rank: string
  danger: number
  authoritarianism: number
  lawlessness: number
  insanity: number
  absurdity: number
  credibility_risk: number
  recency_intensity: number
  impact_scope: number
  rationale_short: string
  all_keywords: string[]
}
