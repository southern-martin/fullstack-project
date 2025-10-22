#!/bin/bash
# Deployment script for VM environment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_info "Checking requirements..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Run install-vm.sh first"
        exit 1
    fi
    
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        print_error ".env file not found"
        echo "Copy infrastructure/environments/production.env to .env and configure it"
        exit 1
    fi
    
    print_info "Requirements check passed"
}

backup_current_deployment() {
    if [ -f "docker-compose.vm.yml" ] && docker compose -f docker-compose.vm.yml ps | grep -q "Up"; then
        print_info "Creating backup of current deployment..."
        
        BACKUP_DIR="/var/backups/fullstack-project"
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"
        
        mkdir -p "$BACKUP_PATH"
        
        # Backup databases
        docker compose -f docker-compose.vm.yml exec -T shared-user-db mysqldump \
            -u root -p"${SHARED_DB_ROOT_PASSWORD}" --all-databases > "${BACKUP_PATH}/shared-db.sql" 2>/dev/null || true
        
        docker compose -f docker-compose.vm.yml exec -T customer-db mysqldump \
            -u root -p"${CUSTOMER_DB_ROOT_PASSWORD}" --all-databases > "${BACKUP_PATH}/customer-db.sql" 2>/dev/null || true
        
        docker compose -f docker-compose.vm.yml exec -T carrier-db mysqldump \
            -u root -p"${CARRIER_DB_ROOT_PASSWORD}" --all-databases > "${BACKUP_PATH}/carrier-db.sql" 2>/dev/null || true
        
        docker compose -f docker-compose.vm.yml exec -T pricing-db mysqldump \
            -u root -p"${PRICING_DB_ROOT_PASSWORD}" --all-databases > "${BACKUP_PATH}/pricing-db.sql" 2>/dev/null || true
        
        # Backup Redis
        docker compose -f docker-compose.vm.yml exec -T shared-redis redis-cli \
            -a "${REDIS_PASSWORD}" --rdb /data/dump.rdb SAVE 2>/dev/null || true
        
        print_info "Backup created at: ${BACKUP_PATH}"
    fi
}

build_images() {
    print_info "Building Docker images..."
    docker compose -f docker-compose.vm.yml build --pull
    print_info "Images built successfully"
}

deploy() {
    print_info "Deploying services..."
    
    # Stop existing services
    docker compose -f docker-compose.vm.yml down
    
    # Start services
    docker compose -f docker-compose.vm.yml up -d
    
    print_info "Waiting for services to be healthy..."
    sleep 10
    
    # Check service health
    docker compose -f docker-compose.vm.yml ps
}

setup_systemd_service() {
    print_info "Setting up systemd service..."
    
    INSTALL_DIR=$(pwd)
    
    cat > /etc/systemd/system/fullstack-project.service <<EOF
[Unit]
Description=Fullstack Project
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=${INSTALL_DIR}
ExecStart=/usr/bin/docker compose -f docker-compose.vm.yml up -d
ExecStop=/usr/bin/docker compose -f docker-compose.vm.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF
    
    systemctl daemon-reload
    systemctl enable fullstack-project.service
    
    print_info "Systemd service configured (auto-start on boot enabled)"
}

show_status() {
    print_info "Deployment Status:"
    echo ""
    docker compose -f docker-compose.vm.yml ps
    echo ""
    
    print_info "Service URLs (internal):"
    echo "  Frontend:     http://localhost:3000"
    echo "  Auth:         http://localhost:3001"
    echo "  User:         http://localhost:3003"
    echo "  Carrier:      http://localhost:3004"
    echo "  Customer:     http://localhost:3005"
    echo "  Pricing:      http://localhost:3006"
    echo "  Translation:  http://localhost:3007"
    echo ""
    
    print_info "Next steps:"
    echo "  1. Configure Nginx reverse proxy: sudo cp infrastructure/vm/nginx.conf /etc/nginx/sites-available/fullstack-project"
    echo "  2. Enable site: sudo ln -s /etc/nginx/sites-available/fullstack-project /etc/nginx/sites-enabled/"
    echo "  3. Test config: sudo nginx -t"
    echo "  4. Reload Nginx: sudo systemctl reload nginx"
    echo "  5. Setup SSL: sudo certbot --nginx -d yourdomain.com"
}

main() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Fullstack Project - VM Deployment${NC}"
    echo -e "${BLUE}========================================${NC}\n"
    
    check_requirements
    backup_current_deployment
    build_images
    deploy
    setup_systemd_service
    show_status
    
    echo ""
    print_info "${GREEN}Deployment completed successfully!${NC}"
}

main "$@"
