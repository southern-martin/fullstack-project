# Fullstack Project Makefile
# Provides easy access to common build and development commands

.PHONY: help setup build start debug dev stop restart test clean health logs
.PHONY: backend-setup backend-build backend-start backend-debug backend-test
.PHONY: frontend-setup frontend-build frontend-start frontend-debug frontend-test
.PHONY: react-admin2-setup react-admin2-build react-admin2-start react-admin2-debug react-admin2-test react-admin2-stop
.PHONY: go-build go-run go-debug
.PHONY: docker-clean docker-clean-all docker-clean-system docker-clean-auth docker-status
.PHONY: docker-build docker-up docker-down docker-start docker-restart docker-logs
.PHONY: init-secrets load-env start-local stop-local restart-local logs-local

# Default target
help:
	@echo "Fullstack Project Makefile"
	@echo ""
	@echo "🚀 Quick Start (Local Development with Secrets):"
	@echo "  init-secrets    - Generate local development secrets (run once)"
	@echo "  load-env        - Load secrets and create .env file"
	@echo "  start-local     - Start all services locally with secrets"
	@echo "  stop-local      - Stop local services"
	@echo "  restart-local   - Restart local services"
	@echo "  logs-local      - View logs from local services"
	@echo ""
	@echo "Available targets:"
	@echo "  setup           - Setup build environment and install dependencies"
	@echo "  build           - Build all projects"
	@echo "  start           - Start all development servers (legacy)"
	@echo "  debug           - Start all services in debug mode"
	@echo "  dev             - Start all services in development mode with hot reload"
	@echo "  stop            - Stop all running services"
	@echo "  restart         - Restart all services"
	@echo "  test            - Run all tests"
	@echo "  clean           - Clean all build artifacts"
	@echo "  health          - Check health of all services"
	@echo ""
	@echo "Docker targets:"
	@echo "  docker-build    - Build Docker containers"
	@echo "  docker-up       - Start Docker containers"
	@echo "  docker-down     - Stop Docker containers"
	@echo "  docker-start    - Start Docker containers (alias for docker-up)"
	@echo "  docker-restart  - Restart Docker containers"
	@echo "  docker-logs     - View Docker container logs"
	@echo "  docker-clean    - Clean up Docker containers and volumes"
	@echo "  docker-clean-all- Clean up all southern-martin Docker resources"
	@echo "  docker-clean-system- Clean up entire Docker system (WARNING!)"
	@echo "  docker-clean-auth- Clean up Auth Service Docker resources"
	@echo "  docker-status   - Show status of all Docker resources"
	@echo ""
	@echo "Backend-specific targets:"
	@echo "  backend-setup   - Setup backend only"
	@echo "  backend-build   - Build backend only"
	@echo "  backend-start   - Start backend only"
	@echo "  backend-debug   - Start backend in debug mode"
	@echo "  backend-test    - Test backend only"
	@echo ""
	@echo "Frontend-specific targets:"
	@echo "  frontend-setup  - Setup frontend only"
	@echo "  frontend-build  - Build frontend only"
	@echo "  frontend-start  - Start frontend only"
	@echo "  frontend-debug  - Start frontend in debug mode"
	@echo "  frontend-test   - Test frontend only"
	@echo ""
	@echo "React Admin 2 targets:"
	@echo "  react-admin2-setup  - Setup React Admin 2 only"
	@echo "  react-admin2-build  - Build React Admin 2 only"
	@echo "  react-admin2-start  - Start React Admin 2 only"
	@echo "  react-admin2-debug  - Start React Admin 2 in debug mode"
	@echo "  react-admin2-test   - Test React Admin 2 only"
	@echo "  react-admin2-stop   - Stop React Admin 2"
	@echo ""
	@echo "Go API targets:"
	@echo "  go-build        - Build Go API"
	@echo "  go-run          - Run Go API"
	@echo "  go-debug        - Run Go API in debug mode"
	@echo ""
	@echo "Examples:"
	@echo "  make setup      # Setup everything"
	@echo "  make dev        # Start all in development mode"
	@echo "  make debug      # Start all in debug mode"
	@echo "  make stop       # Stop all services"
	@echo "  make react-admin2-start  # Start React Admin 2 only"
	@echo "  make react-admin2-quick  # Quick setup and start React Admin 2"

# Setup and build targets
setup:
	@echo "Setting up build environment..."
	@./scripts/dev.sh setup

