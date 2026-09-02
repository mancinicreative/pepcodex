# ORIGINAL-ASK-STATUS — Lucas prompt → run 2026-09-01

*Mapper only. Read-only on `src/content`. Written 2026-09-02. Branch `feat/scoring-and-freshness`.*

## Status table

| # | Original ask | Status | Evidence (artifact) |
|---|---|---|---|
| 1 | Singapore scraper (GA4 vs GSC, WAF, localhost gtag) | **IN FLIGHT** (diagnosis KEEP; edge **BLOCKED ON LUCAS**) | `.planning/seo-engine/runs/2026-09-01/BOT-DIAGNOSIS.md`, `BOT-WAF-DRAFT.md`, `judge/L1-iter1.md`. Localhost gtag skip coded in `BaseLayout.astro` (not live until deploy). WAF challenge + GA4 Admin filter = Lucas clicks. Live SG re-check waits on OAuth. |
| 2 | Access to GSC + Analytics (auth, pulls, MEASUREMENT) | **BLOCKED ON LUCAS** | `AUTH-BLOCKED.md` (`invalid_rapt`). `MEASUREMENT.md` = 2026-07-25 data labeled STALE/UNTRUSTED. Scripts patched; W3-M1 cannot run until Desktop OAuth line in AUTH-BLOCKED. |
| 3 | Past 3 months peptides: trials, info, missing peptides | **IN FLIGHT** (scan + gated slice KEEP; new peptides **WON'T DO**) | Scan: `.planning/research-scan/2026-09-01/SUMMARY.md` (107 peptides; 2008/149/108 headline — noise-gated). Worklist: `UPDATE-WORKLIST.md`. Applied KEEP: `judge/L5-TR1.md`, `L5-E1.md`, `L5-R1.md`, `L5-D1.md` (8 dossiers). Gaps parked: `NEEDS-VERIFICATION-F1.md`. **New peptides:** `CONTENT-PLAN.md` net-URL ledger **0 adds** — no new dossiers this run. |
| 4 | False links already on the site | **DONE** (L2 KEEP) | Wave-1 map: `FALSE-LINKS.md`. Closed: `judge/L2-iter2.md`, `GRAPH-BASELINE.md` → post-fix `GRAPH_EXIT=0`, broken 0 (`VERIFICATION.md`, `RUN-REPORT.md`). |
| 5 | False info already on the pages | **IN FLIGHT** | Wave-1: `INTEGRITY-FINDINGS.md`. CRITICAL/I-0x KEEP via `judge/L4-I05`…`I09`, `L4-CITED.md`, K3 + TICK5–18/20/22 KEEP. **Still running / awaiting Judge:** TICK19 `orforglipron-vs-tirzepatide`, TICK21 `pemvidutide-vs-tirzepatide`, TICK23 `tirzepatide-vs-retatrutide` (`LOOP-TASKS.md`). More dirty compares remain (below). |
| 6 | Multi-agent process (task-per-agent; strategy → implement → judge) | **DONE** (engine live) | Constitution: `.planning/seo-engine/ORCHESTRATOR.md`, `LOOPS.md`, `AGENTS.md`. Invoke: `INVOKE.md` + `.claude/skills/seo-engine/SKILL.md`. Queue + KEEP log: `LOOP-TASKS.md`. Judge files under `runs/2026-09-01/judge/`. |

## Lock list (IN FLIGHT — do not edit / do not dispatch)

| Compare slug | Tick | Note |
|---|---|---|
| `orforglipron-vs-tirzepatide` | TICK19 | Running; Judge retried (`resource_exhausted`); no `L4-TICK19-*` on disk yet |
| `pemvidutide-vs-tirzepatide` | TICK21 | Running; awaiting Judge; no `L4-TICK21-*` yet |
| `tirzepatide-vs-retatrutide` | TICK23 | Running; awaiting Judge |
| `pemvidutide-vs-semaglutide` | — | Dirty (~70% / ~16%); locked per Conductor — no competing editor |
| `amycretin-vs-semaglutide` | — | Partially touched by TICK2-QA; locked — no competing editor |

## Dirty compares still likely unclean (NOT in lock list)

Heuristic: census FAQ leftovers, invented `~` efficacy percents, or “Who Might Consider” consult blocks. Already-KEEP compares that only say “does not quote a live source census” are **not** listed.

| Slug | Symptom class |
|---|---|
| `retatrutide-vs-survodutide` | `~22%` / `~24%` / `~18-19%` dose table |
| `survodutide-vs-semaglutide` | `~18-19%` / `~15%` |
| `retatrutide-vs-semaglutide` | `~24%` at 48 weeks |
| `maritide-vs-tirzepatide` | `~20%+`; Who Might |
| `mazdutide-vs-semaglutide` | `~7%` discontinuation |
| `cagrilintide-vs-semaglutide` | `~6%` / `~9%` / `~11%` monotherapy table (STEP-1 cite pass ≠ full clean) |
| `vk2735-vs-tirzepatide` | `~10%` / `~14.7%` / `~22%`; Who Might |
| `vk2735-vs-semaglutide` | `~7%` / `~15%` |
| `5-amino-1mq-vs-aod-9604` | `~3%` AOD row |
| `tesamorelin-vs-sermorelin` / `-ghrp-6` / `-mk-677` | `~18%` visceral-fat rows (+ TICK6-PRICE dollar rows if Lucas later says yes) |
| `cjc-1295-vs-sermorelin`, `mk-677-vs-sermorelin`, `thymosin-alpha-1-vs-thymalin` | Who Might sections |

## High worklist slugs not yet applied

From `UPDATE-WORKLIST.md` W2 High freshness table. **Applied** (TR1/E1/R1/D1 KEEP): `retatrutide`, `survodutide`, `oveporexton`, `orforglipron`, `cagrisema`, `cagrilintide`, `mazdutide`, `maritide`.

| Slug | Why still open |
|---|---|
| `amycretin` | 1 paper in scan; not in E1/D1 eight-file set |
| `rusfertide` | High; stretch pack only if bandwidth — not KEEP’d |
| `pf-08653944` | Trials-only High; not in TR1 KEEP set |
| `ct-388` | Status-sync High; not applied |
| `tirzepatide` / `semaglutide` | High volume — **noise-gated**; filter to RCT/Phase 3 titles before any dossier ingest (do not dump) |
| Noise dumps (do not apply) | `glutathione`, `hcg`, `ll-37`, `klotho`, `kisspeptin`, `follistatin`, `humanin`, `alpha-defensins` |

## Cannot proceed without Lucas

| Gate | Blocks | Artifact |
|---|---|---|
| **OAuth** (`gcloud auth application-default login` Desktop client) | Live GSC/GA4, honest MEASUREMENT rewrite, W3-M1, SG re-verify, re-rank before Set 6 | `AUTH-BLOCKED.md` |
| **WAF click** (Vercel Firewall challenge SG + allowlist) | Edge kill of Singapore-class scraper | `BOT-WAF-DRAFT.md` |
| **TICK6-PRICE = yes** | Strip `~$1,000/month` (and kin) purchasing-adjacent rows on listed compares | `LOOP-TASKS.md` TICK6-PRICE |

Also Lucas-owned (not in the three, still real): GA4 Admin filter click; Vercel dashboard apex→www 307→308; twin merge-with-redirect; GSC Request indexing for hub URLs.

## Judge KEEP files (by filename)

Under `.planning/seo-engine/runs/2026-09-01/judge/`:

`K3-2026-09-02.md` · `L0-iter1.md` · `L1-iter1.md` · `L2-iter1.md` · `L2-iter2.md` · `L3-T1.md` · `L4-CITED.md` · `L4-I05.md` · `L4-I07.md` · `L4-I08.md` · `L4-I09.md` · `L4-TICK5-K3RES-iter1.md` · `L4-TICK6-LEADER-iter1.md` · `L4-TICK7-REDEFINE-iter1.md` · `L4-TICK8-REDEFINE-iter1.md` · `L4-TICK9-COMPARE-iter1.md` · `L4-TICK10-GI-iter1.md` · `L4-TICK11-LIRA-TIRZ-iter1.md` · `L4-TICK11-LIRA-TIRZ-iter2.md` · `L4-TICK12-SURMOUNT-iter1.md` · `L4-TICK13-LIRA-SEMA-iter1.md` · `L4-TICK14-ORFOR-iter1.md` · `L4-TICK15-SURVO-iter1.md` · `L4-TICK16-MAZDU-iter1.md` · `L4-TICK17-RYBEL-iter1.md` · `L4-TICK18-ORALINJ-iter1.md` · `L4-TICK20-iter1.md` · `L4-TICK22-iter1.md` · `L5-TR1.md` · `L5-E1.md` · `L5-R1.md` · `L5-D1.md` · `L6-SET2.md` … `L6-SET7.md` · `L7-iter1.md` · `L8-iter1.md`

**Missing Judge files (in-flight):** `L4-TICK19-ORFOR-TIRZ-iter1.md`, `L4-TICK21-iter1.md`, `L4-TICK23-iter1.md`.

## LOOP-TASKS KEEP vs pending (grep summary)

- **KEEP this session:** W2-I05/I07/I08/I09 · W2-F-TR1/E1/R1/D1 · W2-T1 · L2 · L7 · L8 · L6 Sets 1–7 · L4-CITED · W2-U1 · W2-G1 · W3-V1 build+graph · TICK2-QA · TICK4-STEP1 · K3 · TICK5–18 · TICK20 · TICK22.
- **Running / awaiting Judge:** TICK19, TICK21, TICK23.
- **Blocked on Lucas:** Gate 0 / W3-M1 OAuth; TICK6-PRICE; WAF apply.
- **Stale line in LOOP-TASKS “On track” table:** still says W2-F-D1 prose open — contradicted by KEEP list + `judge/L5-D1.md` (**KEEP**). Trust KEEP list.

## Next 5 unlocked packets (Grok editor — no lock collision)

One file each. Do not touch lock-list compares. Do not start TICK6-PRICE. Do not run sole-occupant Verifier while editors are still on TICK19/21/23.

| # | Packet | File | Job (one line) |
|---|---|---|---|
| 1 | Agent I — RETA-SURVO | `src/content/comparisons/retatrutide-vs-survodutide.mdx` | Fetch Phase 2 retatrutide + SYNCHRONIZE / survodutide abstracts this run; strip invented `~22/~24/~18-19%` table; treatment-regimen only. |
| 2 | Agent I — MARI-TIRZ | `src/content/comparisons/maritide-vs-tirzepatide.mdx` | Fetch maritide + SURMOUNT-1 ids; strip `~20%+` and Who Might / consult; no unpublished H2H %. |
| 3 | Agent I — VK-TIRZ | `src/content/comparisons/vk2735-vs-tirzepatide.mdx` | Re-fetch VK2735 + SURMOUNT-1; strip Who Might and `~22%` leftover; align to cited weeks/arms only. |
| 4 | Agent I — SURVO-SEMA | `src/content/comparisons/survodutide-vs-semaglutide.mdx` | Fetch SYNCHRONIZE + STEP 1; strip `~18-19%` / `~15%` summary rows. |
| 5 | Agent I — CAGRI-SEMA | `src/content/comparisons/cagrilintide-vs-semaglutide.mdx` | Fetch PMID 34798060 range + STEP 1; strip `~6/~9/~11%` invented monotherapy table (do not invent 2.4 mg ~9%). |

*Optional later (still unlocked, lower priority):* `rusfertide` / `pf-08653944` / `ct-388` TR-only packs; `amycretin` E/D after topical match — only with Scout JSON ids fetched this increment.
