# Kanban API: Future Enhancements Plan

**Status:** Phase 6 Complete ✅  
**Next:** WebSocket + Agent Activity Dashboard  
**Priority:** Medium-High  
**Estimated Time:** 4-6 hours

---

## 🚀 Enhancement 1: WebSocket for Real-Time Updates

### Why
- Currently agents must poll to see updates
- WebSocket = instant push notifications when cards move
- Better UX, less API load

### Implementation

**Server-side (Node.js):**
```javascript
// Add to server.js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3082 });

// Broadcast to all connected clients
function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Trigger on card move
broadcast({
  type: 'card-moved',
  card: updatedCard,
  movedBy: req.user?.username,
  timestamp: new Date().toISOString()
});
```

**Client-side (Dashboard):**
```javascript
const ws = new WebSocket('ws://192.168.0.170:3082');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'card-moved') {
    // Refresh kanban or animate the move
    refreshKanban();
  }
};
```

**Agent Notifications (Telegram):**
```javascript
// When card moves, also ping Telegram
if (data.type === 'card-moved' && data.card.assignee) {
  notifyTelegram(data.card.assignee, `Task "${data.card.title}" moved to ${data.card.column}`);
}
```

### Time Estimate: 2-3 hours

---

## 📊 Enhancement 2: Agent Activity Dashboard

### Features

#### 1. Real-Time Agent Status
```
┌─────────────────────────────────────────┐
│         AGENT ACTIVITY BOARD            │
├─────────────────────────────────────────┤
│ 🟢 Dev         │ In Progress: PsalMix   │
│    Last seen: 2 min ago                 │
│                                         │
│ 🟢 Sage        │ Idle                   │
│    Last seen: 15 min ago                │
│                                         │
│ 🟡 Scout       │ Working: Etsy Research │
│    Last seen: 5 min ago                 │
│                                         │
│ 🔴 Milo        │ Offline                │
│    Last seen: 2 hours ago               │
└─────────────────────────────────────────┘
```

#### 2. Recent Activity Feed
```
Recent Activity:
• 2 min ago - Dev moved "PsalMix UI" → inprogress
• 5 min ago - Scout created "Etsy keyword research"
• 15 min ago - Sage completed "Content calendar"
• 1 hour ago - Maria moved "Kanban API" → done
```

#### 3. Task Assignment View
```
Assigned to Agents:
┌─────────┬────────────────────────┬──────────┐
│ Agent   │ Task                   │ Status   │
├─────────┼────────────────────────┼──────────┤
│ Dev     │ PsalMix App Store      │ 🟡 Doing │
│ Sage    │ Content Strategy       │ 🟢 Done  │
│ Scout   │ Etsy Product Research  │ 🟡 Doing │
│ Milo    │ Social Campaign        │ ⚪ Todo  │
└─────────┴────────────────────────┴──────────┘
```

### Implementation

**New API Endpoints:**
```
GET /api/agents/activity      → Current agent status
GET /api/agents/feed          → Recent activity stream
GET /api/agents/assignments   → Tasks by agent
POST /api/agents/heartbeat    → Agents ping this
```

**Agent Heartbeat System:**
```javascript
// Each agent calls this every 5 minutes
POST /api/agents/heartbeat
{
  "agentId": "dev",
  "status": "active",  // active, idle, offline
  "currentTask": "PsalMix UI Polish",
  "progress": 75
}
```

**Activity Tracking:**
```javascript
// Log all kanban changes to activity feed
{
  "timestamp": "2026-02-15T16:10:00Z",
  "agent": "dev",
  "action": "moved",
  "cardId": "card-123",
  "cardTitle": "PsalMix UI",
  "fromColumn": "todo",
  "toColumn": "inprogress",
  "reason": "Starting implementation"
}
```

### Time Estimate: 2-3 hours

---

## 🔔 Enhancement 3: Telegram Notifications

### What
Get Telegram DM when:
- Task assigned to you
- Task you're watching moves
- Agent goes offline unexpectedly
- Daily summary of activity

### Implementation

**Notification Triggers:**
```javascript
// When card is created with assignee
if (newCard.assignee && newCard.assignee !== 'Maria') {
  sendTelegramDM(newCard.assignee, 
    `📋 New task assigned: "${newCard.title}"\nPriority: ${newCard.priority}`);
}

// When card moves to done
if (toColumn === 'done') {
  sendTelegramDM('Maria',
    `✅ ${agent} completed: "${card.title}"`);
}

// When agent offline > 30 min
if (lastHeartbeat > 30min) {
  sendTelegramDM('Maria',
    `⚠️ ${agent} has been offline for 30 minutes`);
}
```

**User Preferences:**
```json
{
  "mcKinzie": {
    "notifyOn": ["task-completed", "agent-offline", "daily-summary"],
    "quietHours": "22:00-08:00"
  },
  "dhanielle": {
    "notifyOn": ["task-assigned"],
    "quietHours": null
  }
}
```

### Time Estimate: 1-2 hours

---

## 📅 Implementation Roadmap

### Option A: Quick Wins (This Week)
**Time: 4-5 hours**
1. ✅ WebSocket for real-time updates
2. ✅ Basic agent activity endpoint
3. ✅ Telegram notifications on card moves

### Option B: Full Build (Next Week)
**Time: 6-8 hours**
1. WebSocket with rooms (per-agent channels)
2. Full activity dashboard UI
3. Agent heartbeat system
4. Advanced Telegram preferences
5. Activity analytics (who's most productive, etc.)

### Option C: Hybrid (Recommended)
**Time: 5-6 hours**
1. WebSocket for real-time (2 hrs)
2. Simple activity feed API (1 hr)
3. Telegram notifications (1 hr)
4. Basic dashboard widget (1-2 hrs)

---

## 💡 Technical Notes

### WebSocket Libraries
- `ws` (lightweight, native)
- `socket.io` (fallbacks, rooms)

### Storage for Activity
- Keep in JSON for now (simple)
- Or SQLite if we want history
- Redis if we want real pub/sub

### Security
- Auth WebSocket connections
- Rate limit notifications
- Don't spam Telegram

---

## 🎯 Success Metrics

- [ ] Cards update in real-time on dashboard
- [ ] Agents get Telegram when assigned tasks
- [ ] Can see who's working on what at a glance
- [ ] Activity history searchable
- [ ] McKinzie gets daily summary

---

## 🤔 Questions

1. **Priority:** Do this now or after PsalMix launch?
2. **Scope:** Quick wins (Option A) or full build (Option B)?
3. **Telegram:** Should agents get DMs or just you?
4. **History:** Keep activity log forever or 30 days?

Ready to build when you are! 💃🏼
