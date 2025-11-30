-- ============================================
-- HEARTFUL PAGES - BLOCK-BASED ARCHITECTURE
-- Clean schema for flexible page building
-- Version: 2.0
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Pages: User-created pages (simplified, template is just metadata)
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  
  -- Basic info
  title TEXT NOT NULL,
  recipient_name TEXT,
  
  -- Template (nullable - just for analytics/metadata, not structural)
  template_id TEXT,
  
  -- Global page theme
  theme JSONB DEFAULT '{
    "primaryColor": "#f43f5e",
    "secondaryColor": "#ec4899",
    "fontFamily": "serif",
    "backgroundColor": "#ffffff"
  }'::jsonb,
  
  -- Page settings
  settings JSONB DEFAULT '{
    "musicUrl": null,
    "isPublic": false,
    "passwordHash": null,
    "animations": {
      "enabled": true,
      "style": "smooth"
    }
  }'::jsonb,
  
  -- Tier tracking
  tier_used TEXT DEFAULT 'free',
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT pages_tier_check CHECK (tier_used IN ('free', 'premium', 'pro'))
);

COMMENT ON TABLE pages IS 'User-created pages with flexible block-based content';
COMMENT ON COLUMN pages.template_id IS 'Optional template reference for analytics only';
COMMENT ON COLUMN pages.theme IS 'Global page styling (colors, fonts, etc)';
COMMENT ON COLUMN pages.settings IS 'Page settings (music, privacy, animations, etc)';

-- Page Blocks: Flexible content blocks for pages
CREATE TABLE page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  
  -- Block info
  type TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Block content (all text, data, etc)
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Block-specific settings (styling, layout options, etc)
  settings JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT blocks_type_check CHECK (type IN (
    'hero',
    'intro',
    'text',
    'quote',
    'gallery',
    'video',
    'timeline',
    'memories',
    'countdown',
    'two-column',
    'testimonials',
    'map',
    'divider',
    'spacer',
    'button',
    'social-links',
    'final-message'
  ))
);

COMMENT ON TABLE page_blocks IS 'Flexible content blocks that make up a page';
COMMENT ON COLUMN page_blocks.type IS 'Block type (hero, gallery, timeline, etc)';
COMMENT ON COLUMN page_blocks.content IS 'Block content data (text, images, events, etc)';
COMMENT ON COLUMN page_blocks.settings IS 'Block-specific settings (colors, layout, etc)';

-- Memories: Special moments/events (linked to pages, used by memory/timeline blocks)
CREATE TABLE memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT,
  image_url TEXT,
  
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Additional metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE memories IS 'Timeline events and special moments for pages';

-- Media: Images and videos (linked to pages, used by gallery/video blocks)
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  
  storage_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  
  display_order INTEGER NOT NULL DEFAULT 0,
  
  -- Media metadata
  metadata JSONB DEFAULT '{
    "width": null,
    "height": null,
    "caption": null,
    "alt": null
  }'::jsonb,
  
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
  
  CONSTRAINT analytics_event_check CHECK (event_type IN ('view', 'share', 'click', 'interaction', 'block_interaction'))
);

COMMENT ON TABLE page_analytics IS 'Analytics events for pages (Pro tier feature)';

-- AI Suggestions: Store AI-generated suggestions for blocks and content
CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_id UUID REFERENCES pages(id) ON DELETE CASCADE,
  
  suggestion_type TEXT NOT NULL,
  context JSONB NOT NULL,
  suggestion JSONB NOT NULL,
  
  status TEXT DEFAULT 'pending',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT ai_suggestion_type_check CHECK (suggestion_type IN (
    'block_suggestion',
    'text_enhancement',
    'design_improvement',
    'layout_optimization',
    'color_palette',
    'content_generation'
  )),
  CONSTRAINT ai_status_check CHECK (status IN ('pending', 'accepted', 'rejected', 'applied'))
);

COMMENT ON TABLE ai_suggestions IS 'AI-generated suggestions for improving pages';

