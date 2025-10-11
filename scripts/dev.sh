#!/bin/bash

# Fullstack Project Development Script
# Alternative to CMake for systems without CMake installed

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/nestjs-app-api/api"
FRONTEND_DIR="${PROJECT_ROOT}/react-admin"
GO_API_DIR="${PROJECT_ROOT}/go-app-api"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command_exists make; then
        print_warning "Make is not installed. Go API features will be limited."
    fi
    
    print_success "Prerequisites check completed."
}

# Function to install backend dependencies
install_backend() {
    print_status "Installing backend dependencies..."
    cd "$BACKEND_DIR"
    npm install
    print_success "Backend dependencies installed."
}

# Function to install frontend dependencies
install_frontend() {
    print_status "Installing frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install
    print_success "Frontend dependencies installed."
}

# Function to build backend
build_backend() {
    print_status "Building backend..."
    cd "$BACKEND_DIR"
    npm run build
    print_success "Backend built successfully."
}

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    cd "$FRONTEND_DIR"
    npm run build
    print_success "Frontend built successfully."
}

# Function to start backend in development mode
start_backend_dev() {
    print_status "Starting backend in development mode..."
    cd "$BACKEND_DIR"
    npm run start:dev &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/backend.pid
    print_success "Backend started (PID: $BACKEND_PID)"
}

# Function to start backend in debug mode
start_backend_debug() {
    print_status "Starting backend in debug mode..."
    cd "$BACKEND_DIR"
    npm run start:debug &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/backend.pid
    print_success "Backend started in debug mode (PID: $BACKEND_PID)"
}

# Function to start frontend in development mode
start_frontend_dev() {
    print_status "Starting frontend in development mode..."
    cd "$FRONTEND_DIR"
    npm start &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/frontend.pid
    print_success "Frontend started (PID: $FRONTEND_PID)"
}

# Function to start frontend in debug mode
start_frontend_debug() {
    print_status "Starting frontend in debug mode..."
    cd "$FRONTEND_DIR"
    npm run start:debug &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > /tmp/frontend.pid
    print_success "Frontend started in debug mode (PID: $FRONTEND_PID)"
}

# Function to start Go API
start_go_api() {
    if command_exists make; then
        print_status "Starting Go API..."
        cd "$GO_API_DIR"
        make run &
        GO_API_PID=$!
        echo $GO_API_PID > /tmp/go-api.pid
        print_success "Go API started (PID: $GO_API_PID)"
    else
        print_warning "Make not available. Skipping Go API."
    fi
}

# Function to start Go API in debug mode
start_go_api_debug() {
    if command_exists make; then
        print_status "Starting Go API in debug mode..."
        cd "$GO_API_DIR"
        make debug &
        GO_API_PID=$!
        echo $GO_API_PID > /tmp/go-api.pid
        print_success "Go API started in debug mode (PID: $GO_API_PID)"
    else
        print_warning "Make not available. Skipping Go API."
    fi
}

