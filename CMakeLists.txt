cmake_minimum_required(VERSION 3.16)
project(FullstackProject VERSION 1.0.0 LANGUAGES NONE)

# Project metadata
set(PROJECT_DESCRIPTION "Fullstack Microservices Project with Hybrid Database Architecture")
set(PROJECT_HOMEPAGE_URL "https://github.com/southern-martin/fullstack-project")

# Set build type to Debug by default
if(NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE Debug)
endif()

# Find required packages
find_package(PkgConfig REQUIRED)

# Find Node.js
find_program(NODE_EXECUTABLE node)
if(NOT NODE_EXECUTABLE)
    message(FATAL_ERROR "Node.js not found. Please install Node.js.")
endif()

# Find npm
find_program(NPM_EXECUTABLE npm)
if(NOT NPM_EXECUTABLE)
    message(FATAL_ERROR "npm not found. Please install npm.")
endif()

# Find Docker
find_program(DOCKER_EXECUTABLE docker)
if(NOT DOCKER_EXECUTABLE)
    message(WARNING "Docker not found. Docker-related targets will not work.")
endif()

# Find Docker Compose
find_program(DOCKER_COMPOSE_EXECUTABLE docker-compose)
if(NOT DOCKER_COMPOSE_EXECUTABLE)
    message(WARNING "Docker Compose not found. Docker Compose targets will not work.")
endif()

# Set project directories
set(FRONTEND_DIR ${CMAKE_SOURCE_DIR}/react-admin)
set(FRONTEND2_DIR ${CMAKE_SOURCE_DIR}/react-admin2)
set(GO_API_DIR ${CMAKE_SOURCE_DIR}/go-app-api)

# Set microservices directories
set(AUTH_SERVICE_DIR ${CMAKE_SOURCE_DIR}/auth-service)
set(USER_SERVICE_DIR ${CMAKE_SOURCE_DIR}/user-service)
set(CARRIER_SERVICE_DIR ${CMAKE_SOURCE_DIR}/carrier-service)
set(CUSTOMER_SERVICE_DIR ${CMAKE_SOURCE_DIR}/customer-service)
set(PRICING_SERVICE_DIR ${CMAKE_SOURCE_DIR}/pricing-service)
set(TRANSLATION_SERVICE_DIR ${CMAKE_SOURCE_DIR}/translation-service)

# Set shared infrastructure directories
set(SHARED_DIR ${CMAKE_SOURCE_DIR}/shared)
set(SHARED_DB_DIR ${CMAKE_SOURCE_DIR}/shared-database)
set(SHARED_REDIS_DIR ${CMAKE_SOURCE_DIR}/shared-redis)

