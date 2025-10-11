# Git Flow Workflow for React Admin Project

This document outlines the Git Flow workflow for the React Admin frontend project.

## Overview

Git Flow is a branching model that provides a robust framework for managing features, releases, and hotfixes in a collaborative development environment.

## Branch Structure

```
master (production)
├── develop (integration)
│   ├── feature/F00001-user-management
│   ├── feature/F00002-dashboard-enhancements
│   └── feature/F00003-authentication-improvements
├── release/v1.0.0
└── hotfix/v1.0.1
```

## Branch Types

### 1. **master** (Production)
- Contains production-ready code
- Only updated through releases and hotfixes
- Always stable and deployable

### 2. **develop** (Integration)
- Main development branch
- Integration branch for features
- Contains latest development changes

### 3. **feature/** (Feature Development)
- Branch off from: `develop`
- Merge back to: `develop`
- Naming convention: `feature/F00001-descriptive-name`
- Examples:
  - `feature/F00001-user-management`
  - `feature/F00002-dashboard-enhancements`
  - `feature/F00003-authentication-improvements`

### 4. **release/** (Release Preparation)
- Branch off from: `develop`
- Merge back to: `master` and `develop`
- Naming convention: `release/v1.0.0`
- Used for preparing new production releases

### 5. **hotfix/** (Critical Fixes)
- Branch off from: `master`
- Merge back to: `master` and `develop`
- Naming convention: `hotfix/v1.0.1`
- Used for critical production fixes

## Workflow Commands

### Using the Git Flow Helper Script

The project includes a helper script at `scripts/gitflow-helper.sh` that simplifies common operations:

```bash
# Make the script executable (first time only)
chmod +x scripts/gitflow-helper.sh

# Start a new feature
./scripts/gitflow-helper.sh start-feature F00001-user-management

# Finish a feature (merge to develop)
./scripts/gitflow-helper.sh finish-feature F00001-user-management

# Delete a feature branch
./scripts/gitflow-helper.sh delete-feature F00001-user-management

# Start a release
./scripts/gitflow-helper.sh start-release v1.0.0

# Finish a release
./scripts/gitflow-helper.sh finish-release v1.0.0

# Start a hotfix
./scripts/gitflow-helper.sh start-hotfix v1.0.1

# Finish a hotfix
./scripts/gitflow-helper.sh finish-hotfix v1.0.1

# Show current status
./scripts/gitflow-helper.sh status

# Show help
./scripts/gitflow-helper.sh help
```

### Manual Git Flow Commands

If you prefer to use Git Flow directly:

```bash
# Initialize Git Flow (first time only)
git flow init -d

# Feature workflow
git flow feature start F00001-user-management
git flow feature finish F00001-user-management

# Release workflow
git flow release start v1.0.0
git flow release finish v1.0.0

# Hotfix workflow
git flow hotfix start v1.0.1
git flow hotfix finish v1.0.1
```

## Feature Naming Convention

Features should follow this naming pattern:
- **Format**: `F00001-descriptive-name`
- **Examples**:
  - `F00001-user-management`
  - `F00002-dashboard-enhancements`
  - `F00003-authentication-improvements`
  - `F00004-responsive-design`
  - `F00005-api-integration`

## Development Workflow

### 1. Starting a New Feature

```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Start new feature
./scripts/gitflow-helper.sh start-feature F00001-user-management

# Make your changes
# ... develop your feature ...

# Commit your changes
git add .
git commit -m "feat: Add user management functionality

- Implemented user CRUD operations
- Added user form validation
- Created user list with pagination
- Added user role management"

# Push feature branch (optional, for collaboration)
git push origin feature/F00001-user-management
```

### 2. Finishing a Feature

```bash
# Finish the feature (merges to develop)
./scripts/gitflow-helper.sh finish-feature F00001-user-management

# Push develop branch
git push origin develop

# Delete feature branch (optional)
./scripts/gitflow-helper.sh delete-feature F00001-user-management
```

### 3. Creating a Release

```bash
# Start a new release
./scripts/gitflow-helper.sh start-release v1.0.0

# Update version numbers, changelog, etc.
# ... prepare release ...

# Commit release preparation
git add .
git commit -m "chore: Prepare release v1.0.0"

# Finish the release
./scripts/gitflow-helper.sh finish-release v1.0.0

# Push all branches
git push origin master
git push origin develop
git push origin v1.0.0
```

### 4. Creating a Hotfix

```bash
# Start a hotfix
./scripts/gitflow-helper.sh start-hotfix v1.0.1

# Make critical fixes
# ... fix critical issues ...

# Commit hotfix
git add .
git commit -m "fix: Resolve critical authentication issue"

# Finish the hotfix
./scripts/gitflow-helper.sh finish-hotfix v1.0.1

# Push all branches
git push origin master
git push origin develop
git push origin v1.0.1
```

## Commit Message Convention

Follow this commit message format:

```
<type>: <description>

[optional body]

[optional footer]
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples:
```
feat: Add user management functionality

- Implemented user CRUD operations
- Added user form validation
- Created user list with pagination

Closes #123
```

```
fix: Resolve authentication infinite loop

- Fixed useAuth hook dependency issues
- Unified authentication context usage
- Improved navigation flow

Fixes #456
```

## Best Practices

### 1. **Feature Development**
- Keep features small and focused
- Test thoroughly before merging
- Use descriptive commit messages
- Update documentation when needed

### 2. **Code Quality**
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful tests
- Keep components small and reusable

### 3. **Collaboration**
- Pull latest changes before starting features
- Communicate with team about breaking changes
- Use pull requests for code review (if using GitHub/GitLab)
- Keep feature branches up to date with develop

### 4. **Release Management**
- Test releases thoroughly
- Update version numbers consistently
- Maintain a changelog
- Tag releases properly

## Troubleshooting

### Common Issues

1. **Merge Conflicts**
   ```bash
   # Resolve conflicts manually
   git status
   # Edit conflicted files
   git add .
   git commit -m "resolve: Fix merge conflicts"
   ```

2. **Feature Branch Out of Date**
   ```bash
   # Update feature branch with latest develop
   git checkout feature/F00001-user-management
   git merge develop
   ```

3. **Accidental Commits to Wrong Branch**
   ```bash
   # Move commits to correct branch
   git log --oneline
   git reset --hard HEAD~1  # Remove last commit
   git checkout correct-branch
   git cherry-pick <commit-hash>
   ```

## Integration with CI/CD

The Git Flow workflow integrates well with CI/CD pipelines:

- **develop**: Auto-deploy to staging environment
- **master**: Auto-deploy to production environment
- **feature/**: Run tests and linting
- **release/**: Run full test suite and build

## Project-Specific Notes

### React Admin Project Structure
- Features are organized in `src/features/`
- Shared components in `src/shared/`
- API services in `src/features/*/services/`
- Types and interfaces in `src/shared/types/`

### Build and Development
- Use `npm start` for development
- Use `npm run build` for production builds
- Use `npm test` for running tests
- Use `npm run lint` for code linting

## Resources

- [Git Flow Documentation](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Note**: This workflow is designed for the React Admin project. Adapt as needed for your specific requirements.
