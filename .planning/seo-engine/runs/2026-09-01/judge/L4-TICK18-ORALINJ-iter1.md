# Judge — L4-TICK18-ORALINJ, iter 1

**Loop:** L4 cited-only integrity on `src/content/comparisons/oral-vs-injectable-semaglutide.mdx`
**Judge:** Agent J (Kimi K3). Did not write this increment. Mood = critic.
**Date:** 2026-09-02
**Verdict: KEEP**

## Criterion-by-criterion

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | PMIDs 33567185 / 37385278 / 31186300 fetched & topical-matched | **PASS** | Independently efetched all three this session. 33567185 = STEP 1 (NEJM 2021;384:989-1002, NCT03548935, SC semaglutide 2.4 mg obesity). 37385278 = OASIS 1 (Lancet 2023;402:705-719, NCT05035095, **oral 50 mg** obesity). 31186300 = PIONEER 1 (Diabetes Care 2019;42:1724-1732, oral semaglutide T2D). Page never calls OASIS 1 a Rybelsus 14 mg trial (line 79: "OASIS 1 is not a Rybelsus 14 mg trial") nor STEP 1 an Ozempic 1 mg row (line 118). |
| 2 | STEP 1 figures exact | **PASS** | Page line 73 matches abstract verbatim: n=1961; 68 wk; −14.9% vs −2.4%; ETD −12.4 pp (95% CI −13.4 to −11.5; P&lt;0.001, escaped); ≥5/10/15% = 86.4/69.1/50.5 vs 31.5/12.0/4.9; −15.3 vs −2.6 kg; GI d/c 4.5% vs 0.8%. Grep for `12-15` / `12–15`: zero hits — invented range not restored. |
| 3 | OASIS 1 figures exact, 50 mg not Rybelsus | **PASS** | Page line 77 matches abstract: n=667 (334/333); 68 wk; ITT; −15.1% vs −2.4%; ETD −12.7 pp (95% CI −14.2 to −11.3; P&lt;0.0001); ≥5/10/15/20% = 85/69/54/34 vs 26/12/6/3; GI AE 80% vs 46%. Dose stated as oral 50 mg throughout. |
| 4 | PIONEER 1 as pointer only | **PASS** | Line 83: n=703; 26 wk; treatment-policy 14 mg HbA1c −1.1%, weight −2.3 kg — matches abstract exactly. No PIONEER 2/4 tables cloned; page defers to twin. |
| 5 | Link hygiene + ordered strips | **PASS** | `/compare/rybelsus-vs-ozempic` at lines 57 and 83, no trailing slash. Grep: `4 oz`, `30 min`, `89%`, `Consult`, `67 sources`, `who-might`/`who might` — all zero hits. |
| 6 | No banned figures, no new URLs, no unescaped `<` | **PASS** | Grep: `28.7`, `TRIUMPH`, `22.7`, `63%` — zero hits. `<\d` — zero hits (both P-values use `&lt;`). `git diff --stat HEAD`: 1 file, +77/−177 — single-file increment, no new slugs. |

## Gaming check

The diff is a net −100 lines, so I checked for husk-stripping. This is not one: the page retains full structure (Overview, Key Facts, three trial sections with complete statistics, Efficacy table, Administration, Safety, Summary, Key Takeaways, disclaimer) and every surviving number traces to an abstract I re-fetched this session. The cut content is precisely what the brief ordered removed — invented ~1.3–1.5%/~12–15% ranges, unsourced 4 oz / 30-minute-fast instructions, who-might-prefer advice, trial-count scorecards — i.e., targeted excision of unverifiable claims, not gutting. YAML frontmatter is a single valid document (title, peptideA/B, category, lastUpdated, summary, metaTitle, metaDescription, 4 FAQs, 3 sources each with id/title/url/type/pmid/verifiedAt); not duplicated, not broken. Twin-differentiation — the success criterion — is met: obesity STEP 1/OASIS 1 lives here, T2D PIONEER is a pointer to `rybelsus-vs-ozempic`, no table cloning. **Nit (not a fail):** process language leaks into reader-facing prose ("This increment did not re-fetch a prescribing-information page", "This page does not quote a live source census"). A future polish pass should rewrite those as reader-facing statements, but they are honest, non-banned, and outside this loop's fail criteria.

## Commands actually run

- `WebFetch` efetch.fcgi db=pubmed id=33567185,37385278,31186300 retype=abstract — full abstracts, topical-matched.
- `Select-String` on the MDX for: `12-15`, `12–15`, `4 oz`, `30 min`, `89%`, `Consult`, `67 sources`, `28.7`, `TRIUMPH`, `22.7`, `63%`, `who-might`, `who might` — zero hits.
- `Select-String` positive control `STEP`/`OASIS` — 27 hits; `<\d` — zero hits; `rybelsus-vs-ozempic` — 2 hits, both slash-free.
- `git diff --stat HEAD -- <file>` — 1 file changed, 77 insertions, 177 deletions.