# Function to stop all services
stop_all() {
    print_status "Stopping all services..."
    
    # Stop backend
    if [ -f /tmp/backend.pid ]; then
        BACKEND_PID=$(cat /tmp/backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend stopped (PID: $BACKEND_PID)"
        fi
        rm -f /tmp/backend.pid
    fi
    
    # Stop frontend
    if [ -f /tmp/frontend.pid ]; then
        FRONTEND_PID=$(cat /tmp/frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend stopped (PID: $FRONTEND_PID)"
        fi
        rm -f /tmp/frontend.pid
    fi
    
    # Stop Go API
    if [ -f /tmp/go-api.pid ]; then
        GO_API_PID=$(cat /tmp/go-api.pid)
        if kill -0 $GO_API_PID 2>/dev/null; then
            kill $GO_API_PID
            print_success "Go API stopped (PID: $GO_API_PID)"
        fi
        rm -f /tmp/go-api.pid
    fi
    
    # Kill any remaining processes
    pkill -f "nest start" 2>/dev/null || true
    pkill -f "react-scripts" 2>/dev/null || true
    pkill -f "npm start" 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    
    print_success "All services stopped."
}

# Function to check service health
health_check() {
    print_status "Checking service health..."
    
    # Check backend
    if curl -f http://localhost:3001/api/v1/health >/dev/null 2>&1; then
        print_success "Backend is healthy"
    else
        print_warning "Backend is not responding"
    fi
    
    # Check frontend
    if curl -f http://localhost:3000 >/dev/null 2>&1; then
        print_success "Frontend is healthy"
    else
        print_warning "Frontend is not responding"
    fi
    
    # Check Go API
    if curl -f http://localhost:8080/health >/dev/null 2>&1; then
        print_success "Go API is healthy"
    else
        print_warning "Go API is not responding"
    fi
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Test backend
    print_status "Testing backend..."
    cd "$BACKEND_DIR"
    npm test || print_warning "Backend tests failed"
    
    # Test frontend
    print_status "Testing frontend..."
    cd "$FRONTEND_DIR"
    npm test || print_warning "Frontend tests failed"
    
    print_success "Tests completed."
}

# Function to clean build artifacts
clean_all() {
    print_status "Cleaning build artifacts..."
    
    # Clean backend
    cd "$BACKEND_DIR"
    rm -rf dist/ node_modules/.cache/ || true
    
    # Clean frontend
    cd "$FRONTEND_DIR"
    rm -rf build/ node_modules/.cache/ || true
    
    # Clean Go API
    if [ -d "$GO_API_DIR" ]; then
        cd "$GO_API_DIR"
        make clean 2>/dev/null || true
    fi
    
    print_success "Build artifacts cleaned."
}

# Function to show help
show_help() {
    echo "Fullstack Project Development Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup           - Setup build environment and install dependencies"
    echo "  build           - Build all projects"
    echo "  start           - Start all development servers"
    echo "  debug           - Start all services in debug mode"
    echo "  dev             - Start all services in development mode with hot reload"
    echo "  stop            - Stop all running services"
    echo "  restart         - Restart all services"
    echo "  test            - Run all tests"
    echo "  clean           - Clean all build artifacts"
    echo "  health          - Check health of all services"
    echo "  help            - Show this help message"
    echo ""
    echo "Backend-specific commands:"
    echo "  backend-setup   - Setup backend only"
    echo "  backend-build   - Build backend only"
    echo "  backend-start   - Start backend only"
    echo "  backend-debug   - Start backend in debug mode"
    echo "  backend-test    - Test backend only"
    echo ""
    echo "Frontend-specific commands:"
    echo "  frontend-setup  - Setup frontend only"
    echo "  frontend-build  - Build frontend only"
    echo "  frontend-start  - Start frontend only"
    echo "  frontend-debug  - Start frontend in debug mode"
    echo "  frontend-test   - Test frontend only"
    echo ""
    echo "Go API commands:"
    echo "  go-build        - Build Go API"
    echo "  go-run          - Run Go API"
    echo "  go-debug        - Run Go API in debug mode"
    echo ""
    echo "Examples:"
    echo "  $0 setup        # Setup everything"
    echo "  $0 dev          # Start all in development mode"
    echo "  $0 debug        # Start all in debug mode"
    echo "  $0 stop         # Stop all services"
}

# Main script logic
main() {
    case "${1:-help}" in
        "setup")
            check_prerequisites
            install_backend
            install_frontend
            print_success "Setup completed!"
            ;;
        "build")
            check_prerequisites
            build_backend
            build_frontend
            print_success "Build completed!"
            ;;
        "start")
            check_prerequisites
            start_backend_dev
            start_frontend_dev
            start_go_api
            print_success "All services started!"
            print_status "Backend: http://localhost:3001"
            print_status "Frontend: http://localhost:3000"
            print_status "Go API: http://localhost:8080"
            ;;
        "debug")
            check_prerequisites
            start_backend_debug
            start_frontend_debug
            start_go_api_debug
            print_success "All services started in debug mode!"
            print_status "Backend: http://localhost:3001 (debug port: 9229)"
            print_status "Frontend: http://localhost:3000"
            print_status "Go API: http://localhost:8080 (debug port: 2345)"
            ;;
        "dev")
            check_prerequisites
            start_backend_dev
            start_frontend_dev
            print_success "Development servers started!"
            print_status "Backend: http://localhost:3001"
            print_status "Frontend: http://localhost:3000"
            ;;
        "stop")
            stop_all
            ;;
        "restart")
            stop_all
            sleep 3
            main dev
            ;;
        "test")
            check_prerequisites
            run_tests
            ;;
        "clean")
            clean_all
            ;;
        "health")
            health_check
            ;;
        "backend-setup")
            check_prerequisites
            install_backend
            ;;
        "backend-build")
            check_prerequisites
            build_backend
            ;;
        "backend-start")
            check_prerequisites
            start_backend_dev
            ;;
        "backend-debug")
            check_prerequisites
            start_backend_debug
            ;;
        "backend-test")
            check_prerequisites
            cd "$BACKEND_DIR"
            npm test
            ;;
        "frontend-setup")
            check_prerequisites
            install_frontend
            ;;
        "frontend-build")
            check_prerequisites
            build_frontend
            ;;
        "frontend-start")
            check_prerequisites
            start_frontend_dev
            ;;
        "frontend-debug")
            check_prerequisites
            start_frontend_debug
            ;;
        "frontend-test")
            check_prerequisites
            cd "$FRONTEND_DIR"
            npm test
            ;;
        "go-build")
            if command_exists make; then
                cd "$GO_API_DIR"
                make build
            else
                print_error "Make not available"
            fi
            ;;
        "go-run")
            start_go_api
            ;;
        "go-debug")
            start_go_api_debug
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"

