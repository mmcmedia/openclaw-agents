const express = require('express');
const router = express.Router();
const cache = require('../cache');
const ga4Client = require('../clients/ga4');
const getLateClient = require('../clients/getlate');
const fs = require('fs');
const path = require('path');

// Load GA4 properties list
const propertiesPath = path.join(__dirname, '../../GA4-PROPERTIES.json');
const GA4_PROPERTIES = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

// Site-to-account mapping (will be enhanced later)
// For now, we'll match by name similarity
const SITE_MAPPINGS = {
  'Hello Hayley': {
    ga4PropertyId: '361561956',
    socialAccounts: ['hellohayley_pinterest', 'hellohayley_facebook', 'hellohayley_instagram']
  },
  'We Heart This': {
    ga4PropertyId: '347579229',
    socialAccounts: ['weheartthis_pinterest', 'weheartthis_facebook']
  },
  'Melrose Family': {
    ga4PropertyId: '312388993',
    socialAccounts: ['melrosefamily_facebook', 'melrosefamily_instagram']
  }
};

const calculateChange = (curr, prev) => {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
};

// GET /api/sites - List all sites with their connected accounts
router.get('/', async (req, res) => {
  try {
    const period = req.query.period || '30daysAgo';
    const cacheKey = `sites_list_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Fetch GetLate accounts to see what's available
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const toDate = new Date();
    
    let socialAccounts = [];
    try {
      const followerStats = await getLateClient.getFollowerStats();
      socialAccounts = followerStats.accounts || [];
    } catch (error) {
      console.log('Could not fetch social accounts:', error.message);
    }

    // Build sites list from GA4 properties
    const sites = GA4_PROPERTIES.list.map(prop => {
      const siteName = prop.property.replace(' - GA4', '').replace(' GA4', '');
      
      // Find matching social accounts (basic name matching for now)
      const connectedAccounts = socialAccounts.filter(acc => 
        acc.name?.toLowerCase().includes(siteName.toLowerCase()) ||
        siteName.toLowerCase().includes(acc.name?.toLowerCase())
      );

      return {
        id: prop.id,
        name: siteName,
        ga4PropertyId: prop.id,
        account: prop.account,
        connectedAccounts: connectedAccounts.map(acc => ({
          id: acc.id,
          platform: acc.platform,
          name: acc.name,
          followers: acc.followers || 0
        })),
        socialPlatforms: [...new Set(connectedAccounts.map(acc => acc.platform))]
      };
    });

    const result = {
      sites,
      count: sites.length,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 30 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /sites:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sites/:siteId - Get all data for one site (GA4 + social)
router.get('/:siteId', async (req, res) => {
  try {
    const { siteId } = req.params;
    const period = req.query.period || '30daysAgo';
    const cacheKey = `site_${siteId}_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Find the site
    const site = GA4_PROPERTIES.list.find(p => p.id === siteId);
    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    // Fetch GA4 metrics
    let ga4Data = null;
    try {
      const metricsReport = await ga4Client.getMetrics(siteId, period, 'today');
      
      const current = { sessions: 0, users: 0, pageviews: 0, engagementRate: 0 };
      const previous = { sessions: 0, users: 0, pageviews: 0, engagementRate: 0 };

      if (metricsReport.rows) {
        metricsReport.rows.forEach((row) => {
          const dateRange = row.dimensionValues?.[1]?.value || 'date_range_0';
          const sessions = parseInt(row.metricValues[0].value || 0, 10);
          const users = parseInt(row.metricValues[1].value || 0, 10);
          const pageviews = parseInt(row.metricValues[2].value || 0, 10);
          const engagementRate = parseFloat(row.metricValues[4].value || 0);

          if (dateRange === 'date_range_0') {
            current.sessions += sessions;
            current.users += users;
            current.pageviews += pageviews;
            current.engagementRate = engagementRate;
          } else if (dateRange === 'date_range_1') {
            previous.sessions += sessions;
            previous.users += users;
            previous.pageviews += pageviews;
            previous.engagementRate = engagementRate;
          }
        });
      }

      // Fetch traffic sources
      const trafficReport = await ga4Client.getTrafficSources(siteId, period, 'today');
      const trafficSources = (trafficReport.rows || []).map(row => ({
        source: row.dimensionValues[0].value,
        medium: row.dimensionValues[1].value,
        sessions: parseInt(row.metricValues[0].value || 0, 10),
        users: parseInt(row.metricValues[1].value || 0, 10)
      }));

      ga4Data = {
        current,
        previous,
        change: {
          sessions: calculateChange(current.sessions, previous.sessions),
          users: calculateChange(current.users, previous.users),
          pageviews: calculateChange(current.pageviews, previous.pageviews)
        },
        trafficSources
      };
    } catch (error) {
      console.error(`Error fetching GA4 data for ${siteId}:`, error.message);
    }

    // Fetch social accounts data (placeholder for now)
    // In real implementation, we'd match by site name and fetch from GetLate
    const socialData = {
      platforms: [],
      accounts: []
    };

    try {
      const daysAgo = period === '30daysAgo' ? 30 : 7;
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - daysAgo);
      const analytics = await getLateClient.getAnalytics(
        fromDate.toISOString().split('T')[0],
        new Date().toISOString().split('T')[0],
        100
      );

      // Filter analytics by site (basic matching)
      const siteName = site.property.replace(' - GA4', '').replace(' GA4', '');
      const matchingPosts = (analytics.posts || []).filter(post =>
        post.accountName?.toLowerCase().includes(siteName.toLowerCase())
      );

      if (matchingPosts.length > 0) {
        const platformStats = {};
        matchingPosts.forEach(post => {
          if (!platformStats[post.platform]) {
            platformStats[post.platform] = {
              platform: post.platform,
              impressions: 0,
              clicks: 0,
              saves: 0,
              engagement: 0
            };
          }
          platformStats[post.platform].impressions += post.impressions || 0;
          platformStats[post.platform].clicks += post.clicks || 0;
          platformStats[post.platform].saves += post.saves || 0;
          platformStats[post.platform].engagement += (post.likes || 0) + (post.comments || 0);
        });

        socialData.platforms = Object.values(platformStats);
      }
    } catch (error) {
      console.error(`Error fetching social data for ${siteId}:`, error.message);
    }

    const result = {
      id: siteId,
      name: site.property.replace(' - GA4', '').replace(' GA4', ''),
      account: site.account,
      ga4: ga4Data,
      social: socialData,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 15 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in GET /sites/:siteId:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
