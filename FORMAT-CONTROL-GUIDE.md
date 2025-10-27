# Code Formatting Control Guide

## 🎯 Overview

This project now has **unified code formatting controls** to prevent unwanted auto-formatting changes in git commits.

## 📁 Configuration Files

### 1. **`.prettierrc`** (Root Level)
Unified Prettier configuration for the entire monorepo:
- **Single quotes**: `false` (use double quotes)
- **Print width**: `100` characters
- **Semicolons**: Required
- **Line endings**: LF (Unix-style)

### 2. **`.prettierignore`**
Excludes files/directories from auto-formatting:
- `node_modules`, `dist`, `build` folders
- `*.md` files (preserves documentation formatting)
- `*.json`, `*.yaml` files
- SQL migrations
- Shell scripts

### 3. **`.vscode/settings.json`**
VS Code/Cursor settings:
- ✅ **`formatOnSave: false`** - No automatic formatting
- ✅ **`formatOnPaste: false`** - No format on paste
- ✅ **`formatOnType: false`** - No format while typing
- ✅ Manual formatting only: `Shift+Alt+F` or right-click > "Format Document"

### 4. **`.editorconfig`**
Cross-editor consistency:
- 2-space indentation for TS/JS/JSON
- LF line endings
- UTF-8 encoding
- Trim trailing whitespace

## 🚀 How to Format Code

### Manual Formatting (Recommended)

**In VS Code/Cursor:**
```bash
# Format current file
Shift + Alt + F  (Windows/Linux)
Shift + Option + F  (macOS)

# Or right-click > Format Document
```

**Via Command Line:**
```bash
# Format React Admin
cd react-admin && npm run format

# Format User Service
cd user-service && npm run format

# Format all TypeScript files in current directory
npx prettier --write "**/*.ts"
```

### Batch Format Specific Services

```bash
# Format only backend services
npx prettier --write "user-service/**/*.ts" "auth-service/**/*.ts"

# Format only frontend
npx prettier --write "react-admin/**/*.{ts,tsx}"
```

## 🔧 Git Workflow Best Practices

### Before Committing

1. **Review changes carefully:**
   ```bash
   git status
   git diff
   ```

2. **Stage only meaningful changes:**
   ```bash
   git add -p  # Interactive staging - review each chunk
   ```

3. **Avoid accidental formatting commits:**
   ```bash
   # If you see unwanted formatting changes
   git checkout -- <file>  # Discard formatting changes
   ```

### Creating Clean Commits

```bash
# Good: Functional changes only
git add src/features/users/components/UserForm.tsx
git commit -m "feat: add email validation to user form"

# Avoid: Mixed formatting + logic changes
# Instead, separate into two commits:

# Commit 1: Formatting only
git add -p  # Select only formatting chunks
git commit -m "style: format user components with prettier"

# Commit 2: Logic changes
git add -p  # Select only logic chunks
git commit -m "feat: add email validation to user form"
```

## 📋 Troubleshooting

### Problem: Files keep getting formatted automatically

**Solution:**
1. Reload VS Code/Cursor: `Cmd+Shift+P` → "Reload Window"
2. Verify settings: Check `.vscode/settings.json` has `formatOnSave: false`
3. Check your user settings: `Cmd+,` → Search "format on save" → Should be unchecked

### Problem: Different formatting across team members

**Solution:**
1. Ensure everyone uses the root `.prettierrc` config
2. Run one-time format: `npx prettier --write "**/*.{ts,tsx,js,jsx}"`
3. Commit the formatted code as a single "chore: format codebase" commit
4. All team members pull the changes

### Problem: Old react-admin `.prettierrc` conflicts

**Solution:**
```bash
# Remove service-specific configs (optional)
rm react-admin/.prettierrc

# The root .prettierrc will be used instead
```

## 🎨 When to Format

### ✅ DO Format:
- Before submitting a PR (one-time, separate commit)
- When creating new files
- When refactoring large sections

### ❌ DON'T Format:
- During active development
- In the middle of debugging
- Files you didn't intentionally modify
- Auto-format on every save

## 📝 NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx}\"",
    "format:staged": "prettier --write $(git diff --cached --name-only --diff-filter=ACMR | grep -E '\\.(ts|tsx)$')"
  }
}
```

## 🔄 Migration from Old Setup

If you have existing formatting inconsistencies:

```bash
# 1. Create a new branch
git checkout -b chore/unified-formatting

# 2. Format entire codebase
npx prettier --write "**/*.{ts,tsx,js,jsx}"

# 3. Commit all formatting changes
git add .
git commit -m "chore: unify code formatting across monorepo"

# 4. Merge to develop
git checkout develop
git merge chore/unified-formatting
```

## 📚 Resources

- [Prettier Docs](https://prettier.io/docs/en/)
- [EditorConfig](https://editorconfig.org/)
- [VS Code Formatting](https://code.visualstudio.com/docs/editor/codebasics#_formatting)

---

**Last Updated:** October 27, 2025
