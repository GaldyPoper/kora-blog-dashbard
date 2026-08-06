# Take home assignment - Senior Frontend Engineer SvelteKit + Tailwind

A production-shaped SvelteKit slice: an SEO-critical public surface (marketing, blog, search)
and an authenticated dashboard. Built with SvelteKit 2 / Svelte 5 (runes), Tailwind 4, Zod, and
TypeScript; deployed on Netlify.

**Demo login** (any of the three, password `demo1234`): `admin@demo.test` · `editor@demo.test` · `viewer@demo.test`
**Live URL:** https://kora-take-home-test.netlify.app/en
**Repo:** https://github.com/GaldyPoper/kora-blog-dashbard

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

| Route                                | Rendering                        | Why                                                               |
| ------------------------------------ | -------------------------------- | ----------------------------------------------------------------- |
| `/[lang]` (home)                     | **Prerendered (SSG)**            | Static marketing content, best possible LCP.                      |
| `/[lang]/blog/[slug]`                | **SSG w/ `prerender = 'auto'`**  | Known posts prerendered via `entries`; SSR fallback.              |
| `/[lang]/blog`                       | **SSR**, CDN-cached 60 min       | Paginated list; page/tag in the URL, cheap to cache.              |
| `/[lang]/search`                     | **SSR**                          | All filter/sort state round-trips through the URL.                |
| `/[lang]/dashboard`                  | **CSR (`ssr = false`), noindex** | Interactive user tool, not a traffic driver; guarded server-side. |
| `/[lang]/login`, `/logout`, `/api/*` | **SSR / Node endpoints**         | Read/write endpoints and auth.                                    |

## Worth highlighting

- **Zod as the trust boundary.** Mock JSON is parsed through schemas in `src/lib/server/data.ts`
  before anything is served; the same schemas type the `/api/*` endpoints — no hand-typed shapes.
- **URL as state.** Search filters/sort are encoded/decoded through a tested codec
  (`src/lib/search/`), so results are shareable and back/forward works.
- **i18n in the routing layer.** A `[lang=lang]` param matcher validates the locale; canonical +
  `hreflang` alternates are emitted in the layout, and the sitemap is locale-aware.
- **Auth is real.** HMAC-signed cookie with constant-time verification and a `handle` hook that
  populates `event.locals.user`; the dashboard guards server-side.
- **Tokenized theming.** Semantic CSS-variable tokens drive light/dark; `ThemeSwitcher` toggles them.
- **Component split** with colocated unit tests — `primitives/` and `composites/` (~275 Vitest tests).
- **CI enforces performance budgets** (not just measures them): Lighthouse mobile (Moto G Power) —
  LCP < 2 s, CLS < 0.1, TBT < 200 ms (lab proxy for INP), and PWA/A11y/SEO/Best-Practices ≥ 95 — plus
  an initial-route JS budget (≤ 88 KB gzip public, ≤ 150 KB dashboard). See
  [.github/workflows/ci.yml](.github/workflows/ci.yml) and [lighthouserc.cjs](lighthouserc.cjs).

## Not completed (time-boxed)

Deliberate cuts against the brief, in rough priority order:

- **`/dashboard/items` data table** — the 220-row server-side paginated/sorted/multi-facet table
  with inline edit, optimistic UI + rollback, and streamed-SSR skeleton. The largest omission; the
  dashboard is currently a guarded stub. Data layer and schemas exist, the table UI does not.
- **Explicit edge/Node runtime split** — routes run on Node with CDN edge _caching_; no route is
  pinned to an edge runtime as the brief asks.
- **Streamed SSR** (`load` returning unawaited promises) — not implemented.
- **Complex accessible composite** (Dialog / Combobox / Menu with focus trap + full ARIA) — not built.
- **E2E & a11y automation** — no Playwright flows, `@axe-core/playwright`, or visual-regression
  snapshots; coverage is Vitest unit tests only.
- **Observability** — no `web-vitals` RUM beacon and no client error-reporting/Sentry stub.
- **SEO extras** — JSON-LD structured data and dynamic per-post OG images are not done (static OG
  image + full meta/canonical/hreflang are).
