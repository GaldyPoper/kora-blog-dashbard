# Take home assignment - Senior Frontend Engineer SvelteKit + Tailwind

A production-shaped SvelteKit slice: an SEO-critical public surface (marketing, blog, search)
and an authenticated dashboard. Built with SvelteKit 2 / Svelte 5 (runes), Tailwind 4, Zod, and
TypeScript; deployed on Netlify.

**Demo login** (any of the three, password `demo1234`): `admin@demo.test` · `editor@demo.test` · `viewer@demo.test`
**Live URL:** https://kora-take-home-test.netlify.app/en
**Repo:** https://github.com/GaldyPoper/kora-blog-dashbard

> **Best viewed on desktop.** Responsive/mobile layout was out of scope for this take-home, so the
> app is built for desktop widths — the dashboard table especially. (The Lighthouse budgets run on a
> mobile profile, but that's a performance/throttling target, not a claim of a mobile-tuned layout.)

## Getting started

Requires **Node 22** and **pnpm** (`corepack enable` will provide it; the repo pins `pnpm@10.3.0`).

```bash
pnpm install
cp .env.example .env   # optional in dev; see Environment below
pnpm dev               # http://localhost:5173
```

Production build, matching CI and Netlify:

```bash
pnpm build && pnpm preview   # http://localhost:4173
```

Other scripts: `pnpm test` (Vitest), `pnpm check` (svelte-check), `pnpm typecheck`, `pnpm lint`,
`pnpm size` (JS budget), `pnpm lhci` (Lighthouse budgets).

## Environment

One variable, `AUTH_SECRET`, used to HMAC-sign the session cookie. It's optional locally (an
insecure dev fallback is used) and **required in production**. See [.env.example](.env.example).

## Rendering decisions

Locale is a required URL segment (`/en`, `/de`); `/` 307-redirects to the default locale. Each
route picks its rendering deliberately:

| Route                                | Rendering                        | Why                                                                         |
| ------------------------------------ | -------------------------------- | --------------------------------------------------------------------------- |
| `/[lang]` (home)                     | **Prerendered (SSG)**            | Static marketing content, best possible LCP.                                |
| `/[lang]/blog/[slug]`                | **SSG w/ `prerender = 'auto'`**  | Known posts prerendered via `entries`; SSR fallback.                        |
| `/[lang]/blog`                       | **SSR**, CDN-cached 60 min       | Paginated list; page/tag in the URL, cheap to cache.                        |
| `/[lang]/search`                     | **SSR**                          | All filter/sort state round-trips through the URL.                          |
| `/[lang]/dashboard`                  | **CSR (`ssr = false`), noindex** | Interactive campaigns table; guarded server-side, data fetched client-side. |
| `/[lang]/login`, `/logout`, `/api/*` | **SSR / Node endpoints**         | Read/write endpoints and auth.                                              |

## State management

The approach is **Svelte 5 runes, no global stores**, in three consistent layers:

- **Local UI state → runes in the component.** `$state` / `$derived` / `$effect`, e.g. the
  `MultiSelect` search/focus state.
- **Reusable stateful logic → runes classes in `.svelte.ts` modules.** e.g.
  [`Listbox`](src/lib/state/listbox.svelte.ts) encapsulates the open/active-option state shared by
  popup widgets — it composes just like a component's own `$state`, but is reusable and unit-testable.
- **Shareable view state → the URL, via tested codecs.** Filters, sort and pagination live in the
  query string (`src/lib/search`, `src/lib/dashboard/items`) and are the single source of truth — no
  client store mirrors them, so a view is always shareable and back/forward always works.

Non-reactive shared helpers stay plain modules (e.g. [`useId`](src/lib/utils/use-id.ts) — an id is
assigned once and never changes, so making it reactive would be the wrong tool). There are **no
Svelte stores and no global mutable singletons**; ambient app data comes from `page` (`$app/state`),
and `setContext`/`getContext` is reserved for genuinely tree-scoped needs (none so far). The payoff:
fine-grained reactivity without store boilerplate, and no class of bug where a store drifts out of
sync with the address bar.

## Worth highlighting

- **Zod as the trust boundary.** Mock JSON is parsed through schemas in `src/lib/server/data.ts`
  before anything is served; the same schemas type the `/api/*` endpoints — no hand-typed shapes.
- **URL as state.** Both the blog search (`src/lib/search/`) and the dashboard table
  (`src/lib/dashboard/items/`) encode/decode all filter/sort/pagination state through tested
  codecs, so every view is shareable and back/forward works.
- **Dashboard campaigns table.** Server-side pagination, sorting and multi-facet filtering over
  220 rows, URL-synced; data fetched client-side from a guarded `/api/items` endpoint, with a
  server-side auth guard (hook + `+page.server.ts`) and designed loading / empty / error states.
- **Accessible multi-select, from scratch.** `MultiSelect`
  (`src/lib/components/composites/multi-select/`) is a listbox combobox — full ARIA
  (`listbox`/`option`, `aria-multiselectable`, `aria-selected`), roving-focus keyboard nav,
  type-ahead, and Escape / outside-click dismissal. No library; it drives the table's facets.
- **i18n in the routing layer.** A `[lang=lang]` param matcher validates the locale; canonical +
  `hreflang` alternates are emitted in the layout, and the sitemap is locale-aware.
- **Auth is real.** HMAC-signed cookie with constant-time verification and a `handle` hook that
  populates `event.locals.user`; the dashboard guards server-side.
- **Tokenized theming.** Semantic CSS-variable tokens drive light/dark; `ThemeSwitcher` toggles them.
- **Component split** with colocated unit tests — `primitives/` and `composites/` (~303 Vitest tests).
- **CI enforces performance budgets** (not just measures them): Lighthouse mobile (Moto G Power) —
  LCP < 2 s, CLS < 0.1, TBT < 200 ms (lab proxy for INP), and PWA/A11y/SEO/Best-Practices ≥ 95 — plus
  an initial-route JS budget (≤ 88 KB gzip public, ≤ 150 KB dashboard). See
  [.github/workflows/ci.yml](.github/workflows/ci.yml) and [lighthouserc.cjs](lighthouserc.cjs).

## Not completed (time-boxed)

Deliberate cuts against the brief, in rough priority order:

- **Optimistic inline edit + rollback** — the campaigns table does the full read path
  (filter/sort/paginate, URL-synced, guarded), but not the write path: inline cell editing with
  optimistic UI and rollback on failure. The remaining half of the brief's dashboard table.
- **Streamed SSR** — intentionally traded away. The dashboard is a CSR user tool (not a traffic
  driver), so its data is fetched client-side rather than streamed from a server `load`.
- **Explicit edge/Node runtime split** — routes run on Node with CDN edge _caching_; no route is
  pinned to an edge runtime. Auth touches `node:crypto`, so those routes are Node-bound regardless.
- **E2E & a11y automation** — no Playwright flows, `@axe-core/playwright`, or visual-regression
  snapshots; coverage is Vitest unit tests only.
- **Observability** — no `web-vitals` RUM beacon and no client error-reporting/Sentry stub.
- **SEO extras** — JSON-LD structured data and dynamic per-post OG images are not done (static OG
  image + full meta/canonical/hreflang are).
