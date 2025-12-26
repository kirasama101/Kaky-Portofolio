-- Migration: Add project_videos table
-- Run this in your Supabase SQL Editor

-- ============================================
-- Project Videos Table
-- ============================================
CREATE TABLE IF NOT EXISTS project_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  video_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for project_videos
-- ============================================
CREATE INDEX IF NOT EXISTS idx_project_videos_project_id ON project_videos(project_id);
CREATE INDEX IF NOT EXISTS idx_project_videos_display_order ON project_videos(project_id, display_order);

-- ============================================
-- Enable Row Level Security
-- ============================================
ALTER TABLE project_videos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies - Public read access
-- ============================================
DROP POLICY IF EXISTS "Project videos are viewable by everyone" ON project_videos;

CREATE POLICY "Project videos are viewable by everyone"
  ON project_videos FOR SELECT
  USING (true);

-- ============================================
-- RLS Policies - Admin write access
-- ============================================
DROP POLICY IF EXISTS "Project videos are editable by admin" ON project_videos;

CREATE POLICY "Project videos are editable by admin"
  ON project_videos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

