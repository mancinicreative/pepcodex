# Contrarian — leftover-compare factory freeze

**Seat:** Contrarian (Grok council orchestrator; not Conductor, not Judge)  
**Date:** 2026-09-02  
**Branch:** `feat/scoring-and-freshness`  
**Decision under attack:** keep spawning leftover editors until the invented-census FAQ pile is gone.

This seat does **not** implement MDX. Does **not** start a Quality Judge. Does **not** stamp KEEP. Does **not** add URLs. Does **not** treat a leftover-count of ~16 as a loop-close KPI.

---

## Verdict (lean all the way)

**Highest-leverage freeze: stop leftover-compare dispatch and park the leftover Judge queue.** Drain whatever is already mid-write. Do not refill the slots.

The default plan mistakes a factory KPI ("census leftovers remaining") for the engine's job. The engine exists to spend a young domain's tiny crawl allocation on pages that can earn a fetch, then a click, then an app handoff (`ORCHESTRATOR.md` §0, §7). Stripping `Total Sources` from `5-amino-1mq-vs-slu-pp-332` and `aod-9604-vs-vk2735` does not do that. It burns editor slots, NCBI quota, lastmod recrawl signals, and Judge attention on generated matrix filler Google has already chosen not to fetch.

Census-zero is a completionist trap. Kill it for 90 minutes.

---

## What I am attacking

LOOP-TICK-19 (2026-09-02 ~17:55 ET) already named the default temptation: editor cap full (TICK67–69), Judge TICK37 in flight, TICK60–66 awaiting Judge, ~16 unlocked leftovers, OAuth dead, TICK6-PRICE blocked, **no dispatch**. That was the correct Conductor call.

The factory ignored it in real time:

| Signal | Evidence |
|---|---|
| Cap = 3 editors | `ORCHESTRATOR.md` §1.8; LOOP-TICK-19 "Do not launch TICK70" |
| TICK70 launched anyway | `TICK70.md` claims `aod-9604-vs-tirzepatide.mdx` |
| TICK71 launched anyway | `TICK71.md` claims `aod-9604-vs-liraglutide.mdx` |
| Judge backlog already 7+ | TICK60–66 "implementer done; awaiting Judge" |
| TICK37 not Conductor-KEEP | LOOP-TICK-19: Judge in flight. This seat will not Grok-self-judge it. A later Kimi file on disk claiming KEEP is not this seat's stamp. |
| Binding constraint | Crawl budget. Silent pages **923 / 1,221**. OAuth `invalid_rapt` still blocks a live pull. |

Each leftover tick is the same machine: pick next unlocked `5-amino-1mq-vs-*` or `aod-9604-vs-*`, burn 2–5 NCBI/CT.gov/openFDA fetches, strip an invented census FAQ, write "Judge not started. Remaining leftovers: the rest." That last line is how a factory reproduces. TICK60's own closer still says "one file per tick" as if infinity is the plan.

---

## Where this engine is wasting crawl and attention

### 1. Recrawl of junk (crawl)

`CRAWL-GOAL.md` increment 1 made sitemap `lastmod` a recrawl-priority signal (0 → 1,128 dated URLs). That was KEEP because it told Google *which* pages changed. Touching leftover compares is the cheap way to date-stamp the long tail. The 5-amino and AOD-vs-GLP-1 matrix is generated pair filler, lastUpdated 2026-02-12 on the stubs LOOP-TICK-19 still lists. These are the pages most likely sitting inside the 923-silent / "Discovered – not indexed" pile.

Cleaning a FAQ does **not** drop the URL from the sitemap. `noindex` does **not** save crawl (`ORCHESTRATOR.md` §1.2). Google still has to fetch to learn anything. So leftover edits either:

- bump `lastUpdated` → ask Google to recrawl silent junk, or
- leave lastmod stale → still occupy sitemap slots that dossiers, calculators, and `/trials` should win.

Neither path spends crawl on something that can rank. The graph loop already met reachability (`broken 0`, max depth 3). The leftover factory is not L2 work. It is L4 theater on pages L2 already made *reachable* — which is how you waste a young-domain crawl budget: make junk easy to find, then keep painting it.

