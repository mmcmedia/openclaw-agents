const WebSocket = require('ws');
const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

// Activity event emitter for decoupled architecture
const activityEmitter = new EventEmitter();

// Activity log file
const ACTIVITY_LOG = '/Users/mmcassistant/clawd/dashboard/data/activity.json';
const MAX_ACTIVITY_ENTRIES = 1000;

// Connected WebSocket clients
const clients = new Map();

// Initialize WebSocket server
function initWebSocket(server) {
  const wss = new WebSocket.Server({ 
    server,
    path: '/ws/kanban'
  });

  wss.on('connection', (ws, req) => {
    const clientId = generateClientId();
    const clientInfo = {
      id: clientId,
      ws,
      connectedAt: new Date().toISOString(),
      subscriptions: ['all'] // Can filter by agent, column, etc.
    };
    
    clients.set(clientId, clientInfo);
    console.log(`[WebSocket] Client connected: ${clientId}, Total: ${clients.size}`);

    // Send initial state
    sendToClient(ws, {
      type: 'connected',
      clientId,
      message: 'WebSocket connected',
      timestamp: new Date().toISOString()
    });

    // Handle messages from client
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        handleClientMessage(clientId, message);
      } catch (error) {
        console.error('[WebSocket] Invalid message:', error);
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      clients.delete(clientId);
      console.log(`[WebSocket] Client disconnected: ${clientId}, Total: ${clients.size}`);
    });

    // Send recent activity
    sendRecentActivity(ws);
  });

  // Listen for activity events
  activityEmitter.on('activity', (activity) => {
    broadcast({
      type: 'activity',
      activity
    });
  });

  return wss;
}

// Generate unique client ID
function generateClientId() {
  return `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Send message to specific client
function sendToClient(ws, data) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

// Broadcast to all connected clients
function broadcast(data, filter = null) {
  const message = JSON.stringify(data);
  clients.forEach((client, clientId) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      // Apply filter if provided
      if (filter && !filter(client)) return;
      client.ws.send(message);
    }
  });
}

// Send recent activity to new client
async function sendRecentActivity(ws) {
  try {
    const activities = await readActivityLog();
    const recent = activities.slice(-50).reverse(); // Last 50, newest first
    
    sendToClient(ws, {
      type: 'recent-activity',
      activities: recent,
      count: recent.length
    });
  } catch (error) {
    console.error('[WebSocket] Error sending recent activity:', error);
  }
}

// Handle messages from clients
function handleClientMessage(clientId, message) {
  const client = clients.get(clientId);
  if (!client) return;

  switch (message.type) {
    case 'subscribe':
      // Client wants updates for specific agent/column
      if (message.filter) {
        client.subscriptions = message.filter;
        console.log(`[WebSocket] Client ${clientId} subscribed to:`, message.filter);
      }
      break;
      
    case 'ping':
      sendToClient(client.ws, { type: 'pong', timestamp: new Date().toISOString() });
      break;
      
    case 'request-activity':
      sendRecentActivity(client.ws);
      break;
      
    default:
      console.log('[WebSocket] Unknown message type:', message.type);
  }
}

// Log activity
async function logActivity(activity) {
  try {
    const entry = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...activity
    };

    // Read existing log
    let activities = [];
    try {
      const data = await fs.readFile(ACTIVITY_LOG, 'utf8');
      activities = JSON.parse(data);
    } catch (e) {
      // File doesn't exist yet
    }

    // Add new entry
    activities.push(entry);

    // Trim to max entries
    if (activities.length > MAX_ACTIVITY_ENTRIES) {
      activities = activities.slice(-MAX_ACTIVITY_ENTRIES);
    }

    // Write back
    await fs.mkdir(path.dirname(ACTIVITY_LOG), { recursive: true });
    await fs.writeFile(ACTIVITY_LOG, JSON.stringify(activities, null, 2));

    // Emit event for WebSocket
    activityEmitter.emit('activity', entry);

    return entry;
  } catch (error) {
    console.error('[Activity] Error logging activity:', error);
    throw error;
  }
}

// Read activity log
async function readActivityLog(limit = 100) {
  try {
    const data = await fs.readFile(ACTIVITY_LOG, 'utf8');
    const activities = JSON.parse(data);
    return activities.slice(-limit);
  } catch (e) {
    return [];
  }
}

// Get activity statistics
async function getActivityStats(timeframe = '24h') {
  const activities = await readActivityLog(1000);
  const cutoff = new Date(Date.now() - parseTimeframe(timeframe));
  
  const recent = activities.filter(a => new Date(a.timestamp) > cutoff);
  
  const stats = {
    total: recent.length,
    byAgent: {},
    byAction: {},
    byHour: {}
  };

  recent.forEach(act => {
    // By agent
    stats.byAgent[act.agent] = (stats.byAgent[act.agent] || 0) + 1;
    
    // By action type
    stats.byAction[act.action] = (stats.byAction[act.action] || 0) + 1;
    
    // By hour
    const hour = new Date(act.timestamp).getHours();
    stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
  });

  return stats;
}

// Parse timeframe string
function parseTimeframe(tf) {
  const match = tf.match(/(\d+)([hdw])/);
  if (!match) return 24 * 60 * 60 * 1000; // Default 24h
  
  const [, num, unit] = match;
  const multipliers = { h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000, w: 7 * 24 * 60 * 60 * 1000 };
  return parseInt(num) * multipliers[unit];
}

// Get agent activity summary
async function getAgentSummary(agentId, timeframe = '24h') {
  const activities = await readActivityLog(1000);
  const cutoff = new Date(Date.now() - parseTimeframe(timeframe));
  
  const agentActivities = activities.filter(
    a => a.agent === agentId && new Date(a.timestamp) > cutoff
  );

  return {
    agent: agentId,
    totalActions: agentActivities.length,
    tasksCompleted: agentActivities.filter(a => 
      a.action === 'moved' && a.toColumn === 'done'
    ).length,
    tasksStarted: agentActivities.filter(a => 
      a.action === 'moved' && a.toColumn === 'inprogress'
    ).length,
    tasksCreated: agentActivities.filter(a => a.action === 'created').length,
    recentActivity: agentActivities.slice(-10).reverse()
  };
}

module.exports = {
  initWebSocket,
  logActivity,
  readActivityLog,
  getActivityStats,
  getAgentSummary,
  activityEmitter,
  broadcast
};
