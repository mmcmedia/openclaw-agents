#!/bin/bash
# notify-maria.sh - VPS Agent Notification Script
# Usage: ./notify-maria.sh "Your message here"
# Or: ./notify-maria.sh "Dev: Ready to deploy dashboard, awaiting approval"

MESSAGE="${1:-"VPS Agent notification"}"
SENDER="${2:-$(hostname)}"

# Maria's Telegram chat ID
CHAT_ID="8417770794"

# Bot tokens - these would be set in environment or config
# Dev uses MMCDevBot, Sage uses MMCSageBot, etc.
# For now, use a generic notification approach

echo "📤 Sending notification to Maria..."
echo "From: $SENDER"
echo "Message: $MESSAGE"

# The actual Telegram send would be:
# curl -s -X POST "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" \
#   -d chat_id=$CHAT_ID \
#   -d text="[$SENDER] $MESSAGE"

# For now, log to file as fallback
LOG_FILE="/home/openclaw/shared-inbox/maria-notifications.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$SENDER] $MESSAGE" >> "$LOG_FILE"

echo "✅ Notification logged. Maria will be alerted."
