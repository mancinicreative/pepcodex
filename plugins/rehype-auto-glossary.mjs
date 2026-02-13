/**
 * Rehype plugin: Auto-link glossary terms in rendered markdown content.
 * - Loads glossary terms + aliases from src/content/glossary/ at build time
 * - Links first occurrence per term per page
 * - Skips linking inside <a>, <code>, <pre>, <h1>-<h6>, <script>, <style>
 * - Sorts by length (longest first) to prevent partial matches
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { visit } from 'unist-util-visit';

// Load glossary terms once at build time
const glossaryDir = path.resolve('src/content/glossary');
const terms = [];

if (fs.existsSync(glossaryDir)) {
  for (const file of fs.readdirSync(glossaryDir)) {
    if (!file.endsWith('.mdx') && !file.endsWith('.md')) continue;
    const slug = file.replace(/\.(mdx?|md)$/, '');
    try {
      const { data } = matter(fs.readFileSync(path.join(glossaryDir, file), 'utf-8'));
      const patterns = [data.term, ...(data.aliases || [])]
        .filter(Boolean)
        .filter(t => t.length >= 3) // Skip very short terms to avoid false matches
        .map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

      if (patterns.length > 0) {
        terms.push({ slug, term: data.term, patterns });
      }
    } catch {
      // Skip files that can't be parsed
    }
  }
}

// Sort by longest pattern first to prevent partial matches
terms.sort((a, b) => {
  const aMax = Math.max(...a.patterns.map(p => p.length));
  const bMax = Math.max(...b.patterns.map(p => p.length));
  return bMax - aMax;
});

// Elements to skip — never add links inside these
const SKIP_TAGS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'script', 'style']);

/**
 * Check if a node is inside a skip tag by walking up the tree.
 * Uses the parent references we add during traversal.
 */
function isInsideSkipTag(node) {
  let current = node;
  while (current) {
    if (current.tagName && SKIP_TAGS.has(current.tagName)) return true;
    current = current._parent;
  }
  return false;
}

export default function rehypeAutoGlossary() {
  return (tree, file) => {
    // Skip glossary pages themselves to avoid self-linking
    const filePath = file?.history?.[0] || '';
    if (filePath.includes('glossary')) return;

    if (terms.length === 0) return;

    const linked = new Set(); // Track which terms already linked on this page

    // First pass: add parent references
    visit(tree, (node, _index, parent) => {
      if (parent) {
        node._parent = parent;
      }
    });

    // Second pass: find and replace text nodes
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || !Array.isArray(parent.children)) return;
      if (isInsideSkipTag(node)) return;

      // Try to match each unlinked term
      for (const termEntry of terms) {
        if (linked.has(termEntry.slug)) continue;

        for (const pattern of termEntry.patterns) {
          const regex = new RegExp(`\\b(${pattern})\\b`, 'i');
          const match = node.value.match(regex);
          if (match) {
            const before = node.value.slice(0, match.index);
            const matched = match[0];
            const after = node.value.slice(match.index + matched.length);

            const newNodes = [];
            if (before) newNodes.push({ type: 'text', value: before });
            newNodes.push({
              type: 'element',
              tagName: 'a',
              properties: {
                href: `/glossary/${termEntry.slug}`,
                class: 'glossary-link',
                title: `Glossary: ${termEntry.term}`,
              },
              children: [{ type: 'text', value: matched }],
            });
            if (after) newNodes.push({ type: 'text', value: after });

            parent.children.splice(index, 1, ...newNodes);
            linked.add(termEntry.slug);
            return; // Move to next text node (visitor restarts)
          }
        }
      }
    });

    // Clean up parent references
    visit(tree, (node) => {
      delete node._parent;
    });
  };
}
