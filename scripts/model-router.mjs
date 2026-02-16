#!/usr/bin/env node
/**
 * Smart Model Router
 * Routes tasks to the cheapest capable model automatically
 * 
 * Usage: node scripts/model-router.mjs "task description"
 *        node scripts/model-router.mjs --file task.md
 * 
 * Models (cost per 1M tokens):
 * - Haiku: $0.25 (simple tasks)
 * - Kimi: $0.50 (coding, analysis)
 * - Sonnet: $15 (standard work)
 * - Codex: $20 (complex coding)
 * - Opus: $75 (strategic, novel)
 */

import { readFileSync } from 'fs';

// Model pricing (per 1M tokens)
const MODELS = {
  haiku: { name: 'anthropic/claude-3-5-haiku-latest', cost: 0.25, maxOutput: 8192 },
  kimi: { name: 'moonshot/kimi-k2.5', cost: 0.50, maxOutput: 8192 },
  sonnet: { name: 'anthropic/claude-sonnet-4-5', cost: 15, maxOutput: 8192 },
  codex: { name: 'openai-codex/gpt-5.2-codex', cost: 20, maxOutput: 8192 },
  opus: { name: 'anthropic/claude-opus-4-6', cost: 75, maxOutput: 8192 }
};

// Routing rules based on task characteristics
function analyzeTask(task) {
  const lower = task.toLowerCase();
  const score = {
    complexity: 0,
    coding: 0,
    creativity: 0,
    length: task.length
  };
  
  // Complexity indicators
  const complexTerms = ['architecture', 'design', 'strategy', 'novel', 'complex', 'multi-step', 'integration'];
  complexTerms.forEach(term => {
    if (lower.includes(term)) score.complexity += 2;
  });
  
  // Coding indicators
  const codeTerms = ['build', 'create', 'implement', 'function', 'component', 'api', 'script', 'debug'];
  codeTerms.forEach(term => {
    if (lower.includes(term)) score.coding += 1;
  });
  
  // Creativity/strategy indicators
  const creativeTerms = ['design', 'strategy', 'novel', 'unique', 'creative', 'research'];
  creativeTerms.forEach(term => {
    if (lower.includes(term)) score.creativity += 1;
  });
  
  // Simple task indicators (reduce complexity)
  const simpleTerms = ['edit', 'update', 'fix typo', 'rename', 'lookup', 'list', 'check'];
  simpleTerms.forEach(term => {
    if (lower.includes(term)) score.complexity -= 2;
  });
  
  return score;
}

function routeModel(score, task) {
  const lines = (task.match(/\n/g) || []).length;
  const words = task.split(/\s+/).length;
  
  // Strategic/Novel problems: Opus (check first for high complexity)
  if (score.creativity >= 3 || score.complexity >= 5 || 
      task.includes('orchestration') || task.includes('distributed') || 
      task.includes('architecture design') || task.includes('novel approach')) {
    return {
      model: 'opus',
      confidence: score.complexity >= 5 ? 'high' : 'medium',
      reasoning: 'Strategic or novel problem requiring deep reasoning and architecture',
      estimatedCost: '~$2.00',
      alternative: 'sonnet'
    };
  }
  
  // Complex coding: Codex (architecture, multi-file, complex systems)
  if (score.coding >= 3 && score.complexity >= 3) {
    return {
      model: 'codex',
      confidence: 'high',
      reasoning: 'Complex coding: architecture, multi-file changes, or system design',
      estimatedCost: '~$0.50',
      alternative: 'sonnet'
    };
  }
  
  // Standard coding: Kimi
  if (score.coding >= 2 && score.complexity < 3) {
    return {
      model: 'kimi',
      confidence: 'high',
      reasoning: 'Coding task with clear requirements, moderate complexity',
      estimatedCost: '~$0.05',
      alternative: 'sonnet'
    };
  }
  
  // Simple tasks: Haiku
  if (score.complexity <= 0 && words < 100 && lines < 10) {
    return {
      model: 'haiku',
      confidence: 'high',
      reasoning: 'Simple task: file edits, lookups, or basic research under 100 words',
      estimatedCost: '~$0.01',
      alternative: 'kimi'
    };
  }
  
  // Default: Sonnet
  return {
    model: 'sonnet',
    confidence: 'medium',
    reasoning: 'Standard work: features, content, analysis with some judgment required',
    estimatedCost: '~$0.30',
    alternative: 'kimi'
  };
}

function formatResult(result) {
  const model = MODELS[result.model];
  return {
    recommendedModel: result.model,
    modelId: model.name,
    confidence: result.confidence,
    reasoning: result.reasoning,
    estimatedCost: result.estimatedCost,
    costPer1M: `$${model.cost}`,
    alternative: result.alternative,
    maxOutputTokens: model.maxOutput
  };
}

// Main
const args = process.argv.slice(2);
let taskText = '';

if (args.includes('--file')) {
  const fileIndex = args.indexOf('--file') + 1;
  if (fileIndex < args.length) {
    taskText = readFileSync(args[fileIndex], 'utf8');
  }
} else if (args.length > 0) {
  taskText = args.join(' ');
} else {
  console.error('Usage: node scripts/model-router.mjs "task description"');
  console.error('       node scripts/model-router.mjs --file task.md');
  process.exit(1);
}

const score = analyzeTask(taskText);
const route = routeModel(score, taskText);
const result = formatResult(route);

console.log('🎯 Smart Model Router');
console.log('='.repeat(50));
console.log('');
console.log(`Recommended: ${result.recommendedModel} (${result.modelId})`);
console.log(`Confidence: ${result.confidence}`);
console.log(`Estimated cost: ${result.estimatedCost} (${result.costPer1M} per 1M tokens)`);
console.log(`Max output: ${result.maxOutputTokens} tokens`);
console.log('');
console.log('Reasoning:');
console.log(`  ${result.reasoning}`);
console.log('');
console.log(`Alternative: ${result.alternative}`);
console.log('');

// Output JSON for programmatic use
console.log('JSON output:');
console.log(JSON.stringify(result, null, 2));

// Exit with recommendation
process.exit(0);
