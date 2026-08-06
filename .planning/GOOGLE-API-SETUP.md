# Google API Setup — verified path (2026-07-24)

*Goal: let Claude read Search Console + GA4 automatically.*
*~20 minutes. You click; Claude does the rest.*

## What went wrong before (so we don't loop)

Two dead ends, both now ruled out **with evidence**:

1. **Service-account key** — blocked by org policy `iam.disableServiceAccountKeyCreation`
   (auto-enforced by Google on every Cloud org created after 2024-05-03).
2. **Plain `gcloud auth application-default login`** — "This app is blocked". This is
   **not** a Workspace/admin block. gcloud uses Google's *shared* ADC OAuth client
   `764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com`, which is
   registered only for Cloud scopes. Search Console + Analytics are not Cloud scopes.

   Proof, written by gcloud to its own log *before the browser opened*
   (`%APPDATA%\gcloud\logs\2026.07.24\12.30.32.951112.log`, lines 7-8):

   > The following scopes will be blocked soon for the default client ID:
   > `https://www.googleapis.com/auth/analytics.readonly`.
   > To use these scopes, you must provide your own client ID or use service account impersonation.

   **Admin-console allowlisting cannot fix this.** API controls are *subtractive* — they
   restrict an app relative to what Google already permits; they cannot grant scopes
   Google refuses to issue. Don't spend time there.

**The fix:** use *your own* OAuth client. That's what gcloud itself tells you to do.

---

## Step 0 — Settle the account (do not skip)

Your blocked URL contained `authuser=1`, meaning consent ran against your **second**
signed-in Google account, which may not own the properties.

Open a **fresh Incognito window** and sign in with **exactly one** account: the one that
owns the two Search Console properties and the GA4 property. Do every step below in that
one window.

## Step 1 — Create/pick a Cloud project

<https://console.cloud.google.com/projectcreate> — name it `pepcodex-analytics`.

If a Location/Organization dropdown offers your domain, **pick the organization** — that
unlocks "Internal" later, which is the best outcome. "No organization" also works.

Write down the **Project ID** (like `pepcodex-analytics-472913`), not the name.

## Step 2 — Enable the two APIs

Check the project selector is on your project, then **ENABLE** each:

- <https://console.cloud.google.com/apis/library/searchconsole.googleapis.com>
- <https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com>

## Step 3 — Google Auth Platform

<https://console.cloud.google.com/auth/overview> → **Get started**.

> This page **replaced** the old "APIs & Services → OAuth consent screen". Nearly every
> guide online still describes that old page. It no longer exists. Biggest source of
> confusion in 2026.

## Step 4 — Branding

<https://console.cloud.google.com/auth/branding> — App name `PepCodex Analytics`, your own
email for support + developer contact. Nothing here is public for a self-use app.

## Step 5 — Audience — **this step decides if the pipeline survives a week**

<https://console.cloud.google.com/auth/audience>

- **If "Internal" is offered → choose Internal.** Done. No verification, no user cap,
  **no 7-day token expiry.**
- **If only "External"** → choose it, add your own email under **Test users**, then
  **click PUBLISH APP** so status reads *In production*.

> **Do not leave it on "Testing".** Google issues refresh tokens that expire in **7 days**
> for External+Testing apps requesting non-basic scopes. Everything works beautifully for
> a week, then dies every Monday with `invalid_grant`. The 7-day rule keys off *publishing
> status*, not verification — an unverified production app is fine.

## Step 6 — Data Access (scopes)

<https://console.cloud.google.com/auth/scopes> → **ADD OR REMOVE SCOPES** → paste both into
the manual-entry box → Add to table → Update:

```
https://www.googleapis.com/auth/webmasters.readonly
https://www.googleapis.com/auth/analytics.readonly
```

## Step 7 — Create the client

<https://console.cloud.google.com/auth/clients> → **CREATE CLIENT** →
Application type = **DESKTOP APP** → name `pepcodex-gcloud` → CREATE.

> Must be **Desktop app**, not Web application. gcloud completes login on a
> `http://localhost:8085/` loopback, which Desktop clients allow implicitly and Web
> clients reject with `redirect_uri_mismatch`.

## Step 8 — Download the JSON immediately

