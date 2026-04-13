# Phase 35: Content Refresh & New Dossiers

**Goal:** Bring PepCodex current with Feb-Mar 2026 developments. New dossiers for recently approved/near-approval peptides, update 15+ stale dossiers, publish high-priority blog posts addressing trending topics and misinformation.

**Informed by:** 10-agent research swarm (`.planning/RESEARCH-SWARM-2026-03-19.md`)

**Depends on:** None (independent of v6.0 phases)

---

## Sub-Phase A: New Dossiers (6 new peptides → 92 → 98)

Create full dossiers following existing template pattern in `src/content/peptides/`.

| # | Compound | Slug | Category | Why |
|---|----------|------|----------|-----|
| 1 | **Rusfertide** | `rusfertide` | hematology | Hepcidin mimetic. NDA under FDA Priority Review (decision ~Aug 2026). Phase 3 VERIFY: 77% response. Takeda/Protagonist. |
| 2 | **PF-08653944** | `pf-08653944` | glp-1 | Pfizer's monthly GLP-1 RA. Phase 2b: 12.3% weight loss at 28 weeks. 10 Phase 3 trials planned 2026. |
| 3 | **Klotho** | `klotho` | longevity | Anti-aging protein. 15-20% lifespan extension in mice. Primate cognition data (Nature Aging). Klotho Neurosciences pipeline. |
| 4 | **MK-0616** | `mk-0616` | cardiovascular | Oral macrocyclic PCSK9 inhibitor. Phase 3 CORALreef (~17K patients). >60% LDL-C reduction. First oral peptide PCSK9 drug. |
| 5 | **Ecnoglutide** | `ecnoglutide` | glp-1 | Sciwind's long-acting GLP-1. Phase 3. 14.7% weight loss at 26 weeks. Primarily China market. |
| 6 | **PEG-MGF** | `peg-mgf` | growth-hormone | PEGylated Mechano Growth Factor. Named as 1 of 5 Category 2 restricted peptides. Regulatory relevance + fitness community interest. |

**Deferred (not enough audience fit):**
- Icotrokinra — FDA approved but autoimmune dermatology niche, not our audience
- Navepegritide — FDA approved but ultra-rare pediatric bone disease
- Efocipegtrutide — Phase 2 triple agonist, too early + overlaps retatrutide
- Tat-Beclin-1 — Interesting longevity peptide but preclinical only, thin evidence

**Deliverables per dossier:**
- Full MDX file with standard frontmatter (title, category, evidence_level, status, etc.)
- Mechanism of action, clinical evidence, safety profile, regulatory status sections
- Real citations (PMIDs/DOIs from research swarm sources)
- Cross-links to related dossiers
- Calculator preset entry in `data/calculator-presets.json` (where applicable)
- Comparison pages auto-generated for category peers

**Acceptance criteria:**
- [ ] 6 new `.mdx` files in `src/content/peptides/`
- [ ] All build successfully (`npm run build`)
- [ ] Each has 5+ real citations with PMIDs/DOIs
- [ ] Cross-links resolve
- [ ] Evidence grading applied (high/moderate/low/very-low)

---

## Sub-Phase B: Dossier Updates (15 existing peptides)

Update existing dossiers with new data from research swarm. Grouped by priority.

### Critical (data is significantly stale)

| # | Dossier | Key Updates | Sources |
|---|---------|-------------|---------|
| 1 | **ss-31.mdx** | FDA APPROVED (FORZINITY) for Barth syndrome Sept 2025. First mitochondria-targeted drug. NuPower Phase 3 ongoing. 8-year follow-up data. | Stealth BioTherapeutics press release, JHU Hub, UMDF |
| 2 | **semaglutide.mdx** | Oral Wegovy 25mg approved Dec 2025 ($149/mo, ~400K patients). MASH approval. AKI safety signal (FAERS). Patent cliff Mar 2026 (India/Canada/China/Brazil/Turkey). | CNBC, Novo press release, PMC 12610529, Reuters |
| 3 | **retatrutide.mdx** | TRIUMPH-4 Phase 3: 28.7% weight loss + 75.8% knee pain reduction. TRANSCEND-T2D-1 Phase 3 results. Dysesthesia safety signal (20.9%). 6 more Phase 3 readouts coming. | Lilly investor release, BioSpace, CNBC |
| 4 | **orforglipron.mdx** | ATTAIN-1/2/MAINTAIN Phase 3 complete. Head-to-head vs oral semaglutide (Lancet Feb 2026). FDA decision imminent (Priority Review). | NEJM, Lancet, Lilly investor release |
| 5 | **cagrisema.mdx** | NDA filed Dec 2025. REDEFINE 4 failed to beat tirzepatide (23% vs 25.5%). Higher-dose trial planned H2 2026. | NEJM, CNBC, Novo press release |

