# Cron Audit — Sunday, Feb 15, 2026

**Time spent:** 6 minutes  
**Status:** ⚠️ Action recommended — stale crons identified, overlaps found

---

## What I Found

**Total cron jobs:** 61 (45 active, 16 disabled)  
**Recent health check:** Most crons firing successfully, but several issues identified

### Key Findings

1. **DISABLED crons need cleanup** — 16 crons disabled, some stale from completed projects
2. **Sunday 9pm pile-up** — 3 crons firing simultaneously (weekly-project-review, weekly-project-reconciliation, weekly-team-report)
3. **n8n-failure-investigator failing** — Has 2 consecutive errors, needs attention
4. **One-time crons still present** — psalmix-monday-checkin, vocal-type-ratio-check have deleteAfterRun but not yet executed
5. **Missing cron:** No weekly-self-optimization cron exists yet (this audit runs manually via isolated agent)

---

## Cron Status Table

| Cron Name | Purpose | Rating | Last Run | Notes |
|-----------|---------|--------|----------|-------|
| morning-briefing | Daily weather/news/tasks | HIGH | Feb 15 ✅ | Essential |
| evening-brief | Daily wins/summary | MEDIUM | Feb 15 ✅ | Working well |
| nightly-proactive-work | Overnight work driver | HIGH | Feb 15 ✅ | Core capability |
| overnight-work-driver | Every 20min 1-7am | HIGH | Feb 15 ✅ | Critical for overnight |
| tomorrows-todo-generator | Pre-do work | HIGH | Feb 15 ✅ | Saves morning time |
| overnight-git-checkpoint | Git backup 2-6am | MEDIUM | Feb 15 ✅ | Safety net |
| relay-check | VPS relay check | HIGH | Feb 15 ✅ | Every 10min |
| team-daily-summary | Late/n8n report | HIGH | Feb 14 ✅ | Working well |
| morning-qa-check | Health/sub-agent check | HIGH | Feb 15 ✅ | 7am daily |
| daily-site-health | Site uptime check | HIGH | Feb 15 ✅ | Working |
| sage-daily-scan | Keyword trends | HIGH | Feb 14 ✅ | SEO value |
| scout-daily-monitor | Etsy competitor check | HIGH | Feb 14 ✅ | E-commerce value |
| maria-morning-dispatch | Agent dispatch | HIGH | Feb 15 ✅ | Working |
| mediavine-daily-sync | Revenue data sync | HIGH | Feb 15 ⚠️ | Browser unavailable, skipped |
| dashboard-morning-email | Morning summary | HIGH | Feb 15 ⚠️ | Sent stale data |
| nightly-ai-news-digest | AI news | MEDIUM | Feb 14 ✅ | Good signal |
| nightly-etsy-trend-scout | Etsy trends | MEDIUM | Feb 14 ✅ | Valuable research |
| nightly-thesundaisy-pipeline | Product pipeline | HIGH | Feb 14 ✅ | Core automation |
| alpaca-auto-trade | Paper trading | LOW | Feb 13 ✅ | Low priority |
| weekly-reverse-prompt | Feedback prompt | MEDIUM | Feb 9 ✅ | Good for improvement |
| weekly-project-review | Status review | MEDIUM | Feb 9 ✅ | Useful |
| weekly-project-reconciliation | Git/kanban sync | MEDIUM | Feb 9 ✅ | Maintenance |
| weekly-team-report | Agent summary | MEDIUM | Feb 9 ✅ | Tracking value |
| weekly-knowledge-consolidation | Memory cleanup | MEDIUM | Feb 9 ✅ | Prevents drift |
| weekly-self-optimization | THIS AUDIT | HIGH | — | Not yet scheduled |
| daily-cost-summary | AI spend tracking | MEDIUM | Feb 15 ✅ | Cost control |
| daily-automation-idea | Proactive suggestions | LOW | Feb 14 ✅ | Often skipped |
| content-traffic-monitor | Traffic alerts | HIGH | Feb 14 ✅ | Business critical |
| ready-for-review-digest | Pending work alert | HIGH | Feb 15 ✅ | Keeps work flowing |
| decision-revisit-check | Decision review | MEDIUM | Feb 10 ✅ | Good governance |
| weekly-seo-scan | SEO monitoring | MEDIUM | Feb 10 ✅ | Strategic |
| weekly-leila-kick | Business coaching | MEDIUM | Feb 10 ✅ | Motivation |
| leila-monday-strategy | Strategy session | HIGH | Feb 10 ✅ | High value |
| hh-fb-weekly-monitor | FB performance | LOW | Feb 10 ✅ | Low priority |
| weekly-topic-monitor | Industry news | MEDIUM | Feb 10 ✅ | Competitive intel |
| etsy-review-monitor | Review alerts | HIGH | Feb 14 ✅ | Reputation mgmt |
| weekly-analytics-opportunity-scan | GA4 analysis | HIGH | Feb 10 ✅ | Growth opportunity |
| afternoon-proactive-check | 2pm check-in | LOW | Feb 12 ✅ | Often light |
| milo-weekly-research | PsalMix research | MEDIUM | Feb 11 ✅ | Pre-launch value |
| weekly-systems-reflection | Changelog | MEDIUM | Feb 13 ✅ | Documentation |
| ideas-backlog-review | Idea triage | LOW | Feb 13 ✅ | Often empty |
| saturday-planning-prompt | Weekend check | LOW | Feb 14 ✅ | Light touch |
| weekly-disk-cleanup | Maintenance | LOW | Feb 14 ✅ | Auto-cleanup |
| weekly-project-sync-audit | Project sync | MEDIUM | Feb 9 ✅ | Prevents orphans |
| etsy-ad-monitor | Monthly ad health | MEDIUM | — | Next: Mar 1 |
| seasonal-prep-check | Holiday planning | HIGH | Feb 15 ✅ | Revenue protection |
| monthly-systems-deep-dive | Monthly review | MEDIUM | — | Next: Mar 1 |
| etsy-test-phase-review | Shop review | MEDIUM | — | Next: Mar 3 |
| team-structure-review-april | Hiring check | HIGH | — | Apr 1 (critical) |
| raptive-rpm-check | RPM test result | MEDIUM | Feb 9 ✅ | One-time complete |
| n8n-failure-investigator | Workflow health | MEDIUM | Feb 10 ❌ | **2 errors, disabled** |
| check-wl-batches | WL batch check | LOW | — | **Disabled, completed** |
| psalmix-oauth-check | OAuth reminder | LOW | Feb 5 ✅ | **Disabled, completed** |
| psalmix-research-sprint | Research push | LOW | Feb 5 ✅ | **Disabled, completed** |
| psalmix-monday-checkin | Accountability | — | — | **deleteAfterRun, Feb 17** |
| vocal-type-ratio-check | Data check | — | — | **deleteAfterRun, Feb 21** |

