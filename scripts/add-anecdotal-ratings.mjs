#!/usr/bin/env node
/**
 * Add anecdotal evidence ratings and community reports to all peptide dossiers.
 *
 * - Adds `anecdotalEvidence: N` to ratings block
 * - Recalculates `overall` with new formula:
 *   (researchDepth * 0.35) + (globalCoverage * 0.2) + (mechanismPlausibility * 0.3) + (anecdotalEvidence * 0.15)
 * - Adds `anecdotalReports` block with positive/negative arrays + communityNotes
 *
 * Usage: node scripts/add-anecdotal-ratings.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import matter from 'gray-matter';

const ROOT = resolve(import.meta.dirname, '..');
const PEPTIDES_DIR = join(ROOT, 'src', 'content', 'peptides');

// ============================================================
// ANECDOTAL SCORES (1-5)
// ============================================================
const SCORES = {
  // Score 5: FDA-approved blockbusters with massive community
  5: ['semaglutide', 'tirzepatide', 'liraglutide'],

  // Score 4: Large community traction
  4: ['bpc-157', 'tb-500', 'mk-677', 'ipamorelin', 'pt-141', 'melanotan-ii',
      'ghk-cu', 'sermorelin', 'cjc-1295', 'ghrp-2', 'ghrp-6', 'hcg'],

  // Score 3: Moderate community presence
  3: ['epithalon', 'semax', 'selank', 'na-selank-amidate', 'na-semax-amidate',
      'tesamorelin', 'aod-9604', 'dsip', 'follistatin', 'igf-1-lr3',
      'glutathione', 'thymosin-alpha-1', 'kisspeptin', 'hexarelin', 'll-37',
      'mots-c', 'retatrutide', 'orforglipron'],

  // Score 2: Niche/limited
  2: ['humanin', 'ss-31', 'foxo4-dri', 'kpv', 'thymalin', 'thymogen',
      'cerebrolysin', 'cortexin', 'dihexa', 'p21', 'shlp-2', 'shlp-6',
      'pinealon', '5-amino-1mq', 'ghk', 'melanotan-i', 'slu-pp-332',
      'klotho', 'peg-mgf', 'cagrilintide', 'cagrisema', 'pemvidutide',
      'survodutide', 'amycretin', 'vk2735', 'maritide'],
};
// Score 1: everything else (bioregulators, pipeline drugs)

function getScore(slug) {
  for (const [score, slugs] of Object.entries(SCORES)) {
    if (slugs.includes(slug)) return Number(score);
  }
  return 1;
}

// ============================================================
// ANECDOTAL REPORTS DATA
// ============================================================
const REPORTS = {
  // Score 5
  'semaglutide': {
    positive: [
      'Significant appetite suppression reported within first week',
      'Reduced food noise and cravings consistently cited',
      'Improved relationship with food and reduced binge eating',
      'Cardiovascular improvements noted by users with comorbidities',
    ],
    negative: [
      'Nausea and GI distress common during dose escalation',
      'Muscle loss reported without resistance training',
      'Fatigue and low energy during initial weeks',
      'Hair thinning reported by some users during rapid weight loss',
    ],
    communityNotes: 'Most discussed peptide online. r/semaglutide has 200K+ members. Extensive patient community feedback.',
  },
  'tirzepatide': {
    positive: [
      'Superior weight loss compared to semaglutide frequently reported',
      'Less nausea than semaglutide cited by switchers',
      'Significant A1C improvements in diabetic users',
      'Reduced appetite described as more natural-feeling than other GLP-1s',
    ],
    negative: [
      'Injection site reactions including redness and itching',
      'Supply shortages and access difficulties widely reported',
      'GI side effects still present though often milder than semaglutide',
      'Fatigue and reduced energy during titration',
    ],
    communityNotes: 'r/tirzepatide growing rapidly. Often compared directly to semaglutide in community discussions.',
  },
  'liraglutide': {
    positive: [
      'Moderate appetite suppression with well-characterized profile',
      'Daily dosing allows finer control compared to weekly options',
      'Long track record of real-world use since 2010',
      'Generic availability improving access and affordability',
    ],
    negative: [
      'Weight loss modest compared to newer GLP-1 agents',
      'Daily injection burden cited as major drawback',
      'Nausea common especially during titration',
      'Many users switched to weekly alternatives for convenience',
    ],
    communityNotes: 'First-generation GLP-1 with extensive real-world data. Community increasingly favors weekly alternatives.',
  },

  // Score 4
  'bpc-157': {
    positive: [
      'Accelerated tendon and ligament healing frequently reported',
      'Reduced joint pain and inflammation within days',
      'Gut healing and reduced IBS symptoms cited',
      'Faster recovery from injuries and surgery',
    ],
    negative: [
      'Inconsistent product quality from research suppliers',
      'Some users report increased anxiety or restlessness',
      'Effects diminish after extended use',
      'Injection site reactions with subcutaneous administration',
    ],
    communityNotes: 'One of the most discussed peptides in r/Peptides. Often stacked with TB-500 as the "Wolverine Stack."',
  },
  'tb-500': {
    positive: [
      'Reduced inflammation and faster tissue repair widely reported',
      'Improved flexibility and reduced stiffness after injuries',
      'Synergistic effects when combined with BPC-157',
      'Systemic healing effects noted across multiple injury types',
    ],
    negative: [
      'Slower onset than BPC-157 — effects take longer to notice',
      'Headaches reported by some users',
      'Fatigue and lethargy during initial use',
      'Product purity concerns from unregulated suppliers',
    ],
    communityNotes: 'Frequently paired with BPC-157. Popular in athletic and injury recovery communities.',
  },
  'mk-677': {
    positive: [
      'Improved sleep quality consistently reported',
      'Increased appetite beneficial for muscle gain goals',
      'Improved skin quality and hair growth noted',
      'Oral administration preferred over injectable alternatives',
    ],
    negative: [
      'Significant water retention and bloating common',
      'Increased blood glucose and insulin resistance reported',
      'Lethargy and fatigue especially at higher amounts',
      'Joint pain from water retention in some users',
    ],
    communityNotes: 'Widely discussed in r/Peptides and fitness forums. Oral convenience is a major draw.',
  },
  'ipamorelin': {
    positive: [
      'Improved sleep quality and deeper sleep reported',
      'Subtle body composition improvements over time',
      'Fewer side effects compared to other GH secretagogues',
      'Improved recovery from exercise reported',
    ],
    negative: [
      'Effects subtle and slow to manifest',
      'Injection timing and fasting requirements inconvenient',
      'Head rush or flushing shortly after injection',
      'Results plateau after extended use',
    ],
    communityNotes: 'Popular GH secretagogue considered milder than GHRP options. Often combined with CJC-1295.',
  },
  'pt-141': {
    positive: [
      'Effective for sexual desire enhancement in both sexes',
      'FDA-approved formulation (Vyleesi) validates mechanism',
      'Effects distinct from PDE5 inhibitors — acts on desire not just function',
      'Some users report emotional/mood enhancement',
    ],
    negative: [
      'Nausea is very common and can be severe',
      'Facial flushing and skin darkening reported',
      'Effects inconsistent and dose-dependent',
      'Headaches common side effect',
    ],
    communityNotes: 'Unique mechanism targeting desire rather than mechanics. Community discussions span both clinical and research peptide contexts.',
  },
  'melanotan-ii': {
    positive: [
      'Significant skin tanning without UV exposure',
      'Appetite suppression noted as side benefit',
      'Sexual enhancement effects reported by many users',
      'Long-lasting effects after loading phase',
    ],
    negative: [
      'Nausea, especially with initial use',
      'New mole formation and darkening of existing moles concerning',
      'Facial flushing and headaches common',
      'Unregulated product quality raises safety concerns',
    ],
    communityNotes: 'Very popular in tanning communities. Significant safety concerns led to FDA Category 2 restriction.',
  },
  'ghk-cu': {
    positive: [
      'Improved skin texture and reduced fine lines widely reported',
      'Enhanced wound healing and scar reduction',
      'Hair growth improvements noted by some users',
      'Well-tolerated topically with minimal side effects',
    ],
    negative: [
      'Results slow — takes weeks to months for visible effects',
      'Topical absorption questioned for deeper tissue effects',
      'Product quality varies widely between suppliers',
      'Copper peptide staining on fabrics and skin',
    ],
    communityNotes: 'Popular in skincare and anti-aging communities. Available both as research peptide and in cosmetic products.',
  },
  'sermorelin': {
    positive: [
      'Improved sleep quality frequently cited as primary benefit',
      'Gradual body composition improvements reported',
      'Well-tolerated with fewer side effects than direct GH',
      'Available through anti-aging clinics with medical supervision',
    ],
    negative: [
      'Effects subtle and require months of consistent use',
      'Injection site reactions and irritation',
      'Fasting requirements for optimal timing',
      'Efficacy decreases with age as GH receptors decline',
    ],
    communityNotes: 'One of the earliest peptides prescribed in anti-aging clinics. Community views it as a milder, safer GH alternative.',
  },
  'cjc-1295': {
    positive: [
      'Improved sleep quality and deeper sleep reported',
      'Enhanced recovery from exercise and injury',
      'Fat loss and body composition improvements over time',
      'DAC version provides sustained GH elevation',
    ],
    negative: [
      'Water retention and bloating common',
      'Injection site irritation, especially with DAC version',
      'Flushing and warmth after injection',
      'Results take weeks to become noticeable',
    ],
    communityNotes: 'Commonly paired with ipamorelin or GHRP-6. DAC vs no-DAC versions debated in community.',
  },
  'ghrp-2': {
    positive: [
      'Strong GH release and improved recovery reported',
      'Enhanced appetite useful for muscle building goals',
      'Improved sleep quality noted',
      'Fast-acting effects felt within minutes of injection',
    ],
    negative: [
      'Intense hunger increase can be difficult to manage',
      'Cortisol and prolactin elevation concerns',
      'Water retention and bloating',
      'Desensitization with prolonged use reported',
    ],
    communityNotes: 'Potent GH secretagogue popular in bodybuilding. FDA Category 2 restricted from compounding.',
  },
  'ghrp-6': {
    positive: [
      'Strong appetite stimulation valued for bulking phases',
      'Improved sleep and recovery reported',
      'Affordable compared to other GH-related peptides',
      'Fast onset of GH release',
    ],
    negative: [
      'Extreme hunger can be overwhelming',
      'Cortisol elevation greater than GHRP-2',
      'Water retention and bloating significant',
      'Lethargy after injection reported',
    ],
    communityNotes: 'Known for extreme appetite stimulation. FDA Category 2 restricted. Community often recommends GHRP-2 or ipamorelin instead.',
  },
  'hcg': {
    positive: [
      'Effective for maintaining testicular function during TRT',
      'Well-established clinical use with decades of data',
      'Fertility preservation widely confirmed',
      'Improved mood and sense of wellbeing reported',
    ],
    negative: [
      'Estrogen elevation requiring management',
      'Water retention and bloating',
      'Injection frequency burdensome (multiple times per week)',
      'Emotional sensitivity and mood swings reported',
    ],
    communityNotes: 'Standard component of TRT protocols. Extensively discussed in r/testosterone and HRT communities.',
  },

  // Score 3
  'epithalon': {
    positive: [
      'Improved sleep quality and circadian rhythm reported',
      'Subjective improvements in energy and wellbeing',
      'Theoretical longevity benefits from telomerase activation',
      'Well-tolerated with minimal reported side effects',
    ],
    negative: [
      'Effects highly subjective and difficult to verify',
      'No Western clinical trials to confirm benefits',
      'Expensive for unproven longevity claims',
      'Product purity concerns from research suppliers',
    ],
    communityNotes: 'Popular in longevity and biohacker communities. Claims often exceed available evidence.',
  },
  'semax': {
    positive: [
      'Improved focus and mental clarity frequently reported',
      'Reduced brain fog and enhanced cognitive performance',
      'Mood improvement and reduced anxiety noted',
      'Nasal administration convenient and non-invasive',
    ],
    negative: [
      'Effects short-lived requiring frequent redosing',
      'Hair loss reported by some long-term users',
      'Irritability and overstimulation at higher amounts',
      'Product quality varies between suppliers',
    ],
    communityNotes: 'Popular nootropic in r/Nootropics and r/Peptides. Russian-approved drug with growing Western interest.',
  },
  'selank': {
    positive: [
      'Reduced anxiety without sedation frequently reported',
      'Improved focus and cognitive clarity noted',
      'Better stress management and emotional stability',
      'Nasal administration convenient',
    ],
    negative: [
      'Effects subtle compared to pharmaceutical anxiolytics',
      'Short duration of action',
      'Some users report fatigue at higher amounts',
      'Limited supplier quality control',
    ],
    communityNotes: 'Often compared to and stacked with semax. Favored for anxiolytic effects in nootropic communities.',
  },
  'na-selank-amidate': {
    positive: [
      'Longer-lasting effects than standard selank reported',
      'Enhanced bioavailability from modified form',
      'Anxiolytic effects without cognitive impairment',
      'Stable nasal spray formulation',
    ],
    negative: [
      'More expensive than standard selank',
      'Limited availability compared to standard form',
      'Long-term safety data lacking',
      'Subtle effects may not meet expectations',
    ],
    communityNotes: 'Preferred by some over standard selank for longer duration. Niche following in nootropic communities.',
  },
  'na-semax-amidate': {
    positive: [
      'Stronger and longer-lasting than standard semax reported',
      'Enhanced cognitive stimulation and focus',
      'Modified form provides improved bioavailability',
      'Nasal administration convenient',
    ],
    negative: [
      'Overstimulation and anxiety at higher amounts',
      'More expensive than standard semax',
      'Hair loss concerns carried over from semax reports',
      'Limited supplier options',
    ],
    communityNotes: 'Considered the potent version of semax. Popular in nootropic stacks.',
  },
  'tesamorelin': {
    positive: [
      'Effective visceral fat reduction with clinical backing',
      'FDA-approved status provides confidence in safety',
      'Improved body composition without significant muscle loss',
      'Cognitive benefits reported in aging populations',
    ],
    negative: [
      'Expensive even through anti-aging clinics',
      'Injection site reactions common',
      'Effects reverse after discontinuation',
      'Insurance coverage limited to HIV lipodystrophy indication',
    ],
    communityNotes: 'Gaining popularity in anti-aging clinics. FDA approval (Egrifta) gives it more legitimacy than research peptides.',
  },
  'aod-9604': {
    positive: [
      'Fat loss without affecting blood glucose levels reported',
      'No impact on IGF-1 or growth hormone levels cited as safety advantage',
      'Targeted abdominal fat reduction claimed',
      'Well-tolerated with few reported side effects',
    ],
    negative: [
      'Fat loss effects modest and inconsistent in reports',
      'Limited clinical evidence despite widespread marketing',
      'Results inferior to GLP-1 agents for weight management',
      'Product quality concerns from research suppliers',
    ],
    communityNotes: 'Popular in weight loss clinics. Community views mixed — some report benefits, many find effects modest.',
  },
  'dsip': {
    positive: [
      'Improved sleep onset and quality reported',
      'Reduced stress and anxiety noted',
      'Natural-feeling sleep enhancement cited',
      'Well-tolerated with minimal morning grogginess',
    ],
    negative: [
      'Effects inconsistent across users',
      'Tolerance develops with regular use',
      'Limited suppliers and quality control concerns',
      'Some users report vivid or disturbing dreams',
    ],
    communityNotes: 'Niche following in sleep optimization community. Often discussed alongside melatonin and sleep peptides.',
  },
  'follistatin': {
    positive: [
      'Myostatin inhibition concept appeals to muscle building community',
      'Improved recovery and muscle growth reported by some',
      'Theoretical muscle preservation benefits during cutting',
      'Growing research interest in muscle wasting applications',
    ],
    negative: [
      'Very expensive with minimal evidence of effectiveness',
      'Extremely limited human data for injectable use',
      'Product quality and authenticity difficult to verify',
      'Potential concerns about unregulated cell proliferation',
    ],
    communityNotes: 'Niche interest in bodybuilding. Concept of myostatin inhibition generates discussion but evidence is thin.',
  },
  'igf-1-lr3': {
    positive: [
      'Localized muscle growth at injection sites reported',
      'Enhanced recovery from intense training noted',
      'Synergistic effects when combined with GH reported',
      'Improved nutrient partitioning claimed',
    ],
    negative: [
      'Hypoglycemia risk is a significant safety concern',
      'Potential to promote growth of existing tumors',
      'Gut growth and organ enlargement concerns',
      'Injection site pain and swelling common',
    ],
    communityNotes: 'Used primarily in advanced bodybuilding circles. Significant safety concerns limit broader adoption.',
  },
  'glutathione': {
    positive: [
      'Improved skin brightness and complexion widely reported',
      'General detoxification and wellbeing benefits cited',
      'Well-tolerated across IV, oral, and topical forms',
      'Widely available in wellness clinics',
    ],
    negative: [
      'Oral bioavailability very poor without liposomal form',
      'IV administration required for reliable systemic effects',
      'Skin lightening effects may be unwanted',
      'Effects temporary requiring ongoing supplementation',
    ],
    communityNotes: 'Popular in wellness and beauty communities. IV glutathione widely offered in med spas and wellness clinics.',
  },
  'thymosin-alpha-1': {
    positive: [
      'Immune system support reported during illness',
      'Used clinically in 35+ countries as Zadaxin',
      'Well-tolerated with minimal reported side effects',
      'Enhanced vaccine response noted in some reports',
    ],
    negative: [
      'Expensive through compounding pharmacies',
      'Effects difficult to subjectively measure',
      'Not FDA-approved in the US despite global approval',
      'Autoimmune concerns with chronic immune stimulation',
    ],
    communityNotes: 'Growing interest in immune optimization community. Global approval in 35+ countries adds credibility.',
  },
  'kisspeptin': {
    positive: [
      'Hormonal optimization benefits in clinical settings',
      'Potential fertility applications explored',
      'Short-acting profile allows controlled use',
      'Research expanding into metabolic applications',
    ],
    negative: [
      'Very limited community experience outside clinical settings',
      'Effects not well characterized for self-administration',
      'Short half-life requires frequent administration',
      'Limited availability from research suppliers',
    ],
    communityNotes: 'Primarily discussed in fertility and hormone optimization contexts. Limited self-experimentation community.',
  },
  'hexarelin': {
    positive: [
      'Strong GH release reported comparable to GHRP-6',
      'Cardioprotective properties noted in research',
      'Improved recovery and sleep quality reported',
      'Potent effects from relatively small amounts',
    ],
    negative: [
      'Rapid desensitization with continued use',
      'Cortisol and prolactin elevation concerns',
      'Hunger increase though less than GHRP-6',
      'Limited long-term safety data',
    ],
    communityNotes: 'Known as the most potent GHRP. Community notes rapid desensitization as major drawback.',
  },
  'll-37': {
    positive: [
      'Antimicrobial properties supported by strong research',
      'Wound healing benefits reported in clinical contexts',
      'Immune modulation during infections noted',
      'Growing clinical interest in infection-related applications',
    ],
    negative: [
      'Limited self-experimentation community data',
      'Primarily used in clinical/research settings',
      'Injection administration required',
      'Potential pro-inflammatory effects at high concentrations',
    ],
    communityNotes: 'Discussed primarily in immune and wound healing contexts. Growing interest post-pandemic.',
  },
  'mots-c': {
    positive: [
      'Improved exercise capacity and energy reported',
      'Metabolic benefits and improved insulin sensitivity noted',
      'Theoretical longevity benefits from mitochondrial targeting',
      'Well-tolerated in community reports',
    ],
    negative: [
      'Effects subtle and difficult to verify objectively',
      'Limited availability and high cost',
      'Very few human studies to guide expectations',
      'Long-term effects completely unknown',
    ],
    communityNotes: 'Growing interest in longevity community. Often discussed alongside other mitochondrial peptides.',
  },
  'retatrutide': {
    positive: [
      'Impressive weight loss results in clinical trials generating excitement',
      'Triple agonism mechanism viewed as next-generation approach',
      'Strong media coverage increasing awareness',
      'Potential for muscle-sparing weight loss discussed',
    ],
    negative: [
      'Not yet available outside clinical trials',
      'GI side effects expected to be significant based on trial data',
      'Dysesthesia safety signal concerning to community',
      'No real-world user data yet',
    ],
    communityNotes: 'Highly anticipated pipeline drug. Community following trial results closely. No real-world user reports yet.',
  },
  'orforglipron': {
    positive: [
      'Oral GLP-1 pill format generating significant community excitement',
      'Potential to democratize access vs injectable alternatives',
      'Daily pill convenience preferred by needle-averse community members',
      'FDA Priority Review status builds confidence',
    ],
    negative: [
      'Not yet available — all discussion is speculative',
      'Daily dosing less convenient than weekly injectables',
      'Lower efficacy than leading injectable options in trials',
      'Cost and insurance coverage unknown',
    ],
    communityNotes: 'High anticipation in weight management communities. Oral format could be a game-changer for access.',
  },
};

// Default reports for compounds not in the REPORTS map
function getReports(slug, score) {
  if (REPORTS[slug]) return REPORTS[slug];

  if (score >= 2) {
    return {
      positive: [],
      negative: [],
      communityNotes: 'Limited community discussion. Most reports come from niche enthusiast circles.',
    };
  }

  // Score 1 — no community data
  return {
    positive: [],
    negative: [],
    communityNotes: 'No meaningful community discussion or user reports available.',
  };
}

// ============================================================
// MAIN
// ============================================================
const files = readdirSync(PEPTIDES_DIR).filter(f => f.endsWith('.mdx'));
let updated = 0;

for (const file of files) {
  const filePath = join(PEPTIDES_DIR, file);
  const raw = readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const slug = file.replace('.mdx', '');

  const score = getScore(slug);
  const reports = getReports(slug, score);

  // Update ratings
  if (data.ratings) {
    data.ratings.anecdotalEvidence = score;
    // Recalculate overall with new formula
    const rd = data.ratings.researchDepth;
    const gc = data.ratings.globalCoverage;
    const mp = data.ratings.mechanismPlausibility;
    const ae = score;
    const overall = Math.round((rd * 0.35 + gc * 0.2 + mp * 0.3 + ae * 0.15) * 100) / 100;
    data.ratings.overall = overall;
    data.ratings.lastReviewed = new Date('2026-04-13');
  }

  // Add anecdotal reports
  data.anecdotalReports = reports;

  // Write back
  const output = matter.stringify(content, data);
  writeFileSync(filePath, output, 'utf8');
  updated++;
  console.log(`${slug}: anecdotal=${score}, overall=${data.ratings?.overall ?? 'N/A'}`);
}

console.log(`\nUpdated ${updated} files.`);
