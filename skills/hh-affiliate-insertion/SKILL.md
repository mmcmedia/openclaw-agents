# Hello Hayley Affiliate Product Insertion — aff.ai Strategy

**Created:** Feb 5, 2026  
**For:** Hello Hayley (1000+ hair/beauty posts)  
**Tool:** aff.ai (WordPress plugin for auto-inserting Amazon affiliate boxes)  
**Goal:** Systematically add hyper-relevant Amazon products to existing posts

---

## 🎯 Quick Start (Tomorrow Action Plan)

**Day 1 Tasks:**
1. Export top 100 HH posts by traffic (GA4 query below)
2. Manually categorize first 20 posts by topic
3. Set up 5 product catalogs in aff.ai (curling, braiding, hair care, updos, color)
4. Create keyword rules for these 5 categories
5. Test on 10 posts, review results
6. Iterate and scale

**Estimated time:** 3-4 hours for initial setup + testing

---

## 📊 1. Product Category Mapping (15+ Categories)

| Post Topic | Primary Products | Secondary Products | Example Keywords |
|------------|------------------|-------------------|------------------|
| **Braiding Tutorials** | Hair elastics, bobby pins, braiding tools, hair clips | Texturizing spray, shine serum | "braid", "plait", "french braid", "dutch braid" |
| **Curling Tutorials** | Curling irons, wands, heat protectant, setting spray | Sectioning clips, heat-resistant gloves | "curl", "curling iron", "wand", "waves" |
| **Straightening** | Flat irons, straightening brushes, heat protectant | Anti-frizz serum, smoothing cream | "straighten", "flat iron", "sleek", "smooth" |
| **Updos & Buns** | Bobby pins, hair pins, elastics, bun makers | Strong hold hairspray, smoothing gel | "updo", "bun", "chignon", "twist" |
| **Ponytails** | Hair ties, volumizing powder, teasing brush | Hairspray, shine spray | "ponytail", "high pony", "sleek pony" |
| **Hair Color** | Semi-permanent dye, toner, purple shampoo | Gloves, applicator brush, color-safe shampoo | "hair color", "dye", "tone", "highlight" |
| **Hair Care/Health** | Shampoo, conditioner, hair masks, treatments | Scalp treatments, vitamins, silk pillowcases | "hair care", "damaged hair", "repair", "growth" |
| **Blow Drying** | Hair dryers, round brushes, heat protectant | Diffusers, concentrator nozzles | "blow dry", "blowout", "volume", "round brush" |
| **Hair Extensions** | Clip-in extensions, tape-ins, halo extensions | Extension clips, blending tools | "extensions", "hair pieces", "volume" |
| **Hair Accessories** | Headbands, scrunchies, clips, barrettes | Hair scarves, decorative pins | "accessory", "headband", "scrunchie", "clip" |
| **Wedding Hair** | Bobby pins, hairspray, shine spray, veil combs | Hair padding, teasing combs | "wedding hair", "bridal", "formal" |
| **Kids' Hair** | Detangling spray, soft brushes, fun elastics | Hair chalk, glitter spray | "kids hair", "toddler", "easy hairstyle" |
| **Texture/Volume** | Dry shampoo, texturizing spray, volumizing mousse | Teasing brush, root lifter | "volume", "texture", "body", "fullness" |
| **Short Hair** | Styling paste, pomade, mini flat iron | Sea salt spray, styling wax | "short hair", "pixie", "bob styling" |
| **Natural/Curly Hair** | Leave-in conditioner, curl cream, diffuser | Wide-tooth comb, microfiber towel, satin bonnet | "curly hair", "natural hair", "curl pattern" |
| **Hair Tools General** | Hair dryers, flat irons, curling irons, brushes | Heat-resistant mats, tool organizers | "hair tools", "styling tools" |

**Total: 16 categories** — Start with top 5 by traffic volume.

---

## 🛠️ 2. aff.ai Configuration Guide

### Initial Setup

**Step 1: Install & Activate**
- WordPress Admin → Plugins → Add New → Search "aff.ai"
- Activate and connect Amazon Associates account
- Go to aff.ai → Settings → Connect API

**Step 2: Create Product Catalogs**

For each category above:
1. aff.ai → Product Catalogs → New Catalog
2. Name: "HH - [Category Name]" (e.g., "HH - Curling Tutorials")
3. Search Amazon for relevant products:
   - Use 4-5 star ratings minimum
   - Price range: $10-$50 (sweet spot for beauty products)
   - Prefer Amazon's Choice or Best Seller badges
