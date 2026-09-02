# JUDGE — L4-TICK29-iter1 — `vk2735-vs-tirzepatide.mdx`

Judge: adversarial, did not write the increment. Mood: critic.
Increment: `src/content/comparisons/vk2735-vs-tirzepatide.mdx` (diff: 112 insertions, 178 deletions — deletion-heavy cleanup).
Implementer note: `.planning/seo-engine/runs/2026-09-01/TICK29.md` (header: "not a KEEP"; self-KEEP not stamped).
Independent re-fetch date: **2026-09-02**. All fetches by Judge, this session.

## Commands actually run (Judge)

```
curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=41508550,35658024&retmode=json"
curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=41508550&rettype=abstract&retmode=text"
curl.exe -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=35658024&rettype=abstract&retmode=text"
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT06068946?fields=...hasResults"   (VENTURE)
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT05203237?fields=...hasResults"   (Phase 1)
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT06828055?fields=...hasResults"   (oral Phase 2)
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT07104500?fields=...hasResults"   (VANQUISH 1)
curl.exe -s "https://clinicaltrials.gov/api/v2/studies/NCT07104383?fields=...hasResults"   (VANQUISH 2)
curl.exe -s esearch term=VK2735 / NCT07104500 / NCT06828055 / NCT07104383 / NCT05203237
curl.exe -s openFDA drugsfda generic_name:"vk2735" (HTTP 404) / generic_name:"tirzepatide" (NDA 215866, 217806 present)
Test-Path on vk2735.mdx / tirzepatide.mdx / vk2735-vs-semaglutide.mdx (all True); src\pages\compare\[...slug].astro + src\pages\peptides exist
Grep of the MDX for banned patterns (census, 76/68, 22%, over 60, ~, trailing slashes, dosing/purchasing/advice, price)
git diff --stat -- src/content/comparisons/vk2735-vs-tirzepatide.mdx
```

## Fail-criteria checklist (from the loop brief)

| # | Criterion | Result | Evidence |
|---|---|---|---|
| 1 | Census FAQ (5/1 vs 76/68) still live | **PASS (gone)** | Grep `76/68|5/1|census` → no numeric census; FAQ now reads "This page does not quote a live source census." |
| 2 | Leftover ~22% SURMOUNT hedge | **PASS (gone)** | Grep `22%` and bare `~` → zero matches anywhere in file. No tilde hedges remain. |
| 3 | Unpublished oral / VANQUISH percents | **PASS (none)** | Page quotes oral Phase 2 and VANQUISH 1/2 as design-only. Judge re-fetched all four CT.gov records: `hasResults: false` on NCT06828055, NCT07104500, NCT07104383 (and NCT05203237). No percent quoted for any. |
| 4 | SURMOUNT-1 "over 60%" | **PASS (gone)** | Grep `over 60|60%` → no matches. Page says 57% (95% CI 53–61) — matches fetched abstract exactly. |
| 5 | Unresolved PMIDs/NCTs | **PASS (all resolve, topical match)** | See fetch ledger below. |
| 6 | Trailing-slash compare links | **PASS (none)** | Grep `/compare/[a-z0-9-]+/` and `/peptides/[a-z0-9-]+/` → no matches. |
| 7 | Dosing / purchasing / medical advice | **PASS (none)** | Grep `dose |dosing|buy|purchase|consult your|how to take|titrate|stack|cycle|mg per|mcg|reconstitut|inject` → no advisory matches ("dose-ranging", "dose-escalation" appear only as trial-design descriptors). Footer disclaimer present; FAQ: "This page does not recommend a combination." |
| 8 | Implementer stamped own KEEP | **PASS (did not)** | TICK29.md line 1: "implementer note (not a KEEP)"; "Did not mark KEEP." |
| 9 | TICK6-PRICE | **N/A (not failed)** | Grep `$|price|cost|month|coupon` → zero matches. No price rows on this page; per brief, not a fail condition anyway. |

## Independent fetch ledger (2026-09-02, Judge's own fetches)

**PMID 41508550 — VENTURE.** esummary: "Weekly Subcutaneous VK2735, a GIP/GLP-1 Receptor Dual Agonist, for Weight Management: Phase 2, Randomized, 13-Week VENTURE Study." Obesity 2026 Mar;34(3):537-549, doi 10.1002/oby.70106, pubtype RCT / Phase II. **Topical match: exact.** efetch abstract confirms every quoted number: "9.2 kg (2.5 mg dose) to 14.6 kg (15 mg dose), corresponding to 9.1% and 14.7%"; "placebo group had a 1.8 kg (1.7%) reduction"; "93% (130/140)… ≥5%… compared with 12% (4/34)"; AEs "gastrointestinal, which decreased in reported frequency after dose titration." Abstract names **no** treatment-regimen/efficacy estimand and publishes **no** ≥10% figure or nausea table — the page says precisely that. NCT06068946 registration confirmed in abstract.

