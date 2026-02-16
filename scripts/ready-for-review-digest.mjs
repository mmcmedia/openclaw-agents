#!/usr/bin/env node
/**
 * Ready for Review Digest
 * Scans all work streams and reports what's blocked on McKinzie's input
 * Runs daily at 8:00 AM MT
 */

import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const DIGEST_HOUR = 8; // 8:00 AM MT

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 1. Scan Kanban for tasks waiting on McKinzie
function scanKanban() {
  const items = [];
  
  try {
    const cardsPath = '/Users/mmcassistant/clawd/dashboard/data/cards.json';
    if (!existsSync(cardsPath)) return items;
    
    const cards = JSON.parse(readFileSync(cardsPath, 'utf8'));
    
    // Find cards that are likely waiting on McKinzie
    const waitingCards = cards.filter(card => {
      // Cards with specific notes about waiting
      const waitingKeywords = ['waiting', 'blocked', 'needs review', 'needs approval', 
        'mcKinzie to', 'your pick', 'your review', 'screenshots', 'select'];
      
      const hasWaitingNote = waitingKeywords.some(kw => 
        (card.notes || '').toLowerCase().includes(kw) ||
        (card.description || '').toLowerCase().includes(kw)
      );
      
      // Cards in inprogress for too long (stale)
      const isStale = card.column === 'inprogress' && card.updatedAt && 
        (Date.now() - new Date(card.updatedAt).getTime()) > 7 * 24 * 60 * 60 * 1000;
      
      // Cards assigned to McKinzie directly
      const assignedToMcKinzie = card.assignee === 'McKinzie' || 
        (card.description || '').toLowerCase().includes('mckinzie');
      
      return hasWaitingNote || isStale || assignedToMcKinzie;
    });
    
    waitingCards.forEach(card => {
      items.push({
        source: 'Kanban',
        item: card.title,
        id: card.id,
        action: extractAction(card),
        priority: card.priority,
        daysWaiting: card.updatedAt ? 
          Math.floor((Date.now() - new Date(card.updatedAt).getTime()) / (24 * 60 * 60 * 1000)) : null
      });
    });
    
  } catch (e) {
    console.error('Error scanning kanban:', e.message);
  }
  
  return items;
}

function extractAction(card) {
  // Extract the next action from description
  const desc = card.description || '';
  
  if (desc.includes('NEXT:')) {
    return desc.split('NEXT:')[1].split('\n')[0].trim();
  }
  if (desc.includes('screenshot')) return 'Create screenshots';
  if (desc.includes('review')) return 'Review and approve';
  if (desc.includes('pick') || desc.includes('select')) return 'Make selections';
  if (desc.includes('waiting')) return 'Provide input';
  
  return 'Check and approve';
}

// 2. Check VPS relay for items needing review
function scanVPSRelay() {
  const items = [];
  
  try {
    // Check any-to-maria folder
    const relayCheck = execSync(
      'ssh root@76.13.108.6 "ls -la /home/openclaw/shared-inbox/relay/any-to-maria/*.md 2>/dev/null | wc -l"',
      { encoding: 'utf8', timeout: 10000 }
    ).trim();
    
    const fileCount = parseInt(relayCheck) || 0;
    
    if (fileCount > 0) {
      items.push({
        source: 'VPS Team',
        item: `${fileCount} deliverable(s) ready for review`,
        action: 'Check relay inbox',
        priority: 'medium'
      });
    }
    
  } catch (e) {
    // SSH might fail, that's okay
  }
  
  return items;
}

// 3. Check active projects for deliverables
function scanActiveProjects() {
  const items = [];
  
  // PsalMix QA - screenshots needed
  const psalMixPath = '/Users/mmcassistant/clawd/projects/psalmix';
  if (existsSync(psalMixPath)) {
    items.push({
      source: 'PsalMix',
      item: 'App Store screenshots needed',
      action: 'Create 5-8 app screenshots for store listing',
      priority: 'high'
    });
  }
  
  // TheSunDaisy Easter - concepts ready
  const easterPath = '/Users/mmcassistant/clawd/projects/thesundaisy-easter-research/design-concepts';
  if (existsSync(easterPath)) {
    try {
      const concepts = execSync(`ls ${easterPath}/concept-*.png 2>/dev/null | wc -l`, { encoding: 'utf8' }).trim();
      const count = parseInt(concepts) || 0;
      if (count > 0) {
        items.push({
          source: 'TheSunDaisy Easter',
          item: `${count} Frame TV concepts designed`,
          action: 'Pick 3 favorites → I\'ll generate final art',
          priority: 'high',
          deadline: '9 weeks until Easter (list by March 1)'
        });
      }
    } catch (e) {}
  }
  
  // General Conference materials
  items.push({
    source: 'TheSunDaisy',
    item: 'General Conference 2026 study materials',
    action: 'Create note templates/study guides (480 searches/mo, low competition)',
    priority: 'medium',
    deadline: '7 weeks away (April 4-5)'
  });
  
  return items;
}

// 4. Check for stale reviews (from memory)
function checkStaleReviews() {
  const items = [];
  
  // Read recent memory for pending reviews
  const memoryPath = '/Users/mmcassistant/clawd/memory/2026-02-15.md';
  if (existsSync(memoryPath)) {
    const content = readFileSync(memoryPath, 'utf8');
    
    // Check if DOME testing is pending
    if (content.includes('Pending:** End-to-end testing')) {
      items.push({
        source: 'DOME v5.0',
        item: 'End-to-end pipeline test',
        action: 'Run first book generation with real APIs',
        priority: 'high',
        estimate: '10-15 minutes'
      });
    }
  }
  
  return items;
}

// Generate and send digest
function generateDigest() {
  log('📋 Scanning for items waiting on your input...\n', 'bright');
  
  const kanbanItems = scanKanban();
  const vpsItems = scanVPSRelay();
  const projectItems = scanActiveProjects();
  const staleItems = checkStaleReviews();
  
  const allItems = [...kanbanItems, ...vpsItems, ...projectItems, ...staleItems];
  
  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  allItems.sort((a, b) => (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2));
  
  if (allItems.length === 0) {
    log('✅ Nothing waiting on you right now!', 'green');
    return;
  }
  
  log(`Found ${allItems.length} item(s) waiting on your input:\n`, 'blue');
  
  allItems.forEach((item, i) => {
    const priorityColor = item.priority === 'high' || item.priority === 'critical' ? 'red' : 
                          item.priority === 'medium' ? 'yellow' : 'green';
    
    log(`${i + 1}. ${item.item}`, 'bright');
    log(`   Source: ${item.source}`, priorityColor);
    log(`   Action: ${item.action}`, 'reset');
    if (item.deadline) log(`   Deadline: ${item.deadline}`, 'magenta');
    if (item.estimate) log(`   Time: ${item.estimate}`, 'reset');
    if (item.daysWaiting) log(`   Waiting: ${item.daysWaiting} days`, 'yellow');
    console.log('');
  });
  
  // Summary stats
  const highPriority = allItems.filter(i => i.priority === 'high' || i.priority === 'critical').length;
  if (highPriority > 0) {
    log(`⚠️  ${highPriority} high priority item(s) need attention`, 'red');
  }
  
  return allItems;
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDigest();
}

export { generateDigest, scanKanban, scanVPSRelay, scanActiveProjects };
