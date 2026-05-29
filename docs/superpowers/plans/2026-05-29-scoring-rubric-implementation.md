# Two-Axis Scoring Rubric — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the locked v2.4 scoring rubric (`docs/scoring-rubric.md`) to the live site — migrate the schema to the two-axis model, build the validation + display, and re-score all ~102 dossiers with cited evidence.

**Architecture:** Add a new **optional** `scoring` object to the peptide content schema (alongside the legacy `ratings`/`evidenceStrength`) so the migration is incremental and never breaks the build. A validation script enforces score integrity at `prebuild`. The `RatingCard` is reworked to render two 0–100 axes. Dossiers are then re-scored by per-dossier agents (pilot → full run), each writing a `scoring` block with citations. Once all 102 are migrated, the legacy fields are removed.

**Tech Stack:** Astro content collections + Zod (`src/content/config.ts`), `.mdx` frontmatter, Node ESM QA scripts (`scripts/`), Astro components (`.astro`). No unit-test framework exists — **verification = Zod validation at `npm run build` + the `scripts/qa-*` checks**, matching the repo's established pattern.

**SEQUENCING:** Do NOT start until the `feat/peptracker-rebrand` branch has merged to `main` — Task 1 edits `src/content/config.ts`, which currently has uncommitted rebrand changes. Begin from a clean `main`.

**Reference (the scoring manual):** `docs/scoring-rubric.md` (v2.4). Weights: Research Depth 30 · Mechanism 20 · Plausibility 20 · Global Coverage 15 · Community Experience 15.

---

## File map

- **Modify** `src/content/config.ts` — add `scoring` schema (Task 1)
- **Create** `scripts/qa-scoring.mjs` — score-integrity validator (Task 2)
- **Modify** `package.json` — wire `qa-scoring` into `check` (Task 2)
- **Modify** `src/components/RatingCard.astro` — two-axis 0–100 render (Task 3)
- **Modify** `src/layouts/DossierLayout.astro` — pass `scoring`, fallback to legacy (Task 3)
- **Modify** `src/pages/methodology.astro` — adapt v2.4 rubric into public methodology (Task 4)
- **Re-score** `src/content/peptides/*.mdx` — populate `scoring` (Tasks 5–6)
- **Remove** legacy `ratings`/`evidenceStrength` once 102/102 migrated (Task 7)

---

## PART A — Scoring-system code

### Task 1: Add the two-axis `scoring` schema (incremental, optional)

**Files:**
- Modify: `src/content/config.ts` (peptides collection schema)

- [ ] **Step 1: Add the scoring sub-schemas** above the `peptides` collection definition.

```ts
// Two-axis scoring model (rubric v2.4 — see docs/scoring-rubric.md)
const confidenceFlag = z.enum(['high', 'moderate', 'low', 'very-low']);
const effectivenessBasis = z.enum(['clinical', 'community-reported', 'not-established']);

const evidenceScore = z.object({
  researchDepth: z.number().min(0).max(100),
  mechanism: z.number().min(0).max(100),
  plausibility: z.number().min(0).max(100),
  globalCoverage: z.number().min(0).max(100),
  communityExperience: z.number().min(0).max(100),
  overall: z.number().min(0).max(100),       // weighted composite (validated in Task 2)
  label: z.enum(['well-evidenced', 'emerging', 'early-limited', 'preliminary', 'insufficient']),
  elements: z.record(z.string(), z.number()).optional(), // optional element-level audit trail
});

const effectivenessScore = z.object({
  basis: effectivenessBasis,
  score: z.number().min(0).max(100).optional(),   // omitted iff basis === 'not-established'
  confidence: confidenceFlag.optional(),          // required for 'clinical'/'community-reported'
  primaryIndication: z.string().optional(),
});

const scoringSchema = z.object({
  rubricVersion: z.string().default('2.4'),
  evidence: evidenceScore,
  effectiveness: effectivenessScore,
  lastScored: z.coerce.date(),
  citations: z.array(z.string()).default([]),     // PMIDs/DOIs/URLs backing the scores
  notes: z.string().optional(),
});
```

- [ ] **Step 2: Add the optional field** to the peptides `z.object({...})` schema, next to the existing `ratings` line.

```ts
    // Legacy 1–5 ratings (retained during migration; removed in Task 7)
    ratings: ratingsSchema.optional(),
    // NEW two-axis scoring (rubric v2.4)
    scoring: scoringSchema.optional(),
```

- [ ] **Step 3: Verify the build still passes** (no dossier has `scoring` yet, so optional = no breakage).

Run: `npm run build`
Expected: build completes, 0 errors (same page count as before).

- [ ] **Step 4: Commit.**

```bash
git add src/content/config.ts
git commit -m "feat(scoring): add optional two-axis scoring schema (rubric v2.4)"
```

---

