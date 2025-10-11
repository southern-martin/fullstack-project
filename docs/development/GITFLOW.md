# Git Flow for NestJS API

This document describes the Git Flow workflow for the NestJS API project.

## Overview

Git Flow is a branching model that provides a robust framework for managing features, releases, and hotfixes in a collaborative development environment.

## Branch Structure

```
master (production)
├── develop (integration)
│   ├── feature/F00001-feature-name
│   ├── feature/F00002-another-feature
│   └── release/1.0.0
└── hotfix/1.0.1-bug-fix
```

## Branch Types

### 1. **master** (Production)
- Contains production-ready code
- Protected branch
- Only updated via releases and hotfixes
- Each commit should be tagged with version

### 2. **develop** (Integration)
- Main development branch
- Integration branch for features
- Should always be in a deployable state
- Source for releases

### 3. **feature/** (Feature Development)
- Branch from: `develop`
- Merge to: `develop`
- Naming: `feature/F00001-descriptive-name`
- Purpose: New features, enhancements

### 4. **release/** (Release Preparation)
- Branch from: `develop`
- Merge to: `master` and `develop`
- Naming: `release/1.0.0`
- Purpose: Prepare new production release

### 5. **hotfix/** (Critical Fixes)
- Branch from: `master`
- Merge to: `master` and `develop`
- Naming: `hotfix/1.0.1-description`
- Purpose: Critical production fixes

## Workflow Commands

### Using the Helper Script

```bash
# Start a new feature
./scripts/gitflow-helper.sh start-feature F00001-user-authentication

# Finish a feature (preserves branch for visibility)
./scripts/gitflow-helper.sh finish-feature F00001-user-authentication

# Delete a feature branch manually
./scripts/gitflow-helper.sh delete-feature F00001-user-authentication

# Start a release
./scripts/gitflow-helper.sh start-release 1.0.0

# Finish a release
./scripts/gitflow-helper.sh finish-release 1.0.0

# Start a hotfix
./scripts/gitflow-helper.sh start-hotfix 1.0.1-security-fix

# Finish a hotfix
./scripts/gitflow-helper.sh finish-hotfix 1.0.1-security-fix

# Show status
./scripts/gitflow-helper.sh status
```

### Direct Git Flow Commands

```bash
# Initialize Git Flow
git flow init -d

# Feature workflow
git flow feature start F00001-feature-name
git flow feature finish F00001-feature-name

# Release workflow
git flow release start 1.0.0
git flow release finish 1.0.0

# Hotfix workflow
git flow hotfix start 1.0.1-bug-fix
git flow hotfix finish 1.0.1-bug-fix
```

## Feature Naming Convention

### Features
- Format: `F00001-descriptive-name`
- Examples:
  - `F00001-user-authentication`
  - `F00002-password-reset`
  - `F00003-email-verification`
  - `F00004-logging-system`
  - `F00005-api-documentation`

### Releases
- Format: `1.0.0` (Semantic Versioning)
- Examples:
  - `1.0.0` (Initial release)
  - `1.1.0` (New features)
  - `1.0.1` (Bug fixes)

### Hotfixes
- Format: `1.0.1-description`
- Examples:
  - `1.0.1-security-patch`
  - `1.0.2-critical-bug-fix`

## Development Workflow

### 1. Starting a Feature
```bash
# Switch to develop and pull latest changes
git checkout develop
git pull origin develop

# Start new feature
./scripts/gitflow-helper.sh start-feature F00001-feature-name

# Make your changes and commit
git add .
git commit -m "feat: implement user authentication"

# Push feature branch
git push origin feature/F00001-feature-name
```

### 2. Finishing a Feature
```bash
# Ensure all changes are committed
git add .
git commit -m "feat: complete user authentication implementation"

# Finish feature (merges to develop)
./scripts/gitflow-helper.sh finish-feature F00001-feature-name

# Push develop branch
git push origin develop
```

### 3. Creating a Release
```bash
# Start release
./scripts/gitflow-helper.sh start-release 1.0.0

# Update version numbers, changelog, etc.
# Commit changes
git add .
git commit -m "chore: prepare release 1.0.0"

# Finish release
./scripts/gitflow-helper.sh finish-release 1.0.0

# Push all changes
git push origin master develop
git push origin --tags
```

### 4. Creating a Hotfix
```bash
# Start hotfix
./scripts/gitflow-helper.sh start-hotfix 1.0.1-security-fix

# Make critical fix
git add .
git commit -m "fix: resolve security vulnerability"

# Finish hotfix
./scripts/gitflow-helper.sh finish-hotfix 1.0.1-security-fix

# Push all changes
git push origin master develop
git push origin --tags
```

## Best Practices

### 1. **Commit Messages**
Use conventional commit format:
```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

### 2. **Feature Development**
- Keep features small and focused
- Test thoroughly before finishing
- Update documentation as needed
- Follow coding standards

### 3. **Release Preparation**
- Update version numbers
- Update CHANGELOG.md
- Update documentation
- Run full test suite
- Update dependencies if needed

### 4. **Hotfix Guidelines**
- Only for critical production issues
- Keep changes minimal
- Test thoroughly
- Document the fix

## Branch Protection Rules

### master Branch
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to master

### develop Branch
- Require pull request reviews
- Require status checks to pass
- Allow force pushes (for feature merges)

## Integration with CI/CD

### Automated Checks
- Run tests on all branches
- Run linting and formatting checks
- Build and test Docker images
- Security vulnerability scanning

### Deployment
- `master` branch → Production deployment
- `develop` branch → Staging deployment
- Feature branches → Development deployment

## Troubleshooting

### Common Issues

1. **Merge Conflicts**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git rebase develop
   # Resolve conflicts
   git add .
   git rebase --continue
   ```

2. **Feature Branch Out of Date**
   ```bash
   git checkout feature/your-feature
   git rebase develop
   ```

3. **Accidental Commit to Wrong Branch**
   ```bash
   # Create new branch from current commit
   git branch feature/correct-branch
   # Reset current branch
   git reset --hard HEAD~1
   # Switch to correct branch
   git checkout feature/correct-branch
   ```

## Tools and Extensions

### Recommended Git Tools
- **SourceTree**: Visual Git client
- **GitKraken**: Advanced Git client
- **VS Code Git**: Built-in Git support

### Git Flow Extensions
- **Git Flow AVH**: Enhanced Git Flow
- **GitHub Flow**: Simplified workflow
- **GitLab Flow**: GitLab-specific workflow

## Examples

### Complete Feature Development Cycle
```bash
# 1. Start feature
./scripts/gitflow-helper.sh start-feature F00001-user-authentication

# 2. Develop feature
# ... make changes ...
git add .
git commit -m "feat: implement user authentication"

# 3. Push feature
git push origin feature/F00001-user-authentication

# 4. Create pull request (if using GitHub/GitLab)
# ... review process ...

# 5. Finish feature
./scripts/gitflow-helper.sh finish-feature F00001-user-authentication

# 6. Push develop
git push origin develop
```

### Release Process
```bash
# 1. Start release
./scripts/gitflow-helper.sh start-release 1.0.0

# 2. Update version and documentation
# ... make changes ...
git add .
git commit -m "chore: prepare release 1.0.0"

# 3. Finish release
./scripts/gitflow-helper.sh finish-release 1.0.0

# 4. Push all changes
git push origin master develop
git push origin --tags
```

---

**Note**: This Git Flow setup is specifically configured for the NestJS API project and includes branch preservation for better visibility in tools like SourceTree.


