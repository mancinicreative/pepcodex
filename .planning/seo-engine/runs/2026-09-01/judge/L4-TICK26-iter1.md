# Judge — L4-TICK26-iter1 — KEEP

**Loop:** L4-TICK26 · **File:** `src/content/comparisons/maritide-vs-tirzepatide.mdx` · **Judge date:** 2026-09-02 · **Verdict: KEEP**

I did not write this increment. I did not read the implementer's fetch artifacts as evidence; I re-fetched every identifier myself against NCBI efetch/esearch, CT.gov v2, and openFDA, and diffed the file against `git show HEAD` for the before-state.

## Commands actually run (2026-09-02)

```
curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=40549887&rettype=abstract&retmode=text"
curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=35658024&rettype=abstract&retmode=text"
curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=38316982&rettype=abstract&retmode=text"
curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=37385275&rettype=abstract&retmode=text"
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT06858839?fields=...hasResults"
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT06858878?fields=...hasResults"
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT05669599?fields=...hasResults"
curl.exe -s "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22tirzepatide%22&limit=5"  (+ node parse)
curl.exe -s "https://api.fda.gov/drug/drugsfda.json?search=openfda.generic_name:%22maridebart%22&limit=1"
WebFetch esearch: db=pubmed term=NCT06858839 / NCT06858878 / "MARITIME-1" maridebart / "MARITIME-2" maridebart
Grep current file: ~14-17%|~15-17%|~20%+|15-22%|21/10|76/68|SURPASS|12-33|dual agonist|trailing-slash /compare/
Grep current file: buy|purchase|vendor|dose yourself|you should take|consult your|doctor|medical advice|reconstitut|inject|stack|cycle
git show HEAD:src/content/comparisons/maritide-vs-tirzepatide.mdx  (before-state pattern scan)
```

(curl esearch kept failing with exit 6 / DNS on this machine; the four esearch counts were reproduced via WebFetch against the same eutils endpoint instead. efetch and CT.gov curl calls all returned 200.)

## Independent fetch evidence

| Id | Topical title match | Numbers on page vs fetched abstract/registry |
|---|---|---|
| PMID 40549887 | "Once-Monthly Maridebart Cafraglutide for the Treatment of Obesity - A Phase 2 Trial" (NEJM 2025) | n=592 (465 obesity / 127 obesity-diabetes); 52 wk; **treatment-policy**; obesity −12.3% (CI −15.0 to −9.7) to −16.2% (CI −18.9 to −13.5) vs −2.5% (CI −4.2 to −0.7); T2D −8.4% (CI −11.0 to −5.7) to −12.3% (CI −15.3 to −9.2) vs −1.7% (CI −2.9 to −0.6); HbA1c −1.2 to −1.6 pp vs +0.1 pp; arms 140/280/420 q4w, 420 q8w, escalation arms; GI common, no nausea %. **All verbatim.** Abstract: "combines GLP-1 receptor agonism and GIP receptor antagonism" — page's mechanism matches. |
| PMID 35658024 | "Tirzepatide Once Weekly for the Treatment of Obesity" (NEJM 2022, SURMOUNT-1) | n=2,539; 72 wk; **treatment-regimen**; −15.0/−19.5/−20.9% vs −3.1% (P<0.001); ≥20%: 50% (10 mg) and 57% (15 mg; CI 53–61) vs 3%; AE d/c 4.3/7.1/6.2 vs 2.6. **All verbatim.** |
| PMID 37385275 | "Tirzepatide once weekly … obesity … type 2 diabetes (SURMOUNT-2)" (Lancet 2023) | n=938; 72 wk; **treatment-regimen**; −12.8/−14.7% vs −3.2%; estimated differences −9.6/−11.6 pp (P<0.0001); ≥5% 79–83% vs 32%; GI d/c <5%. **All verbatim.** |
| PMID 38316982 | "A GIPR antagonist conjugated to GLP-1 analogues … preclinical and phase 1" (Nat Metab 2024) | Acceptable safety, dose-dependent weight loss, MAD maintained ≤150 days after last dose; **no percent in abstract** — page says exactly that and invents none. |
| NCT06858839 | CT.gov: "…Maridebart Cafraglutide … Without Type 2 Diabetes … (MARITIME-1)" | ACTIVE_NOT_RECRUITING; enrollment 3,853 ACTUAL; primary completion 2027-01-21 ESTIMATED; **hasResults false**. Page verbatim. |
| NCT06858878 | CT.gov: "…Maridebart Cafraglutide … With Type 2 Diabetes … (MARITIME-2)" | ACTIVE_NOT_RECRUITING; enrollment 1,105 ACTUAL; primary completion 2027-01-21 ESTIMATED; **hasResults false**. Page verbatim. |
| NCT05669599 | CT.gov: "Dose-ranging Study … AMG 133 … Overweight or Obesity …" (Phase 2) | COMPLETED; enrollment 592 ACTUAL; completion 2025-12-16 ACTUAL; **hasResults false**. Page verbatim. |
| openFDA drugsfda | tirzepatide → NDA215866 MOUNJARO, NDA217806 ZEPBOUND; maridebart → NOT_FOUND | Page's regulatory table and FAQ match; dated 2026-09-02. |
| PubMed esearch | NCT06858839 → count 0; NCT06858878 → count 0; "MARITIME-1" maridebart → 0; "MARITIME-2" maridebart → 0 | Page's four dated absence claims all reproduced by my own searches. |

