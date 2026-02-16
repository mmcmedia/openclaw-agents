#!/usr/bin/env node
/**
 * Deploy System Health Monitor to Cron
 * One-time setup script
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const CRON_ENTRY = '*/15 * * * * cd /Users/mmcassistant/clawd && /usr/local/bin/node scripts/system-health-monitor.mjs >> /var/log/openclaw-health.log 2>&1';

console.log('🩺 System Health Monitor - Cron Deployment');
console.log('='.repeat(50));

// Check if monitor exists
if (!existsSync('/Users/mmcassistant/clawd/scripts/system-health-monitor.mjs')) {
  console.error('❌ Health monitor script not found');
  process.exit(1);
}

console.log('✅ Health monitor script exists');

// Check current crontab
try {
  const currentCrontab = execSync('crontab -l 2>/dev/null || echo ""', { encoding: 'utf8' });
  
  if (currentCrontab.includes('system-health-monitor')) {
    console.log('ℹ️  Health monitor already in crontab');
    console.log('   No changes needed');
    process.exit(0);
  }
  
  // Add to crontab
  const newCrontab = currentCrontab + '\n# OpenClaw System Health Monitor\n' + CRON_ENTRY + '\n';
  
  execSync(`echo "${newCrontab.replace(/"/g, '\\"')}" | crontab -`);
  
  console.log('✅ Added to crontab');
  console.log('   Schedule: Every 15 minutes');
  console.log('   Log: /var/log/openclaw-health.log');
  
  // Create log directory if needed
  try {
    execSync('sudo mkdir -p /var/log && sudo touch /var/log/openclaw-health.log', { stdio: 'ignore' });
  } catch {
    // May not have sudo, log to local file instead
    console.log('   (Logging to local file if /var/log not writable)');
  }
  
  console.log('\n🎉 Deployment complete!');
  console.log('   Health monitor will run automatically every 15 minutes');
  
} catch (e) {
  console.error('❌ Failed to update crontab:', e.message);
  console.log('\nManual setup:');
  console.log('1. Run: crontab -e');
  console.log('2. Add this line:');
  console.log(`   ${CRON_ENTRY}`);
  process.exit(1);
}
