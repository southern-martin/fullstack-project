# 🌿 Git Flow Scripts

This directory contains Git Flow helper scripts for managing branches and releases in the Fullstack Project.

## 📁 Files

### `enhanced-gitflow.sh` ⭐ **RECOMMENDED**
**Purpose:** Enhanced Git Flow with feature history preservation
**Features:**
- ✅ **Feature history preservation** with no-ff merges
- ✅ **Clear feature graph lines** in git history
- ✅ Advanced rebase and sync commands
- ✅ Comprehensive branch management
- ✅ Automated cleanup utilities
- ✅ Visual graph representation
- ✅ Bugfix branch support

### `gitflow-helper.sh`
**Purpose:** General Git Flow helper for any service
**Features:**
- ✅ Feature branch management
- ✅ Release branch management
- ✅ Hotfix branch management
- ✅ Automated merge and tagging
- ✅ Branch cleanup utilities

### `gitflow-helper-nestjs.sh`
**Purpose:** NestJS-specific Git Flow helper
**Features:**
- ✅ NestJS project structure awareness
- ✅ Service-specific commands
- ✅ API version management
- ✅ Database migration support

### `gitflow-helper-react.sh`
**Purpose:** React Admin-specific Git Flow helper
**Features:**
- ✅ React project structure awareness
- ✅ Component development workflow
- ✅ Frontend build integration
- ✅ UI/UX development support

### `gitflow-example.sh`
**Purpose:** Interactive demo of enhanced Git Flow
**Features:**
- ✅ Complete workflow demonstration
- ✅ Feature history preservation examples
- ✅ Visual git graph examples
- ✅ Best practices demonstration

## 🚀 **Quick Start with Enhanced Git Flow**

### 1. **Initialize Enhanced Git Flow**
```bash
# Make script executable
chmod +x scripts/gitflow/enhanced-gitflow.sh

# Check current status
./scripts/gitflow/enhanced-gitflow.sh status
```

### 2. **Start a Feature (Preserves History)**
```bash
# Start feature with proper naming
./scripts/gitflow/enhanced-gitflow.sh start-feature F00001-user-authentication

# Develop your feature
git add .
git commit -m "feat: add user authentication logic"
git commit -m "feat: add password validation"
git commit -m "test: add authentication tests"

# Finish feature (preserves history in git graph)
./scripts/gitflow/enhanced-gitflow.sh finish-feature F00001-user-authentication
```

### 3. **View Preserved Feature History**
```bash
# See the feature history preserved in git graph
git log --graph --oneline --all

# Show detailed status
./scripts/gitflow/enhanced-gitflow.sh status
```

## 🎯 **Key Benefits of Enhanced Git Flow**

### ✅ **Feature History Preservation**
- **No-FF Merges:** All feature merges use `--no-ff` to preserve feature history
- **Clear Graph Lines:** Feature branches remain visible in git graph
- **Merge Commits:** Descriptive merge commits with feature information
- **Branch Preservation:** Feature branches are kept for visibility

### ✅ **Advanced Workflow Management**
- **Rebase Support:** Keep features up-to-date with develop
- **Sync Commands:** Sync features with remote repositories
- **Cleanup Tools:** Automated cleanup of merged branches
- **Graph Visualization:** Visual representation of branch structure

## 📋 **Complete Command Reference**

### 🌟 **Feature Management**
```bash
# Start a new feature
./scripts/gitflow/enhanced-gitflow.sh start-feature F00001-descriptive-name

# Finish feature (preserves history)
./scripts/gitflow/enhanced-gitflow.sh finish-feature F00001-descriptive-name

# Rebase feature on latest develop
./scripts/gitflow/enhanced-gitflow.sh rebase-feature F00001-descriptive-name

# Sync feature with remote
./scripts/gitflow/enhanced-gitflow.sh sync-feature F00001-descriptive-name

# Delete feature branch
./scripts/gitflow/enhanced-gitflow.sh delete-feature F00001-descriptive-name
```

### 🚀 **Release Management**
```bash
# Start a release
./scripts/gitflow/enhanced-gitflow.sh start-release 1.2.0

# Finish a release
./scripts/gitflow/enhanced-gitflow.sh finish-release 1.2.0
```

### 🔥 **Hotfix Management**
```bash
# Start a hotfix
./scripts/gitflow/enhanced-gitflow.sh start-hotfix 1.2.1-security-fix

# Finish a hotfix
./scripts/gitflow/enhanced-gitflow.sh finish-hotfix 1.2.1-security-fix
```

### 🐛 **Bugfix Management**
```bash
# Start a bugfix
./scripts/gitflow/enhanced-gitflow.sh start-bugfix B00001-fix-login-validation

# Finish a bugfix
./scripts/gitflow/enhanced-gitflow.sh finish-bugfix B00001-fix-login-validation
```

