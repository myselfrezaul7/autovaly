# Autovaly — Comprehensive Site Audit & Polish Plan (`PLAN.md`)

This document contains the complete, prioritized engineering plan resulting from a full-codebase audit across all 7 audit areas:
1. **Bugs & Broken Functionality** (links, forms, console/runtime errors, missing assets)
2. **Mobile Responsiveness** (`360px`, `768px`, `1280px` viewports)
3. **Performance** (image sizes, local vs. remote assets, WebGL lifecycle, re-renders)
4. **SEO** (titles, meta descriptions, Open Graph, headings, alt text, sitemap, RSS feed)
5. **Accessibility** (contrast, light/dark visibility, ARIA roles/labels, keyboard navigation, focus states)
6. **Design Consistency** (spacing, typography, theme tokens, badges, buttons)
7. **Code Quality** (duplicate logic, state synchronization, memory safety)

Every task below is **small, self-contained, and executable in a single edit session** with zero design guesswork.

---

## Rules

1. **Keep the existing design style**: Preserve Autovaly's dark-first automotive editorial aesthetic (`#0D0D0D` / `#161616` dark surfaces, `#FAFAFA` / `#F0F0F2` light surfaces, `#E84118` racing red accent, `#D4AF37` heritage gold accent, `Oswald` headings, `Inter` body copy).
2. **No new libraries unless listed**: Do not install any new `npm` packages. Use existing utilities (`lucide-react`, `framer-motion`, `zod`, Next.js primitives, and Tailwind v4 classes).
3. **No refactors outside the task**: Only modify the exact lines and files specified in each task. Do not rename exports, move files, or reformat unrelated code.
4. **Always verify**: Run `npm run typecheck` after completing any TypeScript edit to confirm zero compiler errors.

---

## Do Not Touch

Keep the following files, systems, and styles exactly as they are:
- **`src/app/globals.css`**: Do not alter the `@theme` token definitions, custom CSS variables (`--bg-dark`, `--bg-surface`, `--text-light`, `--text-muted`, `--accent`, `--accent-gold`, `--border-custom`), `.grain-overlay`, or `.touch-press` utilities.
- **`src/components/ThemeScript.tsx`**: Keep the inline blocking theme initialization script untouched.
- **`src/lib/data/vehicles-existing.ts`, `src/lib/data/vehicles-modern.ts`, `src/lib/data/vehicles-retro.ts`, `src/lib/data/vehicles.ts`**: All 74 vehicle records and their local `/images/vehicles/*.jpg` paths are verified on disk and must not be altered.
- **`src/lib/data/comparisons.ts`**: All 15 comparison records (`c1`–`c15`) and their 30 vehicle slugs are valid and must not be altered.
- **`src/lib/data/ticker.ts`**: All 12 live ticker items (`t1`–`t12`) and their URLs are valid and must not be altered.
- **`src/lib/data/classic-spotlight.ts`**: All 18 classic spotlight records and their local `/images/vehicles/*.jpg` paths are valid and must not be altered.
- **`src/components/3d/AeroStudioCanvas.tsx`, `src/components/3d/DragBattleCanvas.tsx`, `src/components/3d/GarageVaultCanvas.tsx`, `src/components/3d/HeroParticleCanvas.tsx`**: Core Three.js shaders, procedural car geometry, physics calculations, and `IntersectionObserver` pause loops must not be refactored (only touch the specific HUD/lifecycle lines explicitly listed in tasks below).

---

## Priority 1: High Priority Tasks (Bugs, Broken Links, Keyboard Hijacking & Mobile Collisions)

---

### Task `HIGH-01` [COMPLETED]: Fix 4 Broken 404 Links and 3 External Unsplash Images in `EVSpotlight`
- **Category**: Bugs & Broken Links / Performance
- **Exact File**: `src/lib/data/ev-spotlight.ts`
- **Why**: `src/components/EVSpotlight.tsx` (line 19) links every card to `/articles/${ev.slug}`. However, `ev4` (`"lucid-air-sapphire"`), `ev5` (`"rimac-nevera"`), `ev6` (`"rivian-r1s-quad"`), and `ev7` (`"porsche-taycan-turbo-gt"`) do not match any article slug in `src/lib/data/articles.ts`—clicking any of those 4 cards on the homepage results in a **404 Not Found**. Furthermore, `ev1`, `ev2`, and `ev3` still reference external `images.unsplash.com` URLs instead of local `/images/vehicles/*.jpg` assets.
- **Exact Changes**:
  1. In `src/lib/data/ev-spotlight.ts`, line 12 (`id: "ev1"`), replace:
     ```ts
     coverImage: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80",
     ```
     with:
     ```ts
     coverImage: "/images/vehicles/porsche-taycan-4s.jpg",
     ```
  2. In `src/lib/data/ev-spotlight.ts`, line 22 (`id: "ev2"`), replace:
     ```ts
     coverImage: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
     ```
     with:
     ```ts
     coverImage: "/images/vehicles/audi-etron-gt.jpg",
     ```
  3. In `src/lib/data/ev-spotlight.ts`, line 32 (`id: "ev3"`), replace:
     ```ts
     coverImage: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
     ```
     with:
     ```ts
     coverImage: "/images/vehicles/xiaomi-su7-ultra.jpg",
     ```
  4. In `src/lib/data/ev-spotlight.ts`, update the `slug` fields for `ev4`, `ev5`, `ev6`, and `ev7` to match existing EV articles in `src/lib/data/articles.ts`:
     - Line 36 (`ev4`): change `slug: "lucid-air-sapphire",` to `slug: "lucid-air-sapphire-vs-tesla-model-s-plaid",`
     - Line 46 (`ev5`): change `slug: "rimac-nevera",` to `slug: "nurburgring-2026-production-lap-records",`
     - Line 56 (`ev6`): change `slug: "rivian-r1s-quad",` to `slug: "best-electric-suvs-2026",`
     - Line 66 (`ev7`): change `slug: "porsche-taycan-turbo-gt",` to `slug: "solid-state-battery-breakthrough-2026",`
- **Done when**: Every item in `evSpotlightItems` uses a local `/images/vehicles/*.jpg` image and its `slug` matches an existing article in `src/lib/data/articles.ts` so clicking any card in the homepage EV Spotlight section opens a valid `/articles/[slug]` page without 404.

---

### Task `HIGH-02` [COMPLETED]: Stop `KeyboardShortcuts` from Hijacking `Ctrl+C` / `Cmd+C` (Copy)
- **Category**: Bugs / Accessibility
- **Exact File**: `src/components/ui/KeyboardShortcuts.tsx`
- **Why**: The global `keydown` listener checks `case "c":` without checking `e.ctrlKey || e.metaKey || e.altKey`. When a user highlights text anywhere on the site and presses `Ctrl+C` or `Cmd+C` to copy, `e.preventDefault()` fires and navigates them away to `/compare`. It also fails to ignore `<select>` or `isContentEditable` elements.
- **Exact Changes**:
  In `src/components/ui/KeyboardShortcuts.tsx`, replace lines 10–25:
  ```tsx
      function handleKeyDown(e: KeyboardEvent) {
        // Ignore if user is typing in an input or textarea
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }

        // Ignore if search modal is open (handled by SearchModal itself)
        if (document.querySelector('[role="dialog"]')) {
          return;
        }

        switch (e.key.toLowerCase()) {
  ```
  with:
  ```tsx
      function handleKeyDown(e: KeyboardEvent) {
        // Never intercept browser/OS shortcuts like Ctrl+C, Cmd+C, Alt+Left, etc.
        if (e.metaKey || e.ctrlKey || e.altKey) {
          return;
        }

        // Ignore if user is interacting with a form control or editable area
        const target = e.target as HTMLElement | null;
        if (
          !target ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }

        // Ignore if any modal dialog is open
        if (document.querySelector('[role="dialog"]')) {
          return;
        }

        switch (e.key.toLowerCase()) {
  ```
- **Done when**: Pressing `Ctrl+C` or `Cmd+C` copies selected text normally without navigating to `/compare`, while pressing bare `c`, `g`, `v`, or `/` outside inputs still triggers shortcuts.

---

### Task `HIGH-03` [COMPLETED]: Fix Mobile & Tablet (`360px` / `768px`) Fixed-Bottom UI Collisions
- **Category**: Mobile Responsiveness (`360px`, `768px`) / Bugs
- **Exact Files**:
  - `src/components/DomainSaleModal.tsx`
  - `src/components/ui/ScrollEnhancements.tsx`
  - `src/components/ui/ReadingProgress.tsx`
  - `src/components/ui/CookieConsent.tsx`
  - `src/app/vehicles/[slug]/page.tsx`
