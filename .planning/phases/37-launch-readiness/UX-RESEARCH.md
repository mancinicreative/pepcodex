# PepCodex / PepTracker — UX Strategy (Launch Readiness)

*Phase 37 · Synthesized 2026-06-26 · Grounded against verified code + `CURRENT-STATE-AUDIT-2026-06-26.md` + STATE.md design backlog*
*Research lenses: evidence-display · monograph-IA · catalogue-discovery · hub-to-tools-bridge*

---

## Executive summary

PepCodex is a mature, launchable evidence-hub (102 dossiers, 279 comparisons, faceted listing, regulatory + trials trackers) whose "specimen catalogue" rebrand already implements an unusual number of the patterns that Examine, Cochrane, Drugs.com, ClinicalTrials.gov and MDCalc are celebrated for. The strategic question is **not "what to build" but "what to finish and surface."** Three of the four design-backlog items are *already partially coded* (`EvidenceKey`, `InteractionMatrix`, `RatingCard`) — the leverage is rollout and wiring, not net-new components.

The single highest-value structural move (echoed by **every** research lens) is the **per-outcome evidence matrix** — one row per condition, with evidence grade, effect direction, study count, and a per-row citation drawer. PepCodex already carries `conditions[]` per dossier but renders evidence as prose + a single overall card. Rendering conditions as a sortable matrix (Examine's Human Effect Matrix / Cochrane's Summary of Findings) is the defining pattern of the category and doubles as a fabricated-citation audit surface — directly attacking the #1 launch blocker (citation integrity across ~80 dossiers).

The rebrand already nails the **5-second verdict box** (`verdictLine` + `RatingCard`), **redundant grade encoding** (label + /100 + color + dots), **provenance chrome** (`lastRevised` + "How we rate" link), the **left-rail faceted listing**, the **severity-color interaction idiom**, and **inline content-matched newsletter capture**. Do not re-recommend these; credit and extend them.

Prioritization:
- **(A) V1 launch-polish** — fix the broken/stub surfaces, wire the *existing* `TableOfContents` into dossiers, add result counts to listing facets, ship the `EvidenceKey` legend, promote Regulatory + Methodology into nav. All low-effort, ship with the rebrand.
- **(B) V1.5 fast-follow** — the per-outcome condition matrix, counted "Appears in N" backlinks, condition/goal browse hubs, and the two-axis scoring rollout (19→102) gated behind citation verification.
- **(C) V2** — the data-hub→tools bridge: a top-level `/tools` hub, bidirectional evidence-wrapped tool↔dossier linking, and ungated tools as the lead magnet with optional double-opt-in email.

Critically: **the citation-integrity blocker outranks all UX work.** Adding more evidence-graded UI (matrices, scores) on top of unverified PMIDs amplifies the misleading "view on PubMed" links. Sequence verification *before* the V1.5 matrix rollout.

---

## What PepCodex already does well (vs best practice)

Credit where the rebrand already meets or beats the reference sites — **do not re-recommend these**:

