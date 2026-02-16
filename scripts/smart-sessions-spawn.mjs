#!/usr/bin/env node
/**
 * Smart Sessions Spawn
 * Drop-in replacement for sessions_spawn with automatic model routing
 * 
 * Usage: Import instead of sessions_spawn:
 *   import { smartSpawn } from './scripts/smart-sessions-spawn.mjs';
 * 
 * Or use the global override (at top of file):
 *   import './scripts/smart-sessions-spawn.mjs';
 *   // Now sessions_spawn calls are automatically routed
 */

import { sessions_spawn } from '@openclaw/sdk';
import { getModelForTask } from '../projects/vps-automation/model-router.mjs';

const LOG_FILE = '/tmp/smart-spawn.log';
const ENABLE_ROUTING = true; // Set to false to disable

/**
 * Smart spawn with automatic model routing
 * @param {Object} options - sessions_spawn options
 * @param {string} options.task - The task description (used for routing)
 * @param {string} [options.model] - Optional: force specific model
 * @param {...any} rest - Other sessions_spawn options
 */
export async function smartSpawn(options) {
  // If model is explicitly specified, respect it
  if (options.model && !ENABLE_ROUTING) {
    return sessions_spawn(options);
  }

  // Determine optimal model based on task
  const task = options.task || options.message || '';
  const routing = getModelForTask(task);
  
  // Log the routing decision
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp} | ${routing.model} | ${task.slice(0, 60)}...\n`;
  
  try {
    const fs = await import('fs');
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (e) {
    // Silent fail for logging
  }

  // Only override if no model specified or routing recommends cheaper
  const finalModel = options.model || routing.model;
  
  if (finalModel !== options.model) {
    console.log(`🎯 SmartSpawn: ${options.model || 'default'} → ${finalModel.split('/').pop()}`);
    console.log(`   (${routing.reasoning})`);
  }

  // Call actual sessions_spawn with routed model
  return sessions_spawn({
    ...options,
    model: finalModel,
    _routing: routing // Attach for debugging
  });
}

/**
 * Quick spawn helper - one-liner for simple tasks
 * @param {string} task - Task description
 * @param {Object} [options] - Additional options
 */
export function spawnTask(task, options = {}) {
  return smartSpawn({
    task,
    ...options
  });
}

/**
 * Spawn with specific agent type shortcuts
 */
export const spawners = {
  // Quick research tasks → Haiku (cheapest)
  research: (query, options = {}) => smartSpawn({
    task: `Research: ${query}`,
    model: 'anthropic/claude-3-5-haiku-latest',
    ...options
  }),

  // Content tasks → Sonnet (balanced)
  content: (task, options = {}) => smartSpawn({
    task,
    model: 'anthropic/claude-sonnet-4-5',
    ...options
  }),

  // Coding tasks → Codex
  code: (task, options = {}) => smartSpawn({
    task,
    model: 'openai-codex/gpt-5.2-codex',
    ...options
  }),

  // Strategy tasks → Opus (best)
  strategy: (task, options = {}) => smartSpawn({
    task,
    model: 'anthropic/claude-opus-4-6',
    ...options
  })
};

// Export for easy importing
export default smartSpawn;

// Re-export original for bypass
export { sessions_spawn as rawSpawn };