- **Why**:
  1. `MobileNav` (`src/components/ui/MobileNav.tsx` line 55) is visible on all screens below `1024px` (`lg:hidden`, `h-[58px]`, `fixed bottom-0 z-50`). Yet `DomainSaleModal` pill (`md:bottom-6`), `ScrollEnhancements` Back-to-Top (`md:bottom-8`), and `CookieConsent` (`md:bottom-6`) drop down at `md:` (`768px`) instead of `lg:` (`1024px`), overlapping `MobileNav` on tablets (`768px–1023px`).
  2. At `360px` width, `DomainSaleModal` pill (`bottom-20 left-4`, ~295px wide with long text) collides horizontally with `ScrollEnhancements` Back-to-Top (`bottom-[76px] right-4`, `44px` wide).
  3. On `/vehicles/[slug]`, the hero CTA bar (`src/app/vehicles/[slug]/page.tsx` line 133) uses `fixed bottom-[60px] left-0 right-0 z-40 ... md:static`, creating a ~160px tall fixed footer overlay on mobile that covers page content and collides with floating controls.
  4. On `/articles/[slug]`, `ReadingProgress.tsx` (`fixed bottom-24 right-6 z-40`) overlaps `ScrollEnhancements` Back-to-Top (`bottom-[76px] right-4 z-40`).
- **Exact Changes**:
  1. In `src/components/DomainSaleModal.tsx` (lines 299–309), shorten the mobile pill label and use `lg:bottom-6`:
     Replace:
     ```tsx
            className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-surface/90 dark:bg-black/85 backdrop-blur-xl border border-accent-gold/40 shadow-xl hover:border-accent-gold hover:scale-105 transition-all cursor-pointer text-xs font-heading font-bold uppercase tracking-wider text-text-light"
            aria-label="Domain and platform for sale - make an offer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold" />
            </span>
            <span>Domain &amp; Site For Sale • Make Offer</span>
          </m.button>
     ```
     with:
     ```tsx
            className="fixed bottom-20 lg:bottom-6 left-4 lg:left-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-surface/95 dark:bg-black/85 backdrop-blur-xl border border-accent-gold/40 shadow-xl hover:border-accent-gold hover:scale-105 transition-all cursor-pointer text-[11px] sm:text-xs font-heading font-bold uppercase tracking-wider text-text-light max-w-[calc(100vw-5.5rem)]"
            aria-label="Domain and platform for sale - make an offer"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold" />
            </span>
            <span className="truncate sm:hidden">For Sale • Make Offer</span>
            <span className="hidden sm:inline">Domain &amp; Site For Sale • Make Offer</span>
          </m.button>
     ```
  2. In `src/components/ui/ScrollEnhancements.tsx` (line 42), change `bottom-[76px] md:bottom-8 right-4 md:right-8` to `bottom-20 lg:bottom-8 right-4 lg:right-8`.
  3. In `src/components/ui/ReadingProgress.tsx` (line 36), move the reading time pill above the back-to-top button and hide it on extra-small screens where space is tight:
     Replace:
     ```tsx
          <div className="fixed bottom-24 right-6 z-40 bg-surface/90 backdrop-blur-md border border-border-custom px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-light animate-fade-in">
     ```
     with:
     ```tsx
          <div className="hidden sm:flex fixed bottom-36 lg:bottom-24 right-4 lg:right-8 z-30 bg-surface/90 backdrop-blur-md border border-border-custom px-4 py-2 rounded-full shadow-2xl items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-light animate-fade-in">
     ```
  4. In `src/components/ui/CookieConsent.tsx` (line 84), change `fixed bottom-[76px] md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50` to `fixed bottom-20 lg:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50`.
  5. In `src/app/vehicles/[slug]/page.tsx` (line 133), keep the CTA action bar in normal document flow on mobile instead of fixing it over the viewport:
     Replace:
     ```tsx
              <div className="fixed bottom-[60px] left-0 right-0 p-3 bg-surface/95 backdrop-blur-xl border-t border-border-custom z-40 flex flex-col sm:flex-row gap-3 md:static md:bg-transparent md:border-none md:p-0 md:backdrop-blur-none">
     ```
     with:
     ```tsx
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
     ```
- **Done when**: At `360px` and `768px` viewports across `/`, `/vehicles/[slug]`, and `/articles/[slug]`, zero floating pills, back-to-top buttons, cookie banners, or CTA bars overlap each other or `MobileNav`.

---

### Task `HIGH-04` [COMPLETED]: Fix Mobile Drawer Currency Switcher Buttons in `Navbar.tsx`
- **Category**: Bugs
- **Exact File**: `src/components/Navbar.tsx`
- **Why**: In the mobile slide-over drawer (lines 274 & 283), both the `EUR (€)` and `USD ($)` buttons call `onClick={toggleCurrency}`. If `currency` is already `"EUR"` and the user taps `EUR (€)`, it toggles the currency to `"USD"`.
- **Exact Changes**:
  1. In `src/components/Navbar.tsx` (line 30), destructure `setCurrency` from `useCurrency()`:
     Replace:
     ```tsx
     const { currency, toggleCurrency } = useCurrency();
     ```
     with:
     ```tsx
     const { currency, toggleCurrency, setCurrency } = useCurrency();
     ```
  2. In `src/components/Navbar.tsx` (lines 272–290), replace `onClick={toggleCurrency}` on the two buttons with explicit `setCurrency("EUR")` and `setCurrency("USD")` and add `aria-pressed`:
     ```tsx
                    <button
                      onClick={() => setCurrency("EUR")}
                      aria-pressed={currency === "EUR"}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        currency === "EUR"
                          ? "bg-accent text-white shadow-sm"
                          : "text-text-muted hover:text-text-light"
                      }`}
                    >
                      EUR (€)
                    </button>
                    <button
                      onClick={() => setCurrency("USD")}
                      aria-pressed={currency === "USD"}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        currency === "USD"
                          ? "bg-accent text-white shadow-sm"
                          : "text-text-muted hover:text-text-light"
                      }`}
                    >
                      USD ($)
                    </button>
     ```
- **Done when**: Clicking `EUR (€)` in the mobile menu always sets currency to `EUR`, and clicking `USD ($)` always sets currency to `USD`.

---

### Task `HIGH-05` [COMPLETED]: Fix Unintended Vertical Page Scroll Jump on Mount in `BySegment.tsx`
- **Category**: Bugs / UX
- **Exact File**: `src/components/BySegment.tsx`
- **Why**: `BySegment` is dynamically loaded below the fold on the homepage. Its `useEffect` (lines 16–28) calls `activeTabEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })` immediately on initial mount (`activeSegment` starts at `"Sports Cars"`), which yanks the browser's vertical scroll position down to the `#segments` section while the user is reading the top of the page.
- **Exact Changes**:
  In `src/components/BySegment.tsx`, replace lines 13–28:
  ```tsx
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = SEGMENTS.indexOf(activeSegment);
    const activeTabEl = tabRefs.current[activeIndex];
    if (activeTabEl) {
      activeTabEl.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSegment]);
  ```
  with:
  ```tsx
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const activeIndex = SEGMENTS.indexOf(activeSegment);
    const activeTabEl = tabRefs.current[activeIndex];
    const container = activeTabEl?.parentElement;
    if (activeTabEl && container) {
      const targetLeft =
        activeTabEl.offsetLeft - container.clientWidth / 2 + activeTabEl.clientWidth / 2;
      container.scrollTo({ left: targetLeft, behavior: "smooth" });
    }
  }, [activeSegment]);
  ```
- **Done when**: Loading `/` and scrolling down never causes an automatic vertical jump to `#segments`, and clicking segment tabs smoothly centers the clicked tab horizontally inside the tab bar.

---

### Task `HIGH-06` [COMPLETED]: Fix `CompareSpecs` Zero-Value Winner Bug, Broken Sticky Header & `360px` Cell Overflow
- **Category**: Bugs / Mobile Responsiveness (`360px`)
- **Exact File**: `src/components/CompareSpecs.tsx`
- **Why**:
  1. `getWinner(valA, valB, lowerIsBetter)` (lines 19–23) does not guard against `0` (used for missing/N/A metrics). When `lowerIsBetter = true` (e.g., 0–60 time or weight) and one car has `0`, `0 < valB` evaluates to `true` and crowns `0` as the winner.
  2. Line 188 sets `overflow-hidden` on the outer table wrapper, which disables `position: sticky` on the comparison header (`line 190: sticky top-0 z-20`).
  3. At `360px` width, the 3-column grid (`grid-cols-3`) uses `p-4` and `text-lg md:text-xl`, causing long labels (`"10-80% Charging"`, `"Combined Efficiency"`) and formatted prices to overflow horizontally.
