#!/usr/bin/env node
/**
 * Sync All Data Sources
 * Pulls fresh data from all available APIs and regenerates projections
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FRONTEND_DATA_DIR = path.join(__dirname, '..', '..', 'frontend', 'public', 'data');

// Load environment variables
require('dotenv').config({ path: path.join(process.env.HOME, '.clawdbot', '.env') });

const GETLATE_API_KEY = process.env.GETLATE_API_KEY;

// Helper to make HTTPS requests (more reliable than fetch in some Node environments)
function httpsGet(url, headers) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: headers
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Results tracking
const syncResults = {
  startTime: new Date().toISOString(),
  sources: {},
  errors: [],
  summary: ''
};

/**
 * Fetch social data from GetLate API
 */
async function syncSocialData() {
  console.log('📱 Syncing social data from GetLate...');
  
  if (!GETLATE_API_KEY) {
    syncResults.sources.social = { status: 'skipped', reason: 'No API key' };
    return null;
  }

  try {
    const data = await httpsGet('https://getlate.dev/api/v1/accounts/follower-stats', {
      'Authorization': `Bearer ${GETLATE_API_KEY}`,
      'Content-Type': 'application/json'
    });
    
    // Transform to our format - GetLate returns { accounts: [...], stats: {...} }
    const rawAccounts = data.accounts || [];
    
    // Group by display name to combine platforms
    const accountMap = {};
    rawAccounts.forEach(acc => {
      const name = acc.displayName || acc.username;
      if (!accountMap[name]) {
        accountMap[name] = {
          name,
          totalFollowers: 0,
          totalGrowth: 0,
          platforms: {}
        };
      }
      accountMap[name].totalFollowers += acc.currentFollowers || 0;
      accountMap[name].totalGrowth += acc.growth || 0;
      accountMap[name].platforms[acc.platform] = {
        followers: acc.currentFollowers || 0,
        growth: acc.growth || 0,
        growthPercent: acc.growthPercentage || 0,
        username: acc.username,
        lastUpdated: acc.lastUpdated
      };
    });
    
    const accounts = Object.values(accountMap);

    const socialData = {
      lastUpdated: new Date().toISOString(),
      dataStatus: 'live',
      source: 'getlate',
      accounts
    };

    // Save to backend data
    fs.writeFileSync(
      path.join(DATA_DIR, 'social.json'),
      JSON.stringify(socialData, null, 2)
    );

    syncResults.sources.social = { 
      status: 'success', 
      accounts: accounts.length,
      totalFollowers: accounts.reduce((sum, a) => sum + a.totalFollowers, 0)
    };

    console.log(`   ✅ Synced ${accounts.length} social accounts`);
    return socialData;
  } catch (error) {
    console.error(`   ❌ Social sync failed: ${error.message}`);
    syncResults.sources.social = { status: 'error', error: error.message };
    syncResults.errors.push(`Social: ${error.message}`);
    return null;
  }
}

/**
 * Regenerate revenue projections from Mediavine data
 */
