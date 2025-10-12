#!/bin/bash

# React Admin Git Flow Helper Script
# Simplifies common Git Flow operations for the React admin project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}$1${NC}"
}

print_error() {
    echo -e "${RED}$1${NC}"
}

# Function to start a new feature
start_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        print_error "Feature name is required"
        echo "Usage: $0 start-feature <feature-name>"
        exit 1
    fi
    
    print_status "Starting feature: $feature_name"
    
    # Check if working directory is clean
    if ! git diff-index --quiet HEAD --; then
        print_warning "Warning: Working directory is not clean"
        echo "Please commit or stash your changes first"
        exit 1
    fi
    
    git flow feature start "$feature_name"
    print_success "Feature branch created: feature/$feature_name"
    echo "You can now start developing your feature"
}

# Function to finish a feature (merge to develop, preserve branch)
finish_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        print_error "Feature name is required"
        echo "Usage: $0 finish-feature <feature-name>"
        exit 1
    fi
    
    print_status "Finishing feature: $feature_name"
    
    # Switch to develop branch
    git checkout develop
    
    # Merge feature branch to develop (preserve branch for visibility)
    git merge --no-ff "feature/$feature_name" -m "Merge feature/$feature_name into develop"
    
    print_success "Feature merged to develop (branch preserved)"
    print_warning "Note: Feature branch 'feature/$feature_name' is preserved for visibility"
    print_warning "To delete it manually: git branch -d feature/$feature_name"
}

# Function to delete a feature branch
delete_feature() {
    local feature_name=$1
    if [ -z "$feature_name" ]; then
        print_error "Feature name is required"
        echo "Usage: $0 delete-feature <feature-name>"
        exit 1
    fi
    
    print_status "Deleting feature branch: $feature_name"
    
    # Switch to develop branch first
    git checkout develop
    
    # Delete the feature branch
    git branch -d "feature/$feature_name"
    
    print_success "Feature branch 'feature/$feature_name' deleted"
}

# Function to start a release
start_release() {
    local release_version=$1
    if [ -z "$release_version" ]; then
        print_error "Release version is required"
        echo "Usage: $0 start-release <version>"
        exit 1
    fi
    
    print_status "Starting release: $release_version"
    git flow release start "$release_version"
    print_success "Release branch created: release/$release_version"
}

# Function to finish a release
finish_release() {
    local release_version=$1
    if [ -z "$release_version" ]; then
        print_error "Release version is required"
        echo "Usage: $0 finish-release <version>"
        exit 1
    fi
    
    print_status "Finishing release: $release_version"
    git flow release finish "$release_version"
    print_success "Release $release_version completed and merged to master"
}

# Function to start a hotfix
start_hotfix() {
    local hotfix_version=$1
    if [ -z "$hotfix_version" ]; then
        print_error "Hotfix version is required"
        echo "Usage: $0 start-hotfix <version>"
        exit 1
    fi
    
    print_status "Starting hotfix: $hotfix_version"
    git flow hotfix start "$hotfix_version"
    print_success "Hotfix branch created: hotfix/$hotfix_version"
}

# Function to finish a hotfix
finish_hotfix() {
    local hotfix_version=$1
    if [ -z "$hotfix_version" ]; then
        print_error "Hotfix version is required"
        echo "Usage: $0 finish-hotfix <version>"
        exit 1
    fi
    
    print_status "Finishing hotfix: $hotfix_version"
    git flow hotfix finish "$hotfix_version"
    print_success "Hotfix $hotfix_version completed and merged to master and develop"
}

# Function to show current status
show_status() {
    print_status "Current Git Flow Status:"
    echo ""
    echo "Current branch: $(git branch --show-current)"
    echo "Git Flow version: $(git flow version 2>/dev/null || echo 'Not available')"
    echo ""
    echo "Available branches:"
    git branch -a
    echo ""
    echo "Recent commits:"
    git log --oneline -5
}

# Function to show help
print_usage() {
    echo "React Admin Git Flow Helper"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start-feature <name>     Start a new feature branch"
    echo "  finish-feature <name>    Finish and merge a feature branch"
    echo "  delete-feature <name>    Delete a feature branch"
    echo "  start-release <version>  Start a new release branch"
    echo "  finish-release <version> Finish and merge a release"
    echo "  start-hotfix <version>   Start a new hotfix branch"
    echo "  finish-hotfix <version>  Finish and merge a hotfix"
    echo "  status                   Show current Git Flow status"
    echo "  help                     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-feature F00001-user-management"
    echo "  $0 finish-feature F00001-user-management"
    echo "  $0 start-release v1.0.0"
    echo "  $0 finish-release v1.0.0"
    echo "  $0 start-hotfix v1.0.1"
    echo "  $0 finish-hotfix v1.0.1"
}

# Main script logic
case "$1" in
    start-feature)
        start_feature "$2"
        ;;
    finish-feature)
        finish_feature "$2"
        ;;
    delete-feature)
        delete_feature "$2"
        ;;
    start-release)
        start_release "$2"
        ;;
    finish-release)
        finish_release "$2"
        ;;
    start-hotfix)
        start_hotfix "$2"
        ;;
    finish-hotfix)
        finish_hotfix "$2"
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        print_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        print_usage
        exit 1
        ;;
esac

