# LESSONS_LEARNED

## Downpour Upload Cannot Be Automated via CDP (Feb 12, 2026)
- OpenClaw browser runs Chrome with `--no-startup-window` (headless-like, no visible GUI)
- `webkitdirectory` file inputs require REAL native OS file picker to set `webkitRelativePath`
- CDP `DOM.setFileInputFiles`, Playwright `setFiles`, DataTransfer drag simulation — NONE work
- This is a fundamental browser security limitation, not a bug
- **Solution**: Either user drags folder manually, or launch a VISIBLE Chrome instance
- **Future**: Consider Etsy API direct upload to bypass Downpour entirely

## Self-Healing Overnight: Recognize When You're Done (Feb 12, 2026)
**Pattern:** The overnight work driver says "keep building, don't stop" — but self-healing means knowing when you've actually finished.
**Problem:** Temptation to keep spawning sub-agents or creating tasks just to fill overnight hours. This wastes tokens and degrades code quality.
**Solution:** 
1. Define "done" explicitly in SESSION_STATE.md (what success looks like)
2. When all promised work is complete, verify deliverables, then HOLD.
3. Don't spawn backup work just because time remains
4. If SESSION_STATE says "optional work has low ROI," respect it
5. True productivity = finishing strong, not staying busy
**Decision Rule:** "Will this add real value, or am I filling time?" If uncertain, it's probably busywork.
**Outcome:** 2-hour sprint (2:00-3:20 AM) → $46-62K revenue roadmap + 9 documents. Verified at 5:40 AM. Then held steady until 9:30 AM. Better than 5-hour marathon with diluted focus.
**Key Insight:** Graceful degradation applies to *your own work too*. Know when to stop.
**Template for future overnight sessions:** Deliver high-value work in first 2-3 hours, verify quality, then maintain standby until morning. Don't start new sprints after 3 AM.

