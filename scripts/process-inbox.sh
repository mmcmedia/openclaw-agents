#!/bin/bash
# process-inbox.sh - Check inbox for new items
# Called by heartbeat to process dropped files

INBOX_RAW="/Users/mmcassistant/clawd/inbox/raw"
INBOX_PROCESSED="/Users/mmcassistant/clawd/inbox/processed"

# Count items
COUNT=$(find "$INBOX_RAW" -type f 2>/dev/null | wc -l | tr -d ' ')

if [ "$COUNT" -eq 0 ]; then
    exit 0  # Nothing to process, silent exit
fi

echo "📥 INBOX: $COUNT new item(s) to process"
echo "---"
ls -la "$INBOX_RAW"
echo ""
echo "Files:"
for f in "$INBOX_RAW"/*; do
    if [ -f "$f" ]; then
        filename=$(basename "$f")
        echo "  - $filename"
    fi
done