### Task 2: Score-integrity validator wired into the build gate

**Files:**
- Create: `scripts/qa-scoring.mjs`
- Modify: `package.json` (`check` script)

- [ ] **Step 1: Write the validator.** It checks every dossier that HAS a `scoring` block; dossiers without one are skipped (migration in progress).

```js
// Validates two-axis scoring integrity for any dossier that has a `scoring` block.
// ERROR (exit 1): weighted overall mismatch, out-of-range sub-scores, basis/score
// inconsistency, community-reported score >50, missing citations.
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const WEIGHTS = { researchDepth: 0.30, mechanism: 0.20, plausibility: 0.20, globalCoverage: 0.15, communityExperience: 0.15 };
const dir = path.resolve('src/content/peptides');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
const errors = [];
let scored = 0;

for (const file of files) {
  const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
  const s = data.scoring;
  if (!s) continue;
  scored++;
  const ev = s.evidence ?? {};
  // 1. weighted overall matches (±1)
  const calc = Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + (ev[k] ?? 0) * w, 0);
  if (Math.abs(calc - (ev.overall ?? -999)) > 1) {
    errors.push(`${file}: evidence.overall ${ev.overall} ≠ weighted ${calc.toFixed(1)}`);
  }
  // 2. effectiveness basis/score consistency
  const eff = s.effectiveness ?? {};
  if (eff.basis === 'not-established' && eff.score != null) {
    errors.push(`${file}: not-established must omit effectiveness.score`);
  }
  if (eff.basis !== 'not-established' && eff.score == null) {
    errors.push(`${file}: effectiveness.basis '${eff.basis}' requires a score`);
  }
  if (eff.basis === 'community-reported' && (eff.score ?? 0) > 50) {
    errors.push(`${file}: community-reported score ${eff.score} exceeds the 50 cap`);
  }
  if (eff.basis !== 'not-established' && !eff.confidence) {
    errors.push(`${file}: effectiveness '${eff.basis}' requires a confidence flag`);
  }
  // 3. citations present
  if (!Array.isArray(s.citations) || s.citations.length === 0) {
    errors.push(`${file}: scoring.citations is empty`);
  }
}

console.log(`Scoring validator: ${scored}/${files.length} dossiers scored.`);
if (errors.length) {
  console.error(`\nFAIL: ${errors.length} scoring error(s):`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('PASS: scoring integrity OK');
```

- [ ] **Step 2: Wire it into `check`** in `package.json`.

```json
    "check": "node scripts/validate-cross-links.mjs && node scripts/qa-seo.mjs && node scripts/qa-scoring.mjs",
    "qa-scoring": "node scripts/qa-scoring.mjs",
```

- [ ] **Step 3: Run it** (expect 0 scored, PASS, before any migration).

Run: `npm run qa-scoring`
Expected: `Scoring validator: 0/102 dossiers scored.` → `PASS`

- [ ] **Step 4: Commit.**

```bash
git add scripts/qa-scoring.mjs package.json
git commit -m "feat(scoring): add qa-scoring validator to the build gate"
```

---

### Task 3: Rework `RatingCard` to render two 0–100 axes (with legacy fallback)

**Files:**
- Modify: `src/components/RatingCard.astro`
- Modify: `src/layouts/DossierLayout.astro`

- [ ] **Step 1: Update `DossierLayout.astro`** to pass the new `scoring` (preferred) and the legacy `ratings` (fallback) to the card. Find where `<RatingCard ... />` is rendered and pass both:

```astro
<RatingCard scoring={entry.data.scoring} legacyRatings={entry.data.ratings} />
```

- [ ] **Step 2: Rewrite `RatingCard.astro`** to render the two-axis model when `scoring` exists, else fall back to the existing 1–5 card. Props + Evidence axis:

```astro
---
interface Props { scoring?: any; legacyRatings?: any; }
const { scoring, legacyRatings } = Astro.props;

const evLabel: Record<string,string> = {
  'well-evidenced':'Well-evidenced','emerging':'Emerging / moderate',
  'early-limited':'Early / limited','preliminary':'Preliminary','insufficient':'Insufficient',
};
const evDims = scoring ? [
  { label:'Research Depth', v: scoring.evidence.researchDepth },
  { label:'Mechanism', v: scoring.evidence.mechanism },
  { label:'Plausibility', v: scoring.evidence.plausibility },
  { label:'Global Coverage', v: scoring.evidence.globalCoverage },
  { label:'Community Experience', v: scoring.evidence.communityExperience },
] : [];
const eff = scoring?.effectiveness;
const effText = !eff ? null
  : eff.basis === 'not-established' ? 'Not Established'
  : `${eff.score}/100`;
const effBasisLabel = eff?.basis === 'community-reported'
  ? 'community-reported · not clinically demonstrated'
  : eff?.basis === 'clinical' ? 'clinically demonstrated' : '';
---
{scoring ? (
  <div class="space-y-4">
    <!-- Evidence axis: 5 bars + overall /100 + label -->
    <div class="flex items-center justify-between">
      <span class="eyebrow">Evidence Score</span>
      <span class="text-2xl font-bold font-mono" style="color: var(--ink);">{scoring.evidence.overall}<span class="text-xs" style="color: var(--ink-dim);">/100</span></span>
    </div>
    <span class="inline-block rounded-full px-3 py-1 text-xs font-bold" style="background: var(--primary-soft); color: var(--primary-c);">{evLabel[scoring.evidence.label]}</span>
    {evDims.map((d) => (
      <div>
        <div class="flex justify-between text-xs mb-1"><span style="color: var(--ink-muted);">{d.label}</span><span class="font-mono">{d.v}/100</span></div>
        <div class="h-1.5 rounded-full" style="background: var(--paper-2);"><div class="h-full rounded-full" style={`width:${d.v}%; background: var(--primary-c);`}></div></div>
      </div>
    ))}
    <!-- Effectiveness axis: distinct styling -->
    <div class="pt-2" style="border-top: 1px solid var(--border-c);">
      <div class="flex items-center justify-between">
        <span class="eyebrow">Effectiveness</span>
        <span class="text-lg font-bold font-mono" style="color: var(--ink);">{effText}</span>
      </div>
      {effBasisLabel && <p class="text-xs italic" style="color: var(--ink-dim);">{effBasisLabel}{eff.confidence ? ` · ${eff.confidence} confidence` : ''}</p>}
      <p class="text-xs" style="color: var(--ink-dim);">Effectiveness = demonstrated effect magnitude, not a recommendation or safety claim.</p>
    </div>
    <a href="/methodology#how-we-rate" class="text-xs" style="color: var(--primary-c);">How we rate &rarr;</a>
  </div>
) : (
  /* LEGACY fallback: keep the existing 1–5 markup here unchanged for un-migrated dossiers */
  <Fragment set:html={''} />
)}
```
*(Keep the current 1–5 rendering in the `else` branch verbatim — copy the existing component body into it — so un-migrated dossiers still render during the migration.)*

- [ ] **Step 3: Build + visually verify** on one un-migrated dossier (legacy path) and (after Task 5) one migrated dossier.

Run: `npm run build` → Expected: 0 errors. Then spot-check a built page's Evidence/Effectiveness block.

- [ ] **Step 4: Commit.**

```bash
git add src/components/RatingCard.astro src/layouts/DossierLayout.astro
git commit -m "feat(scoring): two-axis RatingCard with legacy fallback"
```

---

### Task 4: Adapt the rubric into the public `/methodology` page

**Files:**
- Modify: `src/pages/methodology.astro` (the `#how-we-rate` section)

- [ ] **Step 1: Replace the old 3-dimension "How We Rate" section** with the v2.4 two-axis explanation: the five Evidence dimensions + weights, the Effectiveness axis (clinical / community-reported / not-established) with its guardrail language, and a one-line link/credit to the frameworks (GRADE, CEBM, Bradford Hill, FDA RWE). Pull copy directly from `docs/scoring-rubric.md` (summarize; do not paste the full ~80 bands).

- [ ] **Step 2: Build + verify** the methodology page renders and the dossier "How we rate →" anchor lands on it.

Run: `npm run build` → Expected: 0 errors.

- [ ] **Step 3: Commit.**

```bash
git add src/pages/methodology.astro
git commit -m "docs(methodology): publish two-axis rubric v2.4 as E-E-A-T methodology page"
```

---

## PART B — Dossier re-scoring run (depends on Part A)

### Task 5: Pilot re-score (5 dossiers, 1 agent each)

**Goal:** Prove the agent workflow + score quality on a small, spread set before scaling.

**Pilot set:** `semaglutide`, `thymalin`, `bpc-157`, `foxo4-dri`, `thymosin-alpha-1` (the calibration set — we already have expected ranges to check against).

- [ ] **Step 1: Stop the dev server** if running (the OneDrive EMFILE lesson — file-editing agents + watcher + sync exhaust descriptors).

- [ ] **Step 2: Dispatch ONE agent per pilot dossier (≤3 concurrent).** Each agent brief MUST include this template (self-contained):

