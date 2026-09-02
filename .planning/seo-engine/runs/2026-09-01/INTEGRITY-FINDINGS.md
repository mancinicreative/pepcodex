# INTEGRITY-FINDINGS — 2026-09-01 (Wave 1, Agent I)

Adversarial L4 audit. Read-only on `src/content` and `data/source-packs`. A row without a gate log or a fetch this run is marked **not a finding**.

**Branch constraint:** `feat/scoring-and-freshness`. No content edits.

**Aug 17 worklist:** `.planning/phases/40-growth-engine/research/UPDATE-WORKLIST.md` is stale. It was not used as an accusation source. Window-scoped absences were re-searched this run before any “unpublished” claim was judged.

---

## Commands actually run (2026-09-01)

| Command | Exit | What it proved |
|---|---|---|
| `npm run qa:claims` | 0 | 14 named trials with %; 4 near-miss clusters. Wrote `.planning/citation-audit/CLAIM-CONSISTENCY.md` |
| `npm run qa:consistency` | 0 | 1,372 identifiers; 0 contradicting facts; 1 advisory title variance on `NCT05567796` |
| `node scripts/qa-staleness.mjs` | 0 | 26/26 self-test; 6 advisory status/prose mismatches; 0 blocking |
| `node scripts/validate-cross-links.mjs` | 0 | 3,758 refs; **Errors 0**; **Warnings 244** (missing related-\* slugs) |
| `node scripts/qa-source-identifiers.mjs` | 0 | 605 sources; **1** without any identifier (`blog/dihexa-memory-enhancement.mdx`) |
| `node scripts/qa-identity-integrity.mjs` | 0 | 107 dossiers / 42 packs; 1 advisory GENERIC_ALIAS (`mk-677` “L-163,191”) |
| Sitewide dangling / homepage / body-404 scan (node, stdout; helper not kept) | 0 | 5 dangling posts; 4 homepage URLs; 0 body collection 404s; 22 `verified: false` sources still in frontmatter; 4 empty `pmid: ""` |
| `verification/ledger.json` histogram | — | **exists 2,274 · retired 10** (matches STATE.md ledger; `qa-pmids` full tree **not** re-run) |

**Not run (and why):**

- `npm run qa-pmids --strict` on the full tree — would exceed the 10-minute / NCBI budget. Last known: STATE.md **2,274 / 2,274** live ids. This run confirmed ledger `exists: 2274`.
- `npm run source:census` — hits PubMed once per dossier. Cited `.planning/sourcing/NAME-LITERATURE-CENSUS.md` (**2026-08-06**) and **re-fetched** the Cerluten PMIDs this run instead of re-querying 107 aliases.
- `astro build` / `graph:check` — forbidden for this agent.
- Live GSC indexed-404 list — no `MEASUREMENT.md` this run (Gate 0 blocked on Lucas).

**Fetches this run (targeted; not a tree walk):**

- CT.gov v2 `NCT05765513` — HA35 periodontitis, **not** BPC-157.
- NCBI esummary batch: `40353578, 35658024, 29956618, 34834147, 35457077, 25403301, 12374906, 33567185, 41090431, 38323122, 18454096, 16996037, 39107523, 25673378, 17579513, 28013436, 21030672, 40900093, 34626851`.
- NCBI efetch abstracts: `35658024` (SURMOUNT-1), `33567185` (STEP 1).
- NCBI esearch: `TRIUMPH[Title] AND retatrutide` → 2 hits (`41090431` design; `38323122` 2024 correspondence). **No TRIUMPH efficacy paper.**
- `https://clinicaltrials.gov/oasis1` — CT.gov chrome/search shell, not a study record.

---

## Findings (severity × class)

### CRITICAL

