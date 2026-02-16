#!/usr/bin/env bash
# assistant-status.sh - Update Fitz's status for the dashboard

set -euo pipefail

STATUS_FILE="$HOME/clawd/dashboard/.fitz-status.json"

usage() {
  cat <<EOF
Usage: assistant-status.sh <status> [description]

Set Fitz's status for the MMC Command Center dashboard.

STATUS VALUES:
  idle        - Ready to help (green)
  thinking    - Processing request (blue)
  working     - Actively working on task (orange)
  background  - Background task running (purple)

EXAMPLES:
  assistant-status.sh idle
  assistant-status.sh working "Analyzing Pinterest traffic data"
  assistant-status.sh background "Generating weekly report"
  assistant-status.sh thinking "Reading email"

The status is displayed in the dashboard with a colored indicator
and refreshes automatically every 5 seconds.
EOF
  exit 1
}

# Ensure data directory exists
mkdir -p "$(dirname "$STATUS_FILE")"

# Parse arguments
if [ $# -eq 0 ]; then
  usage
fi

STATUS="$1"
DESCRIPTION="${2:-}"

# Validate status
case "$STATUS" in
  idle|thinking|working|background)
    ;;
  *)
    echo "ERROR: Invalid status '$STATUS'" >&2
    echo "Valid values: idle, thinking, working, background" >&2
    exit 1
    ;;
esac

# Set default descriptions
if [ -z "$DESCRIPTION" ]; then
  case "$STATUS" in
    idle)
      DESCRIPTION="Ready to help"
      ;;
    thinking)
      DESCRIPTION="Processing..."
      ;;
    working)
      DESCRIPTION="Working on task"
      ;;
    background)
      DESCRIPTION="Background task running"
      ;;
  esac
fi

# Get current timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ" 2>/dev/null || date -u +"%Y-%m-%dT%H:%M:%SZ")

# Write status JSON
cat > "$STATUS_FILE" <<EOF
{
  "status": "$STATUS",
  "description": "$DESCRIPTION",
  "lastUpdated": "$TIMESTAMP",
  "task": $([ -n "$DESCRIPTION" ] && echo "\"$DESCRIPTION\"" || echo "null")
}
EOF

echo "✓ Status updated: $STATUS - $DESCRIPTION"
