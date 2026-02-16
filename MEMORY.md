# MEMORY.md

## ⚠️ CRITICAL: Kimi K2.5 Config (Feb 11, 2026)
- **reasoning MUST be `false`** — Moonshot doesn't support `developer` role
- **maxTokens: 8192** — per OpenClaw docs
- **input: ["text"]** — no image support via this API
- Config: `~/.openclaw/openclaw.json` → `models.providers.moonshot`
- Docs: https://docs.openclaw.ai/providers/moonshot

## ⚠️ CRITICAL: OpenAI Models (Feb 3, 2026)
**GPT-4o is DEPRECATED — NEVER USE IT**
- Only use: `gpt-5-mini` or `gpt-5.2`
- This applies to ALL projects
- GPT-4o-mini is also deprecated — Maria's Long-Term Memory

## Wholesome Media Bundle Strategy (Feb 8, 2026)
McKinzie's vision: One-stop shop for wholesome family media. Like Disney+/Hulu bundle.
- **PsalMix** — Music streaming (verified clean)
- **Wholesome Library** — Curated children's stories
- **Bundle name ideas:** "Wholesome Family Membership", "Wholesome Media Pack"
- **PsalMix also includes:** Podcasts + daily devotionals (McKinzie already exploring, Feb 8)
- **Phase 1 additions:** Audio stories (TTS of WL stories), Activity packs (printables tied to stories)
- **Phase 2:** Curated watch list + games guide (reviews, not building games)
- **Phase 3:** AI-animated video shorts from Wholesome Library stories
- Content flywheel: One story seed → audiobook → activity pack → devotional → blog post → social content
- Frame as "MEMBERSHIP" not subscription (Grüns insight — belonging > billing)
- Cross-promotion between PsalMix ↔ Wholesome Library after both launch
- Micro-influencer strategy approved for PsalMix + WL (NOT Etsy for now)
- Focus on PsalMix + WL, less on Etsy for now

## Wholesome Library v2 — Key Decisions
- **Billing: Creem (NOT Stripe)** — McKinzie decided Feb 7, 2026. Use creem.io for checkout, subscriptions, billing portal.
- Creem API: `https://api.creem.io`, auth via `x-api-key` header, TypeScript SDK: `creem_io`
- Creem supports: subscriptions, one-time, trials, pause/resume, customer portal, webhooks, discount codes

## ⚠️ ACTIVE LEGAL MATTER — Meta Pixel Lawsuit (DO NOT FORGET)

**Case:** C. Higgins v. MMC Media LLC
**Filed:** January 30, 2026 via JAMS Arbitration
**Law Firm:** Swigart Law Group
**Amount Claimed:** $30,000
**Website:** weheartthis.com
**Allegation:** Facebook Pixel violates California CIPA (privacy law) by "intercepting" visitor data
**Insurance:** biBerk Professional Liability - Policy #N9PL978371
**Response Deadline:** ~Feb 13-27, 2026 (14-30 days from filing)

**Status updates:**
- Feb 3: McKinzie confirmed they filed with JAMS (not just demand letter). Business only operates in Utah.

**Context:** This is a common pattern — Swigart files hundreds of these FB Pixel lawsuits. Many settle for $5-10k. Key questions: Did biBerk accept the claim? Does Utah-only operation affect California jurisdiction?

---

## Communication Preferences
- Uses acronyms for sites: HH (Hello Hayley), WHT (We Heart This), MF (Melrose Family), WHC (WeHeartCozy)
- Wants me to be PROACTIVE — do things, don't ask permission for things I can handle
- Prefers concise, actionable communication

## What I Do Well (Feb 2, 2026 - McKinzie's feedback)
1. **Dashboards** - Extremely helpful for visibility
2. **Automation scripts/systems** - Saves her from tedious tasks
3. **Business coaching (Leila mode)** - Helping her think like a business professional

## What's Annoying (Feb 2, 2026 - McKinzie's feedback)
1. **Context loss** - When I start working on something entirely different because context got messed up
2. **Forgetting mid-conversation** - Losing thread of what we were discussing
→ SOLUTION: Write more to SESSION_STATE.md and daily logs, search memory more aggressively

## About McKinzie
- Mom of 3, homeschools, LDS, night owl, deals with anxiety
- Husband helps with kids sometimes, also has a sitter
- Works fragmented hours: morning check-in, 9:30 AM-1ish PM, sometimes afternoon, then 9 PM-midnight
- Mountain Time (America/Denver)
- Named me Fitz on Jan 27, 2026 — first real session together
- Renamed me Maria on Jan 30, 2026 — "YASSS girl energy but still a focused go-getter" 💃🏼
- Had a previous relationship with Claude on claude.ai — daily briefings, deep dives, etc.

## Business Mental Model
McKinzie runs a portfolio of content sites + Etsy shops + a SaaS app. She's spread thin and the #1 thing I can do is help her prioritize ruthlessly and not add to her overwhelm.

