# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OPIN — Observatório dos Professores Indígenas, a mapping platform for indigenous schools in São Paulo state. Developed by LINDI/UNIFESP.

Production URL: `https://opin.unifesp.br/` (served at root `/`)
GitLab remote: `git@git.unifesp.br:lindi-opin/opin.git`

## Commands

```bash
# Local development (connects to Supabase cloud)
npm run dev          # Vite dev server on port 5173

# Build
npm run build        # Outputs to build/

# Tests
npm test             # Jest (jsdom)
npm run test:watch   # Watch mode
npm run test:coverage

# Lint
npm run lint         # ESLint (high --max-warnings tolerance, won't block)

# Docker stack (full local backend: PostgreSQL + PostgREST + Storage + Nginx)
make up              # Start all containers (foreground)
make up-d            # Start in background
make down            # Stop and remove containers
make reset-db        # Wipe database volume (destructive)
make prod-up         # Start production stack (docker-compose.prod.yml)
make logs-f          # Tail all container logs

# Database migrations
npm run db:migrate   # knex migrate:latest
npm run db:rollback  # knex migrate:rollback
```

## Environment

Two `.env` files coexist:

- `.env.supabase` — Supabase cloud credentials (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `REACT_APP_ADMIN_PASSWORD`). Used for local `npm run dev`.
- `.env` — Docker/production config (PostgreSQL credentials, JWT secrets, `VITE_SUPABASE_URL=/opin` for reverse-proxy routing). Used by `make up`.

`vite.config.js` loads `.env.supabase` with `override: true` so it always wins over `.env.local` during dev.

## Architecture

**Frontend-only SPA** (React 19 + Vite), served at `/opin/` base path. All data access goes through the Supabase JS client (`src/dbClient.js`), which accepts either a cloud Supabase URL or a relative path (`/opin`) pointing to a local PostgREST instance behind Nginx.

**Docker stack** (`docker-compose.yml`):
- `db` — PostgreSQL 16, initialized from `data/database/init_full.sql`
- `api` — PostgREST, exposes DB as REST at port 3000
- `storage` — `supabase/storage-api`, serves files from `data/storage/` at port 5000
- `front` — Nginx serving the built React app at port 8080, reverse-proxying `/opin/rest/` → PostgREST and `/opin/storage/` → storage-api

**Data flow:**
1. `useEscolasData` hook fetches the `escolas_completa` DB view via `supabase.from('escolas_completa').select(...)` with only lightweight listing fields.
2. Raw rows are normalized by `src/utils/escolaMapper.js` (`mapEscolaData`) which maps Portuguese column names to camelCase-ish JS properties.
3. Formatted `dataPoints` array flows down from `App.js` via props to all routes and the map component.
4. Detailed escola data (história, mídia, projetos) is fetched on-demand per escola page — not in the initial load.

**Routing** (`src/router/index.js`):
All pages are lazy-loaded. Routes are defined as plain objects in `createRoutes()` and rendered in `App.js`. The `basename="/opin"` is set on `BrowserRouter`. Key routes: `/` Homepage, `/mapa` interactive map, `/escola/:slug` escola detail page, `/admin` AdminPanel (protected), `/algunsdados` and `/painel-dados` both render the Dashboard.

**Services** (`src/services/`):
Each file handles a specific content domain via the Supabase client — `escolaImageService`, `fotoProfessorService`, `documentoService`, `videoService`, `uploadService`, etc. These are called from components and hooks, not from `useEscolasData`.

**Auth** (`src/services/authService.js`):
Custom, simplified auth — no Supabase Auth. Password is stored in `REACT_APP_ADMIN_PASSWORD` env var. Successful login stores a Base64-encoded token in localStorage (24h TTL). `ProtectedRoute` wraps the `/admin` route.

**Map** (`src/components/OpenLayersMap/`, `src/components/map/`):
OpenLayers is the primary map library. Mapbox GL is also a dependency but secondary. GeoJSON files in `public/` (terras indígenas boundaries, SP state outline) are loaded as map layers. Map state (markers, layers, controls) is managed through dedicated hooks in `src/hooks/`.

**Contexts:**
- `SearchContext` — global school search state
- `RefreshContext` — triggers re-fetch of `useEscolasData` when data is mutated via the AdminPanel

**Navbar visibility:**
`App.js` conditionally renders the global `<Navbar>` — it is hidden on `/mapa` and on pages that render their own hero-integrated navbar (escola, dashboard, search, lindiflix, conteudo). This logic is in `isMapRoute` and `isHeroNavbarRoute`.

## Key conventions

- `.js` files in `src/` use JSX — Vite's esbuild is configured with `loader: 'jsx'` for all `.js` files. Don't rename to `.jsx` unless needed.
- The `@` alias resolves to `src/` (configured in `vite.config.js`).
- Both `VITE_` and `REACT_APP_` prefixes are supported for env vars (`envPrefix` in Vite config).
- Images should be converted to WebP (`npm run optimize-images` runs `scripts/convert_to_webp.js`).
- `src/utils/slug.js` generates escola slugs for URLs.