```
Re-score the compound in src/content/peptides/<slug>.mdx using the scoring manual at
docs/scoring-rubric.md (rubric v2.4). Steps:
1. Read the dossier + docs/scoring-rubric.md in full.
2. Gather evidence: use the scholarly article MCP (search_articles/get_full_text_article),
   ClinicalTrials.gov MCP, and web search. Use ONLY real, retrieved citations (PMID/DOI/URL).
   NEVER fabricate. (Honor the sourcing-rules + verify-citations skills.)
3. Score EVERY element:
   - Evidence: Research Depth (1A–1E), Mechanism (2A–2D), Plausibility (3A–3D),
     Global Coverage (4A–4D), Community Experience (5A–5D). Sum each dimension → five 0–100
     sub-scores. Compute overall = RD*.30+Mech*.20+Plaus*.20+GC*.15+CE*.15. Assign the label.
   - Effectiveness: pick the basis (clinical→community-reported→not-established).
     Clinical → E1–E4 (within primary indication, vs placebo+best option) + confidence flag.
     Community-reported → CR1–CR3 (max 50) + "very-low" confidence. Not-established → omit score.
4. Write a `scoring:` block into the .mdx frontmatter matching the Zod schema in
   src/content/config.ts (rubricVersion, evidence{...,overall,label,elements}, effectiveness{...},
   lastScored, citations[], notes). Record the per-element evidence in `notes`.
5. Do NOT touch any other file or any other frontmatter field. Do NOT run the dev server.
Return: the five Evidence sub-scores, overall+label, Effectiveness basis/score/confidence, and
the citation count.
```

- [ ] **Step 3: Run the validator + build.**

Run: `npm run qa-scoring && npm run build`
Expected: `5/102 dossiers scored`, PASS, build 0 errors.

- [ ] **Step 4: QA the pilot against calibration.** Verify each pilot score lands near the calibration estimates (semaglutide Evidence ~100 / Effectiveness ~clinical high; thymalin Evidence ~52; bpc-157 Effectiveness ~45 community-reported; foxo4-dri Effectiveness not-established). Run `verify-citations` skill on the 5 dossiers. Manually spot-check 5 random citations resolve.

- [ ] **Step 5: Commit the pilot.**

```bash
git add src/content/peptides/semaglutide.mdx src/content/peptides/thymalin.mdx src/content/peptides/bpc-157.mdx src/content/peptides/foxo4-dri.mdx src/content/peptides/thymosin-alpha-1.mdx
git commit -m "content(scoring): re-score pilot set against rubric v2.4"
```

- [ ] **Step 6: Checkpoint with the user** — review pilot scores + citation quality before scaling. If anchors need tuning, fix `docs/scoring-rubric.md` and re-pilot.

---

### Task 6: Full re-score (remaining ~97 dossiers, batched)

- [ ] **Step 1: Generate the worklist** — all `src/content/peptides/*.mdx` lacking a `scoring` block.

Run: `node -e "const fs=require('fs'),m=require('gray-matter');for(const f of fs.readdirSync('src/content/peptides').filter(x=>x.endsWith('.mdx'))){if(!m(fs.readFileSync('src/content/peptides/'+f,'utf8')).data.scoring)console.log(f)}"`

- [ ] **Step 2: Process in batches of 3** (dev server off), one agent per dossier using the Task-5 brief template. After each batch: `npm run qa-scoring && npm run build` (catch errors early). Commit per batch:

```bash
git add src/content/peptides/<batch files>
git commit -m "content(scoring): re-score batch N against rubric v2.4"
```

- [ ] **Step 3: After all batches** — `npm run qa-scoring` should report `102/102 dossiers scored`, PASS. `npm run build` 0 errors.

- [ ] **Step 4: QA sweep** — run `verify-citations`; spot-check 10 random dossiers for score sanity + citation validity; confirm no `not-established`/score contradictions (validator already enforces).

---

### Task 7: Retire legacy fields (only after 102/102 migrated)

**Files:**
- Modify: `src/content/config.ts`, `src/components/RatingCard.astro`, all `*.mdx`

- [ ] **Step 1: Make `scoring` required, remove `ratings` + `evidenceStrength`** from the peptides schema in `config.ts`.
- [ ] **Step 2: Remove the legacy fallback branch** from `RatingCard.astro`.
- [ ] **Step 3: Strip the old `ratings:`/`evidenceStrength:` frontmatter** from all dossiers (script a removal pass; verify with build).
- [ ] **Step 4:** `npm run build` → 0 errors. Commit.

```bash
git commit -am "refactor(scoring): make two-axis scoring required, remove legacy ratings/evidenceStrength"
```

---

## Self-review notes
- **Incremental safety:** `scoring` is optional until Task 7, so the build never breaks mid-migration; `RatingCard` falls back to the legacy card per-dossier.
- **Verification matches the repo:** no unit-test framework exists; every task verifies via `npm run build` (Zod) + `qa-scoring` + `verify-citations`, consistent with the existing `qa-*` pattern.
- **Integrity enforced in code:** the community-reported ≤50 cap, basis/score consistency, weighted-overall check, and citation presence are all hard-failed by `qa-scoring.mjs` — the rubric's guardrails become build gates.
- **Cost control:** pilot (Task 5) + user checkpoint before the 97-dossier run (Task 6); batches of 3 with build checks between.
