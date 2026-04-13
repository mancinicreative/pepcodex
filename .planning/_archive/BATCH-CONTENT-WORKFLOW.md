# Batch Content Workflow

*Weekly content production system for PepCodex*
*Created: 2026-01-27*

---

## Weekly Overview

| Day | Focus | Time | Output |
|-----|-------|------|--------|
| Sunday | Prep + Research | 2h | Topics, sources, outlines |
| Monday | Blog Writing | 2h | Blog post draft |
| Tuesday | Visual Content | 1.5h | 3-5 carousels scheduled |
| Wednesday | Outreach | 2h | 10 cold emails + follow-ups |
| Thursday | Outreach | 1.5h | 10 cold emails + replies |
| Friday | Review + Plan | 1h | Metrics review, next week plan |

**Total: 10 hours/week**

---

## Sunday: Prep + Research (2h)

### Hour 1: Topic Selection

1. **Review CONTENT-CALENDAR.md**
   - Check this week's assigned blog topic
   - Note Instagram carousel themes
   - See newsletter status (send if 50+ subs)

2. **Check CONTENT-BACKLOG.md**
   - Pick 3-5 carousel topics for the week
   - Note any trending topics to add

3. **Scan for news**
   - PubMed alerts for key peptides
   - ClinicalTrials.gov new registrations
   - Competitor newsletters (what are they covering?)

### Hour 2: Source Gathering

1. **For blog post:**
   - Search PubMed for 3-5 key papers
   - Find clinical trial data if relevant
   - Note regulatory status (FDA/EMA)
   - Save sources to draft document

2. **Create outline:**
   - Opening hook (why this matters)
   - What We Know (3-4 key findings)
   - What We Don't Know (gaps, limitations)
   - What's Next (ongoing research)
   - Evidence grade (known/suggestive/early)

3. **Queue carousel angles:**
   - Extract 3 main points for carousels
   - Note which stats are most shareable
   - Identify myth-buster angle if applicable

---

## Monday: Blog Writing (2h)

### Hour 1: Draft Writing

1. **Open blog template:**
   ```bash
   cp .planning/BLOG-TEMPLATE.md src/content/blog/[slug].mdx
   ```

2. **Fill frontmatter:**
   ```yaml
   ---
   title: "[Peptide]: [Angle]"
   publishDate: 2026-01-27
   author: "PepCodex Research Team"
   category: "research-digest"
   tags: ["peptide-name", "related-tag"]
   excerpt: "150-200 char summary for SEO"
   relatedPeptides: ["semaglutide", "tirzepatide"]
   sources:
     - id: "pubmed-12345"
       title: "Study Title"
       url: "https://pubmed.ncbi.nlm.nih.gov/12345"
       type: "journal"
   evidenceLevel: "known"
   ---
   ```

3. **Write sections:**
   - Opening paragraph (hook + context)
   - ## What We Know
   - ## What We Don't Know
   - ## What's Next
   - ## How Strong Is the Evidence?

### Hour 2: Polish + Publish

1. **Citation check:**
   - Every claim has [source-id] reference
   - All sources in frontmatter array
   - Animal studies clearly labeled

2. **SEO check:**
   - Title 50-60 characters
   - Excerpt 150-160 characters
   - Keywords in first paragraph
   - Internal links to 3-5 dossiers

3. **Publish:**
   ```bash
   git add src/content/blog/[slug].mdx
   git commit -m "blog: add [title]"
   git push origin main
   ```

4. **Verify:**
   - Check page loads on pepcodex.com
   - Confirm in Vercel deployment logs

---

## Tuesday: Visual Content (1.5h)

### 45 min: Carousel Creation

1. **Extract from blog:**
   - 3 main points → 3 carousels
   - Use INSTAGRAM-CAROUSELS.md as template

2. **For each carousel:**
   - Slide 1: Hook question or bold claim
   - Slides 2-6: Key evidence points
   - Slide 7: "Save this for later"
   - Slide 8: CTA (follow + link in bio)

