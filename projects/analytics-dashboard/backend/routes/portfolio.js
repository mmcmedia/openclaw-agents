const express = require('express');
const router = express.Router();
const cache = require('../cache');
const ga4Client = require('../clients/ga4');
const fs = require('fs');
const path = require('path');
const { detectAnomalies } = require('../services/anomalyDetection');
const { recognizePatterns } = require('../services/patternRecognition');
const { generateRecommendations } = require('../services/recommendations');

// Load GA4 properties list
const propertiesPath = path.join(__dirname, '../../GA4-PROPERTIES.json');
const GA4_PROPERTIES = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

const calculateChange = (curr, prev) => {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return ((curr - prev) / prev) * 100;
};

async function getPortfolioOverview(period) {
  const properties = await Promise.all(
    GA4_PROPERTIES.list.map(async (prop) => {
      try {
        const data = await ga4Client.getMetrics(prop.id, period, 'today');

        const current = { sessions: 0, users: 0, pageviews: 0, engagementRate: 0 };
        const previous = { sessions: 0, users: 0, pageviews: 0, engagementRate: 0 };

        if (data.rows) {
          data.rows.forEach((row) => {
            const dateRange = row.dimensionValues?.[1]?.value || 'date_range_0';
            const sessions = parseInt(row.metricValues[0].value || 0, 10);
            const users = parseInt(row.metricValues[1].value || 0, 10);
            const pageviews = parseInt(row.metricValues[2].value || 0, 10);
            const engagementRate = parseFloat(row.metricValues[4].value || 0);

            if (dateRange === 'date_range_0') {
              current.sessions += sessions;
              current.users += users;
              current.pageviews += pageviews;
              current.engagementRate += engagementRate;
            } else if (dateRange === 'date_range_1') {
              previous.sessions += sessions;
              previous.users += users;
              previous.pageviews += pageviews;
              previous.engagementRate += engagementRate;
            }
          });

          const currentDays = data.rows.filter((r) => r.dimensionValues[1].value === 'date_range_0').length;
          const previousDays = data.rows.filter((r) => r.dimensionValues[1].value === 'date_range_1').length;
          if (currentDays > 0) current.engagementRate /= currentDays;
          if (previousDays > 0) previous.engagementRate /= previousDays;
        }

        return {
          id: prop.id,
          name: prop.property,
          account: prop.account,
          current,
          previous,
          change: {
            sessions: calculateChange(current.sessions, previous.sessions),
            users: calculateChange(current.users, previous.users),
            pageviews: calculateChange(current.pageviews, previous.pageviews)
          }
        };
      } catch (error) {
        console.error(`Error fetching ${prop.property}:`, error.message);
        return {
          id: prop.id,
          name: prop.property,
          account: prop.account,
          current: { sessions: 0, users: 0, pageviews: 0, engagementRate: 0 },
          previous: { sessions: 0, users: 0, pageviews: 0, engagementRate: 0 },
          change: { sessions: 0, users: 0, pageviews: 0 },
          error: error.message
        };
      }
    })
  );

  const totals = {
    current: properties.reduce(
      (acc, prop) => ({
        sessions: acc.sessions + prop.current.sessions,
        users: acc.users + prop.current.users,
        pageviews: acc.pageviews + prop.current.pageviews
      }),
      { sessions: 0, users: 0, pageviews: 0 }
    ),
    previous: properties.reduce(
      (acc, prop) => ({
        sessions: acc.sessions + prop.previous.sessions,
        users: acc.users + prop.previous.users,
        pageviews: acc.pageviews + prop.previous.pageviews
      }),
      { sessions: 0, users: 0, pageviews: 0 }
    )
  };

  totals.change = {
    sessions: calculateChange(totals.current.sessions, totals.previous.sessions),
    users: calculateChange(totals.current.users, totals.previous.users),
    pageviews: calculateChange(totals.current.pageviews, totals.previous.pageviews)
  };

  return {
    period,
    totals,
    properties,
    count: properties.length
  };
}

// GET /api/portfolio/overview
router.get('/overview', async (req, res) => {
  try {
    const period = req.query.period || '7daysAgo';
    const cacheKey = `overview_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const result = await getPortfolioOverview(period);

    cache.set(cacheKey, result, 30 * 60 * 1000);

    res.json(result);
  } catch (error) {
    console.error('Error in /overview:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/portfolio/insights
router.get('/insights', async (req, res) => {
  try {
    const period = req.query.period || '7daysAgo';
    const cacheKey = `insights_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const overview = await getPortfolioOverview(period);

    const anomalies = [];
    overview.properties.forEach((prop) => {
      const detected = detectAnomalies(prop);
      if (detected.length > 0) {
        anomalies.push({ property: prop.name, anomalies: detected });
      }
    });

    const patterns = recognizePatterns(overview.properties);
    const recommendations = generateRecommendations(overview.properties, anomalies, patterns);

    const result = {
      period,
      summary: {
        totalAnomalies: anomalies.length,
        patternsDetected: patterns.length,
        recommendationsCount: recommendations.length
      },
      anomalies,
      patterns,
      recommendations,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 30 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in /insights:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/portfolio/trends
router.get('/trends', async (req, res) => {
  try {
    const period = req.query.period || '7daysAgo';
    const cacheKey = `trends_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const totalsByDate = {};

    await Promise.all(
      GA4_PROPERTIES.list.map(async (prop) => {
        try {
          const report = await ga4Client.runReport(prop.id, {
            dateRanges: [{ startDate: period, endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [
              { name: 'sessions' },
              { name: 'totalUsers' },
              { name: 'screenPageViews' }
            ]
          });

          report.rows?.forEach((row) => {
            const date = row.dimensionValues?.[0]?.value;
            if (!date) return;

            if (!totalsByDate[date]) {
              totalsByDate[date] = { sessions: 0, users: 0, pageviews: 0 };
            }

            totalsByDate[date].sessions += parseInt(row.metricValues?.[0]?.value || 0, 10);
            totalsByDate[date].users += parseInt(row.metricValues?.[1]?.value || 0, 10);
            totalsByDate[date].pageviews += parseInt(row.metricValues?.[2]?.value || 0, 10);
          });
        } catch (error) {
          console.error(`Error fetching trends for ${prop.property}:`, error.message);
        }
      })
    );

    const dates = Object.keys(totalsByDate).sort();
    const trends = dates.map((date) => ({
      date,
      ...totalsByDate[date]
    }));

    const result = {
      period,
      trends,
      totals: trends.reduce(
        (acc, entry) => ({
          sessions: acc.sessions + entry.sessions,
          users: acc.users + entry.users,
          pageviews: acc.pageviews + entry.pageviews
        }),
        { sessions: 0, users: 0, pageviews: 0 }
      )
    };

    cache.set(cacheKey, result, 30 * 60 * 1000);

    res.json(result);
  } catch (error) {
    console.error('Error in /trends:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/portfolio/properties
router.get('/properties', async (req, res) => {
  try {
    res.json({
      properties: GA4_PROPERTIES.list,
      count: GA4_PROPERTIES.properties
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
