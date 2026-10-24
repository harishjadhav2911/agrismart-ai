-- ============================================================================
-- AGRISMART AI — CROPRELIEF PERSISTENT POSTGRESQL SCHEMA
-- Target Database: Supabase PostgreSQL (or any standard PostgreSQL 14+)
-- ============================================================================

-- 1. Relief Sources Table
CREATE TABLE IF NOT EXISTS relief_sources (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_mr TEXT NOT NULL,
  name_hi TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  base_url TEXT NOT NULL,
  is_official BOOLEAN DEFAULT true,
  update_frequency_hours INT DEFAULT 24,
  last_checked_at TIMESTAMPTZ,
  last_successful_sync_at TIMESTAMPTZ,
  status VARCHAR(32) DEFAULT 'online',
  failure_count INT DEFAULT 0,
  last_error TEXT,
  notes TEXT
);

-- 2. Relief Announcements Table (Primary Live Feed & Historical Records)
CREATE TABLE IF NOT EXISTS relief_announcements (
  id VARCHAR(128) PRIMARY KEY,
  source_id VARCHAR(64) NOT NULL,
  source_name TEXT NOT NULL,
  title TEXT NOT NULL,
  title_mr TEXT,
  title_hi TEXT,
  summary TEXT NOT NULL,
  summary_mr TEXT,
  summary_hi TEXT,
  original_url TEXT NOT NULL,
  canonical_url TEXT,
  category VARCHAR(64) NOT NULL,
  published_at TIMESTAMPTZ,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fetched_at TIMESTAMPTZ,
  evidence_status VARCHAR(64) NOT NULL,
  department TEXT,
  verified_gr_number TEXT,
  verified_gr_url TEXT,
  financial_amount TEXT,
  reported_eligible_count TEXT,
  confirmed_beneficiaries_count TEXT,
  academic_year TEXT,
  geographic_scope TEXT,
  verification_notes JSONB NOT NULL DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::text[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_published_at ON relief_announcements(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_announcements_evidence_status ON relief_announcements(evidence_status);
CREATE INDEX IF NOT EXISTS idx_announcements_canonical_url ON relief_announcements(canonical_url);

-- 3. Government Resolutions Table
CREATE TABLE IF NOT EXISTS government_resolutions (
  id VARCHAR(128) PRIMARY KEY,
  gr_number TEXT NOT NULL,
  department TEXT NOT NULL,
  department_mr TEXT,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  title_mr TEXT,
  pdf_url TEXT NOT NULL,
  authorized_relief_summary TEXT,
  affected_districts TEXT[],
  affected_talukas_count INT,
  evidence_status VARCHAR(64) NOT NULL,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Drought Locations Table
CREATE TABLE IF NOT EXISTS drought_locations (
  id VARCHAR(128) PRIMARY KEY,
  district TEXT NOT NULL,
  district_mr TEXT,
  district_hi TEXT,
  taluka TEXT NOT NULL,
  taluka_mr TEXT,
  taluka_hi TEXT,
  revenue_circle TEXT,
  season_year TEXT NOT NULL,
  category VARCHAR(64) NOT NULL,
  official_gr_number TEXT,
  gr_date TEXT,
  source_document_url TEXT,
  evidence_status VARCHAR(64) NOT NULL,
  applicable_measures TEXT[],
  verification_note JSONB,
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drought_locations_district ON drought_locations(district);
CREATE INDEX IF NOT EXISTS idx_drought_locations_taluka ON drought_locations(taluka);

-- 5. Relief Rates Table
CREATE TABLE IF NOT EXISTS relief_rates (
  id VARCHAR(64) PRIMARY KEY,
  land_category VARCHAR(32) NOT NULL,
  disaster_type VARCHAR(64) NOT NULL,
  central_sdrf_per_hectare NUMERIC,
  maharashtra_enhanced_per_hectare NUMERIC,
  central_max_area_hectares NUMERIC,
  state_max_area_hectares NUMERIC,
  min_damage_threshold_percent INT,
  source_gr_reference TEXT,
  source_url TEXT,
  effective_dates TEXT,
  evidence_status VARCHAR(64) NOT NULL,
  conditions TEXT[],
  last_verified_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Ingestion Runs (Audit Logs)
CREATE TABLE IF NOT EXISTS ingestion_runs (
  id VARCHAR(128) PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trigger_type VARCHAR(32) NOT NULL,
  sources_checked INT NOT NULL,
  new_records_found INT NOT NULL,
  verified_records_count INT NOT NULL,
  pending_review_count INT NOT NULL,
  failed_sources_count INT NOT NULL,
  execution_duration_ms INT NOT NULL,
  details JSONB NOT NULL DEFAULT '[]'::jsonb,
  errors JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ingestion_runs_timestamp ON ingestion_runs(timestamp DESC);

-- 7. Sync Locks (Distributed Lock for Cron & Concurrency Control)
CREATE TABLE IF NOT EXISTS sync_locks (
  lock_name VARCHAR(64) PRIMARY KEY,
  locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  locked_by TEXT
);

-- ============================================================================
-- 8. Users Table (User Management & Farmer Profiles)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(128) PRIMARY KEY,
  name TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32),
  role VARCHAR(32) NOT NULL DEFAULT 'farmer',
  account_status VARCHAR(32) NOT NULL DEFAULT 'active',
  auth_provider VARCHAR(32) NOT NULL DEFAULT 'email_password',
  preferred_language VARCHAR(10) DEFAULT 'en',
  state VARCHAR(128) DEFAULT 'Maharashtra',
  district VARCHAR(128),
  taluka VARCHAR(128),
  village VARCHAR(128),
  farm_size VARCHAR(64),
  soil_type VARCHAR(64),
  primary_crops TEXT[] DEFAULT ARRAY[]::text[],
  login_count INT NOT NULL DEFAULT 1,
  last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_login_at ON users(last_login_at DESC);

-- ============================================================================
-- 9. Login Audit Logs (Server-Side Event Tracking, 90-Day Retention)
-- ============================================================================
CREATE TABLE IF NOT EXISTS login_audit_logs (
  id VARCHAR(128) PRIMARY KEY,
  user_id VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL,
  event_type VARCHAR(32) NOT NULL, -- 'registration_success', 'login_success'
  auth_provider VARCHAR(32) NOT NULL DEFAULT 'email_password',
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_audit_logs_user_id ON login_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_audit_logs_created_at ON login_audit_logs(created_at DESC);

-- ============================================================================
-- 10. Admin Audit Logs (Tracks sensitive administrative actions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id VARCHAR(128) PRIMARY KEY,
  admin_id VARCHAR(128) NOT NULL,
  action VARCHAR(64) NOT NULL, -- 'view_users', 'update_status', 'delete_user'
  target_user_id VARCHAR(128),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- ============================================================================
-- Row Level Security (RLS) Policies (For Supabase Integration)
-- ============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'service_role_all_users') THEN
    CREATE POLICY service_role_all_users ON users FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'login_audit_logs' AND policyname = 'service_role_all_login_logs') THEN
    CREATE POLICY service_role_all_login_logs ON login_audit_logs FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_audit_logs' AND policyname = 'service_role_all_admin_logs') THEN
    CREATE POLICY service_role_all_admin_logs ON admin_audit_logs FOR ALL USING (true);
  END IF;
END $$;