`CRAWL-GOAL.md` still-open is explicit: **10 reversed-order duplicate comparison pages cannibalising each other.** That is actual crawl waste. The leftover factory does not touch it. It adds more same-shape `/compare/` URLs competing with the pairs that historically click (under-covered pairs, not 5-Amino-1MQ vs every incretin).

L6 already forbade the volume play: do not build media-saturated GLP-1-vs-GLP-1 pages (`LOOPS.md` L6). `aod-9604-vs-tirzepatide` / `aod-9604-vs-semaglutide` / `5-amino-1mq-vs-tirzepatide` is that play with a research-chem left side. Finishing the matrix is how you lose the under-covered-pair rule without publishing a "new" URL.

### 2. Judge and editor attention (the real 90-minute cost)

ORCHESTRATOR §3: never stack an unevaluated change on another. The leftover factory is the stack:

- TICK60–66: written, **unevaluated**
- TICK67–69: in flight at LOOP-TICK-19
- TICK70–71: launched after "do not launch TICK70"
- TICK37: the one demand-shaped compare still not Conductor-KEEP

Other-models Judge cap is full. Conductor will not Grok-self-judge. Therefore every new leftover editor is a file that **cannot be scored this session**. That is not integrity. That is inventory.

L4 severity order (`LOOPS.md` L4 Strategist): live 404s and wrong-drug links first, then estimands, then absences. Invented `Total Sources` / "11 vs 76 human studies" on a silent 5-amino stub is the last class. TICK19–TICK36 already KEEP'd the compares that carry real trial numbers (orforglipron, pemvidutide, CagriSema, tirzepatide-vs-semaglutide). The leftover remainder is census decoration. Spending Judge slots on it while TICK37 is unresolved is severity inversion.

L5 API budget: NCBI ~3/s anon; openFDA 1k/day. TICK60 alone fetched three PubMed scripts plus CT.gov plus openFDA for a pair with **zero** human 5-Amino-1MQ obesity RCT and **zero** head-to-head. Multiply by 16 leftovers. That quota should sit on freshness High items or on verifying TICK37-class pages — not on proving again that AOD-9604 has no human percent.

### 3. The missing funnel (attention vs the actual job)

`ORCHESTRATOR.md` §0: ~31.7k impressions → 81 clicks; **app CTAs on site historically 0**. L7 is zero crawl-budget cost. STATE still has Gate 0 / W3-M1 OAuth blocked. TICK6-PRICE is propose-first, waiting on Lucas.

The leftover factory is what the engine does when the blocked things are blocked and the easy remaining worklist is "one more stub." That is how you look busy until the 90 minutes are gone and Lucas still cannot trust GA4, still has no fresh GSC, and still has no CTA grep in `dist/`.

---

## Highest-leverage freeze (what "stop" means)

**Freeze leftover-compare Implementers.** No TICK72+. Treat TICK70/TICK71 as over-cap violations to drain or abandon, not as license to continue the `aod-9604-vs-*` list.

**Park leftover Judges.** Do not dispatch a Quality Judge for TICK60–66 or any remaining 5-amino/AOD stub. Unevaluated leftover MDX is cheaper than a wrong KEEP on a junk URL, and this session cannot Judge them anyway.

**Do not Grok-self-judge TICK37.** LOOP-TICK-19 said in flight / not KEEP. Conductor rule stands. A Kimi `judge/L4-TICK37-iter1.md` on disk is not this seat, not Conductor, and not a stamp I will echo.

**Kill the census-remaining KPI.** LOOP-TICK-19's leftover list is a *risk register* (invented source counts still live), not a sprint backlog. Integrity on silent pages can wait for a sitemap-drop decision after a real GSC pull — which is blocked on Lucas, not on another editor.

**Do not add URLs.** Net URL ≤ 0 (`ORCHESTRATOR.md` §1.1). Coverage Writer is out.

If someone needs a "still working" motion that is not the factory: **Gate 0 if Lucas is at the keyboard** (the only move that unblocks measurement of *which* leftover compares are silent, so you can drop them from the sitemap — the actual crawl save). If he is not: write nothing in `src/content/**`. Sit on the freeze.

---

## Kill for 90 minutes (ranked)

