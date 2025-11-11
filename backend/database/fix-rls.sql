-- Fix RLS policies to allow backend operations
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create rooms" ON rooms;
DROP POLICY IF EXISTS "Hosts can update their rooms" ON rooms;
DROP POLICY IF EXISTS "Hosts can delete their rooms" ON rooms;

-- Create new policies that work with service role
CREATE POLICY "Anyone can create rooms" ON rooms
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update rooms" ON rooms
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete rooms" ON rooms
  FOR DELETE USING (true);

-- Update room_players policies
DROP POLICY IF EXISTS "Users can join rooms" ON room_players;
DROP POLICY IF EXISTS "Users can leave rooms" ON room_players;

CREATE POLICY "Anyone can join rooms" ON room_players
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can leave rooms" ON room_players
  FOR DELETE USING (true);
