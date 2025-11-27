# 🌍 MÄÄK Mood - Open Source Utvecklingsguide

## 📋 Översikt
Denna guide hjälper dig att sätta upp en komplett open-source utvecklingsmiljö för MÄÄK Mood med gratis verktyg för datahantering, hosting och collaboration.

## 🆓 Gratis Open-Source Verktyg Stack

### 🗄️ **Databas & Backend**
- **PostgreSQL** (Open Source) - Huvuddatabas
- **Supabase** (Gratis tier) - Backend-as-a-Service
- **Firebase** (Gratis tier) - Alternativ backend
- **PlanetScale** (Gratis tier) - Serverless MySQL
- **Neon** (Gratis tier) - Serverless PostgreSQL

### 🚀 **Hosting & Deployment** 
- **Vercel** (Gratis tier) - Frontend hosting
- **Netlify** (Gratis tier) - Alternativ frontend hosting
- **Railway** (Gratis tier) - Fullstack hosting
- **Render** (Gratis tier) - Backend hosting
- **GitHub Pages** (Gratis) - Statisk hosting

### 🔧 **Development Tools**
- **VS Code** (Gratis) - IDE
- **Git** (Open Source) - Versionskontroll
- **GitHub** (Gratis för public repos) - Repository hosting
- **Docker** (Open Source) - Containerization
- **Node.js** (Open Source) - Runtime

### 📊 **Monitoring & Analytics**
- **PostHog** (Open Source) - Analytics
- **Sentry** (Gratis tier) - Error tracking
- **Grafana** (Open Source) - Monitoring dashboards
- **Prometheus** (Open Source) - Metrics collection

---

## 🏗️ Projektstruktur för Open Source

```
MÄÄK-Mood-OpenSource/
├── 📁 frontend/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   ├── styles/
│   └── package.json
├── 📁 backend/
│   ├── api/
│   ├── database/
│   ├── migrations/
│   └── package.json
├── 📁 docs/
│   ├── CONTRIBUTING.md
│   ├── API.md
│   └── DEPLOYMENT.md
├── 📁 docker/
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── 📁 .github/
│   ├── workflows/
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
├── LICENSE
├── README.md
└── CONTRIBUTING.md
```

---

## 🐳 Docker Setup för Lokal Utveckling

### Dockerfile.frontend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Dockerfile.backend
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: ../docker/Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/maak_mood
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=maak_mood
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/migrations:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

---

## 📊 Gratis Datahantering Lösningar

### 1. **Supabase (Rekommenderat)**
```bash
# Installera Supabase CLI
npm install -g @supabase/cli

# Initiera lokalt projekt
supabase init

# Starta lokal utvecklingsmiljö
supabase start

# Generera TypeScript types
supabase gen types typescript --local > types/database.ts
```

**Gratis Tier:**
- 2 projekt
- 50MB databas
- 5GB bandwidth/månad
- 2GB fillagring

### 2. **PlanetScale MySQL**
```bash
# Installera PlanetScale CLI
npm install -g @planetscale/cli

# Skapa databas
pscale database create maak-mood

# Skapa development branch
pscale branch create maak-mood development

# Öppna tunnel för lokal utveckling
pscale connect maak-mood development --port 3309
```

**Gratis Tier:**
- 1 databas
- 5GB lagring
- 1 billion row reads/månad

### 3. **Neon PostgreSQL**
```bash
# Skapa .env för Neon
echo "DATABASE_URL=postgresql://username:password@your-endpoint.neon.tech/neondb" > .env
```

**Gratis Tier:**
- 3 projekt
- 0.5GB lagring
- 100 timmar compute/månad

---

## 🚀 Deployment Alternativ

### 1. **Vercel (Rekommenderat för Frontend)**
```bash
# Installera Vercel CLI
npm install -g vercel

# Deploya
vercel

# Sätt environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 2. **Railway (Fullstack)**
```bash
# Installera Railway CLI
npm install -g @railway/cli

# Logga in
railway login

# Initiera projekt
railway init

# Deploya
railway up
```

### 3. **Render**
```yaml
# render.yaml
services:
  - type: web
    name: maak-mood-frontend
    env: node
    plan: free
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production

  - type: web
    name: maak-mood-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production

databases:
  - name: maak-mood-db
    plan: free
    postgresMajorVersion: 15
```

---

## 🔧 Development Scripts

### package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f"
  }
}
```

### Makefile för Common Tasks
```makefile
.PHONY: install dev build test clean docker-up docker-down

install:
	npm install

dev:
	npm run dev

build:
	npm run build

test:
	npm run test

clean:
	rm -rf .next node_modules

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

db-reset:
	npm run db:push -- --force-reset
	npm run db:seed

setup: install docker-up db-reset
	@echo "🚀 Development environment ready!"
```

---

## 📊 Gratis Monitoring Setup

