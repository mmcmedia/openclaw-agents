/**
 * Automation API Endpoints
 * Serves data from /projects/automations/*/logs/ to frontend widgets
 * 
 * Add these routes to server.js:
 *   const automationsAPI = require('./automations-api.js');
 *   app.use('/api/automations', automationsAPI);
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const AUTOMATIONS_BASE = '/Users/mmcassistant/clawd/projects/automations';

/**
 * Helper: Read latest log file from automation
 */
function getLatestLog(automationName) {
  try {
    const logsDir = path.join(AUTOMATIONS_BASE, automationName, 'logs');
    const files = fs.readdirSync(logsDir)
      .filter(f => f.endsWith('.json'))
      .sort()
      .reverse();
    
    if (files.length === 0) {
      return { status: 'no-data', message: 'No logs yet' };
    }
    
    const latest = fs.readFileSync(
      path.join(logsDir, files[0]),
      'utf8'
    );
    
    return JSON.parse(latest);
  } catch (error) {
    console.error(`Error reading ${automationName} logs:`, error);
    return { status: 'error', message: error.message };
  }
}

/**
 * GET /api/automations/etsy-reviews
 * Latest Etsy review data
 */
router.get('/etsy-reviews', (req, res) => {
  const data = getLatestLog('etsy-review-monitor');
  res.json(data || {
    status: 'pending',
    reviews: [],
    lastRun: null
  });
});

/**
 * GET /api/automations/revenue-forecast
 * Monthly revenue projection
 */
router.get('/revenue-forecast', (req, res) => {
  const data = getLatestLog('revenue-forecast');
  res.json(data || {
    status: 'pending',
    current: 0,
    monthlyTarget: 20000,
    projectedMonthly: 0,
    message: 'Loading...',
    lastRun: null
  });
});

/**
 * GET /api/automations/pinterest-alerts
 * Pinterest performance data
 */
router.get('/pinterest-alerts', (req, res) => {
  const data = getLatestLog('pinterest-alerts');
  res.json(data || {
    status: 'pending',
    topPins: [],
    drops: [],
    virals: [],
    lastRun: null
  });
});

/**
 * GET /api/automations/etsy-gaps
 * Etsy opportunity gaps
 */
router.get('/etsy-gaps', (req, res) => {
  const data = getLatestLog('etsy-gaps');
  res.json(data || {
    status: 'pending',
    opportunities: [],
    lastRun: null
  });
});

/**
 * GET /api/automations/competitors
 * Competitor monitoring data
 */
router.get('/competitors', (req, res) => {
  const data = getLatestLog('competitor-monitor');
  res.json(data || {
    status: 'pending',
    newListings: [],
    priceChanges: [],
    appUpdates: [],
    lastRun: null
  });
});

/**
 * GET /api/automations/content-calendar
 * Content suggestions for next week
 */
router.get('/content-calendar', (req, res) => {
  const data = getLatestLog('content-calendar');
  res.json(data || {
    status: 'pending',
    suggestions: [],
    lastRun: null
  });
});

/**
 * GET /api/automations/status
 * Overall automation health
 */
router.get('/status', (req, res) => {
  const automations = [
    'etsy-review-monitor',
    'ceo-monday-email',
    'pinterest-alerts',
    'revenue-forecast',
    'competitor-monitor',
    'etsy-gaps',
    'content-calendar'
  ];

  const statuses = {};
  for (const name of automations) {
    try {
      const logsDir = path.join(AUTOMATIONS_BASE, name, 'logs');
      const files = fs.readdirSync(logsDir).filter(f => f.endsWith('.json'));
      const latestFile = files.sort().reverse()[0];
      
      if (latestFile) {
        const data = JSON.parse(
          fs.readFileSync(path.join(logsDir, latestFile), 'utf8')
        );
        statuses[name] = {
          status: data.status || 'unknown',
          lastRun: latestFile,
          isHealthy: data.status === 'success' || data.status === 'ok'
        };
      } else {
        statuses[name] = {
          status: 'no-data',
          lastRun: null,
          isHealthy: false
        };
      }
    } catch (error) {
      statuses[name] = {
        status: 'error',
        lastRun: null,
        isHealthy: false,
        error: error.message
      };
    }
  }

  res.json({ statuses });
});

/**
 * POST /api/automations/:name/test
 * Manually trigger an automation (for testing)
 */
router.post('/:name/test', async (req, res) => {
  try {
    const automationPath = path.join(AUTOMATIONS_BASE, req.params.name, 'run.js');
    
    if (!fs.existsSync(automationPath)) {
      return res.status(404).json({
        error: `Automation not found: ${req.params.name}`
      });
    }

    // Run the automation script
    const { exec } = require('child_process');
    exec(`node ${automationPath}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          error: error.message,
          stderr
        });
      }

      res.json({
        status: 'success',
        output: stdout,
        automation: req.params.name
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
