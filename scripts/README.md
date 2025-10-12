# 📁 Scripts Directory

This directory contains utility scripts for the Fullstack Project.

## 📂 Directory Structure

```
scripts/
├── README.md                    # This file
├── build.sh                     # Project build script
├── dev.sh                       # Development setup script
├── deployment/                  # Deployment and production scripts
│   └── README.md                # Deployment scripts documentation
├── development/                 # Development and configuration scripts
│   ├── .eslintrc.js             # ESLint configuration
│   ├── craco.config.js          # CRACO configuration
│   ├── debug-simple.js          # Debug utility
│   └── README.md                # Development scripts documentation
├── docker/                      # Docker-related scripts
│   ├── docker-build.sh          # Build Docker containers
│   ├── docker-cleanup.sh        # Clean up Docker resources
│   ├── docker-cleanup-all.sh    # Clean up all Docker resources
│   ├── docker-cleanup-system.sh # Clean up Docker system
│   ├── docker-logs.sh           # View Docker logs
│   ├── docker-start.sh          # Start Docker containers
│   └── docker-stop.sh           # Stop Docker containers
├── gitflow/                     # Git Flow helper scripts
│   ├── gitflow-helper.sh        # General Git Flow helper
│   ├── gitflow-helper-nestjs.sh # NestJS-specific Git Flow helper
│   └── gitflow-helper-react.sh  # React-specific Git Flow helper
├── mock-servers/                # Mock server scripts
│   ├── comprehensive-mock-server.js # Complete mock server
│   ├── simple-mock-server.js    # Basic auth mock server
│   ├── mock-auth-server.js      # Express auth mock server
│   └── README.md                # Mock servers documentation
├── postman/                     # Postman-related scripts
│   ├── upload-to-postman.sh     # Postman collection upload script
│   └── README.md                # Postman scripts documentation
└── testing/                     # Testing and validation scripts
    ├── test-db-connection.js    # Database connection test
    ├── test-built-app.js        # Built app test
    ├── test-current-state.js    # Current state test
    ├── test-new-architecture.js # Architecture test
    ├── test-tailwind.js         # Tailwind CSS test
    └── README.md                # Testing scripts documentation
```

## 🚀 Available Scripts

### 🏗️ Build Scripts
- `build.sh` - Project build script
- `dev.sh` - Development setup script

### 🚀 Deployment Scripts (`deployment/`)
- *Planned:* `deploy-staging.sh` - Deploy to staging environment
- *Planned:* `deploy-production.sh` - Deploy to production environment
- *Planned:* `backup-database.sh` - Backup production database
- *Planned:* `migrate-database.sh` - Run database migrations
- *Planned:* `health-check.sh` - Comprehensive health checks

### 🛠️ Development Scripts (`development/`)
- `.eslintrc.js` - ESLint configuration for React Admin
- `craco.config.js` - CRACO configuration for build customization
- `debug-simple.js` - Simple debugging utility for development

### 🐳 Docker Scripts (`docker/`)
- `docker-build.sh` - Build Docker containers
- `docker-start.sh` - Start Docker containers
- `docker-stop.sh` - Stop Docker containers
- `docker-logs.sh` - View Docker logs
- `docker-cleanup.sh` - Clean up Docker resources
- `docker-cleanup-all.sh` - Clean up all Docker resources
- `docker-cleanup-system.sh` - Clean up Docker system

### 🌿 Git Flow Scripts (`gitflow/`)
- `gitflow-helper.sh` - General Git Flow helper
- `gitflow-helper-nestjs.sh` - NestJS-specific Git Flow helper
- `gitflow-helper-react.sh` - React-specific Git Flow helper

### 🎭 Mock Server Scripts (`mock-servers/`)
- `comprehensive-mock-server.js` - Complete mock server with all services
- `simple-mock-server.js` - Basic auth-only mock server
- `mock-auth-server.js` - Express-based auth mock server

### 📮 Postman Scripts (`postman/`)
- `upload-to-postman.sh` - Upload Postman collection and environment to cloud workspace

### 🧪 Testing Scripts (`testing/`)
- `test-db-connection.js` - Test database connectivity for Auth Service
- `test-built-app.js` - Test the built React Admin application
- `test-current-state.js` - Test current application state and functionality
- `test-new-architecture.js` - Test new microservices architecture
- `test-tailwind.js` - Test Tailwind CSS integration and styling

## 🎯 Script Categories

### 🏗️ Build & Development
- **Purpose:** Project building and development setup
- **Scripts:** `build.sh`, `dev.sh`, development configuration files
- **Usage:** Daily development workflow

