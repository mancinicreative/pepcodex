/**
 * Batch-add regulatoryStatus to all peptide MDX frontmatter.
 * Run: node scripts/add-regulatory-status.mjs
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PEPTIDES_DIR = path.resolve('src/content/peptides');

// FDA-approved peptides (with brand names in notes)
const approved = {
  'semaglutide': 'FDA-approved as Ozempic (T2D), Wegovy (weight management), and Rybelsus (oral T2D). Compounded versions restricted since 2024.',
  'tirzepatide': 'FDA-approved as Mounjaro (T2D) and Zepbound (weight management). Compounded versions restricted since 2024.',
  'liraglutide': 'FDA-approved as Victoza (T2D) and Saxenda (weight management).',
  'pasireotide': 'FDA-approved as Signifor for Cushing\'s disease and acromegaly.',
  'tesamorelin': 'FDA-approved as Egrifta for HIV-associated lipodystrophy.',
  'hcg': 'FDA-approved (Pregnyl, Ovidrel) for fertility treatment.',
  'hmg': 'FDA-approved (Menopur) for assisted reproduction.',
  'pt-141': 'FDA-approved as Vyleesi (bremelanotide) for hypoactive sexual desire disorder in premenopausal women.',
  'glutathione': 'Generally Recognized as Safe (GRAS). Available as dietary supplement; IV formulations used clinically.',
};

// Investigational peptides — active clinical trials
const investigational = {
  'retatrutide': 'Phase 3 clinical trials for obesity and T2D (Eli Lilly). Triple agonist (GLP-1/GIP/glucagon).',
  'survodutide': 'Phase 3 clinical trials for obesity and MASH (Boehringer Ingelheim). GLP-1/glucagon dual agonist.',
  'pemvidutide': 'Phase 2 clinical trials for obesity and MASH (Altimmune). GLP-1/glucagon dual agonist.',
  'cagrilintide': 'Phase 3 as part of CagriSema combination (Novo Nordisk). Long-acting amylin analog.',
  'cagrisema': 'Phase 3 clinical trials for obesity (Novo Nordisk). Cagrilintide + semaglutide combination.',
  'amycretin': 'Phase 2 clinical trials for obesity (Novo Nordisk). Oral GLP-1/amylin dual agonist.',
  'orforglipron': 'Phase 3 clinical trials for obesity and T2D (Eli Lilly). Oral non-peptide GLP-1 agonist.',
  'mazdutide': 'Phase 3 clinical trials for obesity and T2D (Innovent Biologics). GLP-1/glucagon dual agonist.',
  'vk2735': 'Phase 2 clinical trials for obesity (Viking Therapeutics). GLP-1/GIP dual agonist.',
  'ct-388': 'Phase 2 clinical trials for obesity (Carmot Therapeutics/Roche). GLP-1/GIP dual agonist.',
  'maritide': 'Phase 2 clinical trials for obesity (Amgen). GLP-1/GIPR antagonist combination.',
  'oveporexton': 'Phase 1 clinical trials for obesity (Novo Nordisk). Next-gen anti-obesity candidate.',
  'alixorexton': 'Phase 1 clinical trials (Novo Nordisk). Next-gen metabolic candidate.',
  'mrna-4157': 'Phase 3 clinical trials for melanoma (Moderna). Personalized mRNA cancer vaccine, used with pembrolizumab.',
  'bt5528': 'Phase 1/2 clinical trials for solid tumors (Bicycle Therapeutics). EphA2-targeting bicycle toxin conjugate.',
  'sulanemadlin': 'Phase 2 clinical trials for solid tumors. MDM2 inhibitor reactivating p53.',
  'evx-01': 'Phase 1 clinical trials for cancer (Evaxion Biotech). AI-designed personalized cancer vaccine.',
  'murepavadin': 'Clinical trials for Pseudomonas aeruginosa infections. Outer membrane protein-targeting antibiotic peptide.',
  '225ac-dota-lm3': 'Phase 1/2 clinical trials for prostate cancer. Alpha-emitting PSMA-targeting radiopharmaceutical.',
  'zelenectide-pevedotin': 'Phase 1 clinical trials for solid tumors. Antibody-drug conjugate.',
  'ss-31': 'Phase 3 clinical trials as elamipretide for mitochondrial diseases (Stealth BioTherapeutics).',
};

// Research-only — everything else
const researchOnlyNotes = {
  'bpc-157': 'Not FDA-approved. Extensive preclinical research but no completed human clinical trials. Available through compounding pharmacies and research suppliers.',
  'tb-500': 'Not FDA-approved. Synthetic fragment of thymosin beta-4. Preclinical research only. Used in veterinary and research settings.',
  'mk-677': 'Not FDA-approved. Oral growth hormone secretagogue (ibutamoren). Phase 2 trials completed but development discontinued.',
  'ipamorelin': 'Not FDA-approved. Growth hormone releasing peptide. Preclinical and limited clinical research.',
  'cjc-1295': 'Not FDA-approved. Modified GHRH analog. Limited clinical research; widely used in anti-aging clinics.',
  'ghk': 'Not FDA-approved. Naturally occurring tripeptide. Extensive in-vitro and animal research on wound healing and skin repair.',
  'ghk-cu': 'Not FDA-approved. Copper-bound GHK peptide. Available in cosmetic formulations. Preclinical research on tissue repair.',
  'ghrp-2': 'Not FDA-approved. Growth hormone releasing peptide. Limited clinical research.',
  'ghrp-6': 'Not FDA-approved. Growth hormone releasing peptide. Limited clinical research.',
  'hexarelin': 'Not FDA-approved. Growth hormone secretagogue. Limited clinical research, some cardioprotective studies.',
  'sermorelin': 'Previously FDA-approved (Geref) for growth hormone deficiency diagnosis. Withdrawn from market but available through compounding.',
  'epithalon': 'Not FDA-approved. Synthetic tetrapeptide studied for telomerase activation. Developed by Prof. Khavinson; limited clinical data.',
  'selank': 'Not FDA-approved in US. Approved in Russia as an anxiolytic. Synthetic analog of tuftsin.',
  'semax': 'Not FDA-approved in US. Approved in Russia for stroke recovery and cognitive enhancement.',
  'na-selank-amidate': 'Not FDA-approved. Modified form of selank. Research compound only.',
  'na-semax-amidate': 'Not FDA-approved. Modified form of semax. Research compound only.',
  'melanotan-ii': 'Not FDA-approved. Research peptide for tanning/sexual dysfunction. Significant safety concerns; not recommended for human use.',
  'aod-9604': 'Not FDA-approved. Fragment of human growth hormone (hGH 176-191). Phase 2 trials for obesity showed limited efficacy.',
  'dsip': 'Not FDA-approved. Delta sleep-inducing peptide. Limited and conflicting research results.',
  'foxo4-dri': 'Not FDA-approved. Senolytic peptide. Preclinical research only; studied for selective clearance of senescent cells.',
  'follistatin': 'Not FDA-approved. Naturally occurring glycoprotein. Preclinical research on muscle growth and fibrosis.',
  'igf-1-lr3': 'Not FDA-approved. Modified IGF-1 analog. Note: natural IGF-1 (mecasermin/Increlex) is FDA-approved for growth failure.',
  'kisspeptin': 'Not FDA-approved. Naturally occurring neuropeptide. Active research in reproductive endocrinology.',
  'll-37': 'Not FDA-approved. Human cathelicidin antimicrobial peptide. Preclinical research on infection and wound healing.',
  'kpv': 'Not FDA-approved. Tripeptide fragment of alpha-MSH. Preclinical research on anti-inflammatory effects.',
  'mots-c': 'Not FDA-approved. Mitochondrial-derived peptide. Preclinical research on metabolism and exercise mimetics.',
  'humanin': 'Not FDA-approved. Mitochondrial-derived peptide. Preclinical research on neuroprotection and metabolic health.',
  'shlp-2': 'Not FDA-approved. Small humanin-like peptide 2. Early preclinical research on mitochondrial function.',
  'shlp-6': 'Not FDA-approved. Small humanin-like peptide 6. Early preclinical research.',
  'p21': 'Not FDA-approved. Synthetic peptide fragment of CNTF. Preclinical research on neurogenesis.',
  'dihexa': 'Not FDA-approved. Angiotensin IV analog. Preclinical research on cognitive enhancement.',
  '5-amino-1mq': 'Not FDA-approved. Small molecule NNMT inhibitor. Preclinical research on metabolism and fat loss.',
  'slu-pp-332': 'Not FDA-approved. ERR agonist (exercise mimetic). Early preclinical research.',
  'thymosin-alpha-1': 'Not FDA-approved in US. Approved in 35+ countries (Zadaxin) for hepatitis B/C and as immune modulator.',
  'thymalin': 'Not FDA-approved in US. Approved in Russia. Thymic peptide bioregulator developed by Prof. Khavinson.',
  'thymogen': 'Not FDA-approved in US. Approved in Russia as immunomodulator. Synthetic thymic dipeptide.',
  'thymulin': 'Not FDA-approved. Naturally occurring thymic nonapeptide. Preclinical research on immune modulation.',
  'cerebrolysin': 'Not FDA-approved in US. Approved in 45+ countries for stroke and dementia. Porcine brain-derived peptide mixture.',
  'cortexin': 'Not FDA-approved in US. Approved in Russia for neurological conditions. Brain-derived peptide complex.',
  'lactoferricin': 'Not FDA-approved. Antimicrobial peptide derived from lactoferrin. Preclinical research on antimicrobial and anticancer properties.',
  'alpha-defensins': 'Not FDA-approved as therapeutics. Naturally occurring antimicrobial peptides. Preclinical research.',
  'cagrilintide': 'Phase 3 as part of CagriSema (Novo Nordisk). Long-acting amylin analog.',

  // Bioregulators (Khavinson peptides)
  'bronchogen': 'Not FDA-approved. Khavinson bioregulator peptide for bronchial tissue. Available in Russia.',
  'cardiogen': 'Not FDA-approved. Khavinson bioregulator peptide for cardiovascular tissue. Available in Russia.',
  'cerluten': 'Not FDA-approved. Khavinson bioregulator peptide for brain tissue. Available in Russia.',
  'chonluten': 'Not FDA-approved. Khavinson bioregulator peptide for respiratory mucosa. Available in Russia.',
  'endoluten': 'Not FDA-approved. Khavinson bioregulator peptide for pineal gland. Available in Russia.',
  'kristagen': 'Not FDA-approved. Khavinson bioregulator peptide for immune system. Available in Russia.',
  'livagen': 'Not FDA-approved. Khavinson bioregulator peptide for liver tissue. Available in Russia.',
  'ovagen': 'Not FDA-approved. Khavinson bioregulator peptide for liver and GI tract. Available in Russia.',
  'pancragen': 'Not FDA-approved. Khavinson bioregulator peptide for pancreatic tissue. Available in Russia.',
  'pinealon': 'Not FDA-approved. Khavinson bioregulator peptide for brain tissue. Synthetic tripeptide.',
  'prostatilen': 'Not FDA-approved in US. Approved in Russia for prostate conditions. Bovine prostate-derived peptide.',
  'retinalamin': 'Not FDA-approved in US. Approved in Russia for retinal conditions. Bovine retina-derived peptide.',
  'sigumir': 'Not FDA-approved. Khavinson bioregulator peptide for cartilage and bone. Available in Russia.',
  'stamakort': 'Not FDA-approved. Khavinson bioregulator peptide for stomach tissue. Available in Russia.',
  'suprefort': 'Not FDA-approved. Khavinson bioregulator peptide for pancreatic tissue. Available in Russia.',
  'svetinorm': 'Not FDA-approved. Khavinson bioregulator peptide for liver tissue. Available in Russia.',
  'testagen': 'Not FDA-approved. Khavinson bioregulator peptide for testicular tissue. Available in Russia.',
  'ventfort': 'Not FDA-approved. Khavinson bioregulator peptide for vascular tissue. Available in Russia.',
  'vesugen': 'Not FDA-approved. Khavinson bioregulator peptide for vascular tissue. Synthetic tripeptide.',
  'vilon': 'Not FDA-approved. Khavinson bioregulator peptide for immune system. Synthetic dipeptide.',
  'vladonix': 'Not FDA-approved. Khavinson bioregulator peptide for thymus. Available in Russia.',
};

// Remove cagrilintide from research-only since it's already in investigational
delete researchOnlyNotes['cagrilintide'];

const allFiles = fs.readdirSync(PEPTIDES_DIR).filter(f => f.endsWith('.mdx'));
let updated = 0;
let skipped = 0;

for (const file of allFiles) {
  const filePath = path.join(PEPTIDES_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const slug = file.replace('.mdx', '');

  // Skip if already has regulatoryStatus
  if (data.regulatoryStatus) {
    skipped++;
    continue;
  }

  let status, notes;

  if (approved[slug]) {
    status = 'approved';
    notes = approved[slug];
  } else if (investigational[slug]) {
    status = 'investigational';
    notes = investigational[slug];
  } else if (researchOnlyNotes[slug]) {
    status = 'research-only';
    notes = researchOnlyNotes[slug];
  } else {
    // Default to research-only for any unmapped peptide
    status = 'research-only';
    notes = 'Not FDA-approved. Limited published research.';
    console.log(`  [DEFAULT] ${slug} → research-only (no specific notes)`);
  }

  data.regulatoryStatus = {
    status,
    lastUpdated: '2026-02-18',
    notes,
  };

  // Reconstruct the file
  const newContent = matter.stringify(content, data);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  updated++;
  console.log(`  ✓ ${slug} → ${status}`);
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped (already had status)`);
console.log(`Total files: ${allFiles.length}`);
