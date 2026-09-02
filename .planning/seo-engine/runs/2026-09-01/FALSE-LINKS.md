# FALSE-LINKS.md — Link Guardian (agent L), Wave 1

**Date:** 2026-09-01
**Branch:** `feat/scoring-and-freshness` (not rebuilt, not `graph:check`'d)
**Loops:** L4 integrity + L2 crawl (read-only). Constitution: `ORCHESTRATOR.md` §1, `LOOPS.md` L2/L4, `AGENTS.md` §L.
**This file does not pass L2.** `npm run graph:check` is the source of truth for broken/orphan/depth. Crawl Engineer owns that. This report is a **source-level** classification of known false-link classes so Wave 2 can patch templates/content before a sole-occupant rebuild.

---

## Method and limits

Commands actually run:

```
npm run validate-links          # alias → node scripts/validate-cross-links.mjs ; exit 0
node scripts/validate-cross-links.mjs --verbose
node .planning/seo-engine/runs/2026-09-01/_scan-false-links.mjs
node .planning/seo-engine/runs/2026-09-01/_scan-false-links-2.mjs
```

Not run (per brief): `astro build`, `npm run graph:check`.

**`dist/` last built 2026-08-17** (`LastWriteTime` 2026-08-17T11:17:58-04:00). The folder currently holds only `client/` and `pagefind/` — **no `index.html`**. A graph run against this tree would be blind. Last closed graph scoreboard (source: `.planning/CRAWL-GOAL.md`, after increment 16): broken internal links **0**, dead targets **0**, max depth 3. That is **historical**, not this run.

`validate-cross-links` checks **frontmatter slug fields against collection filenames**. It does not see MDX body `<a href>`, JSON-LD, `llms.txt`, or name-derived `currentSlug`. Guarded templates convert missing related-* slugs to plain text, so 244 validator warnings are **not live 404s**.

GSC-listed 404s: **not pulled**. L0 is blocked on Lucas OAuth. Historical clinic `.mdx` URLs still have 301s in `vercel.json` (see class B).

---

## Class scoreboard

| Class | Still present as live href 404? | Residual? | Severity | Wave 2 owner |
|---|---|---|---|---|
| A. Broken internal targets | **No structural 404s found in source hrefs** | Unguarded layouts can regress; `currentSlug` misses compare lookups | HIGH residual (template) | Template Set-guard + slugProp |
| B. `.mdx` URLs | **Not emitted** | 5 clinic 301s remain; `city.id.replace` still required | MED (hygiene) | Keep strip; prefer `.slug` |
| C. Trailing-slash hops | **Yes — HTML + feeds** | 2 MDX hrefs, 1 dossier HTML, JSON-LD, `llms*.txt` | HIGH (HTML) / MED (feeds) | Strip `/` on internal hrefs |
| D. Unguarded related-* slugs | **Guarded in blog/glossary/interactions** | Safety / protocol / guide / calculator still unguarded; 244 invalid frontmatter values remain | MED residual / LOW content | Template Set-guard; do **not** invent slugs |
| E. Compare-order duplicates | **Not live as dual pages** | 9 vercel 301s; `llms.txt.ts` still cites 4 old-order URLs | MED (feed) | Point `llms.txt` at surviving slugs |
| F. `/guides/` vs `/guide/` | **Not in templates or MDX bodies** | vercel 301 `/guides` → `/guide` (keep) | — | No template work |
| G. `currentSlug` from display name | **Yes in DossierLayout** | 6 dossiers diverge (5 original + amycretin) | HIGH (wrong lookups) | Use `slugProp` / `dossierSlug` only |

---

## A. Broken internal targets

**Still present as live 404s in source?** No — with the caveats below.

Evidence:

- `validate-cross-links`: **0 errors / 3758 refs**. Structural fields (`comparisons.peptideA/B`, `safety.peptides`, `protocols.peptides`, `conditions.relatedConditions`) all resolve.
- Body markdown/`href` scan of `src/content/**/*.mdx`: **0** links to missing peptide / glossary / compare / safety / guide / blog / protocol slugs.
- Compare/guide/safety/protocol peptide fields: 0 missing slugs.

**What still can 404 if content drifts** (unguarded HTML `href`, currently all targets exist):

| File | Line | Emits |
|---|---|---|
| `src/layouts/SafetyLayout.astro` | 159 | `/peptides/${peptide}` from `safety.peptides[]` — **no Set** |
| `src/layouts/ProtocolLayout.astro` | 209 | `/peptides/${peptide}` from `protocols.peptides[]` — **no Set** |
| `src/layouts/GuideLayout.astro` | 97, 178 | `/peptides/${peptide}` from guide `peptide` — **no Set**; field is **not** in `validate-cross-links` |
| `src/layouts/CalculatorLayout.astro` | 100 | `/peptides/${peptideSlug}` — **no Set** (4 calculators; slugs currently real) |
| `src/layouts/GuideLayout.astro` | 186 | hardcoded `/safety/glp1-safety-overview` — **file exists** |

GuideLayout 186 is a real route (`src/content/safety/glp1-safety-overview.mdx`). Leave it; do not invent a second safety slug.

**Wave 2 fix (template):** copy the BlogLayout / InteractionMatrix pattern — `const peptideSlugs = new Set((await getCollection('peptides')).map(p => p.slug))`; miss → `<span>`, never `<a>`. Add `guides.peptide` to `validate-cross-links` as warning. **Do not invent** peptide/glossary slugs to make a link work.

**Severity:** MED residual (regression class). Not a live 404 today.

---

## B. `.mdx` URLs (`city.id` / `p.id` retaining extension)

**Still present as emitted hrefs?** No. Historical class is patched in the templates that used to produce it. Google-indexed `.mdx` URLs are handled by 301s.

Evidence the **strip is live** (mirrors `getStaticPaths`):

```11:16:src/pages/clinics/[city].astro
export async function getStaticPaths() {
  const cities = await getCollection('cities');
  return cities.map((city) => ({
    params: { city: city.id.replace(/\.mdx?$/, '') },
    props: { city }
```

```114:114:src/pages/clinics/index.astro
          href={`/clinics/${city.id.replace(/\.mdx?$/, '')}`}
```

```84:84:src/pages/protocols/index.astro
            href={`/protocols/${protocol.id.replace(/\.mdx?$/, '')}`}
```

```172:172:src/pages/regulatory-tracker.astro
                    <a href={`/peptides/${p.slug}`} class="font-medium hover:text-[var(--primary)] transition-colors" style="color: var(--ink);">
```

`ClinicCard` / `FeaturedClinicCard` receive `slug={clinic.id}` (`[city].astro` 151, 181) but **do not render an href from it** — dead prop, not a `.mdx` URL.

`vercel.json` still 301s five raw clinic URLs Google actually indexed:

- `/clinics/honolulu.mdx` → `/clinics/honolulu`
- `/clinics/st-louis.mdx`, `/scottsdale.mdx`, `/irvine.mdx`, `/pittsburgh.mdx`

**Wave 2:** keep the `.replace(/\.mdx?$/, '')` until collections are guaranteed extensionless; prefer `entry.slug` where Astro provides it (regulatory tracker already does). Do not delete the 301s (GSC may still list the old URLs). Optional: stop passing `clinic.id` as `slug` so the prop cannot be wired into an href later.

**Severity:** MED hygiene. Not a current emit. Confirm against GSC after L0.

---

## C. Trailing-slash hops (`trailingSlash: 'never'` → 308)

**Still present?** Yes.

### C1. HTML hrefs Googlebot will fetch (HIGH)

| File | Line | URL | Notes |
|---|---|---|---|
| `src/layouts/DossierLayout.astro` | 487 | `/regulatory-tracker/` | Every dossier with `regulatoryStatus` |
| `src/content/peptides/cardiogen.mdx` | 329 | `/peptides/cartalax/` | Target **exists**; extra 308 |
| `src/content/peptides/kristagen.mdx` | 388 | `/peptides/chonluten/` | Target **exists**; extra 308 |

Nav/footer HTML (`BaseLayout.astro` 121–370) is slash-free (`/peptides`, `/guide`, `/regulatory-tracker`). TrackerSwitcher is slash-free.

**Wave 2:** template strip on line 487; content strip on the two MDX hrefs. Same path without the slash.

### C2. JSON-LD / ItemList (MED — not in the HTML graph, still 308 if followed)

BreadcrumbSchema writes `item` URLs verbatim. Collection hubs are passed **with** a trailing slash, e.g.:

| File | Line |
|---|---|
| `BlogLayout.astro` | 106 `` `${siteBase}blog/` `` |
| `DossierLayout.astro` | 363 `` `…peptides/` `` |
| `GlossaryLayout.astro` | 67 `` `…glossary/` `` |
| `ComparisonLayout.astro` | 68 `` `…compare/` `` |
| `GuideLayout.astro` | 61 `` `…guide/` `` |
| `ProtocolLayout.astro` | 41 `` `…protocols/` `` |
| `SafetyLayout.astro` | 43 `` `…safety/` `` |
| `ConditionLayout.astro` | 88 `` `…conditions/` `` |
| `CalculatorLayout.astro` | 32 `` `…calculator/` `` |
| `peptides/[peptide]/[condition].astro` | 84–85 peptide URL with `/` |
| `glossary/index.astro` | 56 ItemList every term as `glossary/${term.slug}/` (215 URLs) |
| `regulatory-tracker.astro` | 72 `https://www.pepcodex.com/regulatory-tracker/` |
| `trials/index.astro` | 125 `https://www.pepcodex.com/trials/` |

Glossary **HTML** cards use `/glossary/${term.slug}` (no slash) at `glossary/index.astro:121`. The slash is schema-only there.

**Wave 2:** drop the trailing `/` on internal JSON-LD items. Do **not** change Astro `trailingSlash`.

### C3. `llms.txt` / `llms-full.txt` (MED — public feeds, every URL slashed)

`src/pages/llms-full.txt.ts` 29–79: every peptide/compare/glossary/guide/safety/protocol/blog URL ends in `/`. Uses `p.id.replace(/\.mdx?$/, '')` (extension-safe) then adds the slash back.

`src/pages/llms.txt.ts` is hardcoded (stale counts: "92 peptide dossiers, 279 comparisons" vs live 107 / 269) and **every URL has a trailing slash**, including `/methodology/`, `/trials/`, `/peptides/{slug}/`.

**Wave 2:** generate from collections; `p.slug` not `p.id`; no trailing slash. Authority Scout already owns stale `llms.txt` counts — coordinate so one editor touches the file.

---

## D. Unguarded related-* slugs

**Lesson:** `relatedPeptides` / `relatedGlossary` / interaction targets have no referential integrity; linking them blind produced ~330 live 404s.

### D1. Guards that shipped (class NOT live 404)

| Surface | Guard | Evidence |
|---|---|---|
| Blog related peptides/glossary | Set of collection slugs; miss → text | `BlogLayout.astro` 110–116, 262–269, 287 |
| Glossary related peptides/terms | `.find` + `.filter(Boolean)` | `GlossaryLayout.astro` 73–83, 159–160, 188–189 |
| Interaction matrix | `interactionPeptideSlugs` Set | `InteractionMatrix.astro` 10–13, 143–146 |
| RelatedEntities | lookup by real `p.slug` | `RelatedEntities.astro` 38–43 |
| Clinic "common peptides" | derive-then-`peptideSlugSet.has` | `[city].astro` 306–327 |
| Condition related peptides | filter `allPeptides` by `p.slug` | `[peptide]/[condition].astro` 69–74 |
| Condition hub related | `allConditionHubs` collection, not free text | `ConditionLayout.astro` 301–310 |

`validate-cross-links` still reports **244 warnings** (content quality). Those values **do not become hrefs** on guarded surfaces:

| Field | Count | Unique missing | Typical |
|---|---|---|---|
| `blog.relatedPeptides` | 3 | defensins, insulin, cgrp-antagonists | not in peptides collection |
| `blog.relatedGlossary` | 48 | 40 terms (amylin, mash, nootropic, …) | display strings |
| `glossary.relatedPeptides` | 105 | 24 (insulin, growth-hormone, igf-1, oxytocin, …) | approved drugs, not dossiers |
| `glossary.relatedTerms` | 24 | 17 | display strings |
| `peptides.interactions[].peptide` | 64 | 51 (pembrolizumab, metformin, hgh, …) | comparator drugs |

Plus **157 info** (comparators / guide `relatedTerms`) by design.

**Wave 2 content:** do **not** invent glossary or peptide slugs. Optional remaps only when a **real** collection slug is the same compound (e.g. blog `defensins` → `alpha-defensins` if editorial agrees). Otherwise leave frontmatter; the template already renders text.

### D2. Still unguarded (regression)

SafetyLayout, ProtocolLayout, GuideLayout, CalculatorLayout — see class A. **Wave 2 = template Set-guard.** Currently 0 missing values, so this is prevent-next-404, not fix-live-404.

### D3. Name-derived related lookup (DossierLayout)

```993:997:src/layouts/DossierLayout.astro
    <RelatedEntities
      currentPeptide={name.toLowerCase().replace(/\s+/g, '-')}
      category={category}
      relatedPeptides={comparators.map(c => c.toLowerCase().replace(/\s+/g, '-'))}
    />
```

RelatedEntities itself is guarded, so this does **not** 404. It **fails to match** the current dossier for the six name≠slug peptides, so those pages skip their own comparison/guide cards in this block. "Compared With" (`relatedComparisons`, uses `dossierSlug`) still links the real `/compare/` pages.

**Wave 2:** `currentPeptide={slugProp ?? dossierSlug}`. Comparators should stay as stored slugs (already mostly slugs); the `.toLowerCase().replace(/\s+/g, '-')` on `LH` / `GnRH agonists` is harmless because the lookup misses and drops them.

**Severity:** D1 LOW (content). D2 MED. D3 HIGH for the six dossiers' RelatedEntities block (missed crawl path in that section only).

---

## E. Compare-order duplicates

**Still live as two pages?** **No.** Scan of `src/content/comparisons/` (269 files): **0** A-vs-B + B-vs-A file pairs.

STATE.md (2026-08-17 D5 merge): main's duplicate consolidation accepted — 9 comparisons deleted, 301s in `vercel.json` 218–265:

| Deleted (301 source) | Survivor |
|---|---|
| `/compare/ipamorelin-vs-cjc-1295` | `cjc-1295-vs-ipamorelin` |
| `/compare/cjc-1295-vs-mk-677` | `mk-677-vs-cjc-1295` |
| `/compare/semaglutide-vs-liraglutide` | `liraglutide-vs-semaglutide` |
| `/compare/tirzepatide-vs-liraglutide` | `liraglutide-vs-tirzepatide` |
| `/compare/sermorelin-vs-mk-677` | `mk-677-vs-sermorelin` |
| `/compare/ss-31-vs-mots-c` | `mots-c-vs-ss-31` |
| `/compare/retatrutide-vs-tirzepatide` | `tirzepatide-vs-retatrutide` |
| `/compare/semaglutide-vs-tirzepatide` | `tirzepatide-vs-semaglutide` |
| `/compare/sermorelin-vs-tesamorelin` | `tesamorelin-vs-sermorelin` |
| `/compare/thymalin-vs-thymosin-alpha-1` | `thymosin-alpha-1-vs-thymalin` |

HTML templates link `comparison.slug` from the collection (`compare/[...slug].astro` 8, `compare/index.astro` 56). No template still emits the deleted order.

**Still citing old order:** `src/pages/llms.txt.ts` 133–140 (four of the deleted slugs, each also trailing-slashed). Those 301. `.planning/CRAWL-GOAL.md` "Still open" bullet ("10 reversed-order duplicate comparison pages") is **stale** — the files are gone.

**Wave 2:** rewrite those four `llms.txt` lines to the survivor slugs (or generate the list). Keep the vercel 301s. Do not recreate the deleted MDX.

**Severity:** MED for the AI feed; not a dual-index HTML problem.

`findComparisonSlug` in DossierLayout still builds `${currentSlug}-vs-${comp}` (name-derived). For amycretin (`currentSlug` = `zenagamtide-(amycretin)`) that matches **none** of 16 real compare pages. Cards in `#compare` render `null`; **Compared With** still lists them via `dossierSlug`. Wave 2: use `dossierSlug` inside `findComparisonSlug` (or delete `#compare` as duplicate of Compared With). **Severity HIGH** for empty `#compare` on amycretin/hcg/na-* ; not a 404.

---

## F. `/guides/` vs `/guide/`

**Still present in templates or MDX bodies?** No (`tpl.guides` count 0, `body.guides` count 0).

Live route is `/guide/` (`src/pages/guide/[...slug].astro`, `RelatedEntities.astro` 134, `guide/index.astro` 58, BaseLayout footer 363). `vercel.json` 143–150 keeps `/guides` → `/guide` (correct; do not remove).

---

## G. `currentSlug` from display name (lesson: hcg, melanotan-i, mrna-4157, na-selank-amidate, na-semax-amidate)

**Still present?** Yes. Sixth divergence since the lesson: **amycretin** renamed in display to `Zenagamtide (amycretin)`.

| Collection slug | `data.name` | `name.toLowerCase().replace(/\s+/g,'-')` |
|---|---|---|
| `hcg` | Human Chorionic Gonadotropin (hCG) | `human-chorionic-gonadotropin-(hcg)` |
| `melanotan-i` | Melanotan-1 | `melanotan-1` |
| `mrna-4157` | mRNA-4157/V940 | `mrna-4157/v940` (slash in path if ever used) |
| `na-selank-amidate` | N-Acetyl Selank Amidate | `n-acetyl-selank-amidate` |
| `na-semax-amidate` | N-Acetyl Semax Amidate | `n-acetyl-semax-amidate` |
| `amycretin` | Zenagamtide (amycretin) | `zenagamtide-(amycretin)` |

`[slug].astro` **does** pass `slug={peptide.slug}` (line 29). Condition sub-pages use `slugProp ?? currentSlug` (`DossierLayout.astro` 973) — **OK while slugProp is passed**. Fallback is a landmine (`mrna-4157/v940` would 404).

Still using name-derived `currentSlug`:

| Line | Use | Effect |
|---|---|---|
| 323 | definition | root of the class |
| 327–328 | `findComparisonSlug` | misses real compare slugs (16 for amycretin, 2 for hcg, 3 each for na-*) |
| 379 | catalogue entry number | wrong number; not a URL |
| 886 | exclude self from related cards | may include **self** (PeptideCard still uses `p.slug` — valid self-link, not 404) |
| 993–996 | RelatedEntities | see D3 |

`relatedComparisons` / `safetyPage` / source-pack path correctly use `dossierSlug` (245, 342–347). That is why increment 5 in CRAWL-GOAL closed the condition-page 404s.

**Wave 2 (template):** delete `currentSlug` or set `const currentSlug = slugProp ?? dossierSlug`. Never derive from `name`. **Severity HIGH.**

---

## Other lesson checks

### `protocol.data.slug` undefined → `/protocols/undefined`

**Fixed.** Only remaining mention is the comment at `protocols/index.astro` 81–84. `getStaticPaths` uses `protocol.id.replace(/\.mdx?$/, '')` (`protocols/[slug].astro` 8).

### Content fields that store slugs (inventory)

| Collection / field | Validated by `validate-cross-links`? | Render guard? |
|---|---|---|
| comparisons `peptideA`/`peptideB` | error | ComparisonLayout uses collection slug |
| safety `peptides[]` | error | SafetyLayout **unguarded** |
| protocols `peptides[]` | error | ProtocolLayout **unguarded** |
| conditions `relatedConditions[]` | error | ConditionLayout uses collection, not the field |
| blog `relatedPeptides` / `relatedGlossary` | warning | BlogLayout Set |
| glossary `relatedPeptides` / `relatedTerms` | warning | GlossaryLayout lookup |
| peptides `interactions[].peptide` | warning | InteractionMatrix Set |
| peptides `comparators[]` | info | findComparisonSlug + RelatedEntities lookup |
| peptides `conditions[].slug` / `relatedPeptides` | not as cross-link | getStaticPaths + filter by `p.slug` |
| guides `peptide` | **not validated** | GuideLayout **unguarded** |
| guides `relatedTerms` | info | not linked as glossary href in GuideLayout |
| calculators `peptideSlug` | not in this script | CalculatorLayout **unguarded** |

---

## Wave 2 ordered worklist (Link Guardian)

One increment per class, then Crawl Engineer `graph:check` (sole occupant rebuild first — `dist/` is unusable).

1. **G — `currentSlug`:** DossierLayout use `slugProp`/`dossierSlug` only; RelatedEntities `currentPeptide={slugProp}`. Template.
2. **C1 — HTML trailing slash:** DossierLayout 487; cardiogen.mdx 329; kristagen.mdx 388. Template + 2 content files.
3. **D2 — Set-guards:** SafetyLayout, ProtocolLayout, GuideLayout, CalculatorLayout. Template. Add `guides.peptide` to validate-cross-links.
4. **C3 + E — `llms.txt.ts` / `llms-full.txt.ts`:** no trailing slash; survivor compare slugs; generate counts. Coordinate with Authority Scout.
5. **C2 — JSON-LD/ItemList trailing slash** on collection hubs + glossary ItemList. Template.
6. **D1 content (optional, last):** remap only where a real slug is the same compound; never invent terms. Do not add glossary URLs for insulin/metformin/pembrolizumab.

Do not change `trailingSlash`, canonical host, or vercel 301s for `.mdx` / `/guides` / compare-order.

---

## Blockers

1. **`graph:check` not run** — another agent owns it; `dist/` is 2026-08-17 and missing HTML. Source-level "0 broken hrefs" is **not** an L2 pass.
2. **GSC 404 / indexed-`.mdx` list** — L0 OAuth blocked on Lucas. Five clinic `.mdx` 301s in `vercel.json` are the last hard evidence that class B reached Google.
3. **`llms.txt.ts` vs Authority Scout** — one editor; do not parallel-edit that file.
4. **Do not invent slugs** to clear the 244 warnings. Most missing related-* values are non-peptides (insulin, pembrolizumab). Template-as-text is the correct outcome.

---

## 8-line summary

1. `validate-links` PASS: 0 structural errors, 244 related-* warnings (already template-guarded → text, not 404s).
2. Historical 404 classes (`.mdx` city.id, `protocol.data.slug`, `/guides/`, unguarded blog related-*) are **patched in templates**; compare-order twins are **deleted** with 301s — not live dual pages.
3. **Still live HTML 308s:** `/regulatory-tracker/` on dossiers (`DossierLayout.astro:487`) and two MDX hrefs (`cardiogen.mdx:329`, `kristagen.mdx:388`).
4. **`currentSlug` still name-derived** (`DossierLayout.astro:323`) for **6** dossiers including amycretin; condition links OK via `slugProp`; `#compare` / RelatedEntities lookups miss.
5. Safety/protocol/guide/calculator peptide hrefs remain **unguarded** (0 current misses). Wave 2: Set-guard, do not invent slugs.
6. `llms.txt.ts` still advertises 4 deleted compare-order URLs + trailing slashes; `llms-full.txt.ts` slashes every collection URL.
7. `graph:check` is the source of truth; this agent did **not** rebuild; `dist/` last built **2026-08-17** and has no `index.html`.
8. Wave 2 first move: replace `currentSlug` with `slugProp`, then strip the three HTML trailing slashes, then Set-guard the four unguarded layouts.
