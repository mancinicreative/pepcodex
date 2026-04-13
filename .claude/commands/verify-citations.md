Audit all citations in PepCodex content against RESEARCH-SOURCES.md.

Steps:
1. Read `RESEARCH-SOURCES.md` to build the authoritative source list
2. Scan all content files (`src/content/`, `src/pages/`) for citations and references
3. Cross-reference every citation against the source list
4. Report:
   - Citations that match verified sources (OK)
   - Citations with no matching source (UNVERIFIED — needs source added or citation removed)
   - Sources in RESEARCH-SOURCES.md not cited anywhere (UNUSED)
5. Flag any claims that appear to lack supporting citations entirely

CRITICAL: Never fabricate sources. If a citation can't be verified, flag it for manual review.
