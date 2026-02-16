#!/usr/bin/env node
/**
 * Cost Tracker - Real-time Model Usage & Spend
 * Tracks API costs across all agent usage
 * 
 * Usage: node scripts/cost-tracker.mjs [options]
 * Options:
 *   --today     Show today's spend
 *   --week      Show this week's spend
 *   --month     Show this month's spend
 *   --budget    Set monthly budget (reads from env)
 *   --alert     Check if approaching budget limit
 */

import { readFileSync, existsSync, writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

const LOG_FILE = join(process.cwd(), 'projects', 'costs', 'usage-log.jsonl');
const BUDGET_FILE = join(process.cwd(), 'projects', 'costs', 'monthly-budget.json');

// Model pricing (per 1M input/output tokens)
const PRICING = {
  'anthropic/claude-haiku-4': { input: 0.25, output: 1.25 },
  'anthropic/claude-3-5-haiku-latest': { input: 0.25, output: 1.25 },
  'moonshot/kimi-k2.5': { input: 0.50, output: 0.50 },
  'anthropic/claude-sonnet-4-5': { input: 3.00, output: 15.00 },
  'openai-codex/gpt-5.2-codex': { input: 5.00, output: 15.00 },
  'anthropic/claude-opus-4-6': { input: 15.00, output: 75.00 }
};

function loadUsage() {
  if (!existsSync(LOG_FILE)) {
    return [];
  }
  
  const lines = readFileSync(LOG_FILE, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  
  return lines;
}

function calculateCost(usage) {
  const model = usage.model || usage.modelId || 'unknown';
  const pricing = PRICING[model] || { input: 10, output: 30 }; // Default high to encourage proper tracking
  
  const inputTokens = usage.inputTokens || usage.input_tokens || 0;
  const outputTokens = usage.outputTokens || usage.output_tokens || 0;
  
  const inputCost = (inputTokens / 1000000) * pricing.input;
  const outputCost = (outputTokens / 1000000) * pricing.output;
  
  return {
    input: inputCost,
    output: outputCost,
    total: inputCost + outputCost,
    model
  };
}

function getBudget() {
  if (!existsSync(BUDGET_FILE)) {
    return { monthly: 500, alertThreshold: 0.8 }; // Default $500/month
  }
  
  try {
    return JSON.parse(readFileSync(BUDGET_FILE, 'utf8'));
  } catch {
    return { monthly: 500, alertThreshold: 0.8 };
  }
}

function formatCurrency(amount) {
  return `$${amount.toFixed(4)}`;
}

// Parse arguments
const args = process.argv.slice(2);
const showToday = args.includes('--today');
const showWeek = args.includes('--week');
const showMonth = args.includes('--month');
const checkAlert = args.includes('--alert');

console.log('💰 Cost Tracker - Model Usage Dashboard');
console.log('='.repeat(60));

const usage = loadUsage();
const budget = getBudget();

if (usage.length === 0) {
  console.log('\n📊 No usage data yet.');
  console.log('Usage will be logged automatically when agents run.');
  process.exit(0);
}

// Calculate totals
let totalCost = 0;
const byModel = {};
const byDay = {};

usage.forEach(entry => {
  const cost = calculateCost(entry);
  totalCost += cost.total;
  
  // By model
  if (!byModel[cost.model]) {
    byModel[cost.model] = { cost: 0, calls: 0, input: 0, output: 0 };
  }
  byModel[cost.model].cost += cost.total;
  byModel[cost.model].calls += 1;
  byModel[cost.model].input += entry.inputTokens || 0;
  byModel[cost.model].output += entry.outputTokens || 0;
  
  // By day
  const date = entry.timestamp?.split('T')[0] || 'unknown';
  if (!byDay[date]) {
    byDay[date] = 0;
  }
  byDay[date] += cost.total;
});

// Display summary
console.log(`\n📈 Total Spend: ${formatCurrency(totalCost)}`);
console.log(`💵 Monthly Budget: $${budget.monthly}`);
console.log(`📊 Budget Used: ${((totalCost / budget.monthly) * 100).toFixed(1)}%`);

// Alert check
if (checkAlert && totalCost > budget.monthly * budget.alertThreshold) {
  console.log('\n🚨 ALERT: Approaching budget limit!');
  console.log(`   Current: ${formatCurrency(totalCost)} / $${budget.monthly}`);
}

// By model breakdown
console.log('\n📊 By Model:');
console.log('-'.repeat(60));
Object.entries(byModel)
  .sort((a, b) => b[1].cost - a[1].cost)
  .forEach(([model, stats]) => {
    const shortName = model.split('/').pop();
    console.log(`${shortName.padEnd(30)} ${formatCurrency(stats.cost).padStart(10)} (${stats.calls} calls)`);
  });

// Daily breakdown (last 7 days)
console.log('\n📅 Last 7 Days:');
console.log('-'.repeat(60));
const sortedDays = Object.entries(byDay)
  .sort((a, b) => b[0].localeCompare(a[0]))
  .slice(0, 7);

sortedDays.forEach(([date, cost]) => {
  console.log(`${date} ${formatCurrency(cost).padStart(15)}`);
});

// Recommendations
console.log('\n💡 Recommendations:');
const expensiveModels = Object.entries(byModel)
  .filter(([_, stats]) => stats.cost > 5)
  .sort((a, b) => b[1].cost - a[1].cost);

if (expensiveModels.length > 0) {
  console.log('   High-cost models detected:');
  expensiveModels.forEach(([model, stats]) => {
    const shortName = model.split('/').pop();
    console.log(`   - ${shortName}: ${formatCurrency(stats.cost)} — consider routing to cheaper model`);
  });
} else {
  console.log('   ✅ Cost profile looks good');
}

console.log('');

// Save summary
const summary = {
  timestamp: new Date().toISOString(),
  totalCost,
  budgetUsed: totalCost / budget.monthly,
  byModel,
  byDay: Object.fromEntries(sortedDays)
};

const summaryFile = join(process.cwd(), 'projects', 'costs', 'latest-summary.json');
writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
console.log(`📁 Summary saved: ${summaryFile}`);
