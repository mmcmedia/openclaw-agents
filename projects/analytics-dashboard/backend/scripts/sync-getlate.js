#!/usr/bin/env node
/**
 * Sync GetLate social data to dashboard backend
 * Run: node scripts/sync-getlate.js
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(process.env.HOME, '.clawdbot', '.env') });

const API_KEY = process.env.GETLATE_API_KEY;
const DATA_DIR = path.join(__dirname, '..', 'data');

// Map GetLate accounts to McKinzie's sites
const SITE_MAPPING = {
  'weheartthis': { site: 'We Heart This', category: 'content' },
  'hellohayleyblog': { site: 'Hello Hayley', category: 'content' },
  'melrosefamily': { site: 'Melrose Family', category: 'content' },
  'weheartcozy': { site: 'We Heart Cozy', category: 'content' },
  'shineforchrist': { site: 'Shine For Christ', category: 'etsy' },
  'thesundaisy': { site: 'TheSunDaisy', category: 'etsy' },
  // Add more mappings as needed
};

async function fetchFollowerStats() {
  const response = await fetch('https://getlate.dev/api/v1/accounts/follower-stats', {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`GetLate API error: ${response.status}`);
  }
  
  return response.json();
}

function processAccounts(data) {
  const accounts = data.accounts || [];
  
  // Group by site/brand
  const grouped = {};
  
  accounts.forEach(account => {
    const username = account.username?.toLowerCase();
    const platform = account.platform;
    
    // Find matching site
    let siteKey = null;
    for (const [key, mapping] of Object.entries(SITE_MAPPING)) {
      if (username?.includes(key)) {
        siteKey = mapping.site;
        break;
      }
    }
    
    if (!siteKey) {
      // Use displayName or username as fallback
      siteKey = account.displayName || username;
    }
    
    if (!grouped[siteKey]) {
      grouped[siteKey] = {
        name: siteKey,
        platforms: {},
        totalFollowers: 0,
        totalGrowth: 0
      };
    }
    
    grouped[siteKey].platforms[platform] = {
      followers: account.currentFollowers || 0,
      growth: account.growth || 0,
      growthPercent: account.growthPercentage || 0,
      username: account.username,
      lastUpdated: account.lastUpdated
    };
    
    grouped[siteKey].totalFollowers += (account.currentFollowers || 0);
    grouped[siteKey].totalGrowth += (account.growth || 0);
  });
  
  return grouped;
}

function formatSocialData(grouped) {
  const socialData = {
    lastUpdated: new Date().toISOString(),
    dataStatus: 'live',
    source: 'getlate',
    accounts: [],
    summary: {
      totalFollowers: 0,
      totalGrowth: 0,
      platformBreakdown: {}
    }
  };
  
  // Convert grouped data to array format
  for (const [siteName, siteData] of Object.entries(grouped)) {
    const account = {
      name: siteName,
      totalFollowers: siteData.totalFollowers,
      totalGrowth: siteData.totalGrowth,
      platforms: siteData.platforms
    };
    
    socialData.accounts.push(account);
    socialData.summary.totalFollowers += siteData.totalFollowers;
    socialData.summary.totalGrowth += siteData.totalGrowth;
    
    // Platform breakdown
    for (const [platform, data] of Object.entries(siteData.platforms)) {
      if (!socialData.summary.platformBreakdown[platform]) {
        socialData.summary.platformBreakdown[platform] = { followers: 0, growth: 0 };
      }
      socialData.summary.platformBreakdown[platform].followers += data.followers;
      socialData.summary.platformBreakdown[platform].growth += data.growth;
    }
  }
  
  // Sort by total followers (biggest first)
  socialData.accounts.sort((a, b) => b.totalFollowers - a.totalFollowers);
  
  return socialData;
}

async function main() {
  console.log('🔄 Fetching GetLate social data...');
  
  try {
    const data = await fetchFollowerStats();
    console.log(`✅ Got ${data.accounts?.length || 0} accounts from GetLate`);
    
    const grouped = processAccounts(data);
    const socialData = formatSocialData(grouped);
    
    // Write to data file
    const outputPath = path.join(DATA_DIR, 'social.json');
    fs.writeFileSync(outputPath, JSON.stringify(socialData, null, 2));
    console.log(`✅ Wrote social data to ${outputPath}`);
    
    // Print summary
    console.log('\n📊 Social Summary:');
    console.log(`   Total Followers: ${socialData.summary.totalFollowers.toLocaleString()}`);
    console.log(`   Total Growth (30d): ${socialData.summary.totalGrowth > 0 ? '+' : ''}${socialData.summary.totalGrowth.toLocaleString()}`);
    console.log('\n   Top accounts:');
    socialData.accounts.slice(0, 5).forEach(account => {
      const growth = account.totalGrowth > 0 ? `+${account.totalGrowth}` : account.totalGrowth;
      console.log(`   - ${account.name}: ${account.totalFollowers.toLocaleString()} followers (${growth})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
