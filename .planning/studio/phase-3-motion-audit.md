# Phase 3: Motion & Animation Audit

**Skill:** `/motion-designer`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline (retroactive)

---

## Animation Inventory

### CSS Transitions (Tailwind-based)

The site uses **288 transition instances across 53 files**. All transitions are CSS-based via Tailwind utilities — no JavaScript animation libraries.

**Common patterns:**
| Pattern | Usage | Duration |
|---|---|---|
| `transition-colors` | Nav links, buttons, badges | Default (150ms) |
| `transition-all` | Glass cards, interactive elements | `duration-300` (300ms) |
| `hover:-translate-y-0.5` | Card hover lift | 300ms |
| `hover:bg-white/10` | Nav item hover | 150ms |
| `backdrop-blur-xl` | Glass morphism | — |

### Custom @keyframes Animations (3 total)

1. **`timeline-fade-in`** (Timeline.astro:136)
   - Purpose: Fade in timeline nodes on scroll/load
   - Type: Entrance animation

2. **`node-pulse`** (Timeline.astro:148)
   - Purpose: Pulsing effect on timeline nodes
   - Type: Attention/ambient animation

3. **`quality-slide-down`** (QualityChecklist.astro:215)
   - Purpose: Slide-down reveal of checklist content
   - Type: Expand/collapse animation

### CSS Pseudo-element Animations

1. **Subscribe button shimmer** (BaseLayout.astro)
   ```css
   before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
   before:-translate-x-full hover:before:translate-x-full
   before:transition-transform before:duration-700
   ```
   - 700ms shimmer sweep on hover

### Interactive Micro-interactions

| Interaction | Element | Effect |
|---|---|---|
| Card hover | Glass cards | Lift (-0.5 translate-y) + glow shadow |
| Button hover | Primary buttons | Glow shadow intensifies (sm → lg) |
| Nav active | Nav items | White border + glow ring |
| Category hover | Category cards | Icon color change to primary |
| Stats hover | Stats numbers | Text color transition to primary |
| Mobile menu | Hamburger | Toggle visibility (no animation) |
| Card press | Interactive cards | Scale(0.98) on :active |

---

## Motion Assessment

### Strengths

1. **Consistent duration system** — Most transitions use `duration-300` for interactions, `duration-700` for decorative effects
2. **Subtle, purposeful effects** — Hover states communicate interactivity without being distracting
3. **Glass morphism backbone** — `backdrop-blur-xl` creates depth and visual hierarchy
4. **Glow system** — Three-tier glow (`shadow-glow-sm/md/lg`) creates visual feedback
5. **No heavy animation libraries** — Zero JS animation dependencies, pure CSS

### Concerns

1. **No entrance animations** — Pages load without any content entrance animation (except Timeline). Content appears instantly.
2. **Mobile menu has no transition** — `hidden` class toggles instantly with no slide/fade. Feels abrupt.
3. **No scroll-triggered animations** — Content below the fold has no staggered reveal
4. **No loading states** — API calls (search, subscribe) have no loading spinners or skeleton states
5. **No `prefers-reduced-motion` support** — Users who prefer reduced motion still get all animations
6. **No page transitions** — Navigating between pages is a hard refresh (no View Transitions API)

---

## Motion Design Principles Assessment

| Principle | Score (0-4) | Notes |
|---|---|---|
| Purposefulness | 3 | Hover states are informative, but no loading feedback |
| Consistency | 4 | Same timing/easing across all interactions |
| Subtlety | 4 | Nothing flashy or distracting |
| Performance | 4 | CSS-only, no JS animation overhead |
| Accessibility | 1 | No `prefers-reduced-motion` respect |
| Completeness | 2 | Missing entrance, loading, page transition animations |
| Delight | 2 | Functional but not memorable |

**Overall Motion Score: 20/28 = 71%**

---

## Recommendations for v5.0

### High Priority
1. **Add `prefers-reduced-motion` media query** — Wrap all animations/transitions in `@media (prefers-reduced-motion: no-preference)`
2. **Add loading states** — Skeleton screens or spinners for search results and newsletter submission
3. **Animate mobile menu** — Slide-in or fade transition instead of instant toggle

### Medium Priority
4. **Add entrance animations** — Staggered fade-in for card grids on initial load
5. **Page transitions** — Explore Astro View Transitions API for smooth navigation
6. **Scroll-triggered reveals** — Intersection Observer for below-fold content

### Low Priority
7. **Add micro-interactions** — Subtle animations on evidence badges, rating changes
8. **Newsletter success animation** — Confetti or checkmark animation on successful subscribe
9. **Search result animations** — Staggered result appearance

---

## Gate Assessment

- [x] All animations inventoried (3 keyframes, 288 transitions)
- [x] Motion patterns assessed against design principles
- [x] Accessibility gap identified (prefers-reduced-motion)
- [x] Recommendations prioritized

**Phase 3 Motion Gate: PASS (with accessibility concern for v5.0)**
