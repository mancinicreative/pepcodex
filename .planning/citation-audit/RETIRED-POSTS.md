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

| slug | last commit before removal | 301 → |
|---|---|---|
| `2025-glp1-year-review` | `2423083` | `/peptides/semaglutide` |
| `2025-peptide-approvals-record` | `cafc336` | `/blog` |
| `2025-peptide-market-outlook` | `2423083` | `/blog` |
| `ai-peptide-drug-discovery` | `2423083` | `/blog` |
| `centenarian-longevity-peptide` | `2423083` | `/peptides/mots-c` |
| `china-tirzepatide-biosimilar` | `2423083` | `/peptides/tirzepatide` |
| `epithalon-safety` | `2bb50fe` | `/peptides/epithalon` |
| `eu-peptide-research-consortium` | `2423083` | `/blog` |
| `glp1-manufacturing-online` | `2423083` | `/peptides/semaglutide` |
| `peptide-antiviral-coronavirus` | `2423083` | `/blog` |
| `peptide-cancer-vaccines-melanoma` | `2423083` | `/blog` |
| `peptide-drug-conjugate-tumors` | `2423083` | `/blog` |
| `peptide-market-80b-projection` | `2423083` | `/blog` |

Recover any of them with:

```bash
git show 2423083:src/content/blog/<slug>.mdx
```

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
