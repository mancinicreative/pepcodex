# Coverage triage — 36 candidates, 2026-08-06

Input: `SUMMARY.md` + `candidates.json` from the 60-day coverage scan.
Output: a classification for all 36, plus one JSON of verified evidence per BUILD candidate in `build/`.

**Verification rule applied throughout.** Every PMID, NCT, application number and approval date in this
directory was fetched live from PubMed E-utilities, the ClinicalTrials.gov v2 API or openFDA
`/drug/drugsfda.json` during this run and confirmed to concern the compound it is attached to. Nothing
was recalled. Where a fact could not be confirmed it is written as "could not confirm", not omitted and
not guessed.

---

## Headline findings

### 1. The scanner is reading PubMed reference lists, not papers

Every paper-derived candidate on this list is an artefact of that bug, and three of them are not
compounds at all:

| Candidate | What it actually is | Proof |
|---|---|---|
| MB-231 | The **MDA-MB-231** breast cancer cell line | PMID 42372989 abstract: "…cell lines (MCF-12F, MCF-7, MDA-MB-231, U87 and MG63)…" |
| MCT-24 | A fragment of the DOI prefix `10.1158/1535-7163.MCT-24-…` (*Molecular Cancer Therapeutics*) | PMID 42375351 reference list: `doi:10.1158/1535-7163.MCT-24-0002` |
| CIR-20 | A fragment of the DOI prefix `10.1158/2326-6066.CIR-20-…` (*Cancer Immunology Research*) | PMID 42317337 reference list: `doi:10.1158/2326-6066.CIR-20-0527` |

I then checked where the *real* compound names sit inside those records. For PMID 42453410, the tokens
`octreotide`, `PEN-221` and `IL-12` are **absent from the abstract and present only in the reference
list** — a 61 KB block of cited titles and DOIs that dwarfs the 1.6 KB abstract. Same for PMID 42338763.

So the "papers" column of this scan is measuring *what a review article cites*, not what a paper is
about. That also explains why Teriparatide's two "papers" are a generic orthopaedics review and a paper
about peptide manufacturing for spaceflight, and why Exenatide's single "paper" (PMID 42357295) is
about oral **semaglutide** tablet formulation.

**Fix:** restrict the coverage scanner's text surface to `<ArticleTitle>` + `<AbstractText>` and drop
`<ReferenceList>`. Additionally reject any candidate token matching `^[A-Z]{3}-\d{2}$`-style DOI
suffixes. Until that lands, treat every paper-only candidate from this scan as unverified.

### 2. Nothing was already covered

I checked all 36 names against the `name` and `aliases` fields of all 102 dossiers in
`src/content/peptides/` and against `data/trial-match-aliases.json`. **No candidate is a missed alias
for an existing dossier.** The scan produced no false gaps, and no alias-registry fix is needed as a
result of it.

Two near-misses worth recording:
- **Octreotide** is not covered, but the `pasireotide` dossier names it as a comparator in its
  `comparators` array and in six `interactions` entries, and `src/content/comparisons/pasireotide-vs-mk-677.mdx`
  discusses it. The site currently references a compound it does not document.
- **"Glucagon-Like Peptide-1 Agonist (GLP-1)"** is a class label, and the class *concept* is already
  covered by `src/content/blog/what-are-glp1-agonists.mdx`. Nothing to build.

### 3. There is no written scope policy to judge against

`src/pages/editorial-policy.astro` defines what we *exclude* (dosing, sourcing, medical advice,
unsubstantiated claims) but never defines what counts as in-scope subject matter. `about.astro` and
`methodology.astro` use "Global Coverage" to mean international literature, not compound scope.
`.planning/PROJECT.md` says "peptide education website" and nothing narrower.

So scope here is inferred from the corpus, which is broader than "peptides": the site already publishes
small molecules (MK-677, 5-Amino-1MQ, SLU-PP-332), large proteins (follistatin ~300 aa, klotho ~1000 aa),
a tissue hydrolysate (cerebrolysin), an mRNA vaccine (mRNA-4157) and a radioligand (225Ac-DOTA-LM3).
**"Not literally a peptide" is therefore not a defensible exclusion on this site.** I have used the
corpus, not a chemistry rule, to judge scope — and flagged the two places where a real editorial
decision is owed (insulins, and somatropin as a protein).

---

## Classification — all 36

### BUILD (12)

