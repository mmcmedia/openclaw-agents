#!/bin/bash
# Tomorrow's To-Do, Today
# Runs at 1am to predict tomorrow's priorities and pre-do what's possible

OUTPUT="$HOME/clawd/TOMORROWS-TODO.md"
SESSION_STATE="$HOME/clawd/SESSION_STATE.md"
KANBAN="$HOME/clawd/dashboard/data/cards.json"
DATE_TOMORROW=$(date -v+1d +%Y-%m-%d)
DATE_TODAY=$(date +%Y-%m-%d)

cat > "$OUTPUT" << EOF
# 🌅 Tomorrow's To-Do (Pre-Done)
**Generated:** $(date '+%B %d, %Y at %I:%M %p')
**For:** $DATE_TOMORROW

---

## 🎯 Predicted Priorities

Based on current session state and kanban:

EOF

# Extract current focus from SESSION_STATE.md
if [ -f "$SESSION_STATE" ]; then
    echo "### From Session State:" >> "$OUTPUT"
    grep -A 5 "Current Focus\|PRIORITY\|ACTIVE" "$SESSION_STATE" | head -20 >> "$OUTPUT"
    echo "" >> "$OUTPUT"
fi

# Extract pending kanban items
if [ -f "$KANBAN" ]; then
    echo "### Pending Kanban Items:" >> "$OUTPUT"
    cat "$KANBAN" | jq -r '.cards[] | select(.status == "todo") | "- [ ] \(.title) (\(.priority // "normal"))"' 2>/dev/null >> "$OUTPUT"
    echo "" >> "$OUTPUT"
fi

cat >> "$OUTPUT" << EOF

---

## ✅ Pre-Done Work

*Items I completed overnight so you don't have to:*

EOF

echo "📋 Tomorrow's To-Do template generated at $OUTPUT"