- **Exact Changes**:
  1. In `src/components/CompareSpecs.tsx`, replace lines 19–23:
     ```tsx
     function getWinner(valA?: number, valB?: number, lowerIsBetter = false): "A" | "B" | "TIE" | null {
       if (valA === undefined || valB === undefined) return null;
       if (valA === valB) return "TIE";
       if (lowerIsBetter) return valA < valB ? "A" : "B";
       return valA > valB ? "A" : "B";
     }
     ```
     with:
     ```tsx
     function getWinner(valA?: number, valB?: number, lowerIsBetter = false): "A" | "B" | "TIE" | null {
       if (valA === undefined || valB === undefined || valA <= 0 || valB <= 0) return null;
       if (valA === valB) return "TIE";
       if (lowerIsBetter) return valA < valB ? "A" : "B";
       return valA > valB ? "A" : "B";
     }
     ```
  2. In `src/components/CompareSpecs.tsx` (line 188), change `overflow-hidden` to `overflow-clip`:
     ```tsx
     <div className="bg-surface border border-border-custom rounded-3xl overflow-clip shadow-2xl">
     ```
  3. In `src/components/CompareSpecs.tsx` (line 190), change `sticky top-0 z-20` to `sticky top-16 z-20` so it sticks cleanly below the fixed `h-16` `Navbar`.
  4. In `src/components/CompareSpecs.tsx` (lines 191, 200, 211, 240, 250, 260), update cell padding and font sizes for `360px` screens:
     - Line 191 (`p-4 md:p-6`): change to `p-2.5 sm:p-4 md:p-6`
     - Lines 200 & 211 (`p-4 md:p-6`): change to `p-2.5 sm:p-4 md:p-6`
     - Line 240 (`p-4 md:p-6 text-xs md:text-sm`): change to `p-2.5 sm:p-4 md:p-6 text-[11px] sm:text-xs md:text-sm break-words`
     - Lines 250 & 260 (`p-4 md:p-6 text-center font-heading text-lg md:text-xl`): change to `p-2.5 sm:p-4 md:p-6 text-center font-heading text-sm sm:text-lg md:text-xl break-words`
- **Done when**: Missing/zero specs never win a comparison category, the vehicle names header sticks below the navbar while scrolling the spec table, and all 3 columns fit within a `360px` viewport without clipping.

---

### Task `HIGH-07` [COMPLETED]: Fix Missing "No Results" Empty State in `SearchModal.tsx` and `SearchClientHub.tsx`
- **Category**: Bugs
- **Exact Files**:
  - `src/components/SearchModal.tsx`
  - `src/components/SearchClientHub.tsx`
  - `src/app/search/page.tsx`
- **Why**:
  1. `SearchModal.tsx` (line 148) checks `query.trim().length > 0 && (articleResults.length > 0 || vehicleResults.length > 0)` before rendering `<SearchResults />`. When a user types a query with 0 matches (e.g., `"bugatti"`), `<SearchResults />` (which contains the `"No results found"` UI) is skipped and the modal body goes completely blank.
  2. `SearchClientHub.tsx` (line 189) only shows the empty state when `totalResults === 0`. If a query matches 2 articles and 0 vehicles, clicking the `"Vehicles (0)"` tab renders a blank white/dark void. Also, `useEffect` (lines 30–35) only syncs `query` when `initialQuery` is truthy (`if (initialQuery) setQuery(initialQuery)`), failing to clear when navigating to `/search`.
  3. `src/app/search/page.tsx` (lines 26–33) does not sanitize `params.q` / `params.segment` using `searchQuerySchema` from `src/lib/validators.ts`.
- **Exact Changes**:
  1. In `src/components/SearchModal.tsx` (line 148), replace:
     ```tsx
     {query.trim().length > 0 && (articleResults.length > 0 || vehicleResults.length > 0) ? (
     ```
     with:
     ```tsx
     {query.trim().length > 0 ? (
     ```
  2. In `src/components/SearchClientHub.tsx` (lines 30–35), replace:
     ```tsx
     useEffect(() => {
       if (initialQuery) setQuery(initialQuery);
       if (initialSegment) setSelectedSegment(initialSegment);
     }, [initialQuery, initialSegment]);
     ```
     with:
     ```tsx
     useEffect(() => {
       setQuery(initialQuery);
       setSelectedSegment(initialSegment);
     }, [initialQuery, initialSegment]);
     ```
  3. In `src/components/SearchClientHub.tsx` (line 189), replace:
     ```tsx
     {totalResults === 0 ? (
     ```
     with:
     ```tsx
     {(tabs.find((t) => t.id === activeTab)?.count ?? 0) === 0 ? (
     ```
  4. In `src/app/search/page.tsx`, import `searchQuerySchema` from `@/lib/validators` and sanitize `params`:
     Replace lines 25–34:
     ```tsx
     export default async function SearchPage({ searchParams }: SearchPageProps) {
       const params = await searchParams;
       const initialQuery = typeof params.q === "string" ? params.q : "";
       const initialSegment = typeof params.segment === "string" ? params.segment : "All";
     ```
     with:
     ```tsx
     import { searchQuerySchema } from "@/lib/validators";
     ```
     (at top of file) and inside `SearchPage`:
     ```tsx
     export default async function SearchPage({ searchParams }: SearchPageProps) {
       const params = await searchParams;
       const parsed = searchQuerySchema.safeParse({
         q: typeof params.q === "string" ? params.q : undefined,
         segment: typeof params.segment === "string" ? params.segment : undefined,
       });
       const initialQuery = parsed.success ? parsed.data.q : "";
       const initialSegment = parsed.success && parsed.data.segment ? parsed.data.segment : "All";
     ```
- **Done when**: Typing a non-matching query into `SearchModal` displays `"No results found for..."`, and clicking a `0`-count tab on `/search` displays the empty state instead of a blank screen.

---

### Task `HIGH-08` [COMPLETED]: Fix Light-Mode Text & Input Contrast Bugs (`compare/custom`, `ArticleCard`, `DomainSaleModal`)
- **Category**: Accessibility / Design Consistency
- **Exact Files**:
  - `src/app/compare/custom/page.tsx`
  - `src/components/ui/ArticleCard.tsx`
  - `src/components/DomainSaleModal.tsx`
- **Why**:
  1. In `src/app/compare/custom/page.tsx` (line 86), the empty/error state `<h1>` has `text-white` on `bg-background` (`#FAFAFA` in light mode), rendering white text on a white background.
  2. In `src/components/ui/ArticleCard.tsx` (line 124), the `portrait` card variant renders the author name with `text-text-light` (`#111111` in light mode) on top of a dark `from-black/90` image overlay, making the author name nearly invisible in light mode.
  3. In `src/components/DomainSaleModal.tsx` (lines 75, 108, 121, 165, 190, 204, 219, 232, 260), buttons and form inputs use `bg-white/5 border-white/10`, which are invisible against the light-mode `bg-surface/95` (`#F0F0F2`) modal surface.
- **Exact Changes**:
  1. In `src/app/compare/custom/page.tsx` (line 86), change `text-white` to `text-text-light`:
     ```tsx
     <h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-wider mb-4 text-text-light">
     ```
  2. In `src/components/ui/ArticleCard.tsx` (line 124), change `text-text-light` to `text-white`:
     ```tsx
     <div className="text-xs text-white/75 mt-auto">By <span className="text-white font-medium">{article.author.name}</span> · {article.readingTime} min read</div>
     ```
  3. In `src/components/DomainSaleModal.tsx`:
     - Line 75 (Close button): replace `bg-white/5 hover:bg-white/10 text-text-muted hover:text-white` with `bg-background/80 dark:bg-white/5 hover:bg-border-custom dark:hover:bg-white/10 text-text-muted hover:text-text-light border border-border-custom`
     - Line 92 (Value chips): replace `bg-white/5 border border-border-custom` with `bg-background/70 dark:bg-white/5 border border-border-custom`
     - Line 108 (Tab bar): replace `bg-black/20 dark:bg-white/5 border border-border-custom` with `bg-background/80 dark:bg-white/5 border border-border-custom`
     - Line 165 (Preset buttons inactive state): replace `bg-white/5 border-border-custom text-text-muted hover:text-text-light hover:border-white/20` with `bg-background/70 dark:bg-white/5 border-border-custom text-text-muted hover:text-text-light hover:border-accent/40`
     - Lines 190, 204, 219, 232 (Form inputs/textarea): replace `bg-black/20 dark:bg-white/5` with `bg-background dark:bg-white/5`
     - Line 260 (Direct email box): replace `bg-black/20 dark:bg-white/5` with `bg-background/80 dark:bg-white/5`
