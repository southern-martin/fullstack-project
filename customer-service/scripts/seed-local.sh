#!/bin/bash

# Seed Customer Service Data Locally
# Sets environment variables for local execution (no Docker)
# NOTE: Overrides .env file settings for local Redis without password

echo "🌱 Seeding Customer Service (Local Mode)"
echo "   - Redis: localhost:6379 (no password)"
echo "   - Database: localhost:3309"
echo ""

# Override .env settings - local Redis has NO password
REDIS_HOST=localhost \
REDIS_PASSWORD="" \
npx ts-node -r tsconfig-paths/register scripts/seed-data.ts
