# Meta Andromeda Update - Full Overview

## What Is Andromeda?

Andromeda is Meta's new AI-driven personalized ads retrieval engine that replaced Facebook's old ad delivery system between late 2024 and early 2025.

It's the first stage of ad delivery - filtering millions of candidate ads down to a few thousand eligible ads for each impression opportunity.

## Why Meta Built It

The old system couldn't handle the explosion of ad variations from AI tools:
- Advertisers went from 5 ads/campaign to 50-100+
- Advantage+ Creative generates hundreds of variations automatically
- Ad retrieval became a bottleneck

## How It Works

### 1. Embeddings-Based Matching
- Maps users, contexts, and ads into high-dimensional mathematical space
- Users have coordinates based on interests, behaviors, context
- Ads have coordinates based on content and target audience
- Algorithm finds ads whose coordinates are close to yours

**This is why broad targeting works now** - the algorithm automatically finds matches.

### 2. Real-Time Behavioral Learning
- Learns from SEQUENCES of your recent actions
- Example: Watched workout video → searched protein powder → clicked gym ad = fitness buyer intent
- Adjusts recommendations in real-time
- Uses what you just did, not just static profile

### 3. Incredible Processing Scale
- Processes tens of millions of ads at once
- Uses hierarchical indexing and parallel processing
- Eliminates irrelevant ads instantly
- Handles 8-15+ ads per campaign easily

## The Three-Stage Delivery Process

### Stage 1: Retrieval (Andromeda)
Scans millions of ads, builds shortlist of few thousand candidates.

### Stage 2: Ranking
Predicts likelihood of action (click, convert, engage).
Considers ad quality, relevance score, bid amount.

### Stage 3: Auction & Delivery
Highest-ranked ads compete in auction.
Winner gets shown.

## What Broke

| Old Tactic | Why It Broke |
|------------|--------------|
| Narrow targeting | Algorithm is better at finding users than you |
| Lookalike audiences | Andromeda handles this automatically |
| Complex campaign structures | Creates confusion, limits optimization |
| Minor ad variations | Algorithm groups similar ads together |
| Manual everything | AI outperforms manual at scale |

## What Works Now

| New Tactic | Why It Works |
|------------|--------------|
| Broad targeting | Gives algorithm maximum data |
| 8-15 different ad concepts | Gives algorithm options to personalize |
| Simple structure | Clear signals for optimization |
| Advantage+ automation | Algorithm handles details better |
| Creative diversity | Main performance lever now |

## The Numbers

- 10,000x larger ML models than previous system
- 5% conversion increase in Q2 beta
- 10% improvement by Q3
- 22% higher ROAS for Advantage+ Creative users
- 7% conversion boost for AI-generated creative elements

## Personal Concierge Metaphor

Meta calls Andromeda a "personal concierge" because it interprets fine-grained interests and contexts.

Not just: "This person likes fitness"
But: "This person watches workout videos Saturday mornings, bought protein powder 3 weeks ago, just searched home gym equipment"

## Key Insight

**It's not tracking you MORE - it's using existing data BETTER.**

Your Pixel didn't break. Privacy settings didn't change. Meta just got way better at using data it already had.

---

*Source: Meta Engineering Blog, Dec 2024*
*Updated: Feb 2026*
