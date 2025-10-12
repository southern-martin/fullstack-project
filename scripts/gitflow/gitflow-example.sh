#!/bin/bash

# Git Flow Example Script
# Demonstrates the enhanced Git Flow workflow with feature history preservation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_demo() {
    echo -e "${PURPLE}[DEMO]${NC} $1"
}

print_step() {
    echo -e "${CYAN}[STEP]${NC} $1"
}

print_result() {
    echo -e "${GREEN}[RESULT]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository"
        print_demo "Please run this script from your project root directory"
        exit 1
    fi
}

# Initialize demo repository
init_demo_repo() {
    print_demo "Initializing demo repository..."
    
    # Check if master and develop exist
    if ! git show-ref --verify --quiet refs/heads/master; then
        print_step "Creating initial master branch..."
        git checkout -b master
        echo "# Fullstack Project" > README.md
        git add README.md
        git commit -m "Initial commit"
        print_result "Master branch created"
    fi
    
    if ! git show-ref --verify --quiet refs/heads/develop; then
        print_step "Creating develop branch..."
        git checkout -b develop
        print_result "Develop branch created"
    fi
    
    print_result "Demo repository initialized"
}

# Demo: Start a feature
demo_start_feature() {
    local feature_name="F00001-user-authentication"
    
    print_demo "=== Starting Feature: $feature_name ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh start-feature $feature_name"
    ./scripts/gitflow/enhanced-gitflow.sh start-feature "$feature_name"
    
    print_step "Making some commits to demonstrate feature development..."
    
    # Simulate feature development
    echo "// User authentication service" > auth-service.js
    git add auth-service.js
    git commit -m "feat: add user authentication service"
    
    echo "// JWT token validation" > jwt-validator.js
    git add jwt-validator.js
    git commit -m "feat: add JWT token validation"
    
    echo "// Authentication tests" > auth-tests.js
    git add auth-tests.js
    git commit -m "test: add authentication unit tests"
    
    print_result "Feature development completed with 3 commits"
    
    # Show current status
    print_step "Current feature status:"
    git log --oneline -5
}

# Demo: Finish a feature (preserves history)
demo_finish_feature() {
    local feature_name="F00001-user-authentication"
    
    print_demo "=== Finishing Feature: $feature_name (Preserves History) ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh finish-feature $feature_name"
    ./scripts/gitflow/enhanced-gitflow.sh finish-feature "$feature_name"
    
    print_result "Feature finished with preserved history"
    
    # Show the preserved history
    print_step "Feature history preserved in git graph:"
    git log --graph --oneline -10
}

# Demo: Start another feature
demo_start_second_feature() {
    local feature_name="F00002-dashboard-widgets"
    
    print_demo "=== Starting Second Feature: $feature_name ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh start-feature $feature_name"
    ./scripts/gitflow/enhanced-gitflow.sh start-feature "$feature_name"
    
    print_step "Making commits for second feature..."
    
    # Simulate second feature development
    echo "// Dashboard widget component" > dashboard-widget.js
    git add dashboard-widget.js
    git commit -m "feat: add dashboard widget component"
    
    echo "// Widget configuration" > widget-config.js
    git add widget-config.js
    git commit -m "feat: add widget configuration"
    
    print_result "Second feature development completed"
}

# Demo: Finish second feature
demo_finish_second_feature() {
    local feature_name="F00002-dashboard-widgets"
    
    print_demo "=== Finishing Second Feature: $feature_name ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh finish-feature $feature_name"
    ./scripts/gitflow/enhanced-gitflow.sh finish-feature "$feature_name"
    
    print_result "Second feature finished"
}

# Demo: Show final graph
demo_show_final_graph() {
    print_demo "=== Final Git Graph (Feature History Preserved) ==="
    
    print_step "Complete git graph showing preserved feature history:"
    git log --graph --oneline --all --decorate -15
    
    print_step "Branch status:"
    ./scripts/gitflow/enhanced-gitflow.sh status
}

