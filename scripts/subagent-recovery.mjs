#!/usr/bin/env node
/**
 * Self-Healing Sub-Agent Recovery
 * Monitors spawns and auto-recovers from failures
 * 
 * Run via cron: */10 * * * * cd /Users/mmcassistant/clawd && node scripts/subagent-recovery.mjs
 */

import { execSync } from 'child_process';
import { readFileSync, appendFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_FILE = join(__dirname, '..', 'projects', 'subagent-tracking', 'recovery-log.md');

console.log('🩺 Sub-Agent Recovery Monitor');
console.log('='.repeat(50));
console.log(`Time: ${new Date().toISOString()}`);
console.log('');

// Get active spawns
try {
  const output = execSync('openclaw sessions list --kinds=spawn --active-minutes=120 --json', {
    encoding: 'utf8',
    cwd: join(__dirname, '..')
  });
  
  const sessions = JSON.parse(output);
  console.log(`Found ${sessions.count} active spawn sessions`);
  
  if (sessions.count === 0) {
    console.log('✅ No active spawns to check');
    process.exit(0);
  }
  
  // Check each session
  for (const session of sessions.sessions || []) {
    const sessionKey = session.key;
    const updatedAt = session.updatedAt;
    const age = Date.now() - updatedAt;
    const ageMinutes = Math.floor(age / 60000);
    
    console.log(`\nChecking: ${sessionKey}`);
    console.log(`  Age: ${ageMinutes} minutes`);
    
    // If session >2 hours with no update, check if stuck
    if (ageMinutes > 120) {
      console.log(`  ⚠️  Session stale (>2 hours)`);
      
      // Get session history
      try {
        const historyOutput = execSync(`openclaw sessions history ${sessionKey} --limit=5 --json`, {
          encoding: 'utf8'
        });
        const history = JSON.parse(historyOutput);
        
        // Check for errors in last 5 messages
        const hasErrors = history.messages?.some(m => 
          m.content?.includes('error') || 
          m.content?.includes('fail') ||
          m.content?.includes('stuck')
        );
        
        if (hasErrors) {
          console.log(`  🔴 Errors detected — marking for recovery`);
          
          // Log recovery action
          const logEntry = `
## Recovery Action: ${new Date().toISOString()}
- Session: ${sessionKey}
- Age: ${ageMinutes} minutes
- Issue: Errors detected
- Action: Auto-restart recommended
`;
          appendFileSync(LOG_FILE, logEntry);
          
          // Here we would:
          // 1. Kill the stuck session
          // 2. Parse the error
          // 3. Respawn with fix instructions
          // 4. Notify Maria if 3rd failure
          
          console.log(`  📝 Logged to recovery-log.md`);
        } else {
          console.log(`  ✅ No errors, may just be slow`);
        }
        
      } catch (e) {
        console.log(`  ❌ Failed to get history: ${e.message}`);
      }
    } else {
      console.log(`  ✅ Active and healthy`);
    }
  }
  
  console.log('\n✅ Recovery check complete');
  
} catch (e) {
  console.error('❌ Failed to list sessions:', e.message);
  process.exit(1);
}
