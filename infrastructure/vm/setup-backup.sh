#!/bin/bash
# Setup automated backups for VM deployment

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

BACKUP_DIR="/var/backups/fullstack-project"
INSTALL_DIR="/opt/fullstack-project"
RETENTION_DAYS=30

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

# Create backup script
cat > /usr/local/bin/fullstack-backup.sh <<'EOF'
#!/bin/bash
# Automated backup script

BACKUP_DIR="/var/backups/fullstack-project"
INSTALL_DIR="/opt/fullstack-project"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="${BACKUP_DIR}/backup_${TIMESTAMP}"
RETENTION_DAYS=30

# Load environment
source ${INSTALL_DIR}/.env

# Create backup directory
mkdir -p "${BACKUP_PATH}"

# Backup databases
echo "[$(date)] Starting database backups..."

docker compose -f ${INSTALL_DIR}/docker-compose.vm.yml exec -T shared-user-db mysqldump \
    -u root -p"${SHARED_DB_ROOT_PASSWORD}" --all-databases \
    --single-transaction --quick --lock-tables=false \
    > "${BACKUP_PATH}/shared-db.sql" 2>/dev/null

docker compose -f ${INSTALL_DIR}/docker-compose.vm.yml exec -T customer-db mysqldump \
    -u root -p"${CUSTOMER_DB_ROOT_PASSWORD}" --all-databases \
    --single-transaction --quick --lock-tables=false \
    > "${BACKUP_PATH}/customer-db.sql" 2>/dev/null

docker compose -f ${INSTALL_DIR}/docker-compose.vm.yml exec -T carrier-db mysqldump \
    -u root -p"${CARRIER_DB_ROOT_PASSWORD}" --all-databases \
    --single-transaction --quick --lock-tables=false \
    > "${BACKUP_PATH}/carrier-db.sql" 2>/dev/null

docker compose -f ${INSTALL_DIR}/docker-compose.vm.yml exec -T pricing-db mysqldump \
    -u root -p"${PRICING_DB_ROOT_PASSWORD}" --all-databases \
    --single-transaction --quick --lock-tables=false \
    > "${BACKUP_PATH}/pricing-db.sql" 2>/dev/null

# Backup Redis
echo "[$(date)] Backing up Redis..."
docker compose -f ${INSTALL_DIR}/docker-compose.vm.yml exec -T shared-redis redis-cli \
    -a "${REDIS_PASSWORD}" --rdb /data/dump.rdb SAVE 2>/dev/null
docker cp $(docker compose -f ${INSTALL_DIR}/docker-compose.vm.yml ps -q shared-redis):/data/dump.rdb \
    "${BACKUP_PATH}/redis-dump.rdb" 2>/dev/null

# Backup environment and docker-compose files
echo "[$(date)] Backing up configuration files..."
cp ${INSTALL_DIR}/.env "${BACKUP_PATH}/.env"
cp ${INSTALL_DIR}/docker-compose.vm.yml "${BACKUP_PATH}/docker-compose.vm.yml"

# Compress backup
echo "[$(date)] Compressing backup..."
tar -czf "${BACKUP_PATH}.tar.gz" -C "${BACKUP_DIR}" "backup_${TIMESTAMP}"
rm -rf "${BACKUP_PATH}"

# Remove old backups
echo "[$(date)] Cleaning old backups (older than ${RETENTION_DAYS} days)..."
find ${BACKUP_DIR} -name "backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete

BACKUP_SIZE=$(du -h "${BACKUP_PATH}.tar.gz" | cut -f1)
echo "[$(date)] Backup completed: ${BACKUP_PATH}.tar.gz (${BACKUP_SIZE})"
EOF

chmod +x /usr/local/bin/fullstack-backup.sh

# Create systemd timer for daily backups
cat > /etc/systemd/system/fullstack-backup.timer <<EOF
[Unit]
Description=Fullstack Project Daily Backup Timer
Requires=fullstack-backup.service

[Timer]
OnCalendar=daily
OnCalendar=02:00
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Create systemd service
cat > /etc/systemd/system/fullstack-backup.service <<EOF
[Unit]
Description=Fullstack Project Backup Service
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/fullstack-backup.sh
StandardOutput=journal
StandardError=journal
EOF

# Enable and start timer
systemctl daemon-reload
systemctl enable fullstack-backup.timer
systemctl start fullstack-backup.timer

print_info "Automated backup configured!"
echo ""
echo "  Backup schedule:  Daily at 2:00 AM"
echo "  Backup location:  ${BACKUP_DIR}"
echo "  Retention:        ${RETENTION_DAYS} days"
echo ""
echo "Commands:"
echo "  - Run backup now:         sudo /usr/local/bin/fullstack-backup.sh"
echo "  - Check timer status:     systemctl status fullstack-backup.timer"
echo "  - List backups:           ls -lh ${BACKUP_DIR}"
echo "  - Disable auto-backup:    systemctl stop fullstack-backup.timer"
echo ""

# Run initial backup
print_info "Running initial backup..."
/usr/local/bin/fullstack-backup.sh
