#!/bin/bash

##############################################
# Automation Watchdog
# 
# Monitors all automation cron jobs for:
# - Are they scheduled?
# - Did they run today?
# - Did they succeed?
# - Any error logs?
#
# Run manually: ./automation-watchdog.sh
# Or schedule as: 0 * * * * /path/to/automation-watchdog.sh (hourly)
##############################################

AUTOMATIONS_DIR="/Users/mmcassistant/clawd/projects/automations"
DATE=$(date +"%Y-%m-%d")
HOUR=$(date +"%H")

echo "🔍 Automation Watchdog - $(date)"
echo "================================================"

# Array of automations
declare -a AUTOMATIONS=(
    "etsy-review-monitor|11|daily"
    "ceo-monday-email|07|monday"
    "pinterest-alerts|09|daily"
    "revenue-forecast|23|daily"
    "competitor-monitor|20|sunday"
    "etsy-gaps|18|saturday"
    "content-calendar|16|friday"
)

# Check each automation
for automation in "${AUTOMATIONS[@]}"; do
    IFS='|' read -r name expected_hour frequency <<< "$automation"
    logs_dir="$AUTOMATIONS_DIR/$name/logs"
    
    echo ""
    echo "📋 $name ($frequency)"
    
    # Check if logs directory exists
    if [ ! -d "$logs_dir" ]; then
        echo "  ❌ No logs directory found"
        continue
    fi
    
    # Find today's logs
    today_log=$(ls "$logs_dir"/*${DATE}*.json 2>/dev/null | head -1)
    
    if [ -z "$today_log" ]; then
        echo "  ⏳ No logs yet today (expected at ${expected_hour}:00 MT)"
    else
        # Check if successful
        if grep -q '"status":"success"' "$today_log" 2>/dev/null; then
            echo "  ✅ Success - $(date -r "$today_log" '+%H:%M:%S')"
        elif grep -q '"status":"error"' "$today_log" 2>/dev/null; then
            echo "  ❌ Error - $(date -r "$today_log" '+%H:%M:%S')"
            # Show error message
            error_msg=$(grep -o '"message":"[^"]*"' "$today_log" | head -1)
            echo "     Error: $error_msg"
        else
            echo "  ⚠️  Unknown status - $(date -r "$today_log" '+%H:%M:%S')"
        fi
    fi
    
    # Check cron job status
    cron_file="$AUTOMATIONS_DIR/$name/cron-job.json"
    if [ -f "$cron_file" ]; then
        echo "  📅 Cron configured: $(grep -o '"schedule":"[^"]*"' "$cron_file")"
    else
        echo "  ⚠️  Cron file not found"
    fi
done

echo ""
echo "================================================"
echo "✨ Watchdog check complete - $(date)"
echo ""
echo "Tips:"
echo "  • Check individual logs: ls $AUTOMATIONS_DIR/[name]/logs/"
echo "  • Test automation: node $AUTOMATIONS_DIR/[name]/run.js"
echo "  • View cron status: clawdbot cron list"
echo ""
