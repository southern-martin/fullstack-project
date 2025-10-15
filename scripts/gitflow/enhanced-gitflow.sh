#!/bin/bash

# Enhanced Git Flow Helper Script
# Preserves feature history and maintains clear feature graph lines
# Usage: ./scripts/gitflow/enhanced-gitflow.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
FEATURE_PREFIX="feature"
RELEASE_PREFIX="release"
HOTFIX_PREFIX="hotfix"
BUGFIX_PREFIX="bugfix"
SUPPORT_PREFIX="support"

# Helper functions
print_usage() {
    echo -e "${BLUE}Enhanced Git Flow Helper${NC}"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo -e "${CYAN}Feature Management:${NC}"
    echo "  start-feature <name>     Start a new feature branch"
    echo "  finish-feature <name>    Finish and merge a feature (preserves history)"
    echo "  rebase-feature <name>    Rebase feature on latest develop"
    echo "  sync-feature <name>      Sync feature with develop"
    echo "  delete-feature <name>    Delete a feature branch"
    echo ""
    echo -e "${CYAN}Release Management:${NC}"
    echo "  start-release <version>  Start a new release"
    echo "  finish-release <version> Finish and merge a release"
    echo ""
    echo -e "${CYAN}Hotfix Management:${NC}"
    echo "  start-hotfix <name>      Start a new hotfix"
    echo "  finish-hotfix <name>     Finish and merge a hotfix"
    echo ""
    echo -e "${CYAN}Bugfix Management:${NC}"
    echo "  start-bugfix <name>      Start a new bugfix branch"
    echo "  finish-bugfix <name>     Finish and merge a bugfix"
    echo ""
    echo -e "${CYAN}Utility Commands:${NC}"
    echo "  status                   Show current branch status"
    echo "  graph                    Show branch graph"
    echo "  cleanup                  Clean up merged branches"
    echo "  help                     Show this help message"
    echo ""
    echo -e "${CYAN}Examples:${NC}"
    echo "  $0 start-feature F00001-user-authentication"
    echo "  $0 finish-feature F00001-user-authentication"
    echo "  $0 rebase-feature F00001-user-authentication"
    echo "  $0 start-release 1.2.0"
    echo "  $0 start-hotfix 1.2.1-security-fix"
}

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

print_feature() {
    echo -e "${PURPLE}[FEATURE]${NC} $1"
}

# Check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository"
        exit 1
    fi
}

# Check if develop branch exists
check_develop_branch() {
    if ! git show-ref --verify --quiet refs/heads/develop; then
        local main_branch=$(check_main_branch)
        print_warning "Develop branch does not exist. Creating it from $main_branch..."
        git checkout -b develop "$main_branch"
        print_success "Develop branch created"
    fi
}

# Check if main/master branch exists
check_main_branch() {
    local main_branch=""
    if git show-ref --verify --quiet refs/heads/main; then
        main_branch="main"
    elif git show-ref --verify --quiet refs/heads/master; then
        main_branch="master"
    else
        print_error "Neither main nor master branch exists"
        exit 1
    fi
    echo "$main_branch"
}

# Check if working directory is clean
check_clean_working_dir() {
    if [[ -n $(git status -s) ]]; then
        print_error "Working directory is not clean"
        echo "Please commit or stash your changes first:"
        git status -s
        exit 1
    fi
}

# Ensure we're on the correct branch
ensure_branch() {
    local expected_branch=$1
    local current_branch=$(git branch --show-current)
    
    if [[ "$current_branch" != "$expected_branch" ]]; then
        print_status "Switching to $expected_branch branch..."
        git checkout "$expected_branch"
    fi
}

# Update develop branch
update_develop() {
    print_status "Updating develop branch..."
    git fetch origin
    git merge origin/develop --ff-only 2>/dev/null || {
        print_warning "Could not fast-forward develop. You may need to merge manually."
    }
}

# Start a new feature
start_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        print_error "Feature name is required"
        echo "Usage: $0 start-feature <feature-name>"
        echo "Example: $0 start-feature F00001-user-authentication"
        exit 1
    fi
    
    # Validate feature name format
    if [[ ! "$feature_name" =~ ^[A-Z][0-9]{5}-[a-z0-9-]+$ ]]; then
        print_warning "Feature name should follow format: F00001-descriptive-name"
        print_warning "Continuing anyway..."
    fi
    
    print_feature "Starting feature: $feature_name"
    
    # Ensure we're on develop
    ensure_branch "develop"
    update_develop
    
    # Create feature branch
    local feature_branch="${FEATURE_PREFIX}/${feature_name}"
    git checkout -b "$feature_branch"
    
    print_success "Feature branch created: $feature_branch"
    print_status "You can now start developing your feature"
    print_status "Use 'git add .' and 'git commit -m \"feat: description\"' to commit changes"
}

