# Validation Loop Audit — Feb 8, 2026

Based on Claude Code Tips video insight: **"If the AI can run checks and observe failures, it self-corrects. Validation loops are THE performance multiplier."**

## Current State: Where We Have Validation ✅

| Workflow | Validation | Status |
|----------|-----------|--------|
| Health check script | Checks gateway, zombies, disk, files | ✅ Good |
| Sub-agent watchdog | Checks session staleness | ✅ Good |
| Kanban scripts | complete-task.sh, add-task.sh | ✅ Good |
| DB writes (Wholesome Library) | Read-back verification after writes | ✅ Added Feb 8 |
| Cron self-audit | Weekly review of automation health | ✅ Good |
| Sub-agent spawn | memory_search before spawning | ✅ Added Feb 8 |

## Gaps Found: Where Validation Is MISSING 🔴

### 1. Sub-Agent Output Quality — NO VALIDATION
**Problem:** Sub-agents return completion announcements, but we never verify the output quality. We just accept "done" and move on.
**Example failures:** 
- Dev hallucinated fake site URLs in health check (Feb 8)
- Duplicate work spawned because nobody checked if deliverables actually existed
- Content agents produce output but nobody checks if it's actually good

**Fix needed:** After sub-agent completes:
1. Verify deliverable EXISTS (file/URL)
2. Spot-check quality (read first 50 lines, check for placeholder data)
3. Run any applicable automated checks (lint, build, word count)

### 2. VPS Agent Outputs — NO VERIFICATION
**Problem:** VPS agents (Dev, Scout, Sage, Milo, Ally, Pixel) produce work but Maria can't easily verify it. No automated checks run after VPS agents complete.
**Example:** Dev "checked" 27 sites but used hallucinated URLs.

**Fix needed:** 
- Each VPS agent task should include a verification step in the task itself
- "After completing, output a VERIFICATION section listing what you checked and how"
- Maria should SSH and spot-check at least ONE deliverable per agent per day

### 3. Content Generation — NO AUTOMATED QUALITY GATE
**Problem:** KoalaWriter articles, Wholesome Library stories, and Etsy descriptions are generated but quality varies. Editors catch issues manually, but there's no automated pre-filter.

**Fix needed:**
- Word count check (too short = incomplete, too long = bloated)
- Keyword presence check (did it hit the target keywords?)
- Readability score (basic Flesch-Kincaid)
- Duplicate content scan (did we already publish something similar?)

### 4. Image Generation (Nano Banana) — NO AUTOMATED CHECK
**Problem:** Images are generated and downloaded but nobody programmatically verifies they're actually good (right aspect ratio, not corrupted, not blank).

**Fix needed:**
- File size check (< 10KB = likely failed/blank)
- Dimension check (matches requested aspect ratio)
- Basic visual check via image analysis tool

### 5. Cron Job Execution — NO FAILURE ALERTING
**Problem:** If a cron job fails silently, nobody knows until McKinzie asks "where's my morning briefing?"

**Fix needed:**
- After each cron fires, log success/failure to a file
- Health check should verify cron execution logs
- Alert McKinzie only on repeated failures (not one-offs)

### 6. Dashboard Data Sync — NO STALENESS CHECK
**Problem:** Analytics dashboard data could go stale if GA4 tokens expire or API calls fail. No automated check for data freshness.

**Fix needed:**
- Each data source should have a "last updated" timestamp
- Health check should flag data older than 24 hours
- Auto-refresh tokens before they expire

### 7. SESSION_STATE.md — NO STALENESS ENFORCEMENT
**Problem:** AGENTS.md says to update SESSION_STATE.md, but nothing ENFORCES it. It goes stale regularly.
**Current:** Manual "staleness check" guideline in AGENTS.md. No teeth.

**Fix needed:**
- Heartbeat should check SESSION_STATE.md timestamp
- If >3 hours stale during active work, flag it
- Auto-prompt: "SESSION_STATE.md is X hours stale. Update it."

## Priority Order for Implementation

1. **Sub-agent output verification** (highest impact — we spawn lots of agents)
2. **Cron failure alerting** (prevents silent failures)
3. **SESSION_STATE staleness enforcement** (prevents context loss)
4. **VPS agent output checks** (prevents hallucinated work)
5. **Content quality gates** (saves editor time)
6. **Dashboard data freshness** (prevents stale reporting)
7. **Image generation checks** (lower priority, less frequent)

## Implementation Plan

### Phase 1: Sub-Agent Verification (Do Now)
Update AGENTS.md sub-agent completion protocol:
```
When sub-agent completes:
1. Read the completion announcement carefully
2. VERIFY deliverable exists (check file/URL)
3. Spot-check quality (first 50 lines or screenshot)
4. If quality is bad → re-spawn with better instructions
5. Update kanban with notes
```

### Phase 2: Cron Monitoring (This Week)
- Add execution logging to all cron jobs
- Add cron health check to health-check.sh
- Set up failure alerting (Telegram message on 2+ consecutive failures)

### Phase 3: Staleness Checks (This Week)  
- Add SESSION_STATE.md age check to heartbeat
- Add data freshness check to dashboard health

### Phase 4: Content & Image Quality (Next Week)
- Build basic content quality script
- Build image validation script
- Integrate into generation pipelines
