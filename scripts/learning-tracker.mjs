#!/usr/bin/env node
/**
 * Learning Tracker - Self-Improving Agents
 * Tracks McKinzie's approvals/rejections to improve agent prompts
 * 
 * Usage:
 *   node scripts/learning-tracker.mjs approve <deliverable-path> "feedback"
 *   node scripts/learning-tracker.mjs reject <deliverable-path> "feedback"
 *   node scripts/learning-tracker.mjs stats
 */

import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'fs';
import { join } from 'path';

const PROFILE_FILE = join(process.cwd(), 'projects', 'learning-profiles', 'mckinzie-profile.md');
const FEEDBACK_LOG = join(process.cwd(), 'projects', 'learning-profiles', 'feedback-log.jsonl');
const PATTERNS_FILE = join(process.cwd(), 'projects', 'learning-profiles', 'detected-patterns.json');

// Load or create profile
function loadProfile() {
  if (!existsSync(PROFILE_FILE)) {
    return {
      approvals: 0,
      rejections: 0,
      revisions: 0,
      patterns: {
        conciseness: 50,
        actionability: 50,
        revenueFocus: 50,
        qualityGates: 50,
        brandVoice: 50,
        scannability: 50
      },
      approvedPatterns: [],
      rejectedPatterns: []
    };
  }
  
  // Parse markdown profile (simplified)
  const content = readFileSync(PROFILE_FILE, 'utf8');
  const approvals = (content.match(/✅/g) || []).length;
  const rejections = (content.match(/❌/g) || []).length;
  
  return { approvals, rejections, patterns: {} };
}

function saveFeedback(type, deliverable, feedback, patterns) {
  const entry = {
    timestamp: new Date().toISOString(),
    type,
    deliverable,
    feedback,
    patterns,
    agent: detectAgent(deliverable)
  };
  
  appendFileSync(FEEDBACK_LOG, JSON.stringify(entry) + '\n');
  console.log(`📝 Feedback logged: ${type}`);
}

function detectAgent(deliverable) {
  // Detect which agent created the deliverable
  if (deliverable.includes('sage')) return 'sage';
  if (deliverable.includes('scout')) return 'scout';
  if (deliverable.includes('pixel')) return 'pixel';
  if (deliverable.includes('dev')) return 'dev';
  return 'unknown';
}

function extractPatterns(feedback) {
  const patterns = [];
  const lower = feedback.toLowerCase();
  
  // Positive patterns
  if (lower.includes('concise') || lower.includes('short')) patterns.push('conciseness');
  if (lower.includes('action') || lower.includes('do this')) patterns.push('actionability');
  if (lower.includes('revenue') || lower.includes('$')) patterns.push('revenueFocus');
  if (lower.includes('perfect') || lower.includes('great')) patterns.push('qualityGates');
  if (lower.includes('love') || lower.includes('yasss')) patterns.push('brandVoice');
  if (lower.includes('clear') || lower.includes('easy')) patterns.push('scannability');
  
  // Negative patterns
  if (lower.includes('too long') || lower.includes('verbose')) patterns.push('!conciseness');
  if (lower.includes('not actionable') || lower.includes('what do i do')) patterns.push('!actionability');
  if (lower.includes('no data') || lower.includes('missing')) patterns.push('!revenueFocus');
  
  return patterns;
}

function updateProfile(type, patterns) {
  let profile = loadProfile();
  
  if (type === 'approve') {
    profile.approvals++;
    // Boost approved patterns
    patterns.forEach(p => {
      if (!p.startsWith('!')) {
        profile.patterns[p] = Math.min(100, (profile.patterns[p] || 50) + 5);
      }
    });
  } else if (type === 'reject') {
    profile.rejections++;
    // Lower rejected patterns
    patterns.forEach(p => {
      if (p.startsWith('!')) {
        const key = p.slice(1);
        profile.patterns[key] = Math.max(0, (profile.patterns[key] || 50) - 10);
      }
    });
  } else if (type === 'revise') {
    profile.revisions++;
  }
  
  // Save patterns
  writeFileSync(PATTERNS_FILE, JSON.stringify(profile, null, 2));
  
  return profile;
}

