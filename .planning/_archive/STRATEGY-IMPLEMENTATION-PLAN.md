# STRATEGY IMPLEMENTATION PLAN
## Phase 3: Strategy Library Execution

**Generated:** 2026-02-01
**Based on:** 21 strategies from competitive intel + current Pepcodex state

---

# CURRENT STATE AUDIT

## Components Already Built

Based on codebase scan, Pepcodex has these components:

| Component | Status | Notes |
|-----------|--------|-------|
| EvidenceBadge.astro | ✅ Built | Strategy 9 partially done |
| FAQSchema.astro | ✅ Built | Strategy 8 infrastructure ready |
| BreadcrumbSchema.astro | ✅ Built | Strategy 7 partial |
| OrganizationSchema.astro | ✅ Built | Strategy 7 partial |
| ArticleSchema.astro | ✅ Built | Strategy 7 partial |
| ItemListSchema.astro | ✅ Built | Strategy 7 partial |
| ComparisonLayout.astro | ✅ Built | Strategy 1 infrastructure ready |
| GlossaryLayout.astro | ✅ Built | Strategy 5 infrastructure ready |
| DisclaimerBanner.astro | ✅ Built | Trust signals ready |
| CookieConsent.astro | ✅ Built | Legal done |
| NewsletterForm.astro | ✅ Built | Strategy 16 infrastructure ready |
| InteractionMatrix.astro | ✅ Built | Phase 15 ready |
| EvidenceChain.astro | ✅ Built | Differentiator ready |
| Timeline.astro | ✅ Built | Phase 19 ready |
| QualityChecklist.astro | ✅ Built | Phase 19 ready |
| MolecularStructure.astro | ✅ Built | Phase 16 ready |
| Calculator pages | ✅ Built | 3 calculators exist |
| Compare pages | ✅ Built | `/compare/[...slug].astro` exists |
| Glossary pages | ✅ Built | `/glossary/[...slug].astro` exists |
| Condition pages | ✅ Built | `/peptides/[peptide]/[condition].astro` exists |
| City/clinic pages | ✅ Built | `/clinics/[city].astro` exists |

## Pages Already Exist

| Page | URL | Status |
|------|-----|--------|
| Methodology | /methodology | ✅ Exists |
| Editorial Policy | /editorial-policy | ✅ Exists |
| Disclaimer | /disclaimer | ✅ Exists |
| Privacy | /privacy | ✅ Exists |
| Terms | /terms | ✅ Exists |
| FDA Notice | /fda-notice | ✅ Exists |
| Cookie Policy | /cookie-policy | ✅ Exists |
| Calculator Hub | /calculator | ✅ Exists |
| Directory | /directory | ✅ Exists |
| Contact | /contact | ✅ Exists |
| About | /about | ✅ Exists |
| Newsletter | /newsletter | ✅ Exists |

---

# STRATEGY STATUS RECONCILIATION

## ✅ ALREADY IMPLEMENTED (Skip)

| # | Strategy | Status | Evidence |
|---|----------|--------|----------|
| 10 | Methodology Page | ✅ DONE | `/methodology.astro` exists |
| 11 | Editorial Team Page | ✅ DONE | `/editorial-policy.astro` exists |
| 17 | Sponsor Directory | ✅ DONE | `/directory.astro` exists |

---

## 🟡 INFRASTRUCTURE EXISTS, NEEDS CONTENT/SCALE

### Strategy 1: Comparison Page Network
| Aspect | Status |
|--------|--------|
| Template | ✅ ComparisonLayout.astro exists |
| Dynamic routing | ✅ `/compare/[...slug].astro` exists |
| **Needs** | Content generation for 100 pages |

**Action Items:**
```
[ ] Audit current comparison page count (claimed 11 in STATE.md)
[ ] Create comparison generation script
[ ] Generate Tier 1 priority pairs (20)
[ ] Generate Tier 2 category pairs (80)
[ ] Verify FAQSchema integration on comparison pages
```

---

### Strategy 5: Glossary Hub
| Aspect | Status |
|--------|--------|
| Template | ✅ GlossaryLayout.astro exists |
| Dynamic routing | ✅ `/glossary/[...slug].astro` exists |
| Hub page | ✅ `/glossary/index.astro` exists |
| **Needs** | Term content (target: 50-100 terms) |

**Action Items:**
```
[ ] Audit current glossary term count
[ ] Create term generation script
[ ] Generate 50 starter terms
[ ] Add DefinedTerm schema
[ ] Cross-link glossary ↔ peptide pages
```

---

### Strategy 6: Condition Research Pages
| Aspect | Status |
|--------|--------|
| Template | ✅ `/peptides/[peptide]/[condition].astro` exists |
| **Needs** | Condition content (target: 20 conditions × 188 peptides) |

