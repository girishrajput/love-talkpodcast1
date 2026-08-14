-- Extended Schema for Love Talk Podcast Database (Supabase PostgreSQL)

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles / Users Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Membership Plans Table (Dynamic Plans)
CREATE TABLE IF NOT EXISTS membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  target_audience TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_period TEXT DEFAULT 'year', -- 'year' or 'month'
  discounted_price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  badge TEXT, -- e.g. 'Best Value' or 'Popular'
  benefits TEXT[] DEFAULT '{}',
  razorpay_plan_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Memberships Table
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES membership_plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'expired', 'cancelled', 'failed', 'paused')),
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,
  razorpay_payment_id TEXT UNIQUE NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_subscription_id TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL CHECK (status IN ('captured', 'failed', 'refunded', 'pending')),
  payment_method TEXT DEFAULT 'upi',
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Webhook Events Table (Idempotent Webhook Processing)
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Dynamic Premium Benefits Table (25 Premium Benefits)
CREATE TABLE IF NOT EXISTS premium_benefits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Sparkles',
  is_enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  plans TEXT[] DEFAULT '{}', -- e.g. ['youth', 'professional']
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Episodes Table (Extended for Free vs Premium)
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  episode_number INTEGER UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  audio_duration INTEGER NOT NULL, -- in seconds
  cover_image TEXT NOT NULL,
  language TEXT DEFAULT 'english', -- 'english', 'hindi', or 'bilingual'
  tags TEXT[] DEFAULT '{}',
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true,
  access_type TEXT NOT NULL DEFAULT 'FREE' CHECK (access_type IN ('FREE', 'PREMIUM')),
  preview_duration INTEGER DEFAULT 60, -- preview seconds for free users
  transcript_en TEXT,
  transcript_hi TEXT,
  listens_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Subscribers Table (Newsletter)
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_benefits ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update own profile; Admins/Super Admins can read all
CREATE POLICY "Read own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = auth_user_id OR role IN ('admin', 'super_admin'));

CREATE POLICY "Update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = auth_user_id);

-- Memberships: Users read own membership; Admins/Super Admins read all
CREATE POLICY "Read own membership" ON memberships
  FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()::text) OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()::text AND role IN ('admin', 'super_admin')));

-- Payments: Users read own payments
CREATE POLICY "Read own payments" ON payments
  FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()::text) OR EXISTS (SELECT 1 FROM profiles WHERE auth_user_id = auth.uid()::text AND role IN ('admin', 'super_admin')));

-- Episodes: Anyone can read published episodes
CREATE POLICY "Public read published episodes" ON episodes
  FOR SELECT USING (is_published = true);

-- Membership Plans & Benefits: Public read
CREATE POLICY "Public read plans" ON membership_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Public read benefits" ON premium_benefits FOR SELECT USING (is_enabled = true);

-- Indexes for maximum performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order ON payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event ON webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_episodes_access_type ON episodes(access_type);