# Finish a feature (preserves history with no-ff merge)
finish_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        print_error "Feature name is required"
        exit 1
    fi
    
    local feature_branch="${FEATURE_PREFIX}/${feature_name}"
    
    # Check if feature branch exists
    if ! git show-ref --verify --quiet refs/heads/"$feature_branch"; then
        print_error "Feature branch '$feature_branch' does not exist"
        exit 1
    fi
    
    print_feature "Finishing feature: $feature_name"
    
    # Ensure working directory is clean
    check_clean_working_dir
    
    # Switch to feature branch and ensure it's up to date
    git checkout "$feature_branch"
    
    # Update develop and rebase feature on latest develop
    print_status "Updating develop branch..."
    git fetch origin
    git checkout develop
    git merge origin/develop --ff-only 2>/dev/null || {
        print_warning "Could not fast-forward develop"
    }
    
    # Switch back to feature and rebase
    git checkout "$feature_branch"
    print_status "Rebasing feature on latest develop..."
    git rebase develop || {
        print_error "Rebase failed. Please resolve conflicts and run:"
        echo "  git rebase --continue"
        echo "  $0 finish-feature $feature_name"
        exit 1
    }
    
    # Switch to develop and merge with no-ff to preserve history
    git checkout develop
    print_status "Merging feature with no-ff to preserve history..."
    git merge "$feature_branch" --no-ff -m "Merge feature/$feature_name into develop

Feature: $feature_name
- Preserves feature history in git graph
- Use 'git log --graph --oneline' to see feature line"
    
    print_success "Feature merged to develop with preserved history"
    print_status "Feature branch '$feature_branch' is preserved for visibility"
    print_status "Use 'git log --graph --oneline' to see the feature history"
    
    # Show the merge commit
    echo ""
    print_status "Latest merge commit:"
    git log -1 --pretty=format:"%h %s" --graph
}

# Rebase feature on latest develop
rebase_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        print_error "Feature name is required"
        exit 1
    fi
    
    local feature_branch="${FEATURE_PREFIX}/${feature_name}"
    
    if ! git show-ref --verify --quiet refs/heads/"$feature_branch"; then
        print_error "Feature branch '$feature_branch' does not exist"
        exit 1
    fi
    
    print_feature "Rebasing feature: $feature_name"
    
    # Ensure working directory is clean
    check_clean_working_dir
    
    # Update develop
    git fetch origin
    git checkout develop
    git merge origin/develop --ff-only 2>/dev/null || {
        print_warning "Could not fast-forward develop"
    }
    
    # Switch to feature and rebase
    git checkout "$feature_branch"
    print_status "Rebasing feature on latest develop..."
    git rebase develop || {
        print_error "Rebase failed. Please resolve conflicts and run:"
        echo "  git rebase --continue"
        exit 1
    }
    
    print_success "Feature rebased on latest develop"
}

# Sync feature with develop (rebase + push)
sync_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        print_error "Feature name is required"
        exit 1
    fi
    
    local feature_branch="${FEATURE_PREFIX}/${feature_name}"
    
    if ! git show-ref --verify --quiet refs/heads/"$feature_branch"; then
        print_error "Feature branch '$feature_branch' does not exist"
        exit 1
    fi
    
    print_feature "Syncing feature: $feature_name"
    
    # Rebase the feature
    rebase_feature "$feature_name"
    
    # Force push the rebased feature
    print_status "Force pushing rebased feature..."
    git push origin "$feature_branch" --force-with-lease
    
    print_success "Feature synced and pushed"
}

# Delete a feature branch
delete_feature() {
    local feature_name=$1
    if [[ -z "$feature_name" ]]; then
        print_error "Feature name is required"
        exit 1
    fi
    
    local feature_branch="${FEATURE_PREFIX}/${feature_name}"
    
    if ! git show-ref --verify --quiet refs/heads/"$feature_branch"; then
        print_error "Feature branch '$feature_branch' does not exist"
        exit 1
    fi
    
    print_feature "Deleting feature branch: $feature_name"
    
    # Ensure we're not on the feature branch
    local current_branch=$(git branch --show-current)
    if [[ "$current_branch" == "$feature_branch" ]]; then
        git checkout develop
    fi
    
    # Delete the feature branch
    git branch -d "$feature_branch" || {
        print_warning "Could not delete branch (may not be fully merged)"
        print_warning "Use 'git branch -D $feature_branch' to force delete"
        exit 1
    }
    
    print_success "Feature branch '$feature_branch' deleted"
}

