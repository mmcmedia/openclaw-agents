#!/bin/bash
# team-status.sh — Quick overview of all agent workloads
set -e

VPS="root@76.13.108.6"

echo "📊 AI Team Status"
echo "================="
echo ""

# Get kanban breakdown
ssh "$VPS" "python3 << 'PYEOF'
import json
from collections import defaultdict

with open('/home/openclaw/analytics-api/data/cards.json', 'r') as f:
    cards = json.load(f)

active = [c for c in cards if c.get('column') != 'done']
by_agent = defaultdict(lambda: defaultdict(list))

for c in active:
    agent = c.get('assignee', 'Unassigned')
    col = c.get('column', 'unknown')
    by_agent[agent][col].append(c)

emojis = {'Dev': '⚡', 'Sage': '📊', 'Scout': '🎯', 'Milo': '🎵', 'Pixel': '🎨', 'Ally': '✨', 'Maria': '💃🏼'}

for agent in ['Maria', 'Dev', 'Sage', 'Scout', 'Milo', 'Pixel', 'Ally']:
    cols = by_agent.get(agent, {})
    emoji = emojis.get(agent, '❓')
    total = sum(len(v) for v in cols.values())
    ip = len(cols.get('inprogress', []))
    todo = len(cols.get('todo', []))
    backlog = len(cols.get('backlog', []))
    blocked = len(cols.get('blocked', []))
    
    status = '🟢' if ip > 0 else ('🟡' if todo > 0 else '⚪')
    print(f'{status} {emoji} {agent}: {total} tasks (🔨{ip} in-progress, 📋{todo} todo, 📦{backlog} backlog, 🚫{blocked} blocked)')

done_count = len([c for c in cards if c.get('column') == 'done'])
print(f'\n✅ Completed: {done_count} | Active: {len(active)}')
PYEOF"

echo ""
echo "Last dispatch log entries:"
tail -5 /Users/mmcassistant/clawd/projects/subagent-tracking/DISPATCH-LOG.md 2>/dev/null || echo "(no dispatches yet)"
