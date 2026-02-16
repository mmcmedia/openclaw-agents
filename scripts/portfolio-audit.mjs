import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const credDir = join(homedir(), '.clawdbot', 'credentials');
const oauth = JSON.parse(readFileSync(join(credDir, 'ga4-oauth.json'), 'utf-8'));
const tokens = JSON.parse(readFileSync(join(credDir, 'ga4-tokens.json'), 'utf-8'));

const installed = oauth.installed || oauth.web || oauth;
const auth = new google.auth.OAuth2(installed.client_id, installed.client_secret, 'http://localhost');
auth.setCredentials({ access_token: tokens.access_token, refresh_token: tokens.refresh_token, expiry_date: tokens.expiry_date });

// Refresh token
const { credentials } = await auth.refreshAccessToken();
auth.setCredentials(credentials);

const client = new BetaAnalyticsDataClient({ authClient: auth });

const SITES = [
  { name: 'Hello Hayley', pid: '361561956' },
  { name: 'Living Tickled', pid: '352643224' },
  { name: 'Moms Make Cents', pid: '352646496' },
  { name: 'Melrose Family', pid: '312388993' },
  { name: 'Polish And Patterns', pid: '470379682' },
  { name: 'Savor & Sprinkle', pid: '477410718' },
  { name: 'Styled Locks', pid: '477442222' },
  { name: 'The Makeup Mood', pid: '477439384' },
  { name: 'The Sourdough Sisters', pid: '477426865' },
  { name: 'Today Mommy', pid: '352650803' },
  { name: 'We Heart Cozy', pid: '470376528' },
  { name: 'We Heart Decorating', pid: '470328831' },
  { name: 'We Heart Desserts', pid: '470328832' },
  { name: 'We Heart Hairstyles', pid: '470365375' },
  { name: 'We Heart Makeup', pid: '470367406' },
  { name: 'We Heart Nail Designs', pid: '470349789' },
  { name: 'We Love Decorating', pid: '470363504' },
  { name: 'We Heart This', pid: '347579229' },
  { name: 'Bloom & Brick', pid: '477434645' },
  { name: 'Dash of Homemade', pid: '477437580' },
  { name: 'Gloss & Hair', pid: '477450807' },
  { name: 'Graceful Vows', pid: '477435859' },
  { name: 'Travel Cami', pid: '328534754' },
];

async function pullSite(name, pid) {
  try {
    // Last 30 days vs previous 30 days
    const [response] = await client.runReport({
      property: `properties/${pid}`,
      dateRanges: [
        { startDate: '30daysAgo', endDate: 'today' },
        { startDate: '60daysAgo', endDate: '31daysAgo' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'engagementRate' },
      ],
    });
    
    const row = response.rows?.[0];
    if (!row) return { name, sessions: 0, pageviews: 0, users: 0, engagement: 0, prevSessions: 0, prevPageviews: 0 };
    
    return {
      name,
      sessions: parseInt(row.metricValues[0].value),
      pageviews: parseInt(row.metricValues[1].value),
      users: parseInt(row.metricValues[2].value),
      engagement: parseFloat(row.metricValues[3].value),
      prevSessions: parseInt(row.metricValues[4].value),
      prevPageviews: parseInt(row.metricValues[5].value),
      prevUsers: parseInt(row.metricValues[6].value),
    };
  } catch (e) {
    return { name, error: e.message?.slice(0, 100) };
  }
}

// Also pull traffic sources for top sites
async function pullSources(name, pid) {
  try {
    const [response] = await client.runReport({
      property: `properties/${pid}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 5,
    });
    
    return response.rows?.map(r => ({
      source: r.dimensionValues[0].value,
      sessions: parseInt(r.metricValues[0].value),
    })) || [];
  } catch (e) {
    return [];
  }
}

console.log('Pulling GA4 data for all 23 properties...\n');

const results = [];
for (const site of SITES) {
  const data = await pullSite(site.name, site.pid);
  results.push(data);
  const status = data.error ? `❌ ${data.error}` : `${data.sessions.toLocaleString()} sessions | ${data.pageviews.toLocaleString()} PVs`;
  console.log(`${site.name}: ${status}`);
}

// Sort by sessions descending
results.sort((a, b) => (b.sessions || 0) - (a.sessions || 0));

console.log('\n=== PORTFOLIO RANKING (Last 30 Days) ===\n');
console.log('Site'.padEnd(25) + 'Sessions'.padStart(10) + 'Pageviews'.padStart(12) + 'Users'.padStart(10) + 'Prev Sessions'.padStart(15) + 'Change'.padStart(10));
console.log('-'.repeat(82));

for (const r of results) {
  if (r.error) {
    console.log(`${r.name.padEnd(25)} ERROR: ${r.error}`);
    continue;
  }
  const change = r.prevSessions > 0 ? Math.round(((r.sessions - r.prevSessions) / r.prevSessions) * 100) : 0;
  const changeStr = change >= 0 ? `+${change}%` : `${change}%`;
  console.log(
    r.name.padEnd(25) +
    (r.sessions?.toLocaleString() || '0').padStart(10) +
    (r.pageviews?.toLocaleString() || '0').padStart(12) +
    (r.users?.toLocaleString() || '0').padStart(10) +
    (r.prevSessions?.toLocaleString() || '0').padStart(15) +
    changeStr.padStart(10)
  );
}

// Pull sources for top 5
console.log('\n=== TOP TRAFFIC SOURCES (Top 5 Sites) ===\n');
const top5 = results.filter(r => !r.error).slice(0, 5);
for (const site of top5) {
  const s = SITES.find(x => x.name === site.name);
  const sources = await pullSources(site.name, s.pid);
  console.log(`${site.name}:`);
  for (const src of sources) {
    console.log(`  ${src.source.padEnd(20)} ${src.sessions.toLocaleString()} sessions`);
  }
  console.log('');
}
