# Adversarial Review Skill

Every creator agent gets a reviewer agent. No exceptions.

## Pattern

### Code Review
- **Creator:** Codex (builds features, fixes bugs)
- **Reviewer:** Sonnet (reads code, finds bugs, security issues, edge cases)
- **Flow:** Creator finishes → Reviewer spawns with creator's output → Reviewer approves or lists fixes → If fixes needed, Creator gets another pass → Only "done" after Reviewer approves

### Research Review
- **Creator:** Sonnet/Haiku (finds keywords, trends, competitor data)
- **Reviewer:** Haiku (fact-checks claims, verifies trend direction is CURRENT not historical, cross-references sources)
- **Flow:** Creator finishes → Reviewer verifies every data point → Flags anything unverifiable or stale

### Content Review
- **Creator:** Sonnet/KoalaWriter (writes drafts, listing copy)
- **Reviewer:** Haiku (checks factual accuracy, tone, hallucinations, brand alignment)
- **Flow:** Creator finishes → Reviewer scores quality → Only delivered if passes

## Spawn Template

### Code Review Spawn
```
Task for reviewer:
"Review the code at [FILE_PATH]. You are a skeptical code reviewer. Check for:
1. Bugs and edge cases (null checks, error handling, off-by-one)
2. Security issues (exposed secrets, XSS, injection, auth bypasses)
3. Performance problems (N+1 queries, memory leaks, unnecessary re-renders)
4. Does it match the requirements? [REQUIREMENTS]
5. Would this break existing functionality?

Output format:
- APPROVE: Ship it (with optional minor suggestions)
- REVISE: List specific issues with file:line references and fix suggestions
- REJECT: Fundamental problems, needs rewrite (explain why)

Be thorough. Be skeptical. Better to catch it now than in production."
```

### Research Review Spawn
```
Task for reviewer:
"Fact-check this research report at [FILE_PATH]. You are a skeptical analyst. Check:
1. Are keyword volumes current (2026) or historical? Verify with fresh searches.
2. Are trend claims accurate? Is something labeled 'rising' actually rising NOW?
3. Are competitor claims verifiable?
4. Any data points that smell like hallucinations?
5. Are recommendations actionable and correctly matched to the right site/shop?

Known corrections to enforce:
- 'Think Celestial' peaked Oct 2023, is FADING — never recommend as rising
- Sourdough scoring is on Melrose Family, NOT Hello Hayley
- Always verify LDS/Christian trends against current church themes

Output: List of verified ✅ and flagged ⚠️ claims with corrections."
```

### Content Review Spawn
```
Task for reviewer:
"Review this content at [FILE_PATH]. You are an editor. Check:
1. Factual accuracy (no hallucinated products, prices, or claims)
2. Brand voice match (fun, feminine, descriptive for blog; professional for Etsy)
3. SEO: Are target keywords naturally included?
4. No AI-sounding phrases ('delve', 'tapestry', 'in conclusion')
5. Readability: Short paragraphs, scannable, engaging

Output: PUBLISH (ready), EDIT (with specific fixes), or REWRITE (with reasons)."
```

## Cost Budget
- Code review (Sonnet): ~5-10¢ per review
- Research review (Haiku): ~1-2¢ per review  
- Content review (Haiku): ~1-2¢ per review
- Total overhead: <$1/day for dramatically better quality

## Rules
1. EVERY overnight Codex spawn gets a Sonnet code review
2. EVERY research scan (Sage, Scout, Milo) gets a Haiku fact-check
3. EVERY content piece gets a Haiku quality check before delivery
4. Reviewer and Creator must be DIFFERENT agents (no self-review)
5. Reviewer verdict is logged to `/projects/adversarial-reviews/YYYY-MM-DD.md`
6. If Reviewer says REVISE → Creator gets one more pass, then Reviewer re-checks
7. Max 2 revision cycles (avoid infinite loops)
