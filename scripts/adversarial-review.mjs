#!/usr/bin/env node
/**
 * Adversarial Review Agent
 * Runs a Haiku fact-check/quality review on any deliverable.
 * Usage: node scripts/adversarial-review.mjs <file-to-review> [review-type]
 * Review types: research, content, code, etsy, story, general
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { basename, dirname } from 'path';

const envFile = readFileSync('/Users/mmcassistant/.clawdbot/.env', 'utf8');
const OPENAI_API_KEY = envFile.split('\n').find(l => l.startsWith('OPENAI_API_KEY='))?.split('=')[1]?.trim();
if (!OPENAI_API_KEY) { console.error('No OPENAI_API_KEY found'); process.exit(1); }

const FILE = process.argv[2];
const TYPE = process.argv[3] || 'general';

if (!FILE) {
  console.error('Usage: node adversarial-review.mjs <file> [research|content|code|etsy|story|general]');
  process.exit(1);
}

const REVIEW_PROMPTS = {
  research: `You are a skeptical research fact-checker. Your job is to find:
- Claims without evidence or sources
- Outdated information (check if dates/trends are current)
- Hallucinated statistics or made-up data
- Logical leaps or unsupported conclusions
- Missing important context or caveats
Be specific. Quote the problematic text. Rate confidence: HIGH/MEDIUM/LOW for each finding.`,

  content: `You are a senior content editor reviewing a blog post draft. Check for:
- Factual errors or questionable claims
- AI-sounding phrases ("delve into", "it's important to note", "in today's fast-paced world")
- SEO issues (keyword stuffing, thin sections, missing structure)
- Tone inconsistencies
- Missing practical value (is this actually helpful to the reader?)
Be specific and actionable.`,

  code: `You are a senior code reviewer. Check for:
- Bugs and logic errors
- Security vulnerabilities (exposed secrets, injection, XSS)
- Performance issues (N+1 queries, memory leaks, blocking calls)
- Missing error handling
- Does it actually do what was requested?
- Edge cases not handled
Be specific — cite line numbers and suggest fixes.`,

  etsy: `You are an Etsy listing optimization expert. Check for:
- Title: Are primary keywords front-loaded? Under 140 chars?
- Tags: All 13 used? Mix of long-tail and broad? No wasted duplicates?
- Description: Clear value prop? Formatting scannable? Call to action?
- Pricing: Reasonable for the niche?
- Images described: Would they stand out in search results?
Be specific and compare to best practices.`,

  story: `You are a children's book editor and content safety reviewer. Check for:
- Age-appropriateness for the target range
- AI tells: "as if", "seemed to", "felt a wave of", "couldn't help but"
- Pacing issues (scenes that drag, rushed endings)
- Character consistency (do voices stay distinct?)
- Repetitive descriptions or sentence patterns
- Any content that might concern parents (violence, fear, mature themes)
- Plot holes or logical issues
Rate overall quality 1-100 and flag specific passages.`,

  general: `You are a critical reviewer. Find:
- Errors, inconsistencies, or questionable claims
- Quality issues
- Missing information
- Anything that could be improved
Be specific and constructive.`,
};

async function chat(messages, maxTokens = 4000) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-5-mini', messages, max_completion_tokens: maxTokens }),
  });
  const data = await res.json();
  const usage = data.usage || {};
  const cost = (usage.prompt_tokens || 0) * 0.25 / 1e6 + (usage.completion_tokens || 0) * 2.0 / 1e6;
  return { content: data.choices?.[0]?.message?.content || 'No response', cost };
}

async function main() {
  const content = readFileSync(FILE, 'utf8');
  const truncated = content.length > 30000 ? content.slice(0, 30000) + '\n\n...[TRUNCATED — file too large for single review pass]' : content;
  
  console.log(`🔍 Adversarial Review: ${basename(FILE)}`);
  console.log(`   Type: ${TYPE}`);
  console.log(`   Size: ${content.length} chars (${content.split(/\s+/).length} words)`);
  console.log(`   Reviewing...`);
  
  const systemPrompt = REVIEW_PROMPTS[TYPE] || REVIEW_PROMPTS.general;
  
  const { content: review, cost } = await chat([
    { role: 'system', content: systemPrompt + '\n\nEnd your review with:\n## VERDICT\n- PASS ✅ (minor issues only, ship it)\n- REVISE 🟡 (fixable issues, needs another pass)\n- REJECT 🔴 (fundamental problems, needs major rework)\n\nAnd a quality score: X/100' },
    { role: 'user', content: `Review this ${TYPE} deliverable:\n\n${truncated}` },
  ]);
  
  // Save review alongside the file
  const reviewPath = FILE.replace(/(\.[^.]+)$/, '-REVIEW$1');
  const report = `# Adversarial Review: ${basename(FILE)}
**Type:** ${TYPE}
**Reviewed:** ${new Date().toISOString()}
**Cost:** $${cost.toFixed(4)}

${review}
`;
  
  writeFileSync(reviewPath, report);
  
  // Extract verdict
  const verdictMatch = review.match(/(?:PASS|REVISE|REJECT)/);
  const scoreMatch = review.match(/(\d+)\/100/);
  const verdict = verdictMatch ? verdictMatch[0] : 'UNKNOWN';
  const score = scoreMatch ? scoreMatch[1] : '??';
  
  console.log(`\n📋 Verdict: ${verdict} (${score}/100)`);
  console.log(`💰 Cost: $${cost.toFixed(4)}`);
  console.log(`📁 Review saved: ${reviewPath}`);
  
  // Return exit code based on verdict
  if (verdict === 'REJECT') process.exit(2);
  if (verdict === 'REVISE') process.exit(1);
  process.exit(0); // PASS
}

main().catch(e => { console.error('Fatal:', e); process.exit(3); });
