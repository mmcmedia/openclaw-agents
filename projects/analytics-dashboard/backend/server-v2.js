const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
require('dotenv').config({ path: path.join(process.env.HOME, '.clawdbot', '.env') });
const getlate = require('./clients/getlate');
const { initWebSocket } = require('./services/websocket');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3081;
const DATA_DIR = path.join(__dirname, 'data');
const CACHE_DIR = path.join(__dirname, 'cache');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());

// Cache helper
const cache = require('./cache');

// GA4 Service
const ga4Service = require('./ga4-service');

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing credentials' });
  }
  next();
};

app.use(authMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    features: ['kanban', 'activity', 'websocket']
  });
});

// Activity API routes
try {
  const activityRoutes = require('./routes/activity');
  app.use('/api/activity', activityRoutes);
  console.log('✅ Activity routes loaded');
} catch (error) {
  console.warn('⚠️ Activity routes not available:', error.message);
}

// Kanban API routes
const kanbanRoutes = require('./routes/kanban');
app.use('/api/kanban', kanbanRoutes);

// Initialize WebSocket
initWebSocket(server);
console.log('✅ WebSocket initialized');

// Start server
server.listen(PORT, '127.0.0.1', () => {
  console.log(`📊 Analytics API v2 running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`🔌 WebSocket available on ws://localhost:${PORT}/ws/kanban`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health          - Health check`);
  console.log(`  GET  /api/kanban/*    - Kanban board API`);
  console.log(`  GET  /api/activity/*  - Activity feed API`);
  console.log(`  WS   /ws/kanban       - WebSocket for real-time updates`);
});
