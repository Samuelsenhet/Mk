-- MÄÄK Mood Database Initialization
-- Detta script sätter upp grundläggande tabeller för lokal utveckling

-- Skapa databas extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Användarprofiler
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  birth_date DATE NOT NULL,
  pronouns TEXT[],
  gender TEXT NOT NULL,
  sexuality TEXT,
  preferences TEXT[],
  ethnicity TEXT,
  intentions TEXT NOT NULL,
  relationship_type TEXT,
  height INTEGER,
  has_children TEXT,
  children_plans TEXT,
  location TEXT,
  occupation TEXT,
  education TEXT,
  bio TEXT,
  photos TEXT[],
  verification_status BOOLEAN DEFAULT FALSE,
  premium_status TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personlighetstestresultat
CREATE TABLE IF NOT EXISTS personality_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  personality_type TEXT NOT NULL,
  personality_name TEXT NOT NULL,
  category TEXT NOT NULL,
  scores JSONB NOT NULL,
  test_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matchningar
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  compatibility_score INTEGER NOT NULL,
  match_type TEXT NOT NULL, -- 'similarity' eller 'complement'
  status TEXT DEFAULT 'pending', -- 'pending', 'matched', 'declined'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Meddelanden
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR samtycke
CREATE TABLE IF NOT EXISTS user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  marketing_consent BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  functional_consent BOOLEAN DEFAULT TRUE,
  consent_version TEXT NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Dagliga frågor för community
CREATE TABLE IF NOT EXISTS daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  options TEXT[] NOT NULL,
  active_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Svar på dagliga frågor
CREATE TABLE IF NOT EXISTS daily_question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES daily_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  answer_index INTEGER NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

-- KV Store för flexibel datahantering
CREATE TABLE IF NOT EXISTS kv_store_e34211d6 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events för GDPR-kompatibel spårning
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event_name TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för prestanda
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_user_id ON personality_results(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);

-- Lägg till trigger för updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kv_store_updated_at BEFORE UPDATE ON kv_store_e34211d6
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data för utveckling
INSERT INTO daily_questions (question, category, options, active_date) VALUES
('Vad är viktigast för dig i ett förhållande?', 'Relationer', ARRAY[
  'Kommunikation och förståelse',
  'Gemensamma värderingar', 
  'Fysisk attraktion',
  'Humor och skratt',
  'Trygghet och stabilitet'
], CURRENT_DATE)
ON CONFLICT DO NOTHING;

INSERT INTO daily_questions (question, category, options, active_date) VALUES
('Vilken är din ideala dejt?', 'Aktiviteter', ARRAY[
  'Romantisk middag',
  'Äventyr utomhus',
  'Museum eller kulturell aktivitet',
  'Hemkväll med film',
  'Sportevenemang'
], CURRENT_DATE + INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- Demo användare för utveckling (använd endast i development)
DO $$
BEGIN
  IF current_setting('server_version_num')::int >= 120000 THEN
    -- Demo profiler (endast för development)
    INSERT INTO profiles (
      user_id, first_name, age, gender, sexuality, intentions, 
      bio, occupation, location, premium_status, birth_date
    ) VALUES
    (
      gen_random_uuid(),
      'Emma',
      26,
      'Kvinna',
      'Heterosexuell',
      'Långvarigt förhållande',
      'Kreativ själ som älskar konst, musik och djupa samtal. Letar efter någon som delar mina värderingar om äkthet och personlig utveckling.',
      'Grafisk Designer',
      'Stockholm',
      'free',
      '1997-05-15'
    ),
    (
      gen_random_uuid(),
      'Lucas',
      29,
      'Man',
      'Heterosexuell',
      'Långvarigt förhållande',
      'Passionerad coach som hjälper människor hitta sin potential. Älskar resor, personlig utveckling och äkta samtal.',
      'Life Coach',
      'Göteborg',
      'premium',
      '1994-08-22'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END $$;

-- Grundläggande konfiguration i KV store
INSERT INTO kv_store_e34211d6 (key, value) VALUES
('app_config', '{"version": "1.0.0", "maintenance_mode": false, "features": {"ai_companion": true, "social_trends": true, "pairing_hub": true}}'),
('personality_types', '{"diplomats": ["INFP", "INFJ", "ENFP", "ENFJ"], "builders": ["ISFJ", "ISTJ", "ESFJ", "ESTJ"], "explorers": ["ISFP", "ISTP", "ESFP", "ESTP"], "strategists": ["INTJ", "INTP", "ENTJ", "ENTP"]}'),
('matching_weights', '{"personality_similarity": 0.4, "interests_overlap": 0.3, "location_proximity": 0.2, "activity_level": 0.1}')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

COMMIT;