### 1. **PostHog Analytics**
```typescript
// utils/analytics.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST
  });
}

export const analytics = {
  track: (event: string, properties?: any) => {
    posthog.capture(event, properties);
  },
  identify: (userId: string, properties?: any) => {
    posthog.identify(userId, properties);
  }
};
```

### 2. **Sentry Error Tracking**
```typescript
// utils/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

export { Sentry };
```

### 3. **Simple Logging System**
```typescript
// utils/logger.ts
interface LogEvent {
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private logs: LogEvent[] = [];

  private log(level: LogEvent['level'], message: string, data?: any) {
    const event: LogEvent = {
      level,
      message,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(event);
    console[level](message, data);
    
    // Skicka till backend eller external service
    if (typeof window !== 'undefined') {
      fetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(event)
      }).catch(() => {}); // Silent fail
    }
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  getLogs() {
    return this.logs;
  }
}

export const logger = new Logger();
```

---

## 🧪 Testing Setup

### Jest Configuration
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Test Utils
```typescript
// utils/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

---

## 🤝 Open Source Collaboration

### 1. **CONTRIBUTING.md**
```markdown
# Contributing to MÄÄK Mood

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/maak-mood.git`
3. Install dependencies: `make setup`
4. Start development: `make dev`

## Making Changes

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Make your changes
3. Add tests for new functionality
4. Run tests: `make test`
5. Commit changes: `git commit -m "Add amazing feature"`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Code Standards

- Use TypeScript for type safety
- Follow Prettier formatting
- Write tests for new features
- Update documentation

## Questions?

Open an issue or join our Discord community!
```

### 2. **GitHub Issue Templates**
```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug Report
description: File a bug report
title: "[Bug]: "
labels: ["bug", "triage"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to fill out this bug report!
  
  - type: input
    id: contact
    attributes:
      label: Contact Details
      description: How can we get in touch with you if we need more info?
      placeholder: ex. email@example.com
    validations:
      required: false

  - type: textarea
    id: what-happened
    attributes:
      label: What happened?
      description: Also tell us, what did you expect to happen?
      placeholder: Tell us what you see!
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: Please provide detailed steps to reproduce the issue
      placeholder: |
        1. Go to '...'
        2. Click on '....'
        3. Scroll down to '....'
        4. See error
    validations:
      required: true

  - type: dropdown
    id: browsers
    attributes:
      label: What browsers are you seeing the problem on?
      multiple: true
      options:
        - Firefox
        - Chrome
        - Safari
        - Microsoft Edge
```

### 3. **Pull Request Template**
```markdown
# .github/PULL_REQUEST_TEMPLATE.md

## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

---

## 🚀 CI/CD Pipeline för Open Source

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run type check
      run: npm run type-check
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}

  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build

  deploy-preview:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        github-comment: true

  deploy-production:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Production
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

---

## 📚 Documentation Setup

### README.md för Open Source
```markdown
# 🌟 MÄÄK Mood - Open Source Dating App

[![CI/CD](https://github.com/username/maak-mood/actions/workflows/ci.yml/badge.svg)](https://github.com/username/maak-mood/actions)
[![codecov](https://codecov.io/gh/username/maak-mood/branch/main/graph/badge.svg)](https://codecov.io/gh/username/maak-mood)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Personlighetsbaserad dejtingapp som fokuserar på djupa kopplingar istället för ytliga swipes.

## ✨ Features

- 🧠 Personlighetsbaserad matchning
- 💬 AI-driven conversation starters
- 🔒 GDPR-kompatibel dataskydd
- 📱 Progressive Web App
- 🌐 Open Source och självhostning-vänlig

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/username/maak-mood.git
cd maak-mood

# Setup development environment
make setup

# Start development server
make dev
```

Visit `http://localhost:3000` to see the app!

## 📖 Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Architecture Overview](docs/ARCHITECTURE.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
```

---

## 🏆 Gratis Services Sammanfattning

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Supabase** | 2 projket, 50MB DB | Backend, Auth, Database |
| **Vercel** | 100GB bandwidth | Frontend Hosting |
| **PlanetScale** | 5GB, 1B row reads | MySQL Database |
| **Railway** | $5 credit/month | Fullstack Hosting |
| **PostHog** | 1M events/month | Analytics |
| **Sentry** | 5K errors/month | Error Tracking |
| **GitHub** | Unlimited public repos | Code Hosting |
| **Codecov** | Unlimited public repos | Code Coverage |

---

## 🎯 Nästa Steg

1. **Fork projektet** och skapa din egen version
2. **Sätt upp development environment** med Docker
3. **Välj gratis hosting** (Vercel rekommenderas)
4. **Konfigurera monitoring** med PostHog/Sentry
5. **Bidra tillbaka** till open source community!

**Happy coding! 🚀💻**