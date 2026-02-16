# Kanban API Integration Plan

**Project:** Enable VPS Agents to Update Dashboard Kanban  
**Goal:** Allow agents (Dev, Sage, Scout, Milo, Pixel) to move cards, update status, and create tasks from anywhere  
**Timeline:** 2-3 hours  
**Status:** Not Started  

---

## ✅ Phase 1: API Design & Schema (30 min)

### 1.1 Define API Endpoints
```
GET  /api/kanban/cards              → List all cards
GET  /api/kanban/cards/:id          → Get specific card
POST /api/kanban/cards              → Create new card
PUT  /api/kanban/cards/:id          → Update card
PUT  /api/kanban/cards/:id/move     → Move card to different column
DELETE /api/kanban/cards/:id        → Archive card
GET  /api/kanban/columns            → List columns
```

### 1.2 Request/Response Schema
```json
// GET /api/kanban/cards
{
  "cards": [
    {
      "id": "wl-v5-production",
      "title": "Wholesome Library v5 - Production Pipeline",
      "column": "inprogress",
      "priority": "high",
      "assignee": "Maria",
      "updatedAt": "2026-02-15T21:16:00Z"
    }
  ]
}

// POST /api/kanban/cards/:id/move
{
  "toColumn": "done",
  "reason": "First book generated successfully"
}
```

### 1.3 Authentication
- Basic Auth (same as dashboard: `mckinzie:mmc-analytics-2026`)
- Or API key in header: `X-API-Key: your-key-here`

---

## 🔧 Phase 2: Backend Implementation (60 min)

### 2.1 Create API Routes File
**File:** `/projects/analytics-dashboard/backend/routes/kanban.js`

```javascript
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const KANBAN_PATH = '/Users/mmcassistant/clawd/dashboard/data/cards.json';

// GET /api/kanban/cards
router.get('/cards', async (req, res) => {
  // Read and return cards
});

// POST /api/kanban/cards/:id/move
router.post('/cards/:id/move', async (req, res) => {
  // Move card to new column
});

// ... other endpoints

module.exports = router;
```

### 2.2 Wire into Server
**File:** `/projects/analytics-dashboard/backend/server.js`

```javascript
const kanbanRoutes = require('./routes/kanban');
app.use('/api/kanban', kanbanRoutes);
```

### 2.3 Add Validation & Error Handling
- Validate column names (todo, inprogress, done, backlog)
- Validate card IDs exist
- Return proper HTTP status codes
- Log all changes

---

## 🧪 Phase 3: Testing & Validation (30 min)

### 3.1 Test Endpoints
```bash
# Test GET
curl -u mckinzie:mmc-analytics-2026 \
  http://192.168.0.170:3002/api/kanban/cards

# Test MOVE
curl -X POST \
  -u mckinzie:mmc-analytics-2026 \
  -H "Content-Type: application/json" \
  -d '{"toColumn": "done", "reason": "Task complete"}' \
  http://192.168.0.170:3002/api/kanban/cards/wl-v5-production/move
```

### 3.2 Test from VPS
```bash
ssh root@76.13.108.6
curl -u mckinzie:mmc-analytics-2026 \
  http://192.168.0.170:3002/api/kanban/cards
```

---

## 📋 Phase 4: Agent Integration Scripts (30 min)

### 4.1 Create Helper Script for VPS Agents
**File:** `/home/openclaw/shared-scripts/kanban-update.sh`

```bash
#!/bin/bash
# Usage: kanban-update.sh <card-id> <action> [args]

CARD_ID=$1
ACTION=$2
API_URL="http://192.168.0.170:3002/api/kanban"
AUTH="mckinzie:mmc-analytics-2026"

case $ACTION in
  move)
    curl -X POST -u $AUTH \
      -H "Content-Type: application/json" \
      -d "{\"toColumn\": \"$3\", \"reason\": \"$4\"}" \
      $API_URL/cards/$CARD_ID/move
    ;;
  status)
    curl -u $AUTH $API_URL/cards/$CARD_ID
    ;;
  create)
    curl -X POST -u $AUTH \
      -H "Content-Type: application/json" \
      -d "{\"title\": \"$3\", \"column\": \"$4\", \"priority\": \"$5\"}" \
      $API_URL/cards
    ;;
esac
```

