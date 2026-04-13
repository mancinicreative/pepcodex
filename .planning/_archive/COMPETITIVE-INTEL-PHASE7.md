# PHASE 7: DISTRIBUTION LOOPS + RETENTION
## Pepcodex Competitive Intelligence

**Generated:** 2026-02-01
**Your Product:** pepcodex.com | Evidence-based peptide research database
**Current Newsletter:** Beehiiv (0 subscribers)

---

## Purpose

Design systems for:
1. Traffic acquisition loops
2. Content distribution channels
3. Newsletter growth and retention
4. Community engagement loops
5. Flywheel effects

---

# DISTRIBUTION CHANNEL ANALYSIS

## Channel Priority Matrix

| Channel | Effort | Reach | Quality | Priority |
|---------|--------|-------|---------|----------|
| Organic Search (SEO) | High | Very High | High | 1 |
| Reddit | Medium | High | High | 2 |
| Newsletter | Medium | Medium | Very High | 3 |
| Twitter/X | Medium | Medium | Medium | 4 |
| Podcast Guesting | High | Medium | High | 5 |
| Forum Seeding | Low | Low | High | 6 |

---

# LOOP 1: SEO → EMAIL → RETENTION

## The Core Flywheel

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Google Search                                         │
│        │                                                │
│        ▼                                                │
│   Peptide Page Visit                                    │
│        │                                                │
│        ▼                                                │
│   Email Capture (Value Hook)                            │
│        │                                                │
│        ▼                                                │
│   Newsletter Subscriber                                 │
│        │                                                │
│        ▼                                                │
│   Weekly Research Digest                                │
│        │                                                │
│        ▼                                                │
│   Return Visit → More Pages → Share → Links → SEO ──────┤
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Email Capture Strategy

### Capture Points

| Location | Trigger | Offer |
|----------|---------|-------|
| Below hero | Page scroll 30% | Weekly research digest |
| After evidence section | Content completion | Evidence grade updates |
| Exit intent | Mouse leaving viewport | "Before you go" modal |
| Sidebar sticky | Always visible | Quick signup |
| End of article | Content completion | Related research alerts |

### Value Hooks (Test Options)

| Hook | Target Audience | Expected CVR |
|------|-----------------|--------------|
| "Weekly Research Digest" | Researchers | 2-3% |
| "New Evidence Alerts" | Enthusiasts | 2-4% |
| "Free Evidence Report" | Lead magnet | 5-8% |
| "Research Updates for [Peptide]" | Specific interest | 3-5% |

### Capture Component

```typescript
// NewsletterCapture.astro
<section class="newsletter-capture">
  <h3>Stay Evidence-Informed</h3>
  <p>Weekly peptide research summaries. No dosing advice, no sales.</p>
  <form action="https://embeds.beehiiv.com/..." method="POST">
    <input type="email" placeholder="your@email.com" required />
    <button type="submit">Subscribe</button>
  </form>
  <p class="social-proof">Join [X] researchers and biohackers</p>
</section>
```

---

## Newsletter Content Strategy

### Email Cadence

| Email Type | Frequency | Purpose |
|------------|-----------|---------|
| Weekly Digest | Every Tuesday | Core value delivery |
| New Peptide Alert | As published | Engagement trigger |
| Evidence Update | Monthly | Major updates |
| Research Roundup | Quarterly | Comprehensive summary |

### Weekly Digest Format

```markdown
Subject: This Week in Peptide Research (Jan 30)

## 🔬 New Research

**Semaglutide**: 2 new studies published
- [Study 1 summary] — Evidence grade: High
- [Link to Pepcodex page]

**BPC-157**: Updated evidence grade (Low → Very Low)
- [Why it changed]
- [Link to updated page]

## 📊 Most Viewed This Week

1. Tirzepatide vs Semaglutide [link]
2. BPC-157 Research Summary [link]
3. Epithalon Evidence Profile [link]

## 💡 Quick Insight

"Did you know? Only 12% of peptide studies involve
human participants." — [Link to methodology]

---
Pepcodex | Evidence-based peptide research
[Unsubscribe] | [Preferences]
```

### Newsletter Growth Targets

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Subscribers | 50 | 200 | 500 |
| Open rate | 40%+ | 35%+ | 30%+ |
| Click rate | 5%+ | 4%+ | 3%+ |
| Return visits | 10% | 15% | 20% |

---

