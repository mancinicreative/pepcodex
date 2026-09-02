# Next actions (dispatched by Grok council Executor 2026-09-02)

Peptide-library only. Branch `feat/scoring-and-freshness`. Net URL **0**. No blogs. No new peptides. No MDX from this seat. No KEEP. No TICK72+. No `astro build`.

Companion board: `council-grok/EXECUTOR.md`.

---

## Now (this 90 minutes) — do not spawn

- [x] Executor board written (`council-grok/EXECUTOR.md`). No editors launched.
- [ ] **Do not launch TICK72+.** Editor cap is TICK69 / TICK70 / TICK71. Wait for those notes to close.
- [ ] **Do not start a Quality Judge.** Queue is PAUSED (Other Models cap). Do not Grok-judge TICK37. Do not stamp KEEP.
- [ ] **Do not start a second Measurement Steward or `gcloud auth`.** Steward is in flight; `MEASUREMENT.md` already FRESH (2026-09-02T22:04:55Z).
- [ ] **Do not start TICK6-PRICE.** Propose-first.

---

## When an in-flight editor exits (Conductor, not this seat)

- [ ] Collect TICK69 note (`aod-9604-vs-ct-388.mdx`) — already written; confirm the editor process exited. Append to Judge FIFO after TICK68. Do not KEEP.
- [ ] Collect TICK70 note (`aod-9604-vs-tirzepatide.mdx`) when the stub becomes a full implementer note. FIFO after TICK69. Do not KEEP.
- [ ] Collect TICK71 note (`aod-9604-vs-liraglutide.mdx`) same rule. FIFO after TICK70. Do not KEEP.
- [ ] After **19:40 ET** only, if a slot is free and Judge is still paused: launch **one** leftover, next file `aod-9604-vs-maritide.mdx`. Still cap ≤3. Still not TICK72 during the freeze. Fetch-or-strip census. Do not touch TICK6-PRICE rows.

---

## Judge FIFO — **blocked on Lucas** (unpause Other Models / Kimi K3)

Do not run these until Lucas unpauses. Then one Judge at a time, this order:

- [ ] TICK37 `cagrisema-vs-semaglutide.mdx` — **blocked on Lucas**. Artifact `judge/L4-TICK37-iter1.md` already on disk (Kimi K3 KEEP). Conductor verifies that file. **Do not start a second TICK37 Judge. Do not Grok-judge. Executor does not stamp LOOP-TASKS.**
- [ ] TICK60 `5-amino-1mq-vs-ct-388.mdx`
- [ ] TICK61 `5-amino-1mq-vs-aod-9604.mdx`
- [ ] TICK62 `5-amino-1mq-vs-maritide.mdx`
- [ ] TICK63 `5-amino-1mq-vs-liraglutide.mdx`
- [ ] TICK64 `5-amino-1mq-vs-mazdutide.mdx`
- [ ] TICK65 `5-amino-1mq-vs-tirzepatide.mdx`
- [ ] TICK66 `aod-9604-vs-orforglipron.mdx`
- [ ] TICK67 `aod-9604-vs-cagrilintide.mdx`
- [ ] TICK68 `aod-9604-vs-cagrisema.mdx`
- [ ] TICK69 → TICK70 → TICK71 after those editors exit (do not jump FIFO)

---

## Analytics ASAP — no second login

- [ ] Let the in-flight Measurement Steward close. Confirm `MEASUREMENT.md` + `.planning/data/v2/manifest.json`.
- [ ] Conductor: refresh `.planning/STATE.md` Gate 0 line (it still says `invalid_rapt`; MEASUREMENT says FRESH).
- [ ] After Steward closes: one Bot Hunter Wave 1 — rewrite `BOT-DIAGNOSIS.md` + write `BOT-WAF-DRAFT.md` from the 2026-09-02 country/source/hostname cuts. Current diagnosis is 2026-09-01 / `invalid_rapt`. Planning only. No Firewall apply. No `analytics.ts` until Judge (Kimi, not Grok) approves.
- [ ] Fallback **blocked on Lucas** — only if Steward writes a new `AUTH-BLOCKED.md`: Desktop-client ADC login in `AUTH-BLOCKED.md`. Do **not** run that line while Steward is live.

---

## Leftover unlocked files (queued — not claimed)

From `LOOP-TICK-19.md` minus TICK67–71 claims. All 13 exist on disk.

**`aod-9604-vs-*` (prefer):** `maritide` · `mazdutide` · `pemvidutide` · `retatrutide` · `slu-pp-332` · `survodutide` · `vk2735`

**`5-amino-1mq-vs-*`:** `orforglipron` · `pemvidutide` · `retatrutide` · `slu-pp-332` · `survodutide` · `vk2735`

---

## **blocked on Lucas**

- [ ] **Unpause Other Models / Kimi K3 Judge** so FIFO can start. Do not substitute Grok.
- [ ] **TICK6-PRICE** — yes (strip the named `$1,000/month` compare rows in the LOOP-TASKS brief) or no (leave them). Do not invent a list price.
- [ ] **Do not start a second `gcloud auth`** while the Steward is in flight.
- [ ] Production merge/push — not this window.

---

## Hard nos (standing)

- No new `/blog/` or `/peptides/` slugs.
- No net URL increase.
- No `astro build` except a later sole-occupant Verifier.
- No KEEP stamp from Conductor, Executor, or Implementer.
- No two editors on the same compare file.
