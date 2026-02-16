const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
require('dotenv').config({ path: path.join(process.env.HOME, '.clawdbot', '.env') });
const getlate = require('./clients/getlate');
const { initWebSocket } = require('./services/websocket');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');

// Create HTTP server (for WebSocket support)
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read JSON files safely
const readJsonFile = (filename) => {
  const filepath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message);
    return null;
  }
};

// Helper to write JSON files
const writeJsonFile = (filename, data) => {
  const filepath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error.message);
    return false;
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    dataDir: DATA_DIR
  });
});

// Get all revenue data (hero metrics)
app.get('/api/revenue', (req, res) => {
  const data = readJsonFile('revenue.json');
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Revenue data not found' });
  }
});

// Get Mediavine data
app.get('/api/mediavine', (req, res) => {
  const data = readJsonFile('mediavine.json');
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Mediavine data not found' });
  }
});

// Get Raptive data
app.get('/api/raptive', (req, res) => {
  const data = readJsonFile('raptive.json');
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Raptive data not found' });
  }
});

// Get all content sites (combined Mediavine + Raptive)
app.get('/api/sites', (req, res) => {
  const mediavine = readJsonFile('mediavine.json');
  const raptive = readJsonFile('raptive.json');
  
  const sites = [];
  if (mediavine?.sites) sites.push(...mediavine.sites);
  if (raptive?.sites) sites.push(...raptive.sites);
  
  res.json({
    lastUpdated: mediavine?.lastUpdated || raptive?.lastUpdated || null,
    sites
  });
});

// Get Etsy data
app.get('/api/etsy', (req, res) => {
  const data = readJsonFile('etsy.json');
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Etsy data not found' });
  }
});

// Get social/traffic data
app.get('/api/social', (req, res) => {
  const data = readJsonFile('social.json');
  if (data) {
    res.json(data);
  } else {
    res.status(404).json({ error: 'Social data not found' });
  }
});

// Get Late post analytics
app.get('/api/late/analytics', async (req, res) => {
  try {
    const {
      fromDate,
      toDate,
      limit,
      platform,
      profileId,
      postId,
      sortBy,
      order,
      page
    } = req.query;

    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (limit) params.limit = limit;
    if (platform && platform !== 'all') params.platform = platform;
    if (profileId) params.profileId = profileId;
    if (postId) params.postId = postId;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (page) params.page = page;

    const response = await getlate.client.get('/v1/analytics', { params });
    res.json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Failed to fetch GetLate analytics',
      details: error.response?.data || error.message
    });
  }
});

const extractAnalyticsItems = (data) => {
  return data?.posts || data?.data || data?.items || data?.results || [];
};

const normalizePinterestPost = (post, index) => {
  const metrics = post.metrics || post.analytics || post.insights || {};
  const impressions = metrics.impressions ?? metrics.views ?? metrics.viewCount ?? metrics.reach ?? 0;
  const saves = metrics.saves ?? metrics.save ?? metrics.bookmarks ?? metrics.pins ?? 0;
  const clicks = metrics.clicks ?? metrics.outboundClicks ?? metrics.linkClicks ?? metrics.destinationClicks ?? 0;
  const engagement = metrics.engagements ?? metrics.engagement ?? (saves + clicks);
  const engagementRate = metrics.engagementRate ?? (impressions ? (engagement / impressions) : 0);

  const mediaItem = Array.isArray(post.media) ? post.media[0] : null;
  const thumbnail = post.thumbnailUrl || mediaItem?.thumbnailUrl || mediaItem?.thumbnail || mediaItem?.url || null;

  const boardRaw = post.board || post.boardName || post.boardTitle || post.board_id || null;
  const boardName = typeof boardRaw === 'string' ? boardRaw : (boardRaw?.name || boardRaw?.title || null);

  return {
    id: post._id || post.id || post.latePostId || post.platformPostId || `pinterest-${index}`,
    title: post.title || post.name || post.description || post.content || post.caption || 'Untitled Pin',
    description: post.description || post.content || post.caption || '',
    thumbnail,
    impressions,
    saves,
    clicks,
    engagement,
    engagementRate,
    board: boardName,
    accountId: post.accountId || post.profileId || null,
    accountName: post.accountName || post.profileName || post.profile?.name || null,
    pinUrl: post.platformPostUrl || post.url || post.link || post.permalink || null,
    publishedAt: post.publishedAt || post.postedAt || post.createdAt || null
  };
};

