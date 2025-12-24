-- Portfolio Supabase Database Schema
-- Run these queries in your Supabase SQL Editor
--
-- This schema is IDEMPOTENT - safe to run multiple times
-- It will drop and recreate policies/triggers if they already exist
-- Default data will only be inserted if tables are empty

-- ============================================
-- Projects Table
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  tag TEXT NOT NULL,
  tag_en TEXT NOT NULL,
  description TEXT,
  description_en TEXT,
  cover_image TEXT,
  icon TEXT,
  span_cols INTEGER DEFAULT 1,
  span_rows INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Project Images Table
-- ============================================
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Hero Content Table
-- ============================================
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  badge TEXT NOT NULL,
  badge_en TEXT NOT NULL,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_break TEXT NOT NULL,
  title_break_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  cta_primary TEXT NOT NULL,
  cta_primary_en TEXT NOT NULL,
  cta_secondary TEXT NOT NULL,
  cta_secondary_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Footer Content Table
-- ============================================
CREATE TABLE IF NOT EXISTS footer_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description TEXT NOT NULL,
  description_en TEXT NOT NULL,
  cta TEXT NOT NULL,
  cta_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_display_order ON project_images(project_id, display_order);

-- ============================================
-- Function to update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- Triggers to auto-update updated_at
-- ============================================
-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
DROP TRIGGER IF EXISTS update_hero_content_updated_at ON hero_content;
DROP TRIGGER IF EXISTS update_footer_content_updated_at ON footer_content;

-- Create triggers
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_content_updated_at BEFORE UPDATE ON hero_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON footer_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies - Public read access
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Project images are viewable by everyone" ON project_images;
DROP POLICY IF EXISTS "Hero content is viewable by everyone" ON hero_content;
DROP POLICY IF EXISTS "Footer content is viewable by everyone" ON footer_content;

-- Allow anyone to read projects
CREATE POLICY "Projects are viewable by everyone"
  ON projects FOR SELECT
  USING (true);

-- Allow anyone to read project images
CREATE POLICY "Project images are viewable by everyone"
  ON project_images FOR SELECT
  USING (true);

-- Allow anyone to read hero content
CREATE POLICY "Hero content is viewable by everyone"
  ON hero_content FOR SELECT
  USING (true);

-- Allow anyone to read footer content
CREATE POLICY "Footer content is viewable by everyone"
  ON footer_content FOR SELECT
  USING (true);

-- ============================================
-- RLS Policies - Admin write access
-- Note: Replace 'YOUR_ADMIN_USER_ID' with actual admin user ID from auth.users
-- Or use service_role key for admin operations
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Projects are editable by admin" ON projects;
DROP POLICY IF EXISTS "Project images are editable by admin" ON project_images;
DROP POLICY IF EXISTS "Hero content is editable by admin" ON hero_content;
DROP POLICY IF EXISTS "Footer content is editable by admin" ON footer_content;

-- Projects - Admin only write access
CREATE POLICY "Projects are editable by admin"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Project Images - Admin only write access
CREATE POLICY "Project images are editable by admin"
  ON project_images FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Hero Content - Admin only write access
CREATE POLICY "Hero content is editable by admin"
  ON hero_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Footer Content - Admin only write access
CREATE POLICY "Footer content is editable by admin"
  ON footer_content FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- Insert default hero content (only if table is empty)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM hero_content LIMIT 1) THEN
    INSERT INTO hero_content (
      badge, badge_en,
      title, title_en,
      title_break, title_break_en,
      description, description_en,
      cta_primary, cta_primary_en,
      cta_secondary, cta_secondary_en
    ) VALUES (
      'مرحباً أنا عبدالملك مروان 👋 مصور ومصمم',
      'Hello I''m Abdulmalik Marwan 👋 Photographer & Designer',
      'نروي القصص',
      'We Tell Stories',
      'من خلال العدسة',
      'Through the Lens',
      'متخصص في التقاط اللحظات العابرة وتحويلها إلى ذكريات خالدة. أدمج بين الفن والتكنولوجيا لخلق تجارب بصرية فريدة.',
      'Specialized in capturing fleeting moments and turning them into timeless memories. I blend art and technology to create unique visual experiences.',
      'استكشف أعمالي ↙',
      'Explore My Work ↙',
      'تواصل معي',
      'Contact Me'
    );
  END IF;
END $$;

-- ============================================
-- Insert default footer content (only if table is empty)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM footer_content LIMIT 1) THEN
    INSERT INTO footer_content (
      title, title_en,
      description, description_en,
      cta, cta_en
    ) VALUES (
      'هل لديك مشروع في ذهنك؟',
      'Have a project in mind?',
      'دعنا نعمل معاً لتحويل أفكارك إلى واقع مرئي مذهل.',
      'Let''s work together to turn your ideas into stunning visual reality.',
      'لنبدا الحديث',
      'Let''s Talk'
    );
  END IF;
END $$;

-- ============================================
-- AUTHENTICATION SETUP
-- ============================================
-- Supabase Auth is enabled by default in your Supabase project.
-- No additional tables are needed for authentication as Supabase handles
-- user authentication through the auth.users table automatically.

-- To create your first admin user:
-- 1. Go to your Supabase Dashboard: https://app.supabase.com
-- 2. Navigate to Authentication > Users
-- 3. Click "Add User" > "Create new user"
-- 4. Enter email and password
-- 5. Uncheck "Auto Confirm User" if you want email verification
-- 6. Click "Create User"

-- Email confirmation settings:
-- - Go to Authentication > Settings > Email Templates
-- - Configure email templates as needed
-- - Enable/disable email confirmation in Authentication > Settings > Auth

-- ============================================
-- ENVIRONMENT VARIABLES SETUP
-- ============================================
-- Create a .env file in your project root with:
-- VITE_SUPABASE_URL=https://your-project-id.supabase.co
-- VITE_SUPABASE_ANON_KEY=your-anon-key

-- Get these values from:
-- Supabase Dashboard > Project Settings > API

-- ============================================
-- RLS POLICY NOTES
-- ============================================
-- The RLS policies above use auth.role() = 'authenticated' which means
-- any logged-in user can perform write operations. For more granular control,
-- you can update the policies to check specific user IDs or roles.

-- Example of more restrictive policy (only specific users):
-- CREATE POLICY "Projects are editable by specific admin"
--   ON projects FOR ALL
--   USING (auth.uid() = 'specific-user-uuid-here')
--   WITH CHECK (auth.uid() = 'specific-user-uuid-here');

