# Active Context: Egyptian TV 90s

## Current State

**Project Status**: ✅ Egyptian TV 90s - Fully Built

The project has been transformed from a Next.js starter template into a full retro Egyptian TV 90s experience.

## Recently Completed

- [x] Built retro CRT TV cabinet UI with wooden texture, knobs, and controls
- [x] Created StaticNoise component with canvas-based TV static animation
- [x] Created DVDBouncer component with bouncing DVD logo (color-changing)
- [x] Created ChannelGuide component with searchable video grid
- [x] Built RetroTV main component with full TV controls
- [x] Built /api/content route using Invidious API for YouTube search
- [x] Built /api/search route for direct search queries
- [x] Created comprehensive Egyptian 90s content database with search terms
- [x] Added CRT scanlines, vignette, and flicker effects
- [x] Added channel banner, volume bar, now-playing bar overlays
- [x] Added keyboard shortcuts (SPACE, arrows, +/-, M, G)
- [x] Added 8 channel types: Movies, Series, Music, Comedy, Sports, Cartoons, Variety, Drama
- [x] Configured next.config.ts for YouTube iframe and image domains
- [x] Build passes, lint clean, typecheck passes

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page (renders TVWrapper) | ✅ Ready |
| `src/app/layout.tsx` | Root layout with Arabic metadata | ✅ Ready |
| `src/app/globals.css` | Full retro TV CSS (800+ lines) | ✅ Ready |
| `src/components/RetroTV.tsx` | Main TV component with all controls | ✅ Ready |
| `src/components/TVWrapper.tsx` | Client-side dynamic import wrapper | ✅ Ready |
| `src/components/StaticNoise.tsx` | Canvas-based TV static noise | ✅ Ready |
| `src/components/DVDBouncer.tsx` | DVD logo bouncer fallback screen | ✅ Ready |
| `src/components/ChannelGuide.tsx` | Channel guide with search | ✅ Ready |
| `src/app/api/content/route.ts` | Content API using Invidious | ✅ Ready |
| `src/app/api/search/route.ts` | Search API using Invidious | ✅ Ready |
| `src/lib/egyptianContent.ts` | Content types and channel definitions | ✅ Ready |
| `next.config.ts` | YouTube iframe/image config | ✅ Ready |

## Architecture

### Content Strategy
- Uses **Invidious API** (open-source YouTube frontend) to search for Egyptian 90s content
- Multiple Invidious instances for redundancy (7 instances)
- 27+ search queries per channel type (movies, series, music, comedy, sports, cartoons, variety, drama)
- Pagination support - loads more content as user browses
- Falls back to curated content if API unavailable
- Background preloading of all channels after power-on

### TV UI Features
- Wooden cabinet with CRT screen
- Real TV controls: power button, channel knobs, volume knobs
- 8 channel preset buttons with icons and Arabic names
- Channel banner overlay when switching
- Volume bar overlay
- Now-playing bar (shows on hover)
- Scanlines + CRT vignette + flicker effects
- Keyboard shortcuts

### Screen States
1. `off` - Black screen with tiny power dot
2. `static` - Canvas-based TV static noise
3. `loading` - Static + loading overlay
4. `playing` - YouTube iframe
5. `dvd` - DVD bouncer fallback
6. `guide` - Channel guide overlay

## Session History

| Date | Changes |
|------|---------|
| 2026-03-04 | Initial template created |
| 2026-03-04 | Full Egyptian TV 90s experience built |