| # | Candidate | Priority | One-line reason |
|---|---|---|---|
| 1 | **Dulaglutide** | 1 | Trulicity, BLA125469, approved 2014-09-18; the site covers ten other GLP-1-family compounds and not this one. |
| 2 | **Octreotide** | 2 | Approved since 1988 (NDA019667) and named as the primary comparator on our own pasireotide page, with no page of its own. |
| 3 | **Exenatide** | 3 | First-in-class GLP-1 RA; all Bydureon applications and one Byetta application show Discontinued in openFDA — a genuine regulatory-status story. |
| 4 | **Teriparatide** | 4 | rhPTH(1-34), Forteo NDA021318 approved 2002-11-26; opens a bone/osteoanabolic category the site has zero coverage of. |
| 5 | **Abaloparatide** | 5 | Tymlos NDA208743 approved 2017-04-28; natural comparison partner for teriparatide, strong RCT + network-meta base. |
| 6 | **Terlipressin** | 6 | Terlivaz NDA022231 approved 2022-09-14; clean pivotal NEJM RCT plus a live safety controversy. |
| 7 | **Goserelin** | 7 | Zoladex NDA019726 approved 1989-12-29; most-studied GnRH agonist, and the site has no GnRH agonist at all. |
| 8 | **Triptorelin** | 8 | Trelstar NDA020715 approved 2000-06-15; two JAMA fertility-preservation trials that openly contradict a third. |
| 9 | **Vasopressin** | 9 | Endogenous nonapeptide, Vasostrict NDA204485 approved 2014-04-17 plus many generics; parent of terlipressin. |
| 10 | **Somatropin** | 10 | The hormone all nine of our GH-secretagogue dossiers are implicitly about; multiple BLAs verified. **Protein — see scope note.** |
| 11 | **Histrelin** | 11 | Supprelin LA NDA022058 approved 2007-05-03; real drug but evidence is single-arm phase 3, no RCTs. |
| 12 | **Buserelin** | 12 | Real GnRH agonist with a substantial RCT literature but **no US approval found in openFDA**; literature heavily contaminated with veterinary studies. |

Full evidence per candidate: `build/<slug>.json` — 10–14 verified PMIDs each with role labels,
drug-matched NCTs, fetched openFDA applications, and an explicit negative/null-findings section.

### WATCH (5) — real, too early for a dossier

| Candidate | Why WATCH | Verified state |
|---|---|---|
| **Ribupatide** | GLP-1/GIP dual agonist for obesity, Kailera Therapeutics | **Zero PubMed records** under `ribupatide`, `KAI-9531`, `HRS9531` or `HRS-9531`. Five registered trials, four PHASE3 (NCT07284979, NCT07284901, NCT07284875, NCT07709910) all RECRUITING or NOT_YET_RECRUITING, plus PHASE2 NCT07458269. No openFDA record. Revisit when the phase 2 reads out. |
| **Olatorepatide** | HS-20094, Hansoh, licensed to Regeneron | **Zero PubMed records** under `olatorepatide`, `HS-20094` or `HS20094`. Two PHASE2 trials (NCT07431086 ACTIVE_NOT_RECRUITING, NCT07685808 NOT_YET_RECRUITING). No openFDA record. |
| **Zendusortide** | TH1902, sortilin-directed peptide–docetaxel conjugate, Theratechnologies | Six real preclinical/mechanism papers verified (PMIDs 34314556, 35454785, 36145658, 38482021, 38482002, 42425329). One trial only: **NCT04706962**, PHASE1, ACTIVE_NOT_RECRUITING. No published human efficacy. Note: the site already covers tesamorelin, from the same sponsor. |
| **PEN-221** | SSTR2-targeted maytansinoid peptide–drug conjugate | Two direct discovery papers verified (PMID 30735385 *J Med Chem*, PMID 31649014 *Mol Cancer Ther*). One trial: **NCT02936323**, PHASE1/PHASE2, COMPLETED, n=89, Tarveda Therapeutics. Confirm the programme is still alive before investing. |
| **MUC1 Peptide-Poly-ICLC Vaccine** | NCI-sponsored cancer-prevention vaccine construct | Two real PHASE1/PHASE2 trials (NCT03300817, NCT02134925), intervention string matches exactly. Not an INN-named compound; would need a construct-level page. |

### OUT OF SCOPE (19)

**Scanner artefacts (3)** — not compounds:
- **MB-231** — the MDA-MB-231 cell line.
- **MCT-24** — a *Mol Cancer Ther* DOI fragment.
- **CIR-20** — a *Cancer Immunol Res* DOI fragment.

**Class labels, not compounds (6):**
- **Peptide Vaccine**, **Neoantigen Peptide Vaccine** — the site *does* cover named neoantigen vaccines
  (mRNA-4157, EVX-01); it is the label that is out of scope, not the category.
- **Cyclotide**, **Cyclopeptide**, **Glycopeptide** — structural classes, harvested from review-article
  reference lists.
