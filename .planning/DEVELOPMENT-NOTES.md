# Development Notes

This file documents important conventions, common pitfalls, and lessons learned during development.

## Routing & Navigation Checklist

**IMPORTANT**: When adding new routes or navigation links, always ensure:

1. **Index pages exist for every navigable directory**
   - If you add content to `src/content/{collection}/`, ensure `src/pages/{collection}/index.astro` exists
   - If navigation links to `/compare`, there must be a `/compare/index.astro` page
   - Dynamic routes (`[slug].astro` or `[...slug].astro`) alone are NOT enough - users clicking the parent link will get 404

2. **Navigation link paths match actual folder names**
   - Check singular vs plural (e.g., `/guide` vs `/guides`)
   - Check kebab-case vs camelCase
   - Verify links in: header nav, footer, sidebar, breadcrumbs

3. **Before adding navigation links, verify the target route exists**
   - Run `npm run build` to catch missing routes
   - Test all links in the browser

## CSS Import Order

**IMPORTANT**: In `src/styles/global.css`, external `@import url()` statements must come BEFORE `@import "tailwindcss"`:

```css
/* CORRECT */
@import url('https://fonts.googleapis.com/...');
@import "tailwindcss";

/* WRONG - causes styling issues */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/...');
```

## Content Collections Checklist

When adding a new content collection:

1. Define schema in `src/content/config.ts`
2. Create content directory `src/content/{collection}/`
3. Create dynamic route `src/pages/{collection}/[slug].astro` (or `[...slug].astro`)
4. **Create index page `src/pages/{collection}/index.astro`** - Don't forget this!
5. Add navigation links to header/footer as needed

## Current Route Structure

| Navigation Link | Index Page | Dynamic Route |
|-----------------|------------|---------------|
| `/peptides` | `src/pages/peptides/index.astro` | `src/pages/peptides/[slug].astro` |
| `/compare` | `src/pages/compare/index.astro` | `src/pages/compare/[...slug].astro` |
| `/guide` | `src/pages/guide/index.astro` | `src/pages/guide/[...slug].astro` |
| `/safety` | `src/pages/safety/index.astro` | `src/pages/safety/[...slug].astro` |
| `/trials` | `src/pages/trials/index.astro` | - |
| `/category/{name}` | Individual category pages | - |

## Build Verification

After making changes, always run:
```bash
npm run build
```

Check for:
- No errors in build output
- Expected number of pages generated
- No CSS warnings about `@import`
- All content indexed by Pagefind

## Common Pitfalls

1. **Missing index pages** - Navigation links lead to 404
2. **CSS @import order** - Fonts/styles may not load properly
3. **Singular vs plural paths** - `/guide` vs `/guides` mismatch
4. **Content without pages** - Adding MDX without corresponding route
5. **Anchor IDs** - Section navigation requires matching `id` attributes in MDX
