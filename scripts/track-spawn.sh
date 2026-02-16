#!/bin/bash
# Sub-Agent Spawn Tracker
# Usage: ./track-spawn.sh <label> <agent> <task-summary>

LABEL=${1:-"unnamed"}
AGENT=${2:-"unknown"}
TASK=${3:-"no description"}
TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
LOG_FILE="/Users/mmcassistant/clawd/projects/subagent-tracking/SPAWN-LOG.md"

# Add entry to log
echo "| $TIMESTAMP | $LABEL | $AGENT | SPAWNED | - | $TASK |" >> "$LOG_FILE"

echo "✅ Spawn logged: $LABEL"
echo "📁 Log: $LOG_FILE"
