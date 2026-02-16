const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const router = express.Router();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3081;
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(cors());
app.use(express.json());

// Health check (before auth)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

app.use(authMiddleware);

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
const { initWebSocket } = require('./services/websocket');
initWebSocket(server);

// Start server
server.listen(PORT, '127.0.0.1', () => {
  console.log(`📊 Analytics API v2 running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket available on ws://localhost:${PORT}/ws/kanban`);
});
