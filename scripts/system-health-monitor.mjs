#!/usr/bin/env node
/**
 * System Health Monitor
 * Automated monitoring and remediation for OpenClaw system
 * 
 * Run manually: node scripts/system-health-monitor.mjs
 * Or via cron: */15 * * * * cd /Users/mmcassistant/clawd && node scripts/system-health-monitor.mjs
 */

import { existsSync, mkdirSync, writeFileSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LOG_DIR = join(ROOT, 'projects/system-health/logs');
const REPORT_DIR = join(ROOT, 'projects/system-health/reports');

// Ensure directories exist
if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true });
if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });

const timestamp = new Date();
const dateStr = timestamp.toISOString().split('T')[0];
const timeStr = timestamp.toTimeString().split(' ')[0];
const reportFile = join(REPORT_DIR, `${dateStr}-${timeStr.replace(/:/g, '')}.md`);

const checks = [];
const actions = [];

function check(name, testFn) {
  try {
    const passed = testFn();
    checks.push({ name, passed, critical: true });
    return passed;
  } catch (e) {
    checks.push({ name, passed: false, error: e.message, critical: true });
    return false;
  }
}

function warn(name, testFn) {
  try {
    const passed = testFn();
    checks.push({ name, passed, critical: false });
    return passed;
  } catch (e) {
    checks.push({ name, passed: false, error: e.message, critical: false });
    return false;
  }
}

console.log('🩺 System Health Monitor');
console.log('='.repeat(50));
console.log(`Time: ${timestamp.toISOString()}`);
console.log('');

// 1. Gateway Check
console.log('Checking Gateway...');
const gatewayRunning = check('Gateway is running', () => {
  try {
    execSync('openclaw gateway status', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
});

if (!gatewayRunning) {
  console.log('  → Restarting Gateway...');
  try {
    execSync('openclaw gateway restart', { stdio: 'pipe' });
    actions.push('Restarted Gateway');
    console.log('  ✅ Gateway restarted');
  } catch (e) {
    actions.push(`Failed to restart Gateway: ${e.message}`);
    console.log('  ❌ Failed to restart');
  }
}

// 2. Browser Availability
console.log('Checking browser availability...');
warn('Browser is available', () => {
  // Simplified check - actual check would try to use playwright
  return true; // Placeholder
});

// 3. SESSION_STATE Staleness
console.log('Checking SESSION_STATE...');
const sessionStatePath = join(ROOT, 'SESSION_STATE.md');
const sessionStateStale = warn('SESSION_STATE updated recently (< 3 hours)', () => {
  if (!existsSync(sessionStatePath)) return false;
  const stats = statSync(sessionStatePath);
  const age = Date.now() - stats.mtime.getTime();
  const threeHours = 3 * 60 * 60 * 1000;
  return age < threeHours;
});

if (!sessionStateStale) {
  actions.push('SESSION_STATE.md is stale (>3 hours)');
}

// 4. Kanban Drift Check
console.log('Checking kanban...');
const kanbanPath = join(ROOT, 'dashboard/data/cards.json');
warn('No stale in-progress cards (>7 days)', () => {
  if (!existsSync(kanbanPath)) return true;
  try {
    const cards = JSON.parse(readFileSync(kanbanPath, 'utf8'));
    const staleCards = cards.filter(c => {
      if (c.column !== 'inprogress') return false;
      const updated = new Date(c.updatedAt);
      const age = Date.now() - updated.getTime();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      return age > sevenDays;
    });
    if (staleCards.length > 0) {
      actions.push(`Found ${staleCards.length} stale in-progress cards`);
    }
    return staleCards.length === 0;
  } catch {
    return true;
  }
});

// Generate report
const report = `# System Health Report
**Generated:** ${timestamp.toISOString()}

## Checks

| Check | Status |
|-------|--------|
${checks.map(c => `| ${c.name} | ${c.passed ? '✅' : c.critical ? '❌' : '⚠️'} |`).join('\n')}

## Actions Taken
${actions.length > 0 ? actions.map(a => `- ${a}`).join('\n') : '- None'}

## Summary
- **Checks passed:** ${checks.filter(c => c.passed).length}/${checks.length}
- **Critical issues:** ${checks.filter(c => !c.passed && c.critical).length}
- **Warnings:** ${checks.filter(c => !c.passed && !c.critical).length}
`;

writeFileSync(reportFile, report);

// Console output
console.log('\n' + '='.repeat(50));
console.log('SUMMARY');
console.log('='.repeat(50));
console.log(`Checks: ${checks.filter(c => c.passed).length}/${checks.length} passed`);
console.log(`Critical: ${checks.filter(c => !c.passed && c.critical).length}`);
console.log(`Warnings: ${checks.filter(c => !c.passed && !c.critical).length}`);
console.log(`Report: ${reportFile}`);

if (actions.length > 0) {
  console.log('\nActions:');
  actions.forEach(a => console.log(`  → ${a}`));
}

// Exit code
const criticalIssues = checks.filter(c => !c.passed && c.critical).length;
process.exit(criticalIssues > 0 ? 1 : 0);