---

## Stale/Disabled Crons Needing Cleanup

| Cron | Status | Action |
|------|--------|--------|
| n8n-failure-investigator | Disabled + 2 errors | **REMOVE** — n8n has self-healing guardian now |
| check-wl-batches | Disabled | **REMOVE** — batch completed, no longer needed |
| psalmix-oauth-check | Disabled | **REMOVE** — OAuth completed |
| psalmix-research-sprint | Disabled | **REMOVE** — sprint completed |

---

## Sunday 9pm Pile-up (Conflict)

**Problem:** 3 crons firing at exactly 9pm Sunday:
1. weekly-project-review
2. weekly-project-reconciliation  
3. weekly-team-report

**Recommendation:** Stagger by 15 minutes:
- weekly-project-review: 9:00pm (main review)
- weekly-project-reconciliation: 9:15pm (depends on review)
- weekly-team-report: 9:30pm (depends on reconciliation)

---

## Proposals This Week

### ADD
- **weekly-self-optimization cron** — Schedule this audit to run automatically every Sunday 2pm (already exists as isolated agent job, just needs to be formalized)

### REMOVE
- **n8n-failure-investigator** — Redundant with n8n's built-in self-healing guardian
- **check-wl-batches** — One-time batch job completed
- **psalmix-oauth-check** — OAuth setup completed
- **psalmix-research-sprint** — Research sprint completed

### RESCHEDULE
- **weekly-project-reconciliation** → 9:15pm Sunday (after project-review)
- **weekly-team-report** → 9:30pm Sunday (after reconciliation)

### NO CHANGE
- All daily operational crons (morning-briefing, evening-brief, nightly-proactive-work, etc.)
- Daily agent dispatches (sage, scout, milo)
- Revenue-critical crons (mediavine-sync, dashboard-email, traffic-monitor)

---

## Questions/Blockers

1. **Mediavine sync failed** — Browser unavailable on Feb 15. Is this a recurring issue? Should we add retry logic or alternate data source?

2. **daily-automation-idea** — Often fires when McKinzie isn't responsive. Consider making this contextual (only if she's active) or consolidating into morning briefing.

3. **weekly-self-optimization** — This audit currently runs as an isolated agent job triggered manually. Should be promoted to a formal recurring cron with the same schedule.

---

*Report generated: Feb 15, 2026 2:06 PM MT*  
*Auditor: Maria*  
*Method: cron API query + memory log analysis + SESSION_STATE review*