# Demo: Start a release
demo_start_release() {
    local version="1.0.0"
    
    print_demo "=== Starting Release: $version ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh start-release $version"
    ./scripts/gitflow/enhanced-gitflow.sh start-release "$version"
    
    print_step "Updating version and changelog..."
    
    # Simulate release preparation
    echo "Version: $version" > VERSION
    git add VERSION
    git commit -m "chore: bump version to $version"
    
    echo "## Version $version" > CHANGELOG.md
    echo "- Added user authentication" >> CHANGELOG.md
    echo "- Added dashboard widgets" >> CHANGELOG.md
    git add CHANGELOG.md
    git commit -m "docs: update changelog for $version"
    
    print_result "Release preparation completed"
}

# Demo: Finish release
demo_finish_release() {
    local version="1.0.0"
    
    print_demo "=== Finishing Release: $version ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh finish-release $version"
    ./scripts/gitflow/enhanced-gitflow.sh finish-release "$version"
    
    print_result "Release $version completed"
    
    # Show tags
    print_step "Release tags:"
    git tag -l
}

# Demo: Start a hotfix
demo_start_hotfix() {
    local hotfix_name="1.0.1-security-fix"
    
    print_demo "=== Starting Hotfix: $hotfix_name ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh start-hotfix $hotfix_name"
    ./scripts/gitflow/enhanced-gitflow.sh start-hotfix "$hotfix_name"
    
    print_step "Making critical security fix..."
    
    # Simulate hotfix
    echo "// Security fix for authentication" > security-fix.js
    git add security-fix.js
    git commit -m "fix: resolve security vulnerability in authentication"
    
    print_result "Hotfix development completed"
}

# Demo: Finish hotfix
demo_finish_hotfix() {
    local hotfix_name="1.0.1-security-fix"
    
    print_demo "=== Finishing Hotfix: $hotfix_name ==="
    
    print_step "Running: ./scripts/gitflow/enhanced-gitflow.sh finish-hotfix $hotfix_name"
    ./scripts/gitflow/enhanced-gitflow.sh finish-hotfix "$hotfix_name"
    
    print_result "Hotfix $hotfix_name completed"
}

# Demo: Show final status
demo_show_final_status() {
    print_demo "=== Final Project Status ==="
    
    print_step "Complete git graph with all features, releases, and hotfixes:"
    git log --graph --oneline --all --decorate -20
    
    print_step "All tags:"
    git tag -l
    
    print_step "Branch cleanup (shows merged branches):"
    ./scripts/gitflow/enhanced-gitflow.sh cleanup
}

# Main demo function
run_demo() {
    print_demo "🚀 Enhanced Git Flow Demo - Feature History Preservation"
    echo ""
    
    check_git_repo
    init_demo_repo
    
    echo ""
    demo_start_feature
    echo ""
    demo_finish_feature
    echo ""
    demo_start_second_feature
    echo ""
    demo_finish_second_feature
    echo ""
    demo_show_final_graph
    echo ""
    demo_start_release
    echo ""
    demo_finish_release
    echo ""
    demo_start_hotfix
    echo ""
    demo_finish_hotfix
    echo ""
    demo_show_final_status
    
    echo ""
    print_demo "🎉 Demo completed! Your git graph now shows preserved feature history."
    print_demo "Use 'git log --graph --oneline --all' to see the complete history."
}

# Show help
show_help() {
    echo "Enhanced Git Flow Demo Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  demo        Run complete demo workflow"
    echo "  help        Show this help message"
    echo ""
    echo "The demo will:"
    echo "  1. Initialize demo repository"
    echo "  2. Create and finish features with preserved history"
    echo "  3. Create and finish a release"
    echo "  4. Create and finish a hotfix"
    echo "  5. Show final git graph with preserved feature lines"
    echo ""
    echo "Example:"
    echo "  $0 demo"
}

# Main script logic
case "$1" in
    "demo")
        run_demo
        ;;
    "help"|"")
        show_help
        ;;
    *)
        print_error "Unknown command '$1'"
        show_help
        exit 1
        ;;
esac
