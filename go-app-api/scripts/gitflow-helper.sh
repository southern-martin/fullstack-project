#!/bin/bash

# Git Flow Helper Script for Go API
# Usage: ./scripts/gitflow-helper.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_usage() {
    echo "Git Flow Helper for Go API"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  start-feature <name>     Start a new feature branch"
    echo "  finish-feature <name>     Finish and merge a feature"
    echo "  start-release <version>   Start a new release"
    echo "  finish-release <version>  Finish and merge a release"
    echo "  start-hotfix <name>       Start a new hotfix"
    echo "  finish-hotfix <name>      Finish and merge a hotfix"
    echo "  delete-feature <name>     Delete a feature branch manually"
    echo "  status                   Show current branch status"
    echo "  help                     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start-feature user-auth"
    echo "  $0 finish-feature user-auth"
    echo "  $0 start-release 1.2.0"
    echo "  $0 finish-release 1.2.0"
}

check_git_flow() {
    if ! command -v git-flow &> /dev/null; then
        echo -e "${RED}Error: git-flow is not installed${NC}"
        echo "Install it with: brew install git-flow"
        exit 1
    fi
}

check_clean_working_dir() {
    if [[ -n $(git status -s) ]]; then
        echo -e "${YELLOW}Warning: Working directory is not clean${NC}"
        echo "Please commit or stash your changes first"
        exit 1
    fi
}

start_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        echo -e "${RED}Error: Feature name is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Starting feature: $feature_name${NC}"
    git flow feature start "$feature_name"
    echo -e "${GREEN}Feature branch created: feature/$feature_name${NC}"
    echo "You can now start developing your feature"
}

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

start_release() {
    local version=$1
    if [[ -z "$version" ]]; then
        echo -e "${RED}Error: Version is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Starting release: $version${NC}"
    git flow release start "$version"
    echo -e "${GREEN}Release branch created: release/$version${NC}"
    echo "Update version numbers, changelog, and test thoroughly"
}

finish_release() {
    local version=$1
    if [[ -z "$version" ]]; then
        echo -e "${RED}Error: Version is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finishing release: $version${NC}"
    check_clean_working_dir
    git flow release finish "$version"
    echo -e "${GREEN}Release $version completed${NC}"
    echo "Don't forget to push: git push origin master develop --tags"
}

start_hotfix() {
    local hotfix_name=$1
    if [[ -z "$hotfix_name" ]]; then
        echo -e "${RED}Error: Hotfix name is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Starting hotfix: $hotfix_name${NC}"
    git flow hotfix start "$hotfix_name"
    echo -e "${GREEN}Hotfix branch created: hotfix/$hotfix_name${NC}"
}

finish_hotfix() {
    local hotfix_name=$1
    if [[ -z "$hotfix_name" ]]; then
        echo -e "${RED}Error: Hotfix name is required${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}Finishing hotfix: $hotfix_name${NC}"
    check_clean_working_dir
    git flow hotfix finish "$hotfix_name"
    echo -e "${GREEN}Hotfix merged to master and develop${NC}"
    echo "Don't forget to push: git push origin master develop --tags"
}

show_status() {
    echo -e "${BLUE}Current Git Flow Status:${NC}"
    echo ""
    echo "Current branch: $(git branch --show-current)"
    echo ""
    echo "Recent commits:"
    git log --oneline -5
    echo ""
    echo "Branch status:"
    git status -sb
}

# Main script logic
check_git_flow

case "$1" in
    "start-feature")
        start_feature "$2"
        ;;
    "finish-feature")
        finish_feature "$2"
        ;;
    "delete-feature")
        delete_feature "$2"
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
    "status")
        show_status
        ;;
    "help"|"")
        print_usage
        ;;
    *)
        echo -e "${RED}Error: Unknown command '$1'${NC}"
        print_usage
        exit 1
        ;;
esac