- **Done when**: Switching to Light Mode shows crisp, high-contrast headings, borders, inputs, and card text across `/compare/custom`, `EditorsPicks` portrait cards, and `DomainSaleModal`.

---

### Task `HIGH-09` [COMPLETED]: Connect Footer `/contact?type=advertising` Deep Link to `ContactForm`
- **Category**: Bugs & Broken Links
- **Exact Files**:
  - `src/app/contact/page.tsx`
  - `src/components/ContactForm.tsx`
- **Why**: `Footer.tsx` (line 97) links `"Advertising"` to `/contact?type=advertising`, but `ContactPage` and `ContactForm` ignore URL query parameters and always default the `"Inquiry Type"` dropdown to `"General Inquiry"`.
- **Exact Changes**:
  1. In `src/components/ContactForm.tsx`:
     - Update the component signature (line 8) to accept `initialSubject?: string`:
       ```tsx
       const SUBJECT_MAP: Record<string, string> = {
         advertising: "Advertising & Partnerships",
         correction: "Vehicle Spec Correction",
         press: "Press / Media Release",
         feedback: "Website Feedback / Bug",
         general: "General Inquiry",
       };

       export default function ContactForm({ initialSubject }: { initialSubject?: string }) {
         const resolvedSubject =
           (initialSubject && SUBJECT_MAP[initialSubject.toLowerCase()]) || "General Inquiry";
       ```
     - On the `<select id="subject" name="subject">` element (line 80), add `defaultValue={resolvedSubject}`:
       ```tsx
       <select
         id="subject"
         name="subject"
         defaultValue={resolvedSubject}
         className="w-full px-4 py-3.5 bg-background border border-border-custom rounded-xl text-sm text-text-light focus:outline-none focus:border-accent transition-colors"
       >
       ```
  2. In `src/app/contact/page.tsx`:
     - Update `ContactPage` (line 20) to read `searchParams` and pass `type` to `<ContactForm />`:
       ```tsx
       export default async function ContactPage({
         searchParams,
       }: {
         searchParams: Promise<{ type?: string }>;
       }) {
         const params = await searchParams;
       ```
     - On line 82, replace `<ContactForm />` with `<ContactForm initialSubject={params.type} />`.
- **Done when**: Clicking `"Advertising"` in the footer navigates to `/contact?type=advertising` with `"Advertising & Partnerships"` pre-selected in the Inquiry Type dropdown.

---

### Task `HIGH-10` [COMPLETED]: Fix Chronological Sorting & Duplicate `heroArticle` in `content.ts` and `articles.ts`
- **Category**: Bugs / Data Integrity
- **Exact Files**:
  - `src/lib/content.ts`
  - `src/lib/data/articles.ts`
- **Why**:
  1. In `src/lib/content.ts`, `sortedArticles` is sorted newest-first on lines 14–16, but `getHeroArticle()`, `getHeroArticles()`, `getTopStories()`, `getArticlesBySegment()`, `getEditorsPicks()`, `getRelatedArticles()`, and `searchArticles()` (lines 34–86) filter the raw unsorted `articles` array instead of `sortedArticles`. Because `articles.ts` stores `c1`–`c18` (Jan–Feb 2026) before `a1`–`a17` (Jun–Jul 2026), filtering `articles` returns older Jan 2026 articles ahead of newer Jul 2026 articles.
  2. In `src/lib/data/articles.ts`, two articles have `heroArticle: true` (`a29` on line 38 and `a17` on line 951).
- **Exact Changes**:
  1. In `src/lib/content.ts` (lines 34–86), replace every occurrence of `articles.find` and `articles.filter` inside `getHeroArticle`, `getHeroArticles`, `getTopStories`, `getArticlesBySegment`, `getEditorsPicks`, `getRelatedArticles`, and `searchArticles` with `sortedArticles.find` and `sortedArticles.filter` (and replace `articles[0]` fallback on line 35 with `sortedArticles[0]`).
  2. In `src/lib/data/articles.ts` (line 951, inside article `a17` `"ev-market-2026-whats-changed"`), change `heroArticle: true` to `heroArticle: false`.
- **Done when**: All article feeds (`TopStories`, `BySegment`, `EditorsPicks`, `RelatedArticles`, `Search`) return articles strictly ordered from newest to oldest `publishedAt` date.

---

### Task `HIGH-11` [COMPLETED]: Fix WAF False Positive on Search Queries in `src/proxy.ts`
- **Category**: Bugs / Security
- **Exact File**: `src/proxy.ts`
- **Why**: On line 225, `const fullUrl = pathname + search;` is passed to `isMaliciousPattern(fullUrl)`, which checks `SENSITIVE_PROBE_PATTERNS` (including `".env"`, `".sql"`, `".bak"`, `".old"`). If a user searches `/search?q=.sql` or has a query parameter containing `.old`, the WAF blocks the request with `403 Access Denied`. Path probe patterns belong on `pathname`, while SQLi/XSS injection patterns (`INJECTION_PATTERNS`) and traversal (`PATH_TRAVERSAL_PATTERNS`) should check `fullUrl`.
- **Exact Changes**:
  In `src/proxy.ts`, replace lines 77–86:
  ```ts
  function isMaliciousPattern(input: string): boolean {
    const decoded = safeDecode(input);
    return (
       matchesAny(decoded, PATH_TRAVERSAL_PATTERNS) ||
      matchesAny(decoded, SENSITIVE_PROBE_PATTERNS) ||
      matchesAny(decoded, INJECTION_PATTERNS)
    );
  }
  ```
  with:
  ```ts
  function isMaliciousPattern(pathname: string, search: string): boolean {
    const decodedPath = safeDecode(pathname);
    const decodedFull = safeDecode(pathname + search);
    return (
      matchesAny(decodedPath, SENSITIVE_PROBE_PATTERNS) ||
      matchesAny(decodedFull, PATH_TRAVERSAL_PATTERNS) ||
      matchesAny(decodedFull, INJECTION_PATTERNS)
    );
  }
  ```
  And on line 226, replace `if (isMaliciousPattern(fullUrl))` with `if (isMaliciousPattern(pathname, search))`.
- **Done when**: Navigating to `/.env` or `/wp-admin` still returns `403 Access Denied`, while searching `/search?q=.old` works without a false-positive 403 block.

---

### Task `HIGH-12` [COMPLETED]: Wrap `CookieConsent` Storage Access in `try/catch` & Fix Service Worker Registration in `Providers.tsx`
- **Category**: Bugs / Browser Compatibility
- **Exact Files**:
  - `src/components/ui/CookieConsent.tsx`
  - `src/components/Providers.tsx`
- **Why**:
  1. `CookieConsent.tsx` calls `localStorage.getItem` (line 25) and `localStorage.setItem` (lines 51, 58, 63) without `try/catch`. In Safari Private Browsing or strict iframe/storage-blocked contexts, this throws an unhandled `SecurityError` and crashes the client tree.
  2. `Providers.tsx` (lines 16–22) attaches `window.addEventListener("load", ...)` inside `useEffect`. Because React hydration frequently completes *after* the browser's `window.onload` event has already fired, the Service Worker registration callback never executes on many page loads.
- **Exact Changes**:
  1. In `src/components/ui/CookieConsent.tsx`, wrap line 25 `localStorage.getItem(CONSENT_KEY)` and lines 51, 58, 63 `localStorage.setItem(CONSENT_KEY, ...)` in `try { ... } catch { /* ignore storage errors */ }` blocks.
  2. In `src/components/Providers.tsx`, replace lines 15–23:
     ```tsx
       useEffect(() => {
         if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
           window.addEventListener("load", () => {
             navigator.serviceWorker.register("/sw.js").catch((err) => {
               console.error("ServiceWorker registration failed:", err);
             });
           });
         }
       }, []);
     ```
     with:
     ```tsx
       useEffect(() => {
         if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
           const registerSw = () => {
             navigator.serviceWorker.register("/sw.js").catch((err) => {
               console.error("ServiceWorker registration failed:", err);
             });
           };
           if (document.readyState === "complete") {
             registerSw();
           } else {
             window.addEventListener("load", registerSw, { once: true });
             return () => window.removeEventListener("load", registerSw);
           }
         }
       }, []);
     ```
