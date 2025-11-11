-- Imposter Game Prompts Table
-- Run this in your Supabase SQL Editor

-- Create imposter_prompts table
CREATE TABLE IF NOT EXISTS imposter_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  regular_prompt TEXT NOT NULL,
  imposter_prompt TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for optimized queries
CREATE INDEX IF NOT EXISTS idx_imposter_prompts_category ON imposter_prompts(category);
CREATE INDEX IF NOT EXISTS idx_imposter_prompts_difficulty ON imposter_prompts(difficulty);

-- Enable RLS
ALTER TABLE imposter_prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policy (read-only for authenticated users)
CREATE POLICY "Users can view imposter prompts" ON imposter_prompts
  FOR SELECT USING (true);

-- Grant permissions
GRANT SELECT ON imposter_prompts TO authenticated;

-- Add comment
COMMENT ON TABLE imposter_prompts IS 'Stores prompt pairs for the Imposter multiplayer game. Regular players receive regular_prompt, imposter receives imposter_prompt.';
