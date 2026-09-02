# AUTH-BLOCKED — superseded 2026-09-02

Live pull **succeeded**. Use `.planning/seo-engine/runs/2026-09-01/MEASUREMENT.md`. Do not treat this file or the 2026-07-25 export as current.

Below is the 2026-09-01 failure record (kept for the `invalid_rapt` lesson).

---

# AUTH-BLOCKED — Gate 0 failed 2026-09-01

Live GSC/GA4 pulls did **not** complete. Wave 1 continues on the 2026-07-25 offline export. Do not treat those numbers as current.

## What ran

| Command | Result |
|---|---|
| `npm run gsc:whoami` | ADC file present. `userinfo.email` not granted. Quota project `wired-dahlia-496320-e6`. Process hung ~147s on open handles after printing. |
| `npm run ga4:pull` (mintToken / SA impersonation) | **FAIL** `invalid_grant` / `invalid_rapt` |
| `npm run gsc:repull` (mintToken) | **FAIL** same |
| `npm run gsc:sites` (user ADC, no impersonation) | **FAIL** same on `UserRefreshClient.refreshTokenNoCache` |

`invalid_rapt` is Google Cloud session reauth ([support](https://support.google.com/a/answer/9368756)). The refresh token is dead until a human logs in in a browser. Scripts cannot fix this.

## What Lucas does (one PowerShell line)

Use the Desktop OAuth client. Do **not** use gcloud's shared client. Do **not** create a service-account key. Quotes required; no spaces around commas:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login --client-id-file="C:\Users\manci\.gcp\pepcodex-oauth-client.json" --scopes="https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/userinfo.email"
```

Walkthrough: `.planning/GOOGLE-API-SETUP.md` Steps 9–11.

Then: `npm run gsc:whoami` → must print an email → `npm run gsc:sites` → `npm run gsc:repull` → `npm run ga4:pull`.

`ga4-pull.mjs` and `gsc-repull.mjs` already have the country / hostname / page+query cuts added this session. Re-run them after login; do not use this AUTH-BLOCKED file as the measurement.

## Script patches already in the worktree (do not revert)

- `scripts/ga4-pull.mjs` — country, city, hostName, sessionSource, pageReferrer
- `scripts/gsc-repull.mjs` — page+query cut
- `scripts/fetch-search-data.mjs` — country + GA4 country/hostname/sources/referrer
- `scripts/monthly-research-scan.mjs` — always writes per-slug JSON, including zero findings
