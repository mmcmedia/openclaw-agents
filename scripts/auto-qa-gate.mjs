#!/usr/bin/env node
/**
 * Auto-QA Gate Integration
 * Automatically runs QA gate on sub-agent completions
 * 
 * Usage: node scripts/auto-qa-gate.mjs <session-key> <deliverable-path> <type>
 */

import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const sessionKey = process.argv[2];
const deliverablePath = process.argv[3];
const type = process.argv[4] || 'general';

if (!sessionKey || !deliverablePath) {
  console.error('Usage: node scripts/auto-qa-gate.mjs <session-key> <path> <type>');
  process.exit(1);
}

console.log('🔍 Auto QA Gate');
console.log(`Session: ${sessionKey}`);
console.log(`Deliverable: ${deliverablePath}`);
console.log(`Type: ${type}`);
console.log('');

// Run QA gate
const qaGatePath = join(ROOT, 'scripts', 'qa-gate.mjs');

try {
  const result = execFileSync('node', [qaGatePath, deliverablePath, type], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log(result);
  console.log('✅ QA Gate: PASS — Deliverable approved');
  process.exit(0);
  
} catch (e) {
  console.log(e.stdout || '');
  
  if (e.status === 1) {
    console.log('🟡 QA Gate: REVISE — Fixable issues found');
    console.log('   Deliverable needs revision before delivery');
    // Here we would notify the sub-agent to fix
  } else if (e.status === 2) {
    console.log('🔴 QA Gate: REJECT — Critical issues found');
    console.log('   Deliverable must be rebuilt');
    // Here we would notify the sub-agent to restart
  } else {
    console.log('❌ QA Gate: ERROR — Failed to run');
    console.log(e.stderr || e.message);
  }
  
  process.exit(e.status || 1);
}
