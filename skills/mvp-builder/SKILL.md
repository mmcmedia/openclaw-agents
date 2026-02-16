# MVP Builder Skill (For Dev Agent)

**Purpose:** Take validated PRD and build functional MVP in 2-4 weeks.

**Trigger:** When McKinzie approves an app opportunity for development.

---

## 🎯 MVP Philosophy

**Goal:** Build the smallest thing that validates the core value proposition.

**Constraints:**
- 2-4 weeks max
- 3 core features only
- No nice-to-haves
- Launchable, not perfect

**Success Criteria:**
- McKinzie can test it end-to-end
- Real users can sign up and use it
- Can collect feedback and iterate

---

## 📋 Tech Stack (Standard)

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Animations:** Framer Motion
- **State:** React Context or Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime (if needed)
- **API:** Next.js API routes

### Hosting
- **Frontend:** Vercel
- **Backend:** Vercel (serverless)
- **Database:** Supabase
- **Domain:** Vercel or Cloudflare

### DevOps
- **Git:** GitHub
- **CI/CD:** GitHub Actions
- **Monitoring:** Vercel Analytics

---

## 🏗️ MVP Build Process

### Phase 1: Setup (Day 1)

**1.1 Initialize Project**
```bash
npx create-next-app@latest [app-name] --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd [app-name]
npx shadcn-ui@latest init
```

**1.2 Setup Supabase**
- Create project at supabase.com
- Configure auth (email + Google OAuth)
- Setup database schema (basic tables)
- Save credentials to .env.local

**1.3 Deploy Skeleton**
- Push to GitHub
- Connect Vercel
- Deploy landing page
- Verify domain works

---

### Phase 2: Core Features (Days 2-10)

**2.1 Database Schema**
Design minimal schema:
```sql
-- Users (handled by Supabase Auth)
-- Add profile table if needed

-- Core entity 1 (e.g., chores, tasks, entries)
create table items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  -- feature-specific fields
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Core entity 2 (if needed)
-- Keep it minimal!
```

**2.2 Auth Flow**
- Sign up / Sign in pages
- Protected routes middleware
- User profile setup

**2.3 Feature 1: Core Value**
- Build the ONE thing that solves the pain point
- Make it work end-to-end
- Add satisfying UX (animations, feedback)

**2.4 Feature 2: Supporting Flow**
- Usually: list view, detail view, create/edit
- Keep it simple

**2.5 Feature 3: Polish**
- Settings/profile
- Basic stats/dashboard
- Whatever makes it feel complete

---

### Phase 3: Payment (Days 11-13)

**3.1 Choose Payment Provider**
- **Stripe:** Best for subscriptions
- **LemonSqueezy:** Easier for digital products
- **Creem.io:** McKinzie's preference

**3.2 Setup**
- Create products/prices in dashboard
- Add payment webhooks
- Build upgrade flow
- Add "Pro" badges/features

**3.3 Free Tier Limits**
- Define what free users get
- Add paywalls gracefully
- Make upgrade compelling

---

### Phase 4: Polish & Launch Prep (Days 14-17)

**4.1 Landing Page**
- Hero section
- Features list
- Pricing table
- Sign up CTA

**4.2 Onboarding**
- Welcome flow
- First-use tutorial (if needed)
- Empty states

**4.3 Responsive Design**
- Mobile-first
- Test on real devices
- PWA manifest (optional)

**4.4 Testing**
- Test all flows manually
- Fix obvious bugs
- Don't aim for 100% coverage

---

### Phase 5: Deploy (Day 18-20)

**5.1 Production Checklist**
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Auth callbacks configured
- [ ] Payment webhooks working
- [ ] Analytics installed

**5.2 Deploy**
- Merge to main
- Vercel auto-deploys
- Verify all features work
- Test on mobile

**5.3 Handoff**
- Document known issues
- Share admin access with McKinzie
- Provide feedback collection plan

---

## 🎨 Design System (Reusable)

### Colors
```css
--primary: #2DD4BF;      /* Teal */
--primary-dark: #14B8A6;
--secondary: #F87171;    /* Coral */
--accent: #FCD34D;       /* Yellow */
--background: #FEF9F3;   /* Cream */
--text: #1F2937;         /* Charcoal */
--text-muted: #6B7280;
```

### Typography
- **Headings:** Nunito (rounded, friendly)
- **Body:** Inter (clean, readable)
- **Sizes:** 
  - H1: 2.5rem (mobile: 1.875rem)
  - H2: 1.875rem (mobile: 1.5rem)
  - Body: 1rem

### Components (shadcn)
- Button (primary, secondary, ghost)
- Card
- Input
- Dialog
- Dropdown Menu
- Toast (for notifications)
- Tabs

---

## 📝 PRD → Code Translation

### Example: KiddoChores

**PRD Says:**
> "Quick chore setup with pre-built templates by age"

**Dev Builds:**
1. `SetupWizard` component
2. `ageGroups` config (4-6, 7-9, 10-12)
3. `choreTemplates` object
4. One-tap add function
5. Age selector UI

**PRD Says:**
> "Kid-friendly dashboard with big colorful icons"

**Dev Builds:**
1. `KidDashboard` component
2. Icon library (Lucide icons)
3. Large touch targets (min 48px)
4. Bright colors from design system
5. Tap-to-complete with animation

---

## ⚠️ Common Mistakes

1. **Over-engineering** ❌
   - Don't build features not in PRD
   - Don't add "in case we need it"
   - Solve today's problem, not tomorrow's

2. **Perfect over done** ❌
   - Ship with known small bugs
   - Fix them in week 2
   - Perfect is enemy of launched

3. **Ignoring mobile** ❌
   - Build mobile-first
   - Test on actual phones
   - Thumbs need big targets

4. **Complex auth** ❌
   - Email + Google is enough
   - Skip Facebook, Apple, etc for MVP
   - Add later if needed

5. **No analytics** ❌
   - Add from day 1
   - Track: signups, conversions, key actions
   - Can't improve what you don't measure

---

## ✅ Handoff Checklist

**For McKinzie:**
- [ ] Live URL
- [ ] Admin dashboard access
- [ ] How to see users/data
- [ ] How to update content
- [ ] Known issues list
- [ ] Next steps recommendation

**For Feedback Collection:**
- [ ] In-app feedback button
- [ ] Email capture for updates
- [ ] Analytics events tracking
- [ ] Bug reporting process

---

## 🚀 Post-MVP (Week 3+)

**Not part of MVP, but plan for:**
- Push notifications
- Offline mode
- Advanced features
- Marketing website
- App store submission

**Stay focused on:**
- Does core value work?
- Are people paying?
- What do users actually want next?

---

## 📚 Resources

**Templates:**
- Next.js + Supabase starter
- shadcn/ui components
- Payment integration examples

**Documentation:**
- Next.js docs
- Supabase docs
- shadcn/ui docs
- Stripe/Creem docs

**Testing:**
- Vercel preview deployments
- Mobile testing on real devices
- Lighthouse audits

---

## ✅ Success Metrics

**MVP Delivered When:**
- [ ] Users can sign up
- [ ] Core feature works end-to-end
- [ ] Payment flow functional
- [ ] Responsive on mobile
- [ ] Deployed and live
- [ ] Handoff complete

**Timeline:**
- Simple app: 2 weeks
- Medium complexity: 3 weeks
- More complex: 4 weeks max

**If running over:**
- Cut scope (remove features)
- Don't extend timeline
- Ship what works

---

*Last updated: Feb 15, 2026*
*Validated with McKinzie's feedback: speed over perfection, launch fast, iterate*
