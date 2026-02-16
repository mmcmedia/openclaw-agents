# Cron Self-Optimization Audit Report

**Generated:** 2026-02-07 10:55:09
**Auditor:** Maria (OpenClaw Agent)

---

## Current Active Cron Jobs

Based on TOOLS.md records:

| Cron Name | Schedule | Purpose | Status |
|-----------|----------|---------|--------|
| morning-briefing | 9:30am MT daily | Weather, news, tasks for morning | DOCUMENTED |
| evening-brief | 9:30pm MT daily | Daily wins, summary, tomorrow plan | DOCUMENTED |
| nightly-proactive-work | 11pm MT daily | Autonomous overnight work driver | DOCUMENTED |
| weekly-project-review | 9pm MT Sunday | Project status check weekly | DOCUMENTED |

---

## Audit Findings

### What We Know (from files)
- **4 documented crons** in TOOLS.md
- **Additional specialized crons** created for specific workflows:
  - mediavine-daily-sync (data syncing)
  - dashboard-morning-email (briefing delivery)
  - nightly-thesundaisy-pipeline (content automation)
  - seasonal-calendar (bi-weekly, 1st & 15th)
  - etsy-review-monitor (availability/price tracking)
  - backlog-weekly-review (Friday 2pm, idea scoring)
  - decisions-revisit (Monday 9am, decision check)
  - n8n-failure-investigator (every 30 min, workflow health)

### Checking Cron Health

**Method:** Review session state, memory, and job output logs
- `SESSION_STATE.md` — Current focus; tells us what's top priority
- `memory/YYYY-MM-DD.md` — Daily logs; shows which crons fired successfully
- `/projects/*/logs/` — Any available job output logs

### Stale/Questionable Crons
*To be filled: Check which crons have NOT fired recently*

### Missing Crons (Manual Work That Could Automate)
*To be filled: Review recent daily logs for manual tasks that repeat*

### Value Rating (High/Medium/Low)

**HIGH VALUE** (Keep, maybe increase frequency):
- morning-briefing — Essential for daily context
- nightly-proactive-work — Core autonomous capability
- mediavine-daily-sync — Revenue data freshness
- n8n-failure-investigator — System health sentinel

**MEDIUM VALUE** (Keep but monitor):
- evening-brief — Nice-to-have, could consolidate with morning
- weekly-project-review — Strategic but can skip if pressing work exists
- seasonal-calendar — Prevents planning gaps, low effort
- decisions-revisit — Ensures past decisions don't drift

**LOW VALUE / REDUNDANT** (Consider removing):
*To be filled: Any crons that duplicate effort or aren't firing*

---

## Recommendations

1. **Add a weekly self-optimization cron** (THIS ONE)
   - Schedule: Monday 9am MT (before work week)
   - Purpose: Run this audit, detect stale crons, identify gaps
   - Effort: ~5 minutes for Maria to review + approve changes

2. **Consolidate briefing redundancy** (if applicable)
   - Morning and evening briefs may contain overlap
   - Recommend: Review delivery timing vs. McKinzie's actual usage

3. **Formalize cron log checking**
   - Keep a simple `/logs/cron-results.json` with timestamps
   - Each cron appends success/failure when it runs
   - Makes audit detection automated vs. manual hunting

4. **Document OpenClaw Cron API format** (placeholder)
   - Expected: OpenClaw cron API would return job list with:
     - Cron ID, Schedule (cron syntax), Last Run, Last Status, Command
   - Once API is available, update this script to query it directly

---

## Next Steps for Maria

When this script runs weekly (Monday 9am):
1. Read this report
2. Check SESSION_STATE.md for current priorities
3. Review memory logs from past week for gaps
4. Approve/reject recommendations
5. Update cron schedules if needed
6. Document decision in: `memory/cron-audit-YYYY-MM-DD.md`

---

**Audit completed:** 2026-02-07 10:55:09
**Recommended action:** Review and approve above recommendations
