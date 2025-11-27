# MÄÄK Mood - Komplett Installationsguide
## Från TIDE till MÄÄK - Premium Dejtingapp

### Översikt
MÄÄK Mood är en premium dejtingapp som utvecklats från TIDE-konceptet med fokus på personlighetsbaserad matchning istället för swipe-funktionalitet. Appen använder korall (#FF6B6B) som primärfärg och har en minimalistisk design med svensk text.

## 🚀 Snabbstart med Development Tools

### Steg 1: Använd Inbyggda Development Tools
1. Öppna MÄÄK Mood-appen
2. Navigera till **Profil** → **Development Tools**
3. Klicka på **"Installera Allt"** för automatisk konfiguration
4. Vänta medan alla integrationer konfigureras automatiskt

### Automatiska Konfigurationer som Skapas:
- ✅ GitHub repository med workflows
- ✅ Supabase databas med migrations  
- ✅ Prisma ORM schema
- ✅ OpenAI integration för AI Companion
- ✅ React Native konfiguration
- ✅ Jest testing framework
- ✅ GDPR-kompatibel analytics

## 🛠️ Manuell Installation (Om Behövs)

### Förutsättningar
```bash
# Node.js 18+
node --version

# npm eller yarn
npm --version

# Git
git --version

# Docker (för lokal databas)
docker --version
```

### Steg 1: Projektsetup
```bash
# Klona repository
git clone https://github.com/[USERNAME]/maak-mood.git
cd maak-mood

# Installera dependencies
npm install

# Installera globala verktyg
npm install -g @expo/cli
npm install -g @supabase/supabase-js
npm install -g prisma
```

### Steg 2: Miljövariabler
Skapa `.env.local` fil:
```env
# Supabase
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# OpenAI för AI Companion
OPENAI_API_KEY=[YOUR-OPENAI-KEY]

# Databas
DATABASE_URL=postgresql://postgres:password@localhost:5432/maak_mood

# Analytics (valfritt)
ANALYTICS_API_KEY=[YOUR-ANALYTICS-KEY]
```

### Steg 3: Databas Setup
```bash
# Starta lokal PostgreSQL (med Docker)
docker run --name maak-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=maak_mood \
  -p 5432:5432 -d postgres

# Kör Prisma migrations
npx prisma migrate dev --name init

# Generera Prisma client
npx prisma generate

# Seed database med testdata
npx prisma db seed
```

### Steg 4: Supabase Configuration
```bash
# Logga in på Supabase
npx supabase login

# Länka till ditt projekt
npx supabase link --project-ref [PROJECT-ID]

# Deploya edge functions
npx supabase functions deploy

# Konfigurera Row Level Security
npx supabase db reset
```

## 📱 React Native Setup

### iOS Setup
```bash
# Installera iOS dependencies
cd ios && pod install && cd ..

# Starta iOS simulator
npm run ios
```

### Android Setup
```bash
# Starta Android emulator
npm run android
```

### Expo Development
```bash
# Starta Expo dev server
expo start

# Kör på fysisk enhet med Expo Go
expo start --tunnel
```

## 🧪 Testing Setup

### Kör Tester
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Data
Development tools skapar automatiskt:
- 50 fake användarprofiler
- Personlighetsresultat för alla användare
- 20 test-matchningar
- Mock-meddelanden

## 🔧 Utvecklingsverktyg

### Tillgängliga Kommandon
```bash
# Utveckling
npm run dev          # Starta web dev server
npm run build        # Bygg för produktion
npm run lint         # Kör ESLint
npm run type-check   # TypeScript kontroll

# Databas
npm run db:migrate   # Kör migrations
npm run db:seed      # Seed database
npm run db:studio    # Öppna Prisma Studio
npm run db:reset     # Återställ databas

# React Native
npm run ios          # iOS development
npm run android      # Android development
expo build:ios       # Bygg iOS
expo build:android   # Bygg Android

# Testing
npm run test         # Kör alla tester
npm run test:unit    # Unit tests
npm run test:e2e     # E2E tests
npm run test:watch   # Watch mode
```

### Code Quality Tools
```bash
# Prettier formatting
npm run format

# ESLint checking
npm run lint

# TypeScript checking
npm run type-check

# Alla kvalitetskontroller
npm run check-all
```

## 🌐 Deployment

### Frontend (Netlify/Vercel)
```bash
# Bygg för produktion
npm run build

# Deploya till Netlify
netlify deploy --prod

# Deploya till Vercel
vercel --prod
```

### Backend (Supabase)
```bash
# Deploya edge functions
supabase functions deploy

# Uppdatera databas schema
supabase db push
```

### React Native (App Stores)
```bash
# iOS - App Store Connect
expo build:ios
expo upload:ios

# Android - Google Play Console
expo build:android
expo upload:android
```

## 🎨 Design System

### Färgschema
- **Primär**: #FF6B6B (Korall)
- **Sekundär**: #4ECDC4 (Turkos)
- **Bakgrund**: #FFFFFF
- **Text**: #1F2937

### Typografi
- **Font**: Poppins (Google Fonts)
- **Storlekar**: Definieras i globals.css
- **Viktningar**: 300, 400, 500, 600, 700

### Komponenter
- ShadCN UI komponenter i `/components/ui/`
- Anpassade MÄÄK-komponenter i `/components/`
- Responsive design för 375px mobil bredd

## 🔐 Säkerhet & GDPR

### GDPR Compliance
- Automatisk samtyckes-hantering
- Dataexport för användare
- Rätt till radering
- Dataminimering
- Kryptering i vila och transit

### Säkerhetsåtgärder
- Row Level Security i Supabase
- Input sanitization
- XSS protection
- CSRF protection
- Secure headers

## 📊 Analytics & Monitoring

### Tillgängliga Metrics
- Användningsstatistik
- Prestandamätningar
- Felsökning och loggar
- GDPR-kompatibel spårning

### Monitoring Tools
- Supabase Dashboard
- Custom analytics panel
- Real-time system status
- Performance monitoring

## 🆘 Felsökning

### Vanliga Problem

#### "Cannot connect to database"
```bash
# Kontrollera att PostgreSQL körs
docker ps | grep postgres

# Kontrollera environment variables
echo $DATABASE_URL

# Testa databasanslutning
npx prisma db pull
```

#### "Supabase authentication failed"
```bash
# Kontrollera API nycklar
echo $SUPABASE_URL $SUPABASE_ANON_KEY

# Testa connection
curl "$SUPABASE_URL/rest/v1/" \
  -H "apikey: $SUPABASE_ANON_KEY"
```

#### "OpenAI API errors"
```bash
# Kontrollera API nyckel
echo $OPENAI_API_KEY

# Testa API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### "React Native build errors"
```bash
# Rensa cache
expo start -c
npm start -- --reset-cache

# Installera om pods (iOS)
cd ios && rm -rf Pods && pod install && cd ..

# Rensa Android build
cd android && ./gradlew clean && cd ..
```

### Debug Mode
```bash
# Aktivera debug logging
DEBUG=* npm run dev

# React Native debugger
open "rndebugger://set-debugger-loc?host=localhost&port=8081"
```

## 📞 Support

### Utvecklingsverktyg
- Använd inbyggda Development Tools i appen
- Kvalitetskontroll och systemstatus
- Automatisk felåterställning
- Real-time monitoring

### Dokumentation
- `/CLEAN_CODE_SYSTEM.md` - Clean code standards
- `/components/` - Komponentdokumentation
- `/utils/` - Utility functions
- Supabase Dashboard för API dokumentation

### Community
- GitHub Issues för bug reports
- Discussions för funktionsförfrågningar
- Wiki för utökad dokumentation

## 🚀 Produktionsdriftsättning

### Pre-deployment Checklist
- [ ] Alla environment variables konfigurerade
- [ ] Databas migrations körda
- [ ] Tester passerar (npm test)
- [ ] Code quality checks OK (npm run check-all)
- [ ] GDPR compliance verifierad
- [ ] Performance optimering klar
- [ ] Security audit genomförd

### Production Environment
```bash
# Produktions build
NODE_ENV=production npm run build

# Kör production server
npm start

# Health check
curl http://localhost:3000/api/health
```

### Monitoring i Produktion
- Uptime monitoring
- Error tracking
- Performance metrics
- User analytics (GDPR-compliant)
- Security monitoring

---

**MÄÄK Mood** - Premium dejtingapp med personlighetsbaserad matchning
*Utvecklad från TIDE-konceptet med fokus på äkta anknytningar*

För teknisk support eller frågor, använd Development Tools i appen eller kontakta utvecklingsteamet.