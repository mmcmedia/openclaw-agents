const axios = require('axios');

class GetLateClient {
  constructor() {
    this.baseURL = 'https://getlate.dev/api';
    this.apiKey = process.env.GETLATE_API_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  GETLATE_API_KEY not found in environment');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getAnalytics(fromDate, toDate, limit = 50, platform = 'all') {
    try {
      const response = await this.client.get('/v1/analytics', {
        params: { fromDate, toDate, limit, platform }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching getlate analytics:', error.message);
      throw error;
    }
  }

  async getFollowerStats() {
    try {
      const response = await this.client.get('/v1/accounts/follower-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching follower stats:', error.message);
      throw error;
    }
  }

  async getYouTubeDailyViews(fromDate, toDate) {
    try {
      const response = await this.client.get('/v1/analytics/youtube/daily-views', {
        params: { fromDate, toDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching YouTube daily views:', error.message);
      throw error;
    }
  }

  formatDate(daysAgo = 0) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }
}

module.exports = new GetLateClient();