| Best-practice pattern | Who does it | PepCodex implementation (verified) | Verdict |
|---|---|---|---|
| 5-second bottom-line verdict above the evidence | Cochrane PLS, ConsumerLab | `DossierLayout` computes `verdictLine` ("Preclinical evidence only" / "N human studies") + a verdict/evidence card above the body | **Nailed** — just needs the plain-language *prose* sentence (see A6) |
| Redundant grade encoding (letter + number + color) | Examine (A–F), Labdoor (0–100) | `RatingCard`: Evidence /100 + label chip + per-dimension bars + color; `EvidenceKey` adds ●●●○ dot scale | **Nailed** — strongest single asset; just under-rolled-out (19/102) |
| Separate axes scored independently | Labdoor (5 axes), Examine (consistency vs magnitude) | Two-axis rubric v2.4: Evidence axis (5 sub-dims) **distinct from** Effectiveness axis with explicit `basis` (community-reported vs clinical vs not-established) | **Nailed** — this is genuinely best-in-class; finish the rollout |
| Provenance & freshness chrome | Healthline, DailyMed revision codes | `lastRevised` date + "How we rate →" link to `/methodology` on every dossier | **Mostly there** — add a visible "last reviewed" + reviewer/verification signal (see D) |
| Left-rail faceted filtering | ClinicalTrials.gov, PubChem | `/peptides` Category / Evidence / Type filter rows + A–Z | **Present** — missing only per-value result counts (see A4) |
| Severity-color interaction idiom | Drugs.com, Medscape, Stockley's | `InteractionMatrix`: synergistic/compatible/caution/avoid, color + dot + legend + per-cell PMID + no-dosing disclaimer | **Nailed** — already on-brand and citation-aware |
| Lean citation: aggregate then drill down | Examine, Healthline | `RatingCard` shows source mix %; `CitationTable` holds full PMID/DOI list | **Mostly there** — group citations *per outcome* when the matrix lands (B1) |
| Certainty-graded verb ladder ("may" vs "reduces") | GRADE Guidelines 26 | Partially — `sourcing-rules` skill governs prose | **Gap** — bake the verb ladder into qa scripts (B5) |
| Inline content-matched email capture | kit.com, ivyforms | `NewsletterForm` inline; `ExitIntentPopup` one-time, no mid-read triggers (Phase 36 chunk 8) | **Nailed** — correct ethical default already shipped |
| Auto-generated TOC for long docs | MedlinePlus, RxList, Lexicomp | `TableOfContents` component exists and is wired into Blog/Safety/Guide/Protocol layouts | **Built but NOT wired into dossiers** — the one place it matters most (A2) |

---

## (A) V1 LAUNCH-POLISH — ship with the rebrand (low-effort)

| # | Recommendation | Pattern + who does it well | Maps to current component | Effort | Impact |
|---|---|---|---|---|---|
| A1 | **Repoint or remove the `/directory` "Coming Soon" stub** in primary nav; point the slot at `/clinics` (52 live listings) or drop it. Free the slot for Regulatory/Methodology (A5). | Hub-and-spoke: never link a dead destination (MDCalc /all never dumps a stub) | `BaseLayout.astro:167,256` | S | High — removes a broken promise on the primary nav |
| A2 | **Wire the existing `TableOfContents` into `DossierLayout`** as a desktop sticky "On this page" sidebar + mobile jump menu. It already auto-generates from `<h2>/<h3>` and ships in 4 other layouts. | Sticky jump-link TOC (MedlinePlus, RxList, Lexicomp Outline) | `TableOfContents.astro` (exists) → import into `DossierLayout` | S | High — dossiers are the longest pages and currently have no in-page nav |
| A3 | **Fix dead `href="#"` anchors** on the peptide×condition pages ("On This Page" links pointing nowhere). | Jump links must resolve (DailyMed View-All) | `peptides/[peptide]/[condition].astro:290,294,299` | S | Med — broken nav on programmatic pages |
| A4 | **Add per-value result counts to listing facets** ("High (23)", "Metabolic (31)"). Facets exist as buttons; add the count beside each value and order most-used first (NN/g prioritization). | Left-rail facets with live counts (ClinicalTrials.gov, PubChem) | `peptides/index.astro` filter rows | S | High — sets expectations, prevents zero-result dead ends |
| A5 | **Promote Regulatory Tracker + Methodology into primary nav.** Both are differentiators currently buried (Regulatory only via a tab on `/trials`; Methodology only in footer). Use the freed Directory slot. | First-class destinations for your moat (MDCalc makes Tools top-level) | `BaseLayout.astro` nav | S | High — surfaces two PMF-flagged differentiators |
| A6 | **Add a one-sentence plain-language verdict** above the `RatingCard` ("The strongest evidence is for X; overall evidence is early/limited; key caveat: animal-only."). `verdictLine` already gives the source-mix descriptor — add the prose layer, jargon-free, no dosing. | Plain-language bottom line first (Cochrane PLS, ConsumerLab) | `DossierLayout` verdict card (`verdictLine` exists) | S–M | High — completes the 5-second read; reuses banned-content guardrails |
| A7 | **Ship the `EvidenceKey` legend** (the dot-scale reading key) on the listing and dossier headers — it already exists and is imported on `/peptides`; ensure it renders near any grade display sitewide. | Fixed legend so no lookup needed (Cochrane pips) | `EvidenceKey.astro` (exists) | S | Med — converts the grade dots into a self-explaining signal |
| A8 | **Remove dead `trackCalculators()` analytics code** referencing removed calculators. | Hygiene | `src/scripts/analytics.ts:26-47,121` | S | Low — prevents console noise / stale events |

