# Task Tracking System - Quick Reference

**Problem Solved:** Tasks getting lost, projects falling through cracks, no continuity between sessions.

---

## 🎯 The System (3 Pillars)

### 1. **MMC Command Center** (Live Dashboard)
- **What:** Visual Kanban board at `file:///Users/mmcassistant/clawd/dashboard/index.html`
- **When:** Real-time task tracking, daily work
- **Add tasks:** `MMC_API.addCard({...})`
- **Update:** Move cards, check off subtasks, add notes

### 2. **ACTIVE_PROJECTS.md** (Project Inventory)
- **What:** Single source of truth for all active projects
- **When:** Updated daily (first heartbeat), weekly review
- **Contains:** Project status, last touched date, next steps, links to files

### 3. **Memory Files** (Historical Record)
- **What:** Daily logs in `memory/YYYY-MM-DD.md`
- **When:** Document work as it happens
- **Template:** `memory/DAILY_TEMPLATE.md`
- **Include:** Active projects status section

---

## 📋 Workflows

### When McKinzie Assigns a Task
1. **Immediately** add to Command Center: `MMC_API.addCard({...})`
2. Document in `memory/YYYY-MM-DD.md`
3. Add to `ACTIVE_PROJECTS.md` if it's a multi-day project
4. **Confirm back** to McKinzie it's tracked

### When Starting Work on a Project
1. Check if project folder exists in `/projects/`
2. If not, create following `PROJECT_STANDARDS.md`
3. Add README.md with required sections
4. Update Command Center card to IN PROGRESS
5. Update ACTIVE_PROJECTS.md "Last Touched"

### During Work
1. Update progress in project's progress.md
2. Update Command Center card notes
3. Check off subtasks as completed
4. Update ACTIVE_PROJECTS.md status

### When Finishing Work Session
**Session Handoff (especially overnight):**
1. Document what you did in `memory/YYYY-MM-DD.md`
2. Update Command Center cards
3. Update ACTIVE_PROJECTS.md "Last Touched" dates
4. Commit to git with descriptive message
5. Write continuation notes (what's next, blockers)

### When Completing a Task
1. Move Command Center card to DONE
2. Update ACTIVE_PROJECTS.md to "Complete"
3. Document completion in memory file
4. Archive project folder after 30 days

---

## 🔄 Daily Routines

### First Heartbeat of Day
1. **Project reconciliation:**
   - Scan `/projects/` folder
   - Compare to Command Center and ACTIVE_PROJECTS.md
   - Add any missing projects
   - Flag stale projects (>7 days no update)

2. **Command Center health check:**
   - ASSIGNED cards with no activity?
   - HIGH priority in BACKLOG?
   - Missing due dates?

3. **Update ACTIVE_PROJECTS.md** if anything changed

### Throughout Day
- Update cards as work progresses
- Document in daily memory file
- Keep "Last Touched" dates current

### End of Day
- Session handoff if significant work done
- Commit changes to git
- Review tomorrow's priorities

---

## 🗓️ Weekly Routine

### Sunday 9 PM: Weekly Project Review (Cron)
Automated review that checks:
- Stalled projects (no update in 7+ days)
- Projects on track
- Projects completed this week
- Recommendations for next week

Delivers concise status report to McKinzie.

---

## 📁 File Locations

| File | Purpose | Update Frequency |
|------|---------|------------------|
| `ACTIVE_PROJECTS.md` | Project inventory | Daily (first heartbeat) |
| `memory/YYYY-MM-DD.md` | Daily work log | Throughout day |
| `memory/DAILY_TEMPLATE.md` | Template for new days | Reference only |
| `PROJECT_STANDARDS.md` | How to structure projects | Reference only |
| `HEARTBEAT.md` | What to check during heartbeats | Reference only |
| `AGENTS.md` | Core operating procedures | Reference only |
| Dashboard | Command Center UI | Real-time |

---

## 🚨 Red Flags (Alert McKinzie)

- Project not updated in 7+ days
- HIGH priority task stuck in BACKLOG
- Project with no Command Center card
- Project folder missing README.md
- ASSIGNED card with no recent activity
- Multiple projects blocking each other

---

## ✅ Success Metrics

**Good signs the system is working:**
- ✅ No tasks forgotten
- ✅ Easy to resume work after gaps
- ✅ McKinzie always knows what's happening
- ✅ Projects have clear next steps
- ✅ Stale work gets flagged automatically
- ✅ Context preserved between sessions

**If tasks still get lost:**
- Check if following all workflows
- Review what fell through cracks
- Improve the system
- Document lessons learned

---

## 🛠️ Tools & Commands

### Command Center API
```javascript
// Add card
MMC_API.addCard({title, description, priority, category, assignee, column})

// Update card
MMC_API.updateCard(cardId, {notes, column, status})

// Move card
MMC_API.moveCard(cardId, 'done')

// Update status
MMC_API.setFitzStatus('working', 'Building something cool')
```

### Project Reconciliation
```bash
# Find all project folders
ls ~/clawd/projects/

# Find READMEs
find ~/clawd/projects -name "README.md"

# Check Command Center
open ~/clawd/dashboard/index.html
```

---

**Remember:** The system is only as good as your discipline in using it. Make it a habit!
