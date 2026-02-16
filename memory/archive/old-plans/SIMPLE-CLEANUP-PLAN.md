# Simple Cleanup Plan
**Created:** 2026-01-30  
**For:** McKinzie

---

## 🎯 THE MAIN FILES (Keep & Audit These)

### 1. Command Center
**File:** `/Users/mmcassistant/clawd/dashboard/index.html`  
**URL:** http://localhost:3456  
**Purpose:** Daily operations hub

### 2. Analytics Dashboard  
**Location:** `/Users/mmcassistant/clawd/projects/analytics-dashboard/`  
**Tech:** React + Vite  
**Purpose:** Data visualization

---

## 🗑️ FILES TO DELETE (Old Versions)

### In `/dashboard/` folder - Delete these 7 files:
```bash
cd /Users/mmcassistant/clawd/dashboard
rm analytics.html
rm analytics-final.html  
rm analytics-v1.html
rm analytics-v2.html
rm analytics-old.html
rm analytics-redesign.html
rm analytics-enterprise.html
```

**Why?** These are old iterations from sub-agent experiments. The REAL analytics dashboard is the React project.

---

## ❓ FILES TO REVIEW (After Audit)

- `dashboard-enhanced.html` - Is this used? Or duplicate?
- `dashboard-api.js` - Is this used by server.js?

**Decision:** Wait for UI audit to determine if these are needed.

---

## ✅ AFTER CLEANUP

### What Will Remain:

**Command Center folder:**
- ✅ index.html (main UI)
- ✅ server.js (backend)
- ✅ app.js (logic)
- ✅ styles.css (styles)
- ✅ data/ (storage)
- ✅ node_modules/ (dependencies)

**Analytics project:**
- ✅ /projects/analytics-dashboard/ (React app)

**Result:** Clean, clear, no confusion.

---

## 🎨 THEN: UI Audits

After cleanup, audit the two MAIN dashboards:
1. Command Center (`index.html`)
2. Analytics Dashboard (React project)

**Focus:** Layout improvements, not file cleanup (that's done).

---

## ⏱️ Time Estimate
- Cleanup: 30 seconds (just delete 7 files)
- Audit: 30-60 minutes (comprehensive UX review)
- Implementation: TBD after seeing audit results

---

**Ready to execute?** Just run the `rm` commands above, then we'll audit the correct files.
