const express = require('express');
const router = express.Router();
const cache = require('../cache');
const ga4Client = require('../clients/ga4');
const fs = require('fs');
const path = require('path');

// Load GA4 properties
const propertiesPath = path.join(__dirname, '../../GA4-PROPERTIES.json');
const GA4_PROPERTIES = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

// Helper to find property by siteId
const findProperty = (siteId) => {
  // Try exact match first
  let prop = GA4_PROPERTIES.list.find(p => p.id === siteId);
  if (prop) return prop;
  
  // Try by slugified name
  const normalizedId = siteId.toLowerCase().replace(/[^a-z0-9]/g, '-');
  prop = GA4_PROPERTIES.list.find(p => {
    const slug = p.property.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return slug.includes(normalizedId) || normalizedId.includes(slug);
  });
  return prop;
};

// Helper to format duration in seconds to readable string
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}:${remainingMins.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ═══════════════════════════════════════════════════════════════
// GET /api/sites/:siteId/sources/:source/landing-pages
// Get landing pages for a specific traffic source with medium breakdown
// ═══════════════════════════════════════════════════════════════
router.get('/:siteId/sources/:source/landing-pages', async (req, res) => {
  try {
    const { siteId, source } = req.params;
    const days = parseInt(req.query.days, 10) || 30;
    const cacheKey = `source_drilldown_${siteId}_${source}_${days}`;

    // Check cache (15 min TTL for drill-downs)
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Find the GA4 property
    const property = findProperty(siteId);
    if (!property) {
      return res.status(404).json({ error: 'Site not found' });
    }

    const startDate = `${days}daysAgo`;
    const endDate = 'today';

    // Fetch data: sessionSource + sessionMedium + landingPage
    const config = {
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
        { name: 'landingPage' }
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'sessionSource',
          stringFilter: {
            matchType: 'EXACT',
            value: source.toLowerCase(),
            caseSensitive: false
          }
        }
      },
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 100
    };

    const response = await ga4Client.runReport(property.id, config);

    // Check for sampling
    const isSampled = cache.isSampled(response);

    // Process the data
    const mediums = {};
    const landingPages = [];
    let totalSessions = 0;

    if (response.rows) {
      response.rows.forEach(row => {
        const medium = row.dimensionValues[1].value || '(not set)';
        const landingPage = row.dimensionValues[2].value || '/';
        const sessions = parseInt(row.metricValues[0].value || 0, 10);
        const bounceRate = parseFloat(row.metricValues[1].value || 0);
        const avgDuration = parseFloat(row.metricValues[2].value || 0);

        // Aggregate by medium
        if (!mediums[medium]) {
          mediums[medium] = { medium, sessions: 0 };
        }
        mediums[medium].sessions += sessions;
        totalSessions += sessions;

        // Track landing pages
        landingPages.push({
          path: landingPage,
          sessions,
          bounceRate: Math.round(bounceRate * 100) / 100,
          avgDuration: formatDuration(avgDuration)
        });
      });
    }

    // Calculate medium percentages
    const mediumArray = Object.values(mediums)
      .map(m => ({
        ...m,
        percent: totalSessions > 0 ? Math.round((m.sessions / totalSessions) * 1000) / 10 : 0
      }))
      .sort((a, b) => b.sessions - a.sessions);

    // Sort landing pages and take top 20
    const topLandingPages = landingPages
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 20);

    const result = {
      source: source.toLowerCase(),
      sourceDisplay: source.charAt(0).toUpperCase() + source.slice(1).toLowerCase(),
      sessions: totalSessions,
      mediums: mediumArray,
      landingPages: topLandingPages,
      warning: isSampled ? 'Based on sampled data' : null,
      timestamp: new Date().toISOString()
    };

    // Cache for 15 minutes
    cache.set(cacheKey, result, 15 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in source drill-down:', error);
    res.status(500).json({ 
      error: 'Failed to fetch source drill-down data',
      details: error.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/sites/:siteId/pages/:pagePath
// Get detailed metrics for a specific page
// ═══════════════════════════════════════════════════════════════
router.get('/:siteId/pages/*', async (req, res) => {
  try {
    const { siteId } = req.params;
    const pagePath = req.params[0] || '/';
    const days = parseInt(req.query.days, 10) || 30;
    const cacheKey = `page_detail_${siteId}_${Buffer.from(pagePath).toString('base64')}_${days}`;

    // Check cache (15 min TTL)
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Find the GA4 property
    const property = findProperty(siteId);
    if (!property) {
      return res.status(404).json({ error: 'Site not found' });
    }

    const startDate = `${days}daysAgo`;
    const endDate = 'today';

    // Fetch 1: Page overview metrics
    const overviewConfig = {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'pageTitle' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'engagementRate' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: pagePath
          }
        }
      }
    };

    // Fetch 2: Traffic sources breakdown
    const sourcesConfig = {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [
        { name: 'sessions' },
        { name: 'screenPageViews' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: pagePath
          }
        }
      },
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 10
    };

    // Fetch 3: 30-day sparkline data
    const sparklineConfig = {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'screenPageViews' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: pagePath
          }
        }
      },
      orderBys: [{ dimension: { dimensionName: 'date' } }]
    };

    // Run all requests in parallel
    const [overviewResponse, sourcesResponse, sparklineResponse] = await Promise.all([
      ga4Client.runReport(property.id, overviewConfig).catch(err => {
        console.error('Overview fetch error:', err.message);
        return null;
      }),
      ga4Client.runReport(property.id, sourcesConfig).catch(err => {
        console.error('Sources fetch error:', err.message);
        return null;
      }),
      ga4Client.runReport(property.id, sparklineConfig).catch(err => {
        console.error('Sparkline fetch error:', err.message);
        return null;
      })
    ]);

    // Check for sampling
    const isSampled = cache.isSampled(overviewResponse) || 
                      cache.isSampled(sourcesResponse) || 
                      cache.isSampled(sparklineResponse);

    // Process overview
    let pageTitle = '';
    let pageviews = 0;
    let sessions = 0;
    let bounceRate = 0;
    let avgDuration = 0;
    let engagementRate = 0;

    if (overviewResponse?.rows?.[0]) {
      const row = overviewResponse.rows[0];
      pageTitle = row.dimensionValues[0].value || '';
      pageviews = parseInt(row.metricValues[0].value || 0, 10);
      sessions = parseInt(row.metricValues[1].value || 0, 10);
      bounceRate = Math.round(parseFloat(row.metricValues[2].value || 0) * 10000) / 100;
      avgDuration = parseFloat(row.metricValues[3].value || 0);
      engagementRate = Math.round(parseFloat(row.metricValues[4].value || 0) * 10000) / 100;
    }

    // Process sources
    let totalSourceSessions = 0;
    const sources = [];
    if (sourcesResponse?.rows) {
      sourcesResponse.rows.forEach(row => {
        totalSourceSessions += parseInt(row.metricValues[0].value || 0, 10);
      });
      
      sourcesResponse.rows.forEach(row => {
        const source = row.dimensionValues[0].value || 'Direct';
        const sourceSessions = parseInt(row.metricValues[0].value || 0, 10);
        sources.push({
          source,
          sessions: sourceSessions,
          percent: totalSourceSessions > 0 
            ? Math.round((sourceSessions / totalSourceSessions) * 1000) / 10 
            : 0
        });
      });
    }

    // Process sparkline
    const sparkline = [];
    if (sparklineResponse?.rows) {
      sparklineResponse.rows.forEach(row => {
        const dateStr = row.dimensionValues[0].value;
        // Format: YYYYMMDD -> YYYY-MM-DD
        const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
        sparkline.push({
          date: formattedDate,
          views: parseInt(row.metricValues[0].value || 0, 10)
        });
      });
    }

    const result = {
      path: pagePath,
      title: pageTitle,
      pageviews,
      sessions,
      bounceRate,
      avgTime: formatDuration(avgDuration),
      engagementRate,
      sources,
      sparkline,
      warning: isSampled ? 'Based on sampled data' : null,
      timestamp: new Date().toISOString()
    };

    // Cache for 15 minutes
    cache.set(cacheKey, result, 15 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in page detail:', error);
    res.status(500).json({ 
      error: 'Failed to fetch page detail data',
      details: error.message 
    });
  }
});

module.exports = router;