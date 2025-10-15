#!/bin/bash

# Git Flow Helper Script for NestJS API
# This script provides convenient commands for Git Flow operations

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print usage
print_usage() {
    echo -e "${BLUE}Git Flow Helper for NestJS API${NC}"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  start-feature <name>     Start a new feature branch"
    echo "  finish-feature <name>    Finish and merge a feature branch"
    echo "  start-release <version>  Start a new release branch"
    echo "  finish-release <version> Finish and merge a release branch"
    echo "  start-hotfix <name>      Start a new hotfix branch"
    echo "  finish-hotfix <name>     Finish and merge a hotfix branch"
    echo "  delete-feature <name>    Delete a feature branch manually"
    echo "  status                   Show current Git Flow status"
    echo "  help                     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-feature F00001-user-authentication"
    echo "  $0 finish-feature F00001-user-authentication"
    echo "  $0 start-release 1.0.0"
    echo "  $0 delete-feature F00001-user-authentication"
}

# Function to check if working directory is clean
check_clean_working_dir() {
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}Warning: Working directory is not clean${NC}"
        echo "Please commit or stash your changes first"
        exit 1
    fi
}

# Function to start a feature
start_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        echo -e "${RED}Error: Feature name is required${NC}"
        echo "Usage: $0 start-feature <name>"
        exit 1
    fi
    
    echo -e "${BLUE}Starting feature: $feature_name${NC}"
    check_clean_working_dir
    
    git flow feature start "$feature_name"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}Feature branch created: feature/$feature_name${NC}"
        echo "You can now start developing your feature"
    else
        echo -e "${RED}Error: Failed to create feature branch${NC}"
        exit 1
    fi
}

# Function to finish a feature (with branch preservation)
finish_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        echo -e "${RED}Error: Feature name is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finishing feature: $feature_name${NC}"
    check_clean_working_dir
    
    # Switch to develop branch
    git checkout develop
    
    # Merge the feature branch (without deleting it)
    git merge "feature/$feature_name" --no-ff -m "Merge feature/$feature_name into develop"
    
    echo -e "${GREEN}Feature merged to develop (branch preserved)${NC}"
    echo -e "${YELLOW}Note: Feature branch 'feature/$feature_name' is preserved for visibility${NC}"
    echo -e "${YELLOW}To delete it manually: git branch -d feature/$feature_name${NC}"
}

# Function to delete a feature branch
delete_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        echo -e "${RED}Error: Feature name is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Deleting feature branch: $feature_name${NC}"
    
    # Check if branch exists
    if ! git show-ref --verify --quiet refs/heads/feature/$feature_name; then
        echo -e "${RED}Error: Feature branch 'feature/$feature_name' does not exist${NC}"
        exit 1
    fi
    
    # Delete the feature branch
    git branch -d feature/$feature_name
    echo -e "${GREEN}Feature branch 'feature/$feature_name' deleted${NC}"
}

# Function to start a release
start_release() {
    local version=$1
    if [[ -z "$version" ]]; then
        echo -e "${RED}Error: Version is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Starting release: $version${NC}"
    check_clean_working_dir
    
    git flow release start "$version"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}Release branch created: release/$version${NC}"
        echo "You can now work on the release"
    else
        echo -e "${RED}Error: Failed to create release branch${NC}"
        exit 1
    fi
}

# Function to finish a release
finish_release() {
    local version=$1
    if [[ -z "$version" ]]; then
        echo -e "${RED}Error: Version is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finishing release: $version${NC}"
    check_clean_working_dir
    
    git flow release finish "$version"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}Release $version completed${NC}"
        echo "Release merged to master and develop"
        echo "Tag created: $version"
    else
        echo -e "${RED}Error: Failed to finish release${NC}"
        exit 1
    fi
}

# Function to start a hotfix
start_hotfix() {
    local hotfix_name=$1
    if [[ -z "$hotfix_name" ]]; then
        echo -e "${RED}Error: Hotfix name is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Starting hotfix: $hotfix_name${NC}"
    check_clean_working_dir
    
    git flow hotfix start "$hotfix_name"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}Hotfix branch created: hotfix/$hotfix_name${NC}"
        echo "You can now work on the hotfix"
    else
        echo -e "${RED}Error: Failed to create hotfix branch${NC}"
        exit 1
    fi
}

# Function to finish a hotfix
finish_hotfix() {
    local hotfix_name=$1
    if [[ -z "$hotfix_name" ]]; then
        echo -e "${RED}Error: Hotfix name is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finishing hotfix: $hotfix_name${NC}"
    check_clean_working_dir
    
    git flow hotfix finish "$hotfix_name"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}Hotfix $hotfix_name completed${NC}"
        echo "Hotfix merged to master and develop"
    else
        echo -e "${RED}Error: Failed to finish hotfix${NC}"
        exit 1
    fi
}

# Function to show Git Flow status
show_status() {
    echo -e "${BLUE}Git Flow Status for NestJS API${NC}"
    echo ""
    
    # Current branch
    current_branch=$(git branch --show-current)
    echo -e "Current branch: ${GREEN}$current_branch${NC}"
    
    # Show all branches
    echo ""
    echo -e "${BLUE}All branches:${NC}"
    git branch -a
    
    # Show recent commits
    echo ""
    echo -e "${BLUE}Recent commits:${NC}"
    git log --oneline -5
}

# Main script logic
case "$1" in
    "start-feature")
        start_feature "$2"
        ;;
    "finish-feature")
        finish_feature "$2"
        ;;
    "start-release")
        start_release "$2"
        ;;
    "finish-release")
        finish_release "$2"
        ;;
    "start-hotfix")
        start_hotfix "$2"
        ;;
    "finish-hotfix")
        finish_hotfix "$2"
        ;;
    "delete-feature")
        delete_feature "$2"
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h")
        print_usage
        ;;
    *)
        echo -e "${RED}Error: Unknown command '$1'${NC}"
        echo ""
        print_usage
        exit 1
        ;;
esac