function generatePromptAdjustments(profile) {
  const adjustments = [];
  
  if (profile.patterns.conciseness > 70) {
    adjustments.push('- Be concise. Lead with the answer, then details if needed.');
  }
  if (profile.patterns.actionability > 70) {
    adjustments.push('- Always include specific next steps.');
  }
  if (profile.patterns.revenueFocus > 70) {
    adjustments.push('- Include revenue estimates and ROI when relevant.');
  }
  if (profile.patterns.qualityGates > 70) {
    adjustments.push('- Pass all quality gates before delivery.');
  }
  if (profile.patterns.brandVoice > 70) {
    adjustments.push('- Use warm, organized, YASSS energy but stay focused.');
  }
  if (profile.patterns.scannability > 70) {
    adjustments.push('- Use bullet points, H2s, and bold for scannable content.');
  }
  
  return adjustments;
}

function showStats() {
  const profile = loadProfile();
  
  console.log('📊 Learning Statistics');
  console.log('='.repeat(50));
  console.log(`Approvals: ${profile.approvals}`);
  console.log(`Rejections: ${profile.rejections}`);
  console.log(`Revisions: ${profile.revisions}`);
  console.log('');
  console.log('Pattern Scores:');
  Object.entries(profile.patterns).forEach(([key, value]) => {
    const bar = '█'.repeat(value / 5) + '░'.repeat(20 - value / 5);
    console.log(`  ${key.padEnd(15)} ${bar} ${value}%`);
  });
  console.log('');
  console.log('Current Prompt Adjustments:');
  const adjustments = generatePromptAdjustments(profile);
  adjustments.forEach(adj => console.log(`  ${adj}`));
}

// Main
const args = process.argv.slice(2);
const command = args[0];

if (command === 'approve') {
  const deliverable = args[1];
  const feedback = args.slice(2).join(' ') || 'Approved';
  const patterns = extractPatterns(feedback);
  
  saveFeedback('approve', deliverable, feedback, patterns);
  const profile = updateProfile('approve', patterns);
  
  console.log('✅ Approval recorded');
  console.log(`   Total approvals: ${profile.approvals}`);
  console.log(`   Patterns detected: ${patterns.join(', ') || 'none'}`);
  
} else if (command === 'reject') {
  const deliverable = args[1];
  const feedback = args.slice(2).join(' ') || 'Rejected';
  const patterns = extractPatterns(feedback);
  
  saveFeedback('reject', deliverable, feedback, patterns);
  const profile = updateProfile('reject', patterns);
  
  console.log('❌ Rejection recorded');
  console.log(`   Total rejections: ${profile.rejections}`);
  console.log(`   Patterns detected: ${patterns.join(', ') || 'none'}`);
  
} else if (command === 'revise') {
  const deliverable = args[1];
  const feedback = args.slice(2).join(' ') || 'Needs revision';
  
  saveFeedback('revise', deliverable, feedback, []);
  const profile = updateProfile('revise', []);
  
  console.log('🟡 Revision recorded');
  console.log(`   Total revisions: ${profile.revisions}`);
  
} else if (command === 'stats') {
  showStats();
  
} else {
  console.log('🎓 Learning Tracker - Self-Improving Agents');
  console.log('');
  console.log('Usage:');
  console.log('  node scripts/learning-tracker.mjs approve <path> "Great! Concise and actionable"');
  console.log('  node scripts/learning-tracker.mjs reject <path> "Too long, needs data"');
  console.log('  node scripts/learning-tracker.mjs revise <path> "Fix the UI layout"');
  console.log('  node scripts/learning-tracker.mjs stats');
  console.log('');
  console.log('This tracks your feedback to improve agent prompts automatically.');
}
