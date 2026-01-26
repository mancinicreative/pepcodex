# Pharmacology & Biology Databases

Comprehensive guide to pharmacology, protein, and pathway databases for peptide research.

---

## DrugBank

**URL:** https://go.drugbank.com
**API:** https://docs.drugbank.com/v1/
**Trust:** 5/5 | **Access:** Free (research), commercial license for extensive use
**Coverage:** 15K+ drugs including peptides and nutraceuticals

### What It Is
Comprehensive drug database with detailed "drug cards" containing chemical data, mechanisms, targets, interactions, PK/ADME, and literature references. Covers FDA-approved, experimental, and some nutraceuticals.

### Key Information Types
- Chemical structure and properties
- Mechanism of action
- Drug targets (proteins/receptors)
- Pharmacokinetics (ADME)
- Drug-drug interactions
- Adverse effects
- Clinical trials
- Literature references

### Example Searches
```
Semaglutide → Target: GLP-1R, full PK data, interactions
Tirzepatide → Dual GIP/GLP-1 mechanism
Resveratrol → Nutraceutical entry with targets
BPC-157 → Check experimental compounds
Insulin glargine → Peptide drug profile
```

### Peptide-Specific Data
- Peptide sequence information
- Post-translational modifications
- Receptor binding data
- Half-life and clearance
- Formulation details

### Tips
- Check "Targets" section for mechanism
- "Interactions" tab for safety
- Filter by approval status
- Use structured data downloads for analysis
- Cross-reference targets with UniProt

### Trust Rationale
Expert-curated with literature cross-references. Widely used in bioinformatics and drug discovery. Reliable and comprehensive, though nutraceutical entries may be less detailed.

---

## IUPHAR/BPS Guide to Pharmacology

**URL:** https://www.guidetopharmacology.org
**API:** https://www.guidetopharmacology.org/webServices.jsp
**Trust:** 5/5 | **Access:** Free
**Coverage:** 3K+ targets, 11K+ ligands

### What It Is
Expert-curated database of drug targets and ligands maintained by International Union of Basic and Clinical Pharmacology. Gold standard for receptor/ligand pharmacology.

### Database Structure
- **Targets:** Receptors, ion channels, enzymes, transporters
- **Ligands:** Drugs, peptides, natural products, synthetic compounds
- **Interactions:** Binding affinities, functional data

### Ligand Search Examples
```
melanotan → MC1/MC4 receptor data
GLP-1 → All GLP-1 receptor agonists
ghrelin → GHSR ligand information
BPC-157 → Check ligand entry
curcumin → Target proteins
```

### Target Search Examples
```
GLP-1 receptor → All agonists, antagonists, binding data
Melanocortin receptors → Full family overview
Growth hormone secretagogue receptor → Ghrelin mimetics
```

### Key Data Fields
- Binding affinity (Ki, Kd, IC50, EC50)
- Selectivity profiles
- Approved drug status
- Key references
- Clinical information

### Tips
- Use "Ligand Activity" for quantitative data
- Check "Selectivity" for off-target effects
- "Immunopharmacology" section for immune-related peptides
- Download data tables for analysis
- References link to primary literature

### Trust Rationale
Expert-reviewed, regularly updated, maintained by IUPHAR. Trusted pharmacology authority with high accuracy for target/ligand data.

---

## UniProt

**URL:** https://www.uniprot.org
**API:** https://www.uniprot.org/help/api
**Trust:** 5/5 | **Access:** Free
**Coverage:** 250M+ protein sequences

### What It Is
Universal protein database with sequences, functions, and annotations. Essential for understanding peptide targets, endogenous peptides, and protein biology.

### Database Sections
- **Swiss-Prot:** Manually curated, reviewed (high confidence)
- **TrEMBL:** Automatically annotated (broader coverage)

### Key Information Types
- Protein sequence
- Function description
- Subcellular location
- Tissue expression
- Post-translational modifications
- Protein-protein interactions
- Disease associations
- 3D structure links

### Example Searches
```
# Peptide hormones
Oxytocin human → OXT_HUMAN entry
Insulin human → Full sequence, processing, variants
Ghrelin → GHRL_HUMAN, preproghrelin processing

# Peptide targets
GLP-1 receptor → GLP1R_HUMAN, ligand binding info
Melanocortin 4 receptor → MC4R_HUMAN

# Enzymes
ACE2 → Structure, function, SARS-CoV-2 binding
DPP4 → Incretins degradation enzyme
```

### Tips
- Prefer Swiss-Prot (reviewed) entries
- Check "Function" and "Pathology" sections
- Use BLAST for sequence similarity
- Cross-reference to pathways (KEGG, Reactome)
- "Expression" tab for tissue distribution

### Trust Rationale
Gold-standard protein resource, manually curated (Swiss-Prot). Very reliable for biological mechanism context.

---

## PubChem

**URL:** https://pubchem.ncbi.nlm.nih.gov
**API:** https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest
**Trust:** 5/5 | **Access:** Free
**Coverage:** 100M+ compounds, 1M+ bioassays

### What It Is
NIH mega-database of chemical information. Contains structures, properties, bioactivity data, and literature links for small molecules and some peptides.

