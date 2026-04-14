# Cross-link Validator Triage (327 warnings, 2026-04-13)

Source: `npm run check` -> `scripts/validate-cross-links.mjs`.
All 327 items are **warnings** (script exits 0). There are no hard errors.
Every warning is the same underlying class: a frontmatter field lists a slug
that does not exist in the target collection. The validator groups them by
the frontmatter field that contains the bad slug.

## Summary

| Category | Count | Target collection | Severity | Auto-fixable |
|---|---|---|---|---|
| 1. `relatedPeptides` -> missing peptide slug | 126 | peptides | HIGH | Partially (bulk-delete common non-peptides) |
| 2. `relatedGlossary` -> missing glossary slug | 105 | glossary | MEDIUM | Partially (slug normalization + stub creation) |
| 3. `interactions` -> missing peptide slug | 68 | peptides | MEDIUM | No — clinical judgment required |
| 4. `relatedTerms` -> missing glossary slug | 28 | glossary | LOW | Yes — glossary stubs or slug rename |
| **Total** | **327** | | | |

Collections (for reference): peptides 102, glossary 215, comparisons 279,
blog 155, guides 36, safety 31, protocols 3, conditions 15.

## Categories

### 1. `relatedPeptides` refers to missing peptide slug (126 warnings)

**Severity:** HIGH — these drive the "Related peptides" rails on blog posts,
dossiers, glossary entries, and guides. Broken refs silently drop the link
(no 404, but no rail entry either), hurting internal-link SEO and topical
authority signals.

**Root cause:** Authors reference commodity endogenous hormones
(`insulin`, `growth-hormone`, `igf-1`, `glucagon`, `oxytocin`) and approved
small-molecule/biologic drugs (`dulaglutide`, `exenatide`, `pembrolizumab`,
`metformin`, `pramlintide`) that have **no dossier** in `src/content/peptides/`.
The content strategy excludes most of these from having full dossiers, but
authors kept citing them as if they existed.

**Top offenders (count of references):**
- `insulin` — 44
- `growth-hormone` — 25
- `igf-1` — 8
- `dulaglutide` — 8
- `oxytocin` — 5
- `glucagon` — 5
- `vasopressin`, `thymosin-beta-4`, `pembrolizumab`, `octreotide`,
  `gonadorelin`, `exenatide` — 3 each

**Examples:**
- `blog/heat-stable-peptide-delivery.mdx` -> relatedPeptides: `"insulin"`
- `blog/cagrisema-nda-filed-glp1-amylin-combo.mdx` -> relatedPeptides: `"pramlintide"`
- `peptides/225ac-dota-lm3.mdx` (via interactions, see Cat. 3) references
  approved drugs `octreotide`, `lanreotide`, `lutathera`.

**Recommendation:**
- **Decision needed first:** do we create stub dossiers for the high-frequency
  endogenous hormones (`insulin`, `growth-hormone`, `igf-1`, `glucagon`,
  `oxytocin`, `vasopressin`) to act as real link targets? That single call
  would resolve ~90 of 126 warnings.
- If **no**, safe to auto-strip these slugs from `relatedPeptides` arrays.
  Regex-safe because the field is a YAML list of slugs — no prose risk.
- If **yes**, scaffold 6 stub dossiers using `/new-dossier` for the top slugs;
  then auto-strip the remaining long tail (~36).
- Either way: **manual judgment on the drug references** (`dulaglutide`,
  `pembrolizumab`, etc.) — those probably belong in a "related therapeutics"
  field that doesn't yet exist, not in `relatedPeptides`.

**Auto-fix path (if stripping):** `scripts/` helper that parses YAML frontmatter,
removes slugs in `relatedPeptides` whose file does not exist in
`src/content/peptides/`, logs each removal. Low risk.

---

### 2. `relatedGlossary` refers to missing glossary slug (105 warnings)

**Severity:** MEDIUM — degrades glossary cross-linking on blog posts but
doesn't surface as a user-facing 404. Useful for SEO topic clustering.

**Root cause:** Mix of two issues:
1. **Missing glossary entries** for concepts the blog posts keep referencing
   (`amylin`, `nootropic`, `preclinical`, `investigational`, `neuroprotection`,
   `mash`, `nafld`, `cardiovascular-outcomes`, `wound-healing`,
   `angiogenesis`, etc.).
2. **Slug drift / pluralization** — e.g. `telomeres` vs `telomere`, `t-cells`
   vs `t-cell`, `growth-factors` vs `growth-factor`.

**Top offenders:**
- `preclinical` — 5
- `amylin` — 5
- `nootropic` — 4
- `investigational` — 4
- `wound-healing`, `telomeres`, `oral-bioavailability`, `neuroprotection`,
  `metabolism`, `mash`, `cardiovascular-outcomes` — 3 each