### 4.2 Create JSON Helper (for better DX)
**File:** `/home/openclaw/shared-scripts/kanban-cli.js`

```javascript
// Node.js CLI for kanban operations
// Usage: node kanban-cli.js move wl-v5-production done "Task complete"
```

---

## 🔐 Phase 5: Security & Access Control (15 min)

### 5.1 Add Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/kanban', limiter);
```

### 5.2 Add IP Whitelisting (Optional)
```javascript
// Only allow VPS IP
const allowedIPs = ['76.13.108.6', '127.0.0.1'];
```

### 5.3 Audit Logging
```javascript
// Log all kanban changes
console.log(`[${timestamp}] ${agent} moved ${cardId} to ${column}`);
```

---

## 📊 Phase 6: Documentation & Rollout (15 min)

### 6.1 Create Agent Documentation
**File:** `/home/openclaw/KANBAN-API-GUIDE.md`

```markdown
# Kanban API Guide for Agents

## Quick Start
```bash
# Move card to done
kanban-update.sh wl-v5-production done "First book generated"

# Check card status
kanban-update.sh wl-v5-production status

# Create new card
kanban-update.sh new "New Task" todo high
```

## Available Columns
- todo
- inprogress
- done
- backlog

## Priority Levels
- high
- medium
- low
```

### 6.2 Update Persona Files
Add to each agent's `PERSONA.md`:
```
## Task Management
When you complete a task, update the kanban:
```bash
kanban-update.sh <card-id> done "Brief description of completion"
```
```

---

## 📅 Implementation Checklist

### Phase 1: Design (30 min)
- [ ] Define all API endpoints
- [ ] Create JSON schemas
- [ ] Choose auth method (Basic vs API key)

### Phase 2: Backend (60 min)
- [ ] Create `/routes/kanban.js`
- [ ] Wire into `server.js`
- [ ] Implement GET /cards
- [ ] Implement POST /cards/:id/move
- [ ] Add validation middleware
- [ ] Add error handling

### Phase 3: Testing (30 min)
- [ ] Test all endpoints locally
- [ ] Test from VPS
- [ ] Verify auth works
- [ ] Check file permissions

### Phase 4: Scripts (30 min)
- [ ] Create `kanban-update.sh`
- [ ] Create `kanban-cli.js`
- [ ] Make scripts executable
- [ ] Test scripts from VPS

### Phase 5: Security (15 min)
- [ ] Add rate limiting
- [ ] Add audit logging
- [ ] Test with invalid credentials

### Phase 6: Docs (15 min)
- [ ] Write `KANBAN-API-GUIDE.md`
- [ ] Update agent `PERSONA.md` files
- [ ] Create examples

---

## 🚀 Post-Launch

### Immediate Benefits
- ✅ VPS agents can update task status
- ✅ No more manual kanban updates
- ✅ Real-time visibility
- ✅ Still use YOUR dashboard

### Future Enhancements
- [ ] WebSocket for real-time updates (no refresh needed)
- [ ] Slack/Telegram notifications on card moves
- [ ] Agent activity dashboard
- [ ] Task assignment automation

---

## 💡 Questions?

**Q: What if Mac Mini is offline?**
A: Changes queue in VPS memory until reconnected (or use database)

**Q: Can agents see the kanban?**
A: Yes, via GET /api/kanban/cards endpoint

**Q: What about conflicts?**
A: File locking prevents simultaneous writes

---

*Created: Feb 15, 2026*  
*Next Review: After Phase 2 completion*
