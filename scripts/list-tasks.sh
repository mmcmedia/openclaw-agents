#!/bin/bash
# list-tasks.sh - List kanban tasks by column
# Usage: ./list-tasks.sh [column]
# Example: ./list-tasks.sh todo

CARDS_FILE="/Users/mmcassistant/clawd/dashboard/data/cards.json"
COLUMN="${1:-todo}"

python3 << EOF
import json

with open("$CARDS_FILE", "r") as f:
    cards = json.load(f)

column = "$COLUMN"
filtered = [c for c in cards if c.get("column") == column]

if not filtered:
    print(f"No tasks in '{column}'")
else:
    print(f"\n📋 {column.upper()} ({len(filtered)} tasks):")
    print("-" * 50)
    for card in filtered:
        priority = card.get("priority", "medium")
        icon = "🔴" if priority == "critical" else "🟠" if priority == "high" else "🟡" if priority == "medium" else "⚪"
        print(f"{icon} [{card['id']}] {card['title']}")
EOF