**Action Items:**
```
[ ] Audit current condition page count
[ ] Create condition generation script
[ ] Generate 20 condition hub pages
[ ] Generate cross-product pages
[ ] Verify bidirectional linking
```

---

### Strategy 8: FAQPage Schema at Scale
| Aspect | Status |
|--------|--------|
| Schema component | ✅ FAQSchema.astro exists |
| **Needs** | Add FAQs to all 188 peptide pages |

**Action Items:**
```
[ ] Audit how many peptide pages have FAQs
[ ] Create FAQ generation prompt
[ ] Add 5 FAQs to each peptide dossier
[ ] Verify schema validates in Google Rich Results Test
```

---

### Strategy 9: Evidence Grade Prominence
| Aspect | Status |
|--------|--------|
| Badge component | ✅ EvidenceBadge.astro exists |
| Evidence chain | ✅ EvidenceChain.astro exists |
| **Needs** | Prominent hero placement + study breakdown |

**Action Items:**
```
[ ] Audit current evidence badge placement
[ ] Update DossierLayout to show badge in hero
[ ] Add study breakdown (X human, Y animal, Z in-vitro)
[ ] Link to methodology page from badge
```

---

### Strategy 16: Newsletter Growth
| Aspect | Status |
|--------|--------|
| Form component | ✅ NewsletterForm.astro exists |
| Newsletter page | ✅ /newsletter exists |
| Beehiiv | ✅ Integrated |
| **Needs** | Email capture placement + welcome sequence |

**Action Items:**
```
[ ] Audit current signup form placement
[ ] Add exit-intent capture
[ ] Create welcome email sequence in Beehiiv
[ ] Add social proof counter
```

---

## 🔴 NOT YET BUILT

### Strategy 2: Research Summary Subpages
| Aspect | Status |
|--------|--------|
| Template | ❌ Does not exist |
| Routing | ❌ No `/peptides/[slug]/research-summary` |
| **Needs** | Full template + content generation |

**Action Items:**
```
[ ] Create ResearchSummaryLayout.astro
[ ] Add dynamic route /peptides/[slug]/research-summary.astro
[ ] Design component structure per TEMPLATE-SPECIFICATIONS.md
[ ] Generate for all 188 peptides
```

---

### Strategy 3: Related Research Subpages
| Aspect | Status |
|--------|--------|
| Template | ❌ Does not exist |
| Routing | ❌ No `/peptides/[slug]/related-research` |
| **Needs** | Full template + content generation |

**Action Items:**
```
[ ] Create RelatedResearchLayout.astro
[ ] Add dynamic route /peptides/[slug]/related-research.astro
[ ] Design component structure per TEMPLATE-SPECIFICATIONS.md
[ ] Generate for all 188 peptides
```

---

### Strategy 4: Calculator URL Multiplication
| Aspect | Status |
|--------|--------|
| Calculators | ✅ 3 calculators exist |
| Peptide-specific URLs | ❌ No `?peptide={slug}` routing |
| HowTo schema | ❌ Not implemented |
| **Needs** | Parameter routing + HowTo schema |

**Action Items:**
```
[ ] Add ?peptide parameter handling to calculators
[ ] Pre-fill calculator based on peptide data
[ ] Add HowTo schema to calculator pages
[ ] Generate sitemap entries for peptide-specific URLs
[ ] Add "View Research Profile" CTA
```

---

### Strategy 7: Deep Schema Implementation
| Aspect | Status |
|--------|--------|
| Organization | ✅ OrganizationSchema.astro |
| BreadcrumbList | ✅ BreadcrumbSchema.astro |
| Article | ✅ ArticleSchema.astro |
| FAQPage | ✅ FAQSchema.astro |
| WebSite with SearchAction | ❌ Missing |
| MedicalWebPage | ❌ Missing |
| Drug | ❌ Missing |
| HowTo | ❌ Missing |
| **Needs** | 4 additional schema types |

**Action Items:**
```
[ ] Create WebSiteSchema.astro with SearchAction
[ ] Create MedicalWebPageSchema.astro
[ ] Create DrugSchema.astro
[ ] Create HowToSchema.astro
[ ] Add to appropriate page templates
```

---

### Strategy 12: Last Updated Dates
| Aspect | Status |
|--------|--------|
| Frontmatter field | ⚠️ May exist |
| Visual display | ❌ Not prominently shown |
| **Needs** | Add visible date to all pages |

**Action Items:**
```
[ ] Audit frontmatter for lastUpdated field
[ ] Add field if missing
[ ] Update DossierLayout to show date prominently
[ ] Add to meta description
```

---

### Strategy 13: Bioregulator Focus
| Aspect | Status |
|--------|--------|
| Content | ⚠️ Unknown coverage |
| **Needs** | Audit + comprehensive dossiers for 8 bioregulators |