#### I-01. Wrong-drug NCT still asserted in a live safety post
- **File:** `src/content/blog/is-bpc-157-safe.mdx`
- **Class:** wrong-drug NCT + fabricated study
- **Check:** CT.gov v2 fetch `NCT05765513` this run: briefTitle *“HA35 Treatment the Gingival Discomfort…”*, intervention hyaluronan fragment HA35, condition Periodontitis. Frontmatter already records this (`verified: false`, note names the HA35 study) **and the body still treats it as a 2025 IV BPC-157 volunteer pilot** (lines 84 and 114).
- **Live link:** `BlogLayout.astro` `getSourceUrl()` does **not** skip `verified: false`. Source `nct05765513` has no `url`/`nctId`, so the layout emits a **PubMed search** for the invented title “Safety and Pharmacokinetics of Intravenous BPC-157 in Healthy Volunteers (NCT05765513)”.
- **Twin that was already corrected:** `src/content/blog/bpc-157-first-human-safety-data.mdx` (lastUpdated 2026-08-17) carries an explicit correction notice for this exact NCT. The keep-set post was not given the same treatment (NEEDS-VERIFICATION-R4 flagged it; still open).
- **Gate miss:** `qa-source-identifiers` treats `\bNCT\d{6,}\b` anywhere in the YAML entry as an identifier — the **wrong-drug NCT in the note** makes the stripped source look “identified.”

#### I-02. Fabricated thymulin vaccine RCT behind dangling citation IDs
- **File:** `src/content/blog/thymulin-vaccine-response.mdx`
- **Class:** fabricated study + dangling body citation IDs
- **Check:** dangling scan: body cites `[thymulin-vaccine-study]`, `[immunosenescence-review]`, `[vaccine-aging-research]` — **none** are in `sources[]`. Declared sources are three real PubMed records (`2657247`, `8407057`, `18476235`) about thymulin/zinc, not a human vaccine RCT.
- **The invented trial (body):** “randomized, double-blind, placebo-controlled trial in **180 adults aged 65-85**”; seroconversion **72% vs 48%**; seroprotection **78% vs 54%**; GMT **40% higher**. No NCT/PMID exists for that study on the page.
- **Title/meta still claim it as fact.** `evidenceLevel: low` does not make a nonexistent RCT honest.

#### I-03. Fabricated 125k tirzepatide-cancer cohort; attached PMID is a different paper
- **File:** `src/content/blog/tirzepatide-cancer-incidence.mdx`
- **Class:** fabricated study + real id wrong paper + dangling IDs
- **Check:** dangling scan: `[tirzepatide-cancer-study]`, `[obesity-cancer-link]`, `[glp1-cancer-mechanisms]` not in `sources[]`.
- **Invented study (body):** 125,000 patients; 42,000 tirzepatide vs 83,000 controls; 2.4 years; 13 obesity-related cancers; HR **0.56 (0.44–0.71)** plus a per-cancer HR table. No identifier.
- **Fetch:** frontmatter `pmid-38976276` URL/PMID is **40900093** — esummary title *“Gastrointestinal and Hepatobiliary Safety of Glucagon-Like Peptide-1 Receptor Agonists in Patients With Type 2 Diabetes”* (Am J Gastroenterol). That is **not** a tirzepatide cancer-incidence cohort. Two further sources are `verified: false` with “resolved to a different document.”
- **Live link:** `getSourceUrl` still turns those unverifiable titles into PubMed searches.

---

### HIGH

#### I-04. Undated false absence: “no head-to-head tirzepatide vs semaglutide 2.4 mg”
- **File:** `src/content/comparisons/tirzepatide-vs-semaglutide.mdx` (line 81)
- **Class:** window-scoped absence (here: **undated and false**)
- **Check this run, not the Aug 17 worklist:** NCBI esummary **PMID 40353578** — Aronne LJ et al., NEJM 2025, *“Tirzepatide as Compared with Semaglutide for the Treatment of Obesity.”* Same PMID is already on `src/content/peptides/tirzepatide.mdx` (`scoring.citations`, keyFindings, SURMOUNT-5 20.2% vs 13.7%) and on `src/content/blog/surmount-5-tirzepatide-vs-semaglutide.mdx`.
- The comparison page still says the head-to-head “has not been published,” cites only SURPASS-2 (semaglutide **1 mg**) as “the only direct comparison,” and lastUpdated **2026-02-01**.

#### I-05. Journal-homepage / listing-page “sources” (live hrefs)
Caught by homepage-URL scan + `BlogLayout` always linking `source.url`.

