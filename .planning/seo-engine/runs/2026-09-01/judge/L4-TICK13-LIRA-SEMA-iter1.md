# L4-TICK13-LIRA-SEMA — iter 1 — Quality Judge

**Loop:** L4 (integrity, false facts) on `src/content/comparisons/liraglutide-vs-semaglutide.mdx`
**Judge:** Agent J (Kimi K3). Did not write this increment. Mood: critic.
**Implementer note:** `../TICK13-LIRA-SEMA.md` · **Brief:** `../LOOP-TASKS.md` #### TICK13-LIRA-SEMA
**Diff:** `git diff --stat HEAD` → 1 file, +89 / −137. No new URLs.

## Independent efetch (this judge, 2026-09-02)

`efetch.fcgi?db=pubmed&id=26132939,33567185,31539622,27295427,27633186,37952131&rettype=abstract&retmode=text` — all six returned, topical-matched:

| PMID | Fetched title | Cited as | Match |
|---|---|---|---|
| 26132939 | A Randomized, Controlled Trial of 3.0 mg of Liraglutide in Weight Management (SCALE NN8022-1839) | SCALE, liraglutide obesity | PASS |
| 33567185 | Once-Weekly Semaglutide in Adults with Overweight or Obesity (STEP 1) | STEP 1, semaglutide obesity | PASS |
| 31539622 | …semaglutide 1.0mg vs once-daily liraglutide 1.2mg… (SUSTAIN 10) | SUSTAIN 10, T2D head-to-head | PASS |
| 27295427 | Liraglutide and Cardiovascular Outcomes in Type 2 Diabetes (LEADER) | LEADER, liraglutide CV | PASS |
| 27633186 | Semaglutide and Cardiovascular Outcomes in Patients with Type 2 Diabetes (SUSTAIN-6) | SUSTAIN-6, semaglutide CV | PASS |
| 37952131 | Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes (SELECT) | SELECT, sema CV no-DM | PASS |

No sibling mixup: SUSTAIN 10 (T2D head-to-head) vs SUSTAIN-6 (CV outcomes) correctly distinguished; SCALE vs STEP 1 correctly attributed per drug.

## Criteria (PASS/FAIL + evidence)

1. **SCALE in kg, not −8.0% — PASS.** Page: −8.4 kg vs −2.8 kg, diff −5.6 kg (95% CI −6.0 to −5.1). Abstract: identical. `-8\.0%` → 0 hits. ≥5% 63.2%/27.1% and ≥10% 33.1%/10.6% match abstract to the digit. ≥15% cell reads "Not in the SCALE abstract fetched 2026-09-02" — dated absence, correct (abstract has no ≥15%).
2. **STEP 1 figures — PASS.** −14.9% vs −2.4% (ETD −12.4 pp, CI −13.4 to −11.5); 86.4/31.5, 69.1/12.0, 50.5/4.9 — all match abstract. `nearly double` → 0 hits; page states "does not compute a doubling."
3. **SUSTAIN 10 — PASS.** HbA1c −1.7% vs −1.0% (ETD −0.69%, CI −0.82 to −0.56, `P&lt;0.0001`); weight −5.8 vs −1.9 kg (ETD −3.83, CI −4.57 to −3.09, `P&lt;0.0001`); GI disorders 43.9% vs 38.3%; AE d/c 11.4% vs 6.6%. All match abstract. `<\d` → 0 hits file-wide; zero raw `<` characters in file.
4. **CV trials, HR-led — PASS.** LEADER HR 0.87 (0.78–0.97), P&lt;0.001 noninf + P=0.01 sup — both P-values are in the abstract. SUSTAIN-6 HR 0.74 (0.58–0.95), only noninferiority P quoted — no invented superiority P; retinopathy HR 1.76 (1.11–2.78, P=0.02) matches. SELECT HR 0.80 (0.72–0.90), P&lt;0.001, n=17,604, 39.8 mo — match. Absolute event rates (13.0/14.9, 6.6/8.9, 6.5/8.0) are the abstracts' raw rates quoted beside HRs, not rounded relative-reduction headlines. `13%` / `26%` / `20%` / `22% reduction` → 0 hits.
5. **Strippings — PASS.** `30-40` → 0; `Consult` → 0; `Generic` → 0; injections ~30-vs-4 gone (only the disavowal sentence remains); HbA1c range table replaced by a dated-absence note.
6. **Preserved per brief — PASS.** List Price ~$1,000-1,400 / ~$900-1,350 present (L168). `1,000-1,400` and `900-1,350` → 1 hit each.
7. **Banned restorations — PASS.** `TRIUMPH` → 0; `28.7` → 0; `22.7` → 0; `OSA` → 0; `63%` → 0 (63.2% SCALE is allowed and present). Positive control `SCALE|STEP` → 23 hits.
8. **No trophy disavowals (TICK11 R2) — PASS.** Eight "This page does not…" sentences; none repeat 13%/26%/20%/22.7%/28.7%/63% as trophies. The one "relative" hit is the practice-level disavowal "not a rounded relative-risk headline."
9. **Citation integrity — PASS.** Exactly six bracket IDs in body; all six defined in frontmatter `sources:` with `verifiedAt: 2026-09-02`. No dangling IDs. SUSTAIN 10 DOI `10.1016/j.diabet.2019.101117` matches fetched record. `lastUpdated` bumped to 2026-09-02.
10. **Estimand honesty — PASS.** SCALE (kg) and STEP 1 (%) explicitly not divided; SUSTAIN 10 framed as T2D head-to-head at 30 wk, "not an obesity-dose comparison"; CV section instructs HR-first. STEP 1 figures are the primary (treatment-policy) estimand as published.

## Residual (not fail conditions; not in brief)

- Structure table (homology 97%/94%, half-life ~13 h / ~165 h, residue changes) not re-fetched this increment — implementer disclosed this. Unverified but plausible standard facts; candidates for a future cited pass.
- "Does not copy BMI cutoffs… from memory" over-disavows slightly: SCALE's abstract does state BMI ≥30 / ≥27+comorbidity eligibility. Over-caution removes information; it does not fabricate. Acceptable.

## Gaming check

The cheap ways to game this loop were: strip the page to a husk and claim integrity; keep banned numbers alive inside "we do not claim X" trophy sentences; or offer resolution-only PMID checks as proof. None occurred. The page retains six fully-specified trials with event counts, HRs, CIs, and P-values, and every figure I re-derived from my own independent efetch matches the page to the digit — including the easy-to-fumble ones (SCALE diff −5.6 kg CI −6.0 to −5.1; SUSTAIN 10 ETD −0.69% CI −0.82 to −0.56; SELECT 569/8803 vs 701/8801; LEADER CV-death HR 0.78). Disavowals name practices, not banned statistics. The diff (−137/+89) is real removal of unsourced claims, not cosmetic churn, and the two preserved price rows are exactly the ones the brief protected. The increment wins by being boringly accurate, which is the point of L4.

## Verdict: **KEEP**

Commands run by this judge: WebFetch efetch (6 PMIDs, topical-matched); `git diff --stat HEAD`; PowerShell Select-String battery (19 patterns) + citation-ID/bracket audit. Ratchet row for Conductor: `| 13 | TICK13 cited-only lira-vs-sema | comparisons/liraglutide-vs-semaglutide.mdx | 6/6 PMIDs topical + figures match efetch; 0 banned strings; 0 raw `<` | keep | structure table still unfetched (disclosed) |`
