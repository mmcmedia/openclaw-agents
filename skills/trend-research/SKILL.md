# Trend Research Skill

**Purpose:** Enable VPS agents (Sage, Scout, Milo) to research trending topics with REAL search volume data across social platforms, Reddit, and general web sources.

**Available Tools:**
- `web_search` (Brave Search) — Site-specific and general queries, freshness filtering
- `web_fetch` — Extract full content from pages (Reddit threads, blog posts, reports)
- `keyword-volume.sh` — **Keywords Everywhere API** — Real Google search volume, CPC, competition, and 12-month trend data

---

## 🔑 Keywords Everywhere Integration (USE THIS FIRST)

**ALWAYS validate trends with real search volume data.** Don't guess demand — measure it.

### Script
```bash
# Local:
/Users/mmcassistant/clawd/skills/trend-research/keyword-volume.sh "keyword1" "keyword2" "keyword3"
# VPS:
/home/openclaw/skills/trend-research/keyword-volume.sh "keyword1" "keyword2" "keyword3"
```

### What It Returns
- **Volume**: Monthly Google searches
- **CPC**: Cost per click (higher = more commercial intent = more money in niche)
- **Competition**: 0-1 scale (higher = more advertisers competing)
- **12-month trend**: Monthly breakdown + direction (📈 RISING / 📉 FALLING / ➡️ STABLE)

### Credits: ~96K remaining (1 credit per keyword). Batch up to 100 keywords per call.

### Standard Workflow: Brave Search discovers → Keywords Everywhere validates

### Interpretation Guide
| Volume | Assessment |
|--------|-----------|
| 50K+ | 🔥 Huge — high competition, hard to rank |
| 10K-50K | ✅ Strong — worth building content around |
| 1K-10K | 👍 Good — sweet spot for niche sites |
| 100-1K | 🟡 Modest — only if low competition |
| <100 | ⚠️ Low — probably not worth a dedicated article |

| CPC | What It Means |
|-----|---------------|
| $1+ | 💰 High commercial intent — advertisers pay to rank |
| $0.10-$1 | 💵 Moderate commercial value |
| <$0.10 | 📝 Informational — learning, not buying |

---

## Quick Reference

| Agent | Primary Use | Key Queries |
|-------|------------|------------|
| **Scout** (Etsy) | Product trends | "[niche] trending products 2026", "etsy bestseller [category]" |
| **Sage** (SEO) | Content trends | "[topic] trending 2026", "[niche] content ideas" |
| **Milo** (PsalMix) | Music/culture | "trending clean music 2026", "family friendly music trends" |

---

## Workflow A: Etsy Product Trend Research (Scout)

**Goal:** Identify trending products, validate demand, assess competition.

### Step 1: Broad Market Search
```
web_search query="[niche] trending products 2026" count=10 freshness="pw"
web_search query="etsy bestseller [category]" count=10
```
**Look for:** Product names, price ranges, volume indicators ("bestseller", "top seller", "hot right now")

### Step 2: Reddit Validation
```
web_search query="site:reddit.com etsy digital downloads trending [niche]" count=10 freshness="pw"
web_search query="site:reddit.com [niche] what are people buying" count=10
```
**Look for:** User discussions, pain points, real demand signals, competitor mentions

### Step 3: Pinterest Inspiration
```
web_search query="site:pinterest.com [product type] popular [niche]" count=10
```
**Look for:** Visual trends, design patterns, color schemes, styling preferences

### Step 4: Deep Dive (Optional)
```
web_fetch url=[top Reddit thread] extractMode="markdown"
web_fetch url=[trending blog post] extractMode="markdown"
```
**Extract:** User comments, reasons for popularity, seasonal patterns

### Output Format
```
SCOUT TREND REPORT: [Niche] Products
Date: YYYY-MM-DD

TOP 10 FINDINGS:
1. [Product Name] | Source: [URL] | Confidence: HIGH
2. [Product Name] | Source: [URL] | Confidence: MEDIUM
...

MARKET SIGNALS:
- Average price range: $X-$Y
- Seasonal peak: [Month]
- Competition level: [Low/Medium/High]

ACTIONABLE NEXT STEPS:
- Research [product] on Everbee for keyword difficulty
- Check Etsy bestseller rankings in [category]
- Test listing with [design approach]

RESEARCH DATE: YYYY-MM-DD
```

---

## Workflow B: Content/SEO Trend Research (Sage)

**Goal:** Find high-intent search queries, content gaps, competition levels.

### Step 1: Trend Discovery
```
web_search query="[topic] trending 2026" count=10 freshness="pw"
web_search query="[niche] content ideas 2026" count=10
web_search query="[topic] guide tutorial" count=10
```
**Look for:** Search volume indicators, article titles, content types gaining traction

