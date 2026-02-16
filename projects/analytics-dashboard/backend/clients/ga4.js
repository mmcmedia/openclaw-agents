const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

class GA4Client {
  constructor() {
    this.analyticsData = null;
    this.auth = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Load OAuth credentials and tokens
      const credPath = path.join(process.env.HOME, '.clawdbot', 'credentials', 'ga4-oauth.json');
      const tokenPath = path.join(process.env.HOME, '.clawdbot', 'credentials', 'ga4-tokens.json');
      
      const credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      const tokens = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));

      // Create OAuth2 client
      const { client_id, client_secret, redirect_uris } = credentials.installed;
      this.auth = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
      this.auth.setCredentials(tokens);

      // Initialize Analytics Data API
      this.analyticsData = google.analyticsdata({ version: 'v1beta', auth: this.auth });
      
      this.initialized = true;
      console.log('✅ GA4 Client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize GA4 client:', error.message);
      throw error;
    }
  }

  async runReport(propertyId, config) {
    await this.initialize();

    try {
      const response = await this.analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: config
      });

      return response.data;
    } catch (error) {
      console.error(`Error fetching data for property ${propertyId}:`, error.message);
      throw error;
    }
  }

  async getMetrics(propertyId, startDate = '7daysAgo', endDate = 'today') {
    const config = {
      dateRanges: [
        { startDate, endDate },
        { 
          startDate: this.getPreviousPeriod(startDate), 
          endDate: this.getPreviousPeriod(endDate) 
        }
      ],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'engagedSessions' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    };

    return await this.runReport(propertyId, config);
  }

  async getTrafficSources(propertyId, startDate = '7daysAgo', endDate = 'today') {
    const config = {
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'sessionSource' },
        { name: 'sessionMedium' }
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 20
    };

    return await this.runReport(propertyId, config);
  }

  async getTopPages(propertyId, startDate = '7daysAgo', endDate = 'today') {
    const config = {
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'pageTitle' },
        { name: 'pagePath' }
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' }
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10
    };

    return await this.runReport(propertyId, config);
  }

  getPreviousPeriod(dateString) {
    if (dateString === 'today') return '8daysAgo';
    if (dateString === 'yesterday') return '9daysAgo';
    if (dateString.endsWith('daysAgo')) {
      const days = parseInt(dateString);
      return `${days * 2}daysAgo`;
    }
    
    // For specific dates, calculate manually
    const date = new Date(dateString);
    const diffDays = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
    return `${diffDays * 2}daysAgo`;
  }
}

module.exports = new GA4Client();
