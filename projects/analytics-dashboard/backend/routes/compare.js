const express = require('express');
const router = express.Router();
const cache = require('../cache');
const ga4Client = require('../clients/ga4');
const fs = require('fs');
const path = require('path');

// Load GA4 properties
const propertiesPath = path.join(__dirname, '../../GA4-PROPERTIES.json');
const GA4_PROPERTIES = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

// Site ID to property mapping
const getPropertyBySiteId = (siteId) => {
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

// Site slug to property mapping (for common names)
const SITE_SLUG_MAP = {
  'hello-hayley': '361561956',
  'melrose-family': '312388993',
  'we-heart-this': '347579229',
  'moms-make-cents': '352646496',
  'living-tickled': '352643224',
  'today-mommy': '352650803',
  'we-heart-cozy': '470376528'
};

// ═══════════════════════════════════════════════════════════════
// POST /api/compare
// Cross-site comparison endpoint
// Body: { sites: ['hello-hayley', 'melrose-family'], metric: 'sessions', days: 30 }
// ═══════════════════════════════════════════════════════════════
router.post('/', async (req, res) => {
  try {
    const { sites: siteIds, metric = 'sessions', days = 30 } = req.body;
    
    if (!siteIds || !Array.isArray(siteIds) || siteIds.length === 0) {
      return res.status(400).json({ error: 'sites array is required' });
    }

    if (siteIds.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 sites can be compared at once' });
    }

    const validMetrics = ['sessions', 'screenPageViews', 'totalUsers', 'engagedSessions', 'bounceRate'];
    if (!validMetrics.includes(metric)) {
      return res.status(400).json({ 
        error: `Invalid metric. Must be one of: ${validMetrics.join(', ')}` 
      });
    }

    const cacheKey = `compare_${siteIds.sort().join('_')}_${metric}_${days}`;

    // Check cache (1 hour TTL for comparison data)
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const startDate = `${days}daysAgo`;
    const endDate = 'today';

    // Fetch data for each site
    const sitePromises = siteIds.map(async (siteId) => {
      // Resolve site ID to property
      const propertyId = SITE_SLUG_MAP[siteId.toLowerCase()] || siteId;
      const property = getPropertyBySiteId(propertyId);
      
      if (!property) {
        return {
          id: siteId,
          name: siteId,
          error: 'Site not found'
        };
      }

      try {
        // Fetch 1: Overall metrics for this site
        const metricsConfig = {
          dateRanges: [
            { startDate, endDate },
            { 
              startDate: `${days * 2}daysAgo`, 
              endDate: `${days}daysAgo` 
            }
          ],
          metrics: [
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'totalUsers' },
            { name: 'engagedSessions' },
            { name: 'bounceRate' },
            { name: 'averageSessionDuration' }
          ]
        };

        // Fetch 2: Time series data for the chart
        const timeSeriesConfig = {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: 'date' }],
          metrics: [
            { name: metric }
          ],
          orderBys: [{ dimension: { dimensionName: 'date' } }]
        };

        // Fetch 3: Traffic sources breakdown
        const sourcesConfig = {
          dateRanges: [{ startDate, endDate }],
          dimensions: [
            { name: 'sessionSource' }
          ],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 5
        };

        const [metricsResponse, timeSeriesResponse, sourcesResponse] = await Promise.all([
          ga4Client.runReport(property.id, metricsConfig),
          ga4Client.runReport(property.id, timeSeriesConfig),
          ga4Client.runReport(property.id, sourcesConfig)
        ]);

        // Process overall metrics
        const current = { sessions: 0, pageviews: 0, users: 0, engagementRate: 0, bounceRate: 0, avgDuration: 0 };
        const previous = { sessions: 0, pageviews: 0, users: 0 };

        if (metricsResponse.rows) {
          metricsResponse.rows.forEach(row => {
            const dateRange = row.dimensionValues?.[0]?.value || 'date_range_0';
            const sessions = parseInt(row.metricValues[0].value || 0, 10);
            const pageviews = parseInt(row.metricValues[1].value || 0, 10);
            const users = parseInt(row.metricValues[2].value || 0, 10);
            const engagedSessions = parseInt(row.metricValues[3].value || 0, 10);
            const bounceRate = parseFloat(row.metricValues[4].value || 0);
            const avgDuration = parseFloat(row.metricValues[5].value || 0);

            if (dateRange === 'date_range_0') {
              current.sessions = sessions;
              current.pageviews = pageviews;
              current.users = users;
              current.engagementRate = sessions > 0 ? Math.round((engagedSessions / sessions) * 10000) / 100 : 0;
              current.bounceRate = Math.round(bounceRate * 10000) / 100;
              current.avgDuration = Math.round(avgDuration);
            } else {
              previous.sessions = sessions;
              previous.pageviews = pageviews;
              previous.users = users;
            }
          });
        }

        // Calculate changes
        const calculateChange = (curr, prev) => {
          if (prev === 0) return curr > 0 ? 100 : 0;
          return Math.round(((curr - prev) / prev) * 1000) / 10;
        };

        // Process time series
        const timeSeries = [];
        if (timeSeriesResponse?.rows) {
          timeSeriesResponse.rows.forEach(row => {
            const dateStr = row.dimensionValues[0].value;
            const formattedDate = `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
            timeSeries.push({
              date: formattedDate,
              value: parseInt(row.metricValues[0].value || 0, 10)
            });
          });
        }

        // Process traffic sources
        let totalSourceSessions = 0;
        const sources = [];
        if (sourcesResponse?.rows) {
          sourcesResponse.rows.forEach(row => {
            totalSourceSessions += parseInt(row.metricValues[0].value || 0, 10);
          });
          
          sourcesResponse.rows.forEach(row => {
            const source = row.dimensionValues[0].value || 'Direct';
            const sessions = parseInt(row.metricValues[0].value || 0, 10);
            sources.push({
              source,
              sessions,
              percent: totalSourceSessions > 0 
                ? Math.round((sessions / totalSourceSessions) * 1000) / 10 
                : 0
            });
          });
        }

        // Find Pinterest and Google percentages
        const pinterest = sources.find(s => s.source.toLowerCase().includes('pinterest'));
        const google = sources.find(s => s.source.toLowerCase().includes('google'));

        return {
          id: siteId,
          name: property.property.replace(' - GA4', '').replace(' GA4', '').replace('https://www.', '').replace('.com', ''),
          propertyId: property.id,
          current,
          previous,
          changes: {
            sessions: calculateChange(current.sessions, previous.sessions),
            pageviews: calculateChange(current.pageviews, previous.pageviews),
            users: calculateChange(current.users, previous.users)
          },
          timeSeries,
          sources: {
            pinterest: pinterest?.percent || 0,
            google: google?.percent || 0,
            breakdown: sources
          }
        };
      } catch (error) {
        console.error(`Error fetching data for ${siteId}:`, error.message);
        return {
          id: siteId,
          name: siteId,
          error: error.message
        };
      }
    });

    const results = await Promise.all(sitePromises);
    
    // Check if any results have errors
    const errors = results.filter(r => r.error);
    const validResults = results.filter(r => !r.error);

    // Build comparison table
    const comparisonTable = validResults.map(site => ({
      id: site.id,
      name: site.name,
      sessions: site.current.sessions,
      pageviews: site.current.pageviews,
      users: site.current.users,
      engagementRate: site.current.engagementRate,
      bounceRate: site.current.bounceRate,
      avgDuration: site.current.avgDuration,
      pinterestPercent: site.sources.pinterest,
      googlePercent: site.sources.google,
      changes: site.changes
    }));

    // Build time series for chart (merge all sites)
    const chartData = {};
    validResults.forEach(site => {
      site.timeSeries.forEach(point => {
        if (!chartData[point.date]) {
          chartData[point.date] = { date: point.date };
        }
        chartData[point.date][site.id] = point.value;
      });
    });

    const result = {
      sites: siteIds,
      metric,
      days,
      comparisonTable,
      timeSeries: Object.values(chartData).sort((a, b) => new Date(a.date) - new Date(b.date)),
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    };

    // Cache for 1 hour
    cache.set(cacheKey, result, 60 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in compare endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to fetch comparison data',
      details: error.message 
    });
  }
});

// ═══════════════════════════════════════════════════════════════
// GET /api/compare/sites
// Get list of available sites for comparison
// ═══════════════════════════════════════════════════════════════
router.get('/sites', async (req, res) => {
  try {
    const cacheKey = 'compare_sites_list';
    
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const sites = GA4_PROPERTIES.list.map(prop => {
      const name = prop.property.replace(' - GA4', '').replace(' GA4', '').replace('https://www.', '').replace('.com', '');
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      return {
        id: prop.id,
        slug,
        name,
        account: prop.account
      };
    });

    const result = {
      sites,
      defaultSites: ['hello-hayley', 'melrose-family', 'we-heart-this']
        .filter(slug => sites.some(s => s.slug === slug))
        .map(slug => sites.find(s => s.slug === slug).id)
    };

    // Cache for 1 hour
    cache.set(cacheKey, result, 60 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error fetching sites list:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;