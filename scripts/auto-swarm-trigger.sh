#!/bin/bash
# Auto-Swarm Trigger System
# Automatically triggers swarm workflows based on business events
# 
# Add to cron: */30 * * * * /Users/mmcassistant/clawd/scripts/auto-swarm-trigger.sh

REPO_ROOT="/Users/mmcassistant/clawd"
LOG_FILE="$REPO_ROOT/projects/swarm-workflows/auto-trigger.log"

echo "🐝 Auto-Swarm Trigger - $(date)" >> "$LOG_FILE"

# Check for business triggers and auto-start swarms

# Trigger 1: Etsy seasonal opportunities
if [ -f "$REPO_ROOT/inbox/etsy-opportunity" ]; then
    PRODUCT=$(cat "$REPO_ROOT/inbox/etsy-opportunity")
    echo "Triggering Etsy swarm for: $PRODUCT" >> "$LOG_FILE"
    
    cd "$REPO_ROOT"
    node scripts/swarm-orchestrator.mjs etsy-product-launch \
        product="$PRODUCT" \
        >> "$LOG_FILE" 2>&1 &
    
    rm "$REPO_ROOT/inbox/etsy-opportunity"
    echo "✅ Swarm started in background" >> "$LOG_FILE"
fi

# Trigger 2: Content calendar gaps
if [ -f "$REPO_ROOT/inbox/content-topic" ]; then
    TOPIC=$(cat "$REPO_ROOT/inbox/content-topic")
    SITE=$(cat "$REPO_ROOT/inbox/content-site" 2>/dev/null || echo "Hello Hayley")
    
    echo "Triggering content swarm for: $TOPIC" >> "$LOG_FILE"
    
    cd "$REPO_ROOT"
    node scripts/swarm-orchestrator.mjs content-pipeline \
        topic="$TOPIC" \
        site="$SITE" \
        >> "$LOG_FILE" 2>&1 &
    
    rm -f "$REPO_ROOT/inbox/content-topic" "$REPO_ROOT/inbox/content-site"
    echo "✅ Content swarm started" >> "$LOG_FILE"
fi

# Trigger 3: Analytics anomalies (detected by daily scan)
if [ -f "$REPO_ROOT/inbox/analytics-investigation" ]; then
    SITE=$(cat "$REPO_ROOT/inbox/analytics-investigation")
    
    echo "Triggering analytics swarm for: $SITE" >> "$LOG_FILE"
    
    cd "$REPO_ROOT"
    node scripts/swarm-orchestrator.mjs analytics-deep-dive \
        site="$SITE" \
        >> "$LOG_FILE" 2>&1 &
    
    rm "$REPO_ROOT/inbox/analytics-investigation"
    echo "✅ Analytics swarm started" >> "$LOG_FILE"
fi

echo "Done." >> "$LOG_FILE"