4. Add 10-15 products per catalog
5. Set display template: **Compact Box** (less intrusive, faster load)

**Example Catalog: "HH - Curling Tutorials"**
- T3 Micro Whirl Trio Curling Iron
- Hot Tools Professional Curling Iron
- Bed Head Curlipops Curling Wand
- HSI Professional Ceramic Curling Iron
- Tresemme Thermal Creations Heat Protectant
- Kenra Volume Spray 25
- (4-9 more products)

**Step 3: Keyword-to-Product Rules**

aff.ai → Automation Rules → New Rule

**Template for each category:**

```
Rule Name: HH - [Category] Auto-Insert
Trigger: Post contains keywords
Keywords: [keyword1], [keyword2], [keyword3]
Product Catalog: HH - [Category]
Placement: After 2nd paragraph OR Before conclusion (test both)
Max products per post: 1 box with 3-5 products
Display style: Compact horizontal carousel
Match: ANY keyword (not all)
```

**Example Rule: Curling Tutorials**
```
Keywords: curling iron, wand, curl tutorial, how to curl, beach waves, loose curls
Catalog: HH - Curling Tutorials
Placement: After 2nd paragraph
Products shown: 3 per box
Display: Horizontal carousel
```

**Step 4: Placement Strategy**

Test these 3 positions (A/B test over 2 weeks):
1. **After introduction (para 2-3)** — High visibility, may disrupt flow
2. **Mid-tutorial (50% through post)** — Contextual, natural break
3. **Before conclusion** — After value delivered, higher trust

**Recommended starting point:** After paragraph 2 for tutorials, before conclusion for informational posts.

**Step 5: Styling to Match HH Theme**

aff.ai → Display Settings:
- **Color scheme:** Match HH brand colors (likely pink/coral/white)
- **Border:** Subtle 1px border, not bold
- **Button style:** Rounded corners, "Shop Now" or "View on Amazon"
- **Font:** Match body font (likely sans-serif, clean)
- **Spacing:** 30px padding top/bottom, center-aligned
- **Mobile:** Responsive, single-column on mobile

CSS Override (if needed):
```css
.affai-product-box {
  background: #fff9f7; /* Light pink tint */
  border: 1px solid #f0d9d4;
  border-radius: 8px;
  margin: 30px 0;
}
.affai-product-title {
  font-family: inherit;
  font-size: 14px;
}
.affai-cta-button {
  background: #f4a4a8; /* HH pink */
  border-radius: 20px;
}
```

---

## 🎨 3. Manual Review Process

### When to Review Manually

**Auto-insertion is GREAT for:**
- Standard tutorials (braids, curls, updos)
- Product-heavy posts (tool reviews, recommendations)
- High-volume traffic posts

**Manual review NEEDED for:**
- Posts about hair health issues (sensitive topics)
- Sponsored posts (avoid conflicts)
- Posts already monetized with other affiliates
- Posts with custom layouts/designs
- Posts under 500 words (too short for insertion)

### Review Checklist

Before going live with affiliate products on a post:

- [ ] Product relevance: Are recommended products truly helpful for this tutorial?
- [ ] Placement: Does the box disrupt the reading flow?
- [ ] Mobile check: Does it look good on phone?
- [ ] Price check: Are products reasonably priced (not luxury unless post warrants)?
- [ ] Ratings: All products 4+ stars?
- [ ] Diversity: Mix of price points ($15, $25, $40)?
- [ ] Competitors: No direct competitors to HH's own products (if any)
- [ ] Brand safety: Avoid controversial brands

### Quality Standards

**Green Light (publish):**
- Products directly mentioned or implied in post
- Natural fit within content flow
- Adds value to reader (genuinely helpful)
- Mobile-responsive design

**Yellow Light (revise):**
- Products tangentially related
- Placement feels forced
- More than 2 boxes per post
- Products all same price point

**Red Light (remove):**
- Products unrelated to post topic
- Affiliate box breaks page layout
- Reader feedback is negative
- Click-through rate <0.5% after 2 weeks

---

## 🚀 4. Automation Workflow (Step-by-Step)

### Week 1: Setup & Testing

**Day 1-2: Data Export & Categorization**

1. **Export HH posts from WordPress:**
   - Tools → Export → Posts → Download XML
   - OR use WordPress REST API: `wp-json/wp/v2/posts?per_page=100`