## Pass/fail vs the must-fail list

1. **~14-17% / ~15-17% / ~20%+ / 15-22% hedges as data** — PASS. Zero matches in current file. Before-state had them (HEAD lines 82, 97, 102, 123–124, 208: "up to ~15-17% reported", "15-22% weight loss", "~20%+", "~14-17% (reported)"). All stripped.
2. **Census FAQ (21/10 vs 76/68)** — PASS. Before-state FAQ: "MariTide has 21 sources (10 human studies)… Tirzepatide has 76 sources (68 human studies)". Current file: zero matches for 21/10 or 76/68; the replacement FAQ states "This page does not quote a live source census."
3. **Invented SURPASS A1c or GI 12–33%** — PASS. Before-state line 96 "SURPASS (T2D) | Completed | 1.5-2.4% A1c reduction" and line 151 "Nausea | 12-33%" are gone; zero matches for SURPASS / 12-33 in current file. No SURPASS row was re-invented.
4. **Unpublished MARITIME percents** — PASS. Page quotes design only (status, enrollment, dates) and explicitly: "This page does not quote a Phase 3 percent from those registry records." My CT.gov fetches confirm hasResults false for both.
5. **Maritide as dual agonist** — PASS. Current file: "GLP-1 receptor agonist paired with a GIP receptor antagonist" (maritide) vs "dual GIP and GLP-1 receptor agonist" (tirzepatide only). NEJM 2025 abstract confirms GIPR **antagonism** + GLP-1 agonism. Before-state's "dual GLP-1/GIP receptor agonist" (HEAD lines 8, 38, 70, 209) is gone.
6. **Unresolved PMIDs/NCTs** — PASS. 4/4 PMIDs efetch 200 with topical title match; 4/4 NCTs CT.gov 200 with matching titles/status. All 7 `sources[]` entries carry `verifiedAt: 2026-09-02`; body citation ids map to sources; no dangling ids.
7. **Trailing-slash compare links** — PASS. Links are `/peptides/maritide`, `/peptides/tirzepatide`, `/compare/maritide-vs-semaglutide` — no trailing slashes; all three target files exist in the collections.
8. **Dosing / purchasing / medical advice** — PASS. Banned-pattern grep hit only "live source census" (the noun "source") and the `sources:` frontmatter key. No dose schedule, no vendor language. The old "Consult a qualified healthcare provider before considering any peptide regimen" FAQ answer is gone; the new combination FAQ is an evidence statement ("There is no published clinical trial on this page that randomised maridebart cafraglutide plus tirzepatide"), not advice.
9. **Implementer stamped their own KEEP** — PASS. TICK26.md header: "implementer note (not a KEEP)"; body: "Did not mark KEEP." LOOP-TASKS.md contains no TICK26 entry.

## L4 judge-specific bars (LOOPS.md)

- Absence claims carry window dates (MARITIME PubMed/hasResults "as of 2026-09-02"; openFDA "accessed 2026-09-02") — PASS.
- Estimands correct and leading: treatment-policy heads the maritide Phase 2 (the estimand the NEJM abstract names); treatment-regimen heads SURMOUNT-1/-2; no efficacy estimand headlined anywhere — PASS.
- No sibling-trial mixup (SURMOUNT-1 vs -2 PMIDs correct; MARITIME-1 vs -2 NCTs correct; Phase 1 vs Phase 2 not conflated) — PASS.
- No fuzzy-title auto-attach; every identifier fetched and topical-matched this run — PASS.
- `P&lt;0.001`, `P&lt;0.0001`, `&lt;5%` escaped in MDX — PASS.
- `lastUpdated` bumped to 2026-09-02 — PASS.

## Gaming check

The plausible cheats were: (a) swapping in real PMIDs while keeping the old invented numbers — refuted; every percent, CI, enrollment, and responder count on the page appears verbatim in my independently fetched abstracts, and the before/after diff shows the invented rows deleted rather than relabelled; (b) hollowing the page out until nothing checkable remains — not the case; the page still carries the full Phase 2 and SURMOUNT-1/-2 efficacy datasets, so "clean" was not achieved by omission; (c) replacing the census FAQ with a sneakier census — the replacement is a disavowal, not a restatement; (d) quietly keeping the dual-agonist framing in a subsidiary spot — the mechanism is stated correctly in the FAQ, Key Facts, and Summary tables alike. The heavy "This page does not quote/invent…" meta-disavowal style is a readability cost, not an integrity defect, and matches the pattern already accepted in L4-TICK25. The retained "~$1,000+/month" tirzepatide price row is explicitly out of scope per the TICK6-PRICE instruction and was not scored. No gaming detected.

## Verdict: KEEP

Residual notes for the Conductor (not this loop's failures): TICK6-PRICE (`~$1,000+/month` rows site-wide) remains blocked on Lucas per instructions; the other locked compares listed in TICK26.md (`orforglipron-vs-tirzepatide`, `pemvidutide-vs-tirzepatide`, `tirzepatide-vs-retatrutide`, `pemvidutide-vs-semaglutide`, `amycretin-vs-semaglutide`, `retatrutide-vs-survodutide`) were not opened by this increment and remain under their own tickets.
