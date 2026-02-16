#!/bin/bash
# Sub-Agent Watchdog
# Checks for stalled or completed sub-agents

echo "🤖 SUB-AGENT WATCHDOG - $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"

AGENT_DIR="$HOME/.clawdbot/agents"
SPAWN_LOG="/Users/mmcassistant/clawd/projects/subagent-tracking/SPAWN-LOG.md"

# Check for recent agent sessions
echo ""
echo "📊 Agent Session Activity:"

if [ -d "$AGENT_DIR" ]; then
    # Sessions active in last 15 min (actively working)
    ACTIVE_15=$(find "$AGENT_DIR" -name "*.jsonl" -mmin -15 2>/dev/null | wc -l | tr -d ' ')
    
    # Sessions active in last hour (recently active)
    ACTIVE_60=$(find "$AGENT_DIR" -name "*.jsonl" -mmin -60 2>/dev/null | wc -l | tr -d ' ')
    
    # Sessions active in last 2 hours (potentially stalled)
    ACTIVE_120=$(find "$AGENT_DIR" -name "*.jsonl" -mmin -120 2>/dev/null | wc -l | tr -d ' ')
    
    echo "   🟢 Active (last 15 min): $ACTIVE_15"
    echo "   🟡 Recent (last hour): $ACTIVE_60"
    echo "   🔴 Potentially stalled (1-2 hrs): $((ACTIVE_120 - ACTIVE_60))"
    
    # List stalled sessions
    if [ $((ACTIVE_120 - ACTIVE_60)) -gt 0 ]; then
        echo ""
        echo "⚠️  Potentially Stalled Sessions:"
        find "$AGENT_DIR" -name "*.jsonl" -mmin +60 -mmin -120 2>/dev/null | while read f; do
            echo "   - $(basename "$f") (last modified: $(stat -f "%Sm" -t "%H:%M" "$f"))"
        done
    fi
else
    echo "   ℹ️  No agent directory found at $AGENT_DIR"
fi

# Check spawn log exists
echo ""
echo "📋 Spawn Log Status:"
if [ -f "$SPAWN_LOG" ]; then
    RUNNING=$(grep -c "🔄 Running" "$SPAWN_LOG" 2>/dev/null || echo "0")
    echo "   📄 Log exists"
    echo "   🔄 $RUNNING marked as running"
else
    echo "   ⚠️  Spawn log not found"
fi

echo ""
echo "================================================"
