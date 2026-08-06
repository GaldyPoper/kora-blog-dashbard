// Lighthouse CI configuration.
//
// `lhci autorun` builds nothing itself — CI runs `pnpm build` first — it starts
// the production preview server, runs Lighthouse against the two public
// surfaces, and asserts the budgets below. Any failing assertion exits non-zero
// and fails the workflow.
//
// Device / throttling: we do NOT pass a `preset`, so Lighthouse uses its
// default mobile configuration — Moto G Power screen emulation with simulated
// 4x CPU throttling and a slow-4G network — exactly the target profile.
//
// Note on INP: Lighthouse is a *lab* tool and cannot measure Interaction to
// Next Paint (a field metric that needs real interactions). Total Blocking Time
// is its lab proxy and is what we enforce here; a TBT under 200 ms is the
// accepted lab signal for a good (<200 ms) INP.

const BASE = 'http://localhost:4173';

module.exports = {
	ci: {
		collect: {
			// Home ("/" 307-redirects to the default locale) and an article page.
			url: [`${BASE}/en`, `${BASE}/en/blog/sub-second-lcp-on-a-content-site`],
			startServerCommand: 'pnpm preview --port 4173',
			startServerReadyPattern: 'Local:',
			startServerReadyTimeout: 30000,
			// Median of 3 runs to smooth out CI runner variance.
			numberOfRuns: 3,
			settings: {
				// Explicit mobile form factor (also Lighthouse's default).
				formFactor: 'mobile',
				emulatedUserAgent: true
			}
		},
		assert: {
			assertions: {
				// Category scores — fail the build below 0.95.
				'categories:performance': ['error', { minScore: 0.95 }],
				'categories:accessibility': ['error', { minScore: 0.95 }],
				'categories:seo': ['error', { minScore: 0.95 }],
				'categories:best-practices': ['error', { minScore: 0.95 }],

				// Core Web Vitals (lab).
				'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
				'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
				// TBT as the lab proxy for INP (<200 ms).
				'total-blocking-time': ['error', { maxNumericValue: 200 }]
			}
		},
		upload: {
			// Store reports as workflow artifacts; no external LHCI server needed.
			target: 'filesystem',
			outputDir: './.lighthouseci'
		}
	}
};
