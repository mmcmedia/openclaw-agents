#!/usr/bin/env node
/**
 * QA Gate Script - Production Quality Enforcement
 * Enforces quality checks before any deliverable is marked complete
 * 
 * Usage: node scripts/qa-gate.mjs <path> <type>
 * Types: code, ui, research, content
 * 
 * Exit codes:
 * 0 = PASS ✅ - Ready for delivery
 * 1 = REVISE 🟡 - Fixable issues, needs another pass
 * 2 = REJECT 🔴 - Fundamental problems, rebuild required
 * 3 = ERROR - Bad invocation or system error
 * 
 * Environment variables:
 * QA_SCREENSHOT_DIR - Base directory for screenshots (default: ~/projects/qa-screenshots)
 * QA_VERBOSE - Set to 'true' for detailed output
 */

import { 
  existsSync, 
  mkdirSync, 
  readFileSync,
  statSync 
} from 'fs';
import { execFileSync, execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join, isAbsolute } from 'path';
import os from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Parse arguments
const PATH = process.argv[2];
const TYPE = process.argv[3] || 'general';
const VERBOSE = process.env.QA_VERBOSE === 'true';

// Valid types
const VALID_TYPES = new Set(['code', 'ui', 'research', 'content', 'general']);

// Usage check
if (!PATH) {
  console.error('Usage: node scripts/qa-gate.mjs <path> <type>');
  console.error('Types: code, ui, research, content, general');
  console.error('');
  console.error('Environment variables:');
  console.error('  QA_SCREENSHOT_DIR - Base directory for screenshots');
  console.error('  QA_VERBOSE=true - Detailed output');
  process.exit(3);
}

// Validate type
if (!VALID_TYPES.has(TYPE)) {
  console.error(`❌ Unknown type: ${TYPE}`);
  console.error(`Valid types: ${Array.from(VALID_TYPES).join(', ')}`);
  process.exit(3);
}

