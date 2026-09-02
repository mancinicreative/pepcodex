# TICK29 — implementer note (not a KEEP)

Loop: L4 cited-only on `vk2735-vs-tirzepatide.mdx`. Worst leftover: census FAQ (5/1 vs 76/68), hedged `~14.7%` / `~20.9%` / `~22%`, invented VK2735 GI `~30-40%` / `~15-20%` / `~10-15%` / `~10%`, unpublished oral “early data,” invented Phase 3 “not started” + 2026+ approval years, Who Might / consult. Do not start TICK6-PRICE. Do not mark KEEP.

## Why this file

INTEGRITY I-06 + UPDATE-WORKLIST HIGH: SURMOUNT-1 22% leftover next to PMID 35658024. Assigned file only. Locked TICK19–28 compares and `src/content/peptides/**` not opened.

## Fetched this increment (2026-09-02)

Commands actually run:

```
node .planning\seo-engine\runs\2026-09-01\_tick29-fetch.mjs
node .planning\seo-engine\runs\2026-09-01\_tick29-fetch2.mjs
node .planning\seo-engine\runs\2026-09-01\_tick29-fetch3.mjs
```

Per-alias esearch (not OR-joined). NCBI efetch STATUS 200. NCBI esummary STATUS 200. CT.gov v2 STATUS 200. openFDA drugsfda STATUS 404 (vk2735) / 200 (tirzepatide). Title-matched before quoting.

| Id | Title match | What the fetch showed |
|---|---|---|
| PMID 41508550 NCT06068946 VENTURE | Weekly subcutaneous VK2735 Phase 2, 13-week | Obesity 2026 Mar; doi 10.1002/oby.70106. RCT / Phase II. Mean reduction 9.2 kg (2.5 mg; 9.1%) to 14.6 kg (15 mg; **14.7%**); placebo 1.8 kg (**1.7%**). ≥5% 93% (130/140) vs 12% (4/34). GI common; no nausea %. Abstract does **not** name treatment-regimen vs efficacy. CT.gov completed; enrollment 176 actual; hasResults **false** (quoted journal abstract, not results module). |
| PMID 35658024 SURMOUNT-1 NCT04184622 | Tirzepatide once weekly for obesity | n=2539; 72 wk. **Treatment-regimen.** 5/10/15 mg −15.0/−19.5/−20.9% vs −3.1%. ≥20% at 15 mg **57%** (CI 53–61) vs 3%. AE d/c 4.3/7.1/6.2 vs 2.6. No nausea-percent table. |
| NCT05203237 Phase 1 | Dual GLP-1/GIP SAD/MAD | COMPLETED. Enrollment 92 actual. hasResults **false**. PubMed `NCT05203237` = **0**. Design only. |
| NCT06828055 Venture Oral Dosing | Oral Phase 2, 13-week dose-finding | COMPLETED. Enrollment 280 actual. hasResults **false**. PubMed `NCT06828055` / `"VK2735"` oral paper = **0** (only hit was VENTURE SC). Design only. No oral percent. |
| NCT07104500 VANQUISH 1 | Phase 3 SC, no T2D, 78 wk | ACTIVE_NOT_RECRUITING. Enrollment 4500 estimated. Start 2025-06-23 actual. Primary completion 2027-07-01 estimated. hasResults **false**. PubMed `NCT07104500` = **0**. |
| NCT07104383 VANQUISH 2 | Phase 3 SC, T2D, 78 wk | ACTIVE_NOT_RECRUITING. Enrollment 1100 estimated. Same dates. hasResults **false**. PubMed `NCT07104383` = **0**. |
| openFDA drugsfda | generic_name vk2735 / tirzepatide | VK2735: NOT_FOUND. Tirzepatide: NDA 215866 Mounjaro; NDA 217806 Zepbound. |

PubMed `"VK2735"` count **1** (41508550). `"VK-2735"` / `"Viking 2735"` / VANQUISH queries: **0**.

## File

- `src/content/comparisons/vk2735-vs-tirzepatide.mdx`
  - Stripped census FAQ (5/1 vs 76/68), Who Might, consult-regimen footer, `~14.7%` / `~20.9%` / `~22%` hedges, invented GI `~30-40%` table, `~6`/`~5` day half-life, `~200` patients, “Phase 3 not started,” 2026+/2028 approval years, analyst 72-week projection, “superior to semaglutide” without a fetch.
  - Quoted VENTURE abstract 2.5 mg / 15 mg vs placebo and pooled ≥5%. Did not invent an estimand label. Escaped P&lt;0.001.
  - Quoted Phase 1, oral Phase 2, and VANQUISH 1/2 as design-only with dated PubMed absences. No unpublished percent.
  - Quoted SURMOUNT-1 treatment-regimen with placebo and 57% ≥20% at 15 mg.
  - Linked `/peptides/vk2735`, `/peptides/tirzepatide`, `/compare/vk2735-vs-semaglutide` (no trailing slash).
  - **Did not** strip a ~$1,000/month row (none was on this page). TICK6-PRICE still waiting.
  - lastUpdated 2026-09-02. YAML sources[] + verifiedAt 2026-09-02. CRLF.

## Not done

- Did not mark KEEP.
- Did not start Judge.
- Did not touch locked `orforglipron-vs-tirzepatide.mdx`, `pemvidutide-vs-tirzepatide.mdx`, `tirzepatide-vs-retatrutide.mdx`, `pemvidutide-vs-semaglutide.mdx`, `retatrutide-vs-survodutide.mdx`, `maritide-vs-tirzepatide.mdx`, `amycretin-vs-semaglutide.mdx`, `survodutide-vs-semaglutide.mdx`, or `src/content/peptides/**`.
- Did not restore OSA 63%/6%, TRIUMPH 28.7%, REDEFINE unpublished percents, SYNCHRONY, MOMENTUM unpublished obesity %, amycretin oral ~13%/~25%, or SURMOUNT-1 “over 60% ≥20%.”
- Did not quote a Phase 1, oral Phase 2, or VANQUISH percent.
- Did not fetch SURMOUNT-5 (stripped the uncited comparator sentence instead).
- W3-M1 OAuth.
- TICK6-PRICE still blocked on Lucas.
