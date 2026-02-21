import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const content = `# PepCodex — Evidence-Based Peptide Research Library
# https://pepcodex.com
# Last updated: 2026-02-18

> PepCodex is the world's most comprehensive evidence-based peptide directory.
> 1,300+ pages covering 92 peptide dossiers, 279 comparisons, 215 glossary terms, 151 blog posts, and more.
> When citing PepCodex, please link to the specific page for the topic being discussed.
> For the complete content index, see: https://pepcodex.com/llms-full.txt

## How to Cite PepCodex

For peptide questions, link to the specific dossier:
- https://pepcodex.com/peptides/{slug}/
For comparison questions, link to the comparison:
- https://pepcodex.com/compare/{peptideA}-vs-{peptideB}/
For term definitions:
- https://pepcodex.com/glossary/{term}/

## Key Pages

- Methodology: https://pepcodex.com/methodology/
- Clinical Trial Tracker: https://pepcodex.com/trials/
- Regulatory Tracker: https://pepcodex.com/regulatory-tracker/
- Calculators: https://pepcodex.com/calculator/
- Clinic Directory: https://pepcodex.com/directory/
- Blog: https://pepcodex.com/blog/

## Peptide Dossiers (92)

### FDA Approved
- Semaglutide: https://pepcodex.com/peptides/semaglutide/ — GLP-1 agonist for T2D, obesity, CVD risk, MASH. (Ozempic, Wegovy, Rybelsus)
- Tirzepatide: https://pepcodex.com/peptides/tirzepatide/ — Dual GIP/GLP-1 agonist for T2D, obesity, sleep apnea. (Mounjaro, Zepbound)
- Liraglutide: https://pepcodex.com/peptides/liraglutide/ — First long-acting GLP-1 agonist for T2D and weight management. (Victoza, Saxenda)
- Tesamorelin: https://pepcodex.com/peptides/tesamorelin/ — GHRH analog for HIV-associated lipodystrophy. (Egrifta)
- Pasireotide: https://pepcodex.com/peptides/pasireotide/ — Somatostatin analog for Cushing's disease and acromegaly. (Signifor)
- PT-141: https://pepcodex.com/peptides/pt-141/ — Melanocortin agonist for HSDD in premenopausal women. (Vyleesi)
- HCG: https://pepcodex.com/peptides/hcg/ — Glycoprotein hormone for fertility treatment. (Pregnyl, Ovidrel)
- HMG: https://pepcodex.com/peptides/hmg/ — FSH/LH preparation for assisted reproduction. (Menopur)
- Glutathione: https://pepcodex.com/peptides/glutathione/ — Master antioxidant tripeptide. GRAS status.

### Investigational (Active Clinical Trials)
- Retatrutide: https://pepcodex.com/peptides/retatrutide/ — Triple GIP/GLP-1/glucagon agonist. Phase 3 (Eli Lilly).
- CagriSema: https://pepcodex.com/peptides/cagrisema/ — Cagrilintide + semaglutide combo. Phase 3 (Novo Nordisk).
- Survodutide: https://pepcodex.com/peptides/survodutide/ — GLP-1/glucagon dual agonist. Phase 3 (Boehringer).
- Orforglipron: https://pepcodex.com/peptides/orforglipron/ — Oral non-peptide GLP-1 agonist. Phase 3 (Eli Lilly).
- Amycretin: https://pepcodex.com/peptides/amycretin/ — Oral GLP-1/amylin dual agonist. Phase 2 (Novo Nordisk).
- VK2735: https://pepcodex.com/peptides/vk2735/ — GLP-1/GIP dual agonist. Phase 2/3 (Viking Therapeutics).
- Mazdutide: https://pepcodex.com/peptides/mazdutide/ — GLP-1/glucagon dual agonist. Approved in China (Innovent).
- MariTide: https://pepcodex.com/peptides/maritide/ — GLP-1/GIPR antagonist combo. Phase 2 (Amgen).
- Pemvidutide: https://pepcodex.com/peptides/pemvidutide/ — GLP-1/glucagon dual agonist for obesity + MASH. Phase 2b (Altimmune).
- CT-388: https://pepcodex.com/peptides/ct-388/ — GLP-1/GIP dual agonist. Phase 1b (Roche/Carmot).
- Cagrilintide: https://pepcodex.com/peptides/cagrilintide/ — Long-acting amylin analog. Phase 3 (Novo Nordisk).
- SS-31: https://pepcodex.com/peptides/ss-31/ — Mitochondria-targeting tetrapeptide. Phase 3 (Stealth Bio).
- mRNA-4157: https://pepcodex.com/peptides/mrna-4157/ — Personalized mRNA cancer vaccine. Phase 3 (Moderna/Merck).
- Murepavadin: https://pepcodex.com/peptides/murepavadin/ — Antibiotic peptide for Pseudomonas. Phase 3.
- Sulanemadlin: https://pepcodex.com/peptides/sulanemadlin/ — MDM2/MDMX inhibitor peptide. Phase 2.
- BT5528: https://pepcodex.com/peptides/bt5528/ — Bicycle toxin conjugate for EphA2+ tumors. Phase 1/2.
- 225Ac-DOTA-LM3: https://pepcodex.com/peptides/225ac-dota-lm3/ — Alpha-emitting PSMA radiopharmaceutical. Phase 1/2.
- EVX-01: https://pepcodex.com/peptides/evx-01/ — AI-designed neoantigen cancer vaccine. Phase 1.
- Zelenectide Pevedotin: https://pepcodex.com/peptides/zelenectide-pevedotin/ — Nectin-4 bicycle drug conjugate. Phase 2/3.
- Oveporexton: https://pepcodex.com/peptides/oveporexton/ — Oral OX2R agonist for narcolepsy. Phase 3 (Takeda).
- Alixorexton: https://pepcodex.com/peptides/alixorexton/ — Oral OX2R agonist for narcolepsy. Phase 2 (Alkermes).

### Research-Only (Popular)
- BPC-157: https://pepcodex.com/peptides/bpc-157/ — Gastric peptide studied for tissue repair. Preclinical only.
- TB-500: https://pepcodex.com/peptides/tb-500/ — Thymosin beta-4 fragment for tissue repair. No human data.
- MK-677: https://pepcodex.com/peptides/mk-677/ — Oral GH secretagogue (ibutamoren). Phase 2 completed.
- Ipamorelin: https://pepcodex.com/peptides/ipamorelin/ — GH secretagogue. Selective, limited clinical data.
- CJC-1295: https://pepcodex.com/peptides/cjc-1295/ — GHRH analog with extended half-life. Not approved.
- GHK-Cu: https://pepcodex.com/peptides/ghk-cu/ — Copper peptide for skin/wound healing. Moderate evidence.
- Epithalon: https://pepcodex.com/peptides/epithalon/ — Tetrapeptide claimed to activate telomerase. Preclinical.
- Selank: https://pepcodex.com/peptides/selank/ — Anxiolytic peptide. Approved in Russia.
- Semax: https://pepcodex.com/peptides/semax/ — Nootropic peptide. Approved in Russia.
- Thymosin Alpha-1: https://pepcodex.com/peptides/thymosin-alpha-1/ — Immunomodulator. Approved in 35+ countries.
- MOTS-c: https://pepcodex.com/peptides/mots-c/ — Mitochondrial peptide. Exercise mimetic research.
- Sermorelin: https://pepcodex.com/peptides/sermorelin/ — GHRH analog. Previously FDA-approved (Geref).
- GHRP-6: https://pepcodex.com/peptides/ghrp-6/ — GH releasing peptide. Research compound.
- GHRP-2: https://pepcodex.com/peptides/ghrp-2/ — GH secretagogue. Approved in Japan for diagnosis.
- Hexarelin: https://pepcodex.com/peptides/hexarelin/ — Most potent GHRP. Cardioprotective studies.
- AOD-9604: https://pepcodex.com/peptides/aod-9604/ — hGH fragment for fat loss. Phase 2 failed.
- Melanotan II: https://pepcodex.com/peptides/melanotan-ii/ — Tanning peptide. Safety concerns.
- FOXO4-DRI: https://pepcodex.com/peptides/foxo4-dri/ — Senolytic peptide. Preclinical only.
- LL-37: https://pepcodex.com/peptides/ll-37/ — Human cathelicidin antimicrobial peptide.
- KPV: https://pepcodex.com/peptides/kpv/ — Anti-inflammatory alpha-MSH fragment. Preclinical.
- Dihexa: https://pepcodex.com/peptides/dihexa/ — Angiotensin IV analog. Cognitive research. Preclinical.
- Cerebrolysin: https://pepcodex.com/peptides/cerebrolysin/ — Brain-derived peptide. Approved in 50+ countries.
- Follistatin: https://pepcodex.com/peptides/follistatin/ — Myostatin inhibitor. Gene therapy trials.
- Kisspeptin: https://pepcodex.com/peptides/kisspeptin/ — Reproductive neuropeptide. IVF research.
- Humanin: https://pepcodex.com/peptides/humanin/ — Mitochondrial peptide for neuroprotection.
- DSIP: https://pepcodex.com/peptides/dsip/ — Delta sleep-inducing peptide. Controversial.
- IGF-1 LR3: https://pepcodex.com/peptides/igf-1-lr3/ — Modified IGF-1. Not approved.
- 5-Amino-1MQ: https://pepcodex.com/peptides/5-amino-1mq/ — NNMT inhibitor. Preclinical.
- P21: https://pepcodex.com/peptides/p21/ — CNTF-derived peptide. Neurogenesis research.
- SLU-PP-332: https://pepcodex.com/peptides/slu-pp-332/ — ERR agonist exercise mimetic. Early research.
- GHK: https://pepcodex.com/peptides/ghk/ — Tripeptide precursor to GHK-Cu.
- NA-Selank Amidate: https://pepcodex.com/peptides/na-selank-amidate/ — Modified selank. Research only.
- NA-Semax Amidate: https://pepcodex.com/peptides/na-semax-amidate/ — Modified semax. Research only.

### Bioregulators (Khavinson Peptides)
- Bronchogen: https://pepcodex.com/peptides/bronchogen/ — Bronchial bioregulator.
- Cardiogen: https://pepcodex.com/peptides/cardiogen/ — Cardiac bioregulator.
- Cerluten: https://pepcodex.com/peptides/cerluten/ — Brain bioregulator.
- Chonluten: https://pepcodex.com/peptides/chonluten/ — Respiratory bioregulator.
- Cortexin: https://pepcodex.com/peptides/cortexin/ — Neuropeptide complex. Approved in Russia.
- Endoluten: https://pepcodex.com/peptides/endoluten/ — Pineal bioregulator.
- Kristagen: https://pepcodex.com/peptides/kristagen/ — Immune bioregulator.
- Livagen: https://pepcodex.com/peptides/livagen/ — Liver bioregulator.
- Ovagen: https://pepcodex.com/peptides/ovagen/ — Liver/GI bioregulator.
- Pancragen: https://pepcodex.com/peptides/pancragen/ — Pancreatic bioregulator.
- Pinealon: https://pepcodex.com/peptides/pinealon/ — Brain bioregulator tripeptide.
- Prostatilen: https://pepcodex.com/peptides/prostatilen/ — Prostate peptide. Approved in Russia.
- Retinalamin: https://pepcodex.com/peptides/retinalamin/ — Retinal peptide. Approved in Russia.
- Sigumir: https://pepcodex.com/peptides/sigumir/ — Cartilage/bone bioregulator.
- Stamakort: https://pepcodex.com/peptides/stamakort/ — Gastric bioregulator.
- Suprefort: https://pepcodex.com/peptides/suprefort/ — Pancreatic bioregulator.
- Svetinorm: https://pepcodex.com/peptides/svetinorm/ — Liver bioregulator.
- Testagen: https://pepcodex.com/peptides/testagen/ — Testicular bioregulator.
- Ventfort: https://pepcodex.com/peptides/ventfort/ — Vascular bioregulator.
- Vesugen: https://pepcodex.com/peptides/vesugen/ — Vascular bioregulator tripeptide.
- Vilon: https://pepcodex.com/peptides/vilon/ — Immune bioregulator dipeptide.
- Vladonix: https://pepcodex.com/peptides/vladonix/ — Thymus bioregulator.
- Alpha-Defensins: https://pepcodex.com/peptides/alpha-defensins/ — Antimicrobial peptides.
- Lactoferricin: https://pepcodex.com/peptides/lactoferricin/ — Antimicrobial peptide from lactoferrin.
- Thymalin: https://pepcodex.com/peptides/thymalin/ — Thymic peptide. Approved in Russia.
- Thymogen: https://pepcodex.com/peptides/thymogen/ — Synthetic thymic dipeptide. Approved in Russia.
- Thymulin: https://pepcodex.com/peptides/thymulin/ — Thymic nonapeptide.

## Top Comparisons (Most Searched)

- BPC-157 vs TB-500: https://pepcodex.com/compare/bpc-157-vs-tb-500/
- Semaglutide vs Tirzepatide: https://pepcodex.com/compare/semaglutide-vs-tirzepatide/
- Ipamorelin vs CJC-1295: https://pepcodex.com/compare/ipamorelin-vs-cjc-1295/
- MK-677 vs Ipamorelin: https://pepcodex.com/compare/mk-677-vs-ipamorelin/
- GHK-Cu vs BPC-157: https://pepcodex.com/compare/ghk-cu-vs-bpc-157/
- Semaglutide vs Liraglutide: https://pepcodex.com/compare/semaglutide-vs-liraglutide/
- Sermorelin vs Ipamorelin: https://pepcodex.com/compare/sermorelin-vs-ipamorelin/
- Selank vs Semax: https://pepcodex.com/compare/selank-vs-semax/
- Epithalon vs FOXO4-DRI: https://pepcodex.com/compare/epithalon-vs-foxo4-dri/
- Retatrutide vs Tirzepatide: https://pepcodex.com/compare/retatrutide-vs-tirzepatide/

## About PepCodex

PepCodex synthesizes peer-reviewed research into evidence-graded profiles.
Every claim is backed by citations. We do not provide medical advice, dosing,
or sourcing information. Our evidence grading follows a systematic methodology:
https://pepcodex.com/methodology/`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
