# 🚀 Postman Upload Script

Upload your NestJS API Postman collection and environment to Postman cloud workspace.

## 📋 What Gets Uploaded

### **Collection: `postman-collection.json`**
- **79+ API endpoints** with authentication, users, carriers, customers, roles
- **Translation system testing** with multi-language support
- **Health checks** and admin endpoints
- **Unified structure** with organized folders

### **Environment: `postman-environment.json`**
- **Base URL**: `http://localhost:3001/api/v1`
- **Authentication token** storage
- **All project variables** for testing

## 🚀 Quick Start

### **1. Get Your Postman API Key**
```bash
# Go to: https://web.postman.co/settings/me/api-keys
# Click 'Generate API Key'
# Copy the generated key
```

### **2. Upload to Postman Cloud**
```bash
# Option 1: Use stored API key (recommended)
./upload-to-postman.sh

# Option 2: Provide API key directly
./upload-to-postman.sh PMAK-your-api-key-here
```

### **3. Check Your Postman Desktop App**
- Collection and environment will appear automatically
- Start testing your API endpoints
- Test translation features with different language headers

## 🔧 Features

### **Smart File Detection**
- Automatically finds collection and environment files
- Works from any directory in the project
- Handles different project structures

### **Conflict Resolution**
- **Create copy with timestamp** (recommended)
- **Override existing** collection/environment
- **Cancel upload** if needed

### **API Key Management**
- Stores API key securely for future use
- Uses stored key automatically
- No need to enter key every time

## 📁 File Structure

```
scripts/postman/
├── upload-to-postman.sh          # Upload script
├── postman-collection.json       # Unified collection
├── postman-environment.json      # Environment variables
├── README.md                     # This file
└── UPLOAD-README.md              # Upload instructions
```

## 🎯 Collection Features

### **Main API Endpoints**
- 🏥 **Health Check**: API status monitoring
- 🔐 **Authentication**: Login, register, refresh, profile, logout
- 👥 **Users Management**: CRUD operations with roles
- 🎭 **Roles Management**: Role creation and management
- 🚚 **Carriers Management**: Carrier operations
- 👤 **Customers Management**: Customer operations

### **Translation System**
- 🌍 **Get Available Languages**: Retrieve supported languages
- 📋 **Get Translations**: View translations by language
- ➕ **Add Translation**: Add new translations
- 🔤 **Multi-Language Testing**: Test with different language headers

## 🔧 Requirements

- **jq**: JSON processor (`brew install jq` or `sudo apt-get install jq`)
- **curl**: HTTP client (usually pre-installed)
- **Postman API key**: Get from https://web.postman.co/settings/me/api-keys

## 📊 Upload Process

1. **Check Dependencies**: Verify jq and curl are installed
2. **Find Files**: Locate collection and environment files
3. **Upload Collection**: Create or update collection in Postman
4. **Upload Environment**: Create or update environment in Postman
5. **Summary**: Show upload results

## 🎉 Success!

After successful upload:
- ✅ Collection appears in Postman desktop app
- ✅ Environment variables are configured
- ✅ Ready to test all API endpoints
- ✅ Translation testing available

## 🆘 Troubleshooting

### **Missing Dependencies**
```bash
# Install jq
brew install jq                    # macOS
sudo apt-get install jq           # Ubuntu/Debian

# Install curl (usually pre-installed)
brew install curl                  # macOS
sudo apt-get install curl         # Ubuntu/Debian
```

### **File Not Found**
- Ensure you're running from the correct directory
- Check that `postman-collection.json` and `postman-environment.json` exist
- Verify file permissions

### **API Key Issues**
- Get a new API key from https://web.postman.co/settings/me/api-keys
- Ensure the key has proper permissions
- Try running the script with a fresh API key

## 🔗 Related Files

- `postman-collection.json` - Unified API collection
- `postman-environment.json` - Environment variables
- `README.md` - Postman documentation
- `TRANSLATION-TESTING-README.md` - Translation testing guide