### Step 2: Reddit Intent Mining
```
web_search query="site:reddit.com [niche] what content do people want" count=10
web_search query="site:reddit.com [niche] questions answered" count=10
web_search query="site:reddit.com [topic] help advice" count=10
```
**Look for:** Questions people ask, pain points, content gaps, language/terminology

### Step 3: Competition Assessment
```
web_search query="[topic] [niche] top articles" count=10
web_fetch url=[top result] extractMode="markdown"
```
**Analyze:** Content structure, depth, gaps you can fill

### Step 4: Google Trends Proxy (No Direct API)
```
web_search query="google trends [topic]" count=5
web_search query="[niche] searches increasing 2026" count=10
```
**Extract:** Seasonal patterns, related searches, rising queries

### Output Format
```
SAGE TREND REPORT: [Topic] Content Strategy
Date: YYYY-MM-DD

TOP 10 CONTENT OPPORTUNITIES:
1. [Content Title/Topic] | Difficulty: [Low/Medium/High] | Intent: [Commercial/Informational/Navigational]
2. [Content Title/Topic] | Difficulty: [Low/Medium/High] | Intent: [Commercial/Informational]
...

REDDIT INSIGHTS:
- Top questions: [Q1], [Q2], [Q3]
- Pain points: [P1], [P2]
- Terminology: [T1], [T2]

COMPETITION:
- Top 3 competing articles: [URL], [URL], [URL]
- Content gap: [Specific angle not covered]

ACTIONABLE NEXT STEPS:
- Write [specific topic] targeting [keyword difficulty]
- Focus on angle: [unique approach]
- Include sections: [section1], [section2], [section3]

RESEARCH DATE: YYYY-MM-DD
```

---

## Workflow C: Music/Culture Trend Research (Milo/PsalMix)

**Goal:** Identify trending sounds, cultural moments, audience-safe content opportunities.

### Step 1: Music Trend Search
```
web_search query="trending clean music 2026" count=10 freshness="pw"
web_search query="family friendly music trends 2026" count=10
web_search query="viral TikTok sounds wholesome" count=10
```
**Look for:** Artist names, song titles, sound characteristics, use cases

### Step 2: Reddit Community Signals
```
web_search query="site:reddit.com clean music recommendations" count=10
web_search query="site:reddit.com family friendly songs 2026" count=10
web_search query="site:reddit.com [music genre] trending" count=10
```
**Look for:** Community favorites, emerging artists, listener preferences

### Step 3: TikTok Trending Sounds
```
web_search query="site:tiktok.com trending sounds 2026" count=10
web_search query="site:tiktok.com family friendly sounds" count=10
```
**Note:** TikTok site search has limited results; focus on searches containing "tiktok trending"

### Step 4: Deep Dive
```
web_fetch url=[trending music list/blog] extractMode="markdown"
```
**Extract:** Song titles, artists, reasons for popularity, audience demographics

### Output Format
```
MILO TREND REPORT: [Genre/Category] Music Trends
Date: YYYY-MM-DD

TOP 10 TRENDING SOUNDS:
1. [Song] by [Artist] | Category: [Clean/Family-Friendly/Genre] | Confidence: HIGH
2. [Song] by [Artist] | Category: [Clean/Family-Friendly/Genre] | Confidence: MEDIUM
...

VIRAL OPPORTUNITIES:
- Sound: [Sound Title] | Platforms: [TikTok, Instagram, YouTube]
- Use case: [What creators use it for]
- Audience: [Demographics]

EMERGING ARTISTS:
- [Artist name] - [Reason for trend]
- [Artist name] - [Reason for trend]

CONTENT ANGLES:
- Covers/remixes of [trending song]
- Wholesome dance trends to [sound]
- [Genre] playlist curation

ACTIONABLE NEXT STEPS:
- License/use [song] for [project type]
- Create content featuring [viral sound]
- Partner with [artist/sound creator]

RESEARCH DATE: YYYY-MM-DD
```

---

## Workflow D: General Market Intelligence

**Goal:** Track competitor moves, seasonal trends, industry reports.

### Competitor Analysis
```
web_search query="[competitor name] [niche] 2026" count=10
web_search query="[competitor] new products features" count=10
```

### Seasonal Trend Tracking
```
web_search query="[niche] seasonal trends [month] 2026" count=10
web_search query="[niche] holiday buying guide" count=10
```

### Subreddit Monitoring
```
web_search query="site:reddit.com/r/[subreddit] [topic]" count=10 freshness="pw"
```

### Industry Reports
```
web_search query="[niche] market report 2026" count=10
web_search query="[industry] trends report" count=10
```

---

## Search Query Templates

**Universal Format:**
```
web_search query="[TEMPLATE]" count=10 freshness="pw|pm"
```

