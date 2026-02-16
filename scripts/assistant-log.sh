#!/bin/bash
# assistant-log.sh - Log an action to the activity log
# Usage: ./assistant-log.sh "Description" [category]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACTIVITY_LOGGER="$SCRIPT_DIR/../helpers/activity-logger.js"

if [ -z "$1" ]; then
  echo "Usage: assistant-log.sh \"Description\" [category]"
  echo ""
  echo "Categories:"
  echo "  file_operation    - File created/edited/deleted"
  echo "  command           - Shell command executed"
  echo "  browser_action    - Browser automation"
  echo "  api_call          - External API request"
  echo "  memory_save       - Saved to memory files"
  echo "  task_created      - Task added to Kanban"
  echo "  task_completed    - Task marked done"
  echo "  status_update     - Status indicator changed"
  echo "  email_sent        - Email sent"
  echo "  general           - Other actions"
  exit 1
fi

ACTION="$1"
CATEGORY="${2:-general}"

# Log the action
node "$ACTIVITY_LOGGER" log "$ACTION" "$CATEGORY"

# Also append to daily memory for human-readable log
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M:%S)
DAILY_LOG="$SCRIPT_DIR/../memory/$DATE.md"

# Create daily log if it doesn't exist
if [ ! -f "$DAILY_LOG" ]; then
  echo "# Daily Log: $DATE" > "$DAILY_LOG"
  echo "" >> "$DAILY_LOG"
fi

# Append action to daily log
echo "- **[$TIME]** [$CATEGORY] $ACTION" >> "$DAILY_LOG"

echo "✓ Logged: $ACTION ($CATEGORY)"
