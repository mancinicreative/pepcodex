// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import rehypeAutoGlossary from './plugins/rehype-auto-glossary.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://pepcodex.com',
  output: 'server',
  adapter: vercel({
    imageService: true,
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    rehypePlugins: [rehypeAutoGlossary],
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});