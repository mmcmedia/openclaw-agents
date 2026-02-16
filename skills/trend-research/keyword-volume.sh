#!/bin/bash
# keyword-volume.sh — Get search volume, CPC, competition & trends from Keywords Everywhere
# Usage: ./keyword-volume.sh "keyword1" "keyword2" "keyword3" ...
# Requires: KEYWORDS_EVERYWHERE_API_KEY in ~/.clawdbot/.env

set -e

# Load API key
KE_KEY=$(grep KEYWORDS_EVERYWHERE_API_KEY ~/.clawdbot/.env 2>/dev/null | head -1 | sed 's/.*=//' | tr -d '"' | tr -d "'" | tr -d ' ')

if [ -z "$KE_KEY" ]; then
  echo "ERROR: KEYWORDS_EVERYWHERE_API_KEY not found in ~/.clawdbot/.env"
  exit 1
fi

if [ $# -eq 0 ]; then
  echo "Usage: $0 \"keyword1\" \"keyword2\" \"keyword3\" ..."
  echo "Returns: search volume, CPC, competition, 12-month trend for each keyword"
  exit 1
fi

# Build keyword params
KW_PARAMS=""
for kw in "$@"; do
  KW_PARAMS="${KW_PARAMS}&kw[]=${kw}"
done

# Call API
RESPONSE=$(curl -s --max-time 15 -X POST 'https://api.keywordseverywhere.com/v1/get_keyword_data' \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $KE_KEY" \
  -d "country=us&currency=usd&dataSource=gkp${KW_PARAMS}")

# Pretty print results
echo "$RESPONSE" | python3 -c "
import json, sys
try:
    data = json.load(sys.stdin)
    if 'data' in data:
        items = data['data']
    elif isinstance(data, list):
        items = data
    else:
        print(json.dumps(data, indent=2))
        sys.exit(0)
    
    print(f'Keywords analyzed: {len(items)}')
    print('=' * 80)
    for item in items:
        kw = item.get('keyword', '?')
        vol = item.get('vol', 0)
        cpc = item.get('cpc', {}).get('value', '0')
        comp = item.get('competition', 0)
        trend = item.get('trend', [])
        
        # Trend summary (last 3 months)
        recent = trend[-3:] if trend else []
        trend_str = ' → '.join([f\"{t['month'][:3]}: {t['value']:,}\" for t in recent]) if recent else 'N/A'
        
        # Trend direction
        if len(trend) >= 2:
            first_half = sum(t['value'] for t in trend[:6]) / max(len(trend[:6]), 1)
            second_half = sum(t['value'] for t in trend[6:]) / max(len(trend[6:]), 1)
            direction = '📈 RISING' if second_half > first_half * 1.1 else ('📉 FALLING' if second_half < first_half * 0.9 else '➡️ STABLE')
        else:
            direction = '❓'
        
        print(f'🔑 {kw}')
        print(f'   Volume: {vol:,}/mo | CPC: \${cpc} | Competition: {comp:.2f} | {direction}')
        print(f'   Recent: {trend_str}')
        print()
except Exception as e:
    print(f'Error parsing: {e}')
    print(sys.stdin.read() if hasattr(sys.stdin, 'read') else '')
"
