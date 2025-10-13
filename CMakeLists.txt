cmake_minimum_required(VERSION 3.16)
project(FullstackProject)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

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

# Find MySQL client libraries
find_package(PkgConfig REQUIRED)
pkg_check_modules(MYSQL REQUIRED mysqlclient)

# Set project directories
set(FRONTEND_DIR ${CMAKE_SOURCE_DIR}/react-admin)
set(GO_API_DIR ${CMAKE_SOURCE_DIR}/go-app-api)

# Set microservices directories
set(AUTH_SERVICE_DIR ${CMAKE_SOURCE_DIR}/auth-service)
set(USER_SERVICE_DIR ${CMAKE_SOURCE_DIR}/user-service)
set(CARRIER_SERVICE_DIR ${CMAKE_SOURCE_DIR}/carrier-service)
set(CUSTOMER_SERVICE_DIR ${CMAKE_SOURCE_DIR}/customer-service)
set(PRICING_SERVICE_DIR ${CMAKE_SOURCE_DIR}/pricing-service)
set(TRANSLATION_SERVICE_DIR ${CMAKE_SOURCE_DIR}/translation-service)

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

# Custom targets for frontend (React)
add_custom_target(frontend-install
    COMMAND ${NPM_EXECUTABLE} install
    WORKING_DIRECTORY ${FRONTEND_DIR}
    COMMENT "Installing React frontend dependencies"
)

add_custom_target(frontend-build
    COMMAND ${NPM_EXECUTABLE} run build
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Building React frontend"
)

add_custom_target(frontend-start
    COMMAND ${NPM_EXECUTABLE} start
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Starting React frontend development server"
)

add_custom_target(frontend-debug
    COMMAND ${NPM_EXECUTABLE} run start:debug
    WORKING_DIRECTORY ${FRONTEND_DIR}
    DEPENDS frontend-install
    COMMENT "Starting React frontend in debug mode"
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

# Combined targets
add_custom_target(install-all
    DEPENDS microservices-install frontend-install
    COMMENT "Installing all dependencies"
)

add_custom_target(build-all
    DEPENDS microservices-build frontend-build go-api-build
    COMMENT "Building all projects"
)

add_custom_target(start-all
    DEPENDS dev-microservices frontend-start
    COMMENT "Starting all development servers"
)

add_custom_target(debug-all
    DEPENDS dev-microservices frontend-debug
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

# Docker targets
add_custom_target(docker-build
    COMMAND docker-compose build
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Building Docker containers"
)

add_custom_target(docker-up
    COMMAND docker-compose up -d
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Starting Docker containers"
)

add_custom_target(docker-down
    COMMAND docker-compose down
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
    COMMENT "Stopping Docker containers"
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
    COMMAND ${CMAKE_COMMAND} -E echo "Checking service health..."
    COMMAND curl -f http://localhost:3001/api/v1/health || ${CMAKE_COMMAND} -E echo "Backend not responding"
    COMMAND curl -f http://localhost:3000 || ${CMAKE_COMMAND} -E echo "Frontend not responding"
    COMMAND curl -f http://localhost:8080/health || ${CMAKE_COMMAND} -E echo "Go API not responding"
    COMMENT "Checking health of all services"
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
    COMMAND ${CMAKE_COMMAND} -E echo "Available targets:"
    COMMAND ${CMAKE_COMMAND} -E echo "  Backend:"
    COMMAND ${CMAKE_COMMAND} -E echo "    backend-install    - Install backend dependencies"
    COMMAND ${CMAKE_COMMAND} -E echo "    backend-build      - Build backend"
    COMMAND ${CMAKE_COMMAND} -E echo "    backend-start      - Start backend"
    COMMAND ${CMAKE_COMMAND} -E echo "    backend-dev        - Start backend in dev mode"
    COMMAND ${CMAKE_COMMAND} -E echo "    backend-debug      - Start backend in debug mode"
    COMMAND ${CMAKE_COMMAND} -E echo "  Frontend:"
    COMMAND ${CMAKE_COMMAND} -E echo "    frontend-install   - Install frontend dependencies"
    COMMAND ${CMAKE_COMMAND} -E echo "    frontend-build     - Build frontend"
    COMMAND ${CMAKE_COMMAND} -E echo "    frontend-start     - Start frontend"
    COMMAND ${CMAKE_COMMAND} -E echo "    frontend-debug     - Start frontend in debug mode"
    COMMAND ${CMAKE_COMMAND} -E echo "  Go API:"
    COMMAND ${CMAKE_COMMAND} -E echo "    go-api-build       - Build Go API"
    COMMAND ${CMAKE_COMMAND} -E echo "    go-api-run         - Run Go API"
    COMMAND ${CMAKE_COMMAND} -E echo "    go-api-debug       - Run Go API in debug mode"
    COMMAND ${CMAKE_COMMAND} -E echo "  Combined:"
    COMMAND ${CMAKE_COMMAND} -E echo "    install-all        - Install all dependencies"
    COMMAND ${CMAKE_COMMAND} -E echo "    build-all          - Build all projects"
    COMMAND ${CMAKE_COMMAND} -E echo "    start-all          - Start all services"
    COMMAND ${CMAKE_COMMAND} -E echo "    debug-all          - Start all in debug mode"
    COMMAND ${CMAKE_COMMAND} -E echo "    dev-all            - Start all in development mode"
    COMMAND ${CMAKE_COMMAND} -E echo "  Docker:"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-build       - Build Docker containers"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-up          - Start Docker containers"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-down        - Stop Docker containers"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-clean       - Clean up Docker containers and volumes"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-clean-all   - Clean up all southern-martin Docker resources"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-clean-system- Clean up entire Docker system (WARNING!)"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-clean-auth   - Clean up Auth Service Docker resources"
    COMMAND ${CMAKE_COMMAND} -E echo "    docker-status       - Show status of all Docker resources"
    COMMAND ${CMAKE_COMMAND} -E echo "  Utilities:"
    COMMAND ${CMAKE_COMMAND} -E echo "    stop-all           - Stop all services"
    COMMAND ${CMAKE_COMMAND} -E echo "    restart-all        - Restart all services"
    COMMAND ${CMAKE_COMMAND} -E echo "    health-check       - Check service health"
    COMMAND ${CMAKE_COMMAND} -E echo "    clean-all          - Clean all build artifacts"
    COMMAND ${CMAKE_COMMAND} -E echo "    test-all           - Run all tests"
    COMMENT "Displaying available targets"
)

# Set default target to help
if(NOT TARGET ${CMAKE_DEFAULT_TARGET})
    set(CMAKE_DEFAULT_TARGET help-targets)
endif()