### 🎭 Mock Servers
- **Purpose:** Development and testing with mock data
- **Scripts:** Comprehensive, simple, and auth mock servers
- **Usage:** Frontend development without backend dependencies

### 🧪 Testing & Validation
- **Purpose:** Quality assurance and validation
- **Scripts:** Database, application, and architecture tests
- **Usage:** Pre-deployment validation and debugging

### 🐳 Docker & Deployment
- **Purpose:** Containerization and deployment
- **Scripts:** Docker management and deployment automation
- **Usage:** Production deployment and container management

### 📮 API Testing
- **Purpose:** API testing and documentation
- **Scripts:** Postman collection management
- **Usage:** API testing and team collaboration

### 🌿 Version Control
- **Purpose:** Git workflow management
- **Scripts:** Git Flow helpers for different services
- **Usage:** Branch management and release processes

**Requirements:**
- `jq` - JSON processor
- `curl` - HTTP client
- Postman API key

**Files Uploaded:**
- `Fullstack-Project-API.postman_collection.json` - Complete API collection
- `Fullstack-Project-Environment.postman_environment.json` - Environment variables

## 🔧 Setup Instructions

### 1. Install Dependencies

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install jq curl
```

**macOS:**
```bash
brew install jq curl
```

**CentOS/RHEL:**
```bash
sudo yum install jq curl
```

### 2. Get Postman API Key

1. Go to: https://web.postman.co/settings/me/api-keys
2. Click "Generate API Key"
3. Copy the generated key (starts with `PMAK-`)

### 3. Run Scripts

```bash
# Make scripts executable (if needed)
chmod +x scripts/postman/upload-to-postman.sh

# Run the upload script
./scripts/postman/upload-to-postman.sh YOUR_API_KEY
```

## 📋 Script Features

### 🔐 Security
- API keys are stored securely using base64 encoding
- File permissions are set to 600 (owner read/write only)
- No sensitive data in logs or output

### 🎯 Smart File Detection
Scripts automatically find files in multiple locations:
- Current script directory
- Project root directory
- Scripts subdirectories
- Relative paths

### 🔄 Conflict Resolution
When uploading to Postman:
1. **Create Copy** (recommended) - Creates timestamped copy
2. **Override** - Replaces existing collection/environment
3. **Cancel** - Aborts the upload

### 📊 Progress Tracking
- Colored output for better readability
- Clear success/error indicators
- Detailed progress information
- Upload summary with results

## 🚨 Troubleshooting

### Common Issues

1. **"jq: command not found"**
   ```bash
   # Install jq
   sudo apt-get install jq  # Ubuntu/Debian
   brew install jq          # macOS
   ```

2. **"curl: command not found"**
   ```bash
   # Install curl
   sudo apt-get install curl  # Ubuntu/Debian
   brew install curl          # macOS
   ```

3. **"Permission denied"**
   ```bash
   # Make script executable
   chmod +x scripts/postman/upload-to-postman.sh
   ```

4. **"API key invalid"**
   - Verify your Postman API key is correct
   - Check if the key has expired
   - Ensure you have workspace permissions

5. **"File not found"**
   - Ensure Postman collection files exist in project root
   - Check file names match exactly:
     - `Fullstack-Project-API.postman_collection.json`
     - `Fullstack-Project-Environment.postman_environment.json`

### Debug Mode

For detailed debugging, you can modify the script to add verbose output:

```bash
# Add -v flag to curl commands in the script
curl -v -X "$method" "$url" "${headers[@]}" -d "$data"
```

## 📚 Additional Resources

- [Postman API Documentation](https://documenter.getpostman.com/view/631643/JsLs)
- [Postman API Keys Guide](https://learning.postman.com/docs/developer/intro-api/)
- [jq Manual](https://stedolan.github.io/jq/manual/)
- [curl Documentation](https://curl.se/docs/)

## 🤝 Contributing

When adding new scripts:

1. **Follow naming convention**: `kebab-case.sh`
2. **Add proper documentation**: Include usage examples
3. **Include error handling**: Use proper exit codes
4. **Add to this README**: Document the new script
5. **Test thoroughly**: Ensure scripts work in different environments

## 📝 Script Template

```bash
#!/bin/bash

# Script Name
# Description
# Author: Your Name
# Version: 1.0

set -euo pipefail

# Constants
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Color codes
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Utility functions
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

# Main function
main() {
    print_info "Starting script..."
    # Your script logic here
    print_success "Script completed successfully!"
}

# Run main function
main "$@"
```

---

**🎉 Happy scripting!** 🚀
