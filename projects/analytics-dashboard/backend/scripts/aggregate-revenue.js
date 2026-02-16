#!/usr/bin/env node
/**
 * Aggregate Revenue Script
 * Combines data from mediavine.json + etsy.json → revenue.json
 * Run manually or via cron to keep dashboard updated
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function readJson(filename) {
  const filepath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, 'utf8'));
    }
  } catch (e) {
    console.error(`Error reading ${filename}:`, e.message);
  }
  return null;
}

function writeJson(filename, data) {
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`✅ Wrote ${filename}`);
}

function aggregate() {
  console.log('📊 Aggregating revenue data...\n');
  
  // Read source data
  const mediavine = readJson('mediavine.json');
  const etsy = readJson('etsy.json');
  const raptive = readJson('raptive.json');
  
  // Calculate Mediavine totals
  let mediavineRevenue = 0;
  let mediavineTraffic = 0;
  
  if (mediavine?.sites) {
    mediavine.sites.forEach(site => {
      // Skip Raptive sites that might be in mediavine.json
      if (site.platform === 'raptive') return;
      mediavineRevenue += site.mtdRevenue || 0;
      mediavineTraffic += site.mtdSessions || 0;
    });
  }
  
  // Calculate Raptive totals (Melrose Family)
  let raptiveRevenue = 0;
  let raptiveTraffic = 0;
  
  // Check if Melrose is in mediavine.json with platform: raptive
  if (mediavine?.sites) {
    mediavine.sites.forEach(site => {
      if (site.platform === 'raptive') {
        raptiveRevenue += site.mtdRevenue || 0;
        raptiveTraffic += site.mtdSessions || 0;
      }
    });
  }
  
  // Or check separate raptive.json
  if (raptive?.sites) {
    raptive.sites.forEach(site => {
      raptiveRevenue += site.mtdRevenue || 0;
      raptiveTraffic += site.mtdSessions || 0;
    });
  }
  
  // Calculate Etsy totals
  let etsyRevenue = 0;
  let etsyProfit = 0;
  let etsyAdSpend = 0;
  
  if (etsy?.shops) {
    etsy.shops.forEach(shop => {
      etsyRevenue += shop.revenue || 0;
      etsyProfit += shop.netProfit || 0;
      etsyAdSpend += shop.ads || 0;
    });
  }
  
  // Calculate totals
  const totalRevenue = mediavineRevenue + raptiveRevenue + etsyProfit; // Use Etsy NET profit, not gross
  const totalAdRevenue = mediavineRevenue + raptiveRevenue;
  const totalTraffic = mediavineTraffic + raptiveTraffic;
  
  // Calculate ROAS for Etsy (revenue / ad spend)
  const etsyROAS = etsyAdSpend > 0 ? etsyRevenue / etsyAdSpend : 0;
  
  // Estimate profit (ad revenue is ~pure profit, Etsy profit already calculated)
  const totalProfit = totalAdRevenue + etsyProfit;
  
  // Build revenue.json
  const revenue = {
    lastUpdated: new Date().toISOString(),
    dataStatus: 'live',
    mtd: {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalProfit: Math.round(totalProfit * 100) / 100,
      portfolioROAS: Math.round(etsyROAS * 100) / 100,
      totalTraffic: totalTraffic
    },
    goal: {
      target: 20000,
      minimum: 15000,
      current: Math.round(totalRevenue * 100) / 100,
      percentage: Math.round((totalRevenue / 20000) * 1000) / 10
    },
    sources: {
      mediavine: Math.round(mediavineRevenue * 100) / 100,
      raptive: Math.round(raptiveRevenue * 100) / 100,
      etsy: Math.round(etsyProfit * 100) / 100, // Net profit from Etsy
      etsyGross: Math.round(etsyRevenue * 100) / 100, // Gross for reference
      fbBonus: 0, // TODO: Add FB bonus tracking
      other: 0
    },
    comparison: {
      lastMonth: {
        totalRevenue: 0, // TODO: Store historical data
        changePercent: 0
      }
    }
  };
  
  // Log summary
  console.log('📈 Revenue Summary (MTD):');
  console.log(`   Mediavine:  $${revenue.sources.mediavine.toLocaleString()}`);
  console.log(`   Raptive:    $${revenue.sources.raptive.toLocaleString()}`);
  console.log(`   Etsy (net): $${revenue.sources.etsy.toLocaleString()}`);
  console.log(`   ─────────────────────`);
  console.log(`   TOTAL:      $${revenue.mtd.totalRevenue.toLocaleString()}`);
  console.log(`   Goal:       ${revenue.goal.percentage}% of $${revenue.goal.target.toLocaleString()}`);
  console.log(`   Traffic:    ${revenue.mtd.totalTraffic.toLocaleString()} sessions`);
  console.log(`   Etsy ROAS:  ${revenue.mtd.portfolioROAS}x\n`);
  
  // Write revenue.json
  writeJson('revenue.json', revenue);
  
  // Also update alerts based on data
  updateAlerts(mediavine, etsy, revenue);
  
  return revenue;
}

function updateAlerts(mediavine, etsy, revenue) {
  const alerts = [];
  
  // Check for sites needing attention
  if (mediavine?.sites) {
    mediavine.sites.forEach(site => {
      if (site.needsAttention) {
        alerts.push({
          id: `site-${site.id}`,
          type: 'warning',
          priority: 'high',
          title: `${site.name} needs attention`,
          message: site.note || 'Revenue or traffic anomaly detected',
          source: 'mediavine',
          timestamp: new Date().toISOString()
        });
      }
    });
  }
  
  // Check for Etsy shops losing money
  if (etsy?.shops) {
    const losingShops = etsy.shops.filter(s => s.netProfit < 0);
    if (losingShops.length > 0) {
      alerts.push({
        id: 'etsy-losing',
        type: 'warning',
        priority: 'medium',
        title: `${losingShops.length} Etsy shop(s) losing money`,
        message: `Review ad spend: ${losingShops.map(s => s.name).join(', ')}`,
        source: 'etsy',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for shops crushing it
    const winningShops = etsy.shops.filter(s => s.netProfit > 500);
    if (winningShops.length > 0) {
      alerts.push({
        id: 'etsy-winning',
        type: 'success',
        priority: 'info',
        title: `${winningShops.length} shop(s) crushing it! 🎉`,
        message: `Consider scaling: ${winningShops.map(s => s.name).join(', ')}`,
        source: 'etsy',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Check goal progress
  if (revenue.goal.percentage < 50 && new Date().getDate() > 15) {
    alerts.push({
      id: 'goal-behind',
      type: 'warning',
      priority: 'high',
      title: 'Behind on monthly goal',
      message: `Only ${revenue.goal.percentage}% of goal with ${30 - new Date().getDate()} days left`,
      source: 'goals',
      timestamp: new Date().toISOString()
    });
  }
  
  writeJson('alerts.json', {
    lastUpdated: new Date().toISOString(),
    alerts
  });
}

// Run aggregation
aggregate();
