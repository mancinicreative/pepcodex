# The remediation prompt — fix every blog post on pepcodex.com

*Self-contained execution brief. Written 2026-08-17 after a 20-post claim audit found 15 defective.
Hand this to an agent with no memory of the audit; it must need zero clarification.*

---

## THE PROMPT

You are repairing factual claims on an evidence-based medical content site. Every claim you leave
standing will be read by someone deciding what to put in their body. Work accordingly.

### The one rule that outranks everything

**Inventing a source, a number, a date, or a quote is the worst outcome available to you — worse
than leaving a post broken, worse than deleting it, worse than returning empty-handed.**

You have explicit permission to report `CANNOT VERIFY` and stop. That is a correct, valuable
answer. Do not fill a gap with something plausible. This site already published 32 posts
describing clinical trials that do not exist; that is the failure you are here to undo, and you
will not undo it by producing more of it.

Related and equally binding: **never attach a real identifier to a claim it does not support.**
A wrong claim carrying a resolving PMID looks verified while remaining false. That is strictly
worse than the same claim with no citation at all, because it defeats the next reviewer.

### Verified state — do not re-derive this

- **155 blog posts** in `src/content/blog/`. **58 are held** (`robots: noindex` + dropped from
  sitemap). **97 are live.** [VERIFIED: filesystem scan 2026-08-17]
- The 97 live posts partition as: **34 NEEDS-REWRITE** (triaged, real sources recovered for 31),
  **1 FIXABLE**, **5 audited and passing**, **57 never audited**. Exact slug lists:
  `.planning/data/v2/live-cohorts.json` [VERIFIED: scan 2026-08-17]
- A 20-post stratified audit of the "clean" cohort found **15 defective — 8 CONTRADICTED,
  4 MISATTRIBUTED, 3 OVERSTATED**. Across those 20 posts only **88 of 208 claims** were
  supported. Full findings: `.planning/CLAIM-AUDIT-RESULTS.md`, raw:
  `.planning/data/v2/claims-audit.json` [VERIFIED: audit run 2026-08-17]
- **A resolving identifier does not predict correctness.** 12 of 17 posts carrying real PMIDs
  were still defective. Do not use citation style as a triage shortcut — it does not work.
  [VERIFIED: cross-tabulated, `.planning/data/v2/citation-strength.json`]
- Quality is **flat across traffic levels** (top-traffic 3/5 defective, zero-impression 4/5).
  Expect the 57 unaudited posts to fail at the same ~75% rate. [VERIFIED: control stratum]
- `/blog/` has **0 clicks all-time** against 6,385 impressions, both GSC properties.
  Retiring a post costs no measurable traffic. [VERIFIED: GSC page data]
- Citation gate `scripts/qa-source-identifiers.mjs --strict` runs in `npm run check` →
  `prebuild`, as a **ratchet** against `.planning/citation-baseline.json` (201 known offenders).
  It fails only on NEW violations. [VERIFIED: `PASS (ratchet)` in build log]

### The core mechanic: quote-or-cut

For every sentence in a post that asserts a fact — a number, a sample size, a date, an approval,
a comparison, a mechanism, a regulatory status — exactly one of these must be true when you are
done:

1. You have **fetched the cited source** and can paste the sentence from its abstract, record, or
   label that supports the claim; or
2. The sentence is **gone**.

There is no third state. "Probably true", "widely known", "consistent with my understanding" all
resolve to **cut**. Your own knowledge is not a source — you may use it to decide what to go
looking for, never to license a claim.

Uncited background prose that makes no factual assertion may stay.

### Per-post procedure

Work one post at a time. Do not batch-edit across posts.

**1 — Build the claim table.** Read the post. List every factual assertion with its line context.
Typical count is 8–17. Write it to `.planning/data/v2/fixes/<slug>.json` as you go.

**2 — Resolve every citation for real.** For each entry in frontmatter `sources:`:

```bash
# PMID
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=<PMID>"
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=<PMID>"
# DOI  (also extract DOIs hiding inside url: fields — the gate never checks those)
curl -s -o /dev/null -w "%{http_code}" "https://doi.org/<DOI>"
curl -s "https://api.crossref.org/works/<DOI>"
# NCT
curl -s "https://clinicaltrials.gov/api/v2/studies/<NCT>"
```

Record the **actual** title, journal, year and abstract text. Compare the actual title against the
title written in frontmatter — drift there is a known concealment pattern.

**3 — Match each claim to a source, with a quote.** Paste the supporting sentence. If no cited
source supports the claim, search PubMed for one before concluding it is unsupported:

```bash
curl -s "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&term=<query>"
```

A search returning nothing is a real and reportable result. Say so; do not widen the query until
something appears and then pretend it matched.

**4 — Classify the post**, then act per the table below.

### Decision table

