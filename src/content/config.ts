import { defineCollection, z } from 'astro:content';

const evidenceStrength = z.enum(['high', 'moderate', 'low', 'very-low']);
const category = z.enum(['metabolic', 'repair-recovery', 'hormonal', 'longevity', 'cognitive', 'immune', 'other']);
const compoundType = z.enum(['peptide', 'small-molecule', 'mrna', 'protein', 'glycoprotein']).default('peptide');

// Shared SEO fields for all content types
const seoFields = {
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonical: z.string().optional(),
  robots: z.enum(['index', 'noindex']).default('index'),
};

// Amino acid property types for color coding in molecular structure display
const aminoAcidProperty = z.enum(['hydrophobic', 'polar', 'positive', 'negative', 'modified']);

// Evidence level and confidence enums for evidence-chained benefits
const evidenceLevel = z.enum(['high', 'moderate', 'low', 'very-low']);
const mechanismConfidence = z.enum(['established', 'supported', 'emerging']);
const benefitQualifier = z.enum(['may', 'appears to', 'suggested to', 'shown to']);

// Condition schema for programmatic SEO condition pages (Phase 20)
const conditionSchema = z.object({
  slug: z.string(),           // "tendonitis"
  name: z.string(),           // "Tendonitis"
  researchSummary: z.string(), // 2-3 paragraphs of condition-specific research
  relevantStudies: z.array(z.string()), // PMIDs
  relatedPeptides: z.array(z.string()).optional(), // other peptides studied for this condition
});

const peptides = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).default([]),
    category: category,
    compoundType: compoundType, // peptide, small-molecule, mrna, protein, glycoprotein
    evidenceStrength: evidenceStrength,
    lastUpdated: z.coerce.date(),
    comparators: z.array(z.string()).default([]),
    summary: z.string(), // Quick 1-2 sentence summary
    sources: z.object({
      count: z.number(),
      human: z.number(),
      preclinical: z.number(),
      openAccess: z.number(),
    }),
    // NEW: Molecular information for structure display
    molecularInfo: z.object({
      weight: z.string(),           // "1,419.53 Da"
      chainLength: z.number(),      // 15
      type: z.string(),             // "Pentadecapeptide"
      sequence: z.string(),         // "GKPPPGKPADDAGLV"
      aminoAcids: z.array(z.object({
        code: z.string(),
        name: z.string(),
        position: z.number(),
        property: aminoAcidProperty,
      })),
    }).optional(),
    // NEW: Evidence-chained benefits for detailed research breakdown
    evidenceChainedBenefits: z.array(z.object({
      mechanism: z.object({
        action: z.string(),
        confidence: mechanismConfidence,
        directStudies: z.number(),
      }),
      benefit: z.object({
        claim: z.string(),
        qualifier: benefitQualifier,
      }),
      evidence: z.object({
        level: evidenceLevel,
        humanStudies: z.number(),
        animalStudies: z.number(),
        cellStudies: z.number(),
        keyFindings: z.array(z.object({
          study: z.string(),
          type: z.enum(['human-rct', 'human-observational', 'animal', 'in-vitro']),
          finding: z.string(),
          pmid: z.string().optional(),
        })),
      }),
    })).optional(),
    // Peptide interactions for combination/stacking information
    interactions: z.array(z.object({
      peptide: z.string(),          // slug of related peptide
      type: z.enum(['synergistic', 'compatible', 'caution', 'avoid']),
      description: z.string(),
      source: z.string().optional(), // citation PMID
    })).optional(),
    // Related glossary terms for internal linking
    relatedTerms: z.array(z.string()).default([]),
    // Timeline: "What to Expect" based on study observations
    timeline: z.array(z.object({
      period: z.string(),           // "Week 1-2"
      effects: z.string(),          // "Based on study observations: initial effects may include..."
      source: z.string().optional(), // PMID reference
    })).optional(),
    // Quality Checklist for evaluating peptide products
    qualityChecklist: z.object({
      goodSigns: z.array(z.string()),    // ["Clear solution", "Proper lyophilized appearance"]
      warningSigns: z.array(z.string()), // ["Slightly cloudy", "Takes time to dissolve"]
      badSigns: z.array(z.string()),     // ["Visible particles", "Discoloration"]
    }).optional(),
    // Conditions for programmatic SEO pages (Phase 20)
    conditions: z.array(conditionSchema).optional(),
    // SEO fields
    ...seoFields,
  }),
});

