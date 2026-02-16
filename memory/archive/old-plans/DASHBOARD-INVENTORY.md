# Dashboard & Project Inventory
**Created:** 2026-01-30  
**Purpose:** Clear documentation of what exists, what does what, and what needs cleanup

---

## 🎯 MAIN PROJECTS

### 1. **Command Center Dashboard** (Node.js/Express) 
**Location:** `/Users/mmcassistant/clawd/dashboard/`  
**Access:** http://localhost:3456  
**Launch:** `dashboard` (or `/Users/mmcassistant/clawd/dashboard/launch-dashboard.sh`)

**Purpose:** McKinzie's daily operations hub for tracking Fitz's work

**Current Files:**
- ✅ `index.html` - Main dashboard UI (CURRENT/ACTIVE)
- ❌ `dashboard-enhanced.html` - Duplicate/variation (CLEANUP NEEDED)
- ✅ `server.js` - Backend API (CURRENT/ACTIVE)
- ✅ `app.js` - Frontend JavaScript (CURRENT/ACTIVE)
- ✅ `styles.css` - Dashboard styling (CURRENT/ACTIVE)
- ❓ `dashboard-api.js` - Unclear purpose (NEEDS REVIEW)
- 📄 `COMMAND-CENTER-README.md` - Documentation
- 📄 `TESTING-GUIDE.md` - Testing instructions
- 📄 `COMPLETION-REPORT.md` - Build report from sub-agents

**Features (ALL WORKING):**
- ✅ Kanban board (task management)
- ✅ Activity Log tab (Fitz's actions with timestamps)
- ✅ Docs Library tab (search/preview reports)
- ✅ Status Monitor (real-time status indicator)
- ✅ Sub-Agent Monitor (track background work)
- ✅ Notes section (quick capture)
- ✅ Plans tab (plan-first workflow)

**Issues Identified by McKinzie:**
- ⚠️ **Too cluttered** - needs visual cleanup
- ⚠️ **Messy layout** - all features present but poorly organized
- ⚠️ **Confusing variations** - multiple HTML files (which is which?)

**Status:** PRODUCTION - Daily use, needs UX audit + cleanup

---

### 2. **Analytics Dashboard** (React/Vite)
**Location:** `/Users/mmcassistant/clawd/projects/analytics-dashboard/` (ASSUMED - needs confirmation)  
**Tech Stack:** React, Vite, Tailwind CSS  
**Purpose:** Data visualization for content sites (Hello Hayley, etc.)

**Current Status:** Built by sub-agent, needs location confirmation

**Features:**
- Hero metrics display
- Traffic charts
- Revenue tracking
- Site performance metrics

**Issues:**
- ⚠️ **Location unclear** - need to find actual project folder
- ⚠️ **Not documented** in inventory
- ⚠️ **Needs UI audit** per McKinzie's request

**Status:** BUILT - Needs audit + location confirmation

---

## 📁 CLEANUP TARGETS

### Dashboard Folder Confusion

**Files to Review/Clean:**
1. `dashboard-enhanced.html` - Is this needed? Or duplicate?
2. `dashboard-api.js` - What does this do vs server.js?
3. Multiple completion/testing docs - consolidate?

**Questions to Answer:**
- Which HTML file is the "source of truth"?
- Are there duplicate features across files?
- Can we consolidate documentation?

---

## 🎨 UI AUDIT PLAN

### Phase 1: Inventory & Document (THIS FILE)
✅ Create clear list of what exists  
✅ Identify duplicates and confusion  
✅ Document current state

### Phase 2: UI Audit - Command Center
Using `ui-audit` skill to evaluate:
- Visual hierarchy
- Cognitive load (too cluttered?)
- Navigation patterns
- Information architecture
- Accessibility

**Deliverable:** Detailed audit report with priority fixes

### Phase 3: UI Audit - Analytics Dashboard
Same framework, evaluate:
- Data visualization clarity
- Dashboard layout
- Visual hierarchy
- Responsive design

**Deliverable:** Audit report + redesign recommendations

### Phase 4: Cleanup & Consolidation
Based on audit results:
- Remove duplicate files
- Consolidate features into clean layout
- Update documentation
- Create "single source of truth" for each project

---

## 📊 CURRENT WORKSPACE STRUCTURE

```
/Users/mmcassistant/clawd/
├── dashboard/                    # Command Center (Node.js)
│   ├── index.html               ✅ MAIN UI
│   ├── dashboard-enhanced.html  ❓ DUPLICATE?
│   ├── server.js                ✅ BACKEND
│   ├── app.js                   ✅ FRONTEND LOGIC
│   ├── styles.css               ✅ STYLES
│   ├── dashboard-api.js         ❓ PURPOSE?
│   ├── data/                    ✅ JSON storage
│   └── node_modules/            ✅ Dependencies
│
├── projects/                    # Project workspace
│   ├── analytics-dashboard/    ❓ LOCATION?
│   └── [other projects]
│
├── reports/                     ✅ Generated reports
├── memory/                      ✅ Daily logs, activity
├── skills/                      ✅ AI skills (45+)
└── [other workspace files]
```

---

## 🔍 QUESTIONS TO RESOLVE

1. **Analytics Dashboard Location**
   - Where is the React/Vite analytics dashboard actually located?
   - Is it in `/projects/analytics-dashboard/`?
   - Or somewhere else?

2. **Dashboard Files**
   - What is `dashboard-enhanced.html` for?
   - Is `dashboard-api.js` used or legacy?
   - Which files can be deleted safely?

3. **Feature Organization**
   - Are all features in ONE place or scattered?
   - Can we consolidate into single clean UI?

---

## 🎯 NEXT STEPS

### Immediate (Now):
1. ✅ Create this inventory document
2. 🔄 Find analytics dashboard location
3. 🔄 Run UI audit on Command Center
4. 🔄 Run UI audit on Analytics Dashboard

### After Audits:
5. Review audit reports with McKinzie
6. Create cleanup plan based on findings
7. Consolidate/remove duplicate files
8. Redesign Command Center layout (keep all features, better UX)
9. Polish Analytics Dashboard

### Final:
10. Update all documentation
11. Create "single source of truth" guide
12. Test everything works after cleanup

---

## 📝 NOTES

**From McKinzie (2026-01-30):**
- Dashboard is too cluttered but wants all features
- Lots of messy crossover and confusion
- Wants to use new ui-audit skill on both dashboards
- Needs clear documentation of which is which

**Resolution Plan:**
- Use Tommy Geoco UI audit framework
- Systematic evaluation of both dashboards
- Cleanup based on audit findings
- Better organization, same functionality

---

**Status:** Inventory complete, ready for UI audits
