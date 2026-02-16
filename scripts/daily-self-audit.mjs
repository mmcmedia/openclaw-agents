#!/usr/bin/env node
/**
 * Daily Markdown Self-Audit
 * Reads all system files, checks for contradictions, staleness, bloat, duplicates.
 * Usage: node scripts/daily-self-audit.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

const BASE = '/Users/mmcassistant/clawd';
const REPORT_DIR = `${BASE}/reports`;
const envFile = readFileSync('/Users/mmcassistant/.clawdbot/.env', 'utf8');
const OPENAI_API_KEY = envFile.split('\n').find(l => l.startsWith('OPENAI_API_KEY='))?.split('=')[1]?.trim();
if (!OPENAI_API_KEY) { console.error('No OPENAI_API_KEY found'); process.exit(1); }

const FILES = [
  'AGENTS.md', 'TOOLS.md', 'MEMORY.md', 'HEARTBEAT.md', 'PINNED.md',
  'SESSION_STATE.md', 'SOUL.md', 'IDENTITY.md', 'USER.md', 'LESSONS_LEARNED.md',
];

async function chat(messages, maxTokens = 4000) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-5-mini', messages, max_completion_tokens: maxTokens }),
  });
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response';
}

async function main() {
  console.log('🔍 Daily Self-Audit — Reading system files...');
  
  let allContent = '';
  const fileSizes = [];
  
  for (const file of FILES) {
    const path = `${BASE}/${file}`;
    try {
      const content = readFileSync(path, 'utf8');
      const lines = content.split('\n').length;
      const bytes = Buffer.byteLength(content);
      fileSizes.push({ file, lines, bytes });
      // Truncate very large files to avoid token limits
      const truncated = content.length > 8000 ? content.slice(0, 8000) + '\n...[TRUNCATED]' : content;
      allContent += `\n\n=== ${file} (${lines} lines, ${bytes} bytes) ===\n${truncated}`;
      console.log(`  ✅ ${file}: ${lines} lines, ${(bytes/1024).toFixed(1)}KB`);
    } catch (e) {
      console.log(`  ⚠️ ${file}: not found`);
      fileSizes.push({ file, lines: 0, bytes: 0, missing: true });
    }
  }
  
  console.log('\n🧠 Analyzing with gpt-5-mini...');
  
  const audit = await chat([
    { role: 'system', content: `You are a system files auditor for an AI assistant named Maria. Your job is to review all her workspace configuration files and find issues. Be specific — cite exact file names, line references, and quote the problematic text.

Categories to check:
1. **CONTRADICTIONS** — File A says X but File B says Y
2. **STALE INFO** — References to things that are likely outdated (old dates, deprecated tools, completed tasks still listed as active)
3. **BLOAT** — Sections that are too long or contain unnecessary detail for their purpose
4. **DUPLICATES** — Same information repeated across multiple files
5. **MISSING** — Important things that should be documented but aren't (based on references in other files)
6. **FORMATTING** — Broken markdown, inconsistent structure

For each issue found, provide:
- Severity: 🔴 HIGH / 🟡 MEDIUM / 🔵 LOW
- File(s) affected
- What's wrong (quote the text)
- Suggested fix

End with a HEALTH SCORE (0-100) and summary.` },
    { role: 'user', content: `Audit these system files:\n${allContent}` },
  ]);
  
  const today = new Date().toISOString().split('T')[0];
  
  // File size summary
  const sizeTable = fileSizes.map(f => 
    `| ${f.file} | ${f.missing ? 'MISSING' : f.lines} | ${f.missing ? '-' : (f.bytes/1024).toFixed(1) + 'KB'} | ${f.bytes > 15000 ? '⚠️ LARGE' : f.missing ? '❌' : '✅'} |`
  ).join('\n');
  
  const report = `# Self-Audit Report — ${today}

## 📏 File Sizes
| File | Lines | Size | Status |
|------|-------|------|--------|
${sizeTable}

## 🔍 Audit Findings
${audit}

---
*Generated: ${new Date().toISOString()} | Model: gpt-5-mini*
`;
  
  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const outPath = `${REPORT_DIR}/self-audit-${today}.md`;
  writeFileSync(outPath, report);
  console.log(`\n✅ Report saved: ${outPath}`);
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
