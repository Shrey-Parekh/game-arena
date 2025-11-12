-- Never Have I Ever Statements Table
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS never_have_i_ever_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  statement TEXT NOT NULL,
  category VARCHAR(20) CHECK (category IN ('pg', 'adult', 'funny', 'deep')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nhie_category ON never_have_i_ever_statements(category);

ALTER TABLE never_have_i_ever_statements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view NHIE statements" ON never_have_i_ever_statements
  FOR SELECT USING (true);

GRANT SELECT ON never_have_i_ever_statements TO authenticated;