const comparisons = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    peptideA: z.string(),
    peptideB: z.string(),
    category: category,
    lastUpdated: z.coerce.date(),
    summary: z.string(),
    ...seoFields,
  }),
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    peptide: z.string().optional(), // For "what is X" pages
    category: category.optional(),
    lastUpdated: z.coerce.date(),
    summary: z.string(),
    relatedTerms: z.array(z.string()).default([]),
    ...seoFields,
  }),
});

const safety = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    peptides: z.array(z.string()).default([]), // Related peptides
    lastUpdated: z.coerce.date(),
    summary: z.string(),
    ...seoFields,
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lastUpdated: z.coerce.date(),
    ...seoFields,
  }),
});

// Blog collection for weekly briefings, research news, guides, and safety info
const blogCategory = z.enum([
  'weekly-briefing',
  'research-digest',
  'deep-dive',
  'regulatory',
  'explainer',
  'guide',
  'safety'
]);

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    lastUpdated: z.coerce.date().optional(),
    author: z.string().default('PepCodex Research Team'),
    category: blogCategory,
    tags: z.array(z.string()).default([]),
    excerpt: z.string().min(100).max(350),
    relatedPeptides: z.array(z.string()).default([]),
    relatedGlossary: z.array(z.string()).default([]),
    sources: z.array(z.object({
      id: z.string(),
      title: z.string(),
      url: z.string().optional(),
      type: z.enum(['journal', 'trial', 'regulatory', 'preprint', 'news']).optional(),
    })).default([]),
    evidenceLevel: z.enum(['known', 'suggestive', 'early', 'unknown']).optional(),
    featured: z.boolean().default(false),
    // Guide-specific fields (optional, used when category is 'guide')
    peptide: z.string().optional(), // Primary peptide this guide is about
    peptideCategory: category.optional(), // metabolic, repair-recovery, etc.
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    // Safety-specific fields (optional, used when category is 'safety')
    relatedPeptidesForSafety: z.array(z.string()).default([]), // Peptides covered in safety article
    ...seoFields,
  }),
});

// NEW: Glossary collection for "what is X" definition pages
const glossary = defineCollection({
  type: 'content',
  schema: z.object({
    term: z.string(),
    definition: z.string().min(100), // Minimum 100 chars for SEO
    aliases: z.array(z.string()).default([]), // Alternative names/spellings
    relatedPeptides: z.array(z.string()).default([]), // Peptide slugs that use this term
    relatedTerms: z.array(z.string()).default([]), // Other glossary term slugs
    category: z.enum(['mechanism', 'administration', 'research', 'regulatory', 'general']).default('general'),
    lastUpdated: z.coerce.date(),
    ...seoFields,
  }),
});

// Clinic collection for local SEO - individual clinic listings
const clinics = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    city: z.string(),
    state: z.string(),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    services: z.array(z.string()),
    peptides: z.array(z.string()).optional(), // peptides they offer
    featured: z.boolean().default(false),
    verifiedListing: z.boolean().default(false),
    description: z.string().optional(),
    ...seoFields,
  }),
});

// City collection for local SEO - city landing pages
const cities = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    state: z.string(),
    stateAbbr: z.string(),
    population: z.number().optional(),
    metaDescription: z.string(),
    content: z.string(), // city-specific content about peptide clinics
    ...seoFields,
  }),
});

// NEW: Protocols collection for multi-peptide research overviews
const studyType = z.enum(['human-rct', 'human-observational', 'animal', 'in-vitro']);

const protocols = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    peptides: z.array(z.string()), // slugs of peptides involved
    researchSummary: z.string(),
    studies: z.array(z.object({
      title: z.string(),
      authors: z.string().optional(),
      year: z.number(),
      pmid: z.string().optional(),
      studyType: studyType,
      dosesUsed: z.string(), // what doses were used in THIS study
      findings: z.string(),
    })),
    mechanism: z.string(), // why these peptides might work together
    safetyNotes: z.string(),
    disclaimer: z.string().default("This information is for educational purposes only. It does not constitute medical advice, treatment recommendations, or dosing guidance. Always consult qualified healthcare providers."),
    lastUpdated: z.coerce.date(),
    ...seoFields,
  }),
});

export const collections = {
  peptides,
  comparisons,
  guides,
  safety,
  pages,
  glossary,
  blog,
  clinics,
  cities,
  protocols,
};
