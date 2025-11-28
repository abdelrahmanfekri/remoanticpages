export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      pages: {
        Row: {
          id: string
          user_id: string
          template_name: string
          slug: string
          title: string
          recipient_name: string
          hero_text: string | null
          intro_text: string | null
          final_message: string | null
          password_hash: string | null
          is_public: boolean
          background_music_url: string | null
          language: string
          tier_used: 'free' | 'premium' | 'pro'
          media_count: number
          has_music: boolean
          has_custom_animations: boolean
          view_count: number
          share_count: number
          config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_name: string
          slug: string
          title: string
          recipient_name: string
          hero_text?: string | null
          intro_text?: string | null
          final_message?: string | null
          password_hash?: string | null
          is_public?: boolean
          background_music_url?: string | null
          language?: string
          tier_used?: 'free' | 'premium' | 'pro'
          media_count?: number
          has_music?: boolean
          has_custom_animations?: boolean
          view_count?: number
          share_count?: number
          config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_name?: string
          slug?: string
          title?: string
          recipient_name?: string
          hero_text?: string | null
          intro_text?: string | null
          final_message?: string | null
          password_hash?: string | null
          is_public?: boolean
          background_music_url?: string | null
          language?: string
          tier_used?: 'free' | 'premium' | 'pro'
          media_count?: number
          has_music?: boolean
          has_custom_animations?: boolean
          view_count?: number
          share_count?: number
          config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          page_id: string
          order: number
          title: string
          description: string
          date: string
          image_url: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          order: number
          title: string
          description: string
          date: string
          image_url?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          order?: number
          title?: string
          description?: string
          date?: string
          image_url?: string | null
          display_order?: number
          created_at?: string
        }
      }
      media: {
        Row: {
          id: string
          page_id: string
          storage_path: string
          file_type: 'image' | 'video'
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          storage_path: string
          file_type: 'image' | 'video'
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          storage_path?: string
          file_type?: 'image' | 'video'
          display_order?: number
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          tier: 'free' | 'premium' | 'pro'
          amount_cents: number
          stripe_payment_intent_id: string | null
          stripe_customer_id: string | null
          status: 'pending' | 'completed' | 'refunded'
          purchased_at: string
          refunded_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          tier: 'free' | 'premium' | 'pro'
          amount_cents: number
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          status?: 'pending' | 'completed' | 'refunded'
          purchased_at?: string
          refunded_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'free' | 'premium' | 'pro'
          amount_cents?: number
          stripe_payment_intent_id?: string | null
          stripe_customer_id?: string | null
          status?: 'pending' | 'completed' | 'refunded'
          purchased_at?: string
          refunded_at?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          tier: 'free' | 'premium' | 'pro'
          status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tier: 'free' | 'premium' | 'pro'
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          current_period_start: string
          current_period_end: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tier?: 'free' | 'premium' | 'pro'
          status?: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      page_analytics: {
        Row: {
          id: string
          page_id: string
          event_type: 'view' | 'share' | 'click' | 'interaction'
          event_metadata: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          event_type: 'view' | 'share' | 'click' | 'interaction'
          event_metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          event_type?: 'view' | 'share' | 'click' | 'interaction'
          event_metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}
