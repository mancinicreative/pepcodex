import { defineCollection, z } from 'astro:content';

const evidenceStrength = z.enum(['high', 'moderate', 'low', 'very-low']);
const category = z.enum(['metabolic', 'repair-recovery', 'hormonal', 'longevity', 'cognitive', 'immune', 'other']);

// Shared SEO fields for all content types
const seoFields = {
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonical: z.string().optional(),
  robots: z.enum(['index', 'noindex']).default('index'),
};

const peptides = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    aliases: z.array(z.string()).default([]),
    category: category,
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
    // Related glossary terms for internal linking
    relatedTerms: z.array(z.string()).default([]),
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

// Blog collection for weekly briefings and research news
const blogCategory = z.enum([
  'weekly-briefing',
  'research-digest',
  'deep-dive',
  'regulatory',
  'explainer'
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

export const collections = {
  peptides,
  comparisons,
  guides,
  safety,
  pages,
  glossary,
  blog,
};
