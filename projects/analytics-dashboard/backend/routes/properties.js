const express = require('express');
const router = express.Router();
const ga4Client = require('../clients/ga4');
const cache = require('../cache');

// GET /api/properties/:id/metrics
router.get('/:id/metrics', async (req, res) => {
  try {
    const { id } = req.params;
    const period = req.query.period || '7daysAgo';
    
    const data = await ga4Client.getMetrics(id, period, 'today');
    
    res.json({ propertyId: id, period, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/properties/:id/sources
router.get('/:id/sources', async (req, res) => {
  try {
    const { id } = req.params;
    const period = req.query.period || '7daysAgo';
    
    const data = await ga4Client.getTrafficSources(id, period, 'today');
    
    res.json({ propertyId: id, period, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/properties/:id/detail
router.get('/:id/detail', async (req, res) => {
  try {
    const { id } = req.params;
    const period = req.query.period || '30daysAgo';
    const cacheKey = `property_${id}_detail_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    const [metrics, sources, topPages] = await Promise.all([
      ga4Client.getMetrics(id, period, 'today'),
      ga4Client.getTrafficSources(id, period, 'today'),
      ga4Client.getTopPages(id, period, 'today')
    ]);

    const result = {
      propertyId: id,
      period,
      metrics,
      sources,
      topPages: topPages || null,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 30 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error('Error in /properties/:id/detail:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
