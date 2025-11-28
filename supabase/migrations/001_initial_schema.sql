-- ============================================
-- LOVE PAGES - COMPLETE DATABASE SCHEMA
-- Production-ready schema for fresh installation
-- Version: 1.0
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Pages: User-created pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  
  -- Content
  hero_text TEXT,
  intro_text TEXT,
  final_message TEXT,
  
  -- Settings
  password_hash TEXT,
  is_public BOOLEAN DEFAULT false,
  background_music_url TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  
  -- Tier tracking
  tier_used TEXT DEFAULT 'free',
  media_count INTEGER DEFAULT 0,
  has_music BOOLEAN DEFAULT false,
  has_custom_animations BOOLEAN DEFAULT false,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT pages_tier_check CHECK (tier_used IN ('free', 'premium', 'pro'))
);

COMMENT ON TABLE pages IS 'User-created personalized pages';
COMMENT ON COLUMN pages.password_hash IS 'Bcrypt hash of page password (if protected)';

-- Memories: Timeline events for pages
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE memories IS 'Timeline events and special moments';

-- Media: Images and videos for pages
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT media_type_check CHECK (file_type IN ('image', 'video'))
);

COMMENT ON TABLE media IS 'User-uploaded images and videos';

-- Purchases: One-time tier purchases
CREATE TABLE purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  refunded_at TIMESTAMPTZ,
  
  CONSTRAINT purchases_tier_check CHECK (tier IN ('free', 'premium', 'pro')),
  CONSTRAINT purchases_status_check CHECK (status IN ('pending', 'completed', 'refunded')),
  CONSTRAINT purchases_one_per_user UNIQUE(user_id)
);

COMMENT ON TABLE purchases IS 'One-time tier purchases (pay once, use forever)';

-- Subscriptions: Monthly subscription management
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT subscriptions_tier_check CHECK (tier IN ('free', 'premium', 'pro')),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing'))
);

COMMENT ON TABLE subscriptions IS 'Monthly subscriptions for tier access';

-- Page Analytics: Track views, shares, and interactions
CREATE TABLE page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT analytics_event_check CHECK (event_type IN ('view', 'share', 'click', 'interaction'))
);

COMMENT ON TABLE page_analytics IS 'Analytics events for pages (Pro tier feature)';

-- ============================================
-- INDEXES
-- ============================================

-- Pages
CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_template_name ON pages(template_name);
CREATE INDEX idx_pages_public ON pages(is_public) WHERE is_public = true;
CREATE INDEX idx_pages_created ON pages(created_at DESC);

-- Memories
CREATE INDEX idx_memories_page_id ON memories(page_id);
CREATE INDEX idx_memories_order ON memories(page_id, display_order);

-- Media
CREATE INDEX idx_media_page_id ON media(page_id);
CREATE INDEX idx_media_order ON media(page_id, display_order);

-- Purchases
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchases_stripe_pi ON purchases(stripe_payment_intent_id);

-- Subscriptions
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status) WHERE status = 'active';
CREATE INDEX idx_subscriptions_stripe_sub ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_period_end ON subscriptions(current_period_end) WHERE status = 'active';

-- Analytics
CREATE INDEX idx_analytics_page_id ON page_analytics(page_id);
CREATE INDEX idx_analytics_event_type ON page_analytics(event_type);
CREATE INDEX idx_analytics_created ON page_analytics(created_at DESC);
CREATE INDEX idx_analytics_page_date ON page_analytics(page_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Pages: Users manage their own, public pages viewable by all
CREATE POLICY "Users can view their own pages"
  ON pages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public pages"
  ON pages FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create their own pages"
  ON pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages"
  ON pages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages"
  ON pages FOR DELETE
  USING (auth.uid() = user_id);

-- Memories: Follow page access
CREATE POLICY "Users can manage their page memories"
  ON memories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = memories.page_id
      AND pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public page memories"
  ON memories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = memories.page_id
      AND pages.is_public = true
    )
  );

-- Media: Follow page access
CREATE POLICY "Users can manage their page media"
  ON media FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = media.page_id
      AND pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public page media"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = media.page_id
      AND pages.is_public = true
    )
  );

-- Purchases: Users can only view their own
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Subscriptions: Users can view their own
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Analytics: Page owners can view, anyone can insert
CREATE POLICY "Page owners can view analytics"
  ON page_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = page_analytics.page_id
      AND pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics"
  ON page_analytics FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Get user's current tier
CREATE OR REPLACE FUNCTION get_user_tier(user_uuid UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    (SELECT tier FROM subscriptions 
     WHERE user_id = user_uuid 
     AND status = 'active' 
     AND current_period_end > NOW()
     LIMIT 1),
    (SELECT tier FROM purchases 
     WHERE user_id = user_uuid 
     AND status = 'completed' 
     LIMIT 1),
    'free'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_user_tier IS 'Returns user tier: free, premium, or pro (checks subscriptions first, then purchases)';

-- Get user's page count
CREATE OR REPLACE FUNCTION get_user_page_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM pages WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

COMMENT ON FUNCTION get_user_page_count IS 'Count total pages created by user';

-- Increment page view count
CREATE OR REPLACE FUNCTION increment_page_views(page_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE pages 
  SET view_count = view_count + 1 
  WHERE id = page_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment page share count
CREATE OR REPLACE FUNCTION increment_page_shares(page_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE pages 
  SET share_count = share_count + 1 
  WHERE id = page_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER set_timestamp_pages
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- ============================================
-- COMPLETE! ✨
-- ============================================

-- Database ready with:
-- ✅ 6 tables with proper constraints
-- ✅ Complete RLS policies
-- ✅ Performance indexes
-- ✅ Helper functions
-- ✅ Auto-update triggers

