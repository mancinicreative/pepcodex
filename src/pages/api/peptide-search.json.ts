import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Pre-render at build time so search works with static output
export const prerender = true;

interface PeptideSearchItem {
  slug: string;
  name: string;
  aliases: string[];
  category: string;
  evidenceStrength: string;
  summary: string;
  content: string;
  keyTerms: string[];
  url: string;
  sources: {
    count: number;
    human: number;
    preclinical: number;
    openAccess: number;
  };
}

// Extract key medical terms from content for better condition searching
function extractKeyTerms(content: string): string[] {
  const medicalPatterns = [
    // Conditions
    /\b(PCOS|polycystic ovary syndrome)\b/gi,
    /\b(diabetes|diabetic|hyperglycemia|insulin resistance)\b/gi,
    /\b(obesity|overweight|weight loss|weight management)\b/gi,
    /\b(inflammation|inflammatory|anti-inflammatory)\b/gi,
    /\b(arthritis|joint pain|osteoarthritis|rheumatoid)\b/gi,
    /\b(depression|anxiety|mood disorders?|stress)\b/gi,
    /\b(alzheimer'?s?|dementia|cognitive decline|neurodegeneration)\b/gi,
    /\b(cancer|tumor|oncology|carcinoma|malignant)\b/gi,
    /\b(heart disease|cardiovascular|cardiac|hypertension)\b/gi,
    /\b(ulcer|gastric|gastrointestinal|IBD|IBS|colitis|Crohn'?s?)\b/gi,
    /\b(wound healing|tissue repair|regeneration)\b/gi,
    /\b(muscle wasting|sarcopenia|atrophy|cachexia)\b/gi,
    /\b(aging|longevity|lifespan|senescence|anti-aging)\b/gi,
    /\b(fertility|infertility|reproductive|ovulation)\b/gi,
    /\b(erectile dysfunction|sexual dysfunction|libido)\b/gi,
    /\b(sleep disorders?|insomnia|circadian)\b/gi,
    /\b(neuropathy|nerve damage|nerve regeneration)\b/gi,
    /\b(fibrosis|scarring|scar tissue)\b/gi,
    /\b(autoimmune|immune system|immunomodulat)\b/gi,
    /\b(osteoporosis|bone density|bone loss)\b/gi,
    // Mechanisms
    /\b(angiogenesis|blood vessel|vascular)\b/gi,
    /\b(apoptosis|cell death|autophagy)\b/gi,
    /\b(mitochondria|mitochondrial|ATP)\b/gi,
    /\b(collagen|elastin|connective tissue)\b/gi,
    /\b(growth hormone|GH|HGH|IGF-1)\b/gi,
    /\b(testosterone|estrogen|progesterone|hormone)\b/gi,
    /\b(cortisol|adrenal|stress hormone)\b/gi,
    /\b(serotonin|dopamine|neurotransmitter)\b/gi,
    /\b(insulin|glucagon|GLP-1|GIP)\b/gi,
    // Body parts
    /\b(tendon|ligament|muscle|bone|joint)\b/gi,
    /\b(brain|neural|CNS|nervous system)\b/gi,
    /\b(liver|hepatic|hepatoprotective)\b/gi,
    /\b(kidney|renal|nephro)\b/gi,
    /\b(gut|intestin|stomach|gastric)\b/gi,
    /\b(skin|dermal|cutaneous|wound)\b/gi,
    /\b(hair|follicle|alopecia|hair loss)\b/gi,
    /\b(eye|ocular|retina|cornea)\b/gi,
  ];

  const terms = new Set<string>();

  for (const pattern of medicalPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => terms.add(match.toLowerCase()));
    }
  }

  return Array.from(terms);
}

// Strip markdown/MDX formatting to get plain text
function stripMarkdown(content: string): string {
  return content
    // Remove frontmatter
    .replace(/^---[\s\S]*?---/m, '')
    // Remove MDX components
    .replace(/<[^>]+>/g, ' ')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    // Remove markdown formatting
    .replace(/#{1,6}\s/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove tables
    .replace(/\|[^\n]+\|/g, ' ')
    .replace(/[-:]+\|[-:|]+/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  try {
    const peptides = await getCollection('peptides');

    const searchIndex: PeptideSearchItem[] = await Promise.all(
      peptides
        .filter(peptide => peptide?.data?.summary && peptide?.data?.sources)
        .map(async (peptide) => {
          // Get the raw body content for searching
          const rawContent = peptide.body || '';
          const plainContent = stripMarkdown(rawContent);

          // Extract key medical terms from content
          const keyTerms = extractKeyTerms(rawContent + ' ' + (peptide.data.summary || ''));

          return {
            slug: peptide.slug,
            name: peptide.data.name,
            aliases: peptide.data.aliases || [],
            category: peptide.data.category,
            evidenceStrength: peptide.data.evidenceStrength,
            summary: peptide.data.summary || '',
            content: plainContent,
            keyTerms,
            url: `/peptides/${peptide.slug}`,
            sources: peptide.data.sources || { count: 0, human: 0, preclinical: 0, openAccess: 0 },
          };
        })
    );

    return new Response(JSON.stringify(searchIndex), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating peptide search index:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate search index' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