Click **DOWNLOAD JSON** *on that dialog*. Since mid-2025 Google shows the client secret
**exactly once**; afterwards only the last four characters are visible.

Then, in PowerShell:

```powershell
New-Item -ItemType Directory -Force C:\Users\manci\.gcp
```

Move the downloaded `client_secret_*.json` to `C:\Users\manci\.gcp\pepcodex-oauth-client.json`.

> **Outside OneDrive, deliberately.** `.gitignore` stops git; it does not stop OneDrive
> from syncing a secret to the cloud.

## Step 9 — Log in

One line, quotes included:

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login --client-id-file="C:\Users\manci\.gcp\pepcodex-oauth-client.json" --scopes="https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/userinfo.email"
```

**Note `cloud-platform` is deliberately absent.** You don't need it (neither API is a Cloud
API), and including it drags the credential under **Google Cloud session control** — a
16-hour default reauth clock on Workspace accounts that forces an interactive login roughly
daily and silently breaks headless runs. Omit the scope, dodge the subsystem entirely.

**"Google hasn't verified this app" is EXPECTED** — it's your own app. Click **Advanced** →
**Go to PepCodex Analytics (unsafe)**. This is a completely different screen from the
"This app is blocked" page you hit before.

### PowerShell 5.1 comma trap (tested on this machine)

`--scopes="a,b"` → one argument, correct. `--scopes=a, b` → **splits into two arguments**.
Building the list from a PowerShell array → joined with spaces, also broken.
**Rule:** wrap the whole value in double quotes, zero spaces near any comma, one line.

## Step 10 — Verify the token really carries the scopes

```powershell
$g = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"; $t = & $g auth application-default print-access-token; Invoke-RestMethod "https://oauth2.googleapis.com/tokeninfo?access_token=$t" | Format-List
```

The `scope` field **must** list both `webmasters.readonly` and `analytics.readonly`. If it
comes back Cloud-only or empty, stop — no downstream IAM work will fix it.

## Step 11 — Then tell Claude

Claude runs `npm run gsc:whoami` (confirms *which* account), then `npm run gsc:sites`
(reveals what the two properties actually are), then `npm run fetch:search`.

Claude also needs the **GA4 numeric Property ID** — Analytics → Admin → Property settings
→ top right, e.g. `421234567`. Not `G-1M56CNL8CK`.

---

## Gotchas worth knowing

**Quota project.** With `--client-id-file`, gcloud does *not* write one, and the project
owning the client ID is used for billing/quota — so you normally don't need it. If a client
complains, **don't** run `set-quota-project` (it needs the `cloud-platform` scope we
dropped). Hand-add to `%APPDATA%\gcloud\application_default_credentials.json`:
`"quota_project_id": "YOUR_PROJECT_ID",` — save as UTF-8 **without BOM**.

**Cloud project permissions grant nothing in GSC/GA4.** They're separate ACL systems.
Verify the account from Step 10 appears in Search Console → Settings → Users and
permissions (both properties) and GA4 → Admin → Property access management.

**Never set `GOOGLE_APPLICATION_CREDENTIALS`** — it overrides ADC and breaks both clients.

**Don't use `gcloud --impersonate-service-account --scopes=...`.** It's Google's other
documented remedy and it is **broken here**: scopes aren't stored for impersonated SAs, so
gcloud exits 0 having minted a Cloud-only token and GA4 then 403s. Node's
`google-auth-library` can't even parse the resulting ADC format. Tutorials showing this are
Python.

**Six-month dormancy** revokes unused refresh tokens and auto-deletes idle OAuth clients.
A weekly pipeline is safe.

## If Step 9 still fails

| What you see | Meaning |
|---|---|
| `Error 400: admin_policy_enforced` | *Now* it's a real Workspace block. admin.google.com → Security → Access and data control → API controls → tick **Trust internal apps**, or add your client ID as Trusted (search by full client ID — name search won't find it). |
| "This app is blocked" again | Scopes didn't apply — confirm `--client-id-file` path is correct and the file is your Desktop client. |
| Publishing refused on External | Use a personal @gmail account added as a user on both properties — consumer accounts have no admin layer and personal-use apps under 100 users are exempt from verification. |
| `redirect_uri_mismatch` | Client was created as Web app. Redo Step 7 as **Desktop app**. |
