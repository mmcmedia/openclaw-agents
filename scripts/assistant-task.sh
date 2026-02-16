#!/bin/bash
# assistant-task.sh - Manage Kanban tasks
# Usage: 
#   ./assistant-task.sh add "Task Name" [priority]
#   ./assistant-task.sh done task-id

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ACTIVITY_LOGGER="$SCRIPT_DIR/../helpers/activity-logger.js"
DASHBOARD_DIR="$SCRIPT_DIR/../dashboard"

COMMAND="$1"

case "$COMMAND" in
  add)
    TASK_NAME="$2"
    PRIORITY="${3:-medium}"
    
    if [ -z "$TASK_NAME" ]; then
      echo "Usage: assistant-task.sh add \"Task Name\" [priority]"
      echo "Priorities: high, medium, low"
      exit 1
    fi
    
    # Generate task ID
    TASK_ID="task-$(date +%s)"
    
    # Log the action
    node "$ACTIVITY_LOGGER" log "Created task: $TASK_NAME" "task_created" "{\"taskId\":\"$TASK_ID\",\"priority\":\"$PRIORITY\"}"
    
    echo "✓ Task created: $TASK_ID"
    echo "  Name: $TASK_NAME"
    echo "  Priority: $PRIORITY"
    echo ""
    echo "To add to Kanban dashboard, use MMC_API.addCard() via browser automation"
    ;;
    
  done)
    TASK_ID="$2"
    
    if [ -z "$TASK_ID" ]; then
      echo "Usage: assistant-task.sh done task-id"
      exit 1
    fi
    
    # Log the action
    node "$ACTIVITY_LOGGER" log "Completed task: $TASK_ID" "task_completed" "{\"taskId\":\"$TASK_ID\"}"
    
    echo "✓ Task marked complete: $TASK_ID"
    echo ""
    echo "To update Kanban dashboard, use MMC_API.updateCard() via browser automation"
    ;;
    
  list)
    # Search for recent task actions
    node "$ACTIVITY_LOGGER" search "task" | grep -E "(task_created|task_completed)"
    ;;
    
  *)
    echo "Usage: assistant-task.sh <command> [args]"
    echo ""
    echo "Commands:"
    echo "  add \"Task Name\" [priority]  - Add a new task"
    echo "  done task-id                  - Mark task complete"
    echo "  list                          - List recent task actions"
    echo ""
    echo "Example:"
    echo "  assistant-task.sh add \"Research Etsy trends\" high"
    echo "  assistant-task.sh done task-1738213456"
    exit 1
    ;;
esac
