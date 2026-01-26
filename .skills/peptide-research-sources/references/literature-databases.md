# Literature Databases

Comprehensive guide to biomedical literature databases for peptide and supplement research.

---

## PubMed

**URL:** https://pubmed.ncbi.nlm.nih.gov
**API:** https://www.ncbi.nlm.nih.gov/home/develop/api/
**Trust:** 5/5 | **Access:** Free | **Coverage:** 39M+ citations

### What It Is
NIH/NLM's premier biomedical index. Ideal for peer-reviewed articles on mechanisms, trials, case reports.

### Field Tags
- `[ti]` - Title | `[tiab]` - Title/abstract | `[au]` - Author
- `[pt]` - Publication type | `[mh]` - MeSH heading | `[dp]` - Date

### Example Queries
```
Epitalon telomerase human[ti]
"BPC-157"[tiab] AND wound healing
("peptide bioregulator" OR geroprotector) AND aging
semaglutide AND "randomized controlled trial"[pt]
Khavinson VKh[au] AND peptide
tirzepatide[tiab] AND 2023:2025[dp]
```

### Tips
- Filter by Article Type: RCT, Review, Meta-Analysis
- Use "Similar articles" and "Cited by" features
- MeSH Database for standardized terms
- Set up My NCBI alerts for topics

---

## Europe PMC

**URL:** https://europepmc.org
**API:** https://europepmc.org/RestfulWebService
**Trust:** 5/5 | **Access:** Free | **Coverage:** 8.8M+ full-text articles

### What It Is
EMBL-EBI platform with PubMed Central + European OA + preprints. Unique full-text search capability.

### Example Queries
```
"thymalin lifespan" IN FULLTEXT
PREPRINT:"peptide bioregulator" AND aging
"BPC-157" AND OPEN_ACCESS:Y
tirzepatide AND HAS_FULLTEXT:Y
```

### Tips
- Preprint filter catches research 6-12 months early
- Text mining features for large-scale analysis
- Citation network tools map research landscape

---

## Cochrane Library

**URL:** https://www.cochranelibrary.com
**Trust:** 5/5 | **Access:** Freemium | **Coverage:** Systematic reviews + CENTRAL trials

### What It Is
Gold standard for evidence synthesis. Cochrane Reviews + CENTRAL (2M+ trial records).

### Example Queries
```
peptide bioregulator aging (Cochrane Reviews)
"growth hormone releasing peptide" (CENTRAL Trials)
vitamin D supplementation meta-analysis
```

### Tips
- PICO search tool for structured queries
- Reviews include risk of bias assessments
- CENTRAL captures trials PubMed may miss

---

## Semantic Scholar

**URL:** https://www.semanticscholar.org
**API:** https://api.semanticscholar.org
**Trust:** 4/5 | **Access:** Free | **Coverage:** 200M+ papers

### What It Is
AI-powered search from Allen Institute. TLDR summaries, influential citation tracking, research feeds.

### Unique Features
- AI-generated paper summaries
- "Highly Influential Citations" filter
- Research Feed recommendations
- Good for mapping research landscape

---

## Embase

**URL:** https://www.embase.com
**Trust:** 5/5 | **Access:** Institutional | **Coverage:** 40M+ records

### What It Is
Premier pharmacological database. Superior drug indexing, European content, conference abstracts.

### When to Use
- Drug/pharmaceutical research
- European peptide literature
- Conference abstracts (early findings)
- Systematic reviews (complement to MEDLINE)

---

## Web of Science

**URL:** https://www.webofscience.com
**Trust:** 5/5 | **Access:** Institutional | **Coverage:** 21K+ journals

### What It Is
Premier citation index. Gold standard for impact analysis, h-index, Journal Impact Factors.

### When to Use
- Citation tracking and research impact
- Find who cites a paper
- Bibliometric analysis

---

## Scopus

**URL:** https://www.scopus.com
**Trust:** 5/5 | **Access:** Institutional | **Coverage:** 27K+ journals

### What It Is
Elsevier citation database. Broader than WoS, faster indexing, better conference coverage.

---

## OpenAlex

**URL:** https://openalex.org
**API:** https://docs.openalex.org
**Trust:** 4/5 | **Access:** Free/Open | **Coverage:** 250M+ works

### What It Is
Free, open scholarly catalog. Excellent API for programmatic access and bibliometric analysis.

### API Example
```
https://api.openalex.org/works?search=BPC-157+peptide&filter=publication_year:2020-2024
```

---

## Google Scholar

**URL:** https://scholar.google.com
**Trust:** 3/5 | **Access:** Free | **Coverage:** Broad, uncurated

### What It Is
Catch-all including theses, books, gray literature, non-English sources.

### Example Queries
```
"пептидные биорегуляторы" site:elibrary.ru
author:"Khavinson" peptide
"BPC-157" 2020..2025
"Epitalon" filetype:pdf
```

### Critical Limitations
- Indexes predatory journals - always verify publisher
- No quality filtering - includes non-peer-reviewed content
- Use for discovery, verify in authoritative sources