build:
	@echo "Building all projects..."
	@./scripts/dev.sh build

# Development targets
start:
	@echo "Starting all development servers..."
	@./scripts/dev.sh start

debug:
	@echo "Starting all services in debug mode..."
	@./scripts/dev.sh debug

dev:
	@echo "Starting all services in development mode..."
	@./scripts/dev.sh dev

# Control targets
stop:
	@echo "Stopping all services..."
	@./scripts/dev.sh stop

restart:
	@echo "Restarting all services..."
	@./scripts/dev.sh restart

# Testing and maintenance
test:
	@echo "Running all tests..."
	@./scripts/dev.sh test

clean:
	@echo "Cleaning all build artifacts..."
	@./scripts/dev.sh clean

health:
	@echo "Checking health of all services..."
	@./scripts/dev.sh health

# Backend-specific targets
backend-setup:
	@echo "Setting up backend..."
	@./scripts/dev.sh backend-setup

backend-build:
	@echo "Building backend..."
	@./scripts/dev.sh backend-build

backend-start:
	@echo "Starting backend..."
	@./scripts/dev.sh backend-start

backend-debug:
	@echo "Starting backend in debug mode..."
	@./scripts/dev.sh backend-debug

backend-test:
	@echo "Testing backend..."
	@./scripts/dev.sh backend-test

# Frontend-specific targets
frontend-setup:
	@echo "Setting up frontend..."
	@./scripts/dev.sh frontend-setup

frontend-build:
	@echo "Building frontend..."
	@./scripts/dev.sh frontend-build

frontend-start:
	@echo "Starting frontend..."
	@./scripts/dev.sh frontend-start

frontend-debug:
	@echo "Starting frontend in debug mode..."
	@./scripts/dev.sh frontend-debug

frontend-test:
	@echo "Testing frontend..."
	@./scripts/dev.sh frontend-test

# React Admin 2 specific targets
react-admin2-setup:
	@echo "Setting up React Admin 2..."
	@cd react-admin2 && npm install
	@echo "✅ React Admin 2 setup completed!"

react-admin2-build:
	@echo "Building React Admin 2..."
	@cd react-admin2 && npm run build
	@echo "✅ React Admin 2 build completed!"

react-admin2-start:
	@echo "🚀 Starting React Admin 2..."
	@cd react-admin2 && npm start
	@echo "✅ React Admin 2 started on http://localhost:3000!"

react-admin2-debug:
	@echo "🐛 Starting React Admin 2 in debug mode..."
	@cd react-admin2 && npm start
	@echo "✅ React Admin 2 debug mode started!"

react-admin2-test:
	@echo "Testing React Admin 2..."
	@cd react-admin2 && npm test
	@echo "✅ React Admin 2 tests completed!"

react-admin2-stop:
	@echo "🛑 Stopping React Admin 2..."
	@pkill -f "react-admin2.*npm start" || true
	@pkill -f "react-scripts start" || true
	@echo "✅ React Admin 2 stopped!"

# Go API targets
go-build:
	@echo "Building Go API..."
	@./scripts/dev.sh go-build

go-run:
	@echo "Running Go API..."
	@./scripts/dev.sh go-run

go-debug:
	@echo "Running Go API in debug mode..."
	@./scripts/dev.sh go-debug

# Quick development commands
quick-start: setup start
	@echo "Quick start completed!"

quick-dev: setup dev
	@echo "Quick development setup completed!"

quick-debug: setup debug
	@echo "Quick debug setup completed!"

# React Admin 2 quick commands
react-admin2-quick: react-admin2-setup react-admin2-start
	@echo "React Admin 2 quick start completed!"

react-admin2-dev: react-admin2-setup react-admin2-start
	@echo "React Admin 2 development setup completed!"

# Docker management targets
docker-build:
	@echo "🐳 Building Docker containers..."
	@cd auth-service && npm run docker:build
	@echo "✅ Docker containers built successfully!"

docker-up:
	@echo "🚀 Starting Docker containers..."
	@cd auth-service && npm run docker:start
	@echo "✅ Docker containers started successfully!"

docker-start: docker-up
	@echo "🚀 Docker containers started!"

docker-down:
	@echo "🛑 Stopping Docker containers..."
	@cd auth-service && docker-compose down
	@echo "✅ Docker containers stopped!"

docker-restart:
	@echo "🔄 Restarting Docker containers..."
	@cd auth-service && docker-compose restart
	@echo "✅ Docker containers restarted!"

