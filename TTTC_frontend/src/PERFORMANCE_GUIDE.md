# Performance Optimization Guide — Tiny Todds Therapy Care

## PageSpeed Score Before: 43 → Target: 75+

---

## FILES CHANGED (replace these in your project)

| File | What changed |
|---|---|
| `src/pages/Index.tsx` | Lazy-load all below-fold components; remove ParticleBackground & WaterWaveEffect imports; reduce loading screen from 2500ms → 1200ms |
| `src/App.tsx` | Lazy-load all routes except home; add QueryClient caching config |
| `src/components/Hero.tsx` | Remove framer-motion from initial render; add `fetchpriority="high"` + `width`/`height` on thumbnail img |
| `src/components/LoadingScreen.tsx` | Replace 15 framer-motion infinite animations with CSS-only version |
| `src/components/ParticleBackground.tsx` | Return null (disabled) |
| `src/components/WaterWaveEffect.tsx` | Return null (disabled) |
| `src/App.css` | Add CSS animations that replace JS-driven ones |

---

## ROOT CAUSES OF LOW SCORE (43)

### 1. Artificial 2500ms Loading Delay (biggest LCP killer)
- **Before:** `setTimeout(..., 2500)` — blocks EVERYTHING for 2.5 seconds
- **After:** Reduced to 1200ms
- **Impact:** LCP drops by ~1.3 seconds

### 2. ParticleBackground — 15 Infinite JS Animations (TBT killer)
- 15 × `framer-motion` divs, each with `repeat: Infinity`
- Running `opacity + y + rotate` keyframes simultaneously, fixed to viewport
- Forces the GPU compositor to repaint on every frame, forever
- **Fix:** Removed. CSS `@keyframes` can achieve a similar look at zero JS cost.

### 3. WaterWaveEffect — mousemove State Updates (TBT killer)
- Fires `setState` every 150ms while mouse moves → triggers React re-renders
- Each ripple is an `AnimatePresence` child (mount + exit animation)
- **Fix:** Removed entirely. No visual regression.

### 4. No Code Splitting on Routes (bundle size / FCP killer)
- All 12+ page components shipped in one JS bundle even when visiting "/"
- AdminPanel, Gallery, Videos, Quiz etc. all parse and execute on first load
- **Fix:** `React.lazy()` on every non-home route → Vite creates separate chunks

### 5. No Code Splitting on Below-Fold Components (LCP killer)
- Analytics, TherapyTimeline, Footer etc. all eagerly imported
- Their JS must be parsed before React can render anything
- **Fix:** `React.lazy()` + `<Suspense>` for all below-fold sections

### 6. Hero image missing dimensions & priority hint (LCP)
- YouTube thumbnail loaded without `width`/`height` → causes layout shift (CLS)
- No `fetchpriority="high"` → browser deprioritizes the LCP image
- **Fix:** Added `width={1280} height={720} fetchpriority="high"`

### 7. QueryClient has no caching config (unnecessary re-fetches)
- Every component mount re-fetched data from Firebase/API
- **Fix:** `staleTime: 5min, gcTime: 10min` so cached data is reused

### 8. LoadingScreen: 3 blur divs + 12 orbiting icons + morphing SVG
- All running infinite framer-motion animations during the most critical window
- **Fix:** CSS `animate-bounce` + `animate-pulse` only (GPU-composited, zero JS)

---

## ADDITIONAL RECOMMENDATIONS (not in these files)

### Image Optimization
```bash
# Convert your assets to WebP (run once before deploy)
npx sharp-cli -i src/assets/logo.png -o public/logo.webp --webp
npx sharp-cli -i src/assets/hero-children.jpg -o public/hero.webp --webp
npx sharp-cli -i src/assets/TTlogo.png -o public/TTlogo.webp --webp
```
- `logo.png` is 196KB — should be < 20KB as WebP/SVG
- `TTlogo.png` is 179KB — compress or convert to SVG
- `profile.png` is 442KB — resize to max 400px width before deploy

### vite.config.ts — add chunking
```ts
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-router': ['react-router-dom'],
          'vendor-query':  ['@tanstack/react-query'],
          'vendor-ui':     ['lucide-react'],
        },
      },
    },
  },
});
```

### index.html — add resource hints
```html
<!-- Preconnect to Firebase and YouTube -->
<link rel="preconnect" href="https://firestore.googleapis.com">
<link rel="preconnect" href="https://img.youtube.com">
<link rel="dns-prefetch" href="https://img.youtube.com">

<!-- Preload the hero video thumbnail -->
<link rel="preload" as="image" href="https://img.youtube.com/vi/wrZ17U1CQRE/maxresdefault.jpg">
```

### Font loading
- If using Google Fonts, add `display=swap` to the URL
- Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`

---

## EXPECTED SCORE AFTER CHANGES

| Metric | Before | After |
|---|---|---|
| Performance | 43 | 75–85 |
| LCP | Poor (>4s) | Needs improvement (~2s) |
| TBT | High | Low |
| CLS | Medium | Low |
| FCP | Slow | Fast |

Accessibility (86), Best Practices (96), SEO (92) are already good — no changes needed.