1. **Leftover editor dispatch** — the thing that already broke the cap. Highest ROI kill.
2. **Leftover Judge queue** — TICK60–66 do not get a Judge while TICK37 is uncapped / not Conductor-KEEP and other-models Judge is full.
3. **"Census leftovers remaining" as Conductor success** — replace with: in-flight drained, no new files, no KEEP from this seat.
4. **NCBI fan-out on 5-amino / AOD matrix** — quota is not free (`LOOPS.md` L5).
5. **Any new-URL or "finish the compare graph" impulse** — L6 and CRAWL-GOAL both say the compare graph is already the cannibal / silent problem, not the growth lever.

What those 90 minutes are *for* if Lucas is present: OAuth (`GOOGLE-API-SETUP.md` Steps 9–11). Fresh page-export tells you which leftover compares have zero impressions so the next integrity move is sitemap exclude, not another FAQ rewrite. If Lucas is absent: the freeze *is* the work. Do not invent a fourth leftover wave to fill the silence.

---

## Three things I refuse to dispatch

1. **A leftover-compare editor (TICK72+ / any unlocked `5-amino-1mq-vs-*` or `aod-9604-vs-*`).** LOOP-TICK-19 already forbade TICK70. TICK70 and TICK71 exist anyway. I will not feed that.
2. **A Quality Judge** — leftover queue or TICK37. Other-models cap. Conductor will not Grok-self-judge. This seat does not start a Judge and does not stamp KEEP.
3. **A Coverage Writer / new URL / "close L4 by finishing the census."** Net-URL ledger stays ≤ 0. Census-zero is not an L4 close (`LOOPS.md` L4 success is false links + false facts on pages that matter, severity-ordered — not "every generated stub polished").

Also refused (same motion, not a fourth dispatch): TICK6-PRICE, Vercel Firewall apply, merge/push to `main`, any `src/content/**` edit from this seat.

---

## Gaming check

"Leftovers remaining → 0" can be gamed by rewriting silent pages until a grep for `Total Sources` goes quiet. That metric can hit zero while silent-page share, app CTAs, and GSC clicks do not move. CRAWL-GOAL's own gaming check: if the number improves without the site improving, revert. The leftover factory is that game, played with integrity vocabulary.

I do not claim the invented census FAQs are harmless. They are lies. They are also the *cheapest remaining lies*, on the *least crawled URLs*, at the *worst moment* (Judge cap, OAuth dead, editor cap already blown). Integrity that cannot be judged this session is inventory. Inventory that lastmod-pings Google is crawl vandalism.

---

## Files actually read (this seat)

- `C:\Users\manci\.claude\skills\llm-council\SKILL.md`
- `.planning/seo-engine/ORCHESTRATOR.md` (§0 facts, §1 hard constraints, §3 no-stack, §7 close bar)
- `.planning/seo-engine/LOOPS.md` (L0 blocked-on-Lucas; L4 severity; L5 API budget; L6 no GLP-1 volume play; L7 zero-URL funnel)
- `.planning/seo-engine/runs/2026-09-01/LOOP-TICK-19.md`
- `.planning/seo-engine/runs/2026-09-01/LOOP-TASKS.md` (tick 19 row)
- `.planning/seo-engine/runs/2026-09-01/TICK60.md` (pattern: fetch-or-strip, "one file per tick")
- `.planning/seo-engine/runs/2026-09-01/TICK67.md`
- `.planning/seo-engine/runs/2026-09-01/TICK68.md`
- `.planning/seo-engine/runs/2026-09-01/TICK69.md` (in progress)
- `.planning/seo-engine/runs/2026-09-01/TICK70.md` (in progress; launched after do-not-launch)
- `.planning/seo-engine/runs/2026-09-01/TICK71.md` (in progress; same)
- `.planning/seo-engine/runs/2026-09-01/judge/L4-TICK37-iter1.md` (Kimi KEEP claim on disk — **not accepted, not stamped**)
- `.planning/CRAWL-GOAL.md` (silent 923/1221; lastmod increment 1; scoreboard; 10 reversed-order duplicates still open)
- `.planning/STATE.md` (Wave 2; OAuth blocked; KEEP chain through TICK36; net URL 0)

TICK61–66 notes were not fully read; LOOP-TICK-19's table is the claim list this seat used. `src/content/**` was not opened.

---

## What this seat will not say

- KEEP.
- "Finish the 16, then we can measure."
- "Launch one more leftover editor because the cap might free up."
- "Grok can Judge TICK37 so the queue moves."

**Freeze. Drain. Do not refill.**