# LOOP 2: REDDIT → CREDIBILITY → TRAFFIC

## Reddit Growth Engine

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   Helpful Comment on r/Peptides                         │
│        │                                                │
│        ▼                                                │
│   Karma + Recognition                                   │
│        │                                                │
│        ▼                                                │
│   Earn "trusted responder" status                       │
│        │                                                │
│        ▼                                                │
│   Strategic Pepcodex links (when genuinely helpful)     │
│        │                                                │
│        ▼                                                │
│   Direct traffic + brand awareness                      │
│        │                                                │
│        ▼                                                │
│   Users share/link organically → more Reddit mentions   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Reddit Content Calendar

### Weekly Activity

| Day | Activity | Goal |
|-----|----------|------|
| Monday | Answer 3 questions | Build karma |
| Wednesday | Answer 3 questions | Build karma |
| Friday | Value post (if 500+ karma) | Authority building |
| Saturday | Community engagement | Relationship building |

### Content Types by Phase

**Phase 1 (Karma < 500):**
- Short, helpful answers only
- Citations from PubMed (not Pepcodex)
- Zero self-promotion

**Phase 2 (Karma 500-1000):**
- Longer educational posts
- Share methodology insights
- Occasional "I've been researching this..." references

**Phase 3 (Karma 1000+):**
- Strategic Pepcodex links (80/20 rule)
- Original research posts
- Evidence-based corrections

### Reddit Automation (n8n)

```
Workflow: Reddit Monitor

Schedule Trigger (every 30 min)
    │
    ▼
HTTP Request → Reddit API search
("peptide" OR "bpc-157" OR "semaglutide")
    │
    ▼
Filter → New posts (last 30 min)
    │
    ▼
IF → Question format AND <5 comments
    │
    ▼
Slack/Email notification with:
- Post URL
- Post title
- Subreddit
- Current comment count
    │
    ▼
(Optional) AI draft reply suggestion
```

---

# LOOP 3: CONTENT → SHARE → LINKS

## Shareable Content Strategy

### Content Types by Share Potential

| Content Type | Share Potential | Link Potential |
|--------------|-----------------|----------------|
| Comparison pages | Medium | High |
| Evidence reports | High | Very High |
| Infographics | Very High | High |
| Research summaries | Medium | Medium |
| Glossary pages | Low | Low |

### Shareable Asset Calendar

| Month | Asset | Purpose |
|-------|-------|---------|
| 1 | Evidence grading infographic | Social shares |
| 2 | "State of Peptide Research" report | Links + PR |
| 3 | Peptide comparison chart | Social shares |
| 4 | Clinical trial pipeline visualization | Expert shares |

### Social Share Optimization

**Page Elements:**
- Open Graph meta tags (title, description, image)
- Twitter Card meta tags
- Share buttons (minimal, not intrusive)
- Quotable callouts with tweet buttons

**OG Image Template:**
```
┌──────────────────────────────────────┐
│  PEPCODEX                            │
│                                      │
│  [Peptide Name]                      │
│                                      │
│  Evidence Grade: [HIGH/MOD/LOW]      │
│  [X] Human Studies | [Y] Animal      │
│                                      │
│  pepcodex.com                        │
└──────────────────────────────────────┘
```

---

# LOOP 4: NEWSLETTER → SPONSOR → GROWTH

## Newsletter Monetization Path

```
0 subscribers → Focus on growth only
    │
    ▼
500 subscribers → First sponsor outreach
    │
    ▼
1000 subscribers → Premium sponsor tiers
    │
    ▼
5000 subscribers → Self-sustaining growth budget
```

### Sponsor Revenue Model

| Tier | Price | Requirements |
|------|-------|--------------|
| Single mention | $50-100/send | 500+ subscribers |
| Featured sponsor | $100-200/send | 1000+ subscribers |
| Exclusive sponsor | $200-500/send | 2500+ subscribers |

### Sponsor Categories (Allowed)

| Category | Examples | Fit |
|----------|----------|-----|
| Testing services | Lab testing companies | High |
| Education | Courses, books, certifications | High |
| Health tech | Trackers, apps (non-peptide) | Medium |
| Research tools | Databases, journals | High |

### Sponsor Categories (NOT Allowed)

| Category | Reason |
|----------|--------|
| Peptide vendors | Sourcing prohibition |
| Pharmacies | Medical advice liability |
| Supplements | Product endorsement risk |

