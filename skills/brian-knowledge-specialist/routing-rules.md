# Brian's Routing Rules — AI Agents Only

**Policy:** Per McKinzie's instruction (Feb 13, 2026), Brian routes insights to:
1. Central knowledge base (storage)
2. Relevant AI agents (for cross-referencing)
3. **NOT directly to human team members** — Maria decides when to share

---

## Routing Flow

```
Content Analysis
      ↓
Store in Knowledge Base
      ↓
Route to Relevant AI Agents
      ↓
Maria Reviews → Decides Human Sharing
```

---

## AI Agent Routing

| Topic | Route To | Purpose |
|-------|----------|---------|
| FB bonus, social media tactics | **Sage** | Validate against research trends |
| Etsy, competitor strategies | **Scout** | Cross-reference with competitor intel |
| Pinterest, SEO changes | **Sage** | Content/SEO director validation |
| Music, video production | **Milo** | PsalMix brand alignment |
| PsalMix, app strategies | **Milo** + **Dev** | Brand + technical feasibility |
| Design trends, aesthetics | **Pixel** | Visual reference library |
| AI tools, automation | **Dev** | Technical evaluation |
| Business strategy, revenue | **Maria** (main) | Strategic prioritization |
| Operations, team management | **Ally** (Dhanielle's agent) | Ops coordination |

---

## Knowledge Base Storage

**Primary Storage:**
```
/home/openclaw/shared-inbox/brian/outputs/
├── index.json                    # Master searchable index
├── analyses/
│   ├── YYYY-MM-DD-{slug}.md     # Full analysis files
│   └── archive/                  # Analyses > 90 days
├── by-topic/
│   ├── marketing-tactics.json
│   ├── ai-automation.json
│   ├── etsy-growth.json
│   ├── fb-bonus.json
│   ├── pinterest-seo.json
│   └── business-strategy.json
└── by-site/
    ├── hello-hayley.json
    ├── melrose-family.json
    ├── we-heart-this.json
    ├── thesun-daisy.json
    └── psalmix.json
```

**Index Schema:**
```json
{
  "analysis_id": "uuid-v4",
  "source_url": "https://...",
  "source_type": "youtube|article|podcast|book|github",
  "title": "Video Title",
  "creator": "Channel/Author Name",
  "analyzed_at": "2026-02-13T18:00:00Z",
  "content_hash": "sha256-of-source",
  
  "relevance": {
    "score": "HIGH|MEDIUM|LOW",
    "confidence": 0.85,
    "reasoning": "Why this rating"
  },
  
  "tags": [
    "fb-bonus",
    "video-content",
    "creative-strategy"
  ],
  
  "applies_to": {
    "sites": ["we-heart-this"],
    "shops": [],
    "projects": ["psalmix"]
  },
  
  "ai_routing": [
    "sage",
    "milo"
  ],
  
  "key_insights": [
    {
      "insight": "Specific tactic",
      "source_timestamp": "05:32",
      "confidence": 0.9,
      "applies_to": ["we-heart-this"]
    }
  ],
  
  "action_items": [
    {
      "action": "Test this tactic",
      "timeline": "this-week",
      "owner": "jan",
      "priority": "HIGH"
    }
  ],
  
  "file_path": "/home/openclaw/shared-inbox/brian/outputs/analyses/2026-02-13-video-slug.md",
  
  "qa_check": {
    "verified_sources": true,
    "hallucination_risk": "LOW",
    "confidence_score": 0.87
  }
}
```

---

## Query Interface for Other Agents

Other agents can ask Brian:

```
Brian, what do we know about FB bonus tactics?
→ Returns relevant analyses from knowledge base

Brian, find analyses about Etsy pricing strategies
→ Returns filtered results

Brian, summarize insights from last week about AI automation
→ Returns aggregated summary
```

---

## Human Sharing Protocol

**Maria decides when insights go to human team:**

1. Brian completes analysis
2. Stores in knowledge base
3. Routes to relevant AI agents
4. **Maria review queue:**
   - HIGH relevance → Flag for Maria's attention
   - Maria decides: Share now / Share in weekly digest / Don't share
5. If sharing:
   - Format for human consumption
   - Add context: "This applies to WHT because..."
   - Route to appropriate human

**Benefits:**
- Reduces noise for human team
- AI agents build shared knowledge
- McKinzie controls information flow
- Prevents "too many cooks" with new ideas

---

## Example Routing

**Content:** YouTube video "FB Bonus Scaling to $300/day"

**Brian does:**
1. Extracts transcript
2. Analyzes content
3. Rates: 🔥 HIGH relevance
4. Tags: fb-bonus, video-content, scaling
5. Stores in knowledge base
6. **Routes to AI agents:**
   - Sage: "Validate this against your research"
   - Milo: "Any PsalMix crossover potential?"
7. **Flags for Maria:** HIGH relevance — review for team sharing

**Maria decides:**
- "This is solid — share with Dhanielle and Jan"
- Or: "Hold for weekly team meeting"
- Or: "Archive only — not actionable right now"

---

## Handoff to Humans (When Maria Decides)

**If Maria approves sharing:**

**To Dhanielle:**
```
[Via Telegram/Shared Inbox]

Brian found: FB bonus scaling tactic from [Creator]

Key Insight: [Specific tactic]
Applies to: We Heart This
Action: [What to test]

Full analysis: [link to knowledge base]
```

**To Jan:**
```
[Via Telegram]

Content format to try this week:
- [Brian's insight about what type of content works]
- Based on: [Video analysis]

Reference examples: [links]
```

---

## Central Knowledge Base Access

**Location:** `/home/openclaw/shared-inbox/brian/`

**All agents can read:**
- index.json (searchable database)
- Full analysis files
- Topic-organized summaries

**Only Brian writes:**
- New analyses
- Index updates
- Knowledge base maintenance

**Maria manages:**
- Human sharing decisions
- Knowledge base organization
- Archive old analyses (> 1 year)

---

## Updates Log

- **2026-02-13:** Changed from human routing → AI-only routing (per McKinzie)
