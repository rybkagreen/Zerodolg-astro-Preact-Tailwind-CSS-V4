#!/bin/bash
# =============================================================
# Server Maintenance Script
# Run weekly via cron: 0 3 * * 0 /usr/local/bin/server-maintenance.sh
# =============================================================

set -e

LOG_FILE="/var/log/server-maintenance.log"
echo "=== Maintenance started: $(date) ===" >> "$LOG_FILE"

# 1. Clean APT cache
apt-get autoremove -y --purge >> "$LOG_FILE" 2>&1
apt-get clean >> "$LOG_FILE" 2>&1
echo "[OK] APT cache cleaned" >> "$LOG_FILE"

# 2. Clean npm cache
npm cache clean --force >> "$LOG_FILE" 2>&1 || true
echo "[OK] npm cache cleaned" >> "$LOG_FILE"

# 3. Vacuum journal logs
journalctl --vacuum-size=50M --vacuum-time=3d >> "$LOG_FILE" 2>&1
echo "[OK] Journal logs vacuumed" >> "$LOG_FILE"

# 4. Clean /tmp
find /tmp -type f -atime +7 -delete 2>/dev/null || true
find /var/tmp -type f -atime +7 -delete 2>/dev/null || true
echo "[OK] Temp files cleaned" >> "$LOG_FILE"

# 5. Rotate PM2 logs
pm2 flush >> "$LOG_FILE" 2>&1 || true
echo "[OK] PM2 logs flushed" >> "$LOG_FILE"

# 6. Check disk usage
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}')
echo "[INFO] Disk usage: $DISK_USAGE" >> "$LOG_FILE"

# 7. Check memory usage
MEM_USAGE=$(free -m | awk '/Mem:/ {printf "%.1f%%", $3/$2*100}')
echo "[INFO] Memory usage: $MEM_USAGE" >> "$LOG_FILE"

echo "=== Maintenance completed: $(date) ===" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
