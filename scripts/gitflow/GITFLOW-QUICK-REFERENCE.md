# 🌿 Git Flow Quick Reference

## 🚀 **Essential Commands**

### **Feature Development**
```bash
# Start feature
./scripts/gitflow/enhanced-gitflow.sh start-feature F00001-user-auth

# Develop feature
git add .
git commit -m "feat: add authentication logic"

# Finish feature (preserves history)
./scripts/gitflow/enhanced-gitflow.sh finish-feature F00001-user-auth
```

### **Release Management**
```bash
# Start release
./scripts/gitflow/enhanced-gitflow.sh start-release 1.2.0

# Finish release
./scripts/gitflow/enhanced-gitflow.sh finish-release 1.2.0
```

### **Hotfix Management**
```bash
# Start hotfix
./scripts/gitflow/enhanced-gitflow.sh start-hotfix 1.2.1-security-fix

# Finish hotfix
./scripts/gitflow/enhanced-gitflow.sh finish-hotfix 1.2.1-security-fix
```

## 📋 **Naming Conventions**

| Type | Format | Example |
|------|--------|---------|
| **Feature** | `F00001-descriptive-name` | `F00001-user-authentication` |
| **Bugfix** | `B00001-fix-description` | `B00001-fix-login-validation` |
| **Release** | `1.2.0` | `1.2.0` |
| **Hotfix** | `1.2.1-description` | `1.2.1-security-fix` |

## 🎯 **Key Benefits**

- ✅ **Feature History Preserved** - No-FF merges keep feature lines visible
- ✅ **Clear Git Graph** - Easy to see feature development history
- ✅ **Branch Management** - Automated cleanup and organization
- ✅ **Team Collaboration** - Clear feature boundaries and workflow

## 📊 **Git Graph Visualization**

### **Before (Fast-Forward)**
```
* a1b2c3d Merge feature/F00001
* e4f5g6h Final feature commit
* i7j8k9l Feature development
```

### **After (No-FF)**
```
* a1b2c3d Merge feature/F00001 into develop
|\
| * e4f5g6h Final feature commit
| * i7j8k9l Feature development
| * p9q8r7s Initial feature commit
|/
* m1n2o3p Previous develop commit
```

## 🛠️ **Utility Commands**

```bash
# Show status
./scripts/gitflow/enhanced-gitflow.sh status

# Show graph
./scripts/gitflow/enhanced-gitflow.sh graph

# Cleanup merged branches
./scripts/gitflow/enhanced-gitflow.sh cleanup

# Rebase feature
./scripts/gitflow/enhanced-gitflow.sh rebase-feature F00001-user-auth

# Sync feature
./scripts/gitflow/enhanced-gitflow.sh sync-feature F00001-user-auth
```

## 🎬 **Interactive Demo**

```bash
# Run complete demo
./scripts/gitflow/gitflow-example.sh demo
```

## 📚 **Full Documentation**

- **[Enhanced Git Flow Guide](ENHANCED-GITFLOW-README.md)** - Complete documentation
- **[Git Flow Scripts](README.md)** - All available scripts
- **[Interactive Demo](gitflow-example.sh)** - Hands-on examples

---

**🎉 Happy developing with preserved feature history!** 🌿
