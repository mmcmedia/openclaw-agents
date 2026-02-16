#!/bin/bash
# subagent-status.sh - Show status of recent sub-agent runs
# Usage: ./subagent-status.sh

echo "📊 SUB-AGENT STATUS"
echo "==================="
echo ""

# Check spawn log
SPAWN_LOG="/Users/mmcassistant/clawd/projects/subagent-tracking/SPAWN-LOG.md"

if [ -f "$SPAWN_LOG" ]; then
    echo "📋 Recent Spawns (last 20 lines):"
    echo "---"
    tail -20 "$SPAWN_LOG"
    echo ""
else
    echo "No spawn log found at $SPAWN_LOG"
fi

# Check for any running sessions
echo ""
echo "🔄 Active Sessions:"
echo "---"
openclaw sessions list --active 2>/dev/null || echo "Could not fetch active sessions"
