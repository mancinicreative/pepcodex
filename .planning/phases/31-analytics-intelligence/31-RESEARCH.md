# Phase 31: Analytics & Traffic Intelligence — Research

## Purpose

Establish data-driven baselines before investing in monetization or growth. Without knowing which pages drive traffic, what users search for, and how the newsletter performs, monetization decisions are guesswork.

## Current Analytics Stack

| Tool | Status | What It Provides |
|------|--------|-----------------|
| **GA4** | Active (G-1M56CNL8CK) | Traffic, user behavior, basic events |
| **Google Search Console** | Active (verified) | Search queries, CTR, indexing status |
| **Vercel Analytics** | Installed but NOT activated | Web Vitals, server-side performance |
| **Beehiiv** | Active (newsletter) | Subscriber count, open/click rates |
| **Pagefind** | Active (on-site search) | No analytics on search queries |

## Key Questions to Answer

1. **What are the top 20 pages by organic traffic?** → These are monetization priority pages
2. **What are the top 20 search queries driving impressions/clicks?** → Content gap opportunities
3. **What's the newsletter subscriber count and growth rate?** → Monetization baseline
4. **What's the comparison page CTR vs. dossier page CTR?** → Validates comparison moat thesis
5. **Which peptides get the most search interest?** → Informs clinic partnership outreach
6. **What's the bounce rate on comparison pages?** → Are people finding what they need?
7. **Is there any conversion tracking for newsletter signups?** → Baseline before CTA optimization

## Implementation Notes

### Vercel Analytics Activation
- Already in `package.json` as `@vercel/analytics`
- Needs to be imported and rendered in base layout
- Provides Web Vitals (LCP, FID, CLS) plus page views
- Free tier: 2,500 events/month — sufficient for current traffic

### GA4 Enhanced Event Tracking
Events to add:
- `comparison_view` — which comparison pages are viewed
- `dossier_view` — which peptide dossiers are viewed
- `calculator_use` — calculator interactions
- `search_query` — what users search for on-site
- `newsletter_signup` — successful subscription
- `outbound_link` — clicks to external sources/citations

### Search Console Data Export
- Performance report: top queries, pages, CTR, position
- Coverage report: indexed vs. excluded pages
- Focus on: comparison pages indexing rate, dossier page performance

### Beehiiv Metrics
- API endpoint: subscribers, campaigns, analytics
- Key metrics: total subscribers, 30-day growth, avg open rate, avg click rate
- Segment analysis: which content drives signups

## Success Metrics

| Metric | Baseline | Target |
|--------|----------|--------|
| Vercel Analytics | Not active | Active, collecting data |
| GA4 events | Basic pageviews only | 6+ custom events tracking |
| KPI report | None | Documented baseline with all key metrics |
| Top pages identified | Unknown | Top 20 ranked by traffic |
| Newsletter metrics | Unknown | Documented with growth trend |

## Dependencies

- v5.0 Phase A (security headers) should be complete before optimizing analytics — CSP headers can block analytics scripts if misconfigured

## References

- GA4 property: G-1M56CNL8CK
- Vercel project: mancinicreative-pepcodex
- Beehiiv integration: `src/pages/api/subscribe.ts`
- Current analytics script: check BaseLayout.astro for GA4 snippet
- PMF Analysis: `.planning/PMF-ANALYSIS.md` (Audience Reach: 4/10, Retention: ?/10)

---
*Created: 2026-02-12*
