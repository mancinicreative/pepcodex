# CENSUS-REMAINING — Integrity Auditor I (Wave 1, read-only)

**Date:** 2026-09-02  
**Auditor:** packet I. Did not edit `src/content/**`. Did not start a Quality Judge. Did not stamp KEEP.  
**Recommendation: FREEZE leftover-compare MDX editors.** Do not keep stripping silent 5-amino / AOD stubs.  
**Companion:** `CENSUS-REMAINING.json`

GSC source of record: `.planning/data/v2/gsc-pepcodex-com-page.json` and `gsc-www-pepcodex-com-page.json` (manifest `pulledAt` **2026-09-02T22:04:55Z**, MEASUREMENT FRESH). Query export was **not** used. Apex window 2026-01-27→2026-08-31 (84 clicks). WWW window 2026-05-28→2026-08-31 (171 clicks). Do **not** add apex + www into one CTR.

Leftover = on-disk `Total Sources` census table / “N total sources (N human)” stub. SILENT = 0 page-export clicks on both properties.

## Judge pause (do not launder drafts)

- **TICK37 remains UNCLOSED.** `judge/L4-TICK37-iter1.md` is an on-disk Kimi draft that stamps KEEP for `cagrisema-vs-semaglutide.mdx`. Treat that line as a draft, not a closed loop.
- **TICK60+ remain UNCLOSED.** Implementer notes exist through TICK76. There is **no** `judge/L4-TICK60*` (or later) file. Implementer “cleaned” ≠ KEEP.
- No `LOOP-TASKS.md` KEEP ledger for these ticks.

## Inventory vs TICK45+ claims

`Select-String` on `src/content/comparisons/*.mdx` for `Total Sources`: **152 leftovers / 269 compares**.

### 5-amino-1mq-vs-* and aod-9604-vs-* (31 files)

TICK45+ claimed a cleanup of this family. On disk today:

| State | Count | Files |
|---|---|---|
| **Still leftover** (`Total Sources` present) | **14** | see ranked tables below |
| **No `Total Sources`** (claimed cleaned) | **17** | TICK45/47–48/58–70 plus earlier `aod-9604-vs-semaglutide` / `aod-9604-vs-mk-677` |

**Still leftover (14), all `lastUpdated` 2026-02-12:**

- 5-amino: orforglipron, pemvidutide, retatrutide, slu-pp-332, survodutide, vk2735
- AOD: liraglutide, maritide, mazdutide, pemvidutide, retatrutide, slu-pp-332, survodutide, vk2735

**TICK71–76 claimed these leftovers but did not strip them** (still census on disk; all SILENT except the two slu-pp-332 rows, which those ticks did **not** claim):

| Tick | Claimed file | On-disk leftover? | GSC page clicks |
|---|---|---|---|
| TICK71 | `aod-9604-vs-liraglutide.mdx` | yes | 0 / 0 (www 1 impr) |
| TICK72 | `5-amino-1mq-vs-orforglipron.mdx` | yes | 0 / 0 |
| TICK73 | `5-amino-1mq-vs-pemvidutide.mdx` | yes | 0 / 0 |
| TICK74 | `5-amino-1mq-vs-vk2735.mdx` | yes | 0 / 0 |
| TICK75 | `5-amino-1mq-vs-retatrutide.mdx` | yes | 0 / 0 |
| TICK76 | `5-amino-1mq-vs-survodutide.mdx` | yes | 0 / 0 |

Do not launch replacements for TICK71–76.

## Rank: leftover compares with live page clicks first

**152 leftovers → 19 have any page click → 133 SILENT.**  
Of the 14 remaining 5-amino/AOD leftovers: **2 have clicks, 12 are SILENT.**

Do not add apex+www. Rank key = max(apex clicks, www clicks), then the other host.

### Top 5 leftovers by page clicks (not NONE)

| Rank | `/compare/…` | Apex clicks / impr | WWW clicks / impr | lastUpdated |
|---|---|---|---|---|
| 1 | `cagrilintide-vs-survodutide` | **6** / 111 (incl. trailing-slash twin) | **10** / 224 | 2026-02-12 |
| 2 | `cardiogen-vs-vesugen` | **8** / 330 | 2 / 186 | 2026-02-12 |
| 3 | `na-semax-amidate-vs-selank` | 0 / 0 | **6** / 281 | 2026-02-12 |
| 4 | `ovagen-vs-svetinorm` | 3 / 54 | **4** / 289 | 2026-02-12 |
| 5 | `thymogen-vs-vilon` | 1 / 75 | **4** / 98 | 2026-02-12 |

These five still carry census `Total Sources` and sit at Feb lastmod while TICK45+ spent lastmod bumps on silent 5-amino/AOD stubs.

### Remaining leftover-with-clicks (6–19)

