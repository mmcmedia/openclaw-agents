const express = require('express');
const router = express.Router();
const getLateClient = require('../clients/getlate');

// GET /api/social/overview
router.get('/overview', async (req, res) => {
  try {
    const daysAgo = parseInt(req.query.days) || 7;
    const fromDate = getLateClient.formatDate(daysAgo);
    const toDate = getLateClient.formatDate(0);
    
    const analytics = await getLateClient.getAnalytics(fromDate, toDate, 100);
    
    res.json({ fromDate, toDate, data: analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/followers
router.get('/followers', async (req, res) => {
  try {
    const stats = await getLateClient.getFollowerStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/pinterest/summary - Aggregate all Pinterest accounts
router.get('/pinterest/summary', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const fromDate = getLateClient.formatDate(days);
    const toDate = getLateClient.formatDate(0);
    
    // Fetch ALL Pinterest posts (not just 5)
    const allPosts = await getLateClient.getAnalytics(fromDate, toDate, 5000, 'pinterest');
    
    // Group by account
    const accountStats = {};
    const accounts = allPosts.accounts || [];
    
    // Initialize accounts
    accounts.forEach(account => {
      accountStats[account.username] = {
        id: account._id,
        username: account.username,
        displayName: account.displayName,
        platform: 'pinterest',
        posts: 0,
        impressions: 0,
        clicks: 0,
        saves: 0,
        engagementRate: 0
      };
    });
    
    // Aggregate post metrics
    if (allPosts.posts) {
      allPosts.posts.forEach(post => {
        const accountUsername = accounts.find(a => a._id === post.accountId)?.username;
        if (accountUsername && accountStats[accountUsername]) {
          accountStats[accountUsername].posts++;
          accountStats[accountUsername].impressions += (post.analytics?.impressions || 0);
          accountStats[accountUsername].clicks += (post.analytics?.clicks || 0);
          accountStats[accountUsername].saves += (post.analytics?.saves || 0);
        }
      });
    }
    
    // Calculate engagement rates
    Object.values(accountStats).forEach(account => {
      if (account.impressions > 0) {
        account.engagementRate = ((account.clicks + account.saves) / account.impressions * 100).toFixed(2);
      }
    });
    
    // Sort by total engagement
    const sortedAccounts = Object.values(accountStats).sort((a, b) => 
      (b.clicks + b.saves) - (a.clicks + a.saves)
    );
    
    // Calculate totals
    const totals = sortedAccounts.reduce((acc, account) => ({
      posts: acc.posts + account.posts,
      impressions: acc.impressions + account.impressions,
      clicks: acc.clicks + account.clicks,
      saves: acc.saves + account.saves
    }), { posts: 0, impressions: 0, clicks: 0, saves: 0 });
    
    res.json({
      dateRange: { from: fromDate, to: toDate },
      totals,
      accounts: sortedAccounts
    });
  } catch (error) {
    console.error('Pinterest summary error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/social/platform/:platform - Generic platform aggregation
router.get('/platform/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const days = parseInt(req.query.days) || 30;
    const fromDate = getLateClient.formatDate(days);
    const toDate = getLateClient.formatDate(0);
    
    const allPosts = await getLateClient.getAnalytics(fromDate, toDate, 5000, platform);
    
    // Aggregate metrics
    const totals = {
      posts: allPosts.posts?.length || 0,
      impressions: 0,
      reach: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      clicks: 0,
      saves: 0,
      views: 0
    };
    
    if (allPosts.posts) {
      allPosts.posts.forEach(post => {
        const analytics = post.analytics || {};
        totals.impressions += (analytics.impressions || 0);
        totals.reach += (analytics.reach || 0);
        totals.likes += (analytics.likes || 0);
        totals.comments += (analytics.comments || 0);
        totals.shares += (analytics.shares || 0);
        totals.clicks += (analytics.clicks || 0);
        totals.saves += (analytics.saves || 0);
        totals.views += (analytics.views || 0);
      });
    }
    
    // Calculate engagement rate
    totals.engagementRate = totals.impressions > 0 
      ? ((totals.likes + totals.comments + totals.shares + totals.clicks + totals.saves) / totals.impressions * 100).toFixed(2)
      : 0;
    
    res.json({
      platform,
      dateRange: { from: fromDate, to: toDate },
      totals,
      accounts: allPosts.accounts || []
    });
  } catch (error) {
    console.error(`${req.params.platform} summary error:`, error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
