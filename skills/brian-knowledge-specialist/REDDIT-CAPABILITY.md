# Brian - Reddit Analysis Capability

## Overview
Brian can now analyze Reddit posts, comments, and threads to extract insights, trends, and community sentiment.

## Supported Reddit Content

| Type | URL Pattern | What Brian Extracts |
|------|-------------|---------------------|
| Subreddit posts | `/r/subreddit/` | Top posts, trending topics |
| Specific post | `/r/subreddit/comments/` | Full post + comments |
| User profile | `/u/username/` | Post history, interests |
| Search results | `/search/?q=` | Relevant discussions |

## Analysis Framework

### For Subreddit Analysis
- **Hot topics:** What's trending right now
- **Recurring questions:** Common pain points
- **Sentiment analysis:** Positive/negative/neutral
- **Engagement patterns:** What gets upvoted
- **Community language:** Terms, abbreviations, inside jokes

### For Specific Posts
- **Original post:** Core question/topic
- **Top comments:** Highest-value responses
- **Contrarian views:** Dissenting opinions
- **Awarded comments:** Community-endorsed insights
- **Thread depth:** How discussion evolved

### For Business Insights
- **Product feedback:** What people love/hate
- **Feature requests:** Unmet needs
- **Competitor mentions:** Who's being discussed
- **Pricing sensitivity:** What people will pay
- **Trend identification:** Emerging patterns

## Extraction Methods

### Method 1: Reddit JSON API
Append `.json` to any Reddit URL:
```
https://www.reddit.com/r/etsy.json
https://www.reddit.com/r/etsy/comments/xyz.json
```

### Method 2: Pushshift API (for historical)
```
https://api.pushshift.io/reddit/search/submission/?subreddit=etsy&sort=desc&size=100
```

### Method 3: Web Scraping (fallback)
Use web_fetch for pages not accessible via API

## Reddit-Specific Output Format

```markdown
# Reddit Analysis: r/subreddit - Topic

## Subreddit Overview
- **Subscribers:** X
- **Active users:** X
- **Tone:** Professional/Casual/Supportive/etc.
- **Primary audience:** [Who participates]

## Key Insights

### 🔥 HIGH RELEVANCE

#### 1. [Specific finding]
**Source:** [Post/comment link]
**Upvotes:** X | **Awards:** X
**What it is:** [Clear explanation]
**Why it matters:** [Connection to your business]
**Community sentiment:** [Positive/Negative/Mixed]

### 🟡 MEDIUM RELEVANCE
...

### Community Language & Terms
- [Term]: [Meaning]
- [Abbreviation]: [What it stands for]

### Recurring Pain Points
1. [Pain point] - mentioned X times
2. [Pain point] - mentioned X times

### Trending Topics (Last 30 Days)
1. [Topic] - X posts, avg Y upvotes
2. [Topic] - X posts, avg Y upvotes

## Business Applications

### For [Your Business/Site]
[How these insights apply]

### Content Ideas
- [Specific post idea based on Reddit discussions]
- [FAQ to address common questions]

### Product/Service Opportunities
- [Gap in market identified]
- [Feature people are asking for]

## Action Items

### This Week
- [ ] Action 1

### This Month
- [ ] Action 2

---
*Analyzed from r/subreddit on [date]*
*Posts analyzed: X | Comments analyzed: X*
```

## Example Use Cases

### For Etsy Shops (TheSunDaisy)
**Request:** "Brian, analyze r/Etsy for digital product trends"

**What Brian finds:**
- Top complaint: "Can't find LDS-specific prints"
- Trending: "Bundle pricing is working for me"
- Insight: "Customers want instant download + print options"

### For FB Bonus (We Heart This)
**Request:** "Brian, analyze r/beermoney for FB bonus strategies"

**What Brian finds:**
- Recurring question: "What's the best time to post?"
- Trending tip: "Collage-style graphics getting more engagement"
- Warning: "Don't post same content to multiple pages"

### For PsalMix
**Request:** "Brian, analyze r/Christianity for music app feedback"

**What Brian finds:**
- Pain point: "Can't find clean music for kids"
- Feature request: "Want lyrics with songs"
- Competitor mention: "Spotify Christian playlists are hit/miss"

## Reddit Analysis Commands

**Via Telegram:**
- "Brian, analyze r/etsy for digital product trends"
- "Brian, read this Reddit post: [URL]"
- "Brian, what's the sentiment on [topic] in r/subreddit?"
- "Brian, find common questions in r/pinterest"

**Via Shared Inbox:**
Drop Reddit URLs in `/home/openclaw/shared-inbox/brian/inputs/`

## Limitations

- Can't access private subreddits
- Rate limited by Reddit API
- Historical data via Pushshift (may have gaps)
- Comments > 6 months may be archived

## Integration with Knowledge Base

Reddit insights stored alongside video/article analyses:
- Tagged: "reddit", "community-insights", "[subreddit-name]"
- Cross-referenced with video analyses
- Community sentiment tracked over time