**Action Items:**
```
[ ] Audit existing bioregulator coverage
[ ] Create/update dossiers for: Epithalon, Thymalin, Cortexin,
    Pinealon, Vilon, Livagen, Prostamax, Kristagen
[ ] Add bioregulator category page
```

---

### Strategy 14: GLP-1 Deep Coverage
| Aspect | Status |
|--------|--------|
| Content | ⚠️ Unknown depth |
| **Needs** | Comprehensive dossiers for 5 GLP-1s |

**Action Items:**
```
[ ] Audit existing GLP-1 coverage depth
[ ] Enhance: Semaglutide, Tirzepatide, Retatrutide, Liraglutide, Exenatide
[ ] Add more citations, clinical trial links
[ ] Create GLP-1 comparison pages
```

---

### Strategy 15: Reddit Authority Building
| Aspect | Status |
|--------|--------|
| Account | ❌ Unknown if exists |
| Karma | ❌ Unknown |
| **Needs** | Account creation + karma building plan |

**Action Items:**
```
[ ] Create or identify Reddit account
[ ] Begin Phase 1 (lurk + helpful comments)
[ ] Track karma progress
[ ] Set up monitoring for peptide questions
```

---

### Strategy 18: Category Sponsorship Slots
| Aspect | Status |
|--------|--------|
| Template slot | ❌ Not implemented |
| **Needs** | Add sponsor slot to category pages |

**Action Items:**
```
[ ] Design SponsorSlot.astro component
[ ] Add to category page templates
[ ] Leave empty initially (fill when sponsors exist)
```

---

### Strategy 19: Meta Robots Optimization
| Aspect | Status |
|--------|--------|
| max-snippet | ❌ Unknown |
| max-image-preview | ❌ Unknown |
| **Needs** | Audit + add to BaseLayout |

**Action Items:**
```
[ ] Audit current meta robots tags
[ ] Add max-snippet:-1, max-image-preview:large to BaseLayout
```

---

### Strategy 20: Sitemap in Robots.txt
| Aspect | Status |
|--------|--------|
| robots.txt | ⚠️ Unknown |
| Sitemap declaration | ❌ Unknown |
| **Needs** | Verify/add sitemap line |

**Action Items:**
```
[ ] Check robots.txt for sitemap declaration
[ ] Add if missing: Sitemap: https://pepcodex.com/sitemap.xml
```

---

### Strategy 21: Internal Linking Audit
| Aspect | Status |
|--------|--------|
| Current link count | ⚠️ Unknown |
| Target | 15+ links per page |
| **Needs** | Audit + enhancement |

**Action Items:**
```
[ ] Audit average internal links per peptide page
[ ] Create internal linking component
[ ] Ensure 5+ related peptides linked
[ ] Add cross-links to comparisons, conditions
```

---

# REVISED PRIORITY MATRIX

## Based on Current State

### Tier 1: Quick Wins (Already Have Infrastructure)
| # | Strategy | Effort Now | Impact |
|---|----------|------------|--------|
| 19 | Meta Robots | 15 min | 2 |
| 20 | Sitemap Robots | 5 min | 1 |
| 12 | Last Updated | 1 hour | 2 |
| 9 | Evidence Grade Prominence | 2 hours | 4 |

**Total: ~4 hours**

---

### Tier 2: Scale Existing Templates (Medium Effort)
| # | Strategy | Effort Now | Impact |
|---|----------|------------|--------|
| 1 | Comparison Pages (100) | 4 hours (generation) | 5 |
| 5 | Glossary Terms (50) | 3 hours (content) | 3 |
| 8 | FAQs to All Pages | 4 hours (generation) | 4 |
| 6 | Condition Pages | 4 hours (generation) | 5 |

**Total: ~15 hours**

---

### Tier 3: Build New Templates
| # | Strategy | Effort Now | Impact |
|---|----------|------------|--------|
| 2 | Research Summary Subpages | 6 hours | 4 |
| 3 | Related Research Subpages | 6 hours | 4 |
| 4 | Calculator URL Multiplication | 4 hours | 4 |
| 7 | Missing Schema Types | 4 hours | 3 |

**Total: ~20 hours**

---

### Tier 4: Content Depth
| # | Strategy | Effort Now | Impact |
|---|----------|------------|--------|
| 13 | Bioregulator Focus | 8 hours | 4 |
| 14 | GLP-1 Deep Coverage | 8 hours | 5 |

**Total: ~16 hours**

---

### Tier 5: Ongoing/Parallel
| # | Strategy | Effort/Week | Impact |
|---|----------|-------------|--------|
| 15 | Reddit Building | 3 hours | 4 |
| 16 | Newsletter Growth | 2 hours | 4 |
| 21 | Internal Linking | 2 hours | 3 |

