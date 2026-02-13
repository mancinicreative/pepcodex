# Phase 4: Security Audit — OWASP Assessment

**Skill:** `/security-engineer`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline (retroactive)

---

## Executive Summary

PepCodex has **critical security gaps** that must be addressed before any v5.0 feature work. The site has no security headers, no rate limiting, information leakage via API, and overly permissive CORS. Current security score: **1/4 (BLOCKER)**.

---

## OWASP Top 10 Assessment

### A01:2021 — Broken Access Control

| Check | Status | Details |
|---|---|---|
| API route protection | N/A | No authenticated routes exist |
| Admin panel | N/A | No admin functionality |
| Directory traversal | N/A | Content served via Astro collections, not file system |

**Risk: LOW** — No authenticated functionality means minimal access control surface.

### A02:2021 — Cryptographic Failures

| Check | Status | Details |
|---|---|---|
| HTTPS enforcement | PARTIAL | Vercel provides HTTPS but no HSTS header forces it |
| Sensitive data in transit | OK | Beehiiv API key server-side only (`import.meta.env`) |
| Secrets in client bundle | OK | Environment variables not exposed to client |

**Risk: LOW** — Secrets are properly server-side. HSTS header would strengthen.

### A03:2021 — Injection

| Check | Status | Details |
|---|---|---|
| XSS via user input | LOW RISK | Only input is email in subscribe form |
| SQL injection | N/A | No database |
| Email injection | LOW RISK | Email validated by regex, sent to Beehiiv API |
| Content injection | N/A | All content is static markdown |

**Risk: LOW** — Minimal user input surface. Email regex validation present.

### A04:2021 — Insecure Design

| Check | Status | Details |
|---|---|---|
| Rate limiting | MISSING | `/api/subscribe` has no rate limiting |
| CSRF protection | MISSING | No CSRF tokens on form submissions |
| Bot protection | MISSING | No CAPTCHA, honeypot, or bot detection |

**Risk: HIGH** — Subscribe endpoint can be abused for email bombing or Beehiiv API quota exhaustion.

### A05:2021 — Security Misconfiguration

| Check | Status | Details |
|---|---|---|
| Security headers | MISSING | No CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| HSTS | MISSING | Not set in vercel.json or middleware |
| X-Robots-Tag | SET | Only security-adjacent header present |
| Server information | LEAKING | `/api/health` exposes `hasBeehiivKey`, `hasBeehiivPubId` |
| CORS policy | OVERLY PERMISSIVE | `Access-Control-Allow-Origin: *` on subscribe |

**Risk: CRITICAL** — No security headers at all. Health endpoint leaks configuration.

#### Missing Security Headers (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://api.beehiiv.com"
        }
      ]
    }
  ]
}
```

### A06:2021 — Vulnerable and Outdated Components

| Check | Status | Details |
|---|---|---|
| Dependency audit | UNKNOWN | No `npm audit` results available |
| Pinned versions | PARTIAL | Using `^` ranges (allows minor bumps) |
| Lock file | UNKNOWN | Package lock status not verified |

**Risk: UNKNOWN** — Needs `npm audit` run

### A07:2021 — Identification and Authentication Failures

**N/A** — No authentication system exists. If user accounts are added in v5+, this becomes relevant.

### A08:2021 — Software and Data Integrity Failures

| Check | Status | Details |
|---|---|---|
| Subresource integrity | MISSING | Google Analytics script loaded without SRI |
| Google Fonts integrity | MISSING | External CSS loaded without SRI |
| Build pipeline integrity | PARTIAL | Relies on Vercel Git integration |

**Risk: MEDIUM** — External scripts loaded without integrity verification.

### A09:2021 — Security Logging and Monitoring Failures

| Check | Status | Details |
|---|---|---|
| Error logging | PARTIAL | `console.error` in API routes (goes to Vercel logs) |
| Access logging | PARTIAL | Vercel provides basic access logs |
| Abuse detection | MISSING | No monitoring for subscribe abuse |
| Alert system | MISSING | No alerts for unusual activity |

**Risk: MEDIUM** — No proactive monitoring for abuse.

### A10:2021 — Server-Side Request Forgery (SSRF)

**N/A** — No server-side URL fetching. Beehiiv API calls are to a fixed endpoint.

---

## Vulnerability Summary

| ID | Severity | Issue | Fix Priority |
|---|---|---|---|
| SEC-001 | CRITICAL | No security headers (CSP, HSTS, X-Frame) | P0 |
| SEC-002 | HIGH | No rate limiting on `/api/subscribe` | P0 |
| SEC-003 | HIGH | `/api/health` leaks config info | P0 |
| SEC-004 | HIGH | CORS `Access-Control-Allow-Origin: *` on subscribe | P1 |
| SEC-005 | MEDIUM | No CSRF protection on forms | P1 |
| SEC-006 | MEDIUM | No SRI on external scripts (GA, Google Fonts) | P2 |
| SEC-007 | MEDIUM | No bot protection (CAPTCHA/honeypot) | P2 |
| SEC-008 | LOW | No abuse monitoring/alerting | P3 |

---

## Fix Recommendations

### P0 — Fix Immediately

**SEC-001: Add security headers to vercel.json**
Add the headers block shown above. Estimated effort: 15 minutes.

**SEC-002: Add rate limiting to subscribe endpoint**
Options:
- Vercel Edge Middleware with IP-based rate limiting
- Simple in-memory counter (resets per cold start)
- Upstash Redis rate limiter (persistent)

**SEC-003: Fix health endpoint**
Remove config exposure. Return only `{ status: 'ok', timestamp }`.

### P1 — Fix Before v5.0 Launch

**SEC-004: Restrict CORS**
Change to `Access-Control-Allow-Origin: https://pepcodex.com`

**SEC-005: Add CSRF protection**
Options:
- Double-submit cookie pattern
- Origin header validation
- Since it's a public newsletter form, origin validation is sufficient

### P2 — Address in v5.0

**SEC-006: Add SRI to external scripts**
Generate integrity hashes for GA and Google Fonts resources.

**SEC-007: Add bot protection**
Add honeypot field to newsletter form (invisible field that bots fill).

---

## Security Score

| Dimension | Score (0-4) | Notes |
|---|---|---|
| Headers/transport | 0 | No security headers at all |
| Input validation | 3 | Email regex validation present |
| Data protection | 3 | Secrets server-side, no DB |
| API security | 1 | No rate limiting, info leakage, CORS * |
| Dependency security | 2 | Minimal deps, but no audit |
| Monitoring | 1 | Basic Vercel logs only |

**Overall Security: 10/24 = 42% — BLOCKER (below 75% threshold)**

The security dimension scores **1/4** on the quality scorecard.

---

## Gate Assessment

- [x] OWASP Top 10 assessed
- [x] All vulnerabilities documented with severity
- [x] Fix recommendations provided with priority
- [ ] Security score meets Phase 4 minimum (3/4) — **FAILS**

**Phase 4 Security Gate: FAIL (BLOCKER)**
**Action Required:** SEC-001, SEC-002, SEC-003 must be fixed before v5.0 can ship.
