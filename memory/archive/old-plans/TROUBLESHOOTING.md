# TROUBLESHOOTING.md

## Fitz Stalling / Not Responding

**Symptom:** Fitz responds initially but then stops making progress mid-conversation. Messages sit for 15-20 minutes without response.

**Root Cause:** Zombie `clawdbot-onboard` processes from previous timeouts create a resource deadlock.

**Quick Fix:**
```bash
./scripts/cleanup-zombies.sh
```

**Manual Fix:**
```bash
# 1. Check for stuck processes
ps aux | grep clawdbot-onboard | grep -v grep

# 2. If any are running for >5 minutes, kill them
kill -9 [PID] [PID] ...

# 3. Restart gateway if needed
clawdbot gateway restart
```

**Prevention:**
- Fitz automatically checks for zombies during heartbeats
- You can run `./scripts/cleanup-zombies.sh` manually anytime
- Consider adding to cron: `*/15 * * * * ~/clawd/scripts/cleanup-zombies.sh` (every 15 min)

**When to Run:**
- When Fitz stops responding mid-conversation
- After any "LLM request timed out" errors
- As preventive maintenance once daily

## Other Issues

(Add more troubleshooting sections as they come up)
