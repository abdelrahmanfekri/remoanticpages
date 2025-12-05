-- Migration: Update tier constraints to support new pricing structure
-- Changes: Remove 'premium' tier, add 'lifetime' tier

-- Update purchases table constraint
ALTER TABLE purchases
  DROP CONSTRAINT IF EXISTS purchases_tier_check;

ALTER TABLE purchases
  ADD CONSTRAINT purchases_tier_check CHECK (tier IN ('free', 'pro', 'lifetime'));

-- Update subscriptions table constraint
ALTER TABLE subscriptions
  DROP CONSTRAINT IF EXISTS subscriptions_tier_check;

ALTER TABLE subscriptions
  ADD CONSTRAINT subscriptions_tier_check CHECK (tier IN ('free', 'pro', 'lifetime'));

-- Update pages table constraint for tier_used
ALTER TABLE pages
  DROP CONSTRAINT IF EXISTS pages_tier_used_check;

ALTER TABLE pages
  ADD CONSTRAINT pages_tier_used_check CHECK (tier_used IN ('free', 'pro', 'lifetime'));

-- Note: Existing 'premium' tier records should be migrated to 'pro' tier
-- Run this query manually after reviewing existing data:
-- UPDATE subscriptions SET tier = 'pro' WHERE tier = 'premium';
-- UPDATE purchases SET tier = 'pro' WHERE tier = 'premium';
-- UPDATE pages SET tier_used = 'pro' WHERE tier_used = 'premium';

