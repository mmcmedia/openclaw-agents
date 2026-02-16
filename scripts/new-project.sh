#!/bin/bash
# New Project Template Generator
# Usage: ./new-project.sh <project-name> <category> [priority]
# Example: ./new-project.sh my-new-app Tech high

PROJECT_NAME="$1"
CATEGORY="${2:-Tech}"
PRIORITY="${3:-medium}"
PROJECT_DIR="/Users/mmcassistant/clawd/projects/$PROJECT_NAME"
CARDS_FILE="/Users/mmcassistant/clawd/dashboard/data/cards.json"

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Usage: ./new-project.sh <project-name> <category> [priority]"
    echo "   Categories: Tech, Etsy, Content, Operations, Strategy, Social"
    echo "   Priorities: high, medium, low"
    exit 1
fi

# Check if project already exists
if [ -d "$PROJECT_DIR" ]; then
    echo "❌ Project '$PROJECT_NAME' already exists at $PROJECT_DIR"
    exit 1
fi

echo "🚀 Creating new project: $PROJECT_NAME"
echo "   Category: $CATEGORY"
echo "   Priority: $PRIORITY"
echo ""

# Create project directory structure
mkdir -p "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR/docs"
mkdir -p "$PROJECT_DIR/assets"

# Create README
cat > "$PROJECT_DIR/README.md" << EOF
# $PROJECT_NAME

**Created:** $(date '+%Y-%m-%d')
**Category:** $CATEGORY
**Priority:** $PRIORITY
**Status:** 🆕 New

---

## Overview

*Describe what this project is about...*

---

## Goals

- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

---

## Files

| File | Purpose |
|------|---------|
| README.md | This file |
| docs/ | Documentation |
| assets/ | Project assets |

---

## Progress Log

### $(date '+%Y-%m-%d')
- Project created

---

## Notes

*Add notes here...*
EOF

# Create STATUS.md for tracking
cat > "$PROJECT_DIR/STATUS.md" << EOF
# $PROJECT_NAME - Status Tracker

**Last Updated:** $(date '+%Y-%m-%d %H:%M')

## Current Phase
🆕 **New** - Just started

## Blockers
- None yet

## Next Actions
1. Define scope
2. Break into tasks
3. Start building

## Dependencies
- None identified yet
EOF

echo "✅ Created project structure:"
echo "   $PROJECT_DIR/"
echo "   ├── README.md"
echo "   ├── STATUS.md"
echo "   ├── docs/"
echo "   └── assets/"

# Generate kanban card ID
CARD_ID="card-$(date '+%Y%m%d%H%M%S')"

echo ""
echo "📋 Kanban Card to add (copy to cards.json):"
echo ""
cat << EOF
{
  "id": "$CARD_ID",
  "title": "$PROJECT_NAME",
  "description": "New project - needs scope definition.",
  "column": "backlog",
  "priority": "$PRIORITY",
  "category": "$CATEGORY",
  "assignee": "Maria",
  "tags": ["new-project"],
  "createdAt": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
  "updatedAt": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
}
EOF

echo ""
echo "✅ Project '$PROJECT_NAME' created successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Update README.md with project details"
echo "   2. Add kanban card to dashboard"
echo "   3. Update ACTIVE_PROJECTS.md"