3. **Design in Canva:**
   - Use brand colors: #8B5CF6 → #7C3AED gradient
   - Dark background: #0F0F0F
   - Bold sans-serif headlines
   - Consistent footer: @pepcodex

### 30 min: Schedule + Stories

1. **Schedule carousels:**
   - Monday, Wednesday, Friday, Sunday
   - Best times: 8-9am or 6-8pm EST
   - Use Instagram's native scheduler or Later

2. **Create stories:**
   - Quick fact from blog (1 slide)
   - Poll question for engagement
   - "New blog post" teaser with link

3. **Update tracking:**
   - Note scheduled posts in CONTENT-CALENDAR.md
   - Mark carousel topics as used in backlog

### 15 min: Newsletter Prep (if applicable)

1. **If 50+ subscribers:**
   - Draft newsletter section from blog
   - 2-3 sentence summary + link
   - Queue in Beehiiv for Thursday send

---

## Wednesday: Outreach (2h)

### Hour 1: New Outreach

1. **Open CRM (Notion/Sheets)**
   - Filter: Status = "Prospect"
   - Pick 10 clinics to contact

2. **Send cold emails:**
   - Use template from OUTREACH-PLAN.md
   - Personalize first line (clinic name, location)
   - Update CRM: Status = "Contacted"

### Hour 2: Follow-ups

1. **Filter: Contacted 3 days ago**
   - Send Follow-up 1 template
   - Note any replies

2. **Process replies:**
   - Positive → Schedule call, update CRM
   - Question → Answer, update CRM
   - Negative → Note reason, update CRM

3. **Update pipeline:**
   - Move prospects through stages
   - Note any patterns in responses

---

## Thursday: Outreach (1.5h)

### 45 min: New Outreach

1. **Send 10 more cold emails**
   - Alternate between clinics and sponsors
   - Use appropriate template
   - Update CRM

### 45 min: Pipeline Management

1. **Filter: Contacted 7 days ago**
   - Send Follow-up 2 template (final)
   - Mark as "Nurture" if no response

2. **Prepare for calls:**
   - Review any scheduled discovery calls
   - Prep talking points and pricing info

3. **Send newsletter (if ready):**
   - Trigger Beehiiv send
   - Monitor open/click rates

---

## Friday: Review + Plan (1h)

### 30 min: Metrics Review

1. **Google Analytics 4:**
   - Weekly traffic vs. previous week
   - Top pages by views
   - Traffic sources

2. **Google Search Console:**
   - New queries appearing
   - Click-through rates
   - Any indexing issues

3. **Instagram:**
   - Follower growth
   - Top performing posts
   - Engagement rate

4. **Beehiiv:**
   - Subscriber count
   - Open/click rates
   - Unsubscribe rate

### 30 min: Next Week Planning

1. **Update CONTENT-CALENDAR.md:**
   - Confirm next week's blog topic
   - Assign carousel themes
   - Note newsletter status

2. **Review CONTENT-BACKLOG.md:**
   - Add new ideas from the week
   - Reprioritize if needed

3. **Update CRM:**
   - Review pipeline status
   - Plan next week's outreach targets

---

## Quick Reference

### File Locations

| File | Purpose |
|------|---------|
| `.planning/CONTENT-CALENDAR.md` | 4-week editorial schedule |
| `.planning/CONTENT-BACKLOG.md` | 20+ topic ideas |
| `.planning/INSTAGRAM-CAROUSELS.md` | Carousel templates |
| `.planning/OUTREACH-PLAN.md` | Email templates + cadence |
| `.planning/WEEKLY-OPS-CHECKLIST.md` | Publishing checklist |

### Daily Minimums (1 hr/day)

| Task | Minimum |
|------|---------|
| Outreach | 4 cold emails |
| Social | 1 IG post OR 3 stories |
| Engagement | 15 min comments |

### Emergency Content

If you're short on time, use:
1. Quick stat story (5 min)
2. Reshare old carousel (2 min)
3. Poll question (3 min)

---

*Update weekly on Friday during review*