# Custom targets for microservices
add_custom_target(microservices-install
    COMMAND ${CMAKE_COMMAND} -E echo "Installing microservices dependencies..."
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${AUTH_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${USER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${CARRIER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${CUSTOMER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${PRICING_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${TRANSLATION_SERVICE_DIR}
    COMMENT "Installing all microservices dependencies"
)

add_custom_target(microservices-build
    COMMAND ${CMAKE_COMMAND} -E echo "Building all microservices..."
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${AUTH_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${USER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${CARRIER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${CUSTOMER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${PRICING_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${TRANSLATION_SERVICE_DIR}
    DEPENDS microservices-install
    COMMENT "Building all microservices"
)

# Custom targets for frontend (React Admin)
add_custom_target(frontend-install
    COMMAND ${CMAKE_COMMAND} -E echo "📦 Installing React Admin dependencies..."
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${FRONTEND_DIR}
    COMMENT "Installing React Admin frontend dependencies"
)

add_custom_target(frontend-build
    COMMAND ${CMAKE_COMMAND} -E echo "🔨 Building React Admin..."
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Building React Admin frontend"
)

add_custom_target(frontend-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting React Admin..."
    COMMAND ${NPM_EXECUTABLE} start
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Starting React Admin development server (Port 3000)"
)

add_custom_target(frontend-debug
    COMMAND ${CMAKE_COMMAND} -E echo "🐛 Starting React Admin in debug mode..."
    COMMAND ${NPM_EXECUTABLE} run start:debug
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Starting React Admin in debug mode"
)

# Custom targets for frontend2 (React Admin 2)
add_custom_target(frontend2-install
    COMMAND ${CMAKE_COMMAND} -E echo "📦 Installing React Admin 2 dependencies..."
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${FRONTEND2_DIR}
    COMMENT "Installing React Admin 2 frontend dependencies"
)

add_custom_target(frontend2-build
    COMMAND ${CMAKE_COMMAND} -E echo "🔨 Building React Admin 2..."
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${FRONTEND2_DIR}
    DEPENDS frontend2-install
    COMMENT "Building React Admin 2 frontend"
)

add_custom_target(frontend2-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting React Admin 2..."
    COMMAND ${NPM_EXECUTABLE} start
    WORKING_DIRECTORY ${FRONTEND2_DIR}
    DEPENDS frontend2-install
    COMMENT "Starting React Admin 2 development server (Port 3002)"
)

# Custom targets for Go API
add_custom_target(go-api-build
    COMMAND make build
    WORKING_DIRECTORY ${GO_API_DIR}
    COMMENT "Building Go API"
)

add_custom_target(go-api-run
    COMMAND make run
    WORKING_DIRECTORY ${GO_API_DIR}
    DEPENDS go-api-build
    COMMENT "Running Go API"
)

add_custom_target(go-api-debug
    COMMAND make debug
    WORKING_DIRECTORY ${GO_API_DIR}
    DEPENDS go-api-build
    COMMENT "Running Go API in debug mode"
)

# Individual service targets
add_custom_target(auth-service-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting Auth Service (Port 3001)..."
    COMMAND ${NPM_EXECUTABLE} run start:dev
    WORKING_DIRECTORY ${AUTH_SERVICE_DIR}
    COMMENT "Starting Auth Service in development mode"
)

add_custom_target(user-service-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting User Service (Port 3003)..."
    COMMAND ${NPM_EXECUTABLE} run start:dev
    WORKING_DIRECTORY ${USER_SERVICE_DIR}
    COMMENT "Starting User Service in development mode"
)

add_custom_target(customer-service-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting Customer Service (Port 3004)..."
    COMMAND ${NPM_EXECUTABLE} run start:dev
    WORKING_DIRECTORY ${CUSTOMER_SERVICE_DIR}
    COMMENT "Starting Customer Service in development mode"
)

add_custom_target(carrier-service-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting Carrier Service (Port 3005)..."
    COMMAND ${NPM_EXECUTABLE} run start:dev
    WORKING_DIRECTORY ${CARRIER_SERVICE_DIR}
    COMMENT "Starting Carrier Service in development mode"
)

add_custom_target(pricing-service-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting Pricing Service (Port 3006)..."
    COMMAND ${NPM_EXECUTABLE} run start:dev
    WORKING_DIRECTORY ${PRICING_SERVICE_DIR}
    COMMENT "Starting Pricing Service in development mode"
)

add_custom_target(translation-service-start
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 Starting Translation Service (Port 3007)..."
    COMMAND ${NPM_EXECUTABLE} run start:dev
    WORKING_DIRECTORY ${TRANSLATION_SERVICE_DIR}
    COMMENT "Starting Translation Service in development mode"
)

# Combined targets
add_custom_target(install-all
    DEPENDS shared-infra-install microservices-install frontend-install frontend2-install
    COMMAND ${CMAKE_COMMAND} -E echo "✅ All dependencies installed"
    COMMENT "Installing all dependencies (shared + microservices + frontends)"
)

add_custom_target(build-all
    DEPENDS shared-infra-build microservices-build frontend-build frontend2-build go-api-build
    COMMAND ${CMAKE_COMMAND} -E echo "✅ All projects built"
    COMMENT "Building all projects (shared + microservices + frontends + Go API)"
)

add_custom_target(start-all
    DEPENDS shared-infra-up docker-up frontend-start
    COMMAND ${CMAKE_COMMAND} -E echo "✅ All services started"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🌐 Services available at:"
    COMMAND ${CMAKE_COMMAND} -E echo "   Frontend:        http://localhost:3000"
    COMMAND ${CMAKE_COMMAND} -E echo "   Auth Service:    http://localhost:3001"
    COMMAND ${CMAKE_COMMAND} -E echo "   User Service:    http://localhost:3003"
    COMMAND ${CMAKE_COMMAND} -E echo "   Customer Service: http://localhost:3004"
    COMMAND ${CMAKE_COMMAND} -E echo "   Carrier Service:  http://localhost:3005"
    COMMAND ${CMAKE_COMMAND} -E echo "   Pricing Service:  http://localhost:3006"
    COMMAND ${CMAKE_COMMAND} -E echo "   Translation Svc:  http://localhost:3007"
    COMMENT "Starting all development servers (infrastructure + services + frontend)"
)

add_custom_target(debug-all
    DEPENDS dev-microservices frontend-debug
    COMMAND ${CMAKE_COMMAND} -E echo "🐛 All services in debug mode"
    COMMENT "Starting all services in debug mode"
)

# Development targets
add_custom_target(dev-microservices
    COMMAND ${CMAKE_COMMAND} -E echo "Starting all microservices in development mode..."
    COMMAND ${CMAKE_COMMAND} -E echo "Use Docker Compose or individual service scripts for development"
    COMMENT "Microservices development mode - use Docker Compose or individual scripts"
)

add_custom_target(dev-frontend
    COMMAND ${CMAKE_COMMAND} -E echo "Starting frontend development server..."
    COMMAND ${NPM_EXECUTABLE} start
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Starting React frontend in development mode with hot reload"
)

add_custom_target(dev-all
    COMMAND ${CMAKE_COMMAND} -E echo "Starting all development servers..."
    COMMAND ${CMAKE_COMMAND} -E echo "Microservices: Use Docker Compose or individual service scripts"
    COMMAND ${CMAKE_COMMAND} -E echo "Frontend: http://localhost:3000"
    COMMAND ${CMAKE_COMMAND} -E echo "Go API: http://localhost:8080"
    DEPENDS dev-microservices dev-frontend
    COMMENT "Starting all development servers with hot reload"
)

# Testing targets
add_custom_target(test-microservices
    COMMAND ${CMAKE_COMMAND} -E echo "Running microservices tests..."
    COMMAND ${NPM_EXECUTABLE} test
    WORKING_DIRECTORY ${AUTH_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} test
    WORKING_DIRECTORY ${USER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} test
    WORKING_DIRECTORY ${CARRIER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} test
    WORKING_DIRECTORY ${CUSTOMER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} test
    WORKING_DIRECTORY ${PRICING_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} test
    WORKING_DIRECTORY ${TRANSLATION_SERVICE_DIR}
    DEPENDS microservices-install
    COMMENT "Running all microservices tests"
)

add_custom_target(test-frontend
    COMMAND ${NPM_EXECUTABLE} test
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Running React frontend tests"
)

add_custom_target(test-all
    DEPENDS test-microservices test-frontend
    COMMENT "Running all tests"
)

# Clean targets
add_custom_target(clean-microservices
    COMMAND ${CMAKE_COMMAND} -E echo "Cleaning microservices build artifacts..."
    COMMAND ${NPM_EXECUTABLE} run clean
    WORKING_DIRECTORY ${AUTH_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run clean
    WORKING_DIRECTORY ${USER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run clean
    WORKING_DIRECTORY ${CARRIER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run clean
    WORKING_DIRECTORY ${CUSTOMER_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run clean
    WORKING_DIRECTORY ${PRICING_SERVICE_DIR}
    COMMAND ${NPM_EXECUTABLE} run clean
    WORKING_DIRECTORY ${TRANSLATION_SERVICE_DIR}
    COMMENT "Cleaning all microservices build artifacts"
)

add_custom_target(clean-frontend
    COMMAND ${NPM_EXECUTABLE} run clean
    WORKING_DIRECTORY ${FRONTEND_DIR}
    COMMENT "Cleaning React frontend build artifacts"
)

add_custom_target(clean-all
    DEPENDS clean-microservices clean-frontend
    COMMENT "Cleaning all build artifacts"
)

# Database targets
add_custom_target(db-migrate
    COMMAND ${CMAKE_COMMAND} -E echo "Running database migrations for microservices..."
    COMMAND ${CMAKE_COMMAND} -E echo "Use individual service migration scripts or Docker Compose"
    COMMENT "Database migrations - use individual service scripts or Docker Compose"
)

add_custom_target(db-seed
    COMMAND ${CMAKE_COMMAND} -E echo "Seeding databases for microservices..."
    COMMAND ${CMAKE_COMMAND} -E echo "Use individual service seed scripts or Docker Compose"
    COMMENT "Database seeding - use individual service scripts or Docker Compose"
)

# Shared Infrastructure targets
add_custom_target(shared-infra-install
    COMMAND ${CMAKE_COMMAND} -E echo "📦 Installing shared infrastructure dependencies..."
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${SHARED_DIR}/infrastructure
    COMMENT "Installing shared infrastructure dependencies"
)

add_custom_target(shared-infra-build
    COMMAND ${CMAKE_COMMAND} -E echo "🔨 Building shared infrastructure..."
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${SHARED_DIR}/infrastructure
    DEPENDS shared-infra-install
    COMMENT "Building shared infrastructure package"
)

add_custom_target(shared-db-up
    COMMAND ${CMAKE_COMMAND} -E echo "🗄️  Starting shared MySQL database..."
    COMMAND docker-compose up -d
    WORKING_DIRECTORY ${SHARED_DB_DIR}
    COMMENT "Starting shared MySQL database (Auth + User services)"
)

add_custom_target(shared-db-down
    COMMAND ${CMAKE_COMMAND} -E echo "🗄️  Stopping shared MySQL database..."
    COMMAND docker-compose down
    WORKING_DIRECTORY ${SHARED_DB_DIR}
    COMMENT "Stopping shared MySQL database"
)

add_custom_target(shared-redis-up
    COMMAND ${CMAKE_COMMAND} -E echo "🔴 Starting shared Redis..."
    COMMAND docker-compose up -d
    WORKING_DIRECTORY ${SHARED_REDIS_DIR}
    COMMENT "Starting shared Redis (all services)"
)

add_custom_target(shared-redis-down
    COMMAND ${CMAKE_COMMAND} -E echo "🔴 Stopping shared Redis..."
    COMMAND docker-compose down
    WORKING_DIRECTORY ${SHARED_REDIS_DIR}
    COMMENT "Stopping shared Redis"
)

add_custom_target(shared-infra-up
    DEPENDS shared-db-up shared-redis-up
    COMMAND ${CMAKE_COMMAND} -E echo "✅ Shared infrastructure started"
    COMMENT "Starting all shared infrastructure"
)

add_custom_target(shared-infra-down
    DEPENDS shared-db-down shared-redis-down
    COMMAND ${CMAKE_COMMAND} -E echo "✅ Shared infrastructure stopped"
    COMMENT "Stopping all shared infrastructure"
)

# Docker targets
add_custom_target(docker-build
    COMMAND ${CMAKE_COMMAND} -E echo "🐳 Building Docker containers..."
    COMMAND docker-compose -f docker-compose.hybrid.yml build
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Building Docker containers (hybrid architecture)"
)

add_custom_target(docker-up
    COMMAND ${CMAKE_COMMAND} -E echo "🐳 Starting Docker containers..."
    COMMAND docker-compose -f docker-compose.hybrid.yml up -d
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    DEPENDS shared-infra-up
    COMMENT "Starting Docker containers (hybrid architecture)"
)

add_custom_target(docker-down
    COMMAND ${CMAKE_COMMAND} -E echo "🐳 Stopping Docker containers..."
    COMMAND docker-compose -f docker-compose.hybrid.yml down
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Stopping Docker containers (hybrid architecture)"
)

add_custom_target(docker-restart
    DEPENDS docker-down docker-up
    COMMAND ${CMAKE_COMMAND} -E echo "✅ Docker containers restarted"
    COMMENT "Restarting Docker containers"
)

add_custom_target(docker-logs
    COMMAND ${CMAKE_COMMAND} -E echo "📋 Viewing Docker logs..."
    COMMAND docker-compose -f docker-compose.hybrid.yml logs -f --tail=100
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Viewing Docker container logs"
)

add_custom_target(docker-ps
    COMMAND ${CMAKE_COMMAND} -E echo "📊 Docker containers status:"
    COMMAND docker-compose -f docker-compose.hybrid.yml ps
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Listing Docker containers"
)

# Docker cleanup targets
add_custom_target(docker-clean
    COMMAND ${CMAKE_COMMAND} -E echo "🧹 Cleaning up Docker containers and resources..."
    COMMAND docker-compose down --remove-orphans
    COMMAND docker volume prune -f
    COMMAND docker image prune -f
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Cleaning up Docker containers, volumes, and unused images"
)

add_custom_target(docker-clean-all
    COMMAND ${CMAKE_COMMAND} -E echo "🧹 Performing comprehensive Docker cleanup..."
    COMMAND docker-compose down --remove-orphans
    COMMAND docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES | awk '{print $1}' | xargs -r docker stop
    COMMAND docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}" | grep -v NAMES | awk '{print $1}' | xargs -r docker rm -f
    COMMAND docker volume ls --filter "name=southern-martin" --format "{{.Name}}" | xargs -r docker volume rm -f
    COMMAND docker images --filter "reference=*southern-martin*" --format "{{.Repository}}:{{.Tag}}" | xargs -r docker rmi -f
    COMMAND docker network ls --filter "name=southern-martin" --format "{{.Name}}" | xargs -r docker network rm
    COMMAND docker image prune -f
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Comprehensive cleanup of all southern-martin Docker resources"
)

add_custom_target(docker-clean-system
    COMMAND ${CMAKE_COMMAND} -E echo "⚠️  WARNING: This will perform a system-wide Docker cleanup!"
    COMMAND ${CMAKE_COMMAND} -E echo "This will remove ALL unused containers, networks, images, and volumes."
    COMMAND ${CMAKE_COMMAND} -E echo "Make sure you don't have any important data in unused Docker resources."
    COMMAND read -p "Are you sure you want to continue? (y/N): " -n 1 -r && echo
    COMMAND docker container prune -f
    COMMAND docker network prune -f
    COMMAND docker image prune -a -f
    COMMAND docker volume prune -f
    COMMAND docker builder prune -a -f
    COMMAND docker system prune -a -f --volumes
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "System-wide Docker cleanup (removes ALL unused resources)"
)

add_custom_target(docker-clean-auth
    COMMAND ${CMAKE_COMMAND} -E echo "🧹 Cleaning up Auth Service Docker resources..."
    COMMAND cd auth-service && npm run docker:clean
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Cleaning up Auth Service Docker containers and resources"
)

add_custom_target(docker-status
    COMMAND ${CMAKE_COMMAND} -E echo "📊 Docker Status:"
    COMMAND ${CMAKE_COMMAND} -E echo "Containers:"
    COMMAND docker ps -a --filter "name=southern-martin" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "Images:"
    COMMAND docker images --filter "reference=*southern-martin*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "Volumes:"
    COMMAND docker volume ls --filter "name=southern-martin" --format "table {{.Name}}\t{{.Driver}}"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "Networks:"
    COMMAND docker network ls --filter "name=southern-martin" --format "table {{.Name}}\t{{.Driver}}"
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Displaying status of all southern-martin Docker resources"
)

# Utility targets
add_custom_target(stop-all
    COMMAND ${CMAKE_COMMAND} -E echo "Stopping all services..."
    COMMAND pkill -f "nest start" || true
    COMMAND pkill -f "react-scripts" || true
    COMMAND pkill -f "npm start" || true
    COMMAND lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    COMMAND lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    COMMAND lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    COMMENT "Stopping all running services"
)

add_custom_target(restart-all
    DEPENDS stop-all
    COMMAND ${CMAKE_COMMAND} -E echo "Waiting for services to stop..."
    COMMAND sleep 3
    DEPENDS start-all
    COMMENT "Restarting all services"
)

# Health check targets
add_custom_target(health-check
    COMMAND ${CMAKE_COMMAND} -E echo "╔════════════════════════════════════════════════════════════════╗"
    COMMAND ${CMAKE_COMMAND} -E echo "║  🏥 Service Health Check                                      ║"
    COMMAND ${CMAKE_COMMAND} -E echo "╚════════════════════════════════════════════════════════════════╝"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔍 Checking infrastructure..."
    COMMAND docker ps --filter "name=shared-mysql" --format "  ✅ MySQL:    {{.Status}}" || ${CMAKE_COMMAND} -E echo "  ❌ MySQL:    Not running"
    COMMAND docker ps --filter "name=shared-redis" --format "  ✅ Redis:    {{.Status}}" || ${CMAKE_COMMAND} -E echo "  ❌ Redis:    Not running"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔍 Checking microservices..."
    COMMAND curl -f -s http://localhost:3001/api/v1/auth/health > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ Auth Service:       http://localhost:3001" || ${CMAKE_COMMAND} -E echo "  ❌ Auth Service:       Not responding"
    COMMAND curl -f -s http://localhost:3003/health > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ User Service:       http://localhost:3003" || ${CMAKE_COMMAND} -E echo "  ❌ User Service:       Not responding"
    COMMAND curl -f -s http://localhost:3004/health > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ Customer Service:   http://localhost:3004" || ${CMAKE_COMMAND} -E echo "  ❌ Customer Service:   Not responding"
    COMMAND curl -f -s http://localhost:3005/health > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ Carrier Service:    http://localhost:3005" || ${CMAKE_COMMAND} -E echo "  ❌ Carrier Service:    Not responding"
    COMMAND curl -f -s http://localhost:3006/health > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ Pricing Service:    http://localhost:3006" || ${CMAKE_COMMAND} -E echo "  ❌ Pricing Service:    Not responding"
    COMMAND curl -f -s http://localhost:3007/health > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ Translation Service: http://localhost:3007" || ${CMAKE_COMMAND} -E echo "  ❌ Translation Service: Not responding"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔍 Checking frontend..."
    COMMAND curl -f -s http://localhost:3000 > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ React Admin:        http://localhost:3000" || ${CMAKE_COMMAND} -E echo "  ❌ React Admin:        Not responding"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔍 Checking Go API..."
    COMMAND curl -f -s http://localhost:8080/health > /dev/null && ${CMAKE_COMMAND} -E echo "  ✅ Go API:             http://localhost:8080" || ${CMAKE_COMMAND} -E echo "  ❌ Go API:             Not responding"
    COMMENT "Checking health of all services"
)

add_custom_target(status
    COMMAND ${CMAKE_COMMAND} -E echo "╔════════════════════════════════════════════════════════════════╗"
    COMMAND ${CMAKE_COMMAND} -E echo "║  📊 Project Status                                            ║"
    COMMAND ${CMAKE_COMMAND} -E echo "╚════════════════════════════════════════════════════════════════╝"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "📁 Project: Fullstack Microservices (Hybrid Architecture)"
    COMMAND ${CMAKE_COMMAND} -E echo "📂 Location: ${CMAKE_SOURCE_DIR}"
    COMMAND ${CMAKE_COMMAND} -E echo "🏗️  Build Type: ${CMAKE_BUILD_TYPE}"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔧 Services:"
    COMMAND ${CMAKE_COMMAND} -E echo "   • Auth Service         (Port 3001)"
    COMMAND ${CMAKE_COMMAND} -E echo "   • User Service         (Port 3003)"
    COMMAND ${CMAKE_COMMAND} -E echo "   • Customer Service     (Port 3004)"
    COMMAND ${CMAKE_COMMAND} -E echo "   • Carrier Service      (Port 3005)"
    COMMAND ${CMAKE_COMMAND} -E echo "   • Pricing Service      (Port 3006)"
    COMMAND ${CMAKE_COMMAND} -E echo "   • Translation Service  (Port 3007)"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🎨 Frontend:"
    COMMAND ${CMAKE_COMMAND} -E echo "   • React Admin          (Port 3000)"
    COMMAND ${CMAKE_COMMAND} -E echo "   • React Admin 2        (Port 3002)"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🗄️  Shared Infrastructure:"
    COMMAND ${CMAKE_COMMAND} -E echo "   • MySQL Database       (Port 3306) - Auth + User"
    COMMAND ${CMAKE_COMMAND} -E echo "   • Redis Cache          (Port 6379) - All Services"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "📊 Docker Status:"
    COMMAND docker ps --filter "name=southern-martin" --format "   {{.Names}}: {{.Status}}" | head -10 || ${CMAKE_COMMAND} -E echo "   No containers running"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "💡 Use 'make help-targets' for available commands"
    COMMENT "Displaying project status"
)

# Logging targets
add_custom_target(logs-microservices
    COMMAND ${CMAKE_COMMAND} -E echo "Viewing microservices logs..."
    COMMAND ${CMAKE_COMMAND} -E echo "Use Docker Compose logs or individual service log commands"
    COMMENT "Microservices logs - use Docker Compose or individual service commands"
)

add_custom_target(logs-all
    COMMAND ${CMAKE_COMMAND} -E echo "Viewing all service logs..."
    COMMAND ${CMAKE_COMMAND} -E echo "Use Docker Compose logs or individual service log commands"
    COMMENT "All service logs - use Docker Compose or individual service commands"
)

# Set default target
set_property(DIRECTORY ${CMAKE_SOURCE_DIR} PROPERTY DEFAULT_TARGET dev-all)

# Print available targets
add_custom_target(help-targets
    COMMAND ${CMAKE_COMMAND} -E echo "╔════════════════════════════════════════════════════════════════╗"
    COMMAND ${CMAKE_COMMAND} -E echo "║  📚 Fullstack Microservices Project - CMake Targets          ║"
    COMMAND ${CMAKE_COMMAND} -E echo "╚════════════════════════════════════════════════════════════════╝"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🏗️  SHARED INFRASTRUCTURE:"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-infra-install    - Install shared infrastructure packages"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-infra-build      - Build shared infrastructure"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-db-up            - Start shared MySQL database (Auth + User)"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-db-down          - Stop shared MySQL database"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-redis-up         - Start shared Redis (all services)"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-redis-down       - Stop shared Redis"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-infra-up         - Start all shared infrastructure"
    COMMAND ${CMAKE_COMMAND} -E echo "   shared-infra-down       - Stop all shared infrastructure"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔧 MICROSERVICES:"
    COMMAND ${CMAKE_COMMAND} -E echo "   microservices-install   - Install all microservices dependencies"
    COMMAND ${CMAKE_COMMAND} -E echo "   microservices-build     - Build all microservices"
    COMMAND ${CMAKE_COMMAND} -E echo "   auth-service-start      - Start Auth Service (Port 3001)"
    COMMAND ${CMAKE_COMMAND} -E echo "   user-service-start      - Start User Service (Port 3003)"
    COMMAND ${CMAKE_COMMAND} -E echo "   customer-service-start  - Start Customer Service (Port 3004)"
    COMMAND ${CMAKE_COMMAND} -E echo "   carrier-service-start   - Start Carrier Service (Port 3005)"
    COMMAND ${CMAKE_COMMAND} -E echo "   pricing-service-start   - Start Pricing Service (Port 3006)"
    COMMAND ${CMAKE_COMMAND} -E echo "   translation-service-start - Start Translation Service (Port 3007)"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🎨 FRONTEND (React Admin):"
    COMMAND ${CMAKE_COMMAND} -E echo "   frontend-install        - Install React Admin dependencies"
    COMMAND ${CMAKE_COMMAND} -E echo "   frontend-build          - Build React Admin"
    COMMAND ${CMAKE_COMMAND} -E echo "   frontend-start          - Start React Admin (Port 3000)"
    COMMAND ${CMAKE_COMMAND} -E echo "   frontend-debug          - Start React Admin in debug mode"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🎨 FRONTEND 2 (React Admin 2):"
    COMMAND ${CMAKE_COMMAND} -E echo "   frontend2-install       - Install React Admin 2 dependencies"
    COMMAND ${CMAKE_COMMAND} -E echo "   frontend2-build         - Build React Admin 2"
    COMMAND ${CMAKE_COMMAND} -E echo "   frontend2-start         - Start React Admin 2 (Port 3002)"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔷 GO API:"
    COMMAND ${CMAKE_COMMAND} -E echo "   go-api-build            - Build Go API"
    COMMAND ${CMAKE_COMMAND} -E echo "   go-api-run              - Run Go API (Port 8080)"
    COMMAND ${CMAKE_COMMAND} -E echo "   go-api-debug            - Run Go API in debug mode"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🚀 COMBINED OPERATIONS:"
    COMMAND ${CMAKE_COMMAND} -E echo "   install-all             - Install ALL dependencies"
    COMMAND ${CMAKE_COMMAND} -E echo "   build-all               - Build ALL projects"
    COMMAND ${CMAKE_COMMAND} -E echo "   start-all               - Start ALL services (infrastructure + services + frontend)"
    COMMAND ${CMAKE_COMMAND} -E echo "   debug-all               - Start all in debug mode"
    COMMAND ${CMAKE_COMMAND} -E echo "   dev-all                 - Start all in development mode"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🐳 DOCKER (Hybrid Architecture):"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-build            - Build Docker containers (docker-compose.hybrid.yml)"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-up               - Start Docker containers"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-down             - Stop Docker containers"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-restart          - Restart Docker containers"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-logs             - View Docker logs (tail -f)"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-ps               - List Docker containers status"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-status           - Show status of all Docker resources"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🧹 DOCKER CLEANUP:"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-clean            - Clean up Docker containers and volumes"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-clean-all        - Clean up all southern-martin Docker resources"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-clean-auth       - Clean up Auth Service Docker resources"
    COMMAND ${CMAKE_COMMAND} -E echo "   docker-clean-system     - Clean up entire Docker system (⚠️  WARNING!)"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🧪 TESTING:"
    COMMAND ${CMAKE_COMMAND} -E echo "   test-microservices      - Run all microservices tests"
    COMMAND ${CMAKE_COMMAND} -E echo "   test-frontend           - Run React Admin tests"
    COMMAND ${CMAKE_COMMAND} -E echo "   test-all                - Run ALL tests"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🧹 CLEANUP:"
    COMMAND ${CMAKE_COMMAND} -E echo "   clean-microservices     - Clean microservices build artifacts"
    COMMAND ${CMAKE_COMMAND} -E echo "   clean-frontend          - Clean React Admin build artifacts"
    COMMAND ${CMAKE_COMMAND} -E echo "   clean-all               - Clean ALL build artifacts"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "🔧 UTILITIES:"
    COMMAND ${CMAKE_COMMAND} -E echo "   stop-all                - Stop all running services"
    COMMAND ${CMAKE_COMMAND} -E echo "   restart-all             - Restart all services"
    COMMAND ${CMAKE_COMMAND} -E echo "   health-check            - Check health of all services"
    COMMAND ${CMAKE_COMMAND} -E echo "   db-migrate              - Run database migrations"
    COMMAND ${CMAKE_COMMAND} -E echo "   db-seed                 - Seed databases with initial data"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "💡 QUICK START:"
    COMMAND ${CMAKE_COMMAND} -E echo "   1. cmake -S . -B build          # Configure"
    COMMAND ${CMAKE_COMMAND} -E echo "   2. cmake --build build --target shared-infra-up    # Start infrastructure"
    COMMAND ${CMAKE_COMMAND} -E echo "   3. cmake --build build --target docker-up          # Start services"
    COMMAND ${CMAKE_COMMAND} -E echo "   4. cmake --build build --target frontend-start     # Start frontend"
    COMMAND ${CMAKE_COMMAND} -E echo ""
    COMMAND ${CMAKE_COMMAND} -E echo "📖 For more details, see: docs/README.md"
    COMMAND ${CMAKE_COMMAND} -E echo "🏗️  Architecture: docs/architecture/MICROSERVICES-ARCHITECTURE-GUIDELINES.md"
    COMMENT "Displaying available CMake targets"
)

# Set default target to help
if(NOT TARGET ${CMAKE_DEFAULT_TARGET})
    set(CMAKE_DEFAULT_TARGET help-targets)
endif()

