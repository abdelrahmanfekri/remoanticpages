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
          slug: string
          title: string
          recipient_name: string | null
          template_id: string | null
          theme: Json
          settings: Json
          tier_used: 'free' | 'premium' | 'pro'
          view_count: number
          share_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          slug: string
          title: string
          recipient_name?: string | null
          template_id?: string | null
          theme?: Json
          settings?: Json
          tier_used?: 'free' | 'premium' | 'pro'
          view_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          slug?: string
          title?: string
          recipient_name?: string | null
          template_id?: string | null
          theme?: Json
          settings?: Json
          tier_used?: 'free' | 'premium' | 'pro'
          view_count?: number
          share_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      page_blocks: {
        Row: {
          id: string
          page_id: string
          type: string
          display_order: number
          content: Json
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          type: string
          display_order?: number
          content?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          type?: string
          display_order?: number
          content?: Json
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      memories: {
        Row: {
          id: string
          page_id: string
          title: string
          description: string
          date: string | null
          image_url: string | null
          display_order: number
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          title: string
          description: string
          date?: string | null
          image_url?: string | null
          display_order?: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          title?: string
          description?: string
          date?: string | null
          image_url?: string | null
          display_order?: number
          metadata?: Json
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
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          storage_path: string
          file_type: 'image' | 'video'
          display_order?: number
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          storage_path?: string
          file_type?: 'image' | 'video'
          display_order?: number
          metadata?: Json
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
          event_type: 'view' | 'share' | 'click' | 'interaction' | 'block_interaction'
          event_metadata: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          event_type: 'view' | 'share' | 'click' | 'interaction' | 'block_interaction'
          event_metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          event_type?: 'view' | 'share' | 'click' | 'interaction' | 'block_interaction'
          event_metadata?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      ai_suggestions: {
        Row: {
          id: string
          user_id: string
          page_id: string | null
          suggestion_type: 'block_suggestion' | 'text_enhancement' | 'design_improvement' | 'layout_optimization' | 'color_palette' | 'content_generation'
          context: Json
          suggestion: Json
          status: 'pending' | 'accepted' | 'rejected' | 'applied'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          page_id?: string | null
          suggestion_type: 'block_suggestion' | 'text_enhancement' | 'design_improvement' | 'layout_optimization' | 'color_palette' | 'content_generation'
          context: Json
          suggestion: Json
          status?: 'pending' | 'accepted' | 'rejected' | 'applied'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          page_id?: string | null
          suggestion_type?: 'block_suggestion' | 'text_enhancement' | 'design_improvement' | 'layout_optimization' | 'color_palette' | 'content_generation'
          context?: Json
          suggestion?: Json
          status?: 'pending' | 'accepted' | 'rejected' | 'applied'
          created_at?: string
        }
      }
    }
  }
}
