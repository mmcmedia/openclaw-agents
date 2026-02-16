const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3081;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());

// Cache helper
const cache = require('./cache');

// GA4 Service
const ga4Service = require('./ga4-service');

// Auth middleware
const AUTHORIZED_USERS = {
  'mckinzie': process.env.MCKINZIE_PASSWORD || 'Kinzie2026',
  'dhanielle': process.env.DHANIELLE_PASSWORD || 'DhanielleMMC2026!',
  'ally': process.env.ALLY_PASSWORD || 'ally-analytics',
};

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing credentials' });
  }
  const [scheme, credentials] = authHeader.split(' ');
  if (scheme !== 'Basic') {
    return res.status(401).json({ error: 'Unauthorized: Invalid auth scheme' });
  }
  const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');
  if (!username || !AUTHORIZED_USERS[username] || AUTHORIZED_USERS[username] !== password) {
    return res.status(401).json({ error: 'Unauthorized: Invalid credentials' });
  }
  req.user = { username };
  next();
}

// Health check (before auth)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    features: ['analytics', 'kanban', 'activity', 'websocket']
  });
});

// Apply auth to all API routes
app.use('/api', authMiddleware);

// ============ ANALYTICS ROUTES ============

// Legacy analytics endpoints
app.get('/api/sites', (req, res) => {
  const sites = [
    'hello-hayley', 'melrose-family', 'we-heart-this', 'living-tickled',
    'today-mommy', 'we-heart-cozy', 'we-heart-decorating', 'we-heart-desserts',
    'we-heart-hairstyles', 'we-heart-makeup', 'we-heart-nail-designs',
    'we-love-decorating', 'polish-and-patterns', 'savor-sprinkle',
    'styled-locks', 'makeup-mood', 'sourdough-sisters', 'bloom-brick',
    'dash-homemade', 'gloss-hair', 'graceful-vows', 'travel-cami'
  ];
  res.json({ success: true, sites });
});

app.get('/api/summary', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    res.json({ 
      success: true, 
      days: parseInt(days),
      message: 'Summary endpoint - data collection in progress',
      cached: cache.get('summary') || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/channels/:channel', async (req, res) => {
  try {
    const { channel } = req.params;
    const { days = 30 } = req.query;
    res.json({ 
      success: true, 
      channel,
      days: parseInt(days),
      message: `Channel data for ${channel}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Portfolio data
app.get('/api/portfolio', (req, res) => {
  res.json({
    success: true,
    sites: [
      { id: 'hello-hayley', name: 'Hello Hayley', status: 'active' },
      { id: 'melrose-family', name: 'Melrose Family', status: 'active' },
      { id: 'we-heart-this', name: 'We Heart This', status: 'active' },
      { id: 'living-tickled', name: 'Living Tickled', status: 'active' },
      { id: 'today-mommy', name: 'Today Mommy', status: 'active' },
      { id: 'we-heart-cozy', name: 'We Heart Cozy', status: 'active' }
    ]
  });
});

// Drilldown routes
try {
  const drilldown = require('./drilldown-routes');
  if (typeof drilldown.setupRoutes === 'function') {
    drilldown.setupRoutes(app, ga4Service, authMiddleware);
    console.log('✅ Drilldown routes loaded');
  }
} catch (error) {
  console.warn('⚠️ Drilldown routes error:', error.message);
}

// ============ KANBAN & ACTIVITY ROUTES ============

// Kanban routes
const kanbanRoutes = require('./routes/kanban');
app.use('/api/kanban', kanbanRoutes);

// Activity routes
try {
  const activityRoutes = require('./routes/activity');
  app.use('/api/activity', activityRoutes);
  console.log('✅ Activity routes loaded');
} catch (error) {
  console.warn('⚠️ Activity routes error:', error.message);
}

// WebSocket
try {
  const { initWebSocket } = require('./services/websocket');
  initWebSocket(server);
  console.log('✅ WebSocket initialized');
} catch (error) {
  console.warn('⚠️ WebSocket error:', error.message);
}

// Start server
server.listen(PORT, '127.0.0.1', () => {
  console.log(`📊 Analytics API v2 running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket available on ws://localhost:${PORT}/ws/kanban`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health          - Health check`);
  console.log(`  GET  /api/sites       - List all sites`);
  console.log(`  GET  /api/summary     - Analytics summary`);
  console.log(`  GET  /api/channels/*  - Channel analytics`);
  console.log(`  GET  /api/portfolio   - Portfolio overview`);
  console.log(`  GET  /api/kanban/*    - Kanban board API`);
  console.log(`  GET  /api/activity/*  - Activity feed API`);
  console.log(`  WS   /ws/kanban       - WebSocket for real-time updates`);
});