-- ============================================
-- INDEXES
-- ============================================

-- Pages
CREATE INDEX idx_pages_user_id ON pages(user_id);
CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_template_id ON pages(template_id) WHERE template_id IS NOT NULL;
CREATE INDEX idx_pages_created ON pages(created_at DESC);
CREATE INDEX idx_pages_settings_public ON pages((settings->>'isPublic')) WHERE (settings->>'isPublic')::boolean = true;

-- Page Blocks
CREATE INDEX idx_blocks_page_id ON page_blocks(page_id);
CREATE INDEX idx_blocks_order ON page_blocks(page_id, display_order);
CREATE INDEX idx_blocks_type ON page_blocks(type);

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

-- AI Suggestions
CREATE INDEX idx_ai_suggestions_user_id ON ai_suggestions(user_id);
CREATE INDEX idx_ai_suggestions_page_id ON ai_suggestions(page_id) WHERE page_id IS NOT NULL;
CREATE INDEX idx_ai_suggestions_type ON ai_suggestions(suggestion_type);
CREATE INDEX idx_ai_suggestions_status ON ai_suggestions(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Pages: Users manage their own, public pages viewable by all
CREATE POLICY "Users can view their own pages"
  ON pages FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public pages"
  ON pages FOR SELECT
  USING ((settings->>'isPublic')::boolean = true);

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

-- Page Blocks: Follow page access
CREATE POLICY "Users can manage their page blocks"
  ON page_blocks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = page_blocks.page_id
      AND pages.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view public page blocks"
  ON page_blocks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = page_blocks.page_id
      AND (pages.settings->>'isPublic')::boolean = true
    )
  );

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
      AND (pages.settings->>'isPublic')::boolean = true
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
      AND (pages.settings->>'isPublic')::boolean = true
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

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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

-- AI Suggestions: Users can view/manage their own
CREATE POLICY "Users can view their own ai suggestions"
  ON ai_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ai suggestions"
  ON ai_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ai suggestions"
  ON ai_suggestions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ai suggestions"
  ON ai_suggestions FOR DELETE
  USING (auth.uid() = user_id);

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

COMMENT ON FUNCTION get_user_tier IS 'Returns user tier: free, premium, or pro';

-- Get user's page count
CREATE OR REPLACE FUNCTION get_user_page_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM pages WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Get page block count
CREATE OR REPLACE FUNCTION get_page_block_count(page_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM page_blocks WHERE page_id = page_uuid);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

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

-- Reorder blocks helper
CREATE OR REPLACE FUNCTION reorder_blocks(
  page_uuid UUID,
  block_orders JSONB
)
RETURNS VOID AS $$
DECLARE
  block_record RECORD;
BEGIN
  FOR block_record IN SELECT * FROM jsonb_each_text(block_orders)
  LOOP
    UPDATE page_blocks
    SET display_order = block_record.value::INTEGER
    WHERE id = block_record.key::UUID
    AND page_id = page_uuid;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION reorder_blocks IS 'Batch update block orders for a page';

-- Duplicate block
CREATE OR REPLACE FUNCTION duplicate_block(block_uuid UUID)
RETURNS UUID AS $$
DECLARE
  new_block_id UUID;
  original_block RECORD;
  max_order INTEGER;
BEGIN
  SELECT * INTO original_block FROM page_blocks WHERE id = block_uuid;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Block not found';
  END IF;
  
  SELECT COALESCE(MAX(display_order), 0) + 1 INTO max_order 
  FROM page_blocks 
  WHERE page_id = original_block.page_id;
  
  INSERT INTO page_blocks (page_id, type, display_order, content, settings)
  VALUES (
    original_block.page_id,
    original_block.type,
    max_order,
    original_block.content,
    original_block.settings
  )
  RETURNING id INTO new_block_id;
  
  RETURN new_block_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION duplicate_block IS 'Duplicate a block with all its content and settings';

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER set_timestamp_pages
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_blocks
  BEFORE UPDATE ON page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_subscriptions
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();



