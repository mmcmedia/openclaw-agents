# Extended Agent Patterns & Templates

*Detailed patterns moved from AGENTS.md to keep core file lean. Search this via `memory_search` when needed.*

---

## 📋 Skill Auto-Detection Table

Before starting work, check if a skill exists for this task type:

| Task Type | Check Skill |
|-----------|-------------|
| UI/UX work | `ui-ux-designer`, `frontend-design` |
| Analytics | `ga4-analytics`, `data-analyst` |
| Etsy | `etsy-expert` |
| Content strategy | `content-strategist`, `seo-specialist` |
| Video work | `music-video-producer`, `shorts-creator`, `video-asset-manager` |
| Pinterest | `pinterest-strategist` |
| Apple Notes/Reminders | `apple-notes`, `apple-reminders` |
| PDF editing | `nano-pdf` |
| GitHub | `github` |
| Weather | `weather` |
| Transcription | `summarize`, `openai-whisper-api` |

---

## 🔀 Parallel Sub-Agents (Detailed)

For large projects, spawn multiple specialized agents:

```
Project: Build Analytics Dashboard
├── Agent 1 (codex): Build UI components
├── Agent 2 (codex): Build API endpoints  
├── Agent 3 (sonnet): Write documentation
└── Main (opus): Coordinate and integrate
```

**How to orchestrate:**
1. Break project into independent pieces
2. Spawn agents with clear, non-overlapping scope
3. Each agent works in separate files/folders
4. Main session monitors via `sessions_list`
5. When all complete, main integrates the pieces

**Rules:**
- Max 4 parallel agents (config limit)
- Each agent gets specific file paths to avoid conflicts
- Use labels to track: `overnight-ui`, `overnight-api`, etc.
- Final integration always done by main session

### Sub-Agent Completion Notifications Template
When spawning a sub-agent, include in the task:
```
"When complete, use sessions_send to notify main session:
'✅ [task-name] complete. Files: [list]. Ready for QA.'

If blocked or failed, notify:
'❌ [task-name] blocked: [reason]. Need: [what you need]'"
```

### Failure Recovery Playbook
**If a sub-agent fails:**
1. Check `sessions_list` for error status
2. Review its history: `sessions_history sessionKey=[key]`
3. Identify failure point
4. Options:
   - **Retry**: Spawn again with same task + "Previous attempt failed because: [reason]"
   - **Simplify**: Break into smaller tasks
   - **Escalate**: Note in memory, flag for McKinzie
5. Log failure + recovery action in memory file

**Common failures:**
- Timeout → Spawn with smaller scope
- Missing context → Include more detail in task
- Wrong files → Specify exact paths
- API error → Add retry logic to task instructions

---

## 📋 Auto-Update Kanban Templates

**When finishing a task with a kanban card:**

1. Read current cards.json
2. Find the card by ID
3. Update:
   - `column`: "done" (or "review" if needs McKinzie approval)
   - `updatedAt`: current timestamp
   - `notes`: Add completion summary
4. Write back to cards.json

**Template for card notes:**
```
**Completed [DATE]**
- What was built: [summary]
- Files created: [list]
- How to test: [instructions]
- Any issues: [or "None"]
```

---

## 📝 Session Transcript Summary Template

Quick capture to `memory/YYYY-MM-DD.md`:
```markdown
## Session: [time] - [brief topic]
**Did:** [1-2 sentences of what was accomplished]
**Decided:** [any decisions made]
**Next:** [what's pending]
**Files:** [any new/modified files]
```

**When to write:**
- After completing a task
- Before ending a long session
- When switching to a different topic
- After important decisions

**NOT needed for:**
- Quick Q&A
- Simple file edits
- Status checks

---

## 🔄 Session Handoff Protocol (Detailed)

**At the end of significant work sessions:**

1. **Document what you did** - Update `memory/YYYY-MM-DD.md` with clear summary
2. **Update Command Center** - Move cards, add notes, check off subtasks
3. **Update ACTIVE_PROJECTS.md** - Change "Last Touched" dates, update statuses
4. **Commit to git** - Save all work with descriptive commit message
5. **Write continuation notes** - In project README or daily memory

**Example handoff note:**
```markdown
## Session End: 2026-01-29 2:00 AM
**Completed:** Generated 11 coloring pages (weeks 13-23)
**Next:** Resume with week 24 (Saul anointed king)
**Blocker:** Need McKinzie to review style before continuing
**Files:** All saved in `/projects/come-follow-me-2026/generated/`
```

---

## 🔄 Sub-Agent Quality Control (Full Protocol)

**When spawning sub-agents for significant work, check the skill's QA policy and iterate if needed.**

### Skills with Automatic QA Enabled

These skills **always get QA and iteration** until quality bar is met:
- **ui-ux-designer** - Design is subjective, visual polish critical
- **web-developer** - UI/UX work needs visual polish, backend needs completeness
- **content-strategist** - Strategy must be well-reasoned and actionable

### QA Process

1. **After sub-agent completes:**
   - QA the work against original requirements
   - Check code quality, completeness, visual polish
   - Compare to any reference materials

2. **If incomplete or quality issues found:**
   - Create detailed feedback document (`TASK-NAME-FEEDBACK.md`)
   - Spawn iteration agent with feedback as context
   - Repeat until quality threshold met (max 3 attempts)

3. **If work is good:**
   - Document completion in daily memory
   - Report success to McKinzie

### Quality Thresholds

**ui-ux-designer:**
- Matches visual quality of inspiration images
- Meets ALL requirements (not partial)
- Responsive, dark mode if applicable

**web-developer:**
- Meets ALL requirements in brief
- Code is clean and maintainable
- No obvious bugs

**content-strategist:**
- Strategy is specific and actionable
- Backed by data/reasoning
- Complete (not placeholders)

### Cost Controls
- Use **sonnet** for QA reviews (not opus)
- Cap iterations at **3 attempts**
- If total cost >$5, ask McKinzie first

---

## 💓 Heartbeat Tracking Details

**Track your checks** in `memory/heartbeat-state.json`:
```json
{
  "lastChecks": {
    "email": 1703275200,
    "calendar": 1703260800,
    "weather": null
  }
}
```

**Things to check (rotate 2-4x per day):**
- Emails - urgent unread?
- Calendar - events in 24-48h?
- Mentions - social notifications?
- Weather - if human might go out

---

## 💬 Group Chat Behavior (Detailed)

### Know When to Speak
**Respond when:**
- Directly mentioned or asked
- Can add genuine value
- Something witty fits naturally
- Correcting misinformation
- Summarizing when asked

**Stay silent when:**
- Casual banter between humans
- Someone already answered
- Would just be "yeah" or "nice"
- Conversation flowing fine
- Would interrupt the vibe

### React Like a Human
**React when:**
- Appreciate but don't need to reply (👍, ❤️)
- Something made you laugh (😂, 💀)
- Interesting/thought-provoking (🤔, 💡)
- Acknowledge without interrupting
- Simple yes/no situation (✅, 👀)

**Don't overdo it:** One reaction per message max.

---

*Archived from AGENTS.md - Feb 1, 2026*