- **Done when**: `CookieConsent` never throws when `localStorage` is disabled, and `Providers.tsx` reliably registers `/sw.js` even when hydrated after `window.load`.

---

### Task `HIGH-13` [COMPLETED]: Fix Web3Forms Cloudflare 403 Block on Domain Acquisition Offer, Contact & Newsletter Submissions
- **Category**: Bugs & Broken Forms
- **Exact Files**:
  - `src/app/actions/domain-offer.ts`
  - `src/components/DomainSaleModal.tsx`
  - `src/app/actions/contact.ts`
  - `src/components/ContactForm.tsx`
  - `src/app/actions/newsletter.ts`
  - `src/components/Newsletter.tsx`
- **Why**:
  1. Web3Forms (`https://api.web3forms.com/submit`, access key `3281e53d-d6de-433b-ac48-98dc9f829145`) is protected by Cloudflare Bot Fight Mode on its Free Plan, which blocks all server-side Node.js `fetch()` calls with an HTML `403 Forbidden` challenge (`<!DOCTYPE html>...<title>Just a moment...</title>`).
  2. Calling `await response.json()` inside the server actions (`submitDomainOffer`, `submitContactForm`, `subscribeNewsletter`) throws `SyntaxError: Unexpected token '<'` on that HTML 403 response, causing `"An unexpected error occurred. Please try again later."` when users click `"Submit Acquisition Offer"`.
  3. Web3Forms requires the final `POST` to `https://api.web3forms.com/submit` to originate from the client browser (`connect-src 'self' https://api.web3forms.com` is already enabled in `src/proxy.ts`).
- **Exact Changes**:
  1. In `src/app/actions/domain-offer.ts`, `src/app/actions/contact.ts`, and `src/app/actions/newsletter.ts`:
     - Keep all server-side security checks intact: honeypot verification (`_hp_domain_offer`, `_hp_company`, `_hp_code`), IP rate limiting (`rateLimit`), and Zod input sanitization (`domainOfferSchema`, `contactSchema`, `newsletterSchema`).
     - Instead of calling `fetch("https://api.web3forms.com/submit")` from Node.js, return `{ success: true as const, web3Payload: { access_key: WEB3FORMS_KEY, ... }, message: "..." }` when validation passes (or `{ success: true as const, botBlocked: true as const }` if honeypot is triggered).
  2. In `src/components/DomainSaleModal.tsx`, `src/components/ContactForm.tsx`, and `src/components/Newsletter.tsx`:
     - First call the server action to validate, sanitize, and rate-limit the submission.
     - When `result.success` is `true` and `"web3Payload" in result && result.web3Payload` is present, execute `fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(result.web3Payload) })` directly from the client browser and verify `response.ok && data.success`.
- **Done when**: Clicking `"Submit Acquisition Offer"` in `DomainSaleModal` (as well as submitting `ContactForm` or `Newsletter`) validates and rate-limits on the server, then submits directly from the browser to Web3Forms without triggering a Cloudflare 403 block, showing the `"Offer Received!"` confirmation state.

---

## Priority 2: Medium Priority Tasks (SEO, 360px/768px Responsiveness, Local Images & Accessibility)

---

### Task `MED-01` [COMPLETED]: Replace Remaining External Unsplash URLs on Classic Heritage Articles (`c1`–`c18`) with Local Assets
- **Category**: Performance / Missing Local Asset Binding
- **Exact File**: `src/lib/data/articles.ts`
- **Why**: All 18 classic vehicle photos (`1967-shelby-gt500.jpg` through `1970-plymouth-hemi-cuda.jpg`) already exist on disk in `public/images/vehicles/` and are used in `classic-spotlight.ts`. However, the 18 corresponding heritage articles (`c1` through `c18`, lines 358–682 in `src/lib/data/articles.ts`) still use external `https://images.unsplash.com/...` URLs for both `coverImage` and inline markdown `![]()` images.
- **Exact Changes**:
  In `src/lib/data/articles.ts` (lines 358–682), for each of the 18 classic articles `c1` through `c18`, replace the external Unsplash `coverImage` and inline markdown image URL with `/images/vehicles/${article.slug}.jpg`:
  - `c1` (`1967-shelby-gt500`, lines 362 & 365) -> `"/images/vehicles/1967-shelby-gt500.jpg"`
  - `c2` (`1964-pontiac-gto`, lines 380 & 383) -> `"/images/vehicles/1964-pontiac-gto.jpg"`
  - `c3` (`1987-buick-grand-national-gnx`, lines 398 & 401) -> `"/images/vehicles/1987-buick-grand-national-gnx.jpg"`
  - `c4` (`1961-jaguar-e-type-coupe`, lines 416 & 419) -> `"/images/vehicles/1961-jaguar-e-type-coupe.jpg"`
  - `c5` (`1954-mercedes-300-sl-gullwing`, lines 434 & 437) -> `"/images/vehicles/1954-mercedes-300-sl-gullwing.jpg"`
  - `c6` (`1964-aston-martin-db5`, lines 452 & 455) -> `"/images/vehicles/1964-aston-martin-db5.jpg"`
  - `c7` (`1973-porsche-911-carrera-rs-27`, lines 470 & 473) -> `"/images/vehicles/1973-porsche-911-carrera-rs-27.jpg"`
  - `c8` (`1987-ferrari-f40`, lines 488 & 491) -> `"/images/vehicles/1987-ferrari-f40.jpg"`
  - `c9` (`1971-lamborghini-miura-sv`, lines 506 & 509) -> `"/images/vehicles/1971-lamborghini-miura-sv.jpg"`
  - `c10` (`1994-toyota-supra-rz-a80`, lines 524 & 527) -> `"/images/vehicles/1994-toyota-supra-rz-a80.jpg"`
  - `c11` (`1999-nissan-skyline-gtr-r34`, lines 542 & 545) -> `"/images/vehicles/1999-nissan-skyline-gtr-r34.jpg"`
  - `c12` (`1992-honda-nsx-r-na1`, lines 560 & 563) -> `"/images/vehicles/1992-honda-nsx-r-na1.jpg"`
  - `c13` (`1991-mazda-787b-le-mans`, lines 578 & 581) -> `"/images/vehicles/1991-mazda-787b-le-mans.jpg"`
  - `c14` (`1983-lancia-rally-037`, lines 596 & 599) -> `"/images/vehicles/1983-lancia-rally-037.jpg"`
  - `c15` (`1985-audi-sport-quattro-s1`, lines 614 & 617) -> `"/images/vehicles/1985-audi-sport-quattro-s1.jpg"`
  - `c16` (`1993-mclaren-f1`, lines 632 & 635) -> `"/images/vehicles/1993-mclaren-f1.jpg"`
  - `c17` (`1986-bmw-m3-e30`, lines 650 & 653) -> `"/images/vehicles/1986-bmw-m3-e30.jpg"`
  - `c18` (`1970-plymouth-hemi-cuda`, lines 668 & 671) -> `"/images/vehicles/1970-plymouth-hemi-cuda.jpg"`
- **Done when**: All 18 classic heritage articles (`c1`–`c18`) load their cover and inline photos directly from `/images/vehicles/*.jpg` with zero external requests to Unsplash.

---

