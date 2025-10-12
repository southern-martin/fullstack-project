# 📮 Postman Scripts

This directory contains scripts for managing Postman collections and environments for the Fullstack Project API.

## 📁 Files

- `upload-to-postman.sh` - Upload collection and environment to Postman cloud
- `README.md` - This documentation file

## 🚀 Quick Start

### 1. Prerequisites

Install required tools:
```bash
# Ubuntu/Debian
sudo apt-get install jq curl

# macOS
brew install jq curl

# CentOS/RHEL
sudo yum install jq curl
```

### 2. Get Postman API Key

1. Go to: https://web.postman.co/settings/me/api-keys
2. Click "Generate API Key"
3. Copy the key (starts with `PMAK-`)

### 3. Run Upload Script

```bash
# From project root
./scripts/postman/upload-to-postman.sh YOUR_API_KEY

# Or use stored API key
./scripts/postman/upload-to-postman.sh
```

## 📋 Upload Script Details

### `upload-to-postman.sh`

**Purpose:** Uploads the Fullstack Project API collection and environment to Postman cloud workspace.

**Features:**
- ✅ **Smart File Detection** - Automatically finds collection and environment files
- ✅ **Conflict Resolution** - Handles existing collections/environments
- ✅ **API Key Management** - Secure storage and reuse of API keys
- ✅ **Error Handling** - Comprehensive error checking and reporting
- ✅ **Progress Tracking** - Colored output and detailed progress information
- ✅ **Non-Interactive Mode** - Works in CI/CD pipelines

### File Detection

The script searches for files in this order:
1. `scripts/postman/` directory
2. Project root directory
3. Various relative paths

**Required Files:**
- `Fullstack-Project-API.postman_collection.json`
- `Fullstack-Project-Environment.postman_environment.json`

### Conflict Resolution

When a collection or environment already exists:

1. **Create Copy** (recommended)
   - Creates timestamped copy: `Collection Name - 2024-01-15 10:30:00`
   - Preserves original
   - Safe for team environments

2. **Override Existing**
   - Replaces existing collection/environment
   - Updates all references
   - Use with caution in shared workspaces

3. **Cancel Upload**
   - Aborts the operation
   - No changes made

### API Key Management

**First Run:**
```bash
./scripts/postman/upload-to-postman.sh PMAK-your-api-key-here
```

**Subsequent Runs:**
```bash
./scripts/postman/upload-to-postman.sh
# Uses stored API key automatically
```

**API Key Storage:**
- Location: `~/.postman-api-key`
- Format: Base64 encoded
- Permissions: 600 (owner read/write only)

## 🎯 Collection Contents

The uploaded collection includes:

### 🔐 Auth Service
- Health Check
- Login (Admin, Test, Test1 users)
- Get Profile

### 👥 User Service
- Get All Users (with pagination)
- Get User Count
- Get User by ID
- Create New User
- Update User
- Delete User

### 🚚 Carrier Service
- Full CRUD operations
- Pagination support

### 🏢 Customer Service
- Full CRUD operations
- Pagination support

### 💰 Pricing Service
- Full CRUD operations
- Pagination support

### 🌐 Translation Service
- Full CRUD operations
- Pagination support

### ❤️ Health Check
- General health endpoint

## 🔧 Environment Variables

The environment includes:

| Variable | Description | Example |
|----------|-------------|---------|
| `base_url` | API base URL | `http://localhost:3001` |
| `access_token` | JWT token (auto-set) | `mock-jwt-token-1234567890` |
| `user_id` | Current user ID (auto-set) | `1` |
| `user_email` | Current user email (auto-set) | `admin@example.com` |
| `new_user_id` | New user ID (auto-set) | `5` |

## 🧪 Test Users

The collection includes pre-configured test users:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@example.com` | `Admin123` or `admin123` | admin | Full access |
| `test@gmail.com` | `Admin123` | user | Standard user |
| `test1@gmail.com` | `Admin123` | user | Additional test user |
| `user@example.com` | `Admin123` | user | Regular user |

## 🚨 Troubleshooting

### Common Issues

1. **"Collection file not found"**
   ```bash
   # Ensure files exist in project root
   ls -la Fullstack-Project-API.postman_collection.json
   ls -la Fullstack-Project-Environment.postman_environment.json
   ```

2. **"API key invalid"**
   - Verify key format: `PMAK-xxxxxxxxxxxxxxxxxxxxxxxxx`
   - Check key hasn't expired
   - Ensure workspace permissions

3. **"Permission denied"**
   ```bash
   chmod +x scripts/postman/upload-to-postman.sh
   ```

4. **"jq: command not found"**
   ```bash
   # Install jq
   sudo apt-get install jq  # Ubuntu/Debian
   brew install jq          # macOS
   ```

### Debug Mode

Enable verbose output by modifying the script:
```bash
# Add -v flag to curl commands
curl -v -X "$method" "$url" "${headers[@]}" -d "$data"
```

### Manual Testing

Test API connectivity:
```bash
# Test Postman API
curl -H "X-API-Key: YOUR_API_KEY" https://api.getpostman.com/collections

# Test local mock server
curl http://localhost:3001/health
```

## 📊 Usage Examples

### Basic Upload
```bash
./scripts/postman/upload-to-postman.sh PMAK-1234567890abcdef
```

### Using Stored Key
```bash
./scripts/postman/upload-to-postman.sh
```

### Non-Interactive Mode (CI/CD)
```bash
echo "1" | ./scripts/postman/upload-to-postman.sh PMAK-1234567890abcdef
```

### Check Script Help
```bash
./scripts/postman/upload-to-postman.sh --help
```

## 🔄 Workflow Integration

### Git Hooks
Add to `.git/hooks/post-commit`:
```bash
#!/bin/bash
if [ -f "scripts/postman/upload-to-postman.sh" ]; then
    echo "Uploading updated collection to Postman..."
    ./scripts/postman/upload-to-postman.sh
fi
```

### CI/CD Pipeline
```yaml
# GitHub Actions example
- name: Upload to Postman
  run: |
    chmod +x scripts/postman/upload-to-postman.sh
    ./scripts/postman/upload-to-postman.sh ${{ secrets.POSTMAN_API_KEY }}
```

### Team Collaboration
1. **Developer A** creates/updates collection
2. **Developer A** runs upload script
3. **Developer B** imports from Postman cloud
4. **Team** uses shared collection

## 📚 Additional Resources

- [Postman API Documentation](https://documenter.getpostman.com/view/631643/JsLs)
- [Postman API Keys Guide](https://learning.postman.com/docs/developer/intro-api/)
- [Collection Format Specification](https://schema.getpostman.com/json/collection/v2.1.0/collection.json)
- [Environment Format Specification](https://schema.getpostman.com/json/environment/v1.0.0/environment.json)

## 🤝 Contributing

When modifying the upload script:

1. **Test thoroughly** with different scenarios
2. **Update documentation** if behavior changes
3. **Maintain backward compatibility** when possible
4. **Add error handling** for new features
5. **Update this README** with new information

---

**🎉 Happy testing with Postman!** 📮
