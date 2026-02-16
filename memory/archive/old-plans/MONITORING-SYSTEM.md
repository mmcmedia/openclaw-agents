# Maria's Automated Monitoring System

*Last Updated: January 30, 2026*

## Overview

This document describes the automated monitoring, alerting, and "Chief of Staff" workflow that runs in the background to proactively manage McKinzie's business.

**Philosophy:** Data comes to YOU when it matters. No need to check dashboards constantly.

---

## Active Monitoring Jobs

### 📊 Data Collection

| Job | Schedule | Purpose |
|-----|----------|---------|
| `mediavine-daily-sync` | 6:00 AM daily | Download CSV data from Mediavine for all 5 sites |

### 🚨 Alert & Analysis

| Job | Schedule | Purpose |
|-----|----------|---------|
| `content-traffic-monitor` | 9:00 AM daily | Detect >15% traffic drops, search for platform issues, spawn specialist for analysis |
| `etsy-ad-monitor` | 1st of month, 9 AM | Analyze Etsy shop ROAS, flag problem shops, spawn etsy-expert |
| `etsy-test-phase-review` | March 3, 2026 | Re-evaluate shops that were in testing mode |

### 📋 Briefings & Reviews

| Job | Schedule | Purpose |
|-----|----------|---------|
| `morning-briefing` | 9:30 AM daily | Weather, news, today's tasks, quick win |
| `evening-brief` | 9:30 PM daily | Day's wins, what Maria did, tomorrow's top 3 |
| `weekly-project-review` | Sunday 9 PM | Project status, stalled items, recommendations |
| `nightly-proactive-work` | 1:00 AM daily | Autonomous overnight work while McKinzie sleeps |

### 🔔 One-Time Reminders

| Job | Date | Purpose |
|-----|------|---------|
| `etsy-sale-reminder-feb4` | Feb 4, 2026 | Remind to set up next week's Etsy sales |
| `security-rule-reminder-jan31` | Jan 31, 2026 | Add email rule to SECURITY.md |

---

## Chief of Staff Workflow

When monitoring detects an issue:

```
1. DETECT → Automated job finds anomaly (traffic drop, ROAS issue, etc.)

2. RESEARCH → Maria spawns appropriate specialist:
   - Pinterest issues → pinterest-strategist skill
   - Google/SEO issues → seo-specialist skill
   - Etsy issues → etsy-expert skill
   - Also searches for platform-wide issues (algorithm updates, outages)

3. BRIEF → Maria compiles findings into executive summary:
   - What happened (1-2 sentences)
   - Why (specialist analysis + external context)
   - Recommended actions (specific, actionable)
   - Estimated effort/impact

4. PRESENT → Send brief to McKinzie via Telegram with buttons:
   [Approve] [Modify] [Ignore]

5. EXECUTE → Based on McKinzie's response:
   - Approve: Execute plan (where possible) or confirm she'll do it
   - Modify: Ask what to change, revise plan
   - Ignore: Log and move on
   - No response 24h: Ping once, then shelve

6. REPORT → Confirm completion and results
```

---

## What Maria CAN Execute

✅ Content research and recommendations
✅ Pinterest pin creation/strategy
✅ Dashboard updates and reports
✅ Web searches and analysis
✅ Document creation
✅ Email drafts (with approval)
✅ Scheduling and reminders

## What Requires McKinzie's Action

⚠️ Etsy ad changes (no API access)
⚠️ Publishing content live
⚠️ Financial decisions
⚠️ Anything involving external accounts Maria can't access

---

## Thresholds & Rules

### Traffic Alerts
- **Alert if:** Any site drops >15% week-over-week
- **Always check:** Platform-wide issues before blaming the site

### Etsy ROAS
- 🔴 CRITICAL: ROAS < 1.0 (losing money per sale)
- 🟡 WARNING: ROAS 1.0-1.5 (barely breaking even)
- 🟢 HEALTHY: ROAS > 1.5

### When NOT to Alert
- Late night (11pm-8am) unless truly urgent
- Shops in known "testing mode"
- Normal seasonal variations
- Issues already being addressed

---

## Files & Locations

- **Mediavine data:** `/projects/analytics-dashboard/backend/data/mediavine.json`
- **Etsy data:** `/projects/analytics-dashboard/backend/data/etsy.json`
- **Social data:** Via GetLate API
- **Dashboard:** `http://localhost:5180`
- **Mediavine SOP:** `/projects/analytics-dashboard/SOP-MEDIAVINE-DATA-SYNC.md`

---

## Adding New Monitors

To add a new monitoring job:

1. Identify what to monitor and threshold for alerts
2. Create cron job with clear instructions
3. Specify which specialist skill to spawn (if any)
4. Define the brief format
5. Document in this file

---

*This system is designed to make McKinzie the CEO who approves strategy, not the analyst digging through data.*