2. **Get top posts by traffic (GA4 query):**
   ```
   Property: Hello Hayley (361561956)
   Date range: Last 90 days
   Dimension: Page path and screen class
   Metric: Views, Users, Engagement rate
   Filter: Page path contains "/20" (blog posts, not pages)
   Sort: Views descending
   Limit: 500 posts
   ```

3. **Combine data:**
   - Match WordPress posts with GA4 traffic data (by URL slug)
   - Add columns: Post title, URL, Pageviews (90d), Category (manual)

4. **Categorize posts:**
   - Skim first 100 posts by title
   - Tag with primary category (braiding, curling, hair care, etc.)
   - Use spreadsheet or CSV: `post-categorization.csv`

**Day 3-4: aff.ai Configuration**

1. Create 5 product catalogs (start small):
   - Curling tutorials
   - Braiding tutorials
   - Hair care tips
   - Updos
   - Hair color

2. Add 10-15 products per catalog (see section 2)

3. Create 5 automation rules (one per catalog)

4. Set placement: "After 2nd paragraph"

5. Enable rules for TEST MODE (manual approval before publish)

**Day 5: Test Run**

1. Select 10 posts (2 per category)
2. Run aff.ai auto-insertion
3. Review each post in preview mode
4. Check desktop + mobile
5. Adjust placement/styling as needed
6. Publish and monitor

### Week 2: Scale & Optimize

**Day 6-7: Batch Insertion**

1. Enable auto-insertion for top 100 posts (by traffic)
2. Let aff.ai run overnight
3. Morning: Review sample (every 10th post)
4. Fix any broken layouts or irrelevant products

**Day 8-10: Analytics Review**

1. Wait 3-7 days for data
2. Check aff.ai dashboard:
   - Click-through rate by category
   - Conversion rate (if available)
   - Revenue per post
3. Identify top performers and laggards
4. Refine keyword rules for underperformers

**Day 11-14: Expand**

1. Add 5 more categories (next tier by traffic)
2. Create catalogs + rules
3. Run on next 200 posts
4. Repeat testing cycle

### Ongoing: Monthly Maintenance

- Review top 20 posts monthly — Update products if out of stock
- Check for seasonal trends (back-to-school, prom, wedding season)
- Rotate products to avoid staleness
- Monitor Amazon conversion rates (some products convert better)

---

## 📈 5. Priority Order (Which Posts First)

### Criteria for Prioritization

**Tier 1 (Do First):**
- Top 50 posts by pageviews (last 90 days)
- Engagement rate >60%
- Tutorial-style posts (higher product intent)
- Posts that rank in top 3 for target keyword

**Tier 2 (Do Second):**
- Posts with 1,000-5,000 pageviews/month
- Evergreen content (not seasonal)
- Posts with high bounce rate (add value to keep readers)

**Tier 3 (Do Later):**
- Lower traffic posts (<1,000 views/month)
- Seasonal content (do 2-3 months before season)
- Opinion/story posts (lower product intent)

**Tier 4 (Skip for Now):**
- Posts <300 words
- Sponsored posts
- Posts already heavily monetized
- Outdated content needing refresh

### GA4 Query to Identify High-Value Posts

**Query 1: Top Posts by Traffic (Last 90 Days)**
```
Dimensions: Page path, Page title
Metrics: Views, Users, Engaged sessions, Engagement rate
Filter: Page path contains "/20" AND Page path does not contain "/category/"
Secondary dimension: Landing page
Sort: Views descending
Export: CSV (top 500 rows)
```

**Query 2: High-Engagement Posts**
```
Dimensions: Page path
Metrics: Average engagement time, Engaged sessions per user
Filter: Engagement rate >60%
Sort: Average engagement time descending
Export: CSV
```

**Query 3: Top Landing Pages (SEO Value)**
```
Dimensions: Landing page
Metrics: Sessions, New users, Organic sessions
Filter: Landing page contains "/20"
Sort: Organic sessions descending
Export: CSV
```

**Action:** Cross-reference these 3 datasets. Posts that appear in all 3 = highest priority.

### Recommended Order

**Phase 1 (Week 1):** Top 50 posts (by traffic) × 5 main categories = ~250 potential insertions  
**Phase 2 (Week 2-3):** Next 150 posts, expand to 10 categories  
**Phase 3 (Month 2):** Remaining 800+ posts, full 16 categories  
**Phase 4 (Ongoing):** New posts auto-insert on publish, monthly reviews

---

## 💰 6. Expected Revenue Impact

### Industry Benchmarks (Beauty/Hair Niche)

