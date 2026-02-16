const express = require('express');
const router = express.Router();
const cache = require('../cache');
const ga4Client = require('../clients/ga4');
const fs = require('fs');
const path = require('path');

// Load GA4 properties list
const propertiesPath = path.join(__dirname, '../../GA4-PROPERTIES.json');
const GA4_PROPERTIES = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));

// GET /api/traffic/sources - Aggregate traffic sources across all properties
router.get('/sources', async (req, res) => {
  try {
    const period = req.query.period || '7daysAgo';
    const cacheKey = `traffic_sources_${period}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Fetch traffic sources for all properties
    const allSources = await Promise.all(
      GA4_PROPERTIES.list.map(async (prop) => {
        try {
          const data = await ga4Client.getTrafficSources(prop.id, period, 'today');
          return {
            propertyId: prop.id,
            propertyName: prop.property,
            sources: data.rows || []
          };
        } catch (error) {
          console.error(`Error fetching sources for ${prop.property}:`, error.message);
          return { propertyId: prop.id, propertyName: prop.property, sources: [] };
        }
      })
    );

    // Aggregate sources across all properties
    const aggregated = {};
    
    allSources.forEach(propData => {
      propData.sources.forEach(row => {
        const source = row.dimensionValues[0].value;
        const medium = row.dimensionValues[1].value;
        const sessions = parseInt(row.metricValues[0].value || 0);
        const users = parseInt(row.metricValues[1].value || 0);
        
        // Create a unified key
        const key = `${source} / ${medium}`;
        
        if (!aggregated[key]) {
          aggregated[key] = {
            source,
            medium,
            sessions: 0,
            users: 0,
            properties: []
          };
        }
        
        aggregated[key].sessions += sessions;
        aggregated[key].users += users;
        aggregated[key].properties.push({
          id: propData.propertyId,
          name: propData.propertyName,
          sessions,
          users
        });
      });
    });

    // Convert to array and sort by sessions
    const sources = Object.values(aggregated)
      .sort((a, b) => b.sessions - a.sessions);

    // Categorize sources
    const categorized = categorizeSources(sources);

    const result = {
      period,
      sources,
      categorized,
      totalSessions: sources.reduce((sum, s) => sum + s.sessions, 0),
      totalUsers: sources.reduce((sum, s) => sum + s.users, 0)
    };

    cache.set(cacheKey, result, 30 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in /traffic/sources:', error);
    res.status(500).json({ error: error.message });
  }
});

function categorizeSources(sources) {
  const categories = {
    pinterest: { name: 'Pinterest', sessions: 0, users: 0, color: '#E60023' },
    organic: { name: 'Organic Search', sessions: 0, users: 0, color: '#10B981' },
    direct: { name: 'Direct', sessions: 0, users: 0, color: '#6366F1' },
    social: { name: 'Social (Other)', sessions: 0, users: 0, color: '#8B5CF6' },
    referral: { name: 'Referral', sessions: 0, users: 0, color: '#F59E0B' },
    email: { name: 'Email', sessions: 0, users: 0, color: '#EC4899' },
    paid: { name: 'Paid', sessions: 0, users: 0, color: '#EF4444' },
    other: { name: 'Other', sessions: 0, users: 0, color: '#6B7280' }
  };

  sources.forEach(source => {
    const src = source.source.toLowerCase();
    const med = source.medium.toLowerCase();
    
    if (src.includes('pinterest') || med.includes('pinterest')) {
      categories.pinterest.sessions += source.sessions;
      categories.pinterest.users += source.users;
    } else if (med === 'organic') {
      categories.organic.sessions += source.sessions;
      categories.organic.users += source.users;
    } else if (src === '(direct)' || med === '(none)') {
      categories.direct.sessions += source.sessions;
      categories.direct.users += source.users;
    } else if (med === 'social' || ['facebook', 'instagram', 'twitter', 'tiktok'].some(s => src.includes(s))) {
      categories.social.sessions += source.sessions;
      categories.social.users += source.users;
    } else if (med === 'referral') {
      categories.referral.sessions += source.sessions;
      categories.referral.users += source.users;
    } else if (med === 'email') {
      categories.email.sessions += source.sessions;
      categories.email.users += source.users;
    } else if (med.includes('cpc') || med.includes('paid') || med.includes('ppc')) {
      categories.paid.sessions += source.sessions;
      categories.paid.users += source.users;
    } else {
      categories.other.sessions += source.sessions;
      categories.other.users += source.users;
    }
  });

  // Convert to array and filter out zero values
  return Object.values(categories)
    .filter(cat => cat.sessions > 0)
    .sort((a, b) => b.sessions - a.sessions);
}

module.exports = router;
