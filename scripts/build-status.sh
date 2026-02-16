#!/bin/bash

# Overnight Build Status Monitor
# Shows real-time status of all 7 automations

echo "🔨 Overnight Automation Build Status"
echo "$(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "================================================"
echo ""

complete=0
building=0

for automation in etsy-review-monitor ceo-monday-email pinterest-alerts revenue-forecast competitor-monitor etsy-gaps content-calendar; do
  dir="/Users/mmcassistant/clawd/projects/automations/$automation"
  
  # Check if all required files exist
  has_run=$( [ -f "$dir/run.js" ] && echo 1 || echo 0 )
  has_config=$( [ -f "$dir/config.json" ] && echo 1 || echo 0 )
  has_cron=$( [ -f "$dir/cron-job.json" ] && echo 1 || echo 0 )
  
  total=$((has_run + has_config + has_cron))
  
  if [ $total -eq 3 ]; then
    echo "✅ $automation"
    complete=$((complete + 1))
  else
    echo "🔄 $automation ($(echo "${has_run}${has_config}${has_cron}" | sed 's/0/❌/g; s/1/✅/g'))"
    building=$((building + 1))
  fi
done

echo ""
echo "================================================"
echo "Status: $complete Complete | $building Building"
echo ""

if [ $building -eq 0 ]; then
  echo "✨ All automations ready for deployment!"
  echo "Run: clawdbot cron add --file /projects/automations/[name]/cron-job.json"
else
  echo "Waiting for Codex to complete..."
  echo "ETA: ~01:35 MT for final 3 automations"
fi