| File | id | URL | Why it fails |
|---|---|---|---|
| `src/content/blog/wegovy-pill-launches-us.mdx` | `nejm-oasis` | `https://www.nejm.org` | Journal **homepage**, not the OASIS paper |
| same | `novo-press-2026` | `https://www.novonordisk.com/news` | News **index** |
| same | `fda-approval-2026` | `https://www.fda.gov/drugs` | FDA drugs **homepage** |
| same | `oasis-1-trial` | `https://clinicaltrials.gov/oasis1` | **Not an NCT path.** Fetch this run returned CT.gov chrome, not a study. Live 404-class. |
| `src/content/blog/surmount-5-tirzepatide-vs-semaglutide.mdx` | `lilly-press` | `https://investor.lilly.com/news-releases/` | IR **listing**, not a release |
| `src/content/blog/orforglipron-attain-1-results.mdx` | `lilly-pr` | `https://investor.lilly.com/news-releases` | same |

`qa-source-identifiers` **passes** all of these because a URL exists. That gate cannot see this class.

#### I-06. SURMOUNT-1 efficacy-estimand leftover (22%) next to the published 20.9%
- **File:** `src/content/comparisons/vk2735-vs-tirzepatide.mdx` lines 103, 109 (“Up to 22% weight loss in SURMOUNT-1”) while the same file’s table (line 120) and source `pmid 35658024` are the treatment-regimen figure.
- **Check:** efetch abstract PMID **35658024** this run — coprimary is the **treatment-regimen estimand**; 15 mg mean change **−20.9%** (95% CI −21.8 to −19.9). Classic L4 estimand swap; `qa:claims` near-miss `SURMOUNT-1: 20.9% vs 22%`.

#### I-07. Cerluten still carries a **cortexin** trial as a scoring citation
- **File:** `src/content/peptides/cerluten.mdx` `scoring.citations` → `PMID:25403301`
- **Class:** real id wrong paper / parent-compound cited as this page’s subject
- **Check:** esummary this run — Mashin VV et al. 2014, *“An open clinical trial of **cortexin** in treatment of brain ischemia.”* Census 2026-08-06: **0** PubMed records name Cerluten; 4 citations shown. Sibling PMIDs on the same list: `34834147` “Peptide Regulation of Gene Expression”; `12374906` “Peptides and Ageing”; `35457077` ultrashort peptides in AD — none name Cerluten in the title.
- Also: `evidenceChainedBenefits[0].keyFindings[0].pmid: ""` asserting “Observational studies suggest cognitive effects in elderly” — empty-string placeholder. `qa-identity-integrity` PLACEHOLDER regex does **not** match `""`.

#### I-08. `id: pmid-NNNNNNNN` + stripped identifier = real-id-wrong-paper still rendered as a source
`verified: false` sources with the PMID **only in the id string**. `getSourceUrl` builds a PubMed **search from the stored title**. Fetches this run:

| File | id | Stored title claims | PubMed actually is |
|---|---|---|---|
| `src/content/blog/best-peptide-for-weight-loss-2026.mdx` | `pmid-39107523` | SURMOUNT-5 (Garvey) | **39107523** = mantle-cell lymphoma bone-marrow case series (Virchows Arch) |
| `src/content/blog/aod-9604-safety.mdx` | `pmid-17579513` | AOD9604 Phase 2b fat-loss | **17579513** = “Influenza pandemic vaccines: spread them thin?” |
| `src/content/blog/is-bpc-157-safe.mdx` | `pmid-28013436` | BPC-157 VEGFR2 angiogenesis | **28013436** = opiorphin in burning mouth syndrome |

Do **not** “fix” these by re-attaching the numeric id. The numbers resolve to the wrong papers. Strip the fake title-link; do not fuzzy-match.

**Counter-example (do not over-correct):** `pmid-21030672` on the same BPC post is flagged `verified: false`, but esummary this run is Chang CH 2011 *“The promoting effect of pentadecapeptide BPC 157 on tendon healing…”* — topical match. The unverifiable flag looks like a matcher miss, not a wrong-drug id.

---

### MED

#### I-09. More dangling body IDs (studies/guidance not in `sources[]`)
Scan output (excluding glossary false positive `[Effect]` on `confidence-interval.mdx`):