### 🛠️ **Utility Commands**
```bash
# Show current status
./scripts/gitflow/enhanced-gitflow.sh status

# Show branch graph
./scripts/gitflow/enhanced-gitflow.sh graph

# Clean up merged branches
./scripts/gitflow/enhanced-gitflow.sh cleanup
```

## 🎨 **Naming Conventions**

### **Feature Branches**
```
feature/F00001-user-authentication
feature/F00002-dashboard-enhancements
feature/F00003-api-integration
```

### **Bugfix Branches**
```
bugfix/B00001-fix-login-validation
bugfix/B00002-fix-data-export
bugfix/B00003-fix-ui-responsive
```

### **Release Branches**
```
release/1.2.0
release/2.0.0
release/1.2.1
```

### **Hotfix Branches**
```
hotfix/1.2.1-security-fix
hotfix/1.2.2-critical-bug
hotfix/2.0.1-urgent-fix
```

## 📊 **Git Graph Comparison**

### **Before Enhanced Git Flow (Fast-Forward)**
```
* a1b2c3d (develop) Merge feature/F00001
* e4f5g6h (feature/F00001) Final feature commit
* i7j8k9l (feature/F00001) Feature development
* m1n2o3p (develop) Previous develop commit
```

### **After Enhanced Git Flow (No-FF)**
```
* a1b2c3d (develop) Merge feature/F00001 into develop
|\
| * e4f5g6h (feature/F00001) Final feature commit
| * i7j8k9l (feature/F00001) Feature development
| * p9q8r7s (feature/F00001) Initial feature commit
|/
* m1n2o3p (develop) Previous develop commit
```

## 🎬 **Interactive Demo**

Run the complete demo to see the enhanced Git Flow in action:

```bash
# Run the interactive demo
./scripts/gitflow/gitflow-example.sh demo
```

The demo will:
1. Initialize a demo repository
2. Create and finish features with preserved history
3. Create and finish a release
4. Create and finish a hotfix
5. Show the final git graph with preserved feature lines

## 🎯 **Best Practices**

### **1. Feature Development**
- ✅ Use descriptive feature names with ticket numbers
- ✅ Keep features small and focused
- ✅ Commit frequently with clear messages
- ✅ Test thoroughly before finishing
- ✅ Update documentation as needed

### **2. Commit Messages**
```bash
# Feature commits
git commit -m "feat: add user authentication service"
git commit -m "feat: implement JWT token validation"

# Bug fixes
git commit -m "fix: resolve login validation issue"
git commit -m "fix: correct password hashing"

# Tests
git commit -m "test: add authentication unit tests"
git commit -m "test: add integration tests for login"

# Documentation
git commit -m "docs: update API documentation"
git commit -m "docs: add authentication guide"

# Chores
git commit -m "chore: update dependencies"
git commit -m "chore: bump version to 1.2.0"
```

### **3. Branch Management**
- ✅ Always start features from latest develop
- ✅ Rebase features before finishing
- ✅ Use no-ff merges to preserve history
- ✅ Keep feature branches for visibility
- ✅ Clean up merged branches regularly

## 🚨 **Troubleshooting**

### **Common Issues**

#### 1. **Rebase Conflicts**
```bash
# If rebase fails
git status                    # See conflicted files
# Edit files to resolve conflicts
git add .                     # Stage resolved files
git rebase --continue         # Continue rebase
```

#### 2. **Feature Branch Out of Date**
```bash
# Sync feature with latest develop
./scripts/gitflow/enhanced-gitflow.sh sync-feature F00001-user-auth
```

#### 3. **Merge Conflicts**
```bash
# If merge fails
git status                    # See conflicted files
# Edit files to resolve conflicts
git add .                     # Stage resolved files
git commit                    # Complete the merge
```

## 📚 **Additional Documentation**

- **[Enhanced Git Flow Guide](ENHANCED-GITFLOW-README.md)** - Complete documentation
- **[Git Flow Examples](gitflow-example.sh)** - Interactive demo script
- **[Development Workflow](../development/README.md)** - Development process guide

## 🎉 **Getting Started**

1. **Initialize the enhanced Git Flow:**
   ```bash
   chmod +x scripts/gitflow/enhanced-gitflow.sh
   ./scripts/gitflow/enhanced-gitflow.sh status
   ```

2. **Start your first feature:**
   ```bash
   ./scripts/gitflow/enhanced-gitflow.sh start-feature F00001-my-first-feature
   ```

3. **Develop and finish the feature:**
   ```bash
   # Make your changes
   git add .
   git commit -m "feat: implement my feature"
   
   # Finish with preserved history
   ./scripts/gitflow/enhanced-gitflow.sh finish-feature F00001-my-first-feature
   ```

4. **View the preserved history:**
   ```bash
   git log --graph --oneline --all
   ```

---

**🎉 Happy developing with preserved feature history!** 🌿
