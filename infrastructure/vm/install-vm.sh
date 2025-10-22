#!/bin/bash
# Installation script for deploying Fullstack Project on a custom VM
# Supports: Ubuntu 20.04/22.04, Debian 11/12, CentOS 8+, Rocky Linux 8+

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
INSTALL_DIR="/opt/fullstack-project"
NGINX_CONFIG_DIR="/etc/nginx"
SYSTEMD_DIR="/etc/systemd/system"
BACKUP_DIR="/var/backups/fullstack-project"

# Functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "This script must be run as root"
        echo "Usage: sudo $0"
        exit 1
    fi
}

detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
        print_info "Detected OS: $OS $OS_VERSION"
    else
        print_error "Cannot detect operating system"
        exit 1
    fi
}

install_docker() {
    print_header "Installing Docker"
    
    if command -v docker &> /dev/null; then
        print_info "Docker is already installed: $(docker --version)"
        return
    fi
    
    case $OS in
        ubuntu|debian)
            apt-get update
            apt-get install -y ca-certificates curl gnupg lsb-release
            
            # Add Docker's official GPG key
            install -m 0755 -d /etc/apt/keyrings
            curl -fsSL https://download.docker.com/linux/$OS/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
            chmod a+r /etc/apt/keyrings/docker.gpg
            
            # Set up repository
            echo \
              "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$OS \
              $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
            
            apt-get update
            apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            ;;
        centos|rocky|rhel)
            yum install -y yum-utils
            yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
            yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
            systemctl start docker
            ;;
        *)
            print_error "Unsupported OS: $OS"
            exit 1
            ;;
    esac
    
    systemctl enable docker
    print_info "Docker installed successfully: $(docker --version)"
}

install_nginx() {
    print_header "Installing Nginx"
    
    if command -v nginx &> /dev/null; then
        print_info "Nginx is already installed: $(nginx -v 2>&1)"
        return
    fi
    
    case $OS in
        ubuntu|debian)
            apt-get update
            apt-get install -y nginx
            ;;
        centos|rocky|rhel)
            yum install -y nginx
            ;;
    esac
    
    systemctl enable nginx
    print_info "Nginx installed successfully"
}

install_certbot() {
    print_header "Installing Certbot (Let's Encrypt)"
    
    if command -v certbot &> /dev/null; then
        print_info "Certbot is already installed: $(certbot --version)"
        return
    fi
    
    case $OS in
        ubuntu|debian)
            apt-get install -y certbot python3-certbot-nginx
            ;;
        centos|rocky|rhel)
            yum install -y certbot python3-certbot-nginx
            ;;
    esac
    
    print_info "Certbot installed successfully"
}

install_monitoring_tools() {
    print_header "Installing Monitoring Tools"
    
    case $OS in
        ubuntu|debian)
            apt-get install -y htop iotop nethogs ncdu
            ;;
        centos|rocky|rhel)
            yum install -y htop iotop nethogs ncdu
            ;;
    esac
    
    print_info "Monitoring tools installed"
}

create_directories() {
    print_header "Creating Directory Structure"
    
    mkdir -p "$INSTALL_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p /var/log/fullstack-project
    
    print_info "Directories created"
}

setup_firewall() {
    print_header "Configuring Firewall"
    
    if command -v ufw &> /dev/null; then
        # Ubuntu/Debian - UFW
        ufw allow 22/tcp comment 'SSH'
        ufw allow 80/tcp comment 'HTTP'
        ufw allow 443/tcp comment 'HTTPS'
        echo "y" | ufw enable || true
        print_info "UFW firewall configured"
    elif command -v firewall-cmd &> /dev/null; then
        # CentOS/Rocky - firewalld
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        print_info "Firewalld configured"
    else
        print_warn "No firewall detected, skipping firewall configuration"
    fi
}

optimize_system() {
    print_header "Optimizing System Settings"
    
    # Increase file descriptors
    cat >> /etc/security/limits.conf <<EOF
# Fullstack Project - Increased limits
*         soft    nofile      65536
*         hard    nofile      65536
root      soft    nofile      65536
root      hard    nofile      65536
EOF
    
    # Optimize sysctl
    cat >> /etc/sysctl.conf <<EOF

# Fullstack Project - Network optimizations
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_max_syn_backlog = 8192
net.core.somaxconn = 1024
EOF
    
    sysctl -p
    print_info "System optimizations applied"
}

show_next_steps() {
    print_header "Installation Complete!"
    
    cat <<EOF
${GREEN}✓${NC} Docker installed and running
${GREEN}✓${NC} Docker Compose installed
${GREEN}✓${NC} Nginx installed
${GREEN}✓${NC} Certbot installed
${GREEN}✓${NC} Directories created
${GREEN}✓${NC} Firewall configured
${GREEN}✓${NC} System optimized

${BLUE}Next Steps:${NC}

1. Clone your application repository to ${INSTALL_DIR}:
   ${YELLOW}cd ${INSTALL_DIR}
   git clone <your-repo-url> .${NC}

2. Generate secrets:
   ${YELLOW}./scripts/init-local-secrets.sh${NC}

3. Configure environment for VM:
   ${YELLOW}cp infrastructure/environments/production.env .env${NC}
   ${YELLOW}# Edit .env with your production values${NC}

4. Deploy the application:
   ${YELLOW}./infrastructure/vm/deploy-vm.sh${NC}

5. Setup SSL certificate (replace example.com with your domain):
   ${YELLOW}certbot --nginx -d example.com -d www.example.com${NC}

6. Enable automatic backups:
   ${YELLOW}./infrastructure/vm/setup-backup.sh${NC}

${BLUE}Useful Commands:${NC}

  - View running services: ${YELLOW}docker ps${NC}
  - View logs: ${YELLOW}docker-compose -f docker-compose.vm.yml logs -f${NC}
  - Restart services: ${YELLOW}systemctl restart fullstack-project${NC}
  - Check Nginx: ${YELLOW}systemctl status nginx${NC}
  - View backups: ${YELLOW}ls -lh ${BACKUP_DIR}${NC}

${BLUE}Documentation:${NC}
  - VM Deployment Guide: infrastructure/vm/README.md

EOF
}

# Main installation flow
main() {
    print_header "Fullstack Project - VM Installation"
    
    check_root
    detect_os
    
    install_docker
    install_nginx
    install_certbot
    install_monitoring_tools
    create_directories
    setup_firewall
    optimize_system
    
    show_next_steps
}

main "$@"
