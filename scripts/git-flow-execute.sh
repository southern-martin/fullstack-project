#!/bin/bash

# Git Flow Execution Script
# Complete strategy for merging all features to develop
# Repository: fullstack-project
# Date: October 18, 2025

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════${NC}"
    echo ""
}

# Function to confirm action
confirm() {
    read -p "$(echo -e ${YELLOW}⚠️  $1 '[y/N]'${NC}) " response
    case "$response" in
        [yY][eE][sS]|[yY]) 
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# Function to run tests
run_tests() {
    print_info "Running tests..."
    
    # Docker build test
    print_info "Testing Docker builds..."
    docker-compose -f docker-compose.hybrid.yml build
    
    # Start services
    print_info "Starting services..."
    docker-compose -f docker-compose.hybrid.yml up -d
    
    # Wait for services
    print_info "Waiting for services to be ready..."
    sleep 10
    
    # Health checks
    print_info "Running health checks..."
    curl -f http://localhost:3001/api/v1/auth/health || return 1
    curl -f http://localhost:3003/api/v1/health || return 1
    
    print_success "All tests passed!"
    return 0
}

# Function to create and merge feature branch
merge_feature() {
    local branch_name=$1
    local commit_message=$2
    local tag_name=$3
    local tag_message=$4
    local files_to_add=$5
    
    print_header "Feature: $branch_name"
    
    # Ensure we're on develop and up to date
    print_info "Checking out develop..."
    git checkout develop
    git pull origin develop
    
    # Create feature branch
    print_info "Creating feature branch: $branch_name"
    git checkout -b "$branch_name"
    
    # Add files
    print_info "Staging files..."
    eval "git add $files_to_add"
    
    # Show status
    print_info "Git status:"
    git status
    
    # Confirm commit
    if ! confirm "Commit these changes?"; then
        print_warning "Skipping commit. You can commit manually."
        return 1
    fi
    
    # Commit
    print_info "Committing changes..."
    git commit -m "$commit_message"
    
    # Push
    print_info "Pushing to remote..."
    git push -u origin "$branch_name"
    
    print_success "Feature branch created and pushed!"
    print_warning "Please create a Pull Request on GitHub for review."
    
    # Wait for PR approval
    if ! confirm "Has the PR been approved? Ready to merge?"; then
        print_warning "Waiting for PR approval. Run this script again when ready."
        return 1
    fi
    
    # Merge to develop
    print_info "Merging to develop..."
    git checkout develop
    git pull origin develop
    git merge --no-ff "$branch_name"
    git push origin develop
    
    # Create tag
    print_info "Creating tag: $tag_name"
    git tag -a "$tag_name" -m "$tag_message"
    git push origin "$tag_name"
    
    print_success "Feature merged and tagged: $tag_name"
    
    # Run tests
    if confirm "Run tests after merge?"; then
        if run_tests; then
            print_success "Tests passed! Ready for next feature."
        else
            print_error "Tests failed! Please investigate."
            return 1
        fi
    fi
    
    # Clean up branch (optional)
    if confirm "Delete feature branch $branch_name?"; then
        git branch -d "$branch_name"
        git push origin --delete "$branch_name"
        print_success "Branch cleaned up"
    fi
    
    return 0
}