**Amazon Affiliate Conversion Rates:**
- Beauty/Personal Care: **3-5%** (higher than average)
- Average order value: **$35-$50** (customers add other items)
- Commission rate: **3-4%** (Amazon beauty category)

**Typical Beauty Blog Performance:**
- Click-through rate (CTR) on affiliate links: **2-4%** per 1,000 pageviews
- Conversion rate (click → purchase): **3-5%**
- Earnings per click (EPC): **$0.50-$1.50**

### Hello Hayley Projections

**Assumptions:**
- 1,000 posts × 50% with affiliates = **500 monetized posts**
- Average pageviews: **2,000/month per post** (conservative)
- Total monthly pageviews on monetized posts: **1,000,000**

**Conservative Estimate:**
```
1,000,000 pageviews
× 2% CTR (conservative)
= 20,000 clicks to Amazon

20,000 clicks
× 4% conversion rate
= 800 sales

800 sales
× $40 average order value
× 4% commission
= $1,280/month
```

**Optimistic Estimate (after optimization):**
```
1,000,000 pageviews
× 3.5% CTR (optimized placement)
= 35,000 clicks

35,000 clicks
× 5% conversion rate (beauty niche)
= 1,750 sales

1,750 sales
× $45 average order value
× 4% commission
= $3,150/month
```

**Expected Range: $1,200 - $3,000/month** (once fully implemented)

### ROI Calculation

**Time Investment:**
- Initial setup: 20 hours (Week 1-2)
- Ongoing monthly: 3-4 hours (review + updates)

**Cost:**
- aff.ai subscription: ~$29-$79/month (depending on plan)
- McKinzie's time: 20 hours × $100/hr = $2,000 (one-time)

**Payback Period:**
- Month 1-2: Setup + testing, minimal revenue
- Month 3: $800-$1,500 (50% of posts live)
- Month 4+: $1,200-$3,000/month (full implementation)

**Break-even: 3-4 months**  
**12-month projected revenue: $18,000 - $36,000**  
**ROI: 600-1,200%** (after first year)

### Additional Revenue Opportunities

1. **Cross-promotion:** Link HH posts to We Heart Hairstyles posts (internal traffic boost)
2. **Seasonal spikes:** Back-to-school, prom, wedding season (2-3x normal traffic)
3. **Product reviews:** Dedicated review posts for high-converting products
4. **Email list:** Send "favorite products" roundups monthly (direct affiliate traffic)
5. **Pinterest:** Pin product boxes as images → drives targeted traffic

**Potential upside: $5,000+/month** (with full ecosystem optimization)

---

## 🎯 Action Plan Summary (Start Tomorrow)

### Morning (2 hours)
1. ✅ Export top 100 HH posts by traffic (GA4)
2. ✅ Download aff.ai plugin if not installed
3. ✅ Manually categorize first 20 posts by skimming titles
4. ✅ Create 3 product catalogs: Curling, Braiding, Hair Care

### Afternoon (2 hours)
5. ✅ Add 10 products to each catalog (30 total)
6. ✅ Create 3 automation rules (keyword-based)
7. ✅ Enable TEST MODE (manual approval)
8. ✅ Run auto-insertion on 10 posts

### Evening (30 min)
9. ✅ Review 10 test posts (desktop + mobile)
10. ✅ Adjust styling to match HH brand
11. ✅ Publish and set reminder to check analytics in 3 days

### Week 2
- Scale to 100 posts
- Add 2 more categories (Updos, Hair Color)
- Review CTR and adjust placement

### Month 2
- Expand to all 16 categories
- Automate new posts (insert on publish)
- Monthly performance review

---

## 📚 Resources & Next Steps

**Documentation:**
- aff.ai official docs: https://aff.ai/docs
- Amazon Associates best practices: https://affiliate-program.amazon.com/help/node/topic/G5VGQVSQ8GX3MCSB

**Tools:**
- GA4 Hello Hayley property: 361561956
- WordPress: hellohayley.com/wp-admin
- aff.ai dashboard: (login via WordPress admin)

**Future Enhancements:**
- Integrate with email campaigns (product roundup newsletters)
- A/B test placement positions (top vs. mid vs. bottom)
- Create dedicated "Best Hair Products" hub page
- Track individual product performance (swap out low converters)

---

**Created by:** Clawdbot  
**Last updated:** Feb 5, 2026  
**Status:** ✅ Ready to implement  
**Estimated monthly revenue (6 months):** $1,500 - $3,000
