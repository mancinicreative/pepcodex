# VERIFICATION — 2026-09-02 (cited-only increment)

Partial W3-V1 after Lucas’s cited-only rule. Not a full identifier re-fetch of every E1/TR1 id.

## Commands

| Command | Result |
|---|---|
| `cmd /v:on /c "npm run build & echo REAL_BUILD_EXIT=!ERRORLEVEL!"` | **REAL_BUILD_EXIT=0** (prebuild then failed twice: comparison Cerluten 4 vs 3; OneDrive lock on identity-findings.json; qa:advice `should-directive` on fda-tightens compounding disclaimer — all fixed without inventing sources) |
| `npm run graph:check` | **GRAPH_EXIT=0** — broken 0; pages in build **1209**; deep ≥4 = 0 |
| Built HTML checks | Homepage `Featured briefings` + `/blog/semax-neuroprotection-stroke` present. `63%` absent from both OSA posts. `25.3` / `50.7` present. `$1,000` absent from Zepbound OSA post. |

## Identifiers re-fetched this increment

See `judge/L4-CITED.md`. PMIDs 38912654 (plus PMC11598664 table), 39413392, 31611038, 41237796, 40550231, 11517472, 29798983. FDA Zepbound OSA press 2026-09-02.

## Net URLs

No new content slugs. Homepage inbound to four existing `/blog/` URLs. Pagefind indexed 1208 pages (same ballpark as GRAPH-BASELINE 1209 HTML).

## Tick 2 follow-up (2026-09-02 ~07:41 ET)

| Command | Result |
|---|---|
| `npm run qa:claims` | Exit 0. 15 named trials; 3 near-miss families (STEP-1 14.9 vs 15 rounding; REDEFINE-2 multiple estimands on one NDA post; REDEFINE-4 23 vs 25.5). Not treated as a fail. |
| `npm run qa-retractions` | **PASS** — no cited PMID/DOI in Retraction Watch retracted set. |

Cited-only extras this tick: stripped TRIUMPH **28.7%** from `best-peptide-for-weight-loss-2026.mdx`; SCALE now **PMID 26132939** (kg −8.4 vs −2.8, n=3731) not the unverifiable 25673378 / 8.0% headline; oveporexton `scoring.notes` no longer say “no approval yet.”

## Not done

Gate 0 GSC/GA4 still blocked on Lucas OAuth. Named-trial near-miss families on other pages (REDEFINE-2/4) were logged by `qa:claims`, not treated as this increment’s fail.
