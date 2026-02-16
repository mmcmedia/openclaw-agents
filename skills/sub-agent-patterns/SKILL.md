# Sub-Agent Patterns Skill

Best practices for spawning and managing sub-agents via `sessions_spawn`.

## When to Use

- Task will take >30 minutes
- Need parallel work streams
- Complex coding/building tasks
- Overnight autonomous work
- Want to avoid context pollution in main session

## Agent Routing

**Choose the right agent for the task:**

| Task Type | Agent | Why |
|-----------|-------|-----|
| Simple file edits, quick lookups | `haiku` | Fast, cheap |
| Standard work, research, docs | `sonnet` | Good balance |
| Complex coding, multi-file changes | `codex` | Specialized, uses reasoning |
| Strategic/multi-domain analysis | `opus` | Most capable (expensive, use sparingly) |

**Default:** `sonnet` unless specific reason for another.

**Overnight dev builds:** Always use `codex` - won't get distracted.

## Spawn Template

```javascript
sessions_spawn({
  agentId: 'codex',  // or haiku, sonnet, opus
  task: `[CONTEXT]
  Brief background on what this is for.
  
  [TASK]
  Specific deliverable(s) expected.
  
  [SUCCESS CRITERIA]
  - Criterion 1
  - Criterion 2
  
  [FILES TO CREATE/MODIFY]
  - /path/to/file1
  - /path/to/file2
  
  [WHEN COMPLETE]
  Use sessions_send to main session with:
  '✅ [task name] complete. Files: [list]. Ready for QA.'
  
  [IF BLOCKED]
  Use sessions_send to main session with:
  '❌ [task name] blocked: [reason]. Need: [what you need]'`,
  label: 'descriptive-label',
  runTimeoutSeconds: 7200  // 2 hours, adjust as needed
})
```

## Always Log Spawns

**Log to:** `/projects/subagent-tracking/SPAWN-LOG.md`

Entry format:
```markdown
## YYYY-MM-DD HH:MM - [label]
- **Agent:** codex/sonnet/haiku/opus
- **Task:** Brief description
- **Status:** SPAWNED / RUNNING / COMPLETED / FAILED
- **Session Key:** [from spawn response]
- **Notes:** [any issues or outcomes]
```

## Monitoring Sub-Agents

### Check Status
```javascript
sessions_list({ kinds: ['spawn'], activeMinutes: 120 })
```

### Get History
```javascript
sessions_history({ sessionKey: 'the-session-key', limit: 20 })
```

### Send Message
```javascript
sessions_send({ sessionKey: 'the-session-key', message: 'Status update?' })
```

## Common Patterns

### 1. Overnight Build

```javascript
// Before McKinzie sleeps
sessions_spawn({
  agentId: 'codex',
  task: `Build [feature] for [project].
  
  Requirements:
  - [req 1]
  - [req 2]
  
  Start from: /projects/[project]/
  
  When done, update SESSION_STATE.md with completion status
  and use sessions_send to notify main session.`,
  label: 'overnight-feature-build',
  runTimeoutSeconds: 14400  // 4 hours
})
```

### 2. Research Task

```javascript
sessions_spawn({
  agentId: 'sonnet',
  task: `Research [topic] for McKinzie.
  
  Sources to check:
  - [source 1]
  - [source 2]
  
  Output: Create /projects/[project]/research/[topic].md
  
  Include: Executive summary, key findings, recommendations.`,
  label: 'research-[topic]',
  runTimeoutSeconds: 3600
})
```

### 3. Quick Parallel Task

```javascript
// When you need something done while continuing main work
sessions_spawn({
  agentId: 'haiku',
  task: `Update [file] with [specific change].
  
  Just do this one thing and confirm when done.`,
  label: 'quick-edit',
  runTimeoutSeconds: 600
})
```

## Sub-Agent Rules

### DO:
- Give complete context (sub-agent has no memory of main session)
- Specify exact deliverables
- Include file paths
- Set appropriate timeout
- Log all spawns to SPAWN-LOG.md
- Check on long-running agents periodically

### DON'T:
- Assume sub-agent knows anything about prior work
- Spawn multiple agents for tightly coupled tasks
- Forget to verify completed work
- Let agents run indefinitely without monitoring

## Verification Checklist

After sub-agent completes:

- [ ] Check the files were actually created/modified
- [ ] Run/test the code if applicable
- [ ] Update SPAWN-LOG.md with completion status
- [ ] Update kanban card if relevant
- [ ] Notify McKinzie if significant

## Watchdog Script

Run periodically to check sub-agent health:
```bash
/Users/mmcassistant/clawd/scripts/subagent-watchdog.sh
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent seems stuck | Check `sessions_history` for errors |
| Agent finished but no output | Verify file paths were correct |
| Agent keeps asking questions | Give more context in initial task |
| Task too big, keeps timing out | Break into smaller sub-tasks |

## Last Updated

Feb 2, 2026 - Initial skill creation
