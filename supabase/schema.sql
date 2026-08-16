-- ==============================================================================
-- POG ROBLOX 3D MODELER & DIGITAL ARTIST PORTFOLIO - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROJECTS (WORKS) TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Weapons',
  status TEXT DEFAULT 'Completed',
  image_url TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  tools TEXT[] DEFAULT '{}',
  external_url TEXT,
  roblox_url TEXT,
  client TEXT,
  software TEXT,
  poly_count TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CURRENT PROJECTS (Currently Building) TABLE
CREATE TABLE IF NOT EXISTS public.current_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Development',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  image_url TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  features TEXT[] DEFAULT '{}',
  roblox_url TEXT,
  external_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. UPCOMING PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.upcoming_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Planning',
  image_url TEXT NOT NULL,
  estimated_date TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  proficiency INTEGER DEFAULT 90 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'site-config-default',
  site_name TEXT NOT NULL DEFAULT 'POG',
  hero_title TEXT NOT NULL DEFAULT 'POG',
  hero_tagline TEXT NOT NULL DEFAULT 'Roblox 3D Modeler & Digital Artist',
  hero_description TEXT NOT NULL,
  about_title TEXT NOT NULL DEFAULT 'Who''s POG',
  about_description TEXT NOT NULL,
  about_bio TEXT NOT NULL,
  discord TEXT DEFAULT 'pogger67_',
  roblox TEXT DEFAULT 'opmasteraarav1',
  roblox_profile_url TEXT DEFAULT 'https://www.roblox.com/users/profile?username=opmasteraarav1',
  footer_description TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  available_for_hire BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.current_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access to all visitors
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Current Projects" ON public.current_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Upcoming Projects" ON public.upcoming_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);

-- Allow authenticated admin users to insert, update, and delete
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Current Projects" ON public.current_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Upcoming Projects" ON public.upcoming_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Skills" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. STORAGE BUCKET SETUP
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Upload Storage" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Update Storage" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-assets');
CREATE POLICY "Admin Delete Storage" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-assets');
