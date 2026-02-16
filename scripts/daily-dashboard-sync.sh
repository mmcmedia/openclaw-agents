#!/bin/bash
# Daily Dashboard Data Sync
# Runs overnight to refresh data, then emails summary in morning

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DASHBOARD_DIR="/Users/mmcassistant/clawd/projects/analytics-dashboard"
LOG_FILE="/tmp/dashboard-sync-$(date +%Y%m%d).log"

echo "=== Dashboard Sync Started: $(date) ===" | tee -a "$LOG_FILE"

# Run the sync script
cd "$DASHBOARD_DIR/backend"
node scripts/sync-all-data.js 2>&1 | tee -a "$LOG_FILE"

# Check if sync was successful
if [ $? -eq 0 ]; then
    echo "✅ Sync completed successfully" | tee -a "$LOG_FILE"
else
    echo "❌ Sync failed" | tee -a "$LOG_FILE"
    exit 1
fi

echo "=== Dashboard Sync Finished: $(date) ===" | tee -a "$LOG_FILE"
