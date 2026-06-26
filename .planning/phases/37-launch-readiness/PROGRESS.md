# Phase 37 — Launch Readiness · Progress Tracker

*Branch: `feat/peptracker-rebrand`. Updated live as waves land.*

## Confirmed decisions
- Name stays **PepCodex** (PepTracker = visual identity only). No domain/SEO migration.
- **Directory** removed from nav; stub kept by URL; real paid directory = V2.
- Newsletter exit-popup **removed**.
- **Both** citation remediation AND full two-axis scoring rollout completed before merge.

## Citation remediation method (per dossier)
Multi-agent workflow (`workflows/scripts/citation-remediation-wf_111e3221-8c1.js`):
fix agent (resolve EVERY pmid against PubMed → replace mismatches with verified sources or honestly
reframe; never write an unresolved PMID) → independent verify agent (re-resolve all, confirm topical
match). CHUNK=3 (OneDrive EMFILE safety). Spot-verified by hand + build gate before each commit.

## Status

| Step | Scope | Status | Commit |
|------|-------|--------|--------|
| Chunk 0 | Surface/IA: popup, nav (drop Directory, add Regulatory+Methodology), dead anchors, dead code | DONE | 775b015 |
| Citations B1 | GLP-1 flagship (10) | DONE — ~101 cites fixed, 10/10 verified clean | 9d67c0c |
| Citations wave-aa | 225ac-dota-lm3, 5-amino-1mq, alixorexton, alpha-defensins, aod-9604, bpc-157, bronchogen, bt5528, cardiogen, cartalax, cerebrolysin (cerluten already clean) | DONE — ~118 cites fixed; bt5528 + alpha-defensins hand-fixed after verify | eb6454a |
| Citations wave-ab | cjc-1295, cortexin, ct-388, dihexa, dsip, epithalon, follistatin (5 others zero-PMID/clean) | DONE — ~56 fixes; dihexa retracted-paper hand-fix; prompts hardened for retractions | 18cbf4e |
| Citations wave-ac | ghk, ghk-cu, ghrp-2, ghrp-6, glutathione, hcg, hexarelin, hmg, humanin, igf-1-lr3, ipamorelin (foxo4-dri clean) | DONE — ~123 fixes, all clean | 25357c1 |
| **Build-blocker fix** | agents used off-enum `keyFindings.type` ('review','cell') → broke build; fixed enum+layout+EvidenceChain. **Earlier "green" reports were misread (trailing grep exit, not npm).** | DONE | 4d6b9f2 |
| UX research | examine/cochrane/drugs.com/mdcalc patterns → UX-RESEARCH.md + plan Chunk 0b (TOC, facet counts, verdict sentence, legend) | DONE | 22523a3 |
| Citations wave-ad | kisspeptin, klotho, kpv, kristagen, lactoferricin, livagen, ll-37, melanotan-i, melanotan-ii, mk-677 (maritide, mk-0616 clean) | DONE — ~96 fixes, all clean | daa50c3 |
| Citations wave-ae | mots-c, mrna-4157, murepavadin, na-selank-amidate, na-semax-amidate, oveporexton, p21, pasireotide, pemvidutide (ovagen, pancragen, peg-mgf clean) | DONE — ~72 fixes (mots-c 10/11 fabricated), all clean | 4f1f9f9 |
| Citations wave-af | pinealon, prostatilen, pt-141, retinalamin, selank, semax, sermorelin, shlp-2, shlp-6 (pf-08653944, rusfertide, sigumir clean) | DONE — ~98 fixes, all clean | 035b4e0 |
| Citations wave-ag | slu-pp-332, ss-31, sulanemadlin, tb-500, tesamorelin, thymalin, thymogen, thymosin-alpha-1 (stamakort, suprefort, svetinorm, testagen clean) | DONE — ~86 fixes, all clean (qualifier enum fix) | fa01857 |
| Citations wave-ah | thymulin, ventfort, vesugen, vilon, visoluten, vk2735, vladonix, zelenectide-pevedotin | RUNNING (wf_2bfccd67-983) — **final wave** | — |
| Citations wave-ah | thymulin, ventfort, vesugen, vilon, visoluten, vk2735, vladonix, zelenectide-pevedotin | queued | — |
| Scoring rollout | populate two-axis `scoring:` on the ~83 dossiers still on legacy (after their citations are clean) | not started | — |
| PMID guard | `scripts/qa-pmids.mjs` build-time resolver + commit audit tooling | not started | — |
| Final QA + merge | working-tree reconcile, full build, visual/a11y, merge → Vercel prod | not started | — |

## Re-score flags (scoring phase must RE-score these, not just the 83 unscored)
Dossiers whose existing two-axis score was built on now-corrected fabricated data:
- **bt5528** — effectiveness score 52 was based on a fabricated 45%/67% ORR; real ORR is 6.7% (DCR 20%). Re-score down.
- *(append as later waves surface more)*

## Per-wave loop
launch wave → wait ~30 min → parse verdicts → hand-fix any `needs_work` residuals → `npm run build` →
commit (precise staging of that wave's dossier files only) → prime script's list to next wave → launch.
