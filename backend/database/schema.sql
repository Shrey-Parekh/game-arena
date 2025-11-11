-- Nexus Arena Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_code TEXT UNIQUE NOT NULL,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('2-player', 'multiplayer')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'finished')),
  max_players INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 hour'),
  CONSTRAINT valid_room_code CHECK (length(room_code) = 6)
);

-- Indexes for rooms
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_rooms_expires ON rooms(expires_at);
CREATE INDEX IF NOT EXISTS idx_rooms_host ON rooms(host_id);

-- Room players table
CREATE TABLE IF NOT EXISTS room_players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_host BOOLEAN DEFAULT FALSE,
  UNIQUE(room_id, user_id)
);

-- Indexes for room_players
CREATE INDEX IF NOT EXISTS idx_room_players_room ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user ON room_players(user_id);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES auth.users(id),
  game_data JSONB DEFAULT '{}'::jsonb
);

-- Indexes for game_sessions
CREATE INDEX IF NOT EXISTS idx_game_sessions_room ON game_sessions(room_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_winner ON game_sessions(winner_id);

-- Truth or Dare questions table
CREATE TABLE IF NOT EXISTS truth_or_dare_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('truth', 'dare')),
  spice_level TEXT NOT NULL CHECK (spice_level IN ('mild', 'spicy', 'extreme')),
  content TEXT NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for truth_or_dare_questions
CREATE INDEX IF NOT EXISTS idx_questions_type_spice ON truth_or_dare_questions(type, spice_level);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE truth_or_dare_questions ENABLE ROW LEVEL SECURITY;

-- Rooms policies
CREATE POLICY "Users can view all rooms" ON rooms
  FOR SELECT USING (true);

CREATE POLICY "Users can create rooms" ON rooms
  FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their rooms" ON rooms
  FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their rooms" ON rooms
  FOR DELETE USING (auth.uid() = host_id);

-- Room players policies
CREATE POLICY "Users can view room players" ON room_players
  FOR SELECT USING (true);

CREATE POLICY "Users can join rooms" ON room_players
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave rooms" ON room_players
  FOR DELETE USING (auth.uid() = user_id);

-- Game sessions policies
CREATE POLICY "Users can view game sessions" ON game_sessions
  FOR SELECT USING (true);

CREATE POLICY "System can manage game sessions" ON game_sessions
  FOR ALL USING (true);

-- Questions policies (read-only for users)
CREATE POLICY "Users can view questions" ON truth_or_dare_questions
  FOR SELECT USING (true);

-- Grant permissions
GRANT ALL ON rooms TO authenticated;
GRANT ALL ON room_players TO authenticated;
GRANT ALL ON game_sessions TO authenticated;
GRANT SELECT ON truth_or_dare_questions TO authenticated;