### What Actually Makes Money (Jan 2026)
1. **Hello Hayley** — Usually #1. Got hit by Pinterest algo update starting EARLY DECEMBER 2025. Revenue dropped significantly. URGENT to investigate.
2. **Melrose Family** — ~$3k/month, steady. Second biggest.
3. **We Heart This** — Was SEO-driven, killed by Google HCU. Now ads ($700-1k/mo) + FB bonus (~$100/day, peaked $300). FB bonus is the bright spot — help her scale it.
4. **Smaller sites (4)** — $50-300/month each. Low maintenance.
5. **Newer sites (several)** — ~1 year old, few thousand pageviews, not yet monetized. Might be time to cut losses.
6. **Etsy shops (6)** — Brand new (Jan 2026). TheSunDaisy is the winner ($2k first month). Others still finding footing.

### Revenue Target
- Goal: $20-30k/month
- Floor: $15k/month (bills + family)

## Key Lessons & Principles
- She gets overwhelmed easily — keep communication concise and actionable
- Proactive > reactive. Come with answers, not questions.
- She's testing a LOT of things simultaneously — help her identify what to double down on vs. cut
- Pinterest is core to her traffic strategy — any algo changes are business-critical
- FB bonus program is an underexplored revenue stream with real upside
- TheSunDaisy Etsy success suggests LDS niche digital prints have strong demand

## Team
- Sandee: graphic designer (Etsy)
- Editors: polish KoalaWriter content
- Dev(s): n8n automation, PsalMix

## Key Constraints
- **get late.dev: ANALYZE ONLY. Never post content.** McKinzie was explicit about this.
- FB bonus on We Heart This: hair graphics + collages are what's working
- Greg from Wealth Hacker = $30k/month FB bonus benchmark to study

## Active Priorities (as of Jan 28, 2026)
1. 🔴 Hello Hayley Pinterest traffic drop — investigate and diagnose (RESEARCH IN PROGRESS)
2. 🔴 We Heart This FB bonus — scaling from $100/day (RESEARCH IN PROGRESS)
3. 🟡 Project management dashboard — kanban tool for workflow (BUILDING TONIGHT)
4. 🟡 n8n Pinterest automation — almost done with dev
5. 🟡 PsalMix — App Store submission approaching + pre-launch social content
6. 🟡 TheSunDaisy — needs more product listings, finding what sells
7. 🟡 Google Sheets Data Hub — set up master sheets (Option A for Etsy data)
8. 🔵 Other Etsy shops — monitoring ROAS, still experimental

## Security Framework (Jan 28, 2026)
- SECURITY.md created and filesystem-locked (chmod 444 — I cannot modify)
- 4-tier action classification: GREEN (free) → YELLOW (log) → RED (ask first) → BLACK (never)
- Overnight lockdown: 11 PM - 8 AM = GREEN only
- Secrets moved to ~/.clawdbot/.env (not in config files)
- ⚠️ Need to rotate Telegram + Gateway tokens (reminder set for morning)
- get late.dev = ANALYZE ONLY (absolute, in SECURITY.md)
- I never read credential files, never include keys in messages
- Git versioning on workspace for recovery
- Audit log: memory/audit-YYYY-MM-DD.md

## Etsy Data Strategy
- Option A: Google Sheets as middleware (McKinzie exports data, I analyze)
- NOT getting Etsy shop logins (by design — good security call)
- Etsy API applied for but not yet approved — read-only scopes only when it comes
- Everbee for public-facing competitor data (have access)

## Art Generation Tools
- Midjourney (still active)
- Ideogram
- Nano Banana Pro on Genspark account

## Model Routing Setup (Jan 27, 2026)
- Default: Opus 4.5 (strategy, planning, direct conversations)
- Fallback: Sonnet 4.5 (lighter tasks, sub-agents)
- Available: OpenAI Codex/GPT-5.2 (coding tasks, via ChatGPT Team subscription)
- TODO: Add Haiku 4.5 for simple tasks/cron jobs

## Music Video App (Jan 31, 2026)
- **Location:** `/projects/music-video-app/`
- **GitHub:** https://github.com/mmcmedia/music-video-app.git
- **Status:** Major bugfix blitz completed overnight
- **Result:** 73 issues audited → ~60 fixed, app now stable
- **Key docs:** `OVERNIGHT-WORK-SUMMARY.md`, `CODE-AUDIT-2026-01-30.md`
- **How to run:** `cd /projects/music-video-app && npm run dev` (port 3002-3003)
- **Tech:** Next.js 16, Supabase, Remotion, Pexels/Sora AI video
- **Learned:** Template API returns `{data:[...]}`, Supabase types need `@ts-ignore` for updates

