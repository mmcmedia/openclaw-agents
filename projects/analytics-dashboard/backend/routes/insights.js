const express = require('express');
const router = express.Router();
const axios = require('axios');
const insightsEngine = require('../services/insights-engine');

/**
 * GET /api/insights
 * Get AI-generated insights for the entire portfolio
 */
router.get('/', async (req, res) => {
  try {
    const period = req.query.period || '7daysAgo';
    
    // Get portfolio data from our own API
    const portfolioResponse = await axios.get(`http://localhost:3002/api/portfolio/overview?period=${period}`);
    const portfolioData = portfolioResponse.data;
    
    // Generate insights
    const insights = insightsEngine.analyzePortfolio(portfolioData);
    
    // Get summary
    const summary = insightsEngine.getSummary(insights);
    
    res.json({
      success: true,
      period,
      summary,
      insights
    });
  } catch (error) {
    console.error('Error generating insights:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/insights/site/:propertyId
 * Get insights for a specific site
 * TODO: Implement when site-level data is available
 */
router.get('/site/:propertyId', async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Site-specific insights coming soon'
  });
});

/**
 * GET /api/insights/alerts
 * Get only critical alerts that need immediate attention
 */
router.get('/alerts', async (req, res) => {
  try {
    const period = req.query.period || '7daysAgo';
    
    const portfolioResponse = await axios.get(`http://localhost:3002/api/portfolio/overview?period=${period}`);
    const portfolioData = portfolioResponse.data;
    const insights = insightsEngine.analyzePortfolio(portfolioData);
    
    // Filter for critical/warning severity
    const alerts = insights.filter(i => 
      i.severity === 'critical' || i.severity === 'warning'
    );
    
    res.json({
      success: true,
      alerts,
      count: alerts.length
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/insights/recommendations
 * Get actionable recommendations
 */
router.get('/recommendations', async (req, res) => {
  try {
    const period = req.query.period || '7daysAgo';
    
    const portfolioResponse = await axios.get(`http://localhost:3002/api/portfolio/overview?period=${period}`);
    const portfolioData = portfolioResponse.data;
    const insights = insightsEngine.analyzePortfolio(portfolioData);
    
    const recommendations = insights.filter(i => i.type === 'recommendation');
    
    res.json({
      success: true,
      recommendations,
      count: recommendations.length
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
