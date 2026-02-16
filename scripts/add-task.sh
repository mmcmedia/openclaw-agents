#!/bin/bash
# add-task.sh - Add a new card to the kanban
# Usage: ./add-task.sh <id> <title> [priority] [category]
# Example: ./add-task.sh mv-timeline "Fix Timeline Editor" high Tech

CARDS_FILE="/Users/mmcassistant/clawd/dashboard/data/cards.json"
CARD_ID="$1"
TITLE="$2"
PRIORITY="${3:-medium}"
CATEGORY="${4:-Tech}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

if [ -z "$CARD_ID" ] || [ -z "$TITLE" ]; then
    echo "Usage: $0 <id> <title> [priority] [category]"
    echo "Example: $0 mv-timeline 'Fix Timeline Editor' high Tech"
    exit 1
fi

python3 << EOF
import json

with open("$CARDS_FILE", "r") as f:
    cards = json.load(f)

# Check if ID already exists
for card in cards:
    if card.get("id") == "$CARD_ID":
        print(f"❌ Card ID '$CARD_ID' already exists")
        exit(1)

new_card = {
    "id": "$CARD_ID",
    "title": "$TITLE",
    "column": "todo",
    "priority": "$PRIORITY",
    "category": "$CATEGORY",
    "assignee": "Maria",
    "createdAt": "$TIMESTAMP"
}

cards.append(new_card)

with open("$CARDS_FILE", "w") as f:
    json.dump(cards, f, indent=2)

print(f"✅ Added '{new_card['title']}' to kanban (id: $CARD_ID)")
EOF


# Sync cards.json to VPS
scp /Users/mmcassistant/clawd/dashboard/data/cards.json root@76.13.108.6:/var/www/dashboard/data/cards.json 2>/dev/null && echo "📡 Synced to VPS dashboard" || echo "⚠️ VPS sync failed (non-critical)"
