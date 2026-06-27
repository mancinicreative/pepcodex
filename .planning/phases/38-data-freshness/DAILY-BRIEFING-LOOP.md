# Daily-Briefing Blog Loop — Spec

*Phase 38 · the owner's "daily blog post written from all the info over the last day" idea.*
*Fills the gap left by the failed `daily-content` ideation lens. Integrity-gated like every Phase-38 loop.*

## Goal
Each day, automatically draft ONE evidence-graded, fully-cited briefing post synthesising the last
24–48h of *peptide-relevant* developments — new research, trial readouts, approvals/regulatory moves,
and biotech funding — in the PepCodex voice, cross-linked to existing dossiers. **Drafts only; a human
merges the PR.** No post publishes without every PMID/NCT/DOI resolving and a review gate.

## Non-negotiables (inherited)
- **No fabrication.** Every factual claim cites a real, resolving source (the prebuild `qa-pmids --strict`
  gate + the planned NCT/DOI extension apply to the generated post too). Zero tolerance — this is the moat.
- **Banned content:** no dosing protocols, no sourcing/where-to-buy, no medical advice. Run `qa-banned-content`.
- **Evidence-graded:** each item carries the same `high/moderate/low/very-low` grade; preprints/press-releases
  are labelled as such and never presented as established.
- **Human review before publish** (PR merge). The loop writes to a draft, never to the live build directly.

## Trigger / cadence
- **Daily** cron ~06:00 ET (Claude `/schedule` cloud agent).
- **"Enough signal" threshold:** only emit a post if ≥3 genuinely novel, peptide-relevant, source-verifiable
  items exist that day; otherwise hold items in a rolling buffer and emit a **weekly digest** (Fri) instead.
  Prevents thin/filler posts (an SEO + trust liability).

## Sources (all structured / verifiable first)
| Source | What | API |
|---|---|---|
| PubMed | new peptide studies (edat last 1–2d) | NCBI E-utilities `esearch datetype=edat&reldate=2` over a curated peptide-term list |
| Europe PMC | preprints (bioRxiv/medRxiv) | EuropePMC REST `FIRST_PDATE:[…]` (labelled "preprint — not peer-reviewed") |
| ClinicalTrials.gov | new/updated peptide trials, readouts | v2 API `LastUpdatePostDate` (reuses `refresh-trials.mjs`) |
| openFDA | approvals, label changes, FAERS signals | `drug/label`, `drug/event` endpoints |
| Funding/biotech news | rounds, IND clearances, M&A | curated RSS/news + web search — **lowest-trust tier; every claim must link to a primary press release / SEC / company source, never a rumor** |

## Pipeline
1. **Gather** — each source queried for the window; results normalised to `{type, title, summary, sourceId, sourceUrl, date, peptides[]}`.
2. **Novelty/dedup** — drop anything already in `src/content/blog/` or already covered in a dossier; dedup across sources (same study via PubMed + preprint).
3. **Relevance filter** — keep only items mapping to a known peptide (slug/alias map, shared with Loops 2/3) or a clearly peptide-class topic; drop generic hits.
4. **Per-item verify** — resolve every sourceId (PMID→esummary, NCT→CT.gov, DOI→Crossref). Unresolved item → **dropped**, not guessed.
5. **Evidence-grade** each kept item via `sourcing-rules`.
6. **Synthesise** — one post: a 2–3 sentence lede, then 3–7 graded item blurbs (what/why-it-matters/caveat), each linking its primary source + any relevant on-site dossier (`/peptides/<slug>`). Voice = the existing weekly-briefing posts. Verb ladder matches grade ("may" vs "reduces").
7. **Draft** — write `src/content/blog/<date>-daily-briefing.mdx.draft` (or to a `daily-briefing/<date>` branch) with proper frontmatter (category `weekly-briefing` or new `daily-briefing`, peptide tags, sources[]).
8. **Gate + PR** — run `qa-pmids --strict` + `qa-banned-content` + `validate-cross-links` on the draft; open a `gh pr`. CI re-runs the gates.
9. **Human review → merge → Vercel publishes.**

## Infra
- **Claude `/schedule` cron cloud agent** (does the gather→synthesise→draft→PR; LLM judgement is the value).
- Deterministic gates run in GitHub Actions on the PR (blocking).
- `scheduled-tasks` MCP as local fallback. n8n optional for the pure-ingest fan-out if cron-agent cost is a concern.

## Guardrails / failure modes
- **Fabrication:** the resolve-every-id step + the prebuild gate make a hallucinated citation impossible to publish.
- **Thin days:** the ≥3-item threshold + weekly-digest fallback prevent filler.
- **Hype/press-release laundering:** funding/news items must link a primary source and are graded `low` + labelled.
- **Review bottleneck:** cap at one post/day; batch the PR; the human reviews a pre-verified draft (minutes, not hours).
- **Cost/rate limits:** structured APIs first (cheap, deterministic); LLM only for the synthesis step.
- **Duplication with the weekly news cadence:** the daily buffer feeds the weekly digest, so they share one item pool.

## Build order (within Phase 38)
After Loop 1 (citation gate) is fully green and the scoring rollout lands. Prototype as a **manual** `/schedule`
agent first (human runs it, reviews output) for ~1–2 weeks to tune the relevance filter + threshold before
making it autonomous-with-review. Monetisation tie-in: this loop directly feeds the Beehiiv "what changed"
digest (roadmap M2).