// Validate PATH doesn't contain shell metacharacters (security)
if (/[;&|`$]/.test(PATH)) {
  console.error('❌ PATH contains unsafe characters');
  process.exit(3);
}

// Resolve path
const resolvedPath = isAbsolute(PATH) ? PATH : join(process.cwd(), PATH);

console.log('🔍 QA Gate - Production Quality Check');
console.log('='.repeat(60));
console.log(`Path: ${resolvedPath}`);
console.log(`Type: ${TYPE}`);
console.log(`Root: ${ROOT}`);
console.log('');

const results = [];
let exitCode = 0;

/**
 * Run a check and record result
 * @param {string} name - Check name
 * @param {Function} testFn - Test function
 * @param {boolean} critical - Whether failure is critical
 */
function check(name, testFn, critical = true) {
  try {
    if (VERBOSE) console.log(`Running: ${name}...`);
    const passed = testFn();
    const icon = passed ? '✅' : critical ? '❌' : '⚠️';
    console.log(`${icon} ${name}`);
    results.push({ name, passed, critical });
    if (!passed && exitCode === 0) {
      exitCode = critical ? 2 : 1;
    }
    return passed;
  } catch (e) {
    const icon = critical ? '❌' : '⚠️';
    const message = e?.message || String(e);
    console.log(`${icon} ${name} — Error: ${message}`);
    if (e?.stdout) console.error('stdout:', String(e.stdout));
    if (e?.stderr) console.error('stderr:', String(e.stderr));
    results.push({ name, passed: false, critical, error: message });
    exitCode = critical ? 2 : 1;
    return false;
  }
}

/**
 * Run adversarial review safely
 * @param {string} filePath - File to review
 * @param {string} reviewType - Type of review
 */
function runAdversarialReview(filePath, reviewType) {
  try {
    const reviewScript = join(ROOT, 'scripts', 'adversarial-review.mjs');
    if (!existsSync(reviewScript)) {
      throw new Error('Adversarial review script not found');
    }
    
    // Use execFileSync with args array (safe from injection)
    execFileSync('node', [reviewScript, filePath, reviewType], {
      cwd: ROOT,
      stdio: VERBOSE ? 'inherit' : 'pipe',
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    return true;
  } catch (e) {
    // Adversarial review returns non-zero for REVISE or REJECT
    // Check the exit code to determine if it's a real error
    if (e.status === 1) {
      console.log('   🟡 Adversarial review: REVISE (fixable issues)');
      return false; // Will set exitCode to 1
    } else if (e.status === 2) {
      console.log('   🔴 Adversarial review: REJECT (fundamental problems)');
      throw new Error('Adversarial review rejected - fundamental problems found');
    }
    throw e; // Real error
  }
}

// Run checks based on type
if (TYPE === 'code') {
  console.log('Running code quality checks...\n');
  
  check('Path exists', () => existsSync(resolvedPath), true);
  check('Path is a directory', () => {
    const stat = statSync(resolvedPath);
    return stat.isDirectory();
  }, true);
  check('Package.json exists', () => 
    existsSync(join(resolvedPath, 'package.json')), true
  );
  check('Build passes', () => {
    try {
      execSync('npm run build', { 
        cwd: resolvedPath, 
        stdio: VERBOSE ? 'inherit' : 'pipe',
        maxBuffer: 50 * 1024 * 1024 // 50MB for large builds
      });
      return true;
    } catch (e) {
      if (VERBOSE) {
        console.error('Build failed:', e.message);
        if (e.stdout) console.error('stdout:', String(e.stdout));
        if (e.stderr) console.error('stderr:', String(e.stderr));
      }
      return false;
    }
  }, true);
  check('No lint errors', () => {
    try {
      execSync('npm run lint', { 
        cwd: resolvedPath, 
        stdio: VERBOSE ? 'inherit' : 'pipe' 
      });
      return true;
    } catch {
      return false;
    }
  }, false); // Lint errors are warnings, not critical
  check('Adversarial review passes', () => 
    runAdversarialReview(resolvedPath, 'code'), true
  );

} else if (TYPE === 'ui') {
  console.log('Running UI quality checks...\n');
  
  check('Path exists', () => existsSync(resolvedPath), true);
  check('Screenshots directory ready', () => {
    const date = new Date().toISOString().split('T')[0];
    const baseDir = process.env.QA_SCREENSHOT_DIR || 
                    join(os.homedir(), 'clawd', 'projects', 'qa-screenshots');
    const dir = join(baseDir, date);
    
    try {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      return true;
    } catch (e) {
      console.error(`Failed to create screenshot directory: ${e.message}`);
      return false;
    }
  }, true);
  check('Build artifact exists', () => {
    // For UI, path should be a file (index.html) or directory with built assets
    const stat = statSync(resolvedPath);
    if (stat.isFile()) {
      return resolvedPath.endsWith('.html') || resolvedPath.endsWith('.jsx');
    }
    return existsSync(join(resolvedPath, 'index.html'));
  }, true);
  check('Adversarial review passes', () => 
    runAdversarialReview(resolvedPath, 'content'), true
  );

} else if (TYPE === 'research') {
  console.log('Running research quality checks...\n');
  
  check('File exists', () => existsSync(resolvedPath), true);
  check('File is readable', () => {
    try {
      readFileSync(resolvedPath, 'utf8');
      return true;
    } catch {
      return false;
    }
  }, true);
  check('Has minimum source citations (3+)', () => {
    try {
      const content = readFileSync(resolvedPath, 'utf8');
      const urlCount = (content.match(/https?:\/\//g) || []).length;
      return urlCount >= 3;
    } catch {
      return false;
    }
  }, false);
  check('Adversarial review passes', () => 
    runAdversarialReview(resolvedPath, 'research'), true
  );

} else if (TYPE === 'content') {
  console.log('Running content quality checks...\n');
  
  check('File exists', () => existsSync(resolvedPath), true);
  check('File is readable', () => {
    try {
      readFileSync(resolvedPath, 'utf8');
      return true;
    } catch {
      return false;
    }
  }, true);
  check('Adversarial review passes', () => 
    runAdversarialReview(resolvedPath, 'content'), true
  );

} else {
  // General type - just basic checks
  console.log('Running general checks...\n');
  check('Path exists', () => existsSync(resolvedPath), true);
  check('Path is accessible', () => {
    try {
      statSync(resolvedPath);
      return true;
    } catch {
      return false;
    }
  }, true);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));

const passed = results.filter(r => r.passed).length;
const total = results.length;
const criticalFailed = results.filter(r => !r.passed && r.critical).length;
const warnings = results.filter(r => !r.passed && !r.critical).length;

console.log(`Checks: ${passed}/${total} passed`);
console.log(`Critical failures: ${criticalFailed}`);
console.log(`Warnings: ${warnings}`);

if (exitCode === 0) {
  console.log('\n✅ PASS — Ready for delivery');
  console.log('   All quality checks passed. Ship it!');
} else if (exitCode === 1) {
  console.log('\n🟡 REVISE — Fixable issues found');
  console.log('   Address warnings and re-run QA gate');
} else {
  console.log('\n🔴 REJECT — Critical issues found');
  console.log('   Fundamental problems must be fixed before delivery');
}

if (VERBOSE && results.some(r => !r.passed)) {
  console.log('\nFailed checks:');
  results.filter(r => !r.passed).forEach(r => {
    console.log(`  ❌ ${r.name}${r.error ? ': ' + r.error : ''}`);
  });
}

process.exit(exitCode);