# Start a release
start_release() {
    local version=$1
    if [[ -z "$version" ]]; then
        print_error "Version is required"
        echo "Usage: $0 start-release <version>"
        echo "Example: $0 start-release 1.2.0"
        exit 1
    fi
    
    print_status "Starting release: $version"
    
    # Ensure we're on develop
    ensure_branch "develop"
    update_develop
    
    # Create release branch
    local release_branch="${RELEASE_PREFIX}/${version}"
    git checkout -b "$release_branch"
    
    print_success "Release branch created: $release_branch"
    print_status "Update version numbers, changelog, and test thoroughly"
    print_status "Use 'git commit -m \"chore: bump version to $version\"' to commit changes"
}

# Finish a release
finish_release() {
    local version=$1
    if [[ -z "$version" ]]; then
        print_error "Version is required"
        exit 1
    fi
    
    local release_branch="${RELEASE_PREFIX}/${version}"
    
    if ! git show-ref --verify --quiet refs/heads/"$release_branch"; then
        print_error "Release branch '$release_branch' does not exist"
        exit 1
    fi
    
    print_status "Finishing release: $version"
    check_clean_working_dir
    
    # Switch to release branch
    git checkout "$release_branch"
    
    # Tag the release
    print_status "Creating release tag: v$version"
    git tag -a "v$version" -m "Release version $version"
    
    # Merge to main/master
    local main_branch=$(check_main_branch)
    print_status "Merging to $main_branch..."
    git checkout "$main_branch"
    git merge "$release_branch" --no-ff -m "Release $version"
    
    # Merge back to develop
    print_status "Merging back to develop..."
    git checkout develop
    git merge "$release_branch" --no-ff -m "Merge release $version back to develop"
    
    # Delete release branch
    git branch -d "$release_branch"
    
    print_success "Release $version completed"
    local main_branch=$(check_main_branch)
    print_status "Don't forget to push: git push origin $main_branch develop --tags"
}

# Start a hotfix
start_hotfix() {
    local hotfix_name=$1
    if [[ -z "$hotfix_name" ]]; then
        print_error "Hotfix name is required"
        echo "Usage: $0 start-hotfix <hotfix-name>"
        echo "Example: $0 start-hotfix 1.2.1-security-fix"
        exit 1
    fi
    
    print_status "Starting hotfix: $hotfix_name"
    
    # Ensure we're on main/master
    local main_branch=$(check_main_branch)
    ensure_branch "$main_branch"
    git fetch origin
    git merge "origin/$main_branch" --ff-only 2>/dev/null || {
        print_warning "Could not fast-forward $main_branch"
    }
    
    # Create hotfix branch
    local hotfix_branch="${HOTFIX_PREFIX}/${hotfix_name}"
    git checkout -b "$hotfix_branch"
    
    print_success "Hotfix branch created: $hotfix_branch"
    print_status "Make your critical fix and test thoroughly"
}

# Finish a hotfix
finish_hotfix() {
    local hotfix_name=$1
    if [[ -z "$hotfix_name" ]]; then
        print_error "Hotfix name is required"
        exit 1
    fi
    
    local hotfix_branch="${HOTFIX_PREFIX}/${hotfix_name}"
    
    if ! git show-ref --verify --quiet refs/heads/"$hotfix_branch"; then
        print_error "Hotfix branch '$hotfix_branch' does not exist"
        exit 1
    fi
    
    print_status "Finishing hotfix: $hotfix_name"
    check_clean_working_dir
    
    # Switch to hotfix branch
    git checkout "$hotfix_branch"
    
    # Extract version from hotfix name (assume format: version-description)
    local version=$(echo "$hotfix_name" | cut -d'-' -f1)
    
    # Tag the hotfix
    print_status "Creating hotfix tag: v$version"
    git tag -a "v$version" -m "Hotfix $hotfix_name"
    
    # Merge to main/master
    local main_branch=$(check_main_branch)
    print_status "Merging to $main_branch..."
    git checkout "$main_branch"
    git merge "$hotfix_branch" --no-ff -m "Hotfix $hotfix_name"
    
    # Merge to develop
    print_status "Merging to develop..."
    git checkout develop
    git merge "$hotfix_branch" --no-ff -m "Merge hotfix $hotfix_name to develop"
    
    # Delete hotfix branch
    git branch -d "$hotfix_branch"
    
    print_success "Hotfix $hotfix_name completed"
    local main_branch=$(check_main_branch)
    print_status "Don't forget to push: git push origin $main_branch develop --tags"
}

# Start a bugfix
start_bugfix() {
    local bugfix_name=$1
    if [[ -z "$bugfix_name" ]]; then
        print_error "Bugfix name is required"
        echo "Usage: $0 start-bugfix <bugfix-name>"
        echo "Example: $0 start-bugfix B00001-fix-login-validation"
        exit 1
    fi
    
    print_status "Starting bugfix: $bugfix_name"
    
    # Ensure we're on develop
    ensure_branch "develop"
    update_develop
    
    # Create bugfix branch
    local bugfix_branch="${BUGFIX_PREFIX}/${bugfix_name}"
    git checkout -b "$bugfix_branch"
    
    print_success "Bugfix branch created: $bugfix_branch"
    print_status "Fix the bug and test thoroughly"
}