const getPinterestAnalytics = async (params) => {
  const response = await getlate.client.get('/v1/analytics', {
    params: {
      ...params,
      platform: 'pinterest'
    }
  });
  return response.data;
};

const filterByAccount = (posts, accountId) => {
  if (!accountId) return posts;
  return posts.filter((post) => post.accountId === accountId);
};

// Pinterest performance summary
app.get('/api/pinterest/performance', async (req, res) => {
  try {
    const { fromDate, toDate, limit, sortBy, order, profileId, accountId, page } = req.query;
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (limit) params.limit = limit;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (profileId) params.profileId = profileId;
    if (page) params.page = page;

    const data = await getPinterestAnalytics(params);
    const rawPosts = extractAnalyticsItems(data);
    const posts = filterByAccount(rawPosts.map(normalizePinterestPost), accountId);

    const totals = posts.reduce((acc, post) => {
      acc.impressions += post.impressions || 0;
      acc.saves += post.saves || 0;
      acc.clicks += post.clicks || 0;
      acc.engagement += post.engagement || 0;
      return acc;
    }, { impressions: 0, saves: 0, clicks: 0, engagement: 0 });

    const accountMap = {};
    posts.forEach((post) => {
      if (!post.accountId) return;
      if (!accountMap[post.accountId]) {
        accountMap[post.accountId] = {
          id: post.accountId,
          name: post.accountName || post.accountId
        };
      }
    });

    res.json({
      summary: {
        ...totals,
        engagementRate: totals.impressions ? totals.engagement / totals.impressions : 0,
        pins: posts.length
      },
      accounts: Object.values(accountMap),
      posts,
      lastUpdated: data?.lastUpdated || data?.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Failed to fetch Pinterest performance',
      details: error.response?.data || error.message
    });
  }
});

// Pinterest board analytics
app.get('/api/pinterest/boards', async (req, res) => {
  try {
    const { fromDate, toDate, limit, sortBy, order, profileId, accountId, page } = req.query;
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (limit) params.limit = limit;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (profileId) params.profileId = profileId;
    if (page) params.page = page;

    const data = await getPinterestAnalytics(params);
    const posts = filterByAccount(extractAnalyticsItems(data).map(normalizePinterestPost), accountId);

    const boards = {};
    posts.forEach((post) => {
      const key = post.board || 'Uncategorized';
      if (!boards[key]) {
        boards[key] = {
          board: key,
          impressions: 0,
          saves: 0,
          clicks: 0,
          engagement: 0,
          pins: 0
        };
      }
      boards[key].impressions += post.impressions || 0;
      boards[key].saves += post.saves || 0;
      boards[key].clicks += post.clicks || 0;
      boards[key].engagement += post.engagement || 0;
      boards[key].pins += 1;
    });

    const boardList = Object.values(boards).map((board) => ({
      ...board,
      engagementRate: board.impressions ? board.engagement / board.impressions : 0
    }));

    res.json({
      boards: boardList,
      lastUpdated: data?.lastUpdated || data?.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Failed to fetch Pinterest boards',
      details: error.response?.data || error.message
    });
  }
});

// Pinterest top pins
app.get('/api/pinterest/top-pins', async (req, res) => {
  try {
    const { fromDate, toDate, limit = 25, sortBy = 'impressions', order = 'desc', profileId, accountId, page } = req.query;
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (limit) params.limit = limit;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (profileId) params.profileId = profileId;
    if (page) params.page = page;

    const data = await getPinterestAnalytics(params);
    const posts = filterByAccount(extractAnalyticsItems(data).map(normalizePinterestPost), accountId);

    const sorted = [...posts].sort((a, b) => {
      const aVal = a[sortBy] ?? 0;
      const bVal = b[sortBy] ?? 0;
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    });

    res.json({
      pins: sorted.slice(0, Number(limit)),
      lastUpdated: data?.lastUpdated || data?.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Failed to fetch Pinterest top pins',
      details: error.response?.data || error.message
    });
  }
});

