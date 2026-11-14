-- ====================================================================
-- APEX FITNESS COACHING PLATFORM - SUPABASE ENTERPRISE DATABASE SCHEMA
-- Migration: 00001_initial_schema.sql
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. ADMIN ROLES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('super_admin', 'coach', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- --------------------------------------------------------------------
-- 2. TRAINERS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  tagline VARCHAR(255),
  bio TEXT NOT NULL,
  experience_years VARCHAR(50) NOT NULL,
  certifications JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  photo_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. TRAINING PROGRAMS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.training_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  tagline VARCHAR(255),
  description TEXT NOT NULL,
  icon_name VARCHAR(50) DEFAULT 'Dumbbell',
  highlights JSONB DEFAULT '[]'::jsonb,
  cover_image TEXT NOT NULL,
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. PACKAGES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  tagline VARCHAR(255),
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  currency VARCHAR(10) DEFAULT 'USD',
  duration VARCHAR(50) NOT NULL,
  is_popular BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  program_id UUID REFERENCES public.training_programs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. PACKAGE FEATURES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.package_features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  feature_type VARCHAR(50) NOT NULL CHECK (feature_type IN ('feature', 'training', 'nutrition', 'tracking', 'support')),
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. SYLLABUS MODULES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.syllabus_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  week_or_phase VARCHAR(100) NOT NULL,
  title VARCHAR(200) NOT NULL,
  focus TEXT NOT NULL,
  objectives JSONB DEFAULT '[]'::jsonb,
  document_pdf_url TEXT,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. CLIENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  whatsapp_number VARCHAR(30) NOT NULL,
  status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  active_package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. BOOKINGS & INQUIRIES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(120) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 14 AND age <= 100),
  current_weight NUMERIC(6, 2) NOT NULL,
  height VARCHAR(50),
  fitness_goal VARCHAR(120) NOT NULL,
  preferred_package VARCHAR(150) NOT NULL,
  whatsapp_number VARCHAR(30) NOT NULL,
  message TEXT,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'enrolled', 'declined')),
  internal_notes TEXT,
  source VARCHAR(50) DEFAULT 'website_consultation_form',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. TRANSFORMATIONS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transformations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(120) NOT NULL,
  age INTEGER,
  starting_weight NUMERIC(6, 2) NOT NULL,
  current_weight NUMERIC(6, 2) NOT NULL,
  weight_unit VARCHAR(10) DEFAULT 'kg',
  weight_diff NUMERIC(6, 2) GENERATED ALWAYS AS (starting_weight - current_weight) STORED,
  duration VARCHAR(50) NOT NULL,
  fitness_goal VARCHAR(100) NOT NULL,
  story TEXT NOT NULL,
  before_image_url TEXT NOT NULL,
  after_image_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. ARTICLES (FITNESS TIPS)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(180) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('workout', 'nutrition', 'weight-loss', 'muscle-building', 'recovery')),
  read_time VARCHAR(30) NOT NULL,
  cover_image TEXT NOT NULL,
  author_name VARCHAR(100) DEFAULT 'Coach Faras',
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 11. TESTIMONIALS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name VARCHAR(120) NOT NULL,
  client_title VARCHAR(150),
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  photo_url TEXT NOT NULL,
  package_used VARCHAR(100),
  is_featured BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 12. FAQS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'General',
  display_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 13. ANNOUNCEMENTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  badge VARCHAR(50) DEFAULT 'UPDATE',
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 14. WEBSITE SETTINGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.website_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'global_config',
  brand_name VARCHAR(150) NOT NULL DEFAULT 'FARAS METHOD',
  trainer_name VARCHAR(150) NOT NULL DEFAULT 'Mohammad Faras U',
  whatsapp_number VARCHAR(30) NOT NULL DEFAULT '918138954423',
  instagram_handle VARCHAR(80) NOT NULL DEFAULT 'itsfarasu',
  contact_email VARCHAR(150) NOT NULL DEFAULT 'contact@farasmethod.com',
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 15. MEDIA ASSETS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bucket_name VARCHAR(100) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  public_url TEXT NOT NULL,
  mime_type VARCHAR(100),
  size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- INDEXES FOR FAST QUERYING
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_packages_slug ON public.packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_is_popular ON public.packages(is_popular);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transformations_is_published ON public.transformations(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON public.articles(is_published);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transformations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES
CREATE POLICY "Public read trainers" ON public.trainers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read programs" ON public.training_programs FOR SELECT USING (is_active = true);
CREATE POLICY "Public read packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public read package features" ON public.package_features FOR SELECT USING (true);
CREATE POLICY "Public read syllabus modules" ON public.syllabus_modules FOR SELECT USING (true);
CREATE POLICY "Public read transformations" ON public.transformations FOR SELECT USING (is_published = true);
CREATE POLICY "Public read articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public read testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Public read settings" ON public.website_settings FOR SELECT USING (true);

-- PUBLIC WRITE POLICIES
CREATE POLICY "Public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);

-- --------------------------------------------------------------------
-- SUPABASE STORAGE BUCKETS SETUP SCRIPT
-- --------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('trainer-photos', 'trainer-photos', true),
  ('transformation-images', 'transformation-images', true),
  ('article-images', 'article-images', true),
  ('service-images', 'service-images', true),
  ('documents-pdfs', 'documents-pdfs', false),
  ('branding-assets', 'branding-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Policies
CREATE POLICY "Public access to trainer photos" ON storage.objects FOR SELECT USING (bucket_id = 'trainer-photos');
CREATE POLICY "Public access to transformation images" ON storage.objects FOR SELECT USING (bucket_id = 'transformation-images');
CREATE POLICY "Public access to article images" ON storage.objects FOR SELECT USING (bucket_id = 'article-images');
CREATE POLICY "Public access to service images" ON storage.objects FOR SELECT USING (bucket_id = 'service-images');
CREATE POLICY "Public access to branding assets" ON storage.objects FOR SELECT USING (bucket_id = 'branding-assets');
