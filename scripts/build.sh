#!/bin/bash

# Fullstack Project Build Script
# This script provides easy access to CMake targets for building and running the fullstack project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${PROJECT_ROOT}/build"

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
    
    if ! command_exists cmake; then
        print_error "CMake is not installed. Please install CMake 3.16 or later."
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js."
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command_exists make; then
        print_error "Make is not installed. Please install make."
        exit 1
    fi
    
    print_success "All prerequisites are installed."
}

# Function to setup build directory
setup_build() {
    print_status "Setting up build directory..."
    
    if [ ! -d "$BUILD_DIR" ]; then
        mkdir -p "$BUILD_DIR"
        print_success "Created build directory: $BUILD_DIR"
    fi
    
    cd "$BUILD_DIR"
    
    if [ ! -f "CMakeCache.txt" ]; then
        print_status "Configuring CMake..."
        cmake .. -DCMAKE_BUILD_TYPE=Debug
        print_success "CMake configuration completed."
    else
        print_status "CMake already configured."
    fi
}

# Function to show help
show_help() {
    echo "Fullstack Project Build Script"
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
    echo "  logs            - View logs from all services"
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
    echo "Database commands:"
    echo "  db-migrate      - Run database migrations"
    echo "  db-seed         - Seed database with initial data"
    echo ""
    echo "Docker commands:"
    echo "  docker-build    - Build Docker containers"
    echo "  docker-up       - Start Docker containers"
    echo "  docker-down     - Stop Docker containers"
    echo ""
    echo "Examples:"
    echo "  $0 setup        # Setup everything"
    echo "  $0 dev          # Start all in development mode"
    echo "  $0 debug        # Start all in debug mode"
    echo "  $0 stop         # Stop all services"
}

# Function to run CMake target
run_target() {
    local target="$1"
    local description="$2"
    
    print_status "$description"
    setup_build
    make "$target"
    print_success "$description completed."
}

# Main script logic
main() {
    case "${1:-help}" in
        "setup")
            check_prerequisites
            run_target "install-all" "Setting up all projects and installing dependencies"
            ;;
        "build")
            check_prerequisites
            run_target "build-all" "Building all projects"
            ;;
        "start")
            check_prerequisites
            run_target "start-all" "Starting all development servers"
            ;;
        "debug")
            check_prerequisites
            run_target "debug-all" "Starting all services in debug mode"
            ;;
        "dev")
            check_prerequisites
            run_target "dev-all" "Starting all services in development mode"
            ;;
        "stop")
            run_target "stop-all" "Stopping all services"
            ;;
        "restart")
            run_target "restart-all" "Restarting all services"
            ;;
        "test")
            check_prerequisites
            run_target "test-all" "Running all tests"
            ;;
        "clean")
            run_target "clean-all" "Cleaning all build artifacts"
            ;;
        "health")
            run_target "health-check" "Checking health of all services"
            ;;
        "logs")
            run_target "logs-all" "Viewing logs from all services"
            ;;
        "backend-setup")
            check_prerequisites
            run_target "backend-install" "Setting up backend"
            ;;
        "backend-build")
            check_prerequisites
            run_target "backend-build" "Building backend"
            ;;
        "backend-start")
            check_prerequisites
            run_target "backend-start" "Starting backend"
            ;;
        "backend-debug")
            check_prerequisites
            run_target "backend-debug" "Starting backend in debug mode"
            ;;
        "backend-test")
            check_prerequisites
            run_target "test-backend" "Testing backend"
            ;;
        "frontend-setup")
            check_prerequisites
            run_target "frontend-install" "Setting up frontend"
            ;;
        "frontend-build")
            check_prerequisites
            run_target "frontend-build" "Building frontend"
            ;;
        "frontend-start")
            check_prerequisites
            run_target "frontend-start" "Starting frontend"
            ;;
        "frontend-debug")
            check_prerequisites
            run_target "frontend-debug" "Starting frontend in debug mode"
            ;;
        "frontend-test")
            check_prerequisites
            run_target "test-frontend" "Testing frontend"
            ;;
        "go-build")
            check_prerequisites
            run_target "go-api-build" "Building Go API"
            ;;
        "go-run")
            check_prerequisites
            run_target "go-api-run" "Running Go API"
            ;;
        "go-debug")
            check_prerequisites
            run_target "go-api-debug" "Running Go API in debug mode"
            ;;
        "db-migrate")
            check_prerequisites
            run_target "db-migrate" "Running database migrations"
            ;;
        "db-seed")
            check_prerequisites
            run_target "db-seed" "Seeding database"
            ;;
        "docker-build")
            run_target "docker-build" "Building Docker containers"
            ;;
        "docker-up")
            run_target "docker-up" "Starting Docker containers"
            ;;
        "docker-down")
            run_target "docker-down" "Stopping Docker containers"
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