| File | Dangling keys | Notes |
|---|---|---|
| `src/content/blog/fda-peptide-stability-guidance.mdx` | `fda-draft-guidance`, `ich-stability-guidelines`, `peptide-formulation-review` | Body asserts a specific FDA draft guidance; sources are three formulation papers (PMIDs 36986796, 10229638, 38953302). Did **not** fetch FDA.gov this run — treat as unverifiable guidance claim, not as a confirmed fabrication. |
| `src/content/blog/fda-tightens-peptide-compounding-rules.mdx` | `fda-guidance-2026`, `fda-nomination-review`, `pharmacy-times-2026` (body also `[503a-requirements]`) | Compounding restriction may be real Category-2 history; the citation keys do not resolve. PMC/PMID sources on the page are not the guidance document. |

#### I-10. Empty `pmid: ""` on asserted findings (placeholder class the identity gate missed)

| File | Assertion with empty pmid |
|---|---|
| `peptides/cerluten.mdx` | “Observational studies suggest cognitive effects in elderly…” |
| `peptides/ovagen.mdx` | “Observed hepatocyte gene expression changes in cell culture models” |
| `peptides/ventfort.mdx` | “Animal studies suggest vascular tissue effects…” |
| `peptides/visoluten.mdx` | two findings: Russian visual-function claims + retinal gene-expression |

`qa-identity-integrity` PLACEHOLDER = `n/a|tbd|…` only. Empty string sails through.

#### I-11. Parent-compound literature filed as derivative coverage (labelled, still the class)
- **Files:** `src/content/peptides/na-selank-amidate.mdx`, `na-semax-amidate.mdx`
- **Check:** esummary `18454096` = Selank GAD RCT; `16996037` = Semax BDNF in rat hippocampus. Dossiers **do** label “(parent compound)”. Census 2026-08-06: NA-Selank Amidate **2** PubMed records vs **5** citations shown. `scoring.citations` still lists parent PMIDs as this molecule’s evidence. Not silent fraud; still the coverage-inflation class from lessons.md.
- Stamakort notes (file) already admit class-level PMIDs and “no PubMed-indexed studies exist under that name.” Honest adjacent citing — keep as MED hygiene, not a W2 emergency.

#### I-12. STEP 1 “peak ~17%” vs published −14.9%
- **File:** `src/content/comparisons/amycretin-vs-semaglutide.mdx` (STEP 1 table: “~15%” and “Peak weight loss ~17%”)
- **Check:** efetch PMID **33567185** — mean change **−14.9%** vs −2.4% (primary estimand regardless of discontinuation). Abstract has **no 17% mean**. 69.1% / 50.5% in other comparison files are **≥10% / ≥15% responder rates**, not contradictions.

#### I-13. `qa-source-identifiers` backlog of 1 is a lie about the class
Report: 1 unverifiable (`hgf-cognition` on dihexa). The 22 `verified: false` rows still render as clickable “Sources.” The gate is a ratchet on YAML shape, not on whether the reader gets a real paper.

---

### LOW

#### I-14. `qa-staleness` advisory approval-prose vs `research-only`
cerebrolysin, igf-1-lr3, melanotan-ii, semax, sermorelin, thymosin-alpha-1. Sermorelin’s “Was FDA-approved but discontinued in 2008” is historically true and **labelled past tense** — likely a matcher false positive. Cerebrolysin “approved in 50+ countries” / thymosin-alpha-1 “35+ countries” are real-world status claims that need a regulatory URL, not a PMID. Not fetched this run beyond the gate log.

#### I-15. `qa:consistency` advisory: three titles for `NCT05567796` in `cagrilintide.json`
Editorial label variance (REDEFINE 1). Non-blocking. Not a fact contradiction.

#### I-16. `qa-identity` GENERIC_ALIAS `mk-677` “L-163,191”
Development code, not a tissue alias. Matcher over-fire. Do not “fix” by deleting a real code name.

---

## Classes hunted with **no new finding** this run