### High Priority

| # | Dossier | Key Updates | Sources |
|---|---------|-------------|---------|
| 6 | **tirzepatide.mdx** | SURMOUNT-5 head-to-head beat semaglutide (-20.2% vs -13.7%). EMA HFpEF label update. MASH Phase 2 data. | NEJM, EMA, Lilly investor release |
| 7 | **bpc-157.mdx** | First human IV safety data (n=2, PMID 40131143). STAT/Undark investigation (single-lab concern). Orthopaedic systematic review (36 studies). FDA reclassification to Category 1 pending. | PubMed, STAT News, Undark, PMC 12313605 |
| 8 | **foxo4-dri.mdx** | 3 new 2025 publications: NMR structural study (Nature Comms), vascular aging reversal, keloid application (Comms Biology). | Nature Comms, Frontiers, Comms Biology |
| 9 | **epithalon.mdx** | Biogerontology 2025 study: telomere extension via hTERT. ALT activation in cancer cells = safety concern. | PMC 12411320 |
| 10 | **pemvidutide.mdx** | FDA Breakthrough Therapy Designation for MASH (Jan 2026). Phase 3 program design agreed. | Altimmune press release |
| 11 | **vk2735.mdx** | VANQUISH-1 enrollment complete (~4,650 patients). Oral Phase 3 planned Q3 2026. | Viking press release, Nasdaq |

### Medium Priority

| # | Dossier | Key Updates | Sources |
|---|---------|-------------|---------|
| 12 | **thymosin-alpha-1.mdx** | 2025 expert consensus (10 recommendations). Meta-analysis in severe acute pancreatitis (706 patients). | Frontiers Immunol, LWW journals |
| 13 | **maritide.mdx** | Phase 2 NEJM publication. MARITIME Phase 3 enrolling. Expanded indications (CV, HF, kidney, OSA). | NEJM, Amgen press release |
| 14 | **amycretin.mdx** | Phase 2 T2D data (Nov 2025). Phase 3 initiated Q1 2026 for both SC and oral. | FierceBiotech, Novo press release |
| 15 | **survodutide.mdx** | FDA Breakthrough Therapy for MASH. SYNCHRONIZE Phase 3 underway. LIVERAGE MASH program. | Boehringer press release |

**Acceptance criteria:**
- [ ] 15 dossiers updated with new sections/data
- [ ] All new claims have real citations
- [ ] Regulatory status fields current
- [ ] Build passes

---

## Sub-Phase C: Blog Posts (10 articles, priority-ordered)

### Tier 1: Publish First (high search volume NOW)

| # | Title | Type | Key Sources |
|---|-------|------|-------------|
| 1 | **"FDA Peptide Reclassification 2026: What Actually Changed (and What Didn't)"** | Regulatory explainer | Meto, PeptideLaws, Formation Med, LumaLex Law |
| 2 | **"The Wolverine Stack: What BPC-157 + TB-500 Actually Does — Evidence Review"** | Misinformation counter | PMC 12313605, PMC 12446177, STAT, GlobalRPH |
| 3 | **"Compounded GLP-1s in 2026: Safety Data, Legal Status, and the Crackdown"** | Safety/regulatory | FBI IC3 PSA, FAERS PMID 40285721, Fierce Pharma, CNBC |

### Tier 2: Publish Within 2 Weeks

