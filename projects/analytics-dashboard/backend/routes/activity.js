const express = require('express');
const router = express.Router();
const { readActivityLog, getActivityStats, getAgentSummary } = require('../services/websocket');

// GET /api/activity - Get recent activity
router.get('/', async (req, res) => {
  try {
    const { limit = 50, agent, action, since } = req.query;
    
    let activities = await readActivityLog(parseInt(limit) || 50);
    
    // Filter by agent
    if (agent) {
      activities = activities.filter(a => a.agent === agent);
    }
    
    // Filter by action
    if (action) {
      activities = activities.filter(a => a.action === action);
    }
    
    // Filter by time
    if (since) {
      const sinceDate = new Date(since);
      activities = activities.filter(a => new Date(a.timestamp) > sinceDate);
    }
    
    res.json({
      success: true,
      count: activities.length,
      activities
    });
  } catch (error) {
    console.error('[Activity API] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity'
    });
  }
});

// GET /api/activity/stats - Get activity statistics
router.get('/stats', async (req, res) => {
  try {
    const { timeframe = '24h' } = req.query;
    const stats = await getActivityStats(timeframe);
    
    res.json({
      success: true,
      timeframe,
      stats
    });
  } catch (error) {
    console.error('[Activity API] Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

// GET /api/activity/agents - Get all agents who have activity
router.get('/agents', async (req, res) => {
  try {
    const activities = await readActivityLog(1000);
    const agents = [...new Set(activities.map(a => a.agent).filter(Boolean))];
    
    res.json({
      success: true,
      count: agents.length,
      agents
    });
  } catch (error) {
    console.error('[Activity API] Agents error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agents'
    });
  }
});

// GET /api/activity/agents/:agentId - Get summary for specific agent
router.get('/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { timeframe = '24h' } = req.query;
    
    const summary = await getAgentSummary(agentId, timeframe);
    
    res.json({
      success: true,
      ...summary
    });
  } catch (error) {
    console.error('[Activity API] Agent summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch agent summary'
    });
  }
});

// GET /api/activity/feed - Get formatted activity feed (for dashboard)
router.get('/feed', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const activities = await readActivityLog(parseInt(limit) || 20);
    
    // Format for display
    const feed = activities.reverse().map(act => {
      let message = '';
      let icon = '';
      
      switch (act.action) {
        case 'moved':
          icon = '➡️';
          message = `${act.agent} moved "${act.cardTitle}" ${act.fromColumn} → ${act.toColumn}`;
          break;
        case 'created':
          icon = '➕';
          message = `${act.agent} created "${act.cardTitle}"`;
          break;
        case 'updated':
          icon = '✏️';
          message = `${act.agent} updated "${act.cardTitle}"`;
          break;
        case 'archived':
          icon = '🗑️';
          message = `${act.agent} archived "${act.cardTitle}"`;
          break;
        default:
          icon = '📝';
          message = `${act.agent} ${act.action} "${act.cardTitle}"`;
      }
      
      return {
        id: act.id,
        timestamp: act.timestamp,
        icon,
        message,
        agent: act.agent,
        cardId: act.cardId,
        action: act.action
      };
    });
    
    res.json({
      success: true,
      count: feed.length,
      feed
    });
  } catch (error) {
    console.error('[Activity API] Feed error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch feed'
    });
  }
});

// GET /api/activity/summary - Get daily summary
router.get('/summary', async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
    
    const activities = await readActivityLog(1000);
    const dayActivities = activities.filter(a => {
      const actDate = new Date(a.timestamp);
      return actDate >= startOfDay && actDate <= endOfDay;
    });
    
    const summary = {
      date: startOfDay.toISOString().split('T')[0],
      totalActions: dayActivities.length,
      cardsCreated: dayActivities.filter(a => a.action === 'created').length,
      cardsCompleted: dayActivities.filter(a => 
        a.action === 'moved' && a.toColumn === 'done'
      ).length,
      cardsStarted: dayActivities.filter(a => 
        a.action === 'moved' && a.toColumn === 'inprogress'
      ).length,
      byAgent: {},
      recent: dayActivities.slice(-10).reverse()
    };
    
    dayActivities.forEach(act => {
      const agent = act.agent || 'unknown';
      if (!summary.byAgent[agent]) {
        summary.byAgent[agent] = { actions: 0, completed: 0 };
      }
      summary.byAgent[agent].actions++;
      if (act.action === 'moved' && act.toColumn === 'done') {
        summary.byAgent[agent].completed++;
      }
    });
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('[Activity API] Summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch summary'
    });
  }
});

module.exports = router;