| Class | Result |
|---|---|
| **Live internal 404s in body markdown** | Scan: **0** `](/collection/slug)` targets missing from disk. **0** trailing-slash internal hrefs in bodies. |
| **relatedPeptides / relatedGlossary / interactions → 404** | `validate-cross-links` 244 warnings. `BlogLayout.astro`, `GlossaryLayout.astro`, `InteractionMatrix.astro` **Set-guard** misses to text. Those warnings are **not live 404s**. Link Guardian still owns any unguarded template. |
| **GSC indexed 404s** | **Blocked** — no MEASUREMENT / GSC 404 export this run. |
| **Window-scoped TRIUMPH “unpublished”** | Dated Aug 17 claims on `retatrutide.mdx` / TRIUMPH blogs. This run’s PubMed title search: only design paper **41090431** and a 2024 correspondence **38323122**. **Do not accuse.** Do not invent TRIUMPH efficacy numbers. |
| **REDEFINE-2 13.7% vs 15.7%** (`qa:claims` near-miss) | Same file (`cagrisema-nda-filed.mdx`) labels treatment-policy vs trial-product. **Not an estimand swap.** Gate noise. |
| **SURMOUNT-1 24.2%** (`qa:claims`) | `tirzepatide-vs-retatrutide.mdx` — 24.2% is **retatrutide Phase 2**, 20.9% is SURMOUNT-1. Heading-scope false positive. |
| **Retired ledger ids resurrected** | 10 `retired` entries. Grep of current `cardiogen.mdx` / packs did not find `PMID:27259496`, `NCT04163354`, etc. Ledger `locations` look historical. **No resurrection found.** |
| **qa:consistency contradictions** | PASS, 0. |

---

## Gate blind spots (Judge / W2 implementers)

1. **`qa-source-identifiers`:** a URL, an `id: pmid-123`, or an NCT **in a note** counts as identified. Homepage URLs and stripped wrong-PMIDs pass.
2. **`BlogLayout.getSourceUrl`:** missing URL → PubMed search from title; **`verified: false` is still linked.** This is how I-01/I-03/I-08 stay live after a “strip the id” pass.
3. **`qa-identity-integrity` PLACEHOLDER:** does not match `pmid: ""`.
4. **`qa:claims`:** near-miss ≠ wrong estimand. Responder rates and labelled dual estimands fire it. Do not “harmonize” 13.7% to 15.7%.
5. **`validate-cross-links`:** frontmatter slugs only. Body 404s and external registry 404s (`/oasis1`) are invisible.
6. **`qa-pmids --strict`:** resolution ≠ topical match. Cerluten’s cortexin PMID and 39107523 lymphoma paper would pass an existence check.

---

## Suggested Wave 2 order (Integrity Implementer; Judge assigns)

1. **I-01** `is-bpc-157-safe.mdx` — delete NCT05765513 from body; stop rendering `verified: false` via `getSourceUrl` (template fix helps the whole class).
2. **I-02, I-03** — kill fabricated RCT/cohort prose; do not replace with fuzzy-attached papers.
3. **I-05** — replace homepage URLs with article/NCT/press-release URLs **fetched this W2**, or drop the source.
4. **I-04** — one paragraph + table row pointing at SURMOUNT-5 / PMID 40353578 (already on the tirzepatide dossier). Net URL delta 0.
5. **I-06, I-12** — 22% → 20.9%; drop unsourced STEP “peak 17%.”
6. **I-07, I-10** — cortexin PMID off Cerluten; empty pmids either cited to a fetched paper that **names the compound** or removed.
7. **I-08** — strip fake `pmid-*` ids whose numbers resolve off-topic; do **not** auto-attach.
8. Template: `getSourceUrl` must not invent a PubMed search; skip `verified: false`.

**Do not:** attach by title similarity 0.55; OR-join aliases; treat Aug 17 TRIUMPH “unpublished” as a bug; run a second `astro build` in parallel with Crawl Engineer.

---

## Blockers

1. **GSC indexed-404 list** — blocked on Lucas / Measurement Steward (`MEASUREMENT.md` absent). Internal body 404 scan is 0; Google’s 404 report was not inspected.
2. **Full `qa-pmids --strict`** — not re-run. Ledger 2,274 exists / 10 retired cited instead.
3. **Fresh name-literature census** — not re-run (NCBI). 2026-08-06 census + sampled PMIDs only.
4. **W2 forbidden move:** auto-attach identifiers by fuzzy title (0.55 already poisoned this repo).
5. **TRIUMPH efficacy** still unpublished as of this run’s PubMed search — writers must not “fill in” 28.3% / 28.7% from memory or the old posts.

---

*Agent I. Quality Judge scores this against LOOPS.md L4. I do not mark my own work passed.*