// Pinterest engagement trends
app.get('/api/pinterest/trends', async (req, res) => {
  try {
    const { fromDate, toDate, limit, sortBy, order, profileId, accountId, page } = req.query;
    const params = {};
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (limit) params.limit = limit;
    if (sortBy) params.sortBy = sortBy;
    if (order) params.order = order;
    if (profileId) params.profileId = profileId;
    if (page) params.page = page;

    const data = await getPinterestAnalytics(params);
    const posts = filterByAccount(extractAnalyticsItems(data).map(normalizePinterestPost), accountId);

    const trendMap = {};
    posts.forEach((post) => {
      if (!post.publishedAt) return;
      const dateKey = post.publishedAt.split('T')[0];
      if (!trendMap[dateKey]) {
        trendMap[dateKey] = { date: dateKey, impressions: 0, saves: 0, clicks: 0, engagement: 0 };
      }
      trendMap[dateKey].impressions += post.impressions || 0;
      trendMap[dateKey].saves += post.saves || 0;
      trendMap[dateKey].clicks += post.clicks || 0;
      trendMap[dateKey].engagement += post.engagement || 0;
    });

    const trends = Object.values(trendMap).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      trends,
      lastUpdated: data?.lastUpdated || data?.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    const status = error.response?.status || 500;
    res.status(status).json({
      error: 'Failed to fetch Pinterest trends',
      details: error.response?.data || error.message
    });
  }
});

// Get alerts
app.get('/api/alerts', (req, res) => {
  const data = readJsonFile('alerts.json');
  if (data) {
    res.json(data);
  } else {
    res.json({ alerts: [] }); // Return empty if no alerts
  }
});

// Get goals
app.get('/api/goals', (req, res) => {
  const data = readJsonFile('goals.json');
  if (data) {
    res.json(data);
  } else {
    // Default goals
    res.json({
      monthly: {
        target: 20000,
        minimum: 15000
      }
    });
  }
});

// POST endpoint to update data (used by Maria's scripts)
app.post('/api/update/:type', (req, res) => {
  const { type } = req.params;
  const validTypes = ['revenue', 'mediavine', 'raptive', 'etsy', 'social', 'alerts', 'goals'];
  
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: `Invalid data type: ${type}` });
  }
  
  const data = {
    ...req.body,
    lastUpdated: new Date().toISOString()
  };
  
  if (writeJsonFile(`${type}.json`, data)) {
    res.json({ success: true, message: `${type} data updated` });
  } else {
    res.status(500).json({ error: `Failed to update ${type} data` });
  }
});

