# Daily Briefing Skill

Generate a comprehensive daily briefing with REAL data from McKinzie's business sources.

## Purpose
Replace generic morning briefings with actual revenue, traffic, and performance data. No fluff - just actionable intel.

## Data Sources

### 1. Ad Revenue (Mediavine)
- Yesterday's earnings across 5 sites
- MTD totals and trends
- RPM changes
- Source: Browser automation of Mediavine dashboard

### 2. Traffic (GA4)
- Yesterday's sessions by site
- Week-over-week trends
- Top performing pages
- Source: GA4 Analytics skill (`/skills/ga4-analytics/`)

### 3. Etsy Sales
- Yesterday's orders and revenue
- Shop-by-shop breakdown
- Source: Browser automation or Etsy API

### 4. Social Performance (GetLate)
- FB Bonus estimates (views → revenue)
- Top performing posts
- Source: GetLate API

### 5. Weather
- Today's forecast
- Source: Weather skill

### 6. Tasks/Calendar
- Today's priorities from kanban
- Any scheduled meetings
- Source: Kanban cards.json

## Output Format

```
☀️ DAILY BRIEFING - [Date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 REVENUE SNAPSHOT
├─ Mediavine Yesterday: $XXX
├─ Mediavine MTD: $X,XXX
├─ Etsy Yesterday: $XXX
└─ Est. FB Bonus: $XXX

📊 TRAFFIC HIGHLIGHTS
├─ Total Sessions: XX,XXX
├─ Top Site: [site] (X,XXX)
└─ Trend: ↑/↓ X% vs last week

🏆 WINS
└─ [Notable achievements from yesterday]

⚠️ ATTENTION NEEDED
└─ [Any issues or drops requiring attention]

🎯 TODAY'S PRIORITIES
├─ 1. [Top priority]
├─ 2. [Second priority]
└─ 3. [Third priority]

🌤️ Weather: [forecast summary]
```

## Usage

Run this skill during morning briefing cron (9:30am MT) or on-demand.

```
Generate my daily briefing with real data
```

## Scripts

### `scripts/fetch-mediavine.js`
Fetches Mediavine data via browser automation.

### `scripts/fetch-ga4.js`  
Pulls GA4 data using the ga4-analytics skill.

### `scripts/fetch-etsy.js`
Gets Etsy sales data.

### `scripts/compile-briefing.js`
Combines all data sources into formatted output.

## Configuration

Store API keys and credentials in `~/.clawdbot/.env`:
- `GETLATE_API_KEY` - Already configured ✅
- GA4 OAuth tokens at `~/.clawdbot/credentials/ga4-tokens.json` ✅

## Cron Integration

The morning-briefing cron (9:30am MT) should call this skill instead of generic weather/news.

## Notes

- Mediavine data may be delayed by a day (normal)
- Etsy real-time data requires browser session
- FB Bonus is estimated from views (actual payout monthly)
