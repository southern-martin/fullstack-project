#!/bin/bash

# Script to initialize local development secrets
# Run this once when setting up the project locally

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SECRETS_DIR="$PROJECT_ROOT/infrastructure/secrets"
SECRETS_FILE="$SECRETS_DIR/secrets.yaml"
EXAMPLE_FILE="$SECRETS_DIR/secrets.example.yaml"

echo "🔐 Initializing local development secrets..."

# Check if secrets.yaml already exists
if [ -f "$SECRETS_FILE" ]; then
    echo "⚠️  secrets.yaml already exists!"
    read -p "Do you want to regenerate it? This will overwrite existing secrets. (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted. Keeping existing secrets.yaml"
        exit 0
    fi
fi

# Copy template
echo "📋 Copying secrets template..."
cp "$EXAMPLE_FILE" "$SECRETS_FILE"

# Generate secure random passwords
echo "🔑 Generating secure random passwords..."

generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Replace placeholders with generated passwords
echo "✏️  Replacing placeholders with generated values..."

# Database passwords
sed -i.bak "s/CHANGE_ME_shared_root_password/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_shared_user_password/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_customer_root_password/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_customer_password/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_carrier_root_password/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_carrier_password/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_pricing_root_password/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_pricing_password/$(generate_password)/g" "$SECRETS_FILE"

# Redis password
sed -i.bak "s/CHANGE_ME_redis_password/$(generate_password)/g" "$SECRETS_FILE"

# JWT secrets (need to be longer for security)
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/\n" | cut -c1-64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d "=+/\n" | cut -c1-64)

# Use a temporary file for macOS sed compatibility
TMP_FILE="${SECRETS_FILE}.tmp"
cp "$SECRETS_FILE" "$TMP_FILE"

# Replace JWT secrets using awk for better handling of long strings
awk -v jwt="$JWT_SECRET" -v refresh="$JWT_REFRESH_SECRET" '
/CHANGE_ME_256_bit_secret_key_for_jwt_tokens_minimum_32_characters/ { gsub(/CHANGE_ME_256_bit_secret_key_for_jwt_tokens_minimum_32_characters/, jwt) }
/CHANGE_ME_256_bit_refresh_token_secret_different_from_main/ { gsub(/CHANGE_ME_256_bit_refresh_token_secret_different_from_main/, refresh) }
{ print }
' "$TMP_FILE" > "$SECRETS_FILE"

rm -f "$TMP_FILE"

# API Keys
sed -i.bak "s/CHANGE_ME_auth_service_api_key/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_user_service_api_key/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_carrier_service_api_key/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_customer_service_api_key/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_pricing_service_api_key/$(generate_password)/g" "$SECRETS_FILE"
sed -i.bak "s/CHANGE_ME_translation_service_api_key/$(generate_password)/g" "$SECRETS_FILE"

# Clean up backup file
rm -f "$SECRETS_FILE.bak"

echo "✅ Local secrets generated successfully!"
echo ""
echo "📍 Secrets file location: $SECRETS_FILE"
echo ""
echo "⚠️  IMPORTANT:"
echo "   - This file is gitignored and will NEVER be committed"
echo "   - Keep this file secure on your local machine"
echo "   - For production, use GCP Secret Manager"
echo ""
echo "🚀 You can now start your local development environment:"
echo "   make start-local"
