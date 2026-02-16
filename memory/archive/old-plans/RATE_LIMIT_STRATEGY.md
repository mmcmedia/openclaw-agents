# Rate Limit Strategy for Overnight Work

**Created:** Jan 30, 2026  
**Status:** Proposed

## Problem
Currently hitting Anthropic API rate limits when spawning multiple sub-agents overnight, causing task failures.

## Root Causes
1. **Burst spawning** - All sub-agents spawn at once (11pm)
2. **No backoff logic** - Retries immediately after rate limit
3. **No quota monitoring** - Can't see how close we are to limits
4. **Fixed scheduling** - Cron runs at exact times regardless of API health

## Solution: Smart Queue System

### 1. Task Queue with Pacing
```javascript
// Overnight task queue
const overnightQueue = [
  { skill: 'etsy-expert', task: 'Analyze competitor pricing', priority: 1 },
  { skill: 'seo-specialist', task: 'Keyword opportunities for Hello Hayley', priority: 1 },
  { skill: 'content-strategist', task: 'Editorial calendar for Feb', priority: 2 }
];

// Process queue with spacing
async function processQueue() {
  for (const task of overnightQueue.sort((a,b) => a.priority - b.priority)) {
    await spawnTask(task);
    await sleep(5 * 60 * 1000); // 5 minute spacing
    
    // Check if we're close to rate limits
    if (await checkRateLimit() > 0.8) {
      await sleep(10 * 60 * 1000); // Back off 10 minutes
    }
  }
}
```

### 2. Exponential Backoff
When rate limited:
- 1st retry: Wait 1 minute
- 2nd retry: Wait 2 minutes
- 3rd retry: Wait 4 minutes
- 4th retry: Wait 8 minutes
- 5th retry: Skip task, log failure

### 3. Rate Limit Monitoring
- Parse rate limit headers from API responses
- Track: `x-ratelimit-remaining-tokens`, `x-ratelimit-reset-tokens`
- If remaining < 20% of limit → increase spacing
- If remaining < 10% → pause queue until reset

### 4. Overnight Schedule Adjustments
**Old:** All tasks at 11pm → burst load → rate limit
**New:** Stagger across overnight window (11pm-6am)

```
11:00 PM - Spawn task 1
11:10 PM - Spawn task 2
11:20 PM - Spawn task 3
11:40 PM - Spawn task 4 (longer gap if high token usage)
12:00 AM - Spawn task 5
... continue spacing throughout night
```

### 5. Cost Controls
- Cap overnight spending at $X per night
- Track cumulative cost per session
- If cost > threshold → pause queue, alert McKinzie in morning

## Implementation Plan

**Phase 1:** Manual spacing (immediate)
- Update `nightly-proactive-work` cron to spawn one task
- Create additional crons at 11:15pm, 11:30pm, etc. for remaining tasks
- Quick fix, no code changes needed

**Phase 2:** Smart queue (1-2 days)
- Build queue processor in `automation-architect` skill
- Implement backoff logic
- Add rate limit header parsing
- Deploy to overnight cron

**Phase 3:** Monitoring dashboard (future)
- Visualize overnight task history
- Show rate limit usage over time
- Alert if consistently hitting limits

## Metrics to Track
- Tasks completed vs. failed overnight
- Average time between spawns
- Rate limit hits per night (goal: 0)
- Cost per overnight session

## Rollout
1. Test queue system during daytime (controlled environment)
2. Deploy to overnight cron for 1 week
3. Monitor metrics, adjust spacing as needed
4. Document optimal spacing for different task types

---

**Next Steps:**
McKinzie to approve strategy → I'll implement Phase 1 today → Phase 2 this week
