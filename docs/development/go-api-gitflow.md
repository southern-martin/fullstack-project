# Git Flow Workflow for Go API

This document outlines the Git Flow workflow for the Go API project.

## Branch Structure

### Main Branches
- **`master`**: Production-ready code. Only contains stable, released code.
- **`develop`**: Integration branch for features. All feature branches merge here.

### Supporting Branches
- **`feature/*`**: New features being developed
- **`bugfix/*`**: Bug fixes for develop branch
- **`release/*`**: Preparing new production releases
- **`hotfix/*`**: Critical fixes for production
- **`support/*`**: Support for older versions

## Git Flow Commands

### Starting a New Feature
```bash
# Start a new feature
git flow feature start feature-name

# Example: Start a new user authentication feature
git flow feature start auth-jwt
```

### Finishing a Feature
```bash
# Finish and merge a feature
git flow feature finish feature-name

# Example: Finish the auth-jwt feature
git flow feature finish auth-jwt
```

### Starting a Release
```bash
# Start a new release
git flow release start version-number

# Example: Start release 1.2.0
git flow release start 1.2.0
```

### Finishing a Release
```bash
# Finish a release (merges to master and develop)
git flow release finish version-number

# Example: Finish release 1.2.0
git flow release finish 1.2.0
```

### Starting a Hotfix
```bash
# Start a hotfix for production
git flow hotfix start hotfix-name

# Example: Start a critical security fix
git flow hotfix start security-patch
```

### Finishing a Hotfix
```bash
# Finish a hotfix
git flow hotfix finish hotfix-name

# Example: Finish the security patch
git flow hotfix finish security-patch
```

## Development Workflow

### 1. Feature Development
1. Start a feature: `git flow feature start feature-name`
2. Develop your feature on the feature branch
3. Test your changes thoroughly
4. Commit your changes: `git commit -m "feat: add new feature"`
5. Finish the feature: `git flow feature finish feature-name`

### 2. Release Process
1. Start a release: `git flow release start 1.2.0`
2. Update version numbers, changelog, etc.
3. Test the release thoroughly
4. Finish the release: `git flow release finish 1.2.0`
5. Push to remote: `git push origin master develop --tags`

### 3. Hotfix Process
1. Start a hotfix: `git flow hotfix start critical-fix`
2. Make the necessary changes
3. Test the fix
4. Finish the hotfix: `git flow hotfix finish critical-fix`
5. Push to remote: `git push origin master develop --tags`

## Commit Message Convention

Use conventional commits format:

```
type(scope): description

feat: add JWT authentication
fix: resolve database connection issue
docs: update API documentation
style: format code according to standards
refactor: restructure user service
test: add unit tests for user handler
chore: update dependencies
```

### Types:
- **feat**: New features
- **fix**: Bug fixes
- **docs**: Documentation changes
- **style**: Code formatting
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## Branch Protection Rules

### Master Branch
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to master

### Develop Branch
- Require pull request reviews
- Require status checks to pass
- Allow force pushes for release preparation

## Best Practices

1. **Always pull latest changes** before starting new work
2. **Keep feature branches small** and focused
3. **Write descriptive commit messages**
4. **Test thoroughly** before finishing features
5. **Update documentation** when adding new features
6. **Use meaningful branch names**
7. **Clean up merged branches** after finishing features

## Common Scenarios

### Working on Multiple Features
```bash
# Start first feature
git flow feature start feature-auth

# Switch to develop and start second feature
git checkout develop
git flow feature start feature-payment
```

### Emergency Hotfix
```bash
# Start hotfix from master
git flow hotfix start critical-security-fix

# Make changes and test
# Finish hotfix
git flow hotfix finish critical-security-fix
```

### Release Preparation
```bash
# Start release
git flow release start 1.3.0

# Update version in go.mod, README, etc.
# Test the release
# Finish release
git flow release finish 1.3.0
```

## Team Collaboration

1. **Always pull before starting work**: `git pull origin develop`
2. **Communicate about large features** that might conflict
3. **Use pull requests** for code review
4. **Keep develop branch stable** - don't push broken code
5. **Coordinate releases** with the team

## Troubleshooting

### Merge Conflicts
```bash
# Resolve conflicts manually
git add .
git commit -m "resolve merge conflicts"
```

### Accidentally Committed to Wrong Branch
```bash
# Create a patch
git format-patch -1 HEAD

# Switch to correct branch
git checkout develop
git apply 0001-commit-message.patch
```

### Undo Last Commit
```bash
# Soft reset (keeps changes)
git reset --soft HEAD~1

# Hard reset (loses changes)
git reset --hard HEAD~1
```









