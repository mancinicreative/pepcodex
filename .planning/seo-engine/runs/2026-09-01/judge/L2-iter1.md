# Judge — L2 iter 1

`graph:check` **FAIL** (4 dead targets, tesamorelin calc orphan). 100% silent is a missing GSC-join artifact — do not treat as indexation collapse.

Implementer patched TrialTable/trials/DossierLayout to use pack **slug**, not display name. That addresses `/peptides/thymosin alpha-1`, `/peptides/zelenectide pevedotin`, and `/peptides/mrna-4157/v940` **from /trials and dossier trial tables** (slash-in-name). Conditions Studied `v940` and tesamorelin orphan **not** in this increment.

Verdict: **RETRY-WITH-NEW-PLAN after rebuild.** Do not KEEP until `graph:check` on a new `dist/`. Do not stack more link changes on this unevaluated increment.
