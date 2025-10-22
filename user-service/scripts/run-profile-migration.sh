#!/bin/bash

# User Profile Migration Script
# Runs the user_profiles table creation migration

set -e

echo "🔄 Running User Profile Migration..."

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-3306}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD:-password}
DB_NAME=${DB_NAME:-shared_user_db}

MIGRATION_FILE="migrations/001_create_user_profiles_table.sql"

echo "📊 Database: $DB_NAME"
echo "🖥️  Host: $DB_HOST:$DB_PORT"
echo "📄 Migration: $MIGRATION_FILE"

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Migration file not found: $MIGRATION_FILE"
  exit 1
fi

# Run migration
echo "⚙️  Executing migration..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USERNAME" -p"$DB_PASSWORD" "$DB_NAME" < "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
  echo "📊 Table 'user_profiles' created"
else
  echo "❌ Migration failed"
  exit 1
fi
