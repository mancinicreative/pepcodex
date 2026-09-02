# TICK33 — implementer note (not a KEEP)

Loop: L4 cited-only on `vk2735-vs-semaglutide.mdx`. Worst leftover: census FAQ (5/1 vs 67/52), hedged `~14.7%` on a **2.4 mg** VK2735 row, unpublished oral `~3.3%`, STEP 1 `~14.9%` / OASIS `~15.1%` without estimand or placebo, invented `~7%` discontinuation, `~15%` expected-efficacy, consult. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

Assigned file only. Re-fetched this increment (did not copy TICK29 numbers). Locked TICK19–32 compares and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
node .planning\seo-engine\runs\2026-09-01\_tick33-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick33-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick33-fetch3.mjs
node scripts\qa-banned-content.js src\content\comparisons\vk2735-vs-semaglutide.mdx
node scripts\qa-medical-advice.mjs
```

Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. NCBI esummary STATUS 200. CT.gov v2 STATUS 200 (individual records after dropping invalid `InterventionNames` field). openFDA drugsfda FAIL (fetch failed) both attempts. Title-matched before quoting.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 41508550 NCT06068946 VENTURE | Weekly subcutaneous VK2735 Phase 2, 13-week | Obesity 2026 Mar; doi 10.1002/oby.70106. RCT / Phase II. Mean reduction 9.2 kg (2.5 mg; 9.1%) to 14.6 kg (15 mg; **14.7%**); placebo 1.8 kg (**1.7%**). ≥5% 93% (130/140) vs 12% (4/34). GI common; no nausea %. Abstract does **not** name treatment-regimen vs efficacy. CT.gov completed; enrollment 176 actual; hasResults **false** (quoted journal abstract, not results module). |
| PMID 33567185 STEP 1 NCT03548935 | Once-weekly semaglutide in adults with overweight or obesity | n=1961; 68 wk. **Treatment-regimen** (regardless of discontinuation or rescue). −14.9% vs −2.4% (ETD −12.4 pp; 95% CI −13.4 to −11.5; P&lt;0.001). ≥5/10/15% 86.4/69.1/50.5 vs 31.5/12.0/4.9. −15.3 kg vs −2.6 kg. GI d/c 4.5% vs 0.8%. |
| PMID 37952131 SELECT NCT03574597 | Semaglutide and cardiovascular outcomes in obesity without diabetes | n=17,604. Primary MACE 569/8803 (**6.5%**) vs 701/8801 (**8.0%**); HR **0.80** (95% CI 0.72–0.90); P&lt;0.001. Follow-up 39.8 mo. AE d/c 16.6% vs 8.2%. Not a 20% MACE headline. |
| PMID 37385278 OASIS 1 NCT05035095 | Oral semaglutide 50 mg taken once per day (overweight or obesity) | n=667 randomised; 68 wk. ITT / treatment-policy (regardless of discontinuation or other therapies). −15.1% vs −2.4% (ETD −12.7 pp; 95% CI −14.2 to −11.3; P&lt;0.0001). ≥5% 85% vs 26%. GI AE 80% vs 46%. |
| NCT05203237 Phase 1 | Dual GLP-1/GIP SAD/MAD | COMPLETED. Enrollment 92 actual. Start 2021-12-14 actual. hasResults **false**. PubMed `NCT05203237` = **0**. Design only. |
| NCT06828055 Phase 2 oral | 13-week oral formulation | COMPLETED. Enrollment 280 actual. Start 2024-12-18 actual. Primary completion 2025-06-24 actual. hasResults **false**. PubMed `NCT06828055` = **0**. Design only. No oral percent. |
| NCT07104500 VANQUISH 1 | Phase 3 SC, no T2D, 78 wk | ACTIVE_NOT_RECRUITING. Enrollment 4500 estimated. Start 2025-06-23 actual. Primary completion 2027-07-01 estimated. hasResults **false**. PubMed `NCT07104500` = **0**. |
| NCT07104383 VANQUISH 2 | Phase 3 SC, T2D, 78 wk | ACTIVE_NOT_RECRUITING. Enrollment 1100 estimated. Same dates. hasResults **false**. PubMed `NCT07104383` = **0**. |

PubMed `"VK2735"` count **1** (41508550). `"VK-2735"` / `"Viking 2735"` / `"VANQUISH" VK2735`: **0**.

## File

- `src/content/comparisons/vk2735-vs-semaglutide.mdx`
  - Stripped census FAQ (5/1 vs 67/52), consult-regimen FAQ/footer, `~14.7%` on a 2.4 mg VK2735 row, unpublished oral `~3.3%`, hedged STEP 1 / OASIS percents, invented `~7%` d/c, `~15%` expected-efficacy, 2026+ approval year, fasting / food-restriction row, dual-agonist “superior” copy, developer-partnership speculation.
  - Quoted VENTURE abstract 2.5 mg / 15 mg vs placebo and pooled ≥5%. Did not invent an estimand label. Escaped P&lt;0.001.
  - Quoted STEP 1 treatment-regimen with placebo. Quoted SELECT HR 0.80 (6.5% vs 8.0%), not a rounded relative-risk headline.
  - Quoted OASIS 1 treatment-policy −15.1% vs −2.4% (fetched this run; already on the page’s sources[]).
  - Quoted Phase 1, oral Phase 2, and VANQUISH 1/2 as design-only with dated PubMed absences (2026-09-02). No unpublished percent.
  - Linked `/peptides/vk2735`, `/peptides/semaglutide`, `/compare/vk2735-vs-tirzepatide` (no trailing slash).
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.
  - `qa-banned-content.js` on this file: PASS after rewording `50 mg once` / `dose` / `Dosing` body strings. `qa-medical-advice.mjs` site scan printed PASS (Implementer check only; not a KEEP).

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `orforglipron-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `tirzepatide-vs-retatrutide.mdx`, `pemvidutide-vs-semaglutide.mdx`, `retatrutide-vs-survodutide.mdx`, `maritide-vs-tirzepatide.mdx`, `amycretin-vs-semaglutide.mdx`, `survodutide-vs-semaglutide.mdx`, `vk2735-vs-tirzepatide.mdx`, `cagrilintide-vs-semaglutide.mdx`, `retatrutide-vs-semaglutide.mdx`, `wegovy-vs-zepbound.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, SURMOUNT-1 “over 60%”, SYNCHRONY, or amycretin oral ~13%/~25%.
- Did not quote a Phase 1, oral Phase 2, or VANQUISH percent.
- Did not complete openFDA (fetch failed). FAQ states that. No NDA numbers invented.
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.
