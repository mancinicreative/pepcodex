# Eval: sourcing-rules skill (2026-04-13)

## Current description

> Evidence-based sourcing rules for PepCodex content. Use when writing/editing any blog post, peptide dossier, or making factual claims that require citations. Defines approved source tiers, citation format, and quality control thresholds.

(Length: 245 chars — within 1024 limit; well under the 300-char informal target.)

## Quality tests

| Test | Result | Notes |
|---|---|---|
| Trigger clarity ("Use when…") | Pass | Explicit "Use when writing/editing…" phrase |
| Specificity vs other content skills | Pass (mostly) | "PepCodex" and "peptide dossier" disambiguate from generic `content-strategist`, `content-producer` |
| Scope (narrow enough) | Pass | Scoped to content that needs citations, not all writing |
| Scope (broad enough) | Partial | Misses QA/review/audit triggers (e.g., "check sourcing", "verify citations") — though `verify-citations` skill covers one flavor |
| Keyword coverage | Partial | Has: blog post, peptide dossier, citations, source. Missing: PMID, DOI, evidence grading, research, claim, reference, article, post-update |

## Scenario matrix

| # | Prompt | Should trigger? | Predicted? | Match? |
|---|---|---|---|---|
| 1 | "Write a blog post about semaglutide cardiovascular outcomes" | Yes | Yes — hits "writing… blog post" | ✓ |
| 2 | "Add a new peptide dossier for rusfertide" | Yes | Yes — hits "writing… peptide dossier" | ✓ |
| 3 | "Update the BPC-157 evidence section with the new 2025 trial" | Yes | Likely — "editing" + "peptide dossier" implied, but no explicit "dossier" keyword in prompt. Moderate risk of miss. | ~ |
| 4 | "Draft a comparison page: tirzepatide vs retatrutide" | Yes | Likely miss — "comparison page" is not in description; would rely on "making factual claims" catch-all | ✗ |
| 5 | "Add a paragraph to the cagrilintide dossier summarizing the Phase 2 results" | Yes | Yes — "editing… peptide dossier" | ✓ |
| 6 | "Review this dossier draft for sourcing compliance" | Yes (arguably) | Likely miss — "review" is not covered; `verify-citations` skill would pick this up instead, which is fine | ~ |
| 7 | "Fix the Astro build error in BaseLayout.astro" | No | No — no content/citation keywords | ✓ |
| 8 | "Refactor the sidebar component" | No | No | ✓ |
| 9 | "Update STATE.md with Phase 35 progress" | No | No | ✓ |
| 10 | "Rewrite the intro of the retatrutide blog post to be more punchy" | Yes | Yes — "editing… blog post" | ✓ |

Predicted pass rate: 7/10 clean, 2 partial (scenarios 3, 6), 1 likely miss (scenario 4 — comparison pages).

## Strengths

- Explicit "Use when" trigger phrase matches Anthropic skill-authoring best practice.
- Names the two highest-frequency content types by the exact terms Claude will naturally use in prompts ("blog post", "peptide dossier").
- Concise, under 300 chars — low token cost when listed in the skills manifest.
- Reinforced by hard rule in `.claude/CLAUDE.md` ("invoke the `sourcing-rules` skill") which should nudge invocation even if description misses.

## Gaps

1. **Comparison pages not mentioned.** `src/content/comparisons/` is a real content type per project conventions, but "comparison" isn't in the description — scenario 4 likely misses.
2. **No "evidence grading" keyword** even though grading is a required element; users who prompt "add evidence grading to…" may not trigger.
3. **No "citation" variants** — prompts using "cite", "source", "reference", "PMID", "DOI" would benefit from explicit keyword presence. Currently only "citation(s)" appears.
4. **No QA/review triggers.** Prompts like "audit the sourcing on this post" or "check that these citations are real" may not match. (Partially mitigated by the separate `verify-citations` skill.)
5. **Body vs. description balance:** body is appropriate; description is appropriately lean. No content misplacement.

## Recommended description revision

**Before (245 chars):**
> Evidence-based sourcing rules for PepCodex content. Use when writing/editing any blog post, peptide dossier, or making factual claims that require citations. Defines approved source tiers, citation format, and quality control thresholds.

**After (proposed, 297 chars):**
> Evidence-based sourcing rules for PepCodex content. Use when writing, editing, or reviewing any peptide dossier, blog post, or comparison page — or any factual claim needing citations, PMIDs, DOIs, or evidence grading. Defines approved source tiers, citation format, and quality thresholds.

Changes:
- Added "reviewing" to cover audit/review prompts (scenario 6).
- Added "comparison page" to cover scenario 4.
- Added "PMIDs, DOIs, evidence grading" as natural-language keywords users reach for.
- Kept under 300 chars.

## Verdict

**Needs minor revision.** The current description passes for the two dominant content types (blog posts, dossiers) but misses comparison pages, review/audit flows, and key natural-language keywords (PMID, DOI, evidence grading). Proposed revision closes those gaps without expanding scope.
