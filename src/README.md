# 💕 MÄÄK Mood - Personlighetsbaserad Dejtingapp

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-green.svg)](https://supabase.com/)

> **Revolutionerar digital dejting genom personlighetsbaserad matchning istället för swipe-funktionalitet**

MÄÄK Mood är en premium dejtingapp som använder vetenskaplig personlighetsanalys för att skapa djupare, mer meningsfulla kopplingar mellan människor. Ingen swipefunktion - bara kvalitativa matchningar baserade på kompatibilitet.

## ✨ Huvudfunktioner

### 🧠 **Smart Personlighetsanalys**
- **30-frågor personlighetstest** baserat på Myers-Briggs
- **16 arketyper** fördelade på 4 profiler (Diplomater, Byggare, Upptäckare, Strateger)
- **Vetenskaplig matchning** med kompatibilitetspoäng

### 🎯 **Dual Matchningssystem**
- **🎯 Likhetsmatch** - Hitta personer med samma värderingar
- **⚡ Motsatsmatch** - Upptäck kompletterande personligheter
- **5 dagliga matchningar** med Smart flödesmatchning

### 🤖 **AI Companion**
- **Intelligent isbrytare** baserade på personlighetstyper
- **Samtalsförslag** anpassade för varje matchning
- **Relationship coaching** för djupare kopplingar

### 💬 **Avancerad Kommunikation**
- **Realtidschatt** med WebSocket-teknologi
- **Röstmeddelanden** för mer personlig kontakt
- **PairingHub** för manuell archetype-baserad parning

### 🎨 **Premium Design**
- **Korall (#FF6B6B) & Teal (#4ECDC4)** färgschema
- **Minimalistisk design** med Poppins-typsnitt
- **Responsiv** för mobil (375px bredd) med svenska text

### 🔒 **Integritetsskydd**
- **GDPR-kompatibel** datahantering
- **Omfattande integritetsinställningar**
- **Säker autentisering** med Supabase
- **Data-minimering** principer

## 🚀 Snabbstart

### Förutsättningar
- Node.js 18+
- npm eller yarn
- Git

### Installation
```bash
# Klona repository
git clone https://github.com/din-username/maak-mood.git
cd maak-mood

# Installera dependencies
npm install

# Skapa miljövariabler
cp .env.example .env.local
# Redigera .env.local med dina värden

# Starta development server
npm run dev
```

Besök `http://localhost:3000` för att se appen!

## 🏗️ Arkitektur

### Tech Stack
- **Frontend:** Next.js 13+, TypeScript, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Edge Functions, Auth)
- **Realtid:** Supabase Realtime för meddelanden
- **AI:** OpenAI GPT-4 för AI Companion
- **Analytics:** Supabase Analytics + GDPR-kompatibel spårning

### Projektstruktur
```
MÄÄK-Mood/
├── 📁 components/           # React komponenter
│   ├── ui/                 # Grundläggande UI komponenter
│   ├── figma/              # Figma-integrerade komponenter
│   ├── ProfileView.tsx     # Moderna profilvisningar
│   ├── MatchingSystem.tsx  # Huvudmatchningslogik
│   ├── AICompanion.tsx     # AI-driven isbrytare
│   └── ...
├── 📁 utils/               # Utility funktioner
│   ├── auth-sessionless.ts # Token-fri autentisering
│   ├── api-sessionless.ts  # API client med auto-retry
│   ├── analytics.ts        # GDPR-kompatibel analytics
│   └── privacy.ts          # Integritethantering
├── 📁 supabase/           # Supabase konfiguration
│   └── functions/         # Edge Functions
├── 📁 styles/             # Tailwind CSS v4 styling
└── 📁 docs/               # Dokumentation
```

## 🎯 Funktionsöversikt

### 1. **Användarskapande (5 steg)**
1. **Välkomst & Åldersverifiering** (20+ endast)
2. **Grundläggande Info** (namn, ålder, kön, sexualitet)
3. **Preferenser** (relationstyp, intentions, location)
4. **Profil & Fotos** (bio, fotos, röstmeddelande)
5. **Personlighetstest** (30 frågor → archetype)

### 2. **Matchningssystem**
- **Dagliga matchningar:** 5 nya profiler varje dag
- **Kategorisering:** 3 Likhetsmatchningar + 2 Motsatsmatchningar
- **Kvalitetsfokus:** Inga swipes, bara genomtänkta matchningar

### 3. **Community Features**
- **Dagens fråga:** Interaktiva diskussioner
- **Sociala trender:** Inlägg från matchade användare
- **Pairing Hub:** Manuell matchning baserat på arketyper

### 4. **Premium System**
- **Free Tier:** Grundläggande funktioner
- **Premium:** Utökade filter, obegränsade likes
- **Platinum:** Prioritet matchning, avancerad analytics

## 📱 Designprinciper

### Färgschema
```css
/* Primära färger */
--primary: #FF6B6B;        /* Korall */
--secondary: #4ECDC4;      /* Teal */

/* Gradienter */
--gradient-primary: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
--gradient-light: linear-gradient(135deg, #A8E6CF 0%, #FFD3E0 100%);
```

### Typografi
- **Font Family:** Poppins (300, 400, 500, 600, 700)
- **Grundstorlek:** 16px
- **Rundade hörn:** 25px för MÄÄK-känsla

### Responsivitet
- **Mobil först:** 375px bredd optimering
- **Progressive Web App** funktionalitet
- **Smooth animationer** och övergångar

## 🔧 Development

### Tillgängliga Scripts
```bash
npm run dev          # Starta development server
npm run build        # Bygg för produktion
npm run start        # Starta production server
npm run lint         # Kör ESLint
npm run type-check   # TypeScript typkontroll
npm run test         # Kör tester
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### Databas Schema
```sql
-- Huvudtabeller
- profiles             # Användarprofiler
- personality_results  # Personlighetstestresultat
- matches             # Matchningar mellan användare
- messages            # Chatmeddelanden
- user_consents       # GDPR samtycke
- daily_questions     # Community frågor
- kv_store_e34211d6   # Flexibel datalagring
```

## 🚀 Deployment

### Produktionslansering
1. **Supabase Setup:** Skapa projekt och konfigurera databas
2. **Vercel Deployment:** Anslut GitHub repo och sätt env vars
3. **Domain Configuration:** Konfigurera custom domain
4. **SSL & Security:** Aktivera HTTPS och säkerhetshuvuden

Detaljerad guide: [PRODUCTION_SETUP_GUIDE.md](PRODUCTION_SETUP_GUIDE.md)

### Open Source Development
För självhosting och open-source bidrag: [OPEN_SOURCE_DEVELOPMENT_GUIDE.md](OPEN_SOURCE_DEVELOPMENT_GUIDE.md)

## 🧪 Testing

### Test Strategy
- **Unit Tests:** Jest + Testing Library
- **Integration Tests:** Playwright
- **E2E Tests:** Cypress
- **Performance:** Lighthouse CI

```bash
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:coverage     # Coverage report
```

## 📊 Analytics & Monitoring

### GDPR-Kompatibel Analytics
```typescript
// Användning av analytics
analytics.track('profile_viewed', {
  personality_type: 'INFP',
  compatibility_score: 89
});
```

### Error Tracking
- **Sentry Integration** för error monitoring
- **Performance Metrics** med Vercel Analytics
- **User Experience** tracking med PostHog

## 🤝 Contributing

Vi välkomnar bidrag till MÄÄK Mood! Läs vår [Contributing Guide](CONTRIBUTING.md) för detaljer.

### Development Process
1. Fork repository
2. Skapa feature branch (`git checkout -b feature/amazing-feature`)
3. Commit ändringar (`git commit -m 'Add amazing feature'`)
4. Push till branch (`git push origin feature/amazing-feature`)
5. Öppna Pull Request

### Code Standards
- **TypeScript** för type safety
- **Prettier** för code formatting
- **ESLint** för kod kvalitet
- **Conventional Commits** för commit meddelanden

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 🙏 Acknowledgments

### Open Source Dependencies
- **Next.js** - React framework
- **Supabase** - Backend as a Service
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Ikoner
- **Recharts** - Charts och grafer

### Inspiration
- **Hinge** - Profildesign inspiration
- **Myers-Briggs** - Personlighetsanalys
- **Material Design** - UX principles

## 📞 Support

### Dokumentation
- **API Docs:** [docs/API.md](docs/API.md)
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Deployment:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

### Community
- **GitHub Issues:** Bugrapporter och feature requests
- **Discord:** Real-time chat och support
- **Email:** [support@maak-mood.com](mailto:support@maak-mood.com)

---

## 🌟 Roadmap

### V1.0 (Current) - MVP Launch
- ✅ Personlighetsbaserad matchning
- ✅ AI Companion för isbrytare
- ✅ Realtidschatt
- ✅ GDPR compliance
- ✅ Progressive Web App

### V1.1 - Enhanced Social
- 🔄 Video samtals integration
- 🔄 Gruppmatchningar för vänskap
- 🔄 Event planning features
- 🔄 Utökad community platform

### V1.2 - AI Evolution
- 📋 Advanced relationship coaching
- 📋 Personalized date suggestions
- 📋 Conflict resolution assistance
- 📋 Long-term compatibility tracking

### V2.0 - Ecosystem Expansion
- 📋 Native mobile apps (iOS/Android)
- 📋 Desktop application
- 📋 API för third-party integrations
- 📋 International expansion

---

**Skapad med ❤️ för djupare kopplingar mellan människor**

*MÄÄK Mood - Där personlighet möter kärlek* 💕