### Task `MED-02` [COMPLETED]: Replace Remaining External Unsplash URLs on Articles `a1`–`a27` with Local Vehicle Images
- **Category**: Performance / Asset Consistency
- **Exact File**: `src/lib/data/articles.ts`
- **Why**: Articles `a18`–`a27` (lines 184–356) and `a1`–`a17` (lines 684–954) still point to external `images.unsplash.com` URLs instead of the authentic local vehicle photos in `public/images/vehicles/`.
- **Exact Changes**:
  In `src/lib/data/articles.ts`, update `coverImage` and inline markdown `![](https://images.unsplash.com/...)` URLs on `a18`–`a27` and `a1`–`a17` to use the matching local vehicle image in `public/images/vehicles/`:
  - `a18` (`best-electric-suvs-2026`) -> `/images/vehicles/rivian-r1s-quad.jpg`
  - `a19` (`synthetic-efuels-porsche-future-of-ice`) -> `/images/vehicles/porsche-911-gt3-rs.jpg`
  - `a20` (`chinese-ev-makers-reshaping-europe-2026`) -> `/images/vehicles/byd-seal-excellence.jpg`
  - `a21` (`autonomous-driving-2026-level-3-reality`) -> `/images/vehicles/mercedes-eqs-580.jpg`
  - `a22` (`ev-charging-networks-ranked`) -> `/images/vehicles/porsche-taycan-4s.jpg`
  - `a23` (`death-of-the-manual-transmission`) -> `/images/vehicles/toyota-gr-supra-manual.jpg`
  - `a24` (`hyundai-ioniq-5-n-track-test`) -> `/images/vehicles/hyundai-ioniq-5-n.jpg`
  - `a25` (`best-hybrid-cars-2026-real-world-mpg`) -> `/images/vehicles/toyota-prius-prime.jpg`
  - `a26` (`mercedes-amg-v8-comeback-c63-lesson`) -> `/images/vehicles/mercedes-amg-gt-63-s-e-performance.jpg`
  - `a27` (`winter-ev-range-test-2026`) -> `/images/vehicles/polestar-4.jpg`
  - `a1` (`tesla-model-y-refresh`) -> `/images/vehicles/tesla-model-y-long-range.jpg`
  - `a2` (`bmw-m5-touring-review`) -> `/images/vehicles/bmw-m5-touring.jpg`
  - `a3` (`europe-tariffs-chinese-evs`) -> `/images/vehicles/byd-seal-excellence.jpg`
  - `a4` (`porsche-taycan-vs-audi-etron-gt`) -> `/images/vehicles/porsche-taycan-4s.jpg` (inline: `/images/vehicles/audi-etron-gt.jpg`)
  - `a5` (`xiaomi-su7-ultra-review`) -> `/images/vehicles/xiaomi-su7-ultra.jpg`
  - `a6` (`ford-maverick-hybrid-long-term`) -> `/images/vehicles/ford-maverick-hybrid.jpg`
  - `a7` (`hyundai-ioniq-9-first-look`) -> `/images/vehicles/hyundai-ioniq-9.jpg`
  - `a8` (`rivian-r2-pre-orders`) -> `/images/vehicles/rivian-r2.jpg`
  - `a9` (`solid-state-batteries-explained`) -> `/images/vehicles/lucid-air-sapphire.jpg`
  - `a10` (`best-evs-under-40k`) -> `/images/vehicles/volvo-ex30.jpg`
  - `a11` (`porsche-911-hybrid-deep-dive`) -> `/images/vehicles/porsche-911-carrera-gts.jpg`
  - `a12` (`toyota-rav4-prime-review`) -> `/images/vehicles/toyota-rav4-prime.jpg`
  - `a13` (`vw-id-buzz-family-test`) -> `/images/vehicles/volkswagen-id-buzz.jpg`
  - `a14` (`honda-civic-hybrid-review`) -> `/images/vehicles/honda-civic-hybrid.jpg`
  - `a15` (`best-luxury-sedans-2026`) -> `/images/vehicles/bmw-i7-xdrive60.jpg`
  - `a16` (`mazda-rotary-sports-car-rumors`) -> `/images/vehicles/mazda-rx7-spirit-r-fd.jpg`
  - `a17` (`ev-market-2026-whats-changed`) -> `/images/vehicles/tesla-model-3-long-range.jpg`
- **Done when**: Zero `images.unsplash.com` URLs remain anywhere in `src/lib/data/articles.ts`.

---

### Task `MED-03` [COMPLETED]: Fix Missing OpenGraph Images & Duplicate `| Autovaly` Title Suffixes Across Routes
- **Category**: SEO
- **Exact Files**:
  - `src/app/articles/page.tsx`
  - `src/app/news/page.tsx`
  - `src/app/reviews/page.tsx`
  - `src/app/evs/page.tsx`
  - `src/app/classics/page.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/terms/page.tsx`
  - `src/app/search/page.tsx`
- **Why**:
  1. In Next.js App Router, defining a custom `openGraph` object in a child `page.tsx` completely replaces the root `layout.tsx` `openGraph` object—stripping `openGraph.images` unless re-declared. `articles/page.tsx`, `news/page.tsx`, `reviews/page.tsx`, `evs/page.tsx`, and `classics/page.tsx` define custom `openGraph` objects without `images`, so sharing those 5 hub URLs on social platforms produces cards with no preview image.
  2. Root `layout.tsx` uses `title.template: "%s | Autovaly"`. However, `privacy/page.tsx` (`"Privacy Policy — Autovaly"`), `terms/page.tsx` (`"Terms of Service — Autovaly"`), and `search/page.tsx` (`"Search Articles & Vehicles | Autovaly"`) include `"Autovaly"` in their title string, outputting `"Privacy Policy — Autovaly | Autovaly"` in the browser tab.
- **Exact Changes**:
  1. In `src/app/articles/page.tsx`, `src/app/news/page.tsx`, `src/app/reviews/page.tsx`, `src/app/evs/page.tsx`, and `src/app/classics/page.tsx`, add `images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Autovaly" }]` inside each file's ` metadata.openGraph` object.
  2. In `src/app/privacy/page.tsx` (line 8), change `title: "Privacy Policy — Autovaly",` to `title: "Privacy Policy",` and add `alternates: { canonical: "/privacy" },`.
  3. In `src/app/terms/page.tsx` (line 7), change `title: "Terms of Service — Autovaly",` to `title: "Terms of Service",` and add `alternates: { canonical: "/terms" },`.
  4. In `src/app/search/page.tsx` (line 9), change `title: "Search Articles & Vehicles | Autovaly",` to `title: "Search Articles & Vehicles",`.
- **Done when**: All 5 category hubs include `/og-image.png` in their OpenGraph metadata, and `/privacy`, `/terms`, and `/search` no longer render duplicate `"Autovaly | Autovaly"` in `<title>`.

---

### Task `MED-04` [COMPLETED]: Fix Relative Image URLs in `sitemap.ts` and Invalid XML in `feed.xml/route.ts`
- **Category**: SEO / Bugs
- **Exact Files**:
  - `src/app/sitemap.ts`
  - `src/app/feed.xml/route.ts`
- **Why**:
  1. In `src/app/sitemap.ts` (lines 35 & 43), `images: article.coverImage ? [article.coverImage] : undefined` outputs relative paths (`/images/vehicles/porsche-911-gt3-rs.jpg`) inside `<image:loc>`. Google's Sitemap protocol requires absolute URLs (`https://autovaly.com/images/...`).
  2. In `src/app/feed.xml/route.ts` (lines 29–35), `<enclosure url="${article.coverImage}" length="0" type="image/jpeg" />` outputs relative URLs when `coverImage` is local, or unescaped `&` characters if a query string is present (breaking XML parsing). It also imports from `@/services/article.service` instead of `@/lib/content` and sets `<atom:link href="https://autovaly.com/rss.xml">` instead of `https://autovaly.com/feed.xml`.
- **Exact Changes**:
  1. In `src/app/sitemap.ts`, add a helper `const toAbsoluteUrl = (path: string) => path.startsWith("http") ? path : `${BASE_URL}${path}`;` and use `[toAbsoluteUrl(article.coverImage)]` on line 35 and `[toAbsoluteUrl(vehicle.coverImage)]` on line 43.
  2. In `src/app/feed.xml/route.ts`:
     - Line 1: change `import { getAllArticles } from "@/services/article.service";` to `import { getAllArticles } from "@/lib/content";`
     - Line 18: change `href="${SITE_URL}/rss.xml"` to `href="${SITE_URL}/feed.xml"`
     - Line 30: resolve relative image URLs and XML-escape `&`:
       ```ts
       ${article.coverImage ? `<enclosure url="${(article.coverImage.startsWith("http") ? article.coverImage : `${SITE_URL}${article.coverImage}`).replace(/&/g, "&amp;")}" length="0" type="image/jpeg" />` : ""}
       ```
- **Done when**: `/sitemap.xml` and `/feed.xml` output valid absolute `https://autovaly.com/images/...` image URLs with valid XML syntax.

---

### Task `MED-05` [COMPLETED]: Add Missing `<main id="main-content">` Landmarks and Fix Heading Hierarchy (`h1`/`h2`)
- **Category**: Accessibility / SEO
- **Exact Files**:
  - `src/app/articles/page.tsx`
  - `src/app/news/page.tsx`
  - `src/app/reviews/page.tsx`
  - `src/app/evs/page.tsx`
  - `src/app/classics/page.tsx`
  - `src/app/vehicles/[slug]/page.tsx`
  - `src/app/compare/[slug]/page.tsx`
  - `src/app/error.tsx`
  - `src/app/garage/page.tsx`
  - `src/app/compare/custom/page.tsx`