**A-tier note on credit:** the verdict box, two-axis card, provenance date, inline newsletter, and exit-popup discipline are *already done well*. A-tier is almost entirely "wire what exists + unbury what's hidden," not new construction.

---

## (B) V1.5 FAST-FOLLOW — the structural wins (gate behind citation verification)

| # | Recommendation | Pattern + who does it well | Maps to current component | Effort | Impact |
|---|---|---|---|---|---|
| B1 | **Per-outcome evidence matrix** — render each dossier's `conditions[]` as a sortable table: *Condition │ Evidence grade │ Direction/magnitude │ N studies (human/animal) │ source tier │ [drawer of PMIDs]*. Keep grade and magnitude as **separate columns**. This is the defining pattern of the category. | Per-outcome grade matrix (Examine Human Effect Matrix, Cochrane Summary of Findings) | New component consuming existing `conditions[]` frontmatter; reuse `EvidenceBadge` + `CitationTable` per row | M–L | **Highest** — makes 10+ citation dossiers scannable; per-row citations become the fabricated-PMID audit surface |
| B2 | **Counted "Appears in N" backlinks** — upgrade `RelatedEntities` to show *"Appears in 4 comparisons"*, *"Studied for 6 conditions"*, *"Compared against X, Y"*, each linked and counted. `comparisonCount` is already computed in `DossierLayout`; generalize it. | Evidence-sorted backlink pages (SUPP.AI entity pages, Wikipedia "What links here") | `RelatedEntities.astro` (exists, no counts) + `DossierLayout` `comparisonCount` (exists) | M | **High** — biggest combined UX + internal-linking-SEO win; turns the catalogue into a graph |
| B3 | **Condition / goal browse hubs as ranked-intervention pages** — each condition page lists every peptide studied for it, ranked by evidence grade (the Examine condition→ranked-interventions move). 15 condition hubs exist; render them as ranked tables, not just prose. | Browse-by-taxonomy (PubChem Classification Browser, Examine 400-condition taxonomy) | `ConditionLayout.astro` + `conditions` collection (exist) | M | **High** — serves goal-driven users ("cognition", "fat loss") + strong SEO on-ramp |
| B4 | **Complete the two-axis scoring rollout (19→102)** — *gated behind B-pre citation verification per dossier.* The `RatingCard` already renders both states cleanly via fallback; the differentiator is just mostly invisible. Unify the listing "Evidence" facet with the new composite (currently uses legacy `evidenceStrength`). | Separate auditable axes (Labdoor, Examine) | `RatingCard.astro` (done) + `scoring:` frontmatter rollout + `qa-scoring` gate (exists) | L | **High** — surfaces the flagship; do NOT roll out on unverified PMIDs |
| B5 | **Certainty-graded verb ladder in qa** — map the 4 grades to a fixed verb vocabulary (high→"reduces/improves"; moderate→"probably/likely"; low→"may"; very-low→"it is unclear whether") and enforce in `qa-citations`/`sourcing-rules` so prose verbs must match frontmatter grade. Zero new UI. | Verb carries the grade (GRADE Guidelines 26) | `sourcing-rules` skill + qa scripts | M | Med–High — makes overclaiming structurally impossible; hardens the fabrication failure mode |
| B6 | **Card ⇄ table view toggle on `/peptides`** — add a dense table view (sortable/reorderable columns: grade, category, regulatory status, # conditions, # trials, score) alongside the existing card grid. The table view is a free catalogue-wide comparison surface. | Coordinated card/table views (ClinicalTrials.gov modernization) | `peptides/index.astro` + `PeptideCard.astro` | M | Med–High — this is the backlog "Plates⇄Ledger toggle"; see verdicts |

**B-tier sequencing (hard rule):** Per the audit, ~15 PMIDs don't resolve and 185 YEAR_MISMATCH flags span 78 files. **B1 (matrix), B3 (ranked hubs), and B4 (scoring rollout) all render per-claim "view on PubMed" links** — shipping them on the current citation base multiplies the misleading-link surface. Run the remediation (data already gathered in `.planning/citation-audit/`) on the flagged dossiers *before* these land, or scope the first matrix rollout to verified dossiers only.

---

## (C) V2 — DATA-HUB → APPS BRIDGE + monetization-adjacent UX

The strategic pivot: PepCodex becomes a pure data hub; standalone apps generate revenue and link bidirectionally. No `/tools` surface exists yet.

| # | Recommendation | Pattern + who does it well | Maps to current component | Effort | Impact |
|---|---|---|---|---|---|
| C1 | **Top-level `/tools` hub, faceted by existing taxonomy** — never a buried list. Filter tools by peptide category, goal/condition, and tool type; keep "New"/"Popular" rails. Reuse the dynamic-route-per-category convention. | Hub-and-spoke tool directory (MDCalc /all, /specialties; GoodRx /compare) | New `/tools` route + nav slot (sibling to `/peptides`) | L | High — gives the "apps generate revenue" model an entry point |
| C2 | **Bidirectional, evidence-wrapped content↔tool linking** — each tool page carries an "Evidence + Related dossiers" panel (real PMIDs, a disclaimer, "Next steps"); each dossier carries a "Tools" module deep-linking the relevant tool pre-filtered to that peptide. Extend `validate-cross-links` to cover content↔tool edges. | Tabbed evidence context on every tool (MDCalc When-to-Use/Evidence/Next-Steps) | Extend `RelatedEntities` contract + `validate-cross-links` script | M | High — keeps users in-ecosystem; converts readers↔tool users both ways |
| C3 | **Ungated tools as the lead magnet** — core output always free; email is an optional value-add ("email me these results", "alert me when new studies change this peptide's grade", "save my stack"). Double opt-in + one-line data-use note. The newsletter becomes an *evidence-update channel*, not a sales drip. | Free tool AS lead magnet, optional email gate (2026 best practice; GoodRx content→utility funnel) | `NewsletterForm` (inline default already correct) + new tool email-capture | M | High — grows the list without undercutting the no-fabrication trust moat |
| C4 | **Reference→utility funnel CTAs at the moment of intent** — on comparison/condition pages, a value-first contextual CTA into the relevant app ("Track these two side-by-side"). Keep reference content complete so the app reads as an upgrade, not a gate. | Editorial-as-on-ramp (GoodRx /drugs → /compare) | `ComparisonLayout` + `ConditionLayout` | M | Med–High — monetization without bait-and-switch |
| C5 | **Unified search across collections** — one Cmd+K box returning grouped tabs (Peptides / Conditions / Comparisons / Tools / Articles), exact-match promoted to top. Search exists (Pagefind/`SearchModal`); add grouping. | Single search box, best-match-first (PubChem) | `SearchModal.astro` + `/api/peptide-search.json` | M | Med — unifies discovery across the now-larger catalogue |

---

## Design-backlog verdicts (the 4 items in STATE.md)

Each evaluated against the research and **verified against actual code**:

### 1. Plates ⇄ Ledger view toggle on listings — **KEEP (refine into B6)**
**Why:** Directly validated by ClinicalTrials.gov's card/table/map modernization — the single proven pattern for serving both browsing ("Plates" = cards) and comparison ("Ledger" = dense table) jobs. The "Ledger" table doubles as a free catalogue-wide comparison surface if columns are sortable. **Refine:** make the Ledger columns sortable/reorderable (grade, category, regulatory, # conditions, # trials, score) and unify its Evidence column with the new two-axis composite, not legacy `evidenceStrength`. Effort M, high impact. Ship in V1.5.

### 2. Comparison/interaction matrix as color-coded grid — **PARTIALLY DONE; refine, don't rebuild**
**Why:** `InteractionMatrix.astro` **already exists** and already implements the best-practice idiom — synergistic/compatible/caution/avoid, color + dot + legend + per-cell PMID + a no-dosing disclaimer (Drugs.com/Medscape/Stockley's severity grammar, kept inside banned-content guardrails). The backlog item as written ("build a color-coded grid") is largely complete. **Refine:** (a) it currently renders as cards, not a true N×N grid — an N×N pairwise grid of common stacks would be the higher-engagement data-viz the backlog imagines; (b) ensure every cell still has a *verified* citation given the fabrication risk. Keep as a small V1.5/V2 enhancement, not a from-scratch build. Do **not** double-build.

### 3. "Appears in N comparisons/conditions" backlinks — **KEEP (high priority; B2)**
**Why:** The strongest backlink validation in the research — SUPP.AI's entire architecture is entity→related-entities-sorted-by-evidence, and Wikipedia's "What links here" is the generic move. PepCodex already has the link graph (`validate-cross-links`, `comparators`, `comparisonCount` computed in `DossierLayout`) but `RelatedEntities` surfaces related items **without counts**. This is the biggest combined UX + internal-linking-SEO win available for the least new construction — just add counts and generalize the existing `comparisonCount` logic to conditions. **Keep, prioritize, ship V1.5.**

### 4. Evidence reading-key legend — **DONE; just deploy it (folds into A7)**
**Why:** `EvidenceKey.astro` **already exists** (the ●●●○ dot scale + vial-fill colors + labels) and is already imported on `/peptides`. The research validates it (Cochrane's filled-circle pips, "fixed legend so no lookup needed"). The backlog item is effectively complete as a component — the only work left is ensuring it renders consistently anywhere a grade appears (dossier header, listing, condition hubs). **Drop from "backlog to build"; reclassify as A7 "deploy consistently."**

**Net:** Two of four backlog items (legend, interaction matrix) are already built and just need deployment/refinement; one (toggle) is a clean V1.5 build; one (backlinks) is the highest-leverage V1.5 priority. The backlog overestimates remaining work because it predates these components landing.

---

## Open questions (owner to confirm)

1. **Citation-verification gating (the dominant decision).** B1/B3/B4 all render per-claim PubMed links. Do we (a) hold those three until the ~20 flagged dossiers are remediated, (b) scope the first matrix rollout to verified dossiers only and expand as verification completes, or (c) ship with a visible "citations under review" badge on un-audited dossiers? Recommendation: (b) — it lets the flagship matrix ship without amplifying the misleading-link risk.

2. **Public name.** Titles/wordmarks say "PepCodex" while the visual identity is "PepTracker." The `/tools` hub, newsletter, and any monetization copy need one name. Resolve before V2 nav/tools work, since the hub label ("PepTracker Tools" vs "PepCodex Tools") and email sender identity depend on it.

3. **`/directory` slot.** Repoint to `/clinics` now (A1), or hold the slot as a future monetization surface (clinic partnerships / featured listings)? If the latter, it should still not ship as a linked "Coming Soon" stub at launch — unlink it from primary nav until real.

4. **Two-axis facet unification.** The listing "Evidence" facet uses legacy `evidenceStrength`; the dossier card uses the new two-axis composite. Unify on the composite (better) or keep the simpler facet for the listing and reserve the composite for dossiers? Affects whether B4 and B6 must land together.

5. **Interaction matrix scope.** Keep `InteractionMatrix` as the per-dossier card list (current), or invest in the N×N pairwise stack grid the backlog imagines? The latter is higher-engagement but every cell needs a verified citation — scope against the citation-verification capacity from Q1.

6. **Effectiveness axis comprehension.** The two-axis model (Evidence /100 *and* Effectiveness /100, with `basis` flags) is best-in-class but novel — does usability testing show users conflate the two axes? If so, the matrix (B1) and the verdict prose (A6) should explicitly name which axis they reference.