docker-logs:
	@echo "📋 Viewing Docker container logs..."
	@cd auth-service && docker-compose logs -f

# Docker cleanup targets
docker-clean:
	@echo "🧹 Cleaning up Docker containers and resources..."
	@docker-compose down --remove-orphans || true
	@docker volume prune -f
	@docker image prune -f
	@echo "✅ Docker cleanup completed!"

docker-clean-all:
	@echo "🧹 Performing comprehensive Docker cleanup..."
	@docker-compose down --remove-orphans || true
	@docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES | awk '{print $$1}' | xargs -r docker stop || true
	@docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES | awk '{print $$1}' | xargs -r docker rm -f || true
	@docker volume ls --filter "name=southern-martin" --format "{{.Name}}" | xargs -r docker volume rm -f || true
	@docker images --filter "reference=*southern-martin*" --format "{{.Repository}}:{{.Tag}}" | xargs -r docker rmi -f || true
	@docker network ls --filter "name=southern-martin" --format "{{.Name}}" | xargs -r docker network rm || true
	@docker image prune -f
	@echo "✅ Comprehensive Docker cleanup completed!"

docker-clean-system:
	@echo "⚠️  WARNING: This will perform a system-wide Docker cleanup!"
	@echo "This will remove ALL unused containers, networks, images, and volumes."
	@echo "Make sure you don't have any important data in unused Docker resources."
	@read -p "Are you sure you want to continue? (y/N): " -n 1 -r && echo; \
	if [ "$$REPLY" = "y" ] || [ "$$REPLY" = "Y" ]; then \
		echo "🧹 Starting system-wide Docker cleanup..."; \
		docker container prune -f; \
		docker network prune -f; \
		docker image prune -a -f; \
		docker volume prune -f; \
		docker builder prune -a -f; \
		docker system prune -a -f --volumes; \
		echo "✅ System-wide Docker cleanup completed!"; \
	else \
		echo "❌ Cleanup cancelled."; \
	fi

docker-clean-auth:
	@echo "🧹 Cleaning up Auth Service Docker resources..."
	@cd auth-service && npm run docker:clean
	@echo "✅ Auth Service Docker cleanup completed!"

docker-status:
	@echo "📊 Docker Status:"
	@echo "Containers:"
	@docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" || echo "No containers found"
	@echo ""

# ==========================================
# LOCAL DEVELOPMENT WITH SECRETS
# ==========================================

init-secrets:
	@echo "🔐 Initializing local development secrets..."
	@./scripts/init-local-secrets.sh

load-env:
	@echo "🔄 Loading environment configuration..."
	@./scripts/load-env.sh

start-local: load-env
	@echo "🚀 Starting all services locally with externalized secrets..."
	@docker-compose -f docker-compose.local.yml up -d
	@echo "✅ All services started!"
	@echo ""
	@echo "📋 Service URLs:"
	@echo "  Auth Service:        http://localhost:3001"
	@echo "  User Service:        http://localhost:3003"
	@echo "  Carrier Service:     http://localhost:3004"
	@echo "  Customer Service:    http://localhost:3005"
	@echo "  Pricing Service:     http://localhost:3006"
	@echo "  React Admin:         http://localhost:3000"
	@echo ""
	@echo "📊 View logs with: make logs-local"
	@echo "🛑 Stop services with: make stop-local"

stop-local:
	@echo "🛑 Stopping local services..."
	@docker-compose -f docker-compose.local.yml down
	@echo "✅ All services stopped!"

restart-local: stop-local start-local

logs-local:
	@docker-compose -f docker-compose.local.yml logs -f

build-local:
	@echo "🔨 Building all services for local development..."
	@docker-compose -f docker-compose.local.yml build
	@echo "✅ Build completed!"

clean-local:
	@echo "🧹 Cleaning up local development environment..."
	@docker-compose -f docker-compose.local.yml down -v
	@echo "✅ Cleanup completed!"

	@echo "Images:"
	@docker images --filter "reference=*southern-martin*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" || echo "No images found"
	@echo ""
	@echo "Volumes:"
	@docker volume ls --filter "name=southern-martin" --format "table {{.Name}}\t{{.Driver}}" || echo "No volumes found"
	@echo ""
	@echo "Networks:"
	@docker network ls --filter "name=southern-martin" --format "table {{.Name}}\t{{.Driver}}" || echo "No networks found"
