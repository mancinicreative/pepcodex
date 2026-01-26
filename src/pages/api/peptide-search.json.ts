import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Prerender at build time to generate static JSON
export const prerender = true;

// Common medical conditions and terms to extract for better search
const medicalTermPatterns = [
  /PCOS|polycystic ovary/gi,
  /diabetes|diabetic/gi,
  /obesity|overweight|weight loss/gi,
  /infertility|fertility|IVF|ovulation/gi,
  /inflammation|inflammatory/gi,
  /cancer|tumor|oncolog/gi,
  /alzheimer|dementia|cognitive/gi,
  /depression|anxiety|mood/gi,
  /arthritis|joint pain/gi,
  /wound healing|tissue repair/gi,
  /muscle|strength|athletic/gi,
  /aging|longevity|senescence/gi,
  /immune|autoimmune/gi,
  /cardiovascular|heart|cardiac/gi,
  /neuroprotect|brain/gi,
  /sleep|insomnia/gi,
  /skin|dermat|hair/gi,
  /stroke|ischemia/gi,
  /kidney|renal/gi,
  /liver|hepat/gi,
  /OHSS|hyperstimulation/gi,
  /hypogonadism|testosterone/gi,
  /GLP-1|GIP|glucagon/gi,
  /MASH|NASH|fatty liver/gi,
];

function extractKeyTerms(content: string): string[] {
  const terms = new Set<string>();
  for (const pattern of medicalTermPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(m => terms.add(m.toLowerCase()));
    }
  }
  return Array.from(terms);
}

export const GET: APIRoute = async () => {
  const peptides = await getCollection('peptides');

  const searchIndex = await Promise.all(
    peptides.map(async (peptide) => {
      // Get the raw content (MDX body text)
      const { body } = peptide;

      // Strip MDX/HTML tags and clean up content for search
      const cleanContent = body
        // Remove MDX components and HTML tags
        .replace(/<[^>]+>/g, ' ')
        // Remove frontmatter if leaked
        .replace(/^---[\s\S]*?---/m, '')
        // Remove markdown formatting
        .replace(/[#*_`~\[\]]/g, ' ')
        // Remove URLs
        .replace(/https?:\/\/[^\s]+/g, '')
        // Remove PMID references (keep just the text)
        .replace(/\[PMID:\d+\]/g, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim();

      // Extract key medical terms from FULL content for better search
      const keyTerms = extractKeyTerms(body);

      return {
        slug: peptide.slug,
        name: peptide.data.name,
        aliases: peptide.data.aliases,
        category: peptide.data.category,
        evidenceStrength: peptide.data.evidenceStrength,
        summary: peptide.data.summary,
        // Include content for search (increased limit)
        content: cleanContent.slice(0, 25000),
        // Key medical terms extracted from full content
        keyTerms,
        url: `/peptides/${peptide.slug}`,
        sources: peptide.data.sources,
      };
    })
  );

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