### Key Sections
- **Compound:** Chemical structures and properties
- **Substance:** Depositor-submitted records
- **BioAssay:** Biological activity data
- **Protein:** Target information
- **Gene:** Genomic context

### Example Searches
```
curcumin → CID 969516, assays, papers
resveratrol → Bioactivity across assays
Ala-Glu-Asp-Gly → Peptide sequence search
GHK-Cu → Copper peptide complex
```

### Bioassay Data
- Activity outcomes (active/inactive)
- Dose-response curves
- Target information
- Assay descriptions
- Source references

### Tips
- Check "BioAssay" tab for activity data
- "Literature" section links to papers
- Use "Similar Compounds" for analogs
- Filter assays by target or activity type
- Download SDF files for structures

### Trust Rationale
NIH-managed, integrates data from hundreds of sources. Cross-verified with literature links. Trustworthy but verify assay results with source publications.

---

## KEGG

**URL:** https://www.genome.jp/kegg
**Trust:** 4/5 | **Access:** Free (academic, API requires license)
**Coverage:** Pathways, compounds, reactions, diseases

### What It Is
Kyoto Encyclopedia of Genes and Genomes. Integrated database of pathways, showing how molecules interact in biological systems.

### Key Databases
- **PATHWAY:** Metabolic and signaling maps
- **COMPOUND:** Small molecules
- **DRUG:** Pharmaceutical compounds
- **DISEASE:** Disease pathways
- **GENES:** Gene catalogs

### Pathway Examples
```
Insulin signaling pathway → hsa04910
GLP-1 secretion → Related to incretin pathways
Growth hormone signaling → hsa04935
Longevity regulating pathway → hsa04211
mTOR signaling → hsa04150
```

### Tips
- Search compound → find which pathways
- Cross-reference UniProt → KEGG for pathway context
- Click pathway nodes for detailed info
- Download pathway images for figures
- Use for mechanism visualization

### Trust Rationale
Curated by experts, widely used in research. High quality but updates may lag for new interactions. Excellent for pathway context.

---

## Reactome

**URL:** https://reactome.org
**API:** https://reactome.org/dev
**Trust:** 5/5 | **Access:** Free
**Coverage:** 15K+ human pathways

### What It Is
Curated, peer-reviewed pathway database. More detailed than KEGG for human biology, with literature citations for each reaction.

### Unique Features
- Every reaction has literature support
- Detailed reaction mechanisms
- Cross-species comparison
- Pathway analysis tools
- Disease annotations

### Example Searches
```
Insulin receptor signaling → Detailed cascade
GLP-1 receptor → Signaling events
Telomere maintenance → Relevant to bioregulators
Cellular senescence → Aging pathways
```

### Tips
- Use "Analyze" tool for gene/protein lists
- Check "Literature" for each reaction
- Compare human vs model organisms
- Export diagrams for publications

### Trust Rationale
Peer-reviewed, literature-backed. More rigorous than KEGG. Excellent for detailed mechanism exploration.

---

## STRING

**URL:** https://string-db.org
**Trust:** 4/5 | **Access:** Free
**Coverage:** Protein-protein interactions

### What It Is
Database of known and predicted protein-protein interactions. Useful for understanding peptide targets in interaction networks.

### Features
- Physical and functional interactions
- Confidence scores
- Network visualization
- Enrichment analysis
- Cross-species data

### Example Uses
```
GLP1R → Interaction partners
GHSR → Ghrelin receptor network
Telomerase → TERT interaction map
```

### Trust Rationale
Integrates multiple evidence sources (experiments, databases, text mining). Confidence scores help filter quality. Good for network context.

---

## ChEMBL

**URL:** https://www.ebi.ac.uk/chembl
**API:** https://www.ebi.ac.uk/chembl/api/data/docs
**Trust:** 5/5 | **Access:** Free
**Coverage:** 2M+ compounds, 15M+ bioactivities

### What It Is
EMBL-EBI's drug discovery database. Manually curated bioactivity data from medicinal chemistry literature.

### Key Data Types
- Compound structures
- Target binding data
- ADMET properties
- Approved drug info
- Clinical candidates

### When to Use
- Quantitative binding data
- SAR (structure-activity relationships)
- Drug discovery context
- Clinical development status

### Trust Rationale
Manually curated from literature by EMBL-EBI. High-quality bioactivity data. Excellent for drug discovery research.

---

## Human Protein Atlas

**URL:** https://www.proteinatlas.org
**Trust:** 5/5 | **Access:** Free
**Coverage:** All human proteins

### What It Is
Maps all human proteins across tissues, cells, and pathology. Essential for understanding where peptide targets are expressed.

### Sections
- **Tissue Atlas:** Protein expression by organ
- **Cell Atlas:** Subcellular localization
- **Pathology Atlas:** Cancer expression
- **Blood Atlas:** Secreted proteins
- **Brain Atlas:** CNS expression

### Example Uses
```
GLP1R → Expression: pancreas, brain, gut
MC4R → Brain-specific expression
GHR → Growth hormone receptor distribution
```

### Tips
- Check tissue expression before targeting
- Pathology atlas for cancer relevance
- Blood atlas for secreted peptides
- Validation scores indicate confidence

### Trust Rationale
Systematic experimental mapping, peer-reviewed publications. Gold standard for human protein expression data.
