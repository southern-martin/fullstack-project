# 🚀 Postman Cloud Upload Guide

This guide will help you upload the Fullstack Project API collection to your Postman cloud workspace.

## 📁 Available Files

- **Collection**: `Fullstack-Project-API.postman_collection.json`
- **Environment**: `Fullstack-Project-Environment.postman_environment.json`

## 🎯 Method 1: Direct Upload (Recommended)

### Step 1: Open Postman Desktop App
1. Launch your Postman desktop application
2. Make sure you're logged into your Postman account

### Step 2: Import Collection
1. Click the **"Import"** button (top left corner)
2. Select **"Upload Files"**
3. Navigate to your project directory: `/opt/cursor-project/fullstack-project/`
4. Select: `Fullstack-Project-API.postman_collection.json`
5. Click **"Open"**

### Step 3: Import Environment
1. Click **"Import"** again
2. Select **"Upload Files"**
3. Select: `Fullstack-Project-Environment.postman_environment.json`
4. Click **"Open"**

### Step 4: Upload to Cloud
1. In the left sidebar, right-click on **"Fullstack Project API"** collection
2. Select **"Share"** → **"Share Collection"**
3. Choose **"Share via Postman Cloud"**
4. Set visibility:
   - **Private**: Only you can see it
   - **Team**: Your team members can see it
   - **Public**: Anyone can see it
5. Click **"Share Collection"**

### Step 5: Set Environment
1. Click the environment dropdown (top right)
2. Select **"Fullstack Project Environment"**
3. The environment variables will be available for all requests

## 🛠️ Method 2: Using CLI Script

### Prerequisites
```bash
# Install Postman CLI
npm install -g @postman/cli

# Login to Postman
postman login
```

### Run Upload Script
```bash
# Navigate to project directory
cd /opt/cursor-project/fullstack-project

# Run the upload script
./scripts/postman/upload-to-cloud.sh
```

## 🔧 Environment Variables

The environment includes these variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:3001` | Base URL for local development |
| `access_token` | (auto-populated) | JWT token after login |
| `user_id` | (auto-populated) | User ID after login |
| `user_email` | (auto-populated) | User email after login |

## 📋 Collection Contents

The collection includes:

### 🔐 Auth Service
- Health Check
- Login (Admin)
- Register
- Refresh Token
- Logout
- Get Profile

### 👥 User Service
- Health Check
- Get All Users
- Get User by ID
- Create User
- Update User
- Delete User
- Get User Count

### 🚚 Carrier Service
- Health Check
- Get All Carriers
- Get Carrier by ID
- Create Carrier
- Update Carrier
- Delete Carrier
- Get Carrier Count

### 🏢 Customer Service
- Health Check
- Get All Customers
- Get Customer by ID
- Create Customer
- Update Customer
- Delete Customer
- Get Customer Count

### 💰 Pricing Service
- Health Check
- Calculate Price
- Get Pricing Rules
- Create Pricing Rule
- Update Pricing Rule
- Delete Pricing Rule

### 🌐 Translation Service
- Health Check
- Get All Languages
- Get Language by ID
- Create Language
- Update Language
- Delete Language
- Get All Translations
- Create Translation
- Update Translation
- Delete Translation
- Translate Text

## 🧪 Testing the Collection

### 1. Start Your Services
```bash
# Start the mock server
cd /opt/cursor-project/fullstack-project
node comprehensive-mock-server.js
```

### 2. Test Authentication
1. Run the **"Login - Admin"** request
2. The access token will be automatically saved to the environment
3. All subsequent requests will use this token

### 3. Test Other Services
1. Try creating a user, carrier, or customer
2. Test the CRUD operations
3. Verify the responses match the expected format

## 🔗 Sharing with Team

### Share Collection
1. Right-click the collection
2. Select **"Share"** → **"Share Collection"**
3. Choose **"Share via Postman Cloud"**
4. Set appropriate visibility
5. Copy the share link

### Share Environment
1. Right-click the environment
2. Select **"Share"** → **"Share Environment"**
3. Choose **"Share via Postman Cloud"**
4. Set appropriate visibility
5. Copy the share link

## 🚨 Troubleshooting

### Import Issues
- Make sure you're using the latest version of Postman
- Check that the JSON files are valid
- Try importing one file at a time

### Authentication Issues
- Verify the mock server is running on `http://localhost:3001`
- Check that the environment variables are set correctly
- Ensure the access token is being saved after login

### Environment Variables Not Working
- Make sure the environment is selected in the dropdown
- Check that variable names match exactly (case-sensitive)
- Verify the environment is enabled

## 📞 Support

If you encounter any issues:
1. Check the Postman documentation
2. Verify your Postman account permissions
3. Ensure you have the latest version of Postman
4. Check the mock server logs for API errors

---

**Happy Testing! 🎉**