- **Why**:
  1. Root `layout.tsx` (line 103) renders a `<a href="#main-content" className="skip-link">Skip to main content</a>` link, but 8 pages wrap their content in `<div className="min-h-screen ...">` without `<main id="main-content">`, breaking the skip link and landmark navigation for screen readers.
  2. `/garage` renders two `<h1>` elements on the same page (`src/app/garage/page.tsx` line 27 `"My Virtual Garage"` AND `src/components/GarageView.tsx` line 96 `"Your Shortlisted Fleet"`).
  3. `/compare/custom` renders Car A's title as `<h1>` (line 203) and Car B's title as `<h2>` (line 220), and has no page-level `<h1>`.
- **Exact Changes**:
  1. Change the outer wrapper `<div className="min-h-screen ...">` (and its closing `</div>`) to `<main id="main-content" className="min-h-screen ...">` (and `</main>`) in:
     - `src/app/articles/page.tsx` (lines 38 & 93)
     - `src/app/news/page.tsx` (lines 41 & 97)
     - `src/app/reviews/page.tsx` (lines 41 & 97)
     - `src/app/evs/page.tsx` (lines 38 & 134)
     - `src/app/classics/page.tsx` (lines 58 & 67)
     - `src/app/vehicles/[slug]/page.tsx` (lines 72 & 307)
     - `src/app/compare/[slug]/page.tsx` (lines 89 & 220)
     - `src/app/error.tsx` (lines 17 & 56)
  2. In `src/components/GarageView.tsx` (line 96), change `<h1 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-wider">` to `<h2 className="font-heading text-3xl md:text-5xl font-bold uppercase tracking-wider">` (and its closing `</h1>` on line 98 to `</h2>`) so `src/app/garage/page.tsx` owns the sole `<h1>`.
  3. In `src/app/compare/custom/page.tsx`, change line 203 `<h1 ...>` to `<h2 ...>` (and its closing `</h1>` to `</h2>`), and add `<h1 className="sr-only">{carA.year} {carA.make} {carA.model} vs {carB.year} {carB.make} {carB.model} Comparison</h1>` right after `<Breadcrumbs ... />` on line 182.
- **Done when**: Every route has a single `<main id="main-content">` landmark for the skip link and exactly one semantic `<h1>` heading.

---

### Task `MED-06` [COMPLETED]: Fix `EditorsPicks` Misaligned Badge on `sm`/`lg` & `Hero.tsx` Missing Slide #1 Tab
- **Category**: Mobile & Tablet Responsiveness / UI Polish
- **Exact Files**:
  - `src/components/EditorsPicks.tsx`
  - `src/components/Hero.tsx`
- **Why**:
  1. In `src/components/EditorsPicks.tsx` (line 20), each item wrapper is `w-[280px] sm:w-[320px] lg:w-[340px]`, while `<ArticleCard variant="portrait" />` (`src/components/ui/ArticleCard.tsx` line 101) has a fixed width of `w-[280px]`. At `sm` (`640px+`) and `lg` (`1024px+`), the wrapper is `40px–60px` wider than the card, causing the `absolute top-3 right-3` `★ CHOICE` badge to float in empty space outside the right edge of the card!
  2. In `src/components/Hero.tsx` (line 138), the bottom slide selector tabs iterate over `articles.slice(1, 4)` (3 columns), omitting Slide #1 (`index === 0`). Once the carousel auto-advances to Slide #2, the user has no tab button to click back to Story #1. Also at `360px`, 3 text columns in the bottom bar are cramped.
- **Exact Changes**:
  1. In `src/components/EditorsPicks.tsx` (line 20), change `w-[280px] sm:w-[320px] lg:w-[340px]` to `w-[280px]`.
  2. In `src/components/Hero.tsx` (lines 136–164), render all 4 slides (`articles.slice(0, 4)`) in a responsive 2-column mobile / 4-column desktop grid:
     Replace lines 136–164:
     ```tsx
            <div className="grid grid-cols-3 border-t border-white/10 pt-4 gap-4 md:gap-8">
              {articles.slice(1, 4).map((item, idx) => {
                const actualIndex = idx + 1;
                const isActive = currentIndex === actualIndex;
     ```
     with:
     ```tsx
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10 pt-3 md:pt-4 gap-3 md:gap-6">
              {articles.slice(0, 4).map((item, actualIndex) => {
                const isActive = currentIndex === actualIndex;
     ```
- **Done when**: The `★ CHOICE` badge in `EditorsPicks` sits inside the top-right corner of every portrait card across all viewports, and all 4 Hero stories can be selected via the bottom tab bar.

---

### Task `MED-07` [COMPLETED]: Add Vehicle Photos to `/compare` Matchup Cards & Cover Images to `/vehicles/[slug]` Related Articles
- **Category**: Design Consistency / Visual Polish
- **Exact Files**:
  - `src/app/compare/page.tsx`
  - `src/app/vehicles/[slug]/page.tsx`
- **Why**:
  1. On `/compare` (`src/app/compare/page.tsx` lines 58–86), the 15 Pre-Built Head-to-Head Matchup cards only render flat CSS color gradients (`comp.carA.gradient`) without the vehicles' actual photos, even though every `comp.carA.slug` and `comp.carB.slug` has a high-res photo in `getVehicleBySlug()`.
  2. On `/vehicles/[slug]` (`src/app/vehicles/[slug]/page.tsx` lines 272–282), the `"Related Articles & Reviews"` cards only render a CSS gradient header without `<Image src={article.coverImage} />`.
- **Exact Changes**:
  1. In `src/app/compare/page.tsx`:
     - Import `Image` from `"next/image"`.
     - Inside `comparisons.map((comp) => {` (line 53), look up both vehicles:
       ```tsx
       const vehicleA = allVehicles.find((v) => v.slug === comp.carA.slug);
       const vehicleB = allVehicles.find((v) => v.slug === comp.carB.slug);
       ```
     - Inside the Car A half (line 60) and Car B half (line 75), render `<Image src={vehicleA.coverImage} alt={comp.carA.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />` (and same for `vehicleB.coverImage`) above the gradient background.
  2. In `src/app/vehicles/[slug]/page.tsx` (lines 272–282), inside `<div className="h-44 w-full relative overflow-hidden">`, add:
     ```tsx
     {article.coverImage && (
       <Image
         src={article.coverImage}
         alt={article.title}
         fill
         sizes="(max-width: 768px) 100vw, 33vw"
         className="object-cover group-hover:scale-105 transition-transform duration-500"
       />
     )}
     ```
- **Done when**: Pre-built comparison cards on `/compare` display real split-screen vehicle photography, and related articles on `/vehicles/[slug]` display their article cover images.

---

### Task `MED-08` [COMPLETED]: Fix `360px` Mobile Layout Polish (`ComparisonBanner`, `PopularVehicles`, `VehicleCatalog`, `Breadcrumbs`, `Compare` Hero)
- **Category**: Mobile Responsiveness (`360px`, `768px`)
- **Exact Files**:
  - `src/components/ComparisonBanner.tsx`
  - `src/components/PopularVehicles.tsx`
  - `src/components/VehicleCatalog.tsx`
  - `src/components/ui/Breadcrumbs.tsx`
  - `src/app/compare/[slug]/page.tsx`
  - `src/app/compare/custom/page.tsx`
- **Why**:
  1. `ComparisonBanner.tsx` (line 54): Two `w-[155px]` cards + `w-9` (`36px`) VS badge + `gap-2` (`16px`) = `362px`, which overflows a `360px` screen (`328px` content width inside `px-4`).
  2. `PopularVehicles.tsx` (lines 28 & 50): Header uses `items-end` on mobile (`flex-col`), right-aligning the section title on `360px`, and the 2-column mobile card grid (`grid-cols-2 gap-3`) squeezes 3 spec columns into `158px` cards.
  3. `VehicleCatalog.tsx` (line 216): Filter panel has `sticky top-24` on mobile (`< 1024px`) instead of `lg:sticky lg:top-24`, causing the open filter box to stick over the vehicle list on `360px`/`768px`. Also, typing a search query (`searchQuery`) does not reset `visibleCount` back to `INITIAL_COUNT`.
  4. `Breadcrumbs.tsx` (line 27): `<ol className="flex items-center space-x-2 text-xs text-text-muted">` lacks `flex-wrap`, overflowing horizontally at `360px` on long article/vehicle titles.
  5. `src/app/compare/[slug]/page.tsx` (lines 118, 134, 152) and `src/app/compare/custom/page.tsx` (lines 198, 208, 215): Hero split images use `sizes="50vw"` even though they stack full-width (`100vw`) below `768px`, and the `"VS"` badge is `hidden md:flex` (missing on mobile).
