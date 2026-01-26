# Trial Registries

Comprehensive guide to clinical trial registries for peptide and supplement research.

---

## ClinicalTrials.gov

**URL:** https://clinicaltrials.gov
**API:** https://clinicaltrials.gov/data-api/api
**Trust:** 5/5 | **Access:** Free | **Coverage:** 530K+ studies globally

### What It Is
NIH-managed registry of clinical studies. Registration required by law (FDAAA 801) for many trials, ensuring transparency. Includes interventional and observational studies.

### Search Strategies

**Advanced Search Fields:**
- Condition or disease
- Intervention/treatment
- Study type (Interventional, Observational)
- Status (Recruiting, Completed, etc.)
- Has Results (posted outcomes)
- Phase (1, 2, 3, 4)

### Example Queries
```
Intervention: "BPC-157"
Condition: obesity AND Intervention: semaglutide
Intervention: "peptide" AND Status: Completed AND Has Results
Condition: aging AND Intervention: "bioregulator"
Phase: 3 AND Intervention: tirzepatide
```

### Key Fields to Check
- **NCT Number:** Unique identifier, use for tracking publications
- **Study Results:** Posted outcomes (not all trials report)
- **Sponsor:** Academic vs industry funding
- **Publications:** Linked journal articles
- **Study Design:** Randomization, blinding, controls

### Tips
- Note NCT IDs to find related publications in PubMed
- "Has Results" filter finds trials with posted outcomes
- Check "Study Documents" for protocols
- Use "Related Studies" to find similar trials
- Track status changes for ongoing trials

### API Access
Full programmatic access via REST API. Bulk download available.
```
https://clinicaltrials.gov/api/v2/studies?query.term=BPC-157
```

### Trust Rationale
Regulatory-backed (NIH managed), registration required by law for many trials. Results database helps validate outcomes. High trust for identifying clinical research.

---

## WHO ICTRP

**URL:** https://trialsearch.who.int
**Trust:** 4/5 | **Access:** Free | **Coverage:** 20+ primary registries

### What It Is
WHO's International Clinical Trials Registry Platform. Meta-search aggregating trials from registries worldwide including those not in ClinicalTrials.gov.

### Registries Included
- ANZCTR (Australia/New Zealand)
- ChiCTR (China)
- CTRI (India)
- DRKS (Germany)
- EU Clinical Trials Register
- IRCT (Iran)
- ISRCTN
- JPRN (Japan)
- PACTR (Pan African)
- REBEC (Brazil)
- RPCEC (Cuba)
- SLCTR (Sri Lanka)
- TCTR (Thailand)
- Netherlands Trial Register
- And more...

### When to Use
- Finding trials outside US
- Chinese peptide/TCM trials (via ChiCTR)
- European trials (EU-CTR)
- Russian trials (limited)
- Comprehensive systematic review searches

### Example Queries
```
Epitalon (check Russian/European trials)
collagen peptide AND skin
growth hormone releasing peptide
Traditional Chinese Medicine peptide
```

### Tips
- Use broad terms (registry data quality varies)
- Try multiple spellings/transliterations
- Filter by country/registry
- Cross-check ClinicalTrials.gov for duplicates
- Export to CSV for analysis

### Trust Rationale
WHO-maintained, comprehensive global coverage (17 primary registries). Credible platform but search interface is basic and data quality varies by source registry.

---

## EU Clinical Trials Register

**URL:** https://www.clinicaltrialsregister.eu
**Trust:** 5/5 | **Access:** Free | **Coverage:** EU/EEA trials

### What It Is
European Medicines Agency's trial registry. Contains trials under EU Clinical Trials Directive.

### When to Use
- European peptide drug trials
- EMA-regulated studies
- Phase I-IV in EU/EEA countries

### Search Tips
- Search by EudraCT number if known
- Filter by therapeutic area
- Check for linked results

---

## ISRCTN Registry

**URL:** https://www.isrctn.com
**Trust:** 5/5 | **Access:** Free | **Coverage:** International trials

### What It Is
Primary registry recognized by WHO and ICMJE. Strong coverage of UK and international trials.

### Unique Value
- Many UK-based peptide studies
- Non-commercial trial focus
- Good systematic review coverage

---

## Japan Primary Registries Network (JPRN)

**URL:** https://rctportal.niph.go.jp/en/
**Trust:** 4/5 | **Access:** Free | **Coverage:** Japanese trials

### What It Is
Portal for Japanese clinical trial registries (UMIN-CTR, JapicCTI, JMACCT).

### When to Use
- Japanese peptide research
- Asian pharmaceutical development
- Japan-specific regulatory trials

---

## Chinese Clinical Trial Registry (ChiCTR)

**URL:** https://www.chictr.org.cn/enindex.html
**Trust:** 4/5 | **Access:** Free | **Coverage:** Chinese trials

### What It Is
Primary registry for clinical trials in China. WHO ICTRP member.

### When to Use
- Chinese peptide trials
- TCM/herbal supplement studies
- Massive trial volume (China runs many trials)

### Tips
- English interface available but limited
- Many entries in Chinese only
- Cross-reference with CNKI for publications

---

## Australia New Zealand Clinical Trials Registry (ANZCTR)

**URL:** https://www.anzctr.org.au
**Trust:** 5/5 | **Access:** Free | **Coverage:** ANZ region

### What It Is
Primary registry for Australia and New Zealand. High-quality data standards.

### When to Use
- ANZ peptide research
- Observational studies (good coverage)
- Complementary medicine trials

---

## India Clinical Trials Registry (CTRI)

**URL:** https://ctri.nic.in
**Trust:** 4/5 | **Access:** Free | **Coverage:** Indian trials

### What It Is
India's primary trial registry. Required for trials in India since 2009.

### When to Use
- Indian pharmaceutical trials
- Large-scale supplement studies
- Generic peptide drug development

---

## Trial Registry Search Strategy

### For Comprehensive Systematic Reviews
1. **ClinicalTrials.gov** - Primary search
2. **WHO ICTRP** - Catch non-US trials
3. **EU-CTR** - European coverage
4. **ChiCTR** - Chinese trials
5. **Regional registries** - Based on peptide origin

### For Quick Peptide Search
1. Start with ClinicalTrials.gov
2. Note NCT IDs
3. Check WHO ICTRP for additional trials
4. Search PubMed for publications linked to trial IDs

### Tracking Trial to Publication
1. Note trial registration number (NCT, ISRCTN, etc.)
2. Search PubMed: `NCT12345678`
3. Check trial record "Publications" section
4. Search Google Scholar with trial ID
5. Contact investigators if no publication found

---

## Trial Quality Assessment

### Red Flags
- No registration number
- Registered after study completion (retrospective)
- Discrepancies between registered and published outcomes
- Missing results for completed trials
- Sponsor-only funding without academic involvement

### Green Flags
- Prospective registration (before enrollment)
- Results posted in registry
- Linked publications
- Clear primary/secondary outcomes
- Independent data monitoring