// Sync all data sources
app.post('/api/sync', async (req, res) => {
  console.log('🔄 Sync triggered via API...');
  
  try {
    const { syncAll } = require('./scripts/sync-all-data.js');
    const results = await syncAll();
    
    res.json({
      success: true,
      message: 'Data sync complete',
      results: results
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get last sync status
app.get('/api/sync/status', (req, res) => {
  const lastSync = readJsonFile('last-sync.json');
  res.json(lastSync || { status: 'never synced' });
});

// Get dashboard summary (all data in one call)
app.get('/api/dashboard', (req, res) => {
  const revenue = readJsonFile('revenue.json');
  const mediavine = readJsonFile('mediavine.json');
  const raptive = readJsonFile('raptive.json');
  const etsy = readJsonFile('etsy.json');
  const social = readJsonFile('social.json');
  const alerts = readJsonFile('alerts.json');
  const goals = readJsonFile('goals.json');
  
  res.json({
    revenue,
    mediavine,
    raptive,
    etsy,
    social,
    alerts: alerts || { alerts: [] },
    goals: goals || { monthly: { target: 20000, minimum: 15000 } },
    meta: {
      fetchedAt: new Date().toISOString()
    }
  });
});

// ═══════════════════════════════════════════
// KANBAN CARD ENDPOINTS
// ═══════════════════════════════════════════

const CARDS_FILE = path.join(__dirname, '../../../dashboard/data/cards.json');

// Helper to read cards
const readCards = () => {
  try {
    if (fs.existsSync(CARDS_FILE)) {
      return JSON.parse(fs.readFileSync(CARDS_FILE, 'utf8'));
    }
    return [];
  } catch (error) {
    console.error('Error reading cards:', error.message);
    return [];
  }
};

// Helper to write cards
const writeCards = (cards) => {
  try {
    fs.writeFileSync(CARDS_FILE, JSON.stringify(cards, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing cards:', error.message);
    return false;
  }
};

// Get all cards
app.get('/api/cards', (req, res) => {
  const cards = readCards();
  res.json(cards);
});

// Create new card
app.post('/api/cards', (req, res) => {
  const cards = readCards();
  const newCard = {
    id: `card-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  cards.unshift(newCard);
  if (writeCards(cards)) {
    res.json(newCard);
  } else {
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// Update card
app.put('/api/cards/:id', (req, res) => {
  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Card not found' });
  }
  cards[index] = {
    ...cards[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  if (writeCards(cards)) {
    res.json(cards[index]);
  } else {
    res.status(500).json({ error: 'Failed to update card' });
  }
});

// Delete card
app.delete('/api/cards/:id', (req, res) => {
  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Card not found' });
  }
  const deleted = cards.splice(index, 1)[0];
  if (writeCards(cards)) {
    res.json({ success: true, deleted });
  } else {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Move card to column (convenience endpoint)
app.patch('/api/cards/:id/move', (req, res) => {
  const { column } = req.body;
  const cards = readCards();
  const index = cards.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Card not found' });
  }
  cards[index].column = column;
  cards[index].updatedAt = new Date().toISOString();
  if (writeCards(cards)) {
    res.json(cards[index]);
  } else {
    res.status(500).json({ error: 'Failed to move card' });
  }
});

// ═══════════════════════════════════════════
// AGENT STATUS ENDPOINT
// ═══════════════════════════════════════════

const AGENT_CONFIG = [
  {
    id: 'content-seo',
    name: 'Sage',
    emoji: '📊',
    role: 'Content & SEO Director',
    model: 'Kimi K2.5 Free',
    workspacePrefix: '/home/openclaw/team/content-seo',
    cronJobs: [
      { name: 'seo-daily-traffic', schedule: 'Daily 9am MT', description: 'Daily traffic analysis' },
      { name: 'seo-weekly-calendar', schedule: 'Sunday 8pm MT', description: 'Weekly content planning' }
    ]
  },
  {
    id: 'etsy-director',
    name: 'Scout',
    emoji: '🎯',
    role: 'Etsy Director',
    model: 'Kimi K2.5 Free',
    workspacePrefix: '/home/openclaw/team/etsy-director',
    cronJobs: [
      { name: 'etsy-daily-check', schedule: 'Daily 8am MT', description: 'Morning shop health check' },
      { name: 'etsy-weekly-keywords', schedule: 'Wednesday 8am MT', description: 'Weekly keyword research' },
      { name: 'scout-evening-sales', schedule: 'Daily 6pm MT', description: 'Evening sales review' }
    ]
  },
  {
    id: 'webdev',
    name: 'Dev',
    emoji: '⚡',
    role: 'Web Dev Lead',
    model: 'Kimi K2.5 Free',
    workspacePrefix: '/home/openclaw/team/webdev',
    cronJobs: [
      { name: 'dev-site-health', schedule: 'Daily 7am MT', description: 'Site health monitoring' },
      { name: 'dev-quick-ping', schedule: '4x daily', description: 'Quick uptime checks' }
    ]
  },
  {
    id: 'designer',
    name: 'Pixel',
    emoji: '🎨',
    role: 'Design Director',
    model: 'Kimi K2.5 Free',
    workspacePrefix: '/home/openclaw/team/designer',
    cronJobs: [
      { name: 'design-weekly-trends', schedule: 'Monday 11am MT', description: 'Weekly design trends' }
    ]
  },
  {
    id: 'psalmix',
    name: 'Milo',
    emoji: '🎵',
    role: 'PsalMix Brand Manager',
    model: 'Kimi K2.5 Free',
    workspacePrefix: '/home/openclaw/team/psalmix',
    cronJobs: [
      { name: 'psalmix-daily-prep', schedule: 'Daily 10am MT', description: 'Daily brand prep' }
    ]
  },
  {
    id: 'dhanielle',
    name: 'Ally',
    emoji: '✨',
    role: "Dhanielle's AI Assistant",
    model: 'Kimi K2.5 Free',
    workspacePrefix: '/home/openclaw/team/dhanielle',
    cronJobs: [
      { name: 'sage-evening-recap', schedule: 'Daily 6pm MT', description: 'Evening recap' }
    ]
  }
];

// Get agent status
app.get('/api/agents/status', async (req, res) => {
  try {
    const agents = await Promise.all(
      AGENT_CONFIG.map(async (agent) => {
        try {
          // Read SESSION_STATE.md
          let currentFocus = '';
          let lastActivity = null;
          const sessionStatePath = path.join(agent.workspacePrefix, 'SESSION_STATE.md');
          if (fs.existsSync(sessionStatePath)) {
            const sessionContent = fs.readFileSync(sessionStatePath, 'utf8');
            // Extract current focus (first non-header line)
            const lines = sessionContent.split('\n').filter(line => !line.startsWith('#') && line.trim());
            currentFocus = lines[0] || '';
            // Get last modified time
            const stats = fs.statSync(sessionStatePath);
            lastActivity = stats.mtime.toISOString();
          }

          // Read IDENTITY.md if it exists for additional info
          const identityPath = path.join(agent.workspacePrefix, 'IDENTITY.md');
          let identityData = {};
          if (fs.existsSync(identityPath)) {
            // Just check existence, we already have name/role/emoji from config
            const stats = fs.statSync(identityPath);
            if (!lastActivity || new Date(stats.mtime) > new Date(lastActivity)) {
              lastActivity = stats.mtime.toISOString();
            }
          }

          // Read skills from skills/ directory
          let skills = [];
          const skillsPath = path.join(agent.workspacePrefix, 'skills');
          if (fs.existsSync(skillsPath)) {
            const skillDirs = fs.readdirSync(skillsPath)
              .filter(item => {
                const itemPath = path.join(skillsPath, item);
                return fs.statSync(itemPath).isDirectory();
              });
            skills = skillDirs;
          }

          // Determine status based on last activity
          let status = 'idle';
          if (lastActivity) {
            const timeSinceActivity = Date.now() - new Date(lastActivity).getTime();
            const hoursSinceActivity = timeSinceActivity / (1000 * 60 * 60);
            if (hoursSinceActivity < 2) {
              status = 'active';
            }
          }

          return {
            id: agent.id,
            name: agent.name,
            emoji: agent.emoji,
            role: agent.role,
            model: agent.model,
            status,
            currentFocus: currentFocus.substring(0, 200), // Truncate
            lastActivity,
            skills: skills.slice(0, 10), // Limit to 10 skills for display
            cronJobs: agent.cronJobs,
            location: 'VPS'
          };
        } catch (error) {
          console.error(`Error reading agent ${agent.id}:`, error.message);
          return {
            id: agent.id,
            name: agent.name,
            emoji: agent.emoji,
            role: agent.role,
            model: agent.model,
            status: 'error',
            currentFocus: 'Unable to read workspace',
            lastActivity: null,
            skills: [],
            cronJobs: agent.cronJobs,
            location: 'VPS'
          };
        }
      })
    );

    // Add Maria (main agent on Mac mini)
    agents.push({
      id: 'main',
      name: 'Maria',
      emoji: '💃🏼',
      role: 'COO — Chief Operations Officer',
      model: 'Claude Opus 4.6',
      status: 'active',
      currentFocus: 'Coordinates all agents, handles direct conversations with McKinzie',
      lastActivity: new Date().toISOString(),
      skills: ['Full Stack', 'Strategic Planning', 'Team Coordination'],
      cronJobs: [
        { name: 'morning-briefing', schedule: 'Daily 9:30am MT', description: 'Daily morning brief' },
        { name: 'evening-brief', schedule: 'Daily 9:30pm MT', description: 'Evening summary' },
        { name: 'nightly-proactive-work', schedule: 'Daily 11pm MT', description: 'Autonomous overnight work' },
        { name: 'weekly-project-review', schedule: 'Sunday 9pm MT', description: 'Weekly project status' }
      ],
      location: 'Mac mini'
    });

    // Add Dhanielle (human team member)
    agents.push({
      id: 'dhanielle-human',
      name: 'Dhanielle',
      emoji: '👩‍💼',
      role: 'Operations Manager',
      model: null,
      status: 'active',
      currentFocus: 'Pinterest scheduling, content publishing, team coordination',
      lastActivity: new Date().toISOString(),
      skills: ['Pinterest', 'Content Publishing', 'Team Management', 'Operations'],
      cronJobs: [],
      location: 'Remote',
      isHuman: true
    });

    res.json(agents);
  } catch (error) {
    console.error('Error fetching agent status:', error);
    res.status(500).json({ error: 'Failed to fetch agent status' });
  }
});

// Automation API routes
try {
  const automationsAPI = require('./automations-api.js');
  app.use('/api/automations', automationsAPI);
  console.log('✅ Automations API loaded');
} catch (error) {
  console.warn('⚠️ Automations API not yet available:', error.message);
}

// ═══════════════════════════════════════════
// DEEP DIVE ROUTES
// ═══════════════════════════════════════════

// Drill-down routes (source landing pages, page details)
try {
  const drilldownRoutes = require('./routes/drilldown.js');
  app.use('/api/sites', drilldownRoutes);
  console.log('✅ Drilldown routes loaded');
} catch (error) {
  console.warn('⚠️ Drilldown routes not available:', error.message);
}

// Compare routes (cross-site comparison)
try {
  const compareRoutes = require('./routes/compare.js');
  app.use('/api/compare', compareRoutes);
  console.log('✅ Compare routes loaded');
} catch (error) {
  console.warn('⚠️ Compare routes not available:', error.message);
}

// Start server
// Kanban API routes
const kanbanRoutes = require('./routes/kanban');
app.use('/api/kanban', kanbanRoutes);

// Activity API routes
try {
  const activityRoutes = require('./routes/activity');
  app.use('/api/activity', activityRoutes);
  console.log('✅ Activity routes loaded');
} catch (error) {
  console.warn('⚠️ Activity routes not available:', error.message);
}

// Initialize WebSocket
initWebSocket(server);
console.log('✅ WebSocket initialized on /ws/kanban');

server.listen(PORT, '0.0.0.0', () => {
  console.log(`📊 Analytics Dashboard Backend running on http://localhost:${PORT}`);
  console.log(`📁 Data directory: ${DATA_DIR}`);
  console.log(`🔌 WebSocket available on ws://localhost:${PORT}/ws/kanban`);
  console.log(`\nEndpoints:`);
  console.log(`  GET  /health          - Health check`);
  console.log(`  GET  /api/dashboard   - All data in one call`);
  console.log(`  GET  /api/revenue     - Hero metrics`);
  console.log(`  GET  /api/mediavine   - Mediavine sites`);
  console.log(`  GET  /api/raptive     - Raptive sites`);
  console.log(`  GET  /api/sites       - All content sites`);
  console.log(`  GET  /api/etsy        - Etsy shops`);
  console.log(`  GET  /api/social      - Social/traffic data`);
  console.log(`  GET  /api/alerts      - Active alerts`);
  console.log(`  GET  /api/goals       - Monthly targets`);
  console.log(`  GET  /api/kanban/*    - Kanban board API`);
  console.log(`  GET  /api/activity/*  - Activity feed API`);
  console.log(`  POST /api/update/:type - Update data`);
  console.log(`  POST /api/sync        - Sync all data sources`);
  console.log(`  GET  /api/sync/status - Last sync status`);
});
