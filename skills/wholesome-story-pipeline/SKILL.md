# Wholesome Story Pipeline Skill

Generate full children's novels from seed files using the proven Creek pipeline approach.

## Overview

This is the **Creek pipeline** — the approach that produced the best stories (Library Cat, Puddle) at the lowest cost. The key insight: **trust the AI to tell a story naturally, then polish once at the end.** No quality loops during generation, no critique passes, no complex feedback cycles.

## Pipeline Phases

| Phase | Model | Purpose | Cost/Chapter |
|-------|-------|---------|-------------|
| 1. EXPAND | GPT-5.2 | Seed → 4,500-5,000 words full prose | ~$0.07 |
| 2. EDIT | GPT-5-mini | One polish pass (90-100% retention) | ~$0.01 |
| 3. ASSEMBLE | Local | Stitch edited chapters → clean markdown | Free |

**Total cost:** ~$0.08/chapter, ~$0.50 for a 6-chapter story, ~$1.80 for a 23-chapter novel.

## Prerequisites

- OpenAI API key in `/projects/wholesome-library-2026/generation/.env` (OPENAI_API_KEY)
- Seed file with `## Chapter` headers (each chapter = 100-1500 word outline)
- Python 3 available

## Usage

### Quick Run (Single Story)
```bash
cd /Users/mmcassistant/clawd/projects/wholesome-library-2026/generation
nohup python3 -u run-story.py <seed-file> <output-prefix> > /tmp/<name>-expansion.log 2>&1 &
```

**IMPORTANT:** Always use `nohup` to prevent process death from exec timeouts.

### Examples
```bash
# Novel-length (23 chapters, ~2 hours)
nohup python3 -u run-story.py seeds/seed-frequency-full.md frequency > /tmp/frequency.log 2>&1 &

# Short story (6 chapters, ~30 min)
nohup python3 -u run-story.py fresh-seeds/seed-02.md clockwork-sparrow > /tmp/clockwork.log 2>&1 &
```

### Monitor Progress
```bash
tail -f /tmp/<name>-expansion.log
# Or check output files:
ls -lh <output-prefix>-ch*-expanded.md  # Phase 1 outputs
ls -lh <output-prefix>-ch*-edited.md    # Phase 2 outputs
ls -lh <output-prefix>-final-clean.md   # Phase 3 output
```

### Check Completion
```bash
# Word count of final output
wc -w <output-prefix>-final-clean.md

# AI tell count (lower = better, target <20 for full novel)
grep -ciE 'as if|as though|seemed to|felt a |couldn.t help but|found herself|found himself|washed over|settled over' <output-prefix>-final-clean.md
```

## Seed File Format

Seeds must have this structure:
```markdown
# Story Title

**Characters/metadata at top (optional)**

## Chapter 1: Title
Outline text (100-1500 words describing what happens)

## Chapter 2: Title  
Outline text...

## Chapter 3: Title
Outline text...
```

The script parses `## Chapter` headers. Everything before the first chapter header becomes the story context/header passed to GPT-5.2.

## Seed Sources

| Location | Description |
|----------|-------------|
| `generation/seeds/` | Novel-length seeds (The Frequency, etc.) |
| `generation/fresh-seeds/` | Short story seeds (5 stories, 6 chapters each) |
| `generation/batch1/` | Batch 1 seeds (Puddle, Window, Birds, Chalk, Tree) |

## Pipeline Script Details

**Script:** `generation/run-story.py`

### Phase 1: EXPAND (GPT-5.2)
- Each seed chapter → ~4,500-5,000 words of full novel prose
- Feeds previous chapter ending for continuity
- Rules baked into prompt: distinct character voices, show-don't-tell, varied pacing, concrete stakes
- Max tokens: 16,000 per chapter
- Skip logic: won't re-expand if output file already exists with >500 bytes
- Automatic retry on short outputs (<50 words)

### Phase 2: EDIT (GPT-5-mini)  
- One pass: structural + prose polish
- Aggressive AI tell removal (as if, seemed to, felt a, etc.)
- 90-100% word retention target — polish, NOT rewrite
- Fixes pacing, echo words, weak verbs, body language variety
- Skip logic: won't re-edit if edited file already exists

### Phase 3: ASSEMBLE
- Stitches all edited chapters (falls back to expanded if no edit)
- Strips changelog artifacts
- Cleans excessive newlines
- Outputs: `<prefix>-final-clean.md`
- Reports: final word count, AI tell count, total cost

## Key Rules (DO NOT CHANGE)

1. **Use `run-story.py` — NOT `run-story-option4.py`** (Option 4 adds complexity without quality improvement)
2. **GPT-5.2 for expansion, GPT-5-mini for editing** (never GPT-4o, it's deprecated)
3. **Always use `nohup`** for background execution
4. **Trust then polish** — no quality loops during generation
5. **One edit pass is enough** — multiple micro-edits make things worse

## Post-Pipeline Steps

After the pipeline produces `<prefix>-final-clean.md`:

1. **Polish Pipeline** (optional): `cd polish-pipeline && ./batch-polish.sh` — triple helix editor for final quality pass
2. **Cover Generation**: `scripts/generate-cover.sh` — Nano Banana cover art
3. **Upload to Supabase**: `scripts/upload-story.mjs` — publish to Wholesome Library
4. **McKinzie Review**: Move to `review-queue/pending/` for approval

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Process dies mid-run | Restart with same args — skip logic resumes from last completed chapter |
| Short chapter output (<200w) | Script auto-retries once; if still short, check API quota |
| High AI tell count in final | Run polish pipeline for aggressive cleanup |
| Cost seems high | Check if GPT-5.2 is using reasoning tokens (reasoning:0 = good) |

## History

- **Feb 9, 2026:** Creek pipeline identified as best approach (Library Cat test)
- **Feb 10, 2026:** Batch 1 generated (5 stories: Puddle, Window, Birds, Chalk, Tree)
- **Feb 11, 2026:** Skill formalized. "The Frequency" + "Clockwork Sparrow" running.
