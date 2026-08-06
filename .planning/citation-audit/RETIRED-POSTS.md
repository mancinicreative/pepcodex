# Retired blog posts — zero verified sources (2026-08-06)

Thirteen posts were removed from `src/content/blog/`. Every one carried `sources: []` (or an
unresolvable source stub) after the citation sweep: **no PMID, DOI or NCT on the post survived
verification against its authority.** On a site whose entire premise is evidence-based sourcing, an
uncited post is the failure mode, not an edge case.

They are **not lost** — git holds the full text at the SHAs below. Nothing here is irreversible.

Each had **zero inbound links** from any other page, dossier, comparison or data file (verified by
grep across `src/**` before deletion), so removal breaks no internal navigation. External inbound
links are handled by 301s in `vercel.json`.

## Why these thirteen, and what they had become

An earlier remediation pass in this same sweep had already rewritten several of them from
fabricated claims into "correcting the record" debunks — e.g. `centenarian-longevity-peptide` now
opened by stating that no peptide called SHLP-8 exists, and `eu-peptide-research-consortium` that
the "EUPeptide Consortium" could not be found in European Commission or CORDIS records. That is an
honest posture, but it is still an uncited assertion. A debunk with no source is the same epistemic
object as the claim it debunks: something the reader has to take on trust.

The underlying reason all thirteen resisted sourcing is that their central subject does not exist,
or the specific figure attached to it does not. Compounds named in the originals that have **no
entry in any registry, patent database or literature index**: `GHS-X`, `HP-5`, `AMP-247`, `SHLP-8`.
Entities and studies that could not be found: "PeptideGel Inc.", the "PREDICT-GLP study"
(4,200 patients), the €380M "EUPeptide Consortium", a Chinese domestic tirzepatide biosimilar
approval. You cannot cite your way to a source for a thing that was never there.

## Removed

All thirteen were committed in their final rewritten state at **`42078b6`** immediately before
removal, specifically so the "correcting the record" text is recoverable rather than lost to a
working-tree delete.

| slug | 301 → |
|---|---|
| `2025-glp1-year-review` | `/peptides/semaglutide` |
| `2025-peptide-approvals-record` | `/blog` |
| `2025-peptide-market-outlook` | `/blog` |
| `ai-peptide-drug-discovery` | `/blog` |
| `centenarian-longevity-peptide` | `/peptides/mots-c` |
| `china-tirzepatide-biosimilar` | `/peptides/tirzepatide` |
| `epithalon-safety` | `/peptides/epithalon` |
| `eu-peptide-research-consortium` | `/blog` |
| `glp1-manufacturing-online` | `/peptides/semaglutide` |
| `peptide-antiviral-coronavirus` | `/blog` |
| `peptide-cancer-vaccines-melanoma` | `/blog` |
| `peptide-drug-conjugate-tumors` | `/blog` |
| `peptide-market-80b-projection` | `/blog` |

Recover any of them with:

```bash
git show 42078b6:src/content/blog/<slug>.mdx
```

The 301s are inserted directly after the apex-to-www host rule in `vercel.json`, ahead of every
other entry, so no later wildcard can shadow them.

## Topics worth rebuilding from sources (not restoring)

Five of the thirteen sit on subjects that DO have a real, citable literature. The posts were
unsourceable; the topics are not. If any of these is rewritten, it must be written **from** the
sources below rather than restored and retro-cited — the fabrication class this whole sweep exists
to eliminate is exactly "plausible text first, identifiers attached afterwards."

- **Neoantigen cancer vaccines in melanoma** — the headline result is mRNA-4157/V940 + pembrolizumab
  (KEYNOTE-942), which is an mRNA vaccine, not a peptide vaccine. The distinction is the story.
- **Peptide-drug conjugates in solid tumours** — bicycle toxin conjugates (BT8009 /
  zelenectide pevedotin, BT5528) have registered trials and published data.
- **Peptide fusion inhibitors against coronaviruses** — enfuvirtide is the FDA-approved precedent in
  HIV; the pan-coronavirus claim is where the evidence stops.
- **Epithalon safety** — the Khavinson literature is real and largely Russian-language; the honest
  post is about evidence *quality*, and it needs the actual papers attached.
- **AI in peptide drug discovery** — RFdiffusion / AlphaFold-adjacent design work is published and
  citable; the "years to weeks" claim is the unsourceable part.

The remaining eight are market forecasts, manufacturing announcements and year-in-review pieces.
Those are trade-press territory, carry no research value, and should not return.

---

## Retired 2026-08-06 (second wave) — `orforglipron-beats-oral-semaglutide`

Removed because its premise is a trial arm that does not exist.

The post asserted that ATTAIN-2 was "the first time a next-generation oral GLP-1 has been directly
compared to the current market leader in a Phase 3 setting", and reported orforglipron 36 mg at
~14.7% against **oral semaglutide 14 mg at ~9.4%**.

ATTAIN-2 (PMID 41275875, *Lancet* 2026, NCT05872620) is a 72-week, double-blind,
**placebo-controlled** trial in 1,613 adults with obesity or overweight **and type 2 diabetes**,
randomised 1:1:1:2 to orforglipron 6 mg, 12 mg, 36 mg or placebo. Weight change was −5.1% / −7.0% /
−9.6% versus −2.5% for placebo, on the treatment-regimen estimand.

There is no semaglutide arm. Every structural claim in the post was wrong — the design, the
population, the duration (52 weeks vs 72), the comparator, the sample size, and every number. This
is not an estimand slip or a stale figure; it is a fabricated trial design, and the headline claim
"beats oral semaglutide head-to-head" cannot be made true by editing figures.

The orforglipron dossier had ATTAIN-2 correct at −9.6% throughout, so this was an isolated blog
fabrication rather than a site-wide error.

Deleted rather than rewritten because the slug, title, excerpt, tags and thesis all encode the false
claim; what would remain is a different post. Zero inbound links. 301 → `/peptides/orforglipron`.

Found by the independent verifier agent, not by any automated gate — every identifier on the page
resolved, so no citation check could see it. The gap is recorded in MONTHLY-REFRESH-WORKFLOW.md:
nothing currently checks that a described trial DESIGN matches its registration.
