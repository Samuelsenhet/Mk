# 🚀 MÄÄK Mood - Komplett Produktionsguide

## 📋 Översikt
Denna guide leder dig genom att sätta upp MÄÄK Mood från utvecklingsmiljö till en färdig produktionsapp med GitHub och Supabase-integration.

## 🛠️ Förutsättningar
- **Node.js** v18+
- **npm** eller **yarn**
- **Git** installerat
- **GitHub**-konto
- **Supabase**-konto (gratis)
- **Vercel**-konto (gratis) för deployment

---

## 📂 Steg 1: GitHub Repository Setup

### 1.1 Skapa GitHub Repository
```bash
# Initiera git repository lokalt
git init
git add .
git commit -m "🎉 Initial MÄÄK Mood commit"

# Skapa remote repository på GitHub
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/maak-mood.git
git branch -M main
git push -u origin main
```

### 1.2 GitHub Repository Struktur
```
MÄÄK-Mood/
├── components/          # React komponenter
├── utils/              # Utility funktioner
├── styles/             # CSS och styling
├── supabase/           # Supabase konfiguration
├── public/             # Statiska filer
├── .env.local          # Miljövariabler (lägg till i .gitignore)
├── .gitignore          # Git ignore rules
├── package.json        # Projekt dependencies
├── README.md           # Projekt dokumentation
└── PRODUCTION_SETUP_GUIDE.md
```

### 1.3 Skapa .gitignore
```bash
# Skapa .gitignore fil
cat > .gitignore << EOF
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.tsbuildinfo
next-env.d.ts

# Environment variables
.env*.local

# Vercel
.vercel

# IDE
.vscode/
.idea/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOF
```

---

## 🗄️ Steg 2: Supabase Setup

