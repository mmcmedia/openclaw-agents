#!/bin/bash

##############################################################################
# GA4 Analytics Opportunity Scanner
# 
# Pulls traffic data from GA4 to identify revenue leaks and growth opportunities.
# Run manually or via cron job for weekly analysis.
#
# Usage: ./analytics-opportunity-scan.sh [property-id] [date-range]
# Example: ./analytics-opportunity-scan.sh 361561956 7d
#          ./analytics-opportunity-scan.sh all 30d
##############################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAWD_ROOT="$(dirname "$SCRIPT_DIR")"
SKILL_DIR="$CLAWD_ROOT/skills/ga4-analytics"
MEMORY_DIR="$CLAWD_ROOT/memory"
CRED_DIR="$HOME/.clawdbot/credentials"

# Default parameters
PROPERTY_ID="${1:-all}"
DATE_RANGE="${2:-30d}"
TIMESTAMP=$(date +"%Y-%m-%d")
OUTPUT_FILE="$MEMORY_DIR/analytics-scan-$TIMESTAMP.md"

# GA4 Properties Mapping (from TOOLS.md)
declare -A GA4_PROPERTIES=(
  [hello-hayley]="361561956"
  [living-tickled]="123050578"
  [moms-make-cents]="78739217"
  [ny-melrose-family]="135356969"
  [polish-and-patterns]="339055070"
  [savor-sprinkle]="345099105"
  [styled-locks]="345134016"
  [makeup-mood]="345120787"
  [sourdough-sisters]="345114522"
  [today-mommy]="120602427"
  [we-heart-cozy]="339062516"
  [we-heart-decorating]="339035002"
  [we-heart-desserts]="339035003"
  [we-heart-hairstyles]="339054749"
  [we-heart-makeup]="339058789"
  [we-heart-nails]="339062354"
  [we-love-decorating]="339050294"
  [weheartthis]="6230700"
)

# Key properties to always scan
KEY_PROPERTIES=(
  "hello-hayley"
  "moms-make-cents"
  "weheartthis"
  "we-heart-cozy"
)

echo "🔍 GA4 Analytics Opportunity Scanner"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Date Range: $DATE_RANGE"
echo "Output: $OUTPUT_FILE"
echo ""

# Verify credentials exist
if [[ ! -f "$CRED_DIR/ga4-oauth.json" ]] || [[ ! -f "$CRED_DIR/ga4-tokens.json" ]]; then
  echo "❌ ERROR: GA4 credentials not found at $CRED_DIR"
  echo "   Expected: ga4-oauth.json and ga4-tokens.json"
  exit 1
fi

# Refresh tokens before running
echo "🔄 Refreshing GA4 tokens..."
cd "$SKILL_DIR/scripts"
node refresh-tokens.mjs > /dev/null 2>&1 || {
  echo "⚠️  Token refresh failed - attempting anyway..."
}

# Initialize output file
cat > "$OUTPUT_FILE" << 'EOF'
# GA4 Analytics Opportunity Scan

EOF

echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "Date Range: $DATE_RANGE" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Determine which properties to scan
if [[ "$PROPERTY_ID" == "all" ]]; then
  PROPERTIES_TO_SCAN=("${KEY_PROPERTIES[@]}")
  echo "📊 Scanning ${#PROPERTIES_TO_SCAN[@]} key properties..."
else
  # Map property ID to name or use as ID
  PROPERTIES_TO_SCAN=()
  if [[ -v GA4_PROPERTIES["$PROPERTY_ID"] ]]; then
    PROPERTIES_TO_SCAN=("$PROPERTY_ID")
  else
    # Assume it's a property ID
    PROPERTIES_TO_SCAN=("$PROPERTY_ID")
  fi
  echo "📊 Scanning: ${PROPERTIES_TO_SCAN[@]}"
fi

# Create scanning summary
echo "" >> "$OUTPUT_FILE"
echo "## Scanned Properties" >> "$OUTPUT_FILE"
for prop in "${PROPERTIES_TO_SCAN[@]}"; do
  PID=${GA4_PROPERTIES[$prop]:-$prop}
  echo "- $prop (Property: $PID)" >> "$OUTPUT_FILE"
done
echo "" >> "$OUTPUT_FILE"

# Scan each property
for prop in "${PROPERTIES_TO_SCAN[@]}"; do
  PID=${GA4_PROPERTIES[$prop]:-$prop}
  
  echo ""
  echo "📈 Analyzing: $prop (Property: $PID)"
  echo "" >> "$OUTPUT_FILE"
  echo "## $prop" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  # Create temporary Node.js script to pull data
  TEMP_SCRIPT=$(mktemp)
  cat > "$TEMP_SCRIPT" << NODEJS_SCRIPT
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const credDir = join(homedir(), '.clawdbot', 'credentials');
const oauth = JSON.parse(readFileSync(join(credDir, 'ga4-oauth.json'), 'utf-8'));
const tokens = JSON.parse(readFileSync(join(credDir, 'ga4-tokens.json'), 'utf-8'));

