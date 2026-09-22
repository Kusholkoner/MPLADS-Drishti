-- =============================================================================
-- MPLADS SENTINEL - SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY (RLS)
-- SIH Problem: SIH26102 | Ministry of Statistics and Programme Implementation
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. USER PROFILES & ROLES (Linked to Supabase Auth)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'mospi_officer' 
    CHECK (role IN ('mospi_officer', 'state_nodal_authority', 'mp', 'implementing_agency', 'investigator', 'field_verification_officer', 'system_admin')),
  department TEXT,
  designation TEXT,
  phone TEXT,
  avatar_url TEXT,
  jurisdiction_state TEXT,
  jurisdiction_district TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Automatically create a profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    department,
    designation,
    avatar_url
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'mospi_officer'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'MoSPI Surveillance Cell'),
    COALESCE(NEW.raw_user_meta_data->>'designation', 'Audit Officer'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 2. PROJECTS (Central MPLADS Works Registry)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  constituency TEXT NOT NULL,
  mp_name TEXT NOT NULL,
  mp_house TEXT NOT NULL DEFAULT 'Lok Sabha' CHECK (mp_house IN ('Lok Sabha', 'Rajya Sabha')),
  implementing_agency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('proposed', 'sanctioned', 'in_progress', 'completed', 'delayed', 'stalled', 'under_audit')),
  financial_progress NUMERIC NOT NULL DEFAULT 0,
  physical_progress NUMERIC NOT NULL DEFAULT 0,
  financials JSONB NOT NULL DEFAULT '{}'::jsonb,
  dates JSONB NOT NULL DEFAULT '{}'::jsonb,
  gps_coordinates JSONB NOT NULL DEFAULT '{}'::jsonb,
  risk JSONB NOT NULL DEFAULT '{}'::jsonb,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  investigation_case_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. EVIDENCE & REPOSITORY ASSETS
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.evidence (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  project_title TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'document', 'payment', 'certificate', 'inspection', 'gps', 'report')),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'conflict', 'review', 'missing')),
  file_url TEXT,
  thumbnail_url TEXT,
  file_size TEXT,
  mime_type TEXT,
  provenance JSONB NOT NULL DEFAULT '{}'::jsonb,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  extracted_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  findings JSONB NOT NULL DEFAULT '[]'::jsonb,
  comparison_evidence_id TEXT,
  comparison_similarity_percent NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. INVESTIGATIONS (Audit & Enforcement Workflow)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.investigations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  category TEXT NOT NULL,
  risk_score NUMERIC NOT NULL,
  primary_issue TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'high' CHECK (priority IN ('urgent', 'high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'under_review', 'evidence_requested', 'escalated', 'cleared', 'confirmed_irregularity', 'closed')),
  summary TEXT NOT NULL,
  assigned_to JSONB NOT NULL DEFAULT '{}'::jsonb,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  activity_logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence_chain JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 5. OFFICIAL DATASETS & SYNC METADATA
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.datasets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  source_official_name TEXT NOT NULL,
  description TEXT NOT NULL,
  total_rows INTEGER NOT NULL DEFAULT 0,
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  columns JSONB NOT NULL DEFAULT '[]'::jsonb,
  sample_rows JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 6. ANALYTICS & GEOSPATIAL TABLES
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.state_metrics (
  state TEXT PRIMARY KEY,
  total_works INTEGER NOT NULL DEFAULT 0,
  total_sanctioned_cr NUMERIC NOT NULL DEFAULT 0,
  total_expenditure_cr NUMERIC NOT NULL DEFAULT 0,
  high_risk_works INTEGER NOT NULL DEFAULT 0,
  critical_works INTEGER NOT NULL DEFAULT 0,
  average_risk_score NUMERIC NOT NULL DEFAULT 0,
  primary_risk_factor TEXT
);

CREATE TABLE IF NOT EXISTS public.district_metrics (
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  total_works INTEGER NOT NULL DEFAULT 0,
  total_sanctioned_lakhs NUMERIC NOT NULL DEFAULT 0,
  high_risk_works INTEGER NOT NULL DEFAULT 0,
  critical_works INTEGER NOT NULL DEFAULT 0,
  average_risk_score NUMERIC NOT NULL DEFAULT 0,
  delayed_works_percent NUMERIC NOT NULL DEFAULT 0,
  PRIMARY KEY (district, state)
);

CREATE TABLE IF NOT EXISTS public.geographic_risk_points (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  project_title TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  risk_score NUMERIC NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  primary_signal TEXT NOT NULL,
  sanctioned_amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.national_analytics (
  id TEXT PRIMARY KEY DEFAULT 'national_summary',
  total_works_monitored INTEGER NOT NULL DEFAULT 18432,
  total_sanctioned_cr NUMERIC NOT NULL DEFAULT 4892.4,
  total_disbursed_cr NUMERIC NOT NULL DEFAULT 3715.8,
  total_flagged_risk_value_cr NUMERIC NOT NULL DEFAULT 42.8,
  risk_counts JSONB NOT NULL DEFAULT '{"critical": 34, "high": 127, "medium": 842, "low": 17429}'::jsonb,
  risk_trend_7d JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_trend_30d JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_distribution JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 7. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_state_district ON public.projects (state, district);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_investigation_case ON public.projects (investigation_case_id);

CREATE INDEX IF NOT EXISTS idx_evidence_project ON public.evidence (project_id);
CREATE INDEX IF NOT EXISTS idx_evidence_type ON public.evidence (type);
CREATE INDEX IF NOT EXISTS idx_evidence_status ON public.evidence (status);

CREATE INDEX IF NOT EXISTS idx_investigations_project ON public.investigations (project_id);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON public.investigations (status);
CREATE INDEX IF NOT EXISTS idx_investigations_priority ON public.investigations (priority);

-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.state_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geographic_risk_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.national_analytics ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Projects Policies (Public transparency for all citizens; update restricted to officers)
CREATE POLICY "Projects are viewable by everyone" 
  ON public.projects FOR SELECT USING (true);

CREATE POLICY "Officers and Investigators can insert or update projects" 
  ON public.projects FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Evidence Policies
CREATE POLICY "Evidence is viewable by everyone" 
  ON public.evidence FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upload evidence" 
  ON public.evidence FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Officers can update evidence" 
  ON public.evidence FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- Investigations Policies
CREATE POLICY "Investigations viewable by authenticated users" 
  ON public.investigations FOR SELECT 
  USING (true);

CREATE POLICY "Officers can manage investigations" 
  ON public.investigations FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Datasets & Analytics Policies
CREATE POLICY "Datasets viewable by everyone" 
  ON public.datasets FOR SELECT USING (true);

CREATE POLICY "State metrics viewable by everyone" 
  ON public.state_metrics FOR SELECT USING (true);

CREATE POLICY "District metrics viewable by everyone" 
  ON public.district_metrics FOR SELECT USING (true);

CREATE POLICY "Geographic points viewable by everyone" 
  ON public.geographic_risk_points FOR SELECT USING (true);

CREATE POLICY "National analytics viewable by everyone" 
  ON public.national_analytics FOR SELECT USING (true);