| `/compare/…` | Apex c/impr | WWW c/impr |
|---|---|---|
| `vilon-vs-vladonix` | 0 / 0 | 4 / 76 |
| `epithalon-vs-vesugen` | 1 / 45 | 3 / 50 |
| `5-amino-1mq-vs-slu-pp-332` | 0 / 0 | **3** / 269 |
| `aod-9604-vs-slu-pp-332` | **2** / 56 (trailing-slash URL) | 2 / 80 |
| `cagrisema-vs-orforglipron` | 2 / 27 | 0 / 38 |
| `sigumir-vs-tb-500` | 0 / 0 | 2 / 36 |
| `thymosin-alpha-1-vs-vilon` | 0 / 0 | 2 / 9 |
| `cerluten-vs-pinealon` | 0 / 0 | 2 / 6 |
| `maritide-vs-retatrutide` | 0 / 0 | 1 / 110 |
| `epithalon-vs-vilon` | 0 / 19 | 1 / 45 |
| `cagrilintide-vs-mazdutide` | 0 / 0 | 1 / 28 |
| `ct-388-vs-tirzepatide` | 0 / 0 | 1 / 15 |
| `prostatilen-vs-thymalin` | 0 / 10 | 1 / 12 |
| `livagen-vs-ovagen` | 0 / 0 | 1 / 4 |

If Conductor ever unfreezes leftover compares **after** TICK37 / TICK60+ close, this 19-row list is the only implementable slice. Not a brief. Not KEEP.

### Silent 5-amino / AOD leftovers — last; do not implement

| Slug | Apex | WWW | Label |
|---|---|---|---|
| `aod-9604-vs-mazdutide` | 0 / 3 impr | 0 / 0 | SILENT |
| `aod-9604-vs-liraglutide` | 0 / 0 | 0 / 1 impr | SILENT (TICK71 in flight) |
| `5-amino-1mq-vs-orforglipron` | 0 / 0 | 0 / 0 | SILENT (TICK72) |
| `5-amino-1mq-vs-pemvidutide` | 0 / 0 | 0 / 0 | SILENT (TICK73) |
| `5-amino-1mq-vs-retatrutide` | 0 / 0 | 0 / 0 | SILENT (TICK75) |
| `5-amino-1mq-vs-survodutide` | 0 / 0 | 0 / 0 | SILENT (TICK76) |
| `5-amino-1mq-vs-vk2735` | 0 / 0 | 0 / 0 | SILENT (TICK74) |
| `aod-9604-vs-maritide` | 0 / 0 | 0 / 0 | SILENT |
| `aod-9604-vs-pemvidutide` | 0 / 0 | 0 / 0 | SILENT |
| `aod-9604-vs-retatrutide` | 0 / 0 | 0 / 0 | SILENT |
| `aod-9604-vs-survodutide` | 0 / 0 | 0 / 0 | SILENT |
| `aod-9604-vs-vk2735` | 0 / 0 | 0 / 0 | SILENT |

Absence from the page export is not “no query demand.” It is **no measured page clicks**. That is enough to refuse more lastmod edits on these stubs.

### Claimed-cleaned family (17) — GSC, not KEEP

Only **one** cleaned family URL has page clicks: `5-amino-1mq-vs-aod-9604` (www **2** clicks / 133 impr, lastUpdated **2026-09-02**, TICK61 implementer note only). Fourteen of the 17 cleaned files already carry `lastUpdated: 2026-09-02`. The rest of that cleaned set is SILENT or impression-only (e.g. `aod-9604-vs-semaglutide` 0 clicks / 35+164 impr; `5-amino-1mq-vs-cagrisema` 0 / 44 www).

## Crawl implication of lastmod-bumping silent leftovers

CRAWL-GOAL increment 1 kept sitemap `lastmod` from frontmatter as the recrawl-priority signal (0 → 1,128 dated URLs). On a ~6-month DR-3.3 domain whose binding constraint is crawl allocation — 923/1,221 pages never impressed — bumping `lastUpdated` on a silent leftover compare is not hygiene. It queues Google to refetch a URL that the page export already shows as 0-click, and it competes with URLs that do click (`cagrilintide-vs-survodutide`, `cardiogen-vs-vesugen`) whose census stubs still sit at 2026-02-12. TICK45+ already moved 14 mostly silent 5-amino/AOD files to 2026-09-02. Repeating that on the remaining 12 silent family stubs would spend another recrawl wave on pages MEASUREMENT does not show as earning clicks, while 133 other census leftovers stay silent and 19 click-earning leftovers stay unranked by the editor queue. lastmod is a recrawl request. Do not fire it at SILENT leftovers.

## Recommendation

**FREEZE.** Council freeze on leftover-compare MDX stands. TICK37 and TICK60+ are UNCLOSED. Do not dispatch leftover editors. Do not implement the 12 silent 5-amino/AOD stubs. Do not treat TICK71–76 drafts as occupancy that needs a successor file. If a later unlocked pass is allowed, start from the 19 leftover-with-clicks rows above — never from the silent family tail.

## Commands actually run

```
git branch --show-current
Get-ChildItem src\content\comparisons -Filter "5-amino-1mq-vs-*.mdx"
Get-ChildItem src\content\comparisons -Filter "aod-9604-vs-*.mdx"
Select-String -Path src\content\comparisons\5-amino-1mq-vs-*.mdx -Pattern "Total Sources"
Select-String -Path src\content\comparisons\aod-9604-vs-*.mdx -Pattern "Total Sources"
Select-String -Path src\content\comparisons\*.mdx -Pattern "Total Sources"
node .planning\seo-engine\runs\2026-09-01\_census-join.mjs
node -e (print family leftover / cleaned GSC from CENSUS-REMAINING.json)
```

Join script deleted after writing this artifact. No `astro build`. No GSC/GA4 re-pull. Branch: `feat/scoring-and-freshness`.
