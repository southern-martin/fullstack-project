# 📮 Postman Collections & Scripts

This folder contains all Postman-related files for the NestJS API project, including collections, environments, and upload scripts.

## 📁 Files

### Collections
- **`postman-collection.json`** - Unified API collection with all endpoints and translation testing support

### Environment
- **`postman-environment.json`** - Environment variables for API testing

### Documentation
- **`POSTMAN-README.md`** - Main Postman documentation
- **`TRANSLATION-TESTING-README.md`** - Translation system testing guide
- **`UPLOAD-README.md`** - Upload script instructions and troubleshooting

### Scripts
- **`upload-to-postman.sh`** 🚀 - Upload collections and environment to Postman cloud (updated for NestJS API)
  - **Usage**: `./scripts/postman/upload-to-postman.sh [YOUR_API_KEY]`  
  - **Description**: Uploads both collections and environment with "Development-[ProjectName]" naming to your Postman cloud workspace

**Examples**:
```bash
# Try with stored API key first, then prompt for input
./scripts/postman/upload-to-postman.sh

# Use provided API key
./scripts/postman/upload-to-postman.sh YOUR_API_KEY_HERE
```

## 🎯 Features

- ✅ **Complete Upload System** - Both collection and environment in one command
- ✅ **Stored API Key** - No need to enter API key every time after first use
- ✅ **Secure Storage** - API key stored with base64 encoding and restricted permissions
- ✅ **Path Resolution** - Works from any directory
- ✅ **Comprehensive Status** - Detailed reporting for both uploads
- ✅ **Team Collaboration** - Shared workspace access
- ✅ **Version Control** - Track collection and environment changes
- ✅ **79 API endpoints** - Complete multi-seller marketplace API

## 📋 Requirements

- Postman API key (get from https://web.postman.co/settings/me/api-keys)
- Collection file: `postman-collection.json`
- Environment file: `postman-environment.json`
- `jq` command-line JSON processor

## 🔗 Related Files

- `postman-collection.json` - Unified API collection with all endpoints and translation testing
- `postman-environment.json` - Environment variables for API testing
- `POSTMAN-README.md` - Detailed Postman documentation
- `TRANSLATION-TESTING-README.md` - Translation system testing guide

## 🚀 Quick Start

1. **Get your API key**: Visit https://web.postman.co/settings/me/api-keys
2. **Run the script**: `./scripts/postman/upload-to-postman.sh`
3. **Enter your API key** when prompted (it will be stored for future use)
4. **Check your Postman desktop app** - both collection and environment will appear automatically

## 📊 What Gets Uploaded

**Collection:** "Development-[ProjectName]"
- **Unified Collection**: 79+ API endpoints with authentication, users, carriers, customers, roles, and multi-language translation testing

**Environment:** "Development-[ProjectName]" 
- Base URL: `http://localhost:3001`
- All project variables for testing
- Token storage for authenticated requests

**Project Name Detection:**
- Automatically reads from `package.json` name field
- Falls back to directory name if package.json not found
- Cleans and formats the name (removes special characters, title case)