# Finish a bugfix
finish_bugfix() {
    local bugfix_name=$1
    if [[ -z "$bugfix_name" ]]; then
        print_error "Bugfix name is required"
        exit 1
    fi
    
    local bugfix_branch="${BUGFIX_PREFIX}/${bugfix_name}"
    
    if ! git show-ref --verify --quiet refs/heads/"$bugfix_branch"; then
        print_error "Bugfix branch '$bugfix_branch' does not exist"
        exit 1
    fi
    
    print_status "Finishing bugfix: $bugfix_name"
    check_clean_working_dir
    
    # Switch to bugfix branch
    git checkout "$bugfix_branch"
    
    # Rebase on latest develop
    print_status "Rebasing on latest develop..."
    git fetch origin
    git checkout develop
    git merge origin/develop --ff-only 2>/dev/null || {
        print_warning "Could not fast-forward develop"
    }
    
    git checkout "$bugfix_branch"
    git rebase develop || {
        print_error "Rebase failed. Please resolve conflicts and run:"
        echo "  git rebase --continue"
        echo "  $0 finish-bugfix $bugfix_name"
        exit 1
    }
    
    # Merge to develop
    git checkout develop
    git merge "$bugfix_branch" --no-ff -m "Fix: $bugfix_name"
    
    # Delete bugfix branch
    git branch -d "$bugfix_branch"
    
    print_success "Bugfix $bugfix_name completed"
}

# Show current status
show_status() {
    echo -e "${BLUE}Current Git Flow Status:${NC}"
    echo ""
    
    local current_branch=$(git branch --show-current)
    echo -e "${CYAN}Current branch:${NC} $current_branch"
    echo ""
    
    echo -e "${CYAN}Recent commits:${NC}"
    git log --oneline -5 --graph
    echo ""
    
    echo -e "${CYAN}Branch status:${NC}"
    git status -sb
    echo ""
    
    echo -e "${CYAN}Active feature branches:${NC}"
    git branch | grep "feature/" | sed 's/^[ *]*//' || echo "No active feature branches"
    echo ""
    
    echo -e "${CYAN}Active release branches:${NC}"
    git branch | grep "release/" | sed 's/^[ *]*//' || echo "No active release branches"
    echo ""
    
    echo -e "${CYAN}Active hotfix branches:${NC}"
    git branch | grep "hotfix/" | sed 's/^[ *]*//' || echo "No active hotfix branches"
}

# Show branch graph
show_graph() {
    echo -e "${BLUE}Branch Graph:${NC}"
    echo ""
    git log --graph --oneline --all --decorate -20
    echo ""
    echo -e "${CYAN}Full graph:${NC} git log --graph --oneline --all --decorate"
}

# Clean up merged branches
cleanup_branches() {
    print_status "Cleaning up merged branches..."
    
    # Update all branches
    git fetch origin
    
    # Delete merged feature branches
    local merged_features=$(git branch --merged develop | grep "feature/" | sed 's/^[ *]*//')
    if [[ -n "$merged_features" ]]; then
        echo -e "${CYAN}Merged feature branches:${NC}"
        echo "$merged_features"
        echo ""
        read -p "Delete these merged feature branches? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "$merged_features" | xargs -r git branch -d
            print_success "Merged feature branches deleted"
        fi
    else
        print_status "No merged feature branches found"
    fi
    
    # Delete merged release branches
    local main_branch=$(check_main_branch)
    local merged_releases=$(git branch --merged "$main_branch" | grep "release/" | sed 's/^[ *]*//')
    if [[ -n "$merged_releases" ]]; then
        echo -e "${CYAN}Merged release branches:${NC}"
        echo "$merged_releases"
        echo ""
        read -p "Delete these merged release branches? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "$merged_releases" | xargs -r git branch -d
            print_success "Merged release branches deleted"
        fi
    else
        print_status "No merged release branches found"
    fi
}

# Main script logic
check_git_repo
check_main_branch > /dev/null  # Check but don't output
check_develop_branch

case "$1" in
    "start-feature")
        start_feature "$2"
        ;;
    "finish-feature")
        finish_feature "$2"
        ;;
    "rebase-feature")
        rebase_feature "$2"
        ;;
    "sync-feature")
        sync_feature "$2"
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
    "start-bugfix")
        start_bugfix "$2"
        ;;
    "finish-bugfix")
        finish_bugfix "$2"
        ;;
    "status")
        show_status
        ;;
    "graph")
        show_graph
        ;;
    "cleanup")
        cleanup_branches
        ;;
    "help"|"")
        print_usage
        ;;
    *)
        print_error "Unknown command '$1'"
        print_usage
        exit 1
        ;;
esac