- **Exact Changes**:
  1. In `src/components/ComparisonBanner.tsx` (lines 55 & 78), change `w-[155px] sm:w-[200px]` to `flex-1 min-w-0 sm:flex-none sm:w-[200px]` and on line 54 add `w-full sm:w-auto`.
  2. In `src/components/PopularVehicles.tsx`, change line 28 `items-end` to `items-start sm:items-end`, and change line 50 `grid-cols-2 sm:grid-cols-3` to `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`.
  3. In `src/components/VehicleCatalog.tsx`, change line 216 `sticky top-24` to `lg:sticky lg:top-24`, and on line 231 (`onChange={(e) => setSearchQuery(e.target.value)}`), reset pagination: `onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(INITIAL_COUNT); }}`.
  4. In `src/components/ui/Breadcrumbs.tsx` (line 27), change `flex items-center space-x-2` to `flex flex-wrap items-center gap-y-1 space-x-2`.
  5. In `src/app/compare/[slug]/page.tsx` (lines 118 & 152) and `src/app/compare/custom/page.tsx` (lines 198 & 215), change `sizes="50vw"` to `sizes="(max-width: 768px) 100vw, 50vw"`, and change the `"VS"` badge wrapper from `hidden md:flex` to `flex` (`w-10 h-10 md:w-14 md:h-14 text-sm md:text-xl`).
- **Done when**: At `360px` and `768px`, `ComparisonBanner`, `PopularVehicles`, `VehicleCatalog`, `Breadcrumbs`, and `/compare/*` render cleanly with zero horizontal scrollbars or stuck mobile filter panels.

---

### Task `MED-09` [COMPLETED]: Improve 3D Canvas Mobile Controls & WebGL Context Loss Resilience
- **Category**: Mobile Responsiveness (`360px`) / Performance
- **Exact Files**:
  - `src/components/3d/AeroStudioCanvas.tsx`
  - `src/components/3d/DragBattleCanvas.tsx`
- **Why**:
  1. In `AeroStudioCanvas.tsx` (line 532), the bottom bar holds 6 color swatches + 3 hotspot pills in a single container at `360px`, crowding the lower third of the `460px` mobile canvas. Hiding the secondary hotspot pills on `< 640px` (`hidden sm:flex`) keeps the 3D car unobstructed on `360px` phones.
  2. In `DragBattleCanvas.tsx` (line 449), the top HUD overlays a 2-column telemetry box + 3 camera buttons + launch button simultaneously on `360px`. Making the telemetry cards compact on mobile prevents the 3D Christmas tree and cars from being covered.
- **Exact Changes**:
  1. In `src/components/3d/AeroStudioCanvas.tsx` (line 555), change the hotspot pills container class from `flex flex-wrap items-center gap-1.5` to `hidden sm:flex flex-wrap items-center gap-1.5`.
  2. In `src/components/3d/DragBattleCanvas.tsx` (line 451), change the telemetry card padding from `p-3 md:p-4` to `p-2 sm:p-3 md:p-4` and speed readout on lines 458 & 477 from `text-2xl md:text-3xl` to `text-lg sm:text-2xl md:text-3xl`.
- **Done when**: On a `360px` mobile screen, both the 3D Aero Studio and 3D Drag Strip remain clearly visible between the top and bottom HUD controls.

---

## Priority 3: Low Priority Tasks (Code Quality, Memory Safety & Cleanup)

---

### Task `LOW-01` [COMPLETED]: Memoize `addVehicle` & Validate `JSON.parse` in `useRecentlyViewed.ts`
- **Category**: Code Quality / Stability
- **Exact File**: `src/lib/useRecentlyViewed.ts`
- **Why**: `addVehicle` is not wrapped in `useCallback`, so passing it as a `useEffect` dependency causes an infinite render loop. In addition, `JSON.parse(stored)` (lines 13 & 24) is not checked with `Array.isArray()`, which can throw a `TypeError` if `localStorage` contains non-array JSON.
- **Exact Changes**:
  In `src/lib/useRecentlyViewed.ts`, import `useCallback` from `"react"`, validate `Array.isArray(parsed)` when reading `localStorage`, and wrap `addVehicle` in `useCallback((vehicle: RecentlyViewedVehicle) => { ... }, [])` using functional state updates `setVehicles((prev) => ...)`.
- **Done when**: `addVehicle` has a stable reference across renders and malformed `localStorage` data never throws a runtime error.

---

### Task `LOW-02` [COMPLETED]: Memoize `ThemeContext` Value in `theme-context.tsx` & Preserve `logger.info` in `next.config.ts`
- **Category**: Code Quality / Performance
- **Exact Files**:
  - `src/lib/theme-context.tsx`
  - `next.config.ts`
- **Why**:
  1. `src/lib/theme-context.tsx` (line 64) passes an unmemoized `{ theme, toggleTheme, mounted }` object literal to `<ThemeContext.Provider>`, and does not validate that `localStorage.getItem("autovaly-theme")` is strictly `"dark"` or `"light"`.
  2. `next.config.ts` (line 17) sets `removeConsole: { exclude: ["error", "warn"] }`, which strips `console.info` calls used by `logger.info()` in `src/lib/logger.ts` during production builds.
- **Exact Changes**:
  1. In `src/lib/theme-context.tsx`, validate `if (saved === "dark" || saved === "light")` when reading `localStorage`, and wrap `toggleTheme` in `useCallback` and the context value in `useMemo`.
  2. In `next.config.ts` (line 17), change `exclude: ["error", "warn"]` to `exclude: ["error", "warn", "info"]`.
- **Done when**: `ThemeContext` consumers do not re-render unnecessarily, and `logger.info()` logs are preserved in production builds.

---

### Task `LOW-03` [COMPLETED]: Harden `rate-limit.ts` Memory Cap & `.unref()` Interval Timer
- **Category**: Code Quality / Security
- **Exact File**: `src/lib/rate-limit.ts`
- **Why**:
  1. `setInterval` (lines 9–18) does not call `.unref?.()`, which can keep Node.js build/test processes alive.
  2. In `rateLimit()` (lines 34–40), if `memoryStore.size > MAX_ENTRIES` (`10,000`) during a burst flood where entries haven't expired yet, no keys are deleted. Adding a FIFO eviction fallback guarantees `memoryStore.size` never exceeds `MAX_ENTRIES`.
- **Exact Changes**:
  1. In `src/lib/rate-limit.ts` (line 18), chain `.unref?.()` onto the `setInterval(...)` call.
  2. After the expired-entry cleanup loop on line 39, add:
     ```ts
     if (memoryStore.size >= MAX_ENTRIES) {
       const oldestKey = memoryStore.keys().next().value;
       if (oldestKey) memoryStore.delete(oldestKey);
     }
     ```
- **Done when**: `memoryStore.size` is strictly bounded at `10,000` entries even under a spoofed-IP burst flood, and the cleanup timer does not block process exit.

---

### Task `LOW-04` [COMPLETED]: Clean Up Unused Unsplash Preconnect Links & Redundant Icon Override in `src/app/layout.tsx`
- **Category**: Performance / Code Quality
- **Exact File**: `src/app/layout.tsx`
- **Why**:
  1. Lines 95–96 open early TCP/TLS connections (`<link rel="preconnect" href="https://images.unsplash.com" />` and `dns-prefetch`) to Unsplash on every page load even after all images are served locally from `/images/vehicles/*.jpg`.
  2. Line 39 specifies `icons: { icon: "/icon.png", apple: "/apple-touch-icon.png" }`. Because `icon.png` lives at `src/app/icon.png` (Next.js App Router file convention) rather than `public/icon.png`, Next.js automatically generates the `<link rel="icon">` tag unless overridden by a manual `icon: "/icon.png"` string.
- **Exact Changes**:
  1. In `src/app/layout.tsx` (line 39), change `icons: { icon: "/icon.png", apple: "/apple-touch-icon.png" },` to `icons: { apple: "/apple-touch-icon.png" },`.
  2. In `src/app/layout.tsx` (lines 95–96), remove the two `images.unsplash.com` `<link rel="preconnect">` and `<link rel="dns-prefetch">` tags (only after `HIGH-01`, `MED-01`, and `MED-02` are complete).
- **Done when**: The browser no longer opens unused network connections to `images.unsplash.com` on initial page load, and `/icon.png` resolves cleanly via Next.js App Router metadata.