- **Glucagon-Like Peptide-1 Agonist (GLP-1)** — a drug class; already covered as a concept by
  `blog/what-are-glp1-agonists.mdx`.

**Salt-form duplicates of another candidate (2):**
- **Goserelin Acetate** — same compound as candidate #1.
- **Triptorelin Pamoate** — same compound as candidate #3.

**Not a peptide, and not corpus-adjacent (4):**
- **Phosphoinositide** — a membrane phospholipid class.
- **IL-12** — a heterodimeric cytokine protein; also a reference-list artefact here.
- **Recombinant Interferon Alfa-2b** — a 165-residue recombinant cytokine; every one of its five
  scanned trials (NCT01708941, NCT03899987, NCT02506153, NCT00569127) uses it as a background
  comparator arm in melanoma/prostate oncology, not as the compound under test.
- **Interferon beta-1a** — same reasoning; its two hits are a paediatric MS fingolimod trial
  (NCT01892722) and DisCoVeRy, the COVID-19 platform trial (NCT04315948).

**Lutetium Lu 177 Vipivotide Tetraxetan (1):**
Pluvicto / ¹⁷⁷Lu-PSMA-617. Excluded because the targeting vector is a **urea-based small molecule**
(Glu-urea-Lys, "DCL"), not a peptide backbone — confirmed from fetched abstracts PMID 42314598
("a Glu-urea-Lys (DCL) as a vector") and PMID 42192563 ("Most PSMA-targeted drugs contain a urea-based
targeting vector"). This is the opposite of the site's `225ac-dota-lm3` dossier, whose vector *is* a
somatostatin peptide. **Flagged for a decision anyway:** if the site wants radioligand-therapy coverage
for its own sake, this is the mainstream one, and the existing 225Ac-DOTA-LM3 page already sets the
precedent for the category.

**Insulins (3) — editorial decision required, see below:**
- **Insulin aspart** — rapid-acting analogue; two of its four hits are microvascular-physiology studies
  that use it as a research probe, not as therapy under test.
- **Insulin degludec** — long-acting analogue; both hits are comparator arms in icodec trials.
- **Insulin icodec** — see the scope decision below.

---

## Scope decisions owed to the owner

### A. Insulins — currently classified OUT, but insulin icodec deserves an explicit call

The site has zero insulin coverage, which reads as deliberate given how completely the GLP-1 class is
covered. I have classified all three insulins OUT on that basis. But **insulin icodec is not an ordinary
insulin**, and the facts are worth putting in front of a human:

- **Awiqli FlexTouch, BLA761326, Novo Nordisk, earliest approval 2026-03-26** — fetched from openFDA
  during this run. This is a US approval recent enough that it postdates most training data.
- A complete ONWARDS phase 3 programme is registered and COMPLETED: ONWARDS 1 (NCT04460885, n=984),
  ONWARDS 2 (NCT04770532), ONWARDS 3 (NCT04795531), ONWARDS 6 (NCT04848480), ONWARDS 9 (NCT05823948),
  plus the IcoSema combination trial COMBINE 1 (NCT05352815, n=1291) — **an insulin/semaglutide
  co-formulation**, which is the point where the insulin category and the site's core GLP-1 coverage
  stop being separable.

Recommendation: decide the insulin question once, in writing, in the editorial policy — and if the
answer is "no insulins", the IcoSema combination still needs a mention on the semaglutide page.

### B. Somatropin is a 191-residue protein

Publishing it means the site formally covers protein hormones. The corpus already contains klotho and
follistatin, so this is arguably settled by precedent — but somatropin is the highest-profile case and
also the highest-risk one for the no-dosing / no-sourcing bans, given non-medical GH use. Worth an
explicit yes/no rather than drifting into it.

---

## Top 3 to write first

Ranked on **audience value**, not on how many citations I could assemble. All three have far more
evidence than a dossier needs; volume is not the discriminator.

### 1. Octreotide — because we already cite it and cannot link to it

This is the only candidate where the gap is *internal*. The pasireotide dossier positions pasireotide
primarily by contrast with octreotide — its summary sells "30–40 fold higher affinity for SSTR1 and
SSTR5 compared to octreotide", it lists octreotide first in `comparators`, and six of its `interactions`
entries reference it. A reader who follows that thread hits nothing. Publishing octreotide closes a
dangling reference, makes the pasireotide page's central claim checkable, and unlocks an obvious
`octreotide-vs-pasireotide` comparison in a format the site already ships. It also brings 37 years of
regulatory history and a live modern storyline (NETTER-1/NETTER-2, where octreotide is the control arm
that loses to ¹⁷⁷Lu-Dotatate) — that is a story, not a data dump.

### 2. Dulaglutide — because its absence is visible to any reader of the metabolic section

The site covers semaglutide, tirzepatide, liraglutide, orforglipron, ecnoglutide, survodutide, mazdutide,
pemvidutide, retatrutide, cagrilintide, CagriSema, amycretin, MariTide, VK2735 and CT-388. Dulaglutide
is the most-prescribed GLP-1 that is missing, and it is *already inside our own pages as a comparator*
— PIONEER 10, SUSTAIN 7, SURPASS J-mono and the ecnoglutide EECOH-2 trial all use dulaglutide as the
control arm. The honest angle is a strong one and unusual for this category: **dulaglutide is the
compound the newer drugs are measured against and beat** (SUSTAIN 7, PMID 29397376; SURPASS J-mono,
PMID 35914543), while still owning one of the few GLP-1 CV outcome trials run in a majority-primary-prevention
population (REWIND, PMID 31189511). That is a genuinely useful page rather than another "how much weight
does it cause you to lose" entry.

### 3. Exenatide — because it is the correction the internet has not made

Two reasons, both about reader harm rather than completeness.

First, the Parkinson's story. The 2017 phase 2 (PMID 28781108) produced a positive signal that has been
recycled through supplement and biohacking content for eight years. The 2025 phase 3 (PMID 39919773) is
unambiguous: *"We found no evidence to support exenatide as a disease-modifying treatment for people with
Parkinson's disease."* Sites that publish GLP-1 content overwhelmingly still carry the 2017 version. A
page that lands the null result with the trial attached is real corrective value, and it fits the
site's existing freshness discipline exactly.

Second, the regulatory picture needs checking rather than reciting, and openFDA gives a genuinely
surprising answer. Fetched this run: **Bydureon (NDA022200) and Bydureon BCise (NDA209210) are both
Discontinued**, as is the original AstraZeneca Byetta application (NDA021773, approved 2005-04-28).
A second Byetta application — **NDA021919, sponsor AMYLIN, approved 2009-10-30 — is still Prescription**,
and a generic synthetic exenatide (ANDA206697, Amneal, approved 2024-11-19) is also marketed. So
"exenatide was withdrawn" and "exenatide is available as before" are both wrong, and the
extended-release form specifically is gone. That distinction is exactly what the regulatory tracker
exists for — and note that the openFDA `openfda.generic_name:"exenatide"` query returns only two of
these four applications, so the tracker must query by application number or brand name too.

**Deliberately not in the top 3:** teriparatide and abaloparatide have the cleanest evidence of anything
here and should be written as a *pair* with a comparison page — but they open a new category (bone) with
no existing internal links to benefit from, so they are the strongest fourth-and-fifth rather than a
first move.

---

## Cross-cutting cautions carried into `build/*.json`

- **GnRH agonists share trial arms.** Goserelin, triptorelin, buserelin, histrelin and leuprolide appear
  together in the intervention lists of NCT04513717, NCT05050084 and NCT06378866. Confirm which compound
  a result belongs to before attributing it — the same failure mode as the REDEFINE acronym-stem problem
  already in this repo's lessons.
- **Buserelin's literature is partly veterinary.** PMIDs 11393219 (mares), 10734431 (Holstein cows),
  14629665 (bitches), 11393215 (horse and pony mares) and 35410205 (pigs and cows) all surfaced from
  human-intent queries. Check species on every buserelin citation.
- **Long-acting GH analogues are different molecules.** Somatrogon, somapacitan, lonapegsomatropin and
  somavaratan are not somatropin. Counting their trials as somatropin evidence would repeat the
  parent/derivative error documented in `.claude/rules/lessons.md`.
- **Selepressin is not vasopressin** (PMID 28807037 surfaced in the vasopressin screen).
- **Estimand discipline** applies to dulaglutide and exenatide weight/HbA1c figures exactly as it did to
  SURMOUNT-1 and REDEFINE-1.
- **Control-arm results are not efficacy evidence.** Octreotide, dulaglutide and somatropin all appear
  overwhelmingly as comparators in trials of *other* drugs.

## Things I could not confirm

- Buserelin's marketing authorisation status outside the US. openFDA covers US applications only; no
  non-US regulator was queried in this run.
- Whether the omission of insulins and interferons from the site is a deliberate editorial policy. There
  is no written scope statement anywhere in the repo; the pattern is consistent with deliberate exclusion
  but I have no document that says so.
- Whether the PEN-221 programme is still active. Tarveda Therapeutics is the registered sponsor of the
  single trial; I did not verify the company's current status.
- The current label text (boxed warnings, duration limits) for teriparatide, terlipressin and somatropin.
  These change, and I queried `/drug/drugsfda.json` for approvals, not `/drug/label.json` for label text.
  Anyone writing these pages must fetch the current label before making a warning claim.
