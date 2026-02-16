# Master Use Cases — Fitz Chief AI Officer System
**Last Updated:** 2026-01-28

## Status Key
- ✅ Ready to build (have access + tools)
- ⏳ Waiting on dependency
- 🔜 Deferred
- ❌ Dropped

---

## SCOUT Pillar — Monitor Trends & Competitors

### 1. YouTube AI/Tech Digest ⏳
- **Schedule:** Overnight → feeds into morning briefing
- **Channels:** Cole Medin, Nate Herk, Greg Isenberg + Etsy seller channels, Pinterest strategy channels, FB bonus creators, Greg from Wealth Hacker
- **Split into:** Tools/Tech digest + Business Verticals digest
- **Needs:** YouTube transcript skill

### 2. TikTok/Pinterest Trend Scout ✅
- **Rethought:** Pinterest Trends + Reddit + Instagram Reels monitoring (TikTok API unreliable)
- **Schedule:** Every 6 hours
- **Focus:** Art/design trends for Etsy shops

### 3. Design Trend Journal ✅
- **Type:** Living document in Google Sheets
- **Tracks:** Trend name, first-spotted date, lifecycle stage, shop fit, products created, performance

### 4. Competitor Etsy Shop Tracker ✅
- **Via:** Everbee (public data, no login needed)
- **Schedule:** Weekly
- **Tracks:** 3-5 shops per niche, new listings, pricing, bestsellers, review velocity

---

## ANALYZE Pillar — Process Data into Intelligence

### 5. Everbee → Keyword Bank ✅
- **Trigger:** On-demand or weekly
- **Have access:** Everbee browser + Chrome extension
- **Output:** Keywords to Google Sheets Keyword Bank

### 6. GetLate FB Analytics (WHT) ✅
- **Changed:** Daily monitoring with alerts (not just weekly)
- **Have access:** get late.dev (ANALYZE ONLY)
- **Output:** Patterns, top performers, "more like this" recommendations

### 7. Weekly Intelligence Report ✅
- **Merged:** Metricool Competitor Intel (#13) + Content Site Traffic Digest (#14) + GetLate FB
- **Schedule:** Weekly Fridays
- **One report:** Competitor moves + own traffic + FB performance

### 8. Content Site Traffic Digest ✅ (merged into #7)

### 9. Pinterest Recovery Monitor (HH) ✅
- **NEW — not in original plan**
- **Schedule:** Weekly ongoing until HH recovers
- **Tracks:** Traffic trends, pin performance, algorithm updates, community intel

---

## ADVISE Pillar — Connect Dots, Suggest Opportunities

### 10. Daily Chief AI Officer Briefing ✅
- **Schedule:** 8:30 AM MT (cron job exists)
- **Enhanced with:** overnight research, trend alerts, action items

### 11. Seasonal Trend Alerts ✅
- **Schedule:** Weekly Sunday
- **90 days ahead:** Holidays + LDS dates mapped to 6 shops
- **Cross-refs:** TikTok/Pinterest trends + Keyword Bank

### 12. LDS Content Calendar ✅
- **NEW — not in original plan**
- **For:** TheSunDaisy (top Etsy shop) + Primary newsletter
- **Tracks:** Come Follow Me weekly topics, LDS holidays, General Conference, temple dedications

### 13. FB Bonus Content Optimizer ✅
- **NEW — not in original plan**
- **Analyzes:** Every WHT post for engagement, shares, reach, bonus payout
- **Builds:** Playbook of what works (hair collages, timing, format)

### 14. Overwhelm Reset Protocol ✅
- **Trigger:** "I'm feeling overwhelmed"
- **Reviews:** All projects, separates urgent vs feels-urgent, gives ONE thing to focus on

### 15. Weekly Schedule Optimizer ✅
- **NEW — not in original plan**
- **Monday morning:** Top 3 priorities + suggested schedule for McKinzie's work blocks

---

## EXECUTE Pillar — Run Workflows When Approved

### 16. Keyword → Art Prompt Pipeline ✅
- **Tool-agnostic:** Midjourney + Ideogram + Nano Banana Pro (Genspark)
- **Cross-refs:** Keyword Bank + Trend Journal
- **Trigger:** On-demand

### 17. Downpour Title/Description Optimizer ⏳
- **Needs:** Downpour browser access (McKinzie to set up)

### 18. Find Existing Blog Placement Opportunities ⏳
- **Needs:** Blog Posts Master populated in Google Sheets

### 19. Generate New Blog Post Opportunities ⏳
- **Needs:** Blog Posts Master + Keyword Bank populated

### 20. Full Blog Post Writer 🔜
- **Deferred:** McKinzie wants to figure this out later
- **Note:** Should be strategy/planning (Fitz) + KoalaWriter + editors for execution

### 21. PsalMix Pre-Launch Social Content ✅
- **NEW priority:** Creating social content for app launch
- **Was deferred, now active** since launch is approaching

### 22. Primary Newsletter Draft ✅
- **Schedule:** 1st of each month
- **Based on:** Come Follow Me curriculum
- **Output:** Draft to local file for McKinzie to review

### 23. Monthly Business Review ✅
- **Schedule:** 1st of each month
- **All streams:** 6 Etsy shops, content sites, PsalMix
- **Format:** Wins first, then recommendations

---

## OPERATIONS — Infrastructure & Organization

### 24. Etsy Daily P&L Dashboard ⏳
- **Needs:** Google Sheets populated with Etsy export data (Option A)
- **When ready:** Daily snapshot per shop: revenue, ad spend, ROAS, profit/loss

### 25. Etsy Ad Spend Optimizer ❌
- **Dropped:** No Etsy login access. Could revisit with API (read-only) when approved.

### 26. Content Refresh Pipeline ⏳
- **Needs:** Blog Posts Master + GA traffic data
- **Identifies:** Aging posts that could recover with updates

### 27. Site Portfolio ROI Triage ⏳
- **Needs:** GA data for all sites
- **Monthly:** Pageviews, revenue, trend direction → keep/pivot/cut recommendation

### 28. n8n Workflow Monitor 🔜
- **Deferred:** Until Pinterest automations are live
- **Monitors:** Failures, auth token expirations

### 29. Revenue Forecasting ⏳
- **Needs:** Historical revenue data
- **Projects:** Next month by stream, gap analysis to $15k floor

### 30. Google Sheets Data Hub Setup ✅
- **In progress tonight**
- **Sheets:** Etsy Listings Master, Blog Posts Master, Keyword Bank, Trend Journal

---

## Access Status
| Tool | Status |
|------|--------|
| Everbee | ✅ Logged in + Chrome extension |
| Metricool | ✅ Logged in |
| get late.dev | ✅ Logged in (ANALYZE ONLY) |
| Google Analytics | ✅ Viewer access |
| Google Sheets | ✅ Via Google account |
| Downpour | ⏳ Need access |
| Etsy API | ⏳ Applied, waiting |
| Affiliatable/aff.ai | ⏳ Need access |
| WordPress sites | ⏳ Need REST API access |
