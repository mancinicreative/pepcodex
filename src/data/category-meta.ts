export interface CategoryMeta {
  title: string;
  description: string;
  intro: string;
  about: string;
}

const categoryMeta: Record<string, CategoryMeta> = {
  'metabolic': {
    title: 'Metabolic Peptides',
    description: 'GLP-1 agonists and metabolic regulators. Evidence-based dossiers on tirzepatide, semaglutide, retatrutide, and more.',
    intro: 'Metabolic peptides include GLP-1 receptor agonists, dual and triple agonists, and other compounds that influence metabolism, appetite, and body composition. This category includes some of the most well-researched peptides with substantial human clinical trial data.',
    about: 'GLP-1 (glucagon-like peptide-1) receptor agonists are among the most extensively studied peptides, with multiple FDA-approved medications in this class. Research focuses on their effects on glucose metabolism, weight management, and cardiovascular outcomes. Newer agents like tirzepatide (dual GIP/GLP-1 agonist) and retatrutide (triple agonist) represent expanding research into multi-receptor targeting approaches.',
  },
  'repair-recovery': {
    title: 'Repair & Recovery Peptides',
    description: 'Healing peptides and tissue repair compounds. Evidence-based dossiers on BPC-157, TB-500, and related peptides.',
    intro: 'Repair and recovery peptides are investigated for their potential roles in tissue healing, inflammation modulation, and injury recovery. Many of these peptides have substantial preclinical research but limited human clinical trial data.',
    about: 'Many repair and recovery peptides have extensive preclinical (animal and in vitro) research but limited human clinical trial data. We clearly label the evidence level for each peptide and distinguish between what\'s demonstrated in humans versus what\'s observed in preclinical models.',
  },
  'hormonal': {
    title: 'Hormonal Peptides',
    description: 'Growth hormone secretagogues and hormonal regulators. Evidence-based dossiers on ipamorelin, CJC-1295, and related peptides.',
    intro: 'Hormonal peptides include growth hormone releasing peptides (GHRPs), growth hormone releasing hormone (GHRH) analogs, and other compounds that influence the endocrine system. Some have FDA approval for specific conditions while others remain investigational.',
    about: 'Growth hormone secretagogues work by stimulating the body\'s natural production of growth hormone rather than directly administering exogenous GH. Research investigates their effects on body composition, recovery, sleep quality, and aging-related changes. Some peptides in this category (like tesamorelin) have FDA approval for specific indications, while others remain in various stages of clinical investigation.',
  },
  'longevity': {
    title: 'Longevity Peptides',
    description: 'Anti-aging bioregulators and longevity-focused compounds. Evidence-based dossiers on epitalon, thymalin, and related peptides.',
    intro: 'Longevity peptides include bioregulators and compounds studied for their potential effects on aging, cellular repair, and lifespan extension. Research in this area spans from telomere biology to immune system modulation.',
    about: 'Research into peptide-mediated longevity focuses on mechanisms like telomere maintenance, immune reconstitution, and cellular repair pathways. Many bioregulators in this category originate from Russian research programs and have varying levels of Western clinical validation.',
  },
  'cognitive': {
    title: 'Cognitive Peptides',
    description: 'Nootropic and neuroprotective peptides. Evidence-based dossiers on semax, selank, and related compounds.',
    intro: 'Cognitive peptides encompass nootropic and neuroprotective compounds studied for their potential effects on memory, focus, neuroplasticity, and neuroprotection. Research ranges from anxiety modulation to neurodegenerative disease prevention.',
    about: 'Cognitive peptides target various neural pathways including BDNF expression, neurotransmitter modulation, and neuroinflammation reduction. Several compounds in this category have regulatory approval in specific countries for neurological conditions, while others remain under active investigation.',
  },
  'immune': {
    title: 'Immune Peptides',
    description: 'Immunomodulatory peptides and thymic factors. Evidence-based dossiers on thymosin alpha-1, LL-37, and related compounds.',
    intro: 'Immune peptides include thymic peptides, antimicrobial peptides, and immunomodulators studied for their effects on immune system regulation, infection defense, and inflammatory conditions.',
    about: 'Immunomodulatory peptides work through diverse mechanisms including thymic education of T-cells, direct antimicrobial activity, and cytokine modulation. Thymosin alpha-1 is one of the most clinically validated peptides in this category, with approval in several countries for hepatitis and immune deficiency conditions.',
  },
  'other': {
    title: 'Other Peptides',
    description: 'Specialized peptides and compounds that span multiple categories or have unique mechanisms of action.',
    intro: 'This category includes peptides with unique mechanisms of action or those that don\'t fit neatly into other categories. These compounds may have diverse research applications spanning multiple therapeutic areas.',
    about: 'Peptides in this category may target unique biological pathways or have multi-modal effects that don\'t fit within a single classification. Each dossier provides detailed evidence analysis specific to the compound\'s primary research applications.',
  },
};

export function getCategoryMeta(): Record<string, CategoryMeta> {
  return categoryMeta;
}