| Finding | Action |
|---|---|
| **Central premise is fabricated** — the trial, the approval, or the event does not exist | **RETIRE.** Do not rewrite. A post whose reason to exist never happened cannot be corrected into truth. |
| **Publication date precedes the event it reports** | **RETIRE.** It reported the future. Treat as fabricated. |
| **Number wrong, real study exists** | **CORRECT** to the figure in the abstract, with the quote recorded. Re-check every downstream sentence that reasoned from the wrong number — those usually break too. |
| **Wrong paper attached to a real claim** | **REATTACH** the correct paper if you can verify it; otherwise cut the claim. Never leave the wrong pairing. |
| **Animal data written as human** | **RELABEL** explicitly in the body — species, route, dose. Do not merely soften the verb. |
| **Non-primary estimand quoted as the headline** | **REPLACE** with the primary estimand, and name the estimand in the text. If comparing two drugs, both figures must be the same estimand type. |
| **Distinguishing content uncited** (comparison tables, WADA status, half-lives, "discontinued" narratives) | **CITE or CUT.** This is the dominant failure in `what-is-X` explainers — roughly half of each is uncited. |
| **Body cites `[key]` absent from frontmatter** | The claim has no source at all. Find one or cut it. |

**Retiring a post means:** delete the `.mdx` file, and if it has any GSC impressions, add a 301 in
`astro.config.mjs`/`vercel.json` to the nearest genuinely relevant live page — never to `/` as a
catch-all. Record the redirect target in your report. Net URL count falling is a *gain* here:
crawl budget is this site's binding constraint.

### Sequence

**Phase 0 — build three gates before touching any post.** Each catches a class that shipped past
the current gates, and each prevents your own work from regressing:

1. **Dangling citation keys** — body `[key]` with no matching `id:` in frontmatter. 14 live posts
   already known to fail.
2. **DOIs inside `url:` fields** — extract and resolve them. `qa-pmids.mjs` only checks the `doi:`
   field, which is how two fabricated NEJM DOIs shipped.
3. **Source-title drift** — compare each frontmatter source title to the PubMed `esummary` title.

Wire all three into `npm run check` as ratchets against a baseline, matching the existing pattern
in `scripts/qa-source-identifiers.mjs`. Prove each one fails on an injected violation and passes
on a clean tree, with real exit codes.

**Phase 1 — the 34 NEEDS-REWRITE**, highest impressions first. Real sources are already recovered
for 31 of them in `.planning/CITATION-AUDIT.md`. **Do not paste those identifiers in and call it
done** — they were classified NEEDS-REWRITE precisely because the claims diverge from the sources.
Rewrite claims to match papers, not the reverse.

**Phase 2 — the 57 unaudited**, highest impressions first. Full procedure; expect ~75% to need
work.

**Phase 3 — re-examine the 58 held.** Most were held because their studies do not exist; those
stay retired or get deleted outright. Any that survive scrutiny may be restored only after passing
the full procedure and all gates.

**Phase 4 — the 5 audited-passing and 1 fixable.** Even the passing ones average 6 of 10 claims
supported; the balance is uncited, not wrong. Apply quote-or-cut.

### Traps that have already cost rework in this repo

- **Content files are CRLF.** A `\n`-only regex replace silently no-ops **and reports success**.
  Match `/^---(\r?\n)/` and preserve the file's own line ending. After every write, grep the file
  to prove the change landed. Do not trust your own success message.
- **Never trust a wrapper's exit code.** Capture the real one inside the log:
  `{ npm run build; echo "REAL_BUILD_EXIT=$?"; } > log 2>&1` then grep the log.
- **`slug` ≠ `name`.** Derive URLs from the collection slug, never `data.name` — 5 dossiers
  diverge.
- **A resolving NCT proves nothing.** `NCT05869903` resolves fine while being the wrong trial for
  the post citing it. And `NCT07487363` states in its own brief summary that it is a **fictional
  example record** — it must never be cited.
- **Internal links must mirror `getStaticPaths` exactly** and carry no trailing slash. Run
  `npm run graph:check` before any commit that touches links.
- Banned content stands regardless of what a source says: no dosing protocols, no medical advice.

### What you must verify and report per post

Report the actual output, not an assurance that you ran something.

- Claims checked / claims supported, before and after.
- Every surviving factual sentence, with the quote and the identifier behind it.
- Every claim cut, with the reason.
- `git diff --stat` for the post.
- Grep output proving the edits are in the file.

At the end of each batch: `REAL_BUILD_EXIT=0`, the ratchet line from
`qa-source-identifiers.mjs`, and `npm run graph:check` output.

### Boundaries

- Touch only `src/content/blog/`, the three new gate scripts, `.planning/data/v2/fixes/`, and
  redirect config for posts you retire.
- Do not touch dossiers, comparisons, layouts, or the design system.
- Do not add new posts. Do not expand scope beyond the post in front of you.
- Do not run `--update-baseline` on any gate to make a failure disappear. Fix the citation.
- Commit per batch with the evidence in the message, never one commit for everything.

### Stop conditions

Stop and report rather than proceeding if:

- A post's central claim cannot be verified **or** refuted after a genuine search — say
  `CANNOT VERIFY` and leave the post held.
- Retiring a post would break more than 3 inbound internal links — report instead, so the linking
  pages can be fixed first.
- More than 40% of a phase's posts resolve to RETIRE — stop and report. That changes the shape of
  the job and the owner needs to see it before you delete at volume.