### 2.1 Skapa Supabase Projekt
1. Gå till [supabase.com](https://supabase.com)
2. Klicka "Start your project"
3. Skapa ett nytt projekt:
   - **Name**: `maak-mood-prod`
   - **Database Password**: Skapa ett starkt lösenord
   - **Region**: Välj närmaste region (t.ex. West EU för Sverige)

### 2.2 Konfigurera Databas

#### 2.2.1 Skapa Tabeller
Kör dessa SQL-kommandon i Supabase SQL Editor:

```sql
-- Användarprofiler
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE TABLE personality_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  personality_type TEXT NOT NULL,
  personality_name TEXT NOT NULL,
  category TEXT NOT NULL,
  scores JSONB NOT NULL,
  test_completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matchningar
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  compatibility_score INTEGER NOT NULL,
  match_type TEXT NOT NULL, -- 'similarity' eller 'complement'
  status TEXT DEFAULT 'pending', -- 'pending', 'matched', 'declined'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Meddelanden
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GDPR samtycke
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  analytics_consent BOOLEAN DEFAULT FALSE,
  functional_consent BOOLEAN DEFAULT TRUE,
  consent_version TEXT NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Dagliga frågor för community
CREATE TABLE daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  options TEXT[] NOT NULL,
  active_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Svar på dagliga frågor
CREATE TABLE daily_question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES daily_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  answer_index INTEGER NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

-- KV Store för flexibel datahantering
CREATE TABLE kv_store_e34211d6 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2.2.2 Sätt upp Row Level Security (RLS)
```sql
-- Aktivera RLS för alla tabeller
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_question_answers ENABLE ROW LEVEL SECURITY;

-- Policies för profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies för personality_results
CREATE POLICY "Users can view own personality" ON personality_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personality" ON personality_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies för matches
CREATE POLICY "Users can view own matches" ON matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Policies för messages
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policies för user_consents
CREATE POLICY "Users can view own consent" ON user_consents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own consent" ON user_consents FOR ALL USING (auth.uid() = user_id);
```

### 2.3 Konfigurera Edge Functions
```bash
# Installera Supabase CLI
npm install -g @supabase/cli

# Logga in på Supabase
supabase login

# Länka till ditt projekt
supabase link --project-ref DITT-PROJECT-REF

# Deploya edge functions
supabase functions deploy make-server-e34211d6
```

### 2.4 Hämta Supabase Credentials
1. Gå till Project Settings > API
2. Kopiera:
   - **Project URL**
   - **anon/public** API key
   - **service_role** API key (hemlig!)

---

## 🔐 Steg 3: Miljövariabler

### 3.1 Skapa .env.local
```bash
# Skapa miljövariabler fil
cat > .env.local << EOF
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ditt-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_DB_URL=postgresql://postgres:[PASSWORD]@db.ditt-projekt.supabase.co:5432/postgres

# OpenAI (för AI Companion)
OPENAI_API_KEY=sk-...

# App Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://maak-mood.vercel.app

# Analytics (valfritt)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...
EOF
```

### 3.2 Sätt upp GitHub Secrets
1. Gå till GitHub repo > Settings > Secrets and variables > Actions
2. Lägg till följande secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`

---

## 🚀 Steg 4: Deployment med Vercel

### 4.1 Installera Vercel CLI
```bash
npm install -g vercel
```

### 4.2 Deploya till Vercel
```bash
# Logga in på Vercel
vercel login

# Initiera Vercel-projekt
vercel

# Följ prompterna:
# ? Set up and deploy "~/maak-mood"? Y
# ? Which scope do you want to deploy to? (ditt användarnamn)
# ? Link to existing project? N
# ? What's your project's name? maak-mood
# ? In which directory is your code located? ./
```

### 4.3 Konfigurera Environment Variables i Vercel
1. Gå till Vercel Dashboard > ditt projekt > Settings > Environment Variables
2. Lägg till alla variabler från .env.local
3. Välj alla environments (Production, Preview, Development)

### 4.4 Konfigurera Build Settings
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "functions": {
    "app/**/*.tsx": {
      "runtime": "@vercel/node"
    }
  }
}
```

---

## 📱 Steg 5: PWA och Mobil Setup

### 5.1 Lägg till PWA Manifest
```json
// public/manifest.json
{
  "name": "MÄÄK Mood",
  "short_name": "MÄÄK",
  "description": "Personlighetsbaserad dejtingapp för djupa kopplingar",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FF6B6B",
  "theme_color": "#FF6B6B",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 5.2 Uppdatera HTML Head
```tsx
// components/Head.tsx
import Head from 'next/head';

export function AppHead() {
  return (
    <Head>
      <title>MÄÄK Mood - Personlighetsbaserad Dejting</title>
      <meta name="description" content="Hitta djupa kopplingar genom personlighetsbaserad matchning" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#FF6B6B" />
      <link rel="apple-touch-icon" href="/icon-192.png" />
    </Head>
  );
}
```

---

## 🔧 Steg 6: CI/CD Pipeline

### 6.1 GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./
```

---

## 📊 Steg 7: Monitoring och Analytics

### 7.1 Supabase Analytics
```sql
-- Skapa analytics tabell
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index för prestanda
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
```

### 7.2 Error Tracking
```typescript
// utils/error-tracking.ts
export const trackError = (error: Error, context?: any) => {
  console.error('App Error:', error, context);
  
  // Skicka till Supabase eller annan service
  if (typeof window !== 'undefined') {
    fetch('/api/track-error', {
      method: 'POST',
      body: JSON.stringify({
        error: error.message,
        stack: error.stack,
        context,
        url: window.location.href,
        userAgent: navigator.userAgent
      })
    });
  }
};
```

---

## 🛡️ Steg 8: Säkerhet och GDPR

### 8.1 GDPR Compliance Checklist
- [ ] Cookie consent banner implementerad
- [ ] Användardata kan exporteras
- [ ] Användardata kan raderas
- [ ] Samtycke loggas med IP och timestamp
- [ ] Integritetspolicy skapad
- [ ] Användarvillkor skapade

### 8.2 Säkerhetskonfiguration
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Säkerhetshuvuden
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline'"
  );
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 📱 Steg 9: App Store Deployment (Valfritt)

### 9.1 Konvertera till Native App med Capacitor
```bash
# Installera Capacitor
npm install @capacitor/core @capacitor/cli

# Initiera Capacitor
npx cap init MÄÄK com.maak.mood

# Lägg till plattformar
npx cap add ios
npx cap add android

# Bygg och synka
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

---

## ✅ Steg 10: Lansering Checklist

### 10.1 Pre-Launch Checklist
- [ ] Alla tests passerar
- [ ] Responsiv design verifierad
- [ ] GDPR compliance implementerad
- [ ] Säkerhetshuvuden konfigurerade
- [ ] Environment variables satta
- [ ] Database migrations körda
- [ ] Edge functions deployade
- [ ] Monitoring setup
- [ ] Error tracking aktiverat
- [ ] Domain konfigurerad
- [ ] SSL certifikat installerat

### 10.2 Post-Launch Monitoring
- [ ] Övervaka applikationsloggar
- [ ] Kontrollera användarmätningar
- [ ] Verifiera API response times
- [ ] Övervaka databaskapacitet
- [ ] Kontrollera error rates

---

## 🎉 Grattis!

Din MÄÄK Mood app är nu redo för produktion! Appen inkluderar:

- ✅ **Fullständig autentisering** med Supabase
- ✅ **Personlighetsbaserad matchning** 
- ✅ **Realtidschatt** och meddelanden
- ✅ **AI Companion** för isbrytare
- ✅ **GDPR-kompatibel** datahantering
- ✅ **Progressive Web App** funktionalitet
- ✅ **Skalbar arkitektur** med Supabase & Vercel
- ✅ **Automatisk deployment** med CI/CD

## 📞 Support och Nästa Steg

För teknisk support eller vidareutveckling, se:
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

**Lycka till med lanseringen av MÄÄK Mood! 🚀❤️**