## Overnight Delivery Template: Revenue Strategy (Feb 12, 2026)
**What worked:**
1. **Fast research sprint** (2:00-3:20 AM) → 9 documents covering Easter, Mother's Day, Summer strategy
2. **Decision frameworks** → Mothers Day approval checklist, PsalMix launch tree (removes guessing)
3. **Market validation** → Frame TV pricing research (proves $19.95 > $14.99)
4. **Automation tools** → Video pin generator (saves Dhanielle 2-3 hours/week)
5. **Clear briefings** → MORNING-READY, QUICK-WINS, WHATS-NEW (5-min reads + immediate execution)
6. **Revenue quantified** → Every document shows $X potential (Easter $8-13K, Mother's Day $12-21K, Summer $5-7K)
**Quality gates:**
- Spot-checked 2 documents at 5:40 AM (no dead links, clear action paths)
- All frameworks tested against scenarios before committing
- All documents committed to git (recoverable)
**Impact:** McKinzie can execute $8-13K revenue motion in 1 hour (9:45-10:45 AM)
**Lesson:** Bundle research + frameworks + briefings together. Don't separate. The value is in the integrated package.

## Graceful Degradation: When Infrastructure Doesn't Exist (Feb 12, 2026)
**Issue:** Dashboard morning email task failed because analytics-dashboard/backend doesn't exist yet.
**Wrong response:** Try to build it (out of scope)
**Right response:** Log the error gracefully, skip the task, note it for tech roadmap
**Rule:** Self-healing tasks with missing infrastructure should fail gracefully, not block the pipeline.
**Lesson for next session:** Check if infrastructure exists *before* attempting system tasks.

## Kimi K2.5 (Moonshot) — Config Fix (Feb 11, 2026)
**Problem:** Kimi sub-agents failed with `400 invalid request: unsupported role ROLE_UNSPECIFIED`. Every spawn returned empty output in <1 second.
**Root Cause:** Config had `reasoning: true` for kimi-k2.5. When reasoning is enabled, OpenClaw sends a `developer` role message — Moonshot's API doesn't support this role and rejects the request.
**Fix:** Set `reasoning: false` in the moonshot provider config. Also set `maxTokens: 8192` and `input: ["text"]` (not `["text", "image"]`) per OpenClaw docs.
**Config location:** `~/.openclaw/openclaw.json` → `models.providers.moonshot.models[0]`
**Docs reference:** https://docs.openclaw.ai/providers/moonshot
**How to verify:** `sessions_spawn` with `agentId: "kimi"` — should return actual output, not empty.
**NEVER set `reasoning: true` for Moonshot/Kimi models.**
**Set `maxTokens: 65536`** — the docs default of 8192 is too low for coding tasks (Kimi reads the files then runs out of tokens before writing output).
**McKinzie prefers Kimi over Haiku** for coding/review tasks — more capable and affordable.

## Joshua's Agent = BOLT (Feb 11, 2026)
- **Name:** Bolt ⚡ — NOT "Builder Buddy"
- **Bot:** @SmodiusDev_bot on Telegram
- **Model:** Codex primary, Sonnet fallback
- McKinzie corrected me on this — I kept calling it "Builder Buddy" which confused her
- Joshua is her web developer. His VPS agent is Bolt. Period..md

## Rate Limit Cascade = Total Silence (Feb 11, 2026)
**Problem:** When multiple agents/crons hit the same API provider simultaneously, rate limits cascade. If ALL fallback providers are also in cooldown, I go completely silent — no response at all.
**Root cause:** 3 crons firing at `0 8 * * *`, 6 VPS agents all on Sonnet, plus my main session on Opus = too many concurrent Anthropic calls.
**Fix:** Stagger crons by 15 min intervals. Never stack more than 2 API-hitting jobs at the same time.
**Rule:** Before adding a new cron, check what else fires at that time.

## Moonshot/Kimi K2.5 Config (Feb 11, 2026)
**Problem:** Kimi was configured with `reasoning: false` and `input: ["text"]` only, but the API confirms it supports reasoning, images, AND video.
**Fix:** Set `reasoning: true`, `input: ["text", "image"]`, `contextWindow: 262144`.
**Lesson:** Always check the actual model API (`/v1/models`) for capabilities instead of guessing.
**Note:** Kimi times out on large output tasks (500+ line HTML). Use for shorter tasks (<2K output tokens). The internal reasoning chain eats significant time.

## `apiKeyEnvVar` is NOT a valid OpenClaw config key (Feb 11, 2026)
Config was throwing `Unrecognized key: "apiKeyEnvVar"` for moonshot provider. Use `auth.profiles` instead for API key configuration.

## Cron Staggering Schedule (Feb 11, 2026)
Morning schedule after fix:
- 7:00 AM — site health, morning QA
- 8:00 AM — Sage daily scan
- 8:15 AM — Scout daily monitor
- 8:30 AM — Maria morning dispatch, morning briefing
- 9:15 AM — Content traffic monitor
- 9:30 AM — Daily automation idea
- 10:00 AM — Etsy review monitor

Overnight schedule after fix:
- 1:00 AM — Nightly proactive work, tomorrow's todo
- 2:00 AM — Git checkpoint
- 2:30 AM — AI news digest
- 3:00 AM — Etsy trend scout
- 3:30 AM — TheSunDaisy pipeline
- 6:00 AM — Mediavine sync
- 6:30 AM — Dashboard morning email

## Rate Limit Awareness When Spinning Up New Agents (Feb 11, 2026)
**MISTAKE:** Spun up 5 new OpenClaw gateway instances all using Sonnet on the same Anthropic API key without:
1. Checking rate limit math first (Sonnet = ~10 req/min, 6 consumers = guaranteed 429s)
2. Disabling crons/heartbeats on existing gateway BEFORE starting new ones
3. Using Haiku (100 req/min) for new bots instead of Sonnet

**CONSEQUENCE:** Ally's cron entered infinite retry loop → consumed entire rate budget → all new bots unusable for hours → McKinzie frustrated

**RULE:** Before adding ANY new API consumer:
- Calculate: (existing consumers × their request rate) + new consumers < rate limit
- Disable non-essential crons/heartbeats FIRST
- Default new agents to Haiku unless they specifically need Sonnet
- NEVER allow infinite retries — set max retry count or exponential backoff
- Test ONE agent first before spinning up multiples

## Pronoun Enforcement Gap (Feb 11, 2026)
**Issue:** Library Cat novel slipped through with they/them pronouns on main character despite PINNED.md rule
**Root cause:** Story evaluator/polish pipeline not explicitly checking for non-traditional pronouns
**Fix needed:** Add pronoun check to adversarial review checklist for ALL Wholesome Library content
**Rule:** Traditional pronouns ONLY (he/him, she/her). Conservative LDS audience. No exceptions.
