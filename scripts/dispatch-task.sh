#!/bin/bash
# dispatch-task.sh — Send a task to a VPS agent and log it
# Usage: ./dispatch-task.sh <agent> "<task description>" [card-id]
#
# Agents: sage, scout, dev, pixel, milo, ally
# Agent IDs map: sage=content-seo, scout=etsy-director, dev=webdev, pixel=designer, milo=psalmix, ally=dhanielle

set -e

AGENT_NAME="$1"
TASK="$2"
CARD_ID="${3:-none}"
VPS="root@76.13.108.6"
LOG_DIR="/Users/mmcassistant/clawd/projects/subagent-tracking"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

if [ -z "$AGENT_NAME" ] || [ -z "$TASK" ]; then
  echo "Usage: $0 <agent> \"<task description>\" [card-id]"
  echo ""
  echo "Agents: sage, scout, dev, pixel, milo, ally"
  echo "Example: $0 sage \"Run SEO audit on weheartcozy.com\" whc-seo-audit"
  exit 1
fi

# Map friendly names to agent IDs
case "$AGENT_NAME" in
  sage)   AGENT_ID="content-seo" ;;
  scout)  AGENT_ID="etsy-director" ;;
  dev)    AGENT_ID="webdev" ;;
  pixel)  AGENT_ID="designer" ;;
  milo)   AGENT_ID="psalmix" ;;
  ally)   AGENT_ID="dhanielle" ;;
  *)
    echo "ERROR: Unknown agent '$AGENT_NAME'"
    echo "Valid agents: sage, scout, dev, pixel, milo, ally"
    exit 1
    ;;
esac

echo "📤 Dispatching to $AGENT_NAME ($AGENT_ID)..."
echo "   Task: $TASK"
echo "   Card: $CARD_ID"
echo ""

# Log the dispatch
mkdir -p "$LOG_DIR"
echo "| $TIMESTAMP | $AGENT_NAME | $CARD_ID | DISPATCHED | $TASK |" >> "$LOG_DIR/DISPATCH-LOG.md"

# Send to VPS agent
RESPONSE=$(ssh "$VPS" "cd /home/openclaw && openclaw agent --agent '$AGENT_ID' --message '$TASK' --json 2>&1" || echo '{"error": "SSH or agent command failed"}')

# Check if response is valid
if echo "$RESPONSE" | grep -q '"error"'; then
  echo "❌ Dispatch failed:"
  echo "$RESPONSE"
  echo "| $TIMESTAMP | $AGENT_NAME | $CARD_ID | FAILED | Error in dispatch |" >> "$LOG_DIR/DISPATCH-LOG.md"
  exit 1
fi

echo "✅ Task dispatched to $AGENT_NAME!"
echo ""
echo "Response preview:"
echo "$RESPONSE" | head -20

# Update kanban card to inprogress if card-id provided
if [ "$CARD_ID" != "none" ]; then
  ssh "$VPS" "python3 -c \"
import json
with open('/home/openclaw/analytics-api/data/cards.json', 'r') as f:
    cards = json.load(f)
for c in cards:
    if c.get('id') == '$CARD_ID':
        c['column'] = 'inprogress'
        c['startedAt'] = '$TIMESTAMP'
        break
with open('/home/openclaw/analytics-api/data/cards.json', 'w') as f:
    json.dump(cards, f, indent=2)
print('Card $CARD_ID moved to inprogress')
\"" 2>/dev/null || true
fi

echo ""
echo "📋 Logged to $LOG_DIR/DISPATCH-LOG.md"
