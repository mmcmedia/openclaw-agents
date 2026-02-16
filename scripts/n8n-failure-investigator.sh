#!/bin/bash
# n8n Failure Investigator
# Called by cron to check for recent n8n failures and investigate them

set -e

N8N_URL="https://n8n.mmcmedia.cloud"
API_KEY=$(grep N8N_API_KEY ~/.clawdbot/.env | tail -1 | cut -d'=' -f2)
FAILURE_LOG="/Users/mmcassistant/clawd/logs/n8n-failures.json"
LAST_CHECK_FILE="/Users/mmcassistant/clawd/logs/n8n-last-check.txt"

mkdir -p /Users/mmcassistant/clawd/logs

# Get last check timestamp (or 1 hour ago if first run)
if [ -f "$LAST_CHECK_FILE" ]; then
    LAST_CHECK=$(cat "$LAST_CHECK_FILE")
else
    LAST_CHECK=$(date -u -v-1H +"%Y-%m-%dT%H:%M:%SZ")
fi

# Update last check time
date -u +"%Y-%m-%dT%H:%M:%SZ" > "$LAST_CHECK_FILE"

# Fetch recent failed executions
FAILURES=$(curl -s -X GET "${N8N_URL}/api/v1/executions?status=error&limit=20" \
    -H "X-N8N-API-KEY: ${API_KEY}")

# Count failures
FAILURE_COUNT=$(echo "$FAILURES" | jq '.data | length')

if [ "$FAILURE_COUNT" -gt 0 ]; then
    # Save failures for investigation
    echo "$FAILURES" > "$FAILURE_LOG"
    
    # Output summary for the cron job to pick up
    echo "FAILURES_FOUND: $FAILURE_COUNT"
    echo "$FAILURES" | jq -r '.data[] | "- Workflow: \(.workflowData.name // "Unknown") | Error: \(.stoppedAt) | ID: \(.id)"' | head -10
else
    echo "NO_FAILURES"
fi