**Examples:**
- `blog/amycretin-phase2-results.mdx` -> relatedGlossary: `"amylin"`
- `blog/dihexa-memory-enhancement.mdx` -> relatedGlossary: `"nootropic"`,
  `"synaptic-plasticity"`, `"hepatocyte-growth-factor"`
- `blog/epithalon-safety.mdx` -> relatedGlossary: `"telomeres"` (likely
  just needs slug rename to `telomere`)

**Recommendation:**
- Split into two passes:
  - **Pass A — slug normalization.** Diff missing slugs against existing
    glossary filenames; likely 10-20 are pure plural/singular mismatches.
    Safe to auto-fix via regex rename in frontmatter only.
  - **Pass B — glossary stubbing.** For high-frequency real gaps (`amylin`,
    `preclinical`, `investigational`, `nootropic`, `mash`, `nafld`,
    `neuroprotection`, `wound-healing`, `cardiovascular-outcomes`), create
    short glossary entries. This is the content call, not auto-fixable.

---

### 3. `interactions` refers to missing peptide slug (68 warnings)

**Severity:** MEDIUM — appears on peptide dossier "Drug interactions"
sections. Missing targets mean the UI either drops the chip or renders
a dead-slug reference.

**Root cause:** Authors correctly listed co-administered drugs and peptides
(e.g. `lutathera`, `octreotide`, `lanreotide` for a radioligand dossier;
`nmn`, `nicotinamide-riboside` for an NAD+ peptide). These are **real
clinical interactions**, but the referenced substances aren't peptides in
our library — so they don't belong in a peptides-only lookup.

**Examples:**
- `peptides/225ac-dota-lm3.mdx` -> interactions: `"lutathera"`, `"octreotide"`,
  `"lanreotide"` (all real somatostatin-analog interactions — correct
  clinically, wrong collection)
- `peptides/5-amino-1mq.mdx` -> interactions: `"nmn"`,
  `"nicotinamide-riboside"` (NAD+ precursors — not peptides)

**Recommendation:**
- **Do NOT auto-strip.** These are scientifically accurate and valuable to
  readers. The schema is wrong, not the content.
- Architectural fix: split `interactions` into `peptideInteractions`
  (validated against peptides) and `drugInteractions` (free-text string
  + optional link). Schema change in `src/content/config.ts`.
- Short-term: update validator to warn only when the slug looks like a
  peptide-style slug, or downgrade this category to "info" so it stops
  drowning out higher-priority signals.

---

### 4. `relatedTerms` refers to missing glossary slug (28 warnings)

**Severity:** LOW — internal glossary->glossary cross-links. Low traffic,
low SEO weight, but fast to clean up.

**Root cause:** Glossary entries cross-reference each other using slugs
that either don't exist yet (`p-value`, `albumin`, `cortisol`, `weight-loss`)
or have drifted (`investigational` vs actual slug, `t-cells` plural vs singular).

**Examples:**
- `glossary/bmi.mdx` -> relatedTerms: `"weight-loss"`
- `glossary/carrier-protein.mdx` -> relatedTerms: `"albumin"`
- `glossary/confidence-interval.mdx` -> relatedTerms: `"p-value"`
- `glossary/catabolic.mdx` -> relatedTerms: `"cortisol"`

**Recommendation:**
- Safe to auto-fix via the same glossary stub/rename pass from Category 2.
- These 28 warnings will likely fall naturally when Cat. 2 Pass A + Pass B
  land.

---

## Suggested fix order

Ranked by SEO / user-facing impact per unit effort.

1. **Category 1 decision + action (126 warnings).** Highest SEO impact —
   related-peptide rails are prominent on every blog post and dossier.
   Needs a content-strategy call first (stub the 6 endogenous hormones or
   not), then one scripted pass. Projected resolution: ~90 if stubbing,
   all 126 if stripping.
2. **Category 2 Pass A — glossary slug normalization (~15-25 warnings).**
   Pure rename, lowest risk, fastest win. Doubles as groundwork for Cat. 4.
3. **Category 4 — relatedTerms cleanup (28 warnings).** Falls out of Cat. 2
   Pass A plus stubbing the top 8 glossary gaps.
4. **Category 2 Pass B — glossary stubbing (~80 warnings).** Content work,
   not auto-fixable. Can ship incrementally — each new glossary entry
   knocks out 2-5 warnings at a time.
5. **Category 3 — schema split for `interactions` (68 warnings).** Needs
   schema change in `src/content/config.ts` plus layout/template updates.
   Do last because it's architectural, not cleanup. Consider downgrading to
   info-level in the validator until the schema lands, so these stop
   cluttering `npm run check`.

## Not in scope for this triage

- No .mdx was modified.
- No schema (`src/content/config.ts`) was modified.
- No validator script (`scripts/validate-cross-links.mjs`) was modified.
- Raw validator output preserved at `check-output.tmp.txt` (gitignored
  working file; delete after fix pass).
