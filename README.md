# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
pnpm dlx sv@0.17.0 create --template minimal --types ts --add prettier eslint tailwindcss="plugins:none" --install pnpm kora-blog-dashbard
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and every pull request, in two jobs:

- **Verify** — `check`, `typecheck`, `lint`, and unit tests.
- **Performance budgets** — production build, then two enforced budgets. A breach fails the build; it is not merely measured.

### Performance budgets

Everything below is asserted against the **production build** (`pnpm build` + `pnpm preview`).

**Lighthouse** (`lighthouserc.cjs`, run via `pnpm lhci`) — mobile form factor, Lighthouse's default **Moto G Power** screen emulation with simulated 4× CPU / slow-4G throttling, median of 3 runs on `/` (→ `/en`) and `/en/blog/[slug]`:

| Assertion                                          | Threshold |
| -------------------------------------------------- | --------- |
| Largest Contentful Paint                           | < 2000 ms |
| Cumulative Layout Shift                            | < 0.1     |
| Total Blocking Time (lab proxy for INP)            | < 200 ms  |
| Performance / Accessibility / SEO / Best Practices | ≥ 0.95    |

INP is a **field** metric that a lab tool cannot produce, so we enforce **Total Blocking Time < 200 ms**, Lighthouse's accepted lab proxy for a good (<200 ms) INP.

**JS bundle** (`scripts/check-bundle-size.mjs`, run via `pnpm size`) — the initial-route JavaScript each surface ships, gzipped: the SvelteKit client entry plus the route's layout/leaf chunks and their static-import closure (lazy chunks excluded). Measured statically from the build output, so it's deterministic and needs no server.

| Surface                                | Budget (gzip) | Current |
| -------------------------------------- | ------------- | ------- |
| Public — home `/[lang]`                | ≤ 88 KB       | ~83 KB  |
| Public — article `/[lang]/blog/[slug]` | ≤ 88 KB       | ~84 KB  |
| Dashboard `/[lang]/dashboard`          | ≤ 150 KB      | ~83 KB  |

**Why 88 KB, not 80?** The public surface today is 82–84 KB gzip: the Svelte 5 runtime, the SvelteKit client router, the i18n runtime, and the page components. Reaching a literal 80 KB would demand feature cuts unrelated to CI, so the budget is set at **88 KB** — roughly 5% headroom over the current baseline. That is tight enough to catch a regression (a stray heavy import trips it immediately) while remaining green on current code. The dashboard is authenticated and code-split away from the public bundle, so its 150 KB ceiling is generous headroom for future data-heavy widgets.