async function regenerateProjections() {
  console.log('📈 Regenerating revenue projections...');

  try {
    const importsDir = path.join(DATA_DIR, 'mediavine-imports');
    
    if (!fs.existsSync(importsDir)) {
      syncResults.sources.projections = { status: 'skipped', reason: 'No import directory' };
      return null;
    }

    const csvFiles = fs.readdirSync(importsDir).filter(f => f.endsWith('.csv'));
    
    if (csvFiles.length === 0) {
      syncResults.sources.projections = { status: 'skipped', reason: 'No CSV files' };
      return null;
    }

    // Process each CSV and build projections
    const sites = {};
    const alerts = [];

    for (const csvFile of csvFiles) {
      const siteId = csvFile.replace('.csv', '');
      const siteName = siteId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const csvPath = path.join(importsDir, csvFile);
      const csvContent = fs.readFileSync(csvPath, 'utf-8');
      
      // Parse CSV
      const lines = csvContent.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((h, i) => {
          row[h] = values[i]?.trim();
        });
        return row;
      }).filter(row => row.date);

      if (data.length < 7) continue;

      // Calculate metrics
      const last7 = data.slice(-7);
      const prev7 = data.slice(-14, -7);
      const last30 = data.slice(-30);

      const avg7Revenue = last7.reduce((sum, d) => sum + parseFloat(d.revenue || d.earnings || 0), 0) / 7;
      const avg30Revenue = last30.reduce((sum, d) => sum + parseFloat(d.revenue || d.earnings || 0), 0) / Math.min(last30.length, 30);
      const prevAvg7Revenue = prev7.length >= 7 ? prev7.reduce((sum, d) => sum + parseFloat(d.revenue || d.earnings || 0), 0) / 7 : avg7Revenue;

      // Trends
      const revenueTrend = avg7Revenue > prevAvg7Revenue * 1.05 ? 'up' : avg7Revenue < prevAvg7Revenue * 0.95 ? 'down' : 'flat';
      const changePercent = prevAvg7Revenue > 0 ? ((avg7Revenue - prevAvg7Revenue) / prevAvg7Revenue * 100) : 0;

      // Day-of-week averages for projections
      const dayAverages = {};
      last30.forEach(d => {
        const dow = new Date(d.date).getDay();
        if (!dayAverages[dow]) dayAverages[dow] = [];
        dayAverages[dow].push(parseFloat(d.revenue || d.earnings || 0));
      });

      // Project next 7 days
      const projections = [];
      const today = new Date();
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dow = date.getDay();
        const dayAvg = dayAverages[dow]?.length > 0 
          ? dayAverages[dow].reduce((a, b) => a + b, 0) / dayAverages[dow].length 
          : avg7Revenue;
        
        projections.push({
          date: date.toISOString().split('T')[0],
          day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dow],
          projected_revenue: Math.round(dayAvg * 100) / 100,
          confidence: last30.length >= 21 ? 'medium' : 'low'
        });
      }

      const projected7Total = projections.reduce((sum, p) => sum + p.projected_revenue, 0);
      const projected30Total = avg7Revenue * 30;

      sites[siteId] = {
        site_id: siteId,
        site_name: siteName,
        latest_date: data[data.length - 1]?.date,
        total_days_of_data: data.length,
        averages: {
          '7_day_revenue': Math.round(avg7Revenue * 100) / 100,
          '30_day_revenue': Math.round(avg30Revenue * 100) / 100
        },
        trends: {
          revenue: revenueTrend
        },
        projections: {
          next_7_days: projections,
          projected_7_day_total: Math.round(projected7Total * 100) / 100,
          projected_30_day_total: Math.round(projected30Total * 100) / 100
        }
      };

      // Generate alerts
      if (changePercent < -20) {
        alerts.push({
          type: 'revenue_drop',
          severity: 'critical',
          site_id: siteId,
          site_name: siteName,
          message: `${siteName}: Revenue CRITICAL - down ${Math.abs(changePercent).toFixed(1)}% vs previous week`,
          change_pct: Math.round(changePercent * 10) / 10,
          detected_at: new Date().toISOString()
        });
      } else if (changePercent < -10) {
        alerts.push({
          type: 'revenue_drop',
          severity: 'warning',
          site_id: siteId,
          site_name: siteName,
          message: `${siteName}: Revenue WARNING - down ${Math.abs(changePercent).toFixed(1)}% vs previous week`,
          change_pct: Math.round(changePercent * 10) / 10,
          detected_at: new Date().toISOString()
        });
      }
    }

    // Calculate totals
    const totals = {
      projected_7_day: Object.values(sites).reduce((sum, s) => sum + (s.projections?.projected_7_day_total || 0), 0),
      projected_30_day: Object.values(sites).reduce((sum, s) => sum + (s.projections?.projected_30_day_total || 0), 0)
    };

    // Save projections
    const projectionsData = {
      generated_at: new Date().toISOString(),
      sites,
      totals
    };

    const alertsData = {
      checked_at: new Date().toISOString(),
      total_alerts: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
      alerts
    };

    // Save to frontend public folder
    fs.mkdirSync(FRONTEND_DATA_DIR, { recursive: true });
    fs.writeFileSync(path.join(FRONTEND_DATA_DIR, 'projections.json'), JSON.stringify(projectionsData, null, 2));
    fs.writeFileSync(path.join(FRONTEND_DATA_DIR, 'alerts.json'), JSON.stringify(alertsData, null, 2));

    // Also save to backend
    fs.writeFileSync(path.join(DATA_DIR, 'alerts.json'), JSON.stringify(alertsData, null, 2));

    syncResults.sources.projections = {
      status: 'success',
      sites: Object.keys(sites).length,
      projected_7_day: totals.projected_7_day,
      projected_30_day: totals.projected_30_day,
      alerts: alerts.length
    };

    console.log(`   ✅ Generated projections for ${Object.keys(sites).length} sites`);
    console.log(`   📊 7-day projection: $${totals.projected_7_day.toFixed(2)}`);
    console.log(`   📊 30-day projection: $${totals.projected_30_day.toFixed(2)}`);

    return { projections: projectionsData, alerts: alertsData };
  } catch (error) {
    console.error(`   ❌ Projection generation failed: ${error.message}`);
    syncResults.sources.projections = { status: 'error', error: error.message };
    syncResults.errors.push(`Projections: ${error.message}`);
    return null;
  }
}

/**
 * Generate summary for email
 */
function generateSummary() {
  const parts = [];
  
  parts.push(`📊 Data Sync Summary - ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}\n`);

  if (syncResults.sources.social?.status === 'success') {
    parts.push(`📱 Social: ${syncResults.sources.social.accounts} accounts, ${syncResults.sources.social.totalFollowers.toLocaleString()} total followers`);
  }

  if (syncResults.sources.projections?.status === 'success') {
    const p = syncResults.sources.projections;
    parts.push(`💰 Projections: ${p.sites} sites`);
    parts.push(`   • Next 7 days: $${p.projected_7_day.toFixed(2)}`);
    parts.push(`   • Next 30 days: $${p.projected_30_day.toFixed(2)}`);
    if (p.alerts > 0) {
      parts.push(`   ⚠️ ${p.alerts} alert(s) detected`);
    }
  }

  if (syncResults.errors.length > 0) {
    parts.push(`\n❌ Errors: ${syncResults.errors.join(', ')}`);
  }

  syncResults.summary = parts.join('\n');
  return syncResults.summary;
}

/**
 * Main sync function
 */
async function syncAll() {
  console.log('🔄 Starting full data sync...\n');

  await syncSocialData();
  await regenerateProjections();
  
  syncResults.endTime = new Date().toISOString();
  generateSummary();

  console.log('\n' + '='.repeat(50));
  console.log(syncResults.summary);
  console.log('='.repeat(50));

  // Save sync results
  fs.writeFileSync(
    path.join(DATA_DIR, 'last-sync.json'),
    JSON.stringify(syncResults, null, 2)
  );

  return syncResults;
}

// Run if called directly
if (require.main === module) {
  syncAll().then(() => {
    console.log('\n✅ Sync complete!');
    process.exit(0);
  }).catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
}

module.exports = { syncAll, syncResults };
