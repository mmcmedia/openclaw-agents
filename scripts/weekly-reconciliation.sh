#!/bin/bash
# weekly-reconciliation.sh - Reconcile git commits with kanban
# Finds work that was done but not tracked in kanban

echo "📊 WEEKLY PROJECT RECONCILIATION"
echo "================================="
echo ""

WORKSPACE="/Users/mmcassistant/clawd"
CARDS_FILE="$WORKSPACE/dashboard/data/cards.json"

# Get commits from last 7 days across all project repos
echo "🔍 Git commits (last 7 days):"
echo "---"

for dir in "$WORKSPACE/projects"/*; do
    if [ -d "$dir/.git" ]; then
        project=$(basename "$dir")
        commits=$(cd "$dir" && git log --oneline --since="7 days ago" 2>/dev/null | wc -l | tr -d ' ')
        if [ "$commits" -gt 0 ]; then
            echo ""
            echo "📁 $project ($commits commits):"
            cd "$dir" && git log --oneline --since="7 days ago" 2>/dev/null | head -5
        fi
    fi
done

echo ""
echo "---"
echo ""

# Count kanban done items from last 7 days
echo "✅ Kanban items marked done recently:"
python3 << EOF
import json
from datetime import datetime, timedelta

with open("$CARDS_FILE", "r") as f:
    cards = json.load(f)

week_ago = datetime.now() - timedelta(days=7)
done_recent = []

for card in cards:
    if card.get("column") == "done":
        updated = card.get("updatedAt", "")
        if updated:
            try:
                dt = datetime.fromisoformat(updated.replace("Z", "+00:00"))
                if dt.replace(tzinfo=None) > week_ago:
                    done_recent.append(card["title"])
            except:
                pass

if done_recent:
    for title in done_recent[:10]:
        print(f"  ✅ {title}")
    if len(done_recent) > 10:
        print(f"  ... and {len(done_recent) - 10} more")
else:
    print("  (none found)")
EOF

echo ""
echo "💡 Recommendation: Compare commits vs kanban. If commits > kanban done, some work wasn't tracked!"
