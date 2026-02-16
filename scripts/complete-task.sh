#!/bin/bash
# complete-task.sh - Mark a kanban card as done
# Usage: ./complete-task.sh <card-id> [notes]
# Example: ./complete-task.sh wp-bug-001 "Fixed the JSX syntax error"

CARDS_FILE="/Users/mmcassistant/clawd/dashboard/data/cards.json"
CARD_ID="$1"
NOTES="$2"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [ -z "$CARD_ID" ]; then
    echo "Usage: $0 <card-id> [notes]"
    echo "Example: $0 wp-bug-001 'Fixed the issue'"
    exit 1
fi

# Check if card exists
if ! grep -q "\"id\": \"$CARD_ID\"" "$CARDS_FILE" 2>/dev/null; then
    echo "❌ Card '$CARD_ID' not found in kanban"
    exit 1
fi

# Update the card to done
python3 << EOF
import json

with open("$CARDS_FILE", "r") as f:
    cards = json.load(f)

found = False
for card in cards:
    if card.get("id") == "$CARD_ID":
        card["column"] = "done"
        card["updatedAt"] = "$TIMESTAMP"
        if "$NOTES":
            card["completionNotes"] = "$NOTES"
        found = True
        print(f"✅ Moved '{card['title']}' to done")
        break

if found:
    with open("$CARDS_FILE", "w") as f:
        json.dump(cards, f, indent=2)
else:
    print("❌ Card not found")
EOF

# Sync to VPS dashboard
ssh root@76.13.108.6 "curl -s -X PATCH http://localhost:3080/api/cards/$CARD_ID -H 'Content-Type: application/json' -d '{\"column\": \"done\", \"agent\": \"Maria\", \"notes\": \"$NOTES\"}'" 2>/dev/null && echo "📡 Synced to VPS dashboard" || echo "⚠️ VPS sync failed (non-critical)"