## Wholesome Library — Story Seed Pipeline Rules (Feb 8, 2026)
- **PASS or KILL — no revision.** McKinzie decided Feb 8.
- Seeds either PRODUCE (7.0+, no flags) or get KILLED
- Generating new seeds is cheaper than revising bad ones
- KILL criteria: <7.0 score, BRAND_VIOLATION, DARK (unless 8.0+), PREACHY
- First 1,000 stories: McKinzie reviews EVERY one before publishing
- Self-learning: her approval/rejection patterns train the evaluator over time
- 68% PRODUCE rate on first batch (68/100). Goal: 80%+ by batch #3
- Review queue: `/projects/wholesome-library-2026/review-queue/{pending,approved,rejected}`

## VPS Bot Infrastructure (Feb 11, 2026)
- **API key split**: Key 1 → Main+Sage+Scout | Key 2 (`/etc/openclaw/env-key2`) → Dev+Milo+Pixel
- **Crash guards**: All bots have StartLimitBurst=3, Restart=on-failure
- **Health check**: `/home/openclaw/team/shared-scripts/bot-health.sh` (cron every 15 min)
- **Bot tokens**: Sage=@MMCSageBot, Milo=@MMCPsalmixBot, Dev=@MMCDeveloperBot, Pixel=@MMCDesignBot, Scout=needs new token
- **Standalone ports**: Sage=19001, Milo=19003, Dev=19010, Scout=19020, Pixel=19030
- **All heartbeats disabled** (`every: "0"`) — bots only respond when messaged

## Analytics Dashboard v2 (Feb 11, 2026)
- **URL**: https://dashboard.mmcmedia.cloud/analytics/
- **Backend**: Port 3081, systemd service `analytics-v2-api`
- **Design**: Dark theme, neon pink/magenta + teal. Mockups in `/projects/analytics-dashboard/design-reference/`
- **PRD**: `/projects/analytics-dashboard/PRD-ANALYTICS-V2.md`
- **Auth**: Same as team dashboard (mckinzie + dhanielle)
- **GA4 creds on VPS**: `/home/openclaw/repos/.ga4-oauth.json` + `.ga4-tokens.json`

## Security Hardening (Feb 11, 2026)
- Dale Tamargo removed from VPS (fired employee)
- Fail2ban active on VPS, SSH key-only, port 3050 closed
- All Telegram bots: groupPolicy=allowlist, only McKinzie's IDs allowed
- Mac Mini: FileVault ON, but firewall OFF + auto-updates OFF (needs McKinzie's sudo)

## Dhanielle Dashboard Access (Feb 11, 2026)
- Username: `dhanielle` / Password: `DhanielleMMC2026!`
- Added to `/etc/nginx/.htpasswd` on VPS

## VPS Agent Gender Notes (Feb 9, 2026)
- **Pixel** — she/her (McKinzie thinks of her as a girl)
- **Scout** — she/her (McKinzie thinks of her as a girl)
- Other agents: Milo, Dev, Sage, Ally — default pronouns unless McKinzie says otherwise

## Dhanielle/Ally Setup (Feb 8, 2026)
- **Ally's email:** aiassistant@momsmakecents.com
- **VPS:** Hostinger at 76.13.108.6 (SSH access confirmed)
- **Dashboard URL:** https://dashboard.mmcmedia.cloud (nginx basic auth, username: mckinzie)
- **Dhanielle's dashboard:** Separate version — traffic, Pinterest, social, kanban. NO REVENUE.
- **GA4 for Ally:** Use same OAuth/service account as Maria
- **WordPress:** Dhanielle has creds, Ally does not need them
- **MMC Scheduling:** Dhanielle's email (dhnllsrn@gmail.com) already in allowed list

## Pinterest Algorithm Insights (Feb 10-12, 2026)
**Hello Hayley Traffic Drop Analysis:**
- Root cause: Dual algorithm hits (Google reduced Pinterest search visibility + Pinterest TransActV2 update)
- Industry-wide problem — not HH-specific. Many bloggers hit 90% losses.
- **TransActV2 system:** Analyzes 16,000 user actions (vs 100 before), prioritizes video/idea pins over static
- **Recovery strategy:** Video pins (15-30s), idea pins (swipe-through), refresh seasonal content, optimize board names
- **Realistic outcome:** 60-80% recovery possible (full recovery unlikely due to permanent algorithm shift)
- **Tools:** Video pin generator created (script automates headline variations + templates)
- **Timeline:** 60-90 days to see meaningful improvement. Weekly metrics: impressions, saves, clicks

## Video Pin Generator (Feb 12, 2026)
- **Script:** `/projects/hello-hayley-investigation/video-pin-generator.mjs`
- **Purpose:** Automate "create 10 video pins" task for HH Pinterest recovery
- **Usage:** `node video-pin-generator.mjs --generate-all`
- **Output:** JSON (pin concepts) + markdown (guide for Dhanielle)
- **Time saved:** 2-3 hours of manual work → 10 min script run
- **Impact:** Speeds up video pin creation, ensuring consistent quality headlines across all variations
