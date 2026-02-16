#!/bin/bash
# collect-results.sh — Pull agent work products from VPS to local
# Usage: ./collect-results.sh [agent]
# Without args: collects from all agents

set -e

VPS="root@76.13.108.6"
LOCAL_DIR="/Users/mmcassistant/clawd/projects/agent-results"
TIMESTAMP=$(date '+%Y-%m-%d')

mkdir -p "$LOCAL_DIR"

collect_agent() {
  local agent=$1
  local vps_dir=$2
  local local_dest="$LOCAL_DIR/$agent/$TIMESTAMP"
  
  mkdir -p "$local_dest"
  
  # Check for new files modified in last 24 hours
  FILES=$(ssh "$VPS" "find $vps_dir -maxdepth 2 -type f -mtime -1 -name '*.md' -o -name '*.html' -o -name '*.json' -o -name '*.jsx' -o -name '*.txt' 2>/dev/null" || echo "")
  
  if [ -z "$FILES" ]; then
    echo "  $agent: No new files"
    return
  fi
  
  COUNT=$(echo "$FILES" | wc -l | tr -d ' ')
  echo "  $agent: $COUNT new files found"
  
  # Copy them
  echo "$FILES" | while read -r f; do
    scp "$VPS:$f" "$local_dest/" 2>/dev/null || true
  done
  
  echo "  → Saved to $local_dest/"
}

echo "📥 Collecting agent results ($TIMESTAMP)"
echo ""

if [ -n "$1" ]; then
  case "$1" in
    sage)  collect_agent "sage" "/home/openclaw/team/content-seo" ;;
    scout) collect_agent "scout" "/home/openclaw/team/etsy-director" ;;
    dev)   collect_agent "dev" "/home/openclaw/team/webdev" ;;
    pixel) collect_agent "pixel" "/home/openclaw/team/designer" ;;
    milo)  collect_agent "milo" "/home/openclaw/team/psalmix" ;;
    ally)  collect_agent "ally" "/home/openclaw/team/dhanielle" ;;
    *) echo "Unknown agent: $1"; exit 1 ;;
  esac
else
  collect_agent "sage" "/home/openclaw/team/content-seo"
  collect_agent "scout" "/home/openclaw/team/etsy-director"
  collect_agent "dev" "/home/openclaw/team/webdev"
  collect_agent "pixel" "/home/openclaw/team/designer"
  collect_agent "milo" "/home/openclaw/team/psalmix"
  collect_agent "ally" "/home/openclaw/team/dhanielle"
fi

echo ""
echo "✅ Collection complete!"
