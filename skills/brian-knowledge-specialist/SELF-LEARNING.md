# Brian's Self-Learning System

## Overview
Brian improves with every video he analyzes through feedback loops, pattern recognition, and calibration.

---

## Learning Mechanisms

### 1. Feedback Loop (Immediate)

**How it works:**
- Brian analyzes video → Delivers report
- McKinzie rates the analysis: 👍 (useful) or 👎 (not useful)
- Brian stores feedback with the analysis
- Adjusts future analyses based on patterns

**Implementation:**
```
User: "Brian, analyze: [URL]"
Brian: [Delivers analysis]
User: 👍 or 👎
Brian: Stores: "Analysis X rated [rating] by McKinzie"
```

**What Brian learns:**
- Topics McKinzie finds most valuable
- Depth of analysis preferred (brief vs. detailed)
- Which types of insights lead to action
- False positives (rated HIGH but not useful)

---

### 2. Relevance Calibration (Weekly)

**How it works:**
- Weekly review of all analyses
- Compare Brian's relevance rating vs. McKinzie's actual usage
- Adjust scoring algorithm

**Example:**
- Brian rated 5 videos "HIGH" this week
- McKinzie acted on 4 of them → 80% accuracy ✅
- Brian rated 3 videos "MEDIUM"
- McKinzie acted on 2 of them → 66% accuracy
- **Adjustment:** Brian's MEDIUM threshold should be closer to HIGH

**Auto-adjustment rules:**
- If HIGH relevance < 70% action rate → Make HIGH criteria stricter
- If MEDIUM relevance > 70% action rate → Elevate to HIGH
- Track which topics consistently get 👍 vs 👎

---

### 3. Topic Preference Learning (Monthly)

**How it works:**
- Track which topics McKinzie asks about most
- Prioritize similar content in the future
- Suggest related topics proactively

**Example pattern recognition:**
- Week 1: 3 videos about FB bonus → All 👍
- Week 2: 2 videos about Etsy → 1 👍, 1 👎
- Week 3: 1 video about AI tools → 👍
- **Learning:** FB bonus and AI tools are high-value; Etsy is mixed

**Proactive suggestions:**
"I noticed you've been analyzing FB bonus content. I found 3 similar videos in my queue. Should I prioritize them?"

---

### 4. Insight Quality Scoring (Per Analysis)

**How it works:**
Each insight gets tracked:
```json
{
  "insight": "Test video hooks in first 3 seconds",
  "topic": "fb-bonus",
  "timestamp": "05:32",
  "brian_confidence": 0.9,
  "user_rating": 👍,
  "user_action": "implemented",
  "result": "CTR improved 15%"
}
```

**Learning:**
- Insights from [Creator X] consistently get 👍 → Weight higher
- Insights about [Topic Y] rarely get acted on → Deprioritize
- Specific timestamps → McKinzie values specificity

---

### 5. Cross-Analysis Pattern Recognition

**How it works:**
- Compare insights across multiple videos
- Identify recurring themes
- Synthesize "meta-insights"

**Example:**
- Video 1: "Post at 9 AM for best engagement"
- Video 2: "Morning posts outperform afternoon"
- Video 3: "9-10 AM is the golden hour"
- **Brian's synthesis:** "Multiple sources confirm 9-10 AM optimal posting time"

**Knowledge base enrichment:**
- Link related analyses
- Build "consensus scores" (how many sources agree)
- Flag contradictions for review

---

## Implementation Roadmap

### Phase 1: Basic Feedback (This Week)
- [ ] Add 👍 👎 buttons to Telegram responses
- [ ] Store feedback in knowledge base
- [ ] Simple tracking: "Analysis X = 👍"

### Phase 2: Calibration (Next Week)
- [ ] Weekly relevance accuracy report
- [ ] Auto-adjust thresholds based on feedback
- [ ] Topic preference scoring

### Phase 3: Pattern Recognition (Month 2)
- [ ] Cross-analysis linking
- [ ] Meta-insight generation
- [ ] Proactive suggestions

### Phase 4: Predictive (Month 3)
- [ ] Predict which videos will be HIGH relevance
- [ ] Suggest optimal batch sizes
- [ ] Predict time-to-analyze for scheduling

---

## Self-Improvement Metrics

Brian tracks his own performance:

| Metric | Target | How It's Used |
|--------|--------|---------------|
| Relevance accuracy | > 80% | Adjust rating thresholds |
| Action rate | > 70% | Identify high-value topics |
| User satisfaction | > 4.5/5 | Overall quality score |
| False positive rate | < 10% | Reduce noise |
| Time to insight | < 5 min | Efficiency optimization |

---

## Example: Brian Getting Smarter

### Week 1 (Baseline)
- Analyzes 10 videos
- 6 rated HIGH, 4 rated MEDIUM
- McKinzie gives: 4 👍, 2 👎, 4 no response
- **Learning:** 66% accuracy, need better calibration

### Week 2 (Adjustment)
- Tightens HIGH criteria
- Analyzes 10 videos
- 4 rated HIGH, 6 rated MEDIUM
- McKinzie gives: 3 👍, 1 👎, 6 no response
- **Learning:** 75% accuracy on HIGH, better!

### Week 3 (Pattern Recognition)
- Notices FB bonus videos always get 👍
- Notices "AI tools for business" always get 👍
- Notices "physical product" videos usually get 👎
- **Learning:** Prioritize digital/online business content

### Week 4 (Proactive)
- "I noticed you liked 3 FB bonus videos. I found 2 more in my queue. Analyze them?"
- "You've been asking about AI automation. Should I create a summary of what we've learned so far?"

---

## Technical Implementation

### Feedback Storage
```json
{
  "feedback_id": "uuid",
  "analysis_id": "uuid",
  "user_id": "mckinzie",
  "rating": "👍|👎",
  "reason": "optional text",
  "acted_on": true|false,
  "result": "optional outcome",
  "timestamp": "ISO8601"
}
```

### Learning Database
```json
{
  "topic": "fb-bonus",
  "total_analyses": 15,
  "thumbs_up": 12,
  "thumbs_down": 2,
  "no_response": 1,
  "satisfaction_rate": 0.86,
  "priority_score": 0.92
}
```

### Calibration Adjustments
```
IF satisfaction_rate < 0.7:
  INCREASE threshold for HIGH relevance
  
IF topic.priority_score > 0.9:
  PRIORITIZE similar content
  
IF creator.consistency > 0.8:
  WEIGHT their insights higher
```

---

## Human Oversight

**McKinzie controls the learning:**
- Can reset learning for specific topics
- Can override ratings
- Can set "always prioritize" or "never prioritize" rules
- Monthly review of what Brian has learned

**Transparency:**
- Brian shows his "confidence score" for each analysis
- Shows which patterns he's identified
- Explains why he rated something HIGH/MEDIUM/LOW

---

## Summary

**Brian gets smarter by:**
1. 👍 👎 Feedback on every analysis
2. Weekly calibration of relevance ratings
3. Monthly topic preference analysis
4. Cross-video pattern recognition
5. Tracking which insights lead to action

**Result:**
- Week 1: Generic analysis
- Week 4: Tailored to McKinzie's preferences
- Month 3: Predictive, proactive suggestions

**Key principle:** Brian learns FROM McKinzie's behavior, not just her explicit feedback.
