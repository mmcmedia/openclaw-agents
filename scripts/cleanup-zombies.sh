#!/bin/bash
# Auto-cleanup script for stuck clawdbot-onboard processes
# Logs and notifies only when zombies are actually found

LOG_FILE="$HOME/clawd/memory/zombie-cleanup.log"

# Find clawdbot-onboard processes older than 5 minutes
ZOMBIES=$(ps -eo pid,etime,command | grep 'clawdbot-onboard' | grep -v grep | awk '{
  # Parse elapsed time (format: [[dd-]hh:]mm:ss)
  split($2, time, "[-:]")
  if (length(time) == 4) {
    # Format: dd-hh:mm:ss
    minutes = time[1] * 1440 + time[2] * 60 + time[3]
  } else if (length(time) == 3) {
    # Format: hh:mm:ss
    minutes = time[1] * 60 + time[2]
  } else {
    # Format: mm:ss
    minutes = time[1]
  }
  
  if (minutes >= 5) {
    print $1
  }
}')

# If no zombies, exit silently
if [ -z "$ZOMBIES" ]; then
  exit 0
fi

# Log the event
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] Found zombie processes:" >> "$LOG_FILE"
ps -p $ZOMBIES -o pid,etime,command 2>/dev/null >> "$LOG_FILE"

# Kill the zombies
echo "$ZOMBIES" | xargs kill -9 2>/dev/null
echo "[$TIMESTAMP] Killed PIDs: $ZOMBIES" >> "$LOG_FILE"
echo "" >> "$LOG_FILE"

# Count how many were killed
COUNT=$(echo "$ZOMBIES" | wc -w | tr -d ' ')

# Send Telegram notification
MESSAGE="🧹 Auto-cleanup: Killed $COUNT stuck clawdbot-onboard process(es) that were blocking requests. Check ~/clawd/memory/zombie-cleanup.log for details."

clawdbot message send --channel telegram --target 8417770794 --message "$MESSAGE" 2>/dev/null || true

exit 0