**Total: ~7 hours/week ongoing**

---

# INTEGRATED EXECUTION PLAN

## Week 1: Quick Wins + Foundation

### Day 1-2: Quick Wins (4 hours)
```
[ ] Strategy 19: Add meta robots to BaseLayout
[ ] Strategy 20: Add sitemap to robots.txt
[ ] Strategy 12: Add last updated dates prominently
[ ] Strategy 9: Move evidence badge to hero section
```

### Day 3-5: Scale Comparisons (6 hours)
```
[ ] Strategy 1: Audit current comparison count
[ ] Strategy 1: Generate 20 Tier 1 priority pairs
[ ] Strategy 1: Generate 30 Tier 2 category pairs
```

---

## Week 2: Content Scaling

### Day 1-3: Glossary + FAQs (7 hours)
```
[ ] Strategy 5: Generate 50 glossary terms
[ ] Strategy 8: Add FAQs to top 50 peptides
```

### Day 4-5: Condition Pages (4 hours)
```
[ ] Strategy 6: Generate 20 condition hub pages
[ ] Strategy 6: Verify bidirectional linking
```

---

## Week 3: New Templates

### Day 1-3: Research Summary (8 hours)
```
[ ] Strategy 2: Create ResearchSummaryLayout.astro
[ ] Strategy 2: Add routing
[ ] Strategy 2: Generate for top 50 peptides
```

### Day 4-5: Related Research (6 hours)
```
[ ] Strategy 3: Create RelatedResearchLayout.astro
[ ] Strategy 3: Add routing
[ ] Strategy 3: Generate for top 50 peptides
```

---

## Week 4: Technical + Content

### Day 1-2: Calculator Enhancement (4 hours)
```
[ ] Strategy 4: Add ?peptide parameter handling
[ ] Strategy 4: Add HowTo schema
[ ] Strategy 4: Generate sitemap entries
```

### Day 3-4: Missing Schemas (4 hours)
```
[ ] Strategy 7: Create WebSiteSchema.astro
[ ] Strategy 7: Create MedicalWebPageSchema.astro
[ ] Strategy 7: Create DrugSchema.astro
```

### Day 5: Content Deep Dive Start
```
[ ] Strategy 14: Audit GLP-1 coverage
[ ] Strategy 14: Enhance Semaglutide dossier
```

---

## Ongoing (Parallel)

```
Daily:
[ ] Strategy 15: Reddit commenting (30 min)

Weekly:
[ ] Strategy 16: Newsletter content (2 hours)
[ ] Strategy 21: Internal linking improvements (2 hours)

Monthly:
[ ] Strategy 13: Add 2 bioregulator dossiers
[ ] Strategy 14: Add 1 GLP-1 enhancement
```

---

# SUCCESS METRICS

## Week 1 Targets
- [ ] Meta robots updated
- [ ] Robots.txt has sitemap
- [ ] Last updated visible on all pages
- [ ] Evidence badge in hero
- [ ] 50 comparison pages live

## Week 2 Targets
- [ ] 50 glossary terms
- [ ] 50 peptides have FAQs
- [ ] 20 condition hub pages

## Week 3 Targets
- [ ] Research summary template live
- [ ] 50 research summary pages
- [ ] Related research template live
- [ ] 50 related research pages

## Week 4 Targets
- [ ] Calculator URLs multiplied (376 new)
- [ ] All schema types implemented
- [ ] GLP-1 coverage enhanced

## End of Month Targets
- [ ] 500+ karma on Reddit
- [ ] 50+ newsletter subscribers
- [ ] 300+ new pages total
- [ ] 5+ FAQ rich results appearing

---

# V4.0 ROADMAP INTEGRATION

## Updated Phase Mapping

| v4.0 Phase | Strategies Integrated |
|------------|----------------------|
| Phase 13: Legal Foundation | ✅ Already done (10, 11 complete) |
| Phase 14: Calculator Suite | +4 (URL multiplication), +7 (HowTo schema) |
| Phase 15: Peptide Interactions | No change |
| **NEW Phase 15.5: Subpage Multiplication** | +2, +3 |
| **NEW Phase 15.7: Comparison Network** | +1, +8 (scale) |
| Phase 16: Dossier UX | +9, +12 |
| Phase 17: Content Migration | No change |
| Phase 18: Multi-Peptide Protocols | No change |
| **NEW Phase 18.5: Glossary Hub** | +5 (scale) |
| Phase 19: Enhanced UX | No change |
| Phase 20: Condition Pages | +6 (scale) |
| Phase 21: Location SEO | +17, +18 |
| Phase 22: SEO Polish | +7, +19, +20, +21 |

---

*Strategy Implementation Plan Complete | Generated 2026-02-01*
