// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://peptide-library.com', // Update with actual domain
  output: 'hybrid', // Enable server-side rendering for API routes
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-light'
    }
  }
});