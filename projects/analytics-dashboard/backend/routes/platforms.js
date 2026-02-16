const express = require('express');
const router = express.Router();
const cache = require('../cache');
const getLateClient = require('../clients/getlate');

// GET /api/platforms - List all platforms with account counts
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'platforms_list';

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Fetch follower stats to get all accounts
    const followerStats = await getLateClient.getFollowerStats();
    const accounts = followerStats.accounts || [];

    // Group by platform
    const platformStats = {};
    accounts.forEach(account => {
      const platform = account.platform || 'unknown';
      if (!platformStats[platform]) {
        platformStats[platform] = {
          platform,
          accountCount: 0,
          totalFollowers: 0,
          accounts: []
        };
      }
      platformStats[platform].accountCount++;
      platformStats[platform].totalFollowers += account.followers || 0;
      platformStats[platform].accounts.push({
        id: account.id,
        name: account.name,
        username: account.username,
        followers: account.followers || 0
      });
    });

    const platforms = Object.values(platformStats).sort((a, b) => 
      b.accountCount - a.accountCount
    );

    const result = {
      platforms,
      totalAccounts: accounts.length,
      platformCount: platforms.length,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 60 * 60 * 1000); // Cache for 1 hour
    res.json(result);
  } catch (error) {
    console.error('Error in GET /platforms:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/platforms/:platform - Get all accounts for a specific platform
router.get('/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const period = parseInt(req.query.period) || 30;
    const cacheKey = `platform_${platform}_${period}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ ...cached, fromCache: true });
    }

    // Calculate date range
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - period);
    const toDate = new Date();

    // Fetch follower stats
    const followerStats = await getLateClient.getFollowerStats();
    const platformAccounts = (followerStats.accounts || []).filter(
      acc => acc.platform === platform
    );

    if (platformAccounts.length === 0) {
      return res.status(404).json({ error: `No accounts found for platform: ${platform}` });
    }

    // Fetch analytics for this platform
    let analyticsData = [];
    try {
      const analytics = await getLateClient.getAnalytics(
        fromDate.toISOString().split('T')[0],
        toDate.toISOString().split('T')[0],
        500
      );
      analyticsData = (analytics.posts || []).filter(post => post.platform === platform);
    } catch (error) {
      console.log('Could not fetch analytics:', error.message);
    }

    // Aggregate metrics per account
    const accountMetrics = platformAccounts.map(account => {
      const accountPosts = analyticsData.filter(post => 
        post.accountId === account.id || post.accountName === account.name
      );

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

      return {
        id: account.id,
        name: account.name,
        username: account.username,
        followers: account.followers || 0,
        metrics
      };
    });

    // Sort by impressions
    accountMetrics.sort((a, b) => b.metrics.impressions - a.metrics.impressions);

    // Calculate platform totals
    const totals = accountMetrics.reduce((acc, account) => ({
      accounts: acc.accounts + 1,
      followers: acc.followers + account.followers,
      posts: acc.posts + account.metrics.posts,
      impressions: acc.impressions + account.metrics.impressions,
      clicks: acc.clicks + account.metrics.clicks,
      engagement: acc.engagement + account.metrics.engagement
    }), {
      accounts: 0,
      followers: 0,
      posts: 0,
      impressions: 0,
      clicks: 0,
      engagement: 0
    });

    const result = {
      platform,
      period: `${period} days`,
      totals,
      accounts: accountMetrics,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, result, 15 * 60 * 1000);
    res.json(result);
  } catch (error) {
    console.error(`Error in GET /platforms/${req.params.platform}:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
