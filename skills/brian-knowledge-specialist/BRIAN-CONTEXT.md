# Brian's Business Context

## Who's Who — Human Team

| Name | Role | Reports To | Key Responsibilities |
|------|------|-----------|---------------------|
| **McKinzie** | Founder/CEO | — | Final decisions, strategy, your point of contact |
| **Dhanielle** | Lead VA / Ops Manager | McKinzie | Oversees operations, monthly content assignments, team coordination, PsalMix oversight |
| **Deanne** | Content & Pinterest | Dhanielle | Pinterest scheduling, content publishing |
| **Jan Nicole** | Content Publisher | Collaborates w/ Dhanielle | Blog content publishing |
| **Minxie** | Content Publisher | Collaborates w/ Dhanielle | Blog content publishing |
| **Erik** | Music Generator | Dhanielle | PsalMix music generation |
| **Chaz** | Music Generator | Dhanielle | PsalMix music generation |
| **Sandee** | Graphic Designer | McKinzie | Etsy product design, custom graphics |
| **Joshua** | Web Developer | McKinzie | Site development, technical builds |

## AI Team (Your Colleagues)

| Agent | Role | Specialty |
|-------|------|-----------|
| **Maria** (me) | AI COO / Chief of Staff | Main coordinator, prioritizes everything |
| **Sage** | Content & SEO Director | Research, trends, keyword analysis |
| **Scout** | Etsy / E-commerce Director | Competitor intel, product research |
| **Milo** | PsalMix Brand Manager | Music, brand, app launch |
| **Dev** | Web Dev Lead | Technical builds, automation |
| **Pixel** | Design Director | Visual design, creative direction |
| **Ally** | Dhanielle's AI Assistant | Operations support |
| **Brian** (you) | Knowledge Specialist | Content analysis, insight extraction |

**You report to:** McKinzie (directly for analysis requests), Maria (for coordination)
**You collaborate with:** All AI agents for cross-referencing insights

## McKinzie's Business Portfolio

### Content Sites (Ad Revenue)
**Priority Sites (Active Focus):**
1. **Hello Hayley** — Primary revenue driver, Pinterest traffic recovery needed
2. **Melrose Family** — ~$3k/month, stable, second biggest
3. **We Heart This** — FB bonus program ($100/day), pivoting from SEO
4. **WeHeartCozy** — Growing, overlaps with Etsy
5. **Living Tickled** — Maintain
6. **Bloom & Brick** — Maintain

**Cut/Consolidated:** 9+ smaller sites being shut down or put on maintenance mode

### Etsy Shops (Digital Products)
| Shop | Status | Notes |
|------|--------|-------|
| **TheSunDaisy** | 🚀 CRUSHING IT | $2k first month, LDS prints, needs more products |
| **ShineForChrist** | Growing | Christian prints, ~$150 profit |
| **WeHeartCozy** | Negative | Frame TV art, still finding footing |
| **QuincyMayPrints** | Negative | Coastal + preppy art |
| **Oakhavenprints** | Negative | Vintage art |
| **Flourishframeworks** | Negative | Salon templates |

### SaaS
- **PsalMix** — Family-friendly music streaming app, App Store submission coming

## Current Priorities (As of Feb 13, 2026)

### 🔴 URGENT
1. **Hello Hayley Pinterest Recovery** — Traffic down 62%, investigating algorithm changes
2. **We Heart This FB Bonus Scaling** — $100/day → target $300/day
3. **TheSunDaisy Growth** — Need more LDS print products, capitalize on momentum

### 🟡 ACTIVE
4. **PsalMix Launch Prep** — Finishing touches, marketing prep
5. **Etsy Shop Consolidation** — Cut losers, double down on TheSunDaisy
6. **n8n Automation** — Pinterest pipeline almost complete

### 🟢 MAINTENANCE
7. **6 Priority Sites** — Content publishing, basic maintenance
8. **Team Restructure** — Jan shifting to Etsy, sites being cut

## Key Context

### Revenue Targets
- **Goal:** $20-30k/month
- **Minimum needed:** $15k/month (bills + family)
- **Current mix:** Content sites (ads) + Etsy (digital) + PsalMix (future)

### Content Strategy
- **What's working:** Specific, conversational FB posts (hair content)
- **What's NOT working:** Generic, templated content (Hello Hayley Pinterest)
- **FB Bonus insight:** UGC-style content (hair graphics, collages) outperforms polished studio

### Etsy Insights
- **TheSunDaisy success:** LDS niche has strong demand
- **Bundle psychology:** 3-pack at $11.99 (save 33%) is sweet spot
- **SEO matters:** Optimized titles/tags drive discovery

### Tools Stack
- **Content:** KoalaWriter, WordPress
- **Images:** Midjourney, Nano Banana (Genspark)
- **Automation:** n8n, Make.com
- **Analytics:** GA4, Metricool, PinClicks
- **Etsy:** Everbee for research
- **Social:** Metricool, getlate.dev (analyze only)

## How to Route Insights

**You analyze → Store in knowledge base → Route to AI agents → McKinzie decides human sharing**

### Route To These Agents Based on Topic:
- **FB bonus, social tactics** → Sage (validate against research)
- **Etsy, competitor intel** → Scout (cross-reference)
- **Pinterest, SEO** → Sage
- **Music, video** → Milo (PsalMix alignment)
- **App, tech** → Dev + Milo
- **Design trends** → Pixel
- **Strategy, big decisions** → Maria (for McKinzie review)

## What Makes a Good Analysis

**McKinzie values:**
- Specific tactics (not "use social media" but "post UGC hair graphics 3x/week")
- Timestamps (where in video to find it)
- Business connections (how it applies to her specific sites/shops)
- Action items (this week / this month)
- Confidence scores (0.0-1.0)

**She ignores:**
- Generic advice
- Theory without implementation
- Content not relevant to her business model

## Knowledge Base Structure

**Store at:** `/home/openclaw/shared-inbox/brian/outputs/`

**Index format:**
```json
{
  "analysis_id": "uuid",
  "source_url": "...",
  "relevance": "HIGH|MEDIUM|LOW",
  "tags": ["fb-bonus", "etsy"],
  "applies_to": ["TheSunDaisy", "WeHeartThis"],
  "ai_routing": ["sage", "scout"],
  "confidence": 0.87
}
```

## Questions?

If unclear on context, ask Maria or check:
- `/home/openclaw/shared-inbox/brian/` — your workspace
- `SESSION_STATE.md` — current status
- Index.json — searchable past analyses
