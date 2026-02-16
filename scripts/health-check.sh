#!/bin/bash
# Maria's Health Check Script
# Run anytime to diagnose system status

echo "🏥 MARIA HEALTH CHECK - $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================"

# Track failures
FAILURES=0

# 1. Check if Clawdbot gateway is running
echo ""
echo "📡 Gateway Status:"
if pgrep -f "clawdbot" > /dev/null 2>&1; then
    echo "   ✅ Clawdbot process running"
else
    echo "   ❌ Clawdbot NOT running!"
    FAILURES=$((FAILURES + 1))
fi

# 2. Check for zombie processes
echo ""
echo "🧟 Zombie Process Check:"
ZOMBIES=$(ps aux | grep -E "(clawdbot|node|next)" | grep -v grep | awk '{if($8=="Z") print $0}' | wc -l | tr -d ' ')
if [ "$ZOMBIES" -eq 0 ]; then
    echo "   ✅ No zombie processes"
else
    echo "   ❌ Found $ZOMBIES zombie processes!"
    FAILURES=$((FAILURES + 1))
fi

# 3. Check for stuck onboard processes
echo ""
echo "🔄 Onboard Process Check:"
STUCK_ONBOARD=$(ps aux | grep "clawdbot-onboard" | grep -v grep | wc -l | tr -d ' ')
if [ "$STUCK_ONBOARD" -eq 0 ]; then
    echo "   ✅ No stuck onboard processes"
else
    echo "   ⚠️  Found $STUCK_ONBOARD onboard processes running"
    ps aux | grep "clawdbot-onboard" | grep -v grep | awk '{print "      PID: "$2" Runtime: "$10}'
fi

# 4. Check disk space
echo ""
echo "💾 Disk Space:"
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | tr -d '%')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo "   ✅ Disk at ${DISK_USAGE}% (healthy)"
elif [ "$DISK_USAGE" -lt 90 ]; then
    echo "   ⚠️  Disk at ${DISK_USAGE}% (warning)"
else
    echo "   ❌ Disk at ${DISK_USAGE}% (critical!)"
    FAILURES=$((FAILURES + 1))
fi

# 5. Check clawd workspace
echo ""
echo "📁 Workspace Check:"
if [ -d "/Users/mmcassistant/clawd" ]; then
    echo "   ✅ Workspace exists"
    FILE_COUNT=$(find /Users/mmcassistant/clawd -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "   📊 $FILE_COUNT files in workspace"
else
    echo "   ❌ Workspace missing!"
    FAILURES=$((FAILURES + 1))
fi

# 6. Check key files exist
echo ""
echo "📄 Critical Files:"
for file in "SESSION_STATE.md" "AGENTS.md" "PINNED.md" "MEMORY.md" "dashboard/data/cards.json"; do
    if [ -f "/Users/mmcassistant/clawd/$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file MISSING!"
        FAILURES=$((FAILURES + 1))
    fi
done

# 7. Check memory file sizes (truncation risk)
echo ""
echo "📏 Memory File Sizes (>15K = warning, >20K = truncated):"
for file in "AGENTS.md" "LESSONS_LEARNED.md" "MEMORY.md" "PINNED.md"; do
    if [ -f "/Users/mmcassistant/clawd/$file" ]; then
        SIZE=$(wc -c < "/Users/mmcassistant/clawd/$file" | tr -d ' ')
        SIZE_K=$((SIZE / 1000))
        if [ "$SIZE" -gt 20000 ]; then
            echo "   ❌ $file: ${SIZE_K}K chars (TRUNCATED!)"
            FAILURES=$((FAILURES + 1))
        elif [ "$SIZE" -gt 15000 ]; then
            echo "   ⚠️  $file: ${SIZE_K}K chars (close to limit)"
        else
            echo "   ✅ $file: ${SIZE_K}K chars"
        fi
    fi
done

# 8. Check for recent git commits
echo ""
echo "📝 Git Status:"
cd /Users/mmcassistant/clawd
UNCOMMITTED=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNCOMMITTED" -eq 0 ]; then
    echo "   ✅ Working tree clean"
else
    echo "   📌 $UNCOMMITTED uncommitted changes"
fi
LAST_COMMIT=$(git log -1 --format="%ar" 2>/dev/null)
echo "   🕐 Last commit: $LAST_COMMIT"

# 9. Check active sub-agents (look for agent session files)
echo ""
echo "🤖 Sub-Agent Sessions:"
AGENT_DIR="$HOME/.clawdbot/agents"
if [ -d "$AGENT_DIR" ]; then
    RECENT_AGENTS=$(find "$AGENT_DIR" -name "*.jsonl" -mmin -60 2>/dev/null | wc -l | tr -d ' ')
    echo "   📊 $RECENT_AGENTS sessions active in last hour"
else
    echo "   ℹ️  No agent session directory found"
fi

# 10. Summary
echo ""
echo "================================================"
if [ "$FAILURES" -eq 0 ]; then
    echo "✅ HEALTH CHECK PASSED - All systems go!"
else
    echo "❌ HEALTH CHECK FAILED - $FAILURES issue(s) found!"
fi
echo "================================================"

exit $FAILURES
