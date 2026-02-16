#!/usr/bin/env node
/**
 * Business Meta-Analysis Council — Daily Brief
 * Pulls GA4 data for top 5 sites, feeds to 3 AI council members, produces actionable brief.
 * Usage: node scripts/daily-council.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';

// Load API key
const envFile = readFileSync('/Users/mmcassistant/.clawdbot/.env', 'utf8');
const OPENAI_API_KEY = envFile.split('\n').find(l => l.startsWith('OPENAI_API_KEY='))?.split('=')[1]?.trim();
if (!OPENAI_API_KEY) { console.error('No OPENAI_API_KEY found'); process.exit(1); }

const GA4_SCRIPT = '/Users/mmcassistant/clawd/skills/ga4-analytics/scripts/query-ga4.mjs';
const REPORT_DIR = '/Users/mmcassistant/clawd/reports';
const PROPERTIES = [
  { name: 'Moms Make Cents', id: '352646496' },
  { name: 'Hello Hayley', id: '361561956' },
  { name: 'Melrose Family', id: '312388993' },
  { name: 'We Heart This', id: '347579229' },
  { name: 'Today Mommy', id: '352650803' },
];

function queryGA4(propertyId, startDate, endDate) {
  try {
    const cmd = `node ${GA4_SCRIPT} --property ${propertyId} --metrics sessions,screenPageViews --startDate ${startDate} --endDate ${endDate}`;
    return execSync(cmd, { encoding: 'utf8', timeout: 30000 }).trim();
  } catch (e) {
    return `Error querying ${propertyId}: ${e.message}`;
  }
}

function daysAgo(n) {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

async function chat(messages, maxTokens = 2000) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-5-mini', messages, max_completion_tokens: maxTokens }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response';
}

async function main() {
  console.log('📊 Business Meta-Analysis Council — Gathering data...');
  
  const yesterday = daysAgo(1);
  const weekAgo = daysAgo(7);
  const monthAgo = daysAgo(30);
  
  let dataReport = '';
  for (const prop of PROPERTIES) {
    console.log(`  Querying ${prop.name}...`);
    const daily = queryGA4(prop.id, yesterday, yesterday);
    const weekly = queryGA4(prop.id, weekAgo, yesterday);
    const monthly = queryGA4(prop.id, monthAgo, yesterday);
    dataReport += `\n### ${prop.name} (${prop.id})\n**Yesterday:** ${daily}\n**Last 7 days:** ${weekly}\n**Last 30 days:** ${monthly}\n`;
  }
  
  console.log('🧠 Convening the council...');
  
  const councilPrompt = `You are analyzing website traffic data for McKinzie's content site portfolio. Here is the data:\n${dataReport}\n\nProvide your analysis in your assigned role. Be specific, cite numbers, and give ONE actionable recommendation. Max 150 words.`;
  
  const [growth, revenue, ops] = await Promise.all([
    chat([
      { role: 'system', content: 'You are the Growth Strategist. You look for emerging opportunities, traffic trends, and growth signals. What sites are trending up? What channels are working? Where should McKinzie double down?' },
      { role: 'user', content: councilPrompt },
    ]),
    chat([
      { role: 'system', content: 'You are the Revenue Guardian. You look for red flags, declining traffic, at-risk revenue streams. What sites are losing traffic? What needs urgent attention? What could break?' },
      { role: 'user', content: councilPrompt },
    ]),
    chat([
      { role: 'system', content: 'You are the Operations Optimizer. Given limited time (4-5 hours today), what should McKinzie focus on for maximum impact? Prioritize ruthlessly. She has 3 kids and homeschools — time is her scarcest resource.' },
      { role: 'user', content: councilPrompt },
    ]),
  ]);
  
  // Final synthesis
  const synthesis = await chat([
    { role: 'system', content: 'You are the council moderator. Synthesize 3 perspectives into ONE brief (max 200 words). Start with the single most important thing, then 2-3 bullet points. End with "Today\'s #1 priority: [specific action]". Be direct, no fluff.' },
    { role: 'user', content: `Growth Strategist says:\n${growth}\n\nRevenue Guardian says:\n${revenue}\n\nOperations Optimizer says:\n${ops}` },
  ]);
  
  const today = new Date().toISOString().split('T')[0];
  const report = `# Daily Business Council — ${today}

## 📊 Data Summary
${dataReport}

## 🧠 Council Analysis

### 🚀 Growth Strategist
${growth}

### 🛡️ Revenue Guardian
${revenue}

### ⚡ Operations Optimizer
${ops}

## 🎯 Council Synthesis
${synthesis}

---
*Generated: ${new Date().toISOString()} | Model: gpt-5-mini | Cost: ~$0.01*
`;
  
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const outPath = `${REPORT_DIR}/daily-council-${today}.md`;
  writeFileSync(outPath, report);
  console.log(`✅ Report saved: ${outPath}`);
  console.log('\n' + synthesis);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