---

# LOOP 5: COMMUNITY → CONTENT → COMMUNITY

## User Feedback Loop

```
User reads peptide page
    │
    ▼
User has question/correction
    │
    ▼
Feedback form → info@pepcodex.com
    │
    ▼
Response within 48 hours
    │
    ▼
Content updated if warranted
    │
    ▼
User notified of update
    │
    ▼
User becomes advocate
    │
    ▼
User shares/links/mentions
```

### Feedback Integration

**On Every Page:**
```html
<aside class="feedback-cta">
  <p>See an error or have a research suggestion?</p>
  <a href="mailto:info@pepcodex.com?subject=Feedback: [PageTitle]">
    Send feedback
  </a>
</aside>
```

---

# RETENTION METRICS

## Cohort Analysis Targets

| Metric | Target |
|--------|--------|
| Day 1 return rate | 10% |
| Week 1 return rate | 20% |
| Month 1 return rate | 30% |
| Newsletter → return visit | 15% |
| Pages per session | 2.5+ |

## Retention Triggers

| Trigger | Action | Channel |
|---------|--------|---------|
| 7 days no visit | "New research alert" email | Newsletter |
| 30 days no visit | "What you missed" email | Newsletter |
| Favorite peptide updated | Push notification (future) | Email |
| New comparison available | Targeted email | Newsletter |

---

# DISTRIBUTION AUTOMATION (n8n)

## Workflow 1: New Page Published

```
Webhook: New page published
    │
    ▼
Generate social assets (OG images)
    │
    ▼
Queue newsletter mention
    │
    ▼
Log for Reddit monitoring
    │
    ▼
Submit to Google Search Console
```

## Workflow 2: Weekly Digest

```
Schedule: Every Tuesday 6am
    │
    ▼
Fetch: New pages from last 7 days
    │
    ▼
Fetch: Updated pages from last 7 days
    │
    ▼
Fetch: Top viewed pages (GA4 API)
    │
    ▼
Generate: Email content (AI)
    │
    ▼
Send: Via Beehiiv API
    │
    ▼
Log: Open/click tracking
```

## Workflow 3: Reddit Monitor

```
Schedule: Every 30 min (weekdays)
    │
    ▼
Search: Reddit API for keywords
    │
    ▼
Filter: New posts, question format
    │
    ▼
Notify: Slack/email with opportunities
    │
    ▼
Draft: Suggested reply (AI)
    │
    ▼
Queue: For manual review/posting
```

---

# DISTRIBUTION CHANNEL SETUP

## Immediate Actions

| Action | Priority | Effort |
|--------|----------|--------|
| Add newsletter capture to all pages | High | Low |
| Set up Beehiiv welcome sequence | High | Medium |
| Create first email template | High | Low |
| Add OG meta tags to all pages | Medium | Low |
| Create share buttons component | Low | Low |

## Week 1-2 Actions

| Action | Priority | Effort |
|--------|----------|--------|
| Build n8n Reddit monitor | Medium | Medium |
| Create weekly digest template | High | Medium |
| Set up social proof counter | Medium | Low |
| First newsletter send | High | Low |

## Month 1 Actions

| Action | Priority | Effort |
|--------|----------|--------|
| Reach 50 subscribers | High | Medium |
| 500+ Reddit karma | Medium | High |
| First shareable asset (infographic) | Medium | Medium |
| Newsletter engagement baseline | High | Low |

---

# DISTRIBUTION METRICS DASHBOARD

## Weekly Tracking

| Metric | Source | Target |
|--------|--------|--------|
| Organic sessions | GA4 | +5% WoW |
| Newsletter signups | Beehiiv | 10/week |
| Email open rate | Beehiiv | 35%+ |
| Email click rate | Beehiiv | 4%+ |
| Reddit karma gained | Manual | +100/week |
| Pages per session | GA4 | 2.5+ |
| Return visitors % | GA4 | 20%+ |

## Monthly Tracking

| Metric | Source | Target |
|--------|--------|--------|
| Newsletter subscribers | Beehiiv | +40/month |
| Referring domains | Ahrefs Free | +2/month |
| Reddit mentions | Manual | +5/month |
| Social shares | Manual | +20/month |

---

## NEXT: Phase 8 - Experiment Cadence + Kill List

Ready to design testing framework and define success/failure criteria.

---

*Phase 7 Complete | Generated 2026-02-01*
