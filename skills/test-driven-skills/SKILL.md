# Test-Driven Skill Creation

Create and validate skills by measuring the gap between model output WITH and WITHOUT the skill.

## Why This Matters

Skills are prompts. Prompts can make things better OR worse. The only way to know is to **measure**.

## Process

### Step 1: Baseline (No Skill)
Run the model on your target task WITHOUT any skill loaded. Save the output.

```
Task: "Write an Etsy listing for a digital wall art print"
Model: sonnet
Result: [save as baseline.md]
```

### Step 2: Score the Baseline
Use a rubric (see below). Score each dimension 1-10.

### Step 3: Create the Skill
Write your SKILL.md with the specialized instructions.

### Step 4: Test WITH Skill
Run the SAME task with the skill loaded. Save output.

```
Task: "Write an Etsy listing for a digital wall art print"  
Model: sonnet + skills/etsy-expert/SKILL.md loaded
Result: [save as with-skill.md]
```

### Step 5: Score and Compare
Score the skill-assisted output on the same rubric. Calculate the gap.

### Step 6: Iterate or Ship
- **Gap > +2 points average** → Ship it ✅
- **Gap +0.5 to +2** → Iterate on the skill, retest
- **Gap < +0.5 or negative** → Skill isn't helping, rethink approach

## Scoring Rubric Template

| Dimension | Weight | Baseline | With Skill | Delta |
|-----------|--------|----------|------------|-------|
| Accuracy | 2x | /10 | /10 | |
| Specificity | 1.5x | /10 | /10 | |
| Tone/Voice | 1x | /10 | /10 | |
| Actionability | 1.5x | /10 | /10 | |
| Completeness | 1x | /10 | /10 | |
| **Weighted Avg** | | | | |

Customize dimensions per skill type:
- **Content skills:** Add SEO, readability, engagement
- **Code skills:** Add correctness, error handling, performance
- **Research skills:** Add source quality, depth, recency
- **Creative skills:** Add originality, emotional impact, brand alignment

## Example: Etsy Listing Skill

### Baseline (no skill):
```
"Beautiful digital wall art print featuring a serene mountain landscape. 
Perfect for your home office or living room. Instant download, 
high resolution. Multiple sizes included."
```
Score: Accuracy 7, Specificity 4, Tone 5, Actionability 3, Completeness 5 → **Avg: 4.8**

### With Skill:
```
"Mountain Sunrise Digital Wall Art | Minimalist Nature Print | 
Printable Home Decor | Living Room Office Art

✨ WHAT YOU GET:
- 5 sizes (5x7, 8x10, 11x14, 16x20, 18x24)
- 300 DPI high resolution
- Instant download — print at home or upload to printer

🏠 PERFECT FOR:
- Gallery walls, home office, bedroom accent
- Gifts for nature lovers

📱 HOW TO PRINT:
1. Download files after purchase
2. Print at home, Walgreens, Staples, or upload to Shutterfly
3. Frame and enjoy!

Tags: mountain wall art, digital download, minimalist print, nature decor..."
```
Score: Accuracy 8, Specificity 9, Tone 8, Actionability 9, Completeness 9 → **Avg: 8.6**

**Delta: +3.8** → Ship it ✅

## Test Log Template

Save in each skill directory as `TEST-LOG.md`:

```markdown
# Test Log: [Skill Name]

## Test 1 — [Date]
- Task: [exact prompt used]
- Model: [model name]
- Baseline score: [X.X]
- Skill score: [X.X]  
- Delta: [+/-X.X]
- Notes: [what improved, what didn't]

## Test 2 — [Date] (after iteration)
...
```

## Anti-Patterns

❌ **Testing once and shipping** — Run at least 3 different prompts to catch edge cases
❌ **Only testing happy path** — Try weird/ambiguous inputs too
❌ **Ignoring regressions** — Sometimes a skill helps in one area but hurts another
❌ **Scoring your own skill generously** — Be honest. If it's only marginally better, iterate.
❌ **Huge skills** — If your SKILL.md is 5000+ words, it's probably confusing the model. Shorter = better.

## When to Skip Testing

- **Pure documentation skills** (like this one) — no model output to test
- **Tool reference skills** (API docs, CLI usage) — correctness is binary
- **Trivial skills** (<50 words of instruction) — overhead isn't worth it

## Integration with Skill Creation

When building a new skill:
1. Define the task it should improve
2. Run baseline test FIRST
3. Write the skill
4. Test and score
5. Include TEST-LOG.md in the skill directory
6. Only add to production skills/ after passing the +2 point threshold