### Etsy/Products
- `[product type] trending products 2026`
- `site:reddit.com etsy [category] bestseller`
- `site:pinterest.com [style] home decor popular`
- `etsy printable [niche] best sellers`

### Content/SEO
- `[topic] trending 2026 articles`
- `site:reddit.com [niche] how to guide`
- `[keyword] what people search for`
- `[niche] blog post ideas`

### Music/Culture
- `[genre] trending songs 2026`
- `site:reddit.com [music style] recommendations`
- `site:tiktok.com [genre] sounds viral`
- `family friendly [music type] artists`

### General
- `site:reddit.com [niche] [question]`
- `[topic] market report 2026`
- `[competitor] [category] analysis`

---

## Freshness Parameters

Use `freshness` to filter by discovery time:

| Parameter | Time Range | Best For |
|-----------|-----------|----------|
| `"pw"` | Past week | Real-time trends, viral moments |
| `"pm"` | Past month | Emerging trends with staying power |
| `"py"` | Past year | Sustained trends, year-over-year changes |
| (omit) | Any time | Established trends, background info |

---

## Web Fetch: Deep Dive Extraction

When a search result looks promising, extract full content:

```
web_fetch url="https://reddit.com/r/[subreddit]/comments/[id]" extractMode="markdown"
```

**Good candidates for fetching:**
- Reddit threads with 100+ comments (rich discussions)
- Blog posts from established sources (detailed analysis)
- Trend reports and roundups (data-rich)
- Product reviews and comparisons (detailed context)

---

## Pro Tips

### 1. **Corroborate with Multiple Sources**
- HIGH confidence: 3+ independent sources mention the trend
- MEDIUM confidence: 1-2 sources, recent publication
- LOW confidence: 1 source or older than 2 weeks

### 2. **Time-Sensitivity**
- Always include `Date: YYYY-MM-DD` in reports
- Trends change rapidly; research older than 1 month may be outdated
- Use `freshness="pw"` for current market conditions

### 3. **Reddit Gold Mines**
- Sort searches by "most helpful" (implicit in Brave Search)
- Look for comments with 100+ upvotes (community validation)
- Check post age (recent = still relevant)

### 4. **Pinterest for Visual Trends**
- Searches return trending pins at top
- Indicates design preferences, color trends, styling
- Particularly valuable for Etsy mockup inspiration

### 5. **Combine Queries**
- Use multiple queries per workflow (cast a wider net)
- Look for overlaps (if 5 sources mention the same product, it's hot)

### 6. **Context Matters**
- For Scout: Focus on search volume, price, repeat mentions
- For Sage: Extract actual user questions and pain points
- For Milo: Emphasize family-friendly/clean tags, artist names

---

## When to Escalate

If initial research doesn't yield clear results:

1. **Refine query** — Add specificity (category, audience, timeframe)
2. **Try different sources** — Reddit weak? Try Pinterest
3. **Expand timeframe** — Use `freshness="pm"` instead of `"pw"`
4. **Manual validation** — Fetch top 2-3 results and read carefully
5. **Get baseline data** — Search "[niche] statistics 2026" for context

---

## Output Checklist

Every trend research report should include:

- [ ] Date of research (YYYY-MM-DD)
- [ ] Top 10 findings (specific, actionable)
- [ ] Source URLs for all findings
- [ ] Confidence level (HIGH/MEDIUM/LOW per finding)
- [ ] Agent-specific insights (Scout = demand, Sage = competition, Milo = platform opportunity)
- [ ] Actionable next steps (3-5 concrete actions)
- [ ] Trend lifecycle assessment (emerging/growing/peaking/declining)

---

## Examples

### Scout: Etsy Trend Search
**Query:** "wall art trending products 2026"
**Result:** "10 trending home decor wall art prints from design blogs and Etsy bestsellers"
**Confidence:** HIGH (multiple corroborating sources)
**Next step:** Research design styles on Pinterest, check Everbee for keyword difficulty

### Sage: SEO Opportunity
**Query:** "site:reddit.com interior design what content do people want"
**Result:** "Users asking for room makeover guides, small space tips, budget-friendly ideas"
**Confidence:** HIGH (direct user intent from 500+ comments)
**Next step:** Create "small apartment interior design" guide targeting identified questions

### Milo: Music Trend
**Query:** "trending clean music 2026"
**Result:** "Indie folk, acoustic pop, and wholesome hip-hop gaining traction; specific artists identified"
**Confidence:** MEDIUM (3 blog sources + 1 Reddit thread)
**Next step:** License indie folk tracks for PsalMix content, monitor rising artists

---

**Last Updated:** Feb 7, 2026  
**For:** Sage (SEO), Scout (Etsy), Milo (PsalMix)
