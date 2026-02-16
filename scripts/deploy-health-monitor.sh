#!/bin/bash
# Deploy health monitor to cron - fixed version
# Run this from the repo root

set -e

echo "🩺 Deploying System Health Monitor to Cron"
echo "============================================"

# Get repo root
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SCRIPT="$REPO_ROOT/scripts/system-health-monitor.mjs"
LOG_FILE="/var/log/openclaw-health.log"

# Verify script exists
if [ ! -f "$SCRIPT" ]; then
    echo "❌ Health monitor not found at: $SCRIPT"
    exit 1
fi

echo "✅ Health monitor found: $SCRIPT"

# Create log file if possible (may need sudo)
if [ -w "/var/log" ]; then
    touch "$LOG_FILE" 2>/dev/null || echo "⚠️  Cannot write to $LOG_FILE (will log locally)"
else
    # Log locally instead
    LOG_FILE="$REPO_ROOT/projects/system-health/cron.log"
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "ℹ️  Logging locally to: $LOG_FILE"
fi

# Check if already in crontab
if crontab -l 2>/dev/null | grep -q "system-health-monitor"; then
    echo "ℹ️  Health monitor already in crontab"
    echo "   Run 'crontab -e' to edit manually if needed"
    exit 0
fi

# Add to crontab
echo "Adding to crontab..."
(
    crontab -l 2>/dev/null || echo ""
    echo "# OpenClaw System Health Monitor - auto-restart Gateway, check staleness"
    echo "*/15 * * * * cd $REPO_ROOT && /usr/local/bin/node scripts/system-health-monitor.mjs >> $LOG_FILE 2>&1"
) | crontab -

echo "✅ Health monitor deployed!"
echo ""
echo "Schedule: Every 15 minutes"
echo "Log file: $LOG_FILE"
echo ""
echo "To verify:"
echo "  crontab -l | grep health-monitor"
echo "  tail -f $LOG_FILE"
