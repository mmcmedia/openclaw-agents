# Adversarial Review: Brian (Knowledge Specialist)

**Review Date:** February 13, 2026  
**Reviewer:** Maria (Manual Review)  
**Type:** Agent/Skill Design  
**Status:** 🟡 REVISE — Good foundation, gaps identified

---

## 🔍 GAPS & ISSUES FOUND

### 1. **No Transcript Extraction Method** (CRITICAL)
**Issue:** SKILL.md describes analyzing transcripts but doesn't specify HOW Brian extracts them.

**Current state:**
- "Extracts full transcripts" — but no tool/method specified
- YouTube API? Browser automation? Third-party service?

**Impact:** Brian can't actually fulfill his primary function without this.

**Fix:** Add explicit transcript extraction workflow:
```
For YouTube videos:
1. Try yt-dlp --write-auto-sub --skip-download
2. Fallback: web_search for "video transcript summary"
3. Fallback: web_fetch video page, extract description/comments
4. Last resort: Request manual transcript from user
```

---

### 2. **No Output Storage Schema** (HIGH)
**Issue:** Says "stores analyses in searchable knowledge base" but no schema defined.

**Current state:**
- "index.json" mentioned but structure undefined
- No versioning strategy
- No deduplication (same video analyzed twice?)

**Fix:** Define exact schema:
```json
{
  "analysis_id": "uuid",
  "source_url": "...",
  "source_type": "youtube|article|podcast|book",
  "title": "...",
  "analyzed_at": "ISO8601",
  "relevance_score": "HIGH|MEDIUM|LOW",
  "tags": ["etsy", "fb-bonus", "ai-tools"],
  "applies_to": ["TheSunDaisy", "WeHeartThis"],
  "team_routing": ["dhanielle", "jan"],
  "key_insights": [...],
  "action_items": [...],
  "full_analysis_path": "..."
}
```

---

### 3. **No Quality Assurance Process** (HIGH)
**Issue:** No mechanism to verify analysis quality.

**Current state:**
- Brian produces output → stored → done
- No check for hallucinations
- No fact-checking
- No source verification

**Impact:** Bad analysis pollutes knowledge base.

**Fix:** Add QA layer:
1. Confidence scoring per insight
2. Source verification (can this claim be traced to the content?)
3. Self-check: "Are these tactics actually in the video?"
4. Maria spot-checks random samples

---

### 4. **No Duplicate Detection** (MEDIUM)
**Issue:** Same content analyzed multiple times creates noise.

**Current state:**
- No URL hashing/checking
- No "already analyzed" warning

**Fix:** 
- Hash URLs, check before analysis
- If duplicate: "This was analyzed on [date]. View previous analysis?"
- Option to re-analyze if content updated

---

### 5. **No Priority Queue System** (MEDIUM)
**Issue:** All content treated equally.

**Current state:**
- Batch of 10 videos = all processed with same priority
- No "URGENT" flag handling

**Fix:** Add priority levels:
- P0 (URGENT): Process immediately, interrupt current work
- P1 (HIGH): Process next
- P2 (NORMAL): Standard queue
- P3 (BACKLOG): Process when idle

---

### 6. **No Update/Revision Workflow** (MEDIUM)
**Issue:** Content changes → analysis becomes stale.

**Current state:**
- YouTuber updates video → Brian's analysis outdated
- No mechanism to flag stale content

**Fix:**
- Store content hash/fingerprint
- Periodic re-check: "Has source changed?"
- Versioning: analysis_v1, analysis_v2

---

### 7. **No Integration with Existing Agents** (MEDIUM)
**Issue:** Sage, Scout, Milo, etc. can't easily query Brian's knowledge base.

**Current state:**
- Each agent has own memory/context
- No shared knowledge graph

**Fix:**
- Query interface: "Brian, what do we know about FB bonus tactics?"
- API for other agents to search index.json
- Weekly knowledge digest pushed to all agents

---

### 8. **No User Feedback Loop** (LOW)
**Issue:** Brian doesn't learn from corrections.

**Current state:**
- You say "that wasn't relevant" → Brian doesn't update
- No pattern learning

**Fix:**
- Feedback buttons: 👍 👎 on each analysis
- Track: "HIGH rated but user said LOW" → adjust scoring
- Monthly calibration with McKinzie

---

## 🎯 RECOMMENDATIONS

### Immediate (This Week)

1. **Add transcript extraction method**
   - Implement yt-dlp workflow
   - Document fallback chain

2. **Define output schema**
   - Create index.json structure
   - Implement deduplication

3. **Add routing rules to skill**
   - Update routing-rules.md
   - Change from human routing → AI agent routing only

### Short-term (This Month)

4. **Build QA layer**
   - Confidence scoring
   - Source verification prompts

5. **Create agent query interface**
   - Other agents can ask Brian questions
   - Shared knowledge access

6. **Add priority queue**
   - URGENT flag handling
   - Batch processing optimization

### Long-term (Next Quarter)

7. **Build feedback loop**
   - 👍 👎 tracking
   - Relevance calibration

8. **Stale content detection**
   - Periodic re-checks
   - Analysis versioning

---

## 📊 CURRENT QUALITY SCORE: 65/100

**Breakdown:**
- Concept: 85/100 (Good idea, clear purpose)
- Implementation: 55/100 (Missing critical pieces)
- Completeness: 50/100 (Gaps in workflow)
- Usability: 70/100 (Clear instructions, but untested)

**Verdict:** 🟡 REVISE — Deploy for testing, but address critical gaps ASAP.

---

## 🚀 PRIORITY FIXES

**Before heavy usage:**
1. Transcript extraction method
2. Output schema + storage
3. Routing change (AI agents only, per McKinzie's request)

**Within 2 weeks:**
4. QA layer (confidence scoring)
5. Duplicate detection

**Within month:**
6. Agent query interface
7. Priority queue

---

## UPDATED ROUTING (Per McKinzie)

**OLD:** Route to human team members (Dhanielle, Jan, etc.)

**NEW:** 
1. Store in central knowledge base
2. Route insights to relevant AI agents only:
   - FB bonus tactics → Sage (for validation)
   - Etsy strategies → Scout (for competitor analysis)
   - PsalMix content → Milo (for brand alignment)
   - Design trends → Pixel (for visual reference)
   - Technical tools → Dev (for implementation assessment)
3. **Human routing:** Maria decides when to share with team

**Benefits:**
- AI agents can cross-reference faster
- Reduces noise for human team
- McKinzie controls information flow
- Builds shared knowledge graph across agent team
