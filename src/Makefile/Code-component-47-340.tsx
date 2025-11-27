# MÄÄK Mood Development Makefile
.PHONY: help install dev build test clean docker-up docker-down setup

# Default target
help:
	@echo "🌟 MÄÄK Mood Development Commands"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make setup         Complete development environment setup"
	@echo "  make install       Install dependencies"
	@echo ""
	@echo "Development:"
	@echo "  make dev           Start development server"
	@echo "  make build         Build for production"
	@echo "  make test          Run all tests"
	@echo "  make lint          Run linter"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-up     Start all Docker services"
	@echo "  make docker-down   Stop all Docker services"
	@echo "  make docker-reset  Reset Docker environment"
	@echo ""
	@echo "Database:"
	@echo "  make db-reset      Reset database"
	@echo "  make db-seed       Seed database with test data"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean         Clean build artifacts"
	@echo "  make format        Format code"
	@echo "  make type-check    Run TypeScript checks"

# Setup complete development environment
setup: install docker-up db-reset
	@echo "🚀 Development environment ready!"
	@echo "💡 Run 'make dev' to start the development server"
	@echo "🌐 App will be available at http://localhost:3000"
	@echo "🗄️ Database admin at http://localhost:5050 (admin@maak-mood.local / admin123)"

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

# Start development server
dev:
	@echo "🚀 Starting development server..."
	npm run dev

# Build for production
build:
	@echo "🏗️ Building for production..."
	npm run build

# Run tests
test:
	@echo "🧪 Running tests..."
	npm run test

# Run linter
lint:
	@echo "🔍 Running linter..."
	npm run lint

# Format code
format:
	@echo "💅 Formatting code..."
	npm run format

# Type check
type-check:
	@echo "📝 Running TypeScript checks..."
	npm run type-check

# Start Docker services
docker-up:
	@echo "🐳 Starting Docker services..."
	docker-compose up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 10

# Stop Docker services
docker-down:
	@echo "🛑 Stopping Docker services..."
	docker-compose down

# Reset Docker environment
docker-reset:
	@echo "🔄 Resetting Docker environment..."
	docker-compose down -v
	docker-compose up -d
	@echo "⏳ Waiting for services to be ready..."
	@sleep 15

# Reset database
db-reset:
	@echo "🗄️ Resetting database..."
	docker-compose exec postgres psql -U postgres -d maak_mood_dev -f /docker-entrypoint-initdb.d/init.sql || true

# Seed database
db-seed:
	@echo "🌱 Seeding database..."
	npm run db:seed

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .next
	rm -rf node_modules/.cache
	rm -rf coverage

# Clean everything
clean-all: clean docker-down
	@echo "🧹 Cleaning everything..."
	rm -rf node_modules
	docker system prune -f

# Check if services are running
status:
	@echo "📊 Service Status:"
	@echo "=================="
	@docker-compose ps

# View logs
logs:
	@echo "📋 Viewing logs..."
	docker-compose logs -f

# Backup database
backup:
	@echo "💾 Creating database backup..."
	@timestamp=$$(date +%Y%m%d_%H%M%S) && \
	docker-compose exec -T postgres pg_dump -U postgres maak_mood_dev > backups/backup_$$timestamp.sql && \
	echo "✅ Backup created: backups/backup_$$timestamp.sql"

# Restore database from backup
restore:
	@echo "🔄 Available backups:"
	@ls -la backups/*.sql 2>/dev/null || echo "No backups found"
	@echo "Usage: make restore BACKUP=backup_20240101_120000.sql"
	@if [ -n "$(BACKUP)" ]; then \
		echo "🔄 Restoring from $(BACKUP)..."; \
		docker-compose exec -T postgres psql -U postgres -d maak_mood_dev < backups/$(BACKUP); \
		echo "✅ Database restored from $(BACKUP)"; \
	fi

# Production deployment
deploy:
	@echo "🚀 Deploying to production..."
	@echo "⚠️  Make sure you've set up Vercel and environment variables!"
	npm run build
	vercel --prod

# Check environment
check-env:
	@echo "🔍 Checking environment..."
	@if [ ! -f .env.local ]; then \
		echo "❌ .env.local not found! Copy .env.example to .env.local"; \
		exit 1; \
	fi
	@echo "✅ Environment file found"
	@echo "✅ Environment check passed"

# Initialize project
init: check-env install
	@echo "🎉 Initializing MÄÄK Mood project..."
	@mkdir -p backups
	@mkdir -p logs
	@echo "✅ Project initialized"

# Development workflow
workflow: clean init setup test
	@echo "🎯 Development workflow completed!"
	@echo "💻 Ready for development"