| # | Title | Type | Key Sources |
|---|-------|------|-------------|
| 4 | **"Retatrutide Phase 3: 28.7% Weight Loss and a New Safety Signal"** | Trial results | Lilly investor release, BioSpace, CNBC |
| 5 | **"The Oral GLP-1 Race: Orforglipron vs Oral Wegovy vs Aleniglipron"** | Pipeline comparison | NEJM, Lancet, Structure Therapeutics, Novo |
| 6 | **"SS-31 Gets FDA Approval: The First Mitochondria-Targeted Drug"** | Approval coverage | Stealth BioTherapeutics, JHU Hub, UMDF |
| 7 | **"CagriSema vs Tirzepatide: What REDEFINE 4 Tells Us"** | Trial analysis | NEJM, CNBC, PharmExec |

### Tier 3: Publish Within 1 Month

| # | Title | Type | Key Sources |
|---|-------|------|-------------|
| 8 | **"Gray-Market Peptides: What TikTok Isn't Telling You About Safety Risks"** | Safety/misinformation | TechBuzz, CNN, FBI IC3, contamination data |
| 9 | **"Semaglutide Patent Cliff: What 40+ Indian Biosimilars Mean"** | Market analysis | Reuters, IQVIA, C&EN |
| 10 | **"FOXO4-DRI in 2026: Three New Studies Advance the Senolytic Peptide"** | Research update | Nature Comms, Frontiers, Comms Biology |

**Per blog post:**
- Standard blog MDX format with frontmatter (title, date, category, tags, sources)
- 800-1,500 words
- 3-6 real citations minimum
- Cross-links to relevant dossiers
- Evidence-based, no medical advice, clear disclaimers

**Acceptance criteria:**
- [ ] 10 blog posts in `src/content/blog/`
- [ ] All build successfully
- [ ] Each has 3+ real citations with PMIDs/DOIs/URLs
- [ ] Cross-links to existing dossiers
- [ ] No banned content (dosing, sourcing, medical advice)

---

## Sub-Phase D: Regulatory Status Updates (All 92+ dossiers)

Add/update FDA reclassification status across all affected dossiers. This is a frontmatter-level update, not full content rewrites.

### Category 1 Returnees (update regulatory status)
BPC-157, TB-500, Thymosin Alpha-1, KPV, AOD-9604, MOTS-C, GHK-Cu, Epithalon, Semax, Selank, Kisspeptin, DSIP, Ipamorelin, LL-37

### Category 2 Remaining (verify safety warnings present)
Melanotan II, GHRP-2, GHRP-6, CJC-1295, PEG-MGF

### Newly Approved (update status to "FDA approved")
SS-31 (Barth syndrome)

**Note:** Formal FDA rule not yet published. Add "pending formal publication" caveat to all reclassification mentions.

**Acceptance criteria:**
- [ ] 14 dossiers updated with Category 1 pending status
- [ ] 5 Category 2 dossiers verified for safety warnings
- [ ] SS-31 marked as FDA approved
- [ ] All frontmatter `approval_status` fields current
- [ ] Build passes

---

## Execution Order

```
Sub-Phase A (New Dossiers)     ████████ ~3-4 sessions
Sub-Phase B (Dossier Updates)  ████████ ~2-3 sessions
Sub-Phase C (Blog Posts)       ████████ ~3-4 sessions
Sub-Phase D (Regulatory)       ████     ~1 session
```

A and C can run in parallel. B depends on A (new dossiers referenced in updates). D can run anytime.

**Recommended sequence:** A → B + C (parallel) → D

---

## Page Count Impact

| Content Type | Current | Add | New Total |
|-------------|---------|-----|-----------|
| Peptide dossiers | 92 | +6 | 98 |
| Blog posts | 151 | +10 | 161 |
| Comparisons | ~279 | +~20 (auto from new dossiers) | ~299 |
| **Net new pages** | | **~36** | |

---

## Quality Gates

- [ ] All new content has real, verifiable citations (PMIDs/DOIs)
- [ ] Evidence grading applied to all new dossiers
- [ ] No banned content (dosing, sourcing, medical advice)
- [ ] `npm run build` passes with 0 errors
- [ ] Cross-link validator shows 0 structural errors
- [ ] Schema validation passes for new pages

---

## Key Sources Reference

Full source list with 200+ URLs in `.planning/RESEARCH-SWARM-2026-03-19.md`

---

*Created: 2026-03-19*
*Research basis: 10-agent swarm covering FDA, GLP-1 pipeline, novel compounds, Reddit, clinical trials, healing, longevity, social media, industry, and safety*
