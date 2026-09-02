---
name: seo-engine
description: Multi-agent PepCodex SEO + freshness engine. Use when Lucas asks to improve pepcodex.com SEO, drive traffic, refresh peptide evidence, pull GSC/GA4, kill the Singapore bot, audit false links, or run the SEO orchestrator / graph loops.
---

# PepCodex SEO Engine

**Do not improvise a generic SEO plan.** Load and follow:

1. `.planning/seo-engine/ORCHESTRATOR.md` — the session prompt (constraints, waves, done)
2. `.planning/seo-engine/LOOPS.md` — graph loops + quality bars
3. `.planning/seo-engine/AGENTS.md` — one dispatchable brief per agent

This is pepcodex.com (Astro, `peptide-library/`), not PepTracker. Crawl budget is the binding constraint. Never "publish more" as the growth answer.

If Lucas says "run it" / "go": start at Gate 0 in the orchestrator. If he asks for a quality check or "verify the work": dispatch **Quality Judge as Kimi K3** (`kimi-k3-max`) from AGENTS.md packet J — do not self-score. If he says "create" or "show me": the files above *are* the deliverable — do not start Wave 2 edits unless asked.
