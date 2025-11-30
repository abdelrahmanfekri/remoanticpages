-- Add INSERT and UPDATE policies for subscriptions
-- Webhooks use service role key (bypasses RLS), but we add these policies
-- for completeness and potential future user-facing operations

-- Allow authenticated users to insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own subscriptions
CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Note: Stripe webhooks use service role key (SUPABASE_SERVICE_ROLE_KEY)
-- which bypasses all RLS policies. This is the standard approach for webhooks.

