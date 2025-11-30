.PHONY: help dev build deploy logs down backup clean data

# Default target
help:
	@echo "n8n Library - Available Commands"
	@echo "================================="
	@echo "  make dev      - Start development server"
	@echo "  make data     - Run ETL to generate data files"
	@echo "  make build    - Build for production (static export)"
	@echo "  make deploy   - Deploy with Docker"
	@echo "  make logs     - View container logs"
	@echo "  make down     - Stop containers"
	@echo "  make backup   - Backup data directory"
	@echo "  make clean    - Clean build artifacts"
	@echo ""

# Development server
dev:
	npm run dev

# Generate data files from source
data:
	node scripts/build-data.js

# Build for production
build:
	npm run build

# Deploy with Docker
deploy: backup
	docker compose up --build -d
	@echo "Deployed! Site available at http://localhost:3010"

# View logs
logs:
	docker compose logs -f

# Stop containers
down:
	docker compose down

# Backup data
backup:
	@mkdir -p backups
	@if [ -d "public/data" ]; then \
		tar -czf backups/data-$$(date +%Y%m%d-%H%M%S).tar.gz public/data; \
		echo "Backup created in backups/"; \
	fi

# Clean build artifacts
clean:
	rm -rf .next out node_modules/.cache

# Full rebuild
rebuild: clean data build

# Install dependencies
install:
	npm install

# Lint code
lint:
	npm run lint
