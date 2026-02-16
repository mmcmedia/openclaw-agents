const express = require('express');
const router = express.Router();
const cache = require('../cache');
const getLateClient = require('../clients/getlate');

// GET /api/accounts/:accountId - Drill-down for specific account
router.get('/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const period = parseInt(req.query.period) || 30;
    const cacheKey = `account_${accountId}_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Calculate date range
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - period);
    const toDate = new Date();

    // Fetch follower stats to get account info
    const followerStats = await getLateClient.getFollowerStats();
    const account = (followerStats.accounts || []).find(acc => acc.id === accountId);

    if (!account) {
      return res.status(404).json({ error: `Account not found: ${accountId}` });
    }

    // Fetch analytics for this account
    const analytics = await getLateClient.getAnalytics(
      fromDate.toISOString().split('T')[0],
      toDate.toISOString().split('T')[0],
      500
    );

    const accountPosts = (analytics.posts || []).filter(post => 
      post.accountId === accountId || post.accountName === account.name
    );

    // Sort posts by performance
    accountPosts.sort((a, b) => (b.impressions || 0) - (a.impressions || 0));

    // Calculate metrics
    const metrics = {
      posts: accountPosts.length,
      impressions: 0,
      clicks: 0,
      saves: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      engagement: 0
    };

    accountPosts.forEach(post => {
      metrics.impressions += post.impressions || 0;
      metrics.clicks += post.clicks || 0;
      metrics.saves += post.saves || 0;
      metrics.likes += post.likes || 0;
      metrics.comments += post.comments || 0;
      metrics.shares += post.shares || 0;
    });

    metrics.engagement = metrics.likes + metrics.comments + metrics.shares;
    metrics.engagementRate = metrics.impressions > 0 
      ? ((metrics.engagement / metrics.impressions) * 100).toFixed(2)
      : 0;
    metrics.clickRate = metrics.impressions > 0
      ? ((metrics.clicks / metrics.impressions) * 100).toFixed(2)
      : 0;
    metrics.saveRate = metrics.impressions > 0
      ? ((metrics.saves / metrics.impressions) * 100).toFixed(2)
      : 0;

    // Get top posts (top 10)
    const topPosts = accountPosts.slice(0, 10).map(post => ({
      id: post.id,
      text: post.text || post.caption || '',
      publishedAt: post.publishedAt,
      impressions: post.impressions || 0,
      clicks: post.clicks || 0,
      saves: post.saves || 0,
      likes: post.likes || 0,
      comments: post.comments || 0,
      shares: post.shares || 0,
      engagement: (post.likes || 0) + (post.comments || 0) + (post.shares || 0),
      url: post.url
    }));

    // Daily trend data
    const dailyMetrics = {};
    accountPosts.forEach(post => {
      const date = post.publishedAt ? post.publishedAt.split('T')[0] : 'unknown';
      if (!dailyMetrics[date]) {
        dailyMetrics[date] = {
          date,
          posts: 0,
          impressions: 0,
          clicks: 0,
          engagement: 0
        };
      }
      dailyMetrics[date].posts++;
      dailyMetrics[date].impressions += post.impressions || 0;
      dailyMetrics[date].clicks += post.clicks || 0;
      dailyMetrics[date].engagement += (post.likes || 0) + (post.comments || 0);
    });

    const trends = Object.values(dailyMetrics).sort((a, b) => 
      a.date.localeCompare(b.date)
    );

    // Get follower growth if available
    let followerGrowth = [];
    try {
      const followerHistory = await getLateClient.getFollowerStats();
      // This would need enhancement to get historical data
      followerGrowth = followerHistory.history || [];
    } catch (error) {
      console.log('Could not fetch follower growth:', error.message);
    }

    const result = {
      account: {
        id: account.id,
        name: account.name,
        username: account.username,
        platform: account.platform,
        followers: account.followers || 0
      },
      period: `${period} days`,
      metrics,
      topPosts,
      trends,
      followerGrowth,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 15 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error(`Error in GET /accounts/${req.params.accountId}:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