const installed = oauth.installed || oauth.web || oauth;
const auth = new google.auth.OAuth2(
  installed.client_id,
  installed.client_secret,
  'http://localhost'
);

auth.setCredentials({
  access_token: tokens.access_token,
  refresh_token: tokens.refresh_token,
  expiry_date: tokens.expiry_date,
});

const client = new BetaAnalyticsDataClient({ authClient: auth });

try {
  // Get top pages by pageviews
  const [response] = await client.runReport({
    property: 'properties/$PID',
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'engagementRate' }
    ],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, descending: true }],
    limit: 20
  });

  console.log('TOP_PAGES:');
  response.rows?.forEach((row, i) => {
    const path = row.dimensionValues[0].value;
    const title = row.dimensionValues[1].value;
    const views = row.metricValues[0].value;
    const users = row.metricValues[1].value;
    const duration = row.metricValues[2].value;
    const bounce = row.metricValues[3].value;
    const engagement = row.metricValues[4].value;
    
    console.log(\`\${i+1}|\${path}|\${title}|\${views}|\${users}|\${duration}|\${bounce}|\${engagement}\`);
  });

  // Get traffic sources
  const [sourceResp] = await client.runReport({
    property: 'properties/$PID',
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'bounceRate' }
    ],
    dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
    orderBys: [{ metric: { metricName: 'sessions' }, descending: true }],
    limit: 10
  });

  console.log('TRAFFIC_SOURCES:');
  sourceResp.rows?.forEach((row) => {
    const source = row.dimensionValues[0].value;
    const medium = row.dimensionValues[1].value;
    const sessions = row.metricValues[0].value;
    const users = row.metricValues[1].value;
    const bounce = row.metricValues[2].value;
    
    console.log(\`\${source}|\${medium}|\${sessions}|\${users}|\${bounce}\`);
  });

} catch (err) {
  console.error('ERROR:', err.message);
  process.exit(1);
}
NODEJS_SCRIPT

  # Run the Node script and capture output
  OUTPUT=$(cd "$SKILL_DIR/scripts" && node "$TEMP_SCRIPT" 2>&1 || echo "FAILED")
  rm "$TEMP_SCRIPT"

  if [[ "$OUTPUT" == *"ERROR"* ]]; then
    echo "⚠️  Failed to fetch data for $prop"
    echo "### Top Pages (data fetch failed)" >> "$OUTPUT_FILE"
    echo "- See error logs for details" >> "$OUTPUT_FILE"
  else
    # Parse and format output
    echo "### Top 20 Pages by Views" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "| # | Page | Title | Views | Users | Avg Duration | Bounce % | Engagement % |" >> "$OUTPUT_FILE"
    echo "|---|------|-------|-------|-------|--------------|----------|--------------|" >> "$OUTPUT_FILE"
    
    while IFS='|' read -r marker path title views users duration bounce engagement; do
      if [[ "$marker" == "TOP_PAGES:" ]]; then continue; fi
      if [[ "$marker" == "TRAFFIC_SOURCES:" ]]; then break; fi
      if [[ -z "$marker" ]]; then continue; fi
      printf "| %s | \`%s\` | %s | %s | %s | %s | %s | %s |\n" \
        "$marker" "$path" "$title" "$views" "$users" "$duration" "$bounce" "$engagement" >> "$OUTPUT_FILE"
    done <<< "$OUTPUT"
    
    echo "" >> "$OUTPUT_FILE"
    echo "### Traffic Sources" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    echo "| Source | Medium | Sessions | Users | Bounce % |" >> "$OUTPUT_FILE"
    echo "|--------|--------|----------|-------|----------|" >> "$OUTPUT_FILE"
    
    in_sources=0
    while IFS='|' read -r marker rest; do
      if [[ "$marker" == "TRAFFIC_SOURCES:" ]]; then
        in_sources=1
        continue
      fi
      if [[ $in_sources -eq 1 ]] && [[ ! -z "$marker" ]]; then
        IFS='|' read -r source medium sessions users bounce <<< "$marker|$rest"
        printf "| %s | %s | %s | %s | %s |\n" "$source" "$medium" "$sessions" "$users" "$bounce" >> "$OUTPUT_FILE"
      fi
    done <<< "$OUTPUT"
  fi

  echo "✅ Processed: $prop"
done

echo "" >> "$OUTPUT_FILE"
echo "## Next Steps" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "This scan should trigger a detailed analysis prompt for Maria." >> "$OUTPUT_FILE"
echo "See: \`analytics-scan-prompt.md\` for the complete analysis checklist." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "---" >> "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Scan complete!"
echo "📄 Report saved: $OUTPUT_FILE"
echo ""
echo "Next: Run the detailed analysis prompt:"
echo "   cat $CLAWD_ROOT/scripts/analytics-scan-prompt.md"
