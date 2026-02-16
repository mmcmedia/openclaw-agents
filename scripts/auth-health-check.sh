#!/bin/bash
# Weekly Auth Health Check
# Runs every Sunday at 9am MT
# Tests all API endpoints and alerts on 401s

LOG_FILE="/var/log/auth-health-check.log"
ALERT_EMAIL="kinziebean@gmail.com"
DASHBOARD_URL="https://dashboard.mmcmedia.cloud"

echo "[$(date)] Starting auth health check..." >> $LOG_FILE

# Test endpoints
ENDPOINTS=(
  "/api/cards"
  "/api/activity"
  "/api/dashboard"
  "/analytics/api/sites"
)

FAILED=()

for endpoint in "${ENDPOINTS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${DASHBOARD_URL}${endpoint}")
  if [ "$STATUS" == "401" ]; then
    FAILED+=("$endpoint (401)")
    echo "[$(date)] ALERT: $endpoint returned 401" >> $LOG_FILE
  elif [ "$STATUS" == "000" ]; then
    FAILED+=("$endpoint (connection failed)")
    echo "[$(date)] ALERT: $endpoint connection failed" >> $LOG_FILE
  else
    echo "[$(date)] OK: $endpoint ($STATUS)" >> $LOG_FILE
  fi
done

# Send alert if failures
if [ ${#FAILED[@]} -gt 0 ]; then
  echo "[$(date)] Auth check FAILED: ${#FAILED[@]} endpoints" >> $LOG_FILE
  # Could send email here if mail configured
  echo "Auth issues detected: ${FAILED[*]}" | logger -t auth-health-check
else
  echo "[$(date)] Auth check PASSED" >> $LOG_FILE
fi