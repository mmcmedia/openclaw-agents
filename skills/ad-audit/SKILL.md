# Ad Audit — Paid Advertising Analysis for OpenClaw

## When to Use
Analyzing and optimizing paid advertising campaigns across Meta (Facebook/Instagram), Google, TikTok, and other platforms. Use for:
- FB bonus content optimization (We Heart This)
- Etsy shop ad strategy (TheSunDaisy, etc.)
- Pre-launch planning (PsalMix)
- General ad performance audits

## Based On
Claude-ads skill by AgriciDaniel (https://github.com/AgriciDaniel/claude-ads) — adapted for OpenClaw.

---

## Quick Commands

| Task | Ask Me |
|------|--------|
| FB bonus audit | "Audit my We Heart This FB bonus setup" |
| Etsy strategy | "Create an Etsy ad strategy for TheSunDaisy" |
| Meta checklist | "Run the 46-point Meta audit checklist" |
| Benchmarks | "Show me paid ad benchmarks for [platform]" |
| Creative fatigue | "Check if my FB content has creative fatigue" |

---

## Meta Ads Audit — 46 Point Checklist

### Pixel / CAPI Health (Critical — 30% weight)

| Check | What to Verify | Tool/Location |
|-------|----------------|---------------|
| M01 — Pixel installed | Firing on all pages | Meta Events Manager |
| M02 — CAPI active | Server-side events sending | Events Manager → Settings |
| M03 — Event deduplication | event_id matching ≥90% | Events Manager → Test Events |
| M04 — EMQ ≥8.0 | Event Match Quality for Purchase | Events Manager |
| M05 — Domain verified | Business domain verified | Business Manager |
| M06 — AEM configured | Top 8 events prioritized | Events Manager |
| M07 — Standard events | Using Purchase, AddToCart, Lead | Event setup |
| M09 — Attribution window | 7-day click / 1-day view | Ad set settings |

**Action for FB Bonus:**
- Check EMQ score in Events Manager
- Verify domain is verified
- Ensure attribution is 7-day click / 1-day view

---

### Creative — Diversity & Fatigue (30% weight)

| Check | Target | Warning Sign |
|-------|--------|--------------|
| M25 — Format diversity | ≥3 formats (static, video, carousel) | Only 1 format used |
| M26 — Creative volume | ≥5 creatives per ad set | <3 creatives |
| M27 — Video aspect ratios | 9:16 vertical for Reels/Stories | No vertical video |
| M28 — Creative fatigue | No CTR drop >20% over 14 days | CTR drop >20% + frequency >3 |
| M29 — Hook rate | <50% skip rate in first 3s | >70% skip rate |
| M31 — UGC content | ≥30% UGC/social-native | <10% UGC |
| M-CR1 — Creative freshness | New creative in last 30 days | >60 days no new creative |
| M-CR2 — Frequency (prospecting) | <3.0 in 7 days | >5.0 = exhausted |
| M-CR4 — CTR | ≥1.0% | <0.5% |

**FB Bonus Specific:**
- Your hair graphics + collages = UGC-style ✅
- Refresh creative every 3-4 weeks
- Watch frequency — if >5, audience is exhausted

---

### Account Structure (20% weight)

| Check | Best Practice | Common Error |
|-------|---------------|--------------|
| M11 — Campaign count | ≤5 per country/funnel | >8 = over-fragmented |
| M13 — Learning phase | <30% in "Learning Limited" | >50% = structure problem |
| M14 — Learning resets | No edits during learning | Frequent resets kill performance |
| M16 — Audience overlap | <20% between ad sets | >30% = significant overlap |
| M17 — Budget distribution | All ad sets ≥$10/day | Ad sets <$5/day |
| M36 — Bid strategy | Cost Cap for margin protection | Bid Cap below historical CPA |
| M37 — Frequency cap | Campaign-level <4.0 (7-day) | >6.0 |
| M39 — UTM parameters | All ad URLs tagged | No UTMs = no GA4 attribution |

---

### Audience & Targeting (20% weight)

| Check | Action |
|-------|--------|
| M19 — Audience overlap | Check Audience Overlap tool in Meta |
| M20 — Custom Audience freshness | Refresh website audiences within 180 days |
| M23 — Exclusion audiences | Exclude purchasers from prospecting |
| M24 — First-party data | Upload customer list for Lookalikes |

---

## Meta Benchmarks for Content/E-commerce

| Metric | Target | Notes |
|--------|--------|-------|
| **ROAS** | 2.19 (median), 4.52 (ASC) | Advantage+ Shopping performs 2x |
| **CPC** | $0.70-$1.32 | Jan 2026: $0.85 (24% below prior year) |
| **CTR** | ≥1.0% | <0.5% = fail |
| **Frequency** | <3 (warning >5) | >5 = audience exhausted |
| **Creative refresh** | Every 3-4 weeks | For top-of-funnel content |
| **EMQ** | ≥8.0 | 87% of advertisers below this |

---

## E-commerce Ad Strategy (for Etsy Shops)

### Recommended Platform Mix

| Platform | Budget % | Role |
|----------|----------|------|
| Meta (FB/IG) | 50-68% | Primary — Prospecting + ASC |
| Google Shopping | 23-30% | High-intent product searches |
| TikTok | 5-15% | Product discovery, UGC |
| Email | 5% | Retention, repeat purchase |

### Creative Requirements

| Platform | Min Creatives | Refresh Cadence |
|----------|---------------|-----------------|
| Meta ASC | 150+ in campaign | 2-4 weeks |
| Meta Standard | 5+ per ad set | 2-4 weeks |
| TikTok | 6+ per ad group | 5-7 days |

### Benchmarks

| Metric | Target |
|--------|--------|
| Meta ROAS | 2.19 (median), 4.52 (ASC) |
| Google Shopping ROAS | 3.68 |
| Meta CPC | $0.70-$1.32 |
| Google Shopping CPC | $0.50-$1.50 |
| CPA (e-commerce) | $23.74 median |
| Min viable budget | $3,000+/month |

### What Works for E-commerce Creative

- **UGC unboxing/review** — authentic customer content (Spark Ads ~3% CTR vs ~2% standard)
- **Product demos** — show product in use
- **Before/after** — transformation content
- **Price anchoring** — was/now pricing
- **Social proof** — review count, star ratings, "best seller" badges
- **Lifestyle imagery** — product in context

### The "3x Kill Rule"

> **Any ad group with CPA >3x target gets flagged for immediate pause**

This prevents wasted spend on underperforming campaigns.

---

## FB Bonus Content Optimization

### Why Some Posts Hit $159 vs $0.11

Based on Meta audit checklist and your data:

**High Performers ($100+):**
- Specific hair styles/colors ("Short hair, don't care!")
- Aspirational framing
- UGC-style graphics/collages (not polished studio)
- Likely fresher creative (not fatigued)

**Low Performers ($0-0.11):**
- Generic content
- Overused creative (fatigue)
- Wrong audience targeting
- Frequency too high

### Action Items

1. **Audit creative freshness** — When was each graphic last refreshed?
2. **Check frequency** — Are you showing the same content too often?
3. **Format diversity** — Test video if only using static
4. **EMQ check** — Verify Event Match Quality in Meta Events Manager
5. **UTM tracking** — Add UTM parameters for GA4 attribution

---

## Mobile App / SaaS Strategy (for PsalMix)

### Platform Mix

| Platform | Primary Use |
|----------|-------------|
| Meta | App installs, lookalike audiences |
| Google UAC | Universal App Campaigns |
| Apple Search Ads | iOS app store visibility |

### Key Metrics

| Metric | Target |
|--------|--------|
| CPI (Cost Per Install) | Varies by category |
| LTV:CPI ratio | >3:1 for sustainable growth |
| Day 1 retention | >40% |
| Day 7 retention | >20% |

### Tracking Requirements

- MMP (Mobile Measurement Partner) — Adjust, AppsFlyer, Branch
- In-app event tracking
- SKAdNetwork (iOS) compliance

---

## Quality Gates (Hard Rules)

Never violate these:

1. **Never Broad Match without Smart Bidding** (Google)
2. **3x Kill Rule** — CPA >3x target = pause immediately
3. **Budget sufficiency** — Meta ≥5x CPA per ad set
4. **Learning phase protection** — No edits during active learning
5. **Compliance** — Check Special Ad Categories (housing/employment/credit/finance)
6. **Creative** — Never silent video on TikTok (sound-on platform)
7. **Attribution** — Default to 7-day click / 1-day view (Meta)

---

## Quick Wins Checklist

### 5-Minute Fixes

- [ ] M05 — Verify domain in Business Manager
- [ ] M09 — Set attribution to 7-day click / 1-day view
- [ ] M35 — Confirm attribution settings
- [ ] M39 — Add UTM parameters to all URLs

### 15-Minute Fixes

- [ ] M02 — Set up CAPI Gateway (simplified server-side)
- [ ] M23 — Create Custom Audience exclusions for purchasers
- [ ] M25 — Add video if only using static images

### This Week

- [ ] M04 — Improve EMQ score to ≥8.0
- [ ] M28 — Audit creative for fatigue (CTR drop >20%)
- [ ] M31 — Ensure ≥30% UGC-style content
- [ ] M-CR1 — Test new creative if >30 days old

---

## Full Audit Process

Ask me to run: **"Run a full Meta audit for [site/shop]"**

I will:
1. Check all 46 checkpoints
2. Score each (Pass/Warning/Fail)
3. Calculate weighted health score
4. Prioritize fixes (Critical/High/Medium/Low)
5. Provide specific action items

---

## Reference Files

Full analysis cloned from claude-ads:
- `/projects/claude-ads-repo/ads/references/meta-audit.md` — 46-point checklist
- `/projects/claude-ads-repo/ads/references/benchmarks.md` — Platform benchmarks
- `/projects/claude-ads-repo/skills/ads-plan/assets/ecommerce.md` — E-commerce strategy
- `/projects/claude-ads-repo/skills/ads-plan/assets/mobile-app.md` — App launch strategy
- `/projects/claude-ads-repo/skills/ads-plan/assets/saas.md` — SaaS strategy

---

## Example Requests

**"Audit We Heart This FB bonus setup"**
→ I'll run through the 46-point Meta checklist with FB bonus-specific context

**"Create Etsy ad strategy for TheSunDaisy"**
→ I'll reference the ecommerce template with specific platform mix, creative requirements, and benchmarks

**"Check if my FB content has creative fatigue"**
→ I'll ask about CTR trends, frequency, and last creative refresh

**"Show me paid ad benchmarks"**
→ I'll provide Meta, Google, TikTok, LinkedIn benchmarks relevant to your business