# Main execution
main() {
    print_header "Git Flow Execution - Fullstack Project"
    
    print_info "This script will guide you through merging all features to develop."
    print_info "Total features: 6"
    print_info "Estimated time: 1-2 weeks"
    echo ""
    
    if ! confirm "Do you want to proceed?"; then
        print_warning "Execution cancelled."
        exit 0
    fi
    
    # Feature 1: Documentation Cleanup
    if confirm "Merge Feature 1: Documentation Cleanup?"; then
        merge_feature \
            "feature/documentation-cleanup" \
            "feat(docs): organize and archive outdated documentation

- Moved architecture docs to proper subdirectories
- Archived non-relevant documentation
- Created documentation cleanup plan and completion summary
- Organized root markdown files into docs/ structure

Files: 50+ documentation files organized
Status: ✅ Complete" \
            "v1.1.0-docs" \
            "Documentation cleanup and organization" \
            "docs/ DOCUMENTATION-CLEANUP-*.md"
    fi
    
    # Feature 2: CMake Modernization
    if confirm "Merge Feature 2: CMake Modernization?"; then
        merge_feature \
            "feature/cmake-modernization" \
            "feat(build): modernize CMake for hybrid architecture

- Updated CMake to reflect current microservices structure
- Added shared infrastructure targets
- Added 6 microservice targets
- Added 2 frontend targets
- Comprehensive help system

CMake version: 3.10+
Services: 6 microservices + 2 frontends
Infrastructure: Shared MySQL + Redis" \
            "v1.2.0-build" \
            "CMake modernization" \
            "CMakeLists.txt build.sh"
    fi
    
    # Feature 3: Customer Service Architecture
    if confirm "Merge Feature 3: Customer Service Architecture Review?"; then
        merge_feature \
            "feature/customer-service-architecture-review" \
            "feat(customer): apply Clean Architecture guidelines

- Reviewed and validated Customer Service architecture
- Added domain events infrastructure
- Implemented repository pattern
- Added comprehensive architecture documentation

Architecture: Clean Architecture layers, Event-driven patterns
Documentation: ARCHITECTURE-REVIEW.md, EVENT-IMPLEMENTATION-SUMMARY.md
Benefits: Improved maintainability, Better separation of concerns" \
            "v1.3.0-customer" \
            "Customer Service architecture review" \
            "customer-service/"
    fi
    
    # Feature 4: Docker Infrastructure Fix (CRITICAL)
    print_header "CRITICAL FEATURE: Docker Shared Infrastructure Fix"
    print_warning "This is the most important feature. Requires thorough testing!"
    
    if confirm "Merge Feature 4: Docker Shared Infrastructure Fix?"; then
        merge_feature \
            "feature/docker-shared-infrastructure-fix" \
            "feat(docker): fix shared infrastructure resolution in Docker

Problem: TypeScript path aliases compiling to .ts extensions
Solution: NPM package names + updated working directories

Changes:
- Auth Service: 10 files (Dockerfile + imports)
- User Service: 12 files (Dockerfile + imports)
- Docker Compose: Build contexts updated
- Documentation: 6 comprehensive Git Flow documents

Verification:
- Auth health: ✅ http://localhost:3001/api/v1/auth/health
- User health: ✅ http://localhost:3003/api/v1/health
- Login working with JWT tokens ✅
- 400+ test users accessible ✅

Files: 26 changed
Services: Auth + User
Status: ✅ Production Ready" \
            "v1.4.0-docker" \
            "Docker shared infrastructure fix - Production ready" \
            "auth-service/ user-service/ docker-compose.hybrid.yml docs/development/ .github/copilot-instructions.md QUICK-START.md shared-database/README.md"
    fi
    
    # Feature 5: Carrier Service Architecture (PENDING IMPLEMENTATION)
    print_warning "Feature 5 & 6 require implementation before merging."
    print_info "Please implement these features following the established patterns."
    print_info "See GIT-FLOW-COMPLETE-STRATEGY.md for detailed instructions."
    
    if confirm "Have you implemented Carrier Service architecture review?"; then
        if confirm "Merge Feature 5: Carrier Service Architecture Review?"; then
            merge_feature \
                "feature/carrier-service-architecture-review" \
                "feat(carrier): apply Clean Architecture guidelines" \
                "v1.5.0-carrier" \
                "Carrier Service architecture review" \
                "carrier-service/"
        fi
    else
        print_warning "Skipping Feature 5. Implement first, then run script again."
    fi
    
    # Feature 6: Pricing Service Architecture (PENDING IMPLEMENTATION)
    if confirm "Have you implemented Pricing Service architecture review?"; then
        if confirm "Merge Feature 6: Pricing Service Architecture Review?"; then
            merge_feature \
                "feature/pricing-service-architecture-review" \
                "feat(pricing): apply Clean Architecture guidelines" \
                "v1.6.0-pricing" \
                "Pricing Service architecture review" \
                "pricing-service/"
        fi
    else
        print_warning "Skipping Feature 6. Implement first, then run script again."
    fi
    
    # Final Release
    print_header "Final Release Preparation"
    
    if confirm "Are all features merged and ready for v2.0.0 release?"; then
        print_info "Creating final release tag..."
        git checkout develop
        git pull origin develop
        
        git tag -a v2.0.0 -m "Release: Complete architecture modernization

Features:
- Documentation cleanup and organization
- CMake build system modernization
- Customer Service architecture review
- Docker shared infrastructure fix (critical)
- Carrier Service architecture review
- Pricing Service architecture review

Status: Production Ready
Services: All 6 microservices + 2 frontends
Infrastructure: Shared MySQL + Redis"
        
        git push origin v2.0.0
        
        print_success "🎉 Release v2.0.0 created!"
        
        if confirm "Merge develop to main/master?"; then
            git checkout main
            git merge --no-ff develop
            git push origin main
            print_success "Develop merged to main!"
        fi
    else
        print_warning "Not all features ready. Complete remaining features first."
    fi
    
    print_header "Git Flow Execution Complete!"
    print_success "All requested features processed."
    print_info "Review the tags and branches on GitHub."
    print_info "See GIT-FLOW-COMPLETE-STRATEGY.md for complete documentation."
}

# Run main function
main

exit 0