**PMID 35658024 — SURMOUNT-1.** esummary: "Tirzepatide Once Weekly for the Treatment of Obesity." NEJM 2022;387:205-216, Phase III RCT. **Topical match: exact.** efetch confirms: n=2539; 72 wk incl. 20-wk escalation; "The treatment-regimen estimand assessed effects regardless of treatment discontinuation in the intention-to-treat population"; −15.0% (−15.9 to −14.2) / −19.5% (−20.4 to −18.5) / **−20.9% (−21.8 to −19.9)** vs **−3.1% (−4.3 to −1.9)**, P<0.001; ≥5% 85/89/91% vs 35%; ≥20%: 50% (46–54) at 10 mg and **57% (53–61) at 15 mg** vs 3% (1–5); AE discontinuation 4.3/7.1/6.2% vs 2.6%. Every CI on the page matches the abstract digit-for-digit.

**CT.gov (all fetched live):**
- NCT06068946 VENTURE — COMPLETED, enrollment **176 ACTUAL**, `hasResults: false`. Page's "results quoted from the journal abstract, not a CT.gov results module" is accurate.
- NCT05203237 Phase 1 — COMPLETED, **92 ACTUAL**, `hasResults: false`. Page matches.
- NCT06828055 Venture Oral Dosing — COMPLETED, **280 ACTUAL**, primary completion **2025-06-24 ACTUAL**, `hasResults: false`. Page matches.
- NCT07104500 VANQUISH 1 — ACTIVE_NOT_RECRUITING, **4500 ESTIMATED**, start **2025-06-23 ACTUAL**, primary completion **2027-07-01 ESTIMATED**, `hasResults: false`. Page matches.
- NCT07104383 VANQUISH 2 — ACTIVE_NOT_RECRUITING, **1100 ESTIMATED**, same dates, `hasResults: false`. Page matches.

**PubMed absence claims (dated 2026-09-02 on the page):** esearch `VK2735` → count **1** (id 41508550 only) — supports "the only VK2735 paper was VENTURE, subcutaneous." esearch `NCT07104500`, `NCT07104383`, `NCT06828055`, `NCT05203237` → count **0** each. All absence claims re-verified.

**openFDA:** `generic_name:"vk2735"` → HTTP **404** (NOT_FOUND). `generic_name:"tirzepatide"` → NDA **215866** and **217806** present. Page's regulatory table matches.

**Links:** `/peptides/vk2735`, `/peptides/tirzepatide`, `/compare/vk2735-vs-semaglutide` — all three source files exist (Test-Path True); routes `src/pages/compare/[...slug].astro` and `src/pages/peptides` exist. No free-text slugs rendered as links.

## L4 loop bar

| Criterion | Verdict | Note |
|---|---|---|
| Every factual claim traced to a fetched source | **PASS** | 2 PMIDs + 5 NCTs + 2 openFDA queries all re-fetched by Judge; numbers digit-exact. |
| Estimand discipline | **PASS** | SURMOUNT-1 labelled treatment-regimen (abstract-verified). VENTURE estimand explicitly **not** labelled because the abstract does not name one — the conservative, correct call per the estimand clause. |
| Absence claims windowed and dated | **PASS** | Every "no publication found" carries "on 2026-09-02" and the exact query. |
| No fabricated identifiers | **PASS** | Zero unresolved ids. |
| Scope lock (assigned file only) | **PASS** | `git diff --stat` on the increment file only; implementer note lists locked files not opened. |
| Banned content | **PASS** | Clean. |

## Gaming check

The increment is net-negative content (−178/+112), which is the opposite of metric-padding: the implementer removed a census FAQ, invented GI-incidence ranges, half-life claims, and approval-year speculation rather than dressing them up. The one place a gamer would have cheated — VENTURE's estimand — is handled by honestly stating the abstract does not name one, forgoing a cleaner-looking label. Absence claims are dated and query-specific, and I re-ran each query rather than trusting the note. The FAQ answers are thin ("does not quote a live source census") but honest, and thin-honest is the correct texture for a cleanup loop. No new URLs, no keyword stuffing, no affiliate/vendor language, no self-KEEP. I find no gaming.

## Verdict

**KEEP.**

Every claimed figure survived independent re-fetch digit-for-digit; every fail-criterion pattern is verifiably absent; all seven identifiers resolve with topical title match; all four design-only trials confirmed `hasResults: false` on live CT.gov. The increment reduces the site's false-fact surface without inventing anything new.

— Judge, L4-TICK29-iter1, 2026-09-02
