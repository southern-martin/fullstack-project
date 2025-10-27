#!/bin/bash

################################################################################
# Consul Configuration Seeding Script
# 
# This script populates Consul KV store with initial configuration values
# for all microservices in the fullstack-project.
#
# Usage:
#   ./seed-consul-config.sh
#
# Prerequisites:
#   - Consul server running (docker-compose up consul)
#   - curl installed
#
# Author: DevOps Team
# Date: 2025-01-27
################################################################################

set -e  # Exit on error

# Configuration
CONSUL_HOST="${CONSUL_HOST:-localhost}"
CONSUL_PORT="${CONSUL_PORT:-8500}"
CONSUL_URL="http://${CONSUL_HOST}:${CONSUL_PORT}"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Consul is accessible
check_consul() {
    log_info "Checking Consul availability at ${CONSUL_URL}..."
    if curl -s "${CONSUL_URL}/v1/status/leader" > /dev/null; then
        log_success "Consul is accessible"
        return 0
    else
        log_error "Consul is not accessible at ${CONSUL_URL}"
        log_error "Please ensure Consul is running: docker-compose -f docker-compose.hybrid.yml up -d consul"
        exit 1
    fi
}

# Set a key-value pair in Consul
set_config() {
    local key="$1"
    local value="$2"
    
    if curl -s -X PUT -d "${value}" "${CONSUL_URL}/v1/kv/${key}" > /dev/null; then
        log_success "Set ${key} = ${value}"
        return 0
    else
        log_error "Failed to set ${key}"
        return 1
    fi
}

# Main seeding function
seed_configs() {
    log_info "========================================="
    log_info "Starting Consul Configuration Seeding"
    log_info "========================================="
    echo ""
    
    # =========================================================================
    # SHARED INFRASTRUCTURE CONFIGURATION
    # =========================================================================
    
    log_info "Seeding shared infrastructure configuration..."
    echo ""
    
    # Redis Configuration
    log_info "[Shared Redis Configuration]"
    set_config "config/shared/redis/host" "shared-redis"
    set_config "config/shared/redis/port" "6379"
    set_config "config/shared/redis/password" "shared_redis_password_2024"
    echo ""
    
    # Shared User Database Configuration
    log_info "[Shared User Database Configuration]"
    set_config "config/shared/database/shared_user_db/host" "shared-user-db"
    set_config "config/shared/database/shared_user_db/port" "3306"
    set_config "config/shared/database/shared_user_db/username" "shared_user"
    set_config "config/shared/database/shared_user_db/password" "shared_password_2024"
    set_config "config/shared/database/shared_user_db/database" "shared_user_db"
    echo ""
    
    # =========================================================================
    # SERVICE-SPECIFIC CONFIGURATION
    # =========================================================================
    
    # Auth Service Configuration
    log_info "[Auth Service Configuration]"
    set_config "config/auth-service/port" "3001"
    set_config "config/auth-service/service_name" "auth-service"
    set_config "config/auth-service/redis_key_prefix" "auth"
    set_config "config/auth-service/jwt_secret" "your-jwt-secret-key-change-in-production"
    set_config "config/auth-service/jwt_expiration" "24h"
    set_config "config/auth-service/kong_admin_url" "http://kong-gateway:8001"
    set_config "config/auth-service/kong_sync_enabled" "true"
    echo ""
    
    # User Service Configuration
    log_info "[User Service Configuration]"
    set_config "config/user-service/port" "3003"
    set_config "config/user-service/service_name" "user-service"
    set_config "config/user-service/redis_key_prefix" "user"
    echo ""
    
    # Customer Service Configuration
    log_info "[Customer Service Configuration]"
    set_config "config/customer-service/port" "3004"
    set_config "config/customer-service/service_name" "customer-service"
    set_config "config/customer-service/redis_key_prefix" "customer"
    set_config "config/customer-service/user_service_url" "http://user-service:3003"
    set_config "config/customer-service/database/host" "customer-service-db"
    set_config "config/customer-service/database/port" "3306"
    set_config "config/customer-service/database/username" "customer_user"
    set_config "config/customer-service/database/password" "customer_password"
    set_config "config/customer-service/database/database" "customer_service_db"
    echo ""
    
    # Carrier Service Configuration
    log_info "[Carrier Service Configuration]"
    set_config "config/carrier-service/port" "3005"
    set_config "config/carrier-service/service_name" "carrier-service"
    set_config "config/carrier-service/redis_key_prefix" "carrier"
    set_config "config/carrier-service/user_service_url" "http://user-service:3003"
    set_config "config/carrier-service/database/host" "carrier-service-db"
    set_config "config/carrier-service/database/port" "3306"
    set_config "config/carrier-service/database/username" "carrier_user"
    set_config "config/carrier-service/database/password" "carrier_password"
    set_config "config/carrier-service/database/database" "carrier_service_db"
    echo ""
    
    # Pricing Service Configuration
    log_info "[Pricing Service Configuration]"
    set_config "config/pricing-service/port" "3006"
    set_config "config/pricing-service/service_name" "pricing-service"
    set_config "config/pricing-service/redis_key_prefix" "pricing"
    set_config "config/pricing-service/database/host" "pricing-service-db"
    set_config "config/pricing-service/database/port" "3306"
    set_config "config/pricing-service/database/username" "pricing_user"
    set_config "config/pricing-service/database/password" "pricing_password"
    set_config "config/pricing-service/database/database" "pricing_service_db"
    echo ""
    
    # Translation Service Configuration
    log_info "[Translation Service Configuration]"
    set_config "config/translation-service/port" "3007"
    set_config "config/translation-service/service_name" "translation-service"
    set_config "config/translation-service/redis_key_prefix" "translation"
    set_config "config/translation-service/max_batch_translation_size" "200"
    set_config "config/translation-service/database/host" "translation-service-db"
    set_config "config/translation-service/database/port" "3306"
    set_config "config/translation-service/database/username" "translation_user"
    set_config "config/translation-service/database/password" "translation_password"
    set_config "config/translation-service/database/database" "translation_service_db"
    echo ""
    
    # =========================================================================
    # ENVIRONMENT CONFIGURATION
    # =========================================================================
    
    log_info "[Environment Configuration]"
    set_config "config/environment/node_env" "development"
    echo ""
    
    # =========================================================================
    # COMPLETION
    # =========================================================================
    
    log_success "========================================="
    log_success "Configuration Seeding Complete!"
    log_success "========================================="
    echo ""
    log_info "Verifying configuration..."
    
    # Count total keys seeded
    KEY_COUNT=$(curl -s "${CONSUL_URL}/v1/kv/config/?keys" | jq '. | length')
    log_success "Total configuration keys seeded: ${KEY_COUNT}"
    echo ""
    
    log_info "Next steps:"
    echo "  1. View configuration in Consul UI: http://localhost:8500"
    echo "  2. Verify configs via CLI: docker exec consul-server consul kv get -recurse config/"
    echo "  3. Begin service integration (Week 2 of migration plan)"
    echo ""
    log_info "To view all configs:"
    echo "  curl http://localhost:8500/v1/kv/config/?recurse | jq"
    echo ""
}

# Main execution
main() {
    check_consul
    seed_configs
}

main "$@"
