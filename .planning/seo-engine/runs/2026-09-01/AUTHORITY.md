# AUTHORITY — 2026-09-01 (recommendations only)

No outreach sent.

## 1. `llms.txt` is a public lie (fix in Wave 2 — reversible)

`src/pages/llms.txt.ts` is hardcoded:

- “Last updated: 2026-02-18”
- “92 peptide dossiers” (scan this run is walking **107** dossiers)
- Trailing slashes on every URL (`/peptides/{slug}/`) while the site is `trailingSlash: 'never'` — each AI citation costs a 308

`src/pages/llms-full.txt.ts` **is** collection-generated (good) but still emits trailing slashes.

**Move:** generate `llms.txt` from `getCollection('peptides')` like `llms-full`, bump date at build, strip trailing slashes. This is the AI channel the corrections doc already measured (ChatGPT referrals).

## 2. Do not grow URL count to “build authority”

DR ~3.3. The site already ranks pos 3–7 on under-covered comparison pairs. Guest posts / HARO lists are not the move. Linkable unique assets that already exist: `/trials`, `/regulatory-tracker` — both were historically **uncrawled** despite 1,222 inbound links. After auth: GSC URL Inspection → Request indexing on those two plus `/peptides`. Owner click, 20 URLs max.

## 3. Brand-recall SERP

People search “peptide codex”, “pepdoc”, “pepco peptides”. Homepage copy/title should include those misspellings as natural language once, not a new brand microsite.

## 4. Calculators

Highest impressions-per-page historically. Interactive calc is a product move (PepTracker), not a pepcodex.com URL explosion. Keep the three tool URLs healthy; do not mint 144 more calculator routes unless L2+L6 net-URL bars pass (they will not).

## 5. ChatGPT is already a channel

Protect it (see bot do-not-harm). Citeable structure > news volume.

## 6–7. Parked

- Directory spam / peptide-blogger link exchanges: no
- Affiliates / research-chem: no (Gate D1)
