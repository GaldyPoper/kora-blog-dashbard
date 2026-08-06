#!/usr/bin/env node
// Enforces the initial-route JavaScript budget for the public and dashboard
// surfaces. "Initial route JS" = every script the browser must download and
// execute to render and hydrate a route on a cold navigation: the SvelteKit
// client entry (start + app) plus the route's layout/leaf node chunks, plus the
// full transitive closure of their *static* imports. Lazy (`dynamicImports`)
// chunks are excluded — they are fetched on demand, not on first paint.
//
// The measurement is static: it reads the production client build
// (`.svelte-kit/output/client`) and its Vite manifest, so it needs no running
// server and is deterministic in CI. Sizes are gzip (level 9) to model what a
// CDN serves over the wire, matching how `size-limit` reports.
//
// Run `node scripts/check-bundle-size.mjs` after `npm run build`. Exits 1 (and
// fails CI) if any surface is over budget.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const CLIENT_DIR = '.svelte-kit/output/client';
const SERVER_NODES_DIR = '.svelte-kit/output/server/nodes';
const VITE_MANIFEST = path.join(CLIENT_DIR, '.vite/manifest.json');
const SERVER_MANIFEST = new URL('../.svelte-kit/output/server/manifest.js', import.meta.url);

// Budgets in KB gzip. See README "Performance budgets" for the justification.
const BUDGETS = [
	{
		label: 'public: home  /[lang]',
		// Home leaf lives at src/routes/[lang=lang]/+page.svelte.
		leaf: '_lang_lang_/_page',
		maxKB: 88
	},
	{
		label: 'public: blog post  /[lang]/blog/[slug]',
		leaf: '_lang_lang_/blog/_slug_/_page',
		maxKB: 88
	},
	{
		label: 'dashboard  /[lang]/dashboard',
		leaf: '_lang_lang_/dashboard/_page',
		maxKB: 150
	}
];

const GZIP = (buf) => zlib.gzipSync(buf, { level: 9 }).length;

function fail(msg) {
	console.error(`\n✖ ${msg}`);
	process.exit(1);
}

if (!fs.existsSync(VITE_MANIFEST)) {
	fail(`Client build not found at ${VITE_MANIFEST}. Run \`npm run build\` first.`);
}

const viteManifest = JSON.parse(fs.readFileSync(VITE_MANIFEST, 'utf8'));

// Map each build node number -> its source page/layout path, read from the
// server build. Robust to node renumbering when routes are added/removed.
const nodePathByNum = {};
for (const file of fs.readdirSync(SERVER_NODES_DIR)) {
	const num = file.replace(/\.js$/, '');
	const src = fs.readFileSync(path.join(SERVER_NODES_DIR, file), 'utf8');
	const m = src.match(/entries\/pages\/[^'"]+/);
	nodePathByNum[num] = m ? m[0] : null;
}
const numForPath = (needle) =>
	Object.keys(nodePathByNum).find((n) => nodePathByNum[n]?.includes(needle));

const ROOT_LAYOUT = numForPath('/_layout.svelte'); // entries/pages/_layout.svelte.js
const LANG_LAYOUT = numForPath('_lang_lang_/_layout'); // per-locale layout

// The Vite key for a client node chunk.
const nodeKey = (num) => `.svelte-kit/generated/client-optimized/nodes/${num}.js`;

// Resolve the static-import closure (files) for a set of Vite manifest keys.
function closure(keys) {
	const files = new Set();
	const seen = new Set();
	const walk = (key) => {
		if (seen.has(key)) return;
		seen.add(key);
		const entry = viteManifest[key];
		if (!entry) return;
		if (entry.file) files.add(entry.file);
		for (const dep of entry.imports ?? []) walk(dep);
	};
	keys.forEach(walk);
	return files;
}

// Shared client entry (start + app) and their static-import chunks. SvelteKit
// marks every route node `isEntry`, so we take the authoritative base list from
// the server manifest's `_.client.imports` rather than from `isEntry` flags.
const { manifest } = await import(SERVER_MANIFEST);
const baseFiles = new Set(manifest._.client.imports);

let failed = false;
console.log('Initial route JS budgets (gzip):\n');

for (const budget of BUDGETS) {
	const leafNum = numForPath(budget.leaf);
	if (leafNum === undefined) {
		fail(`Could not locate build node for leaf "${budget.leaf}". Did the routes change?`);
	}

	const nodeNums = [ROOT_LAYOUT];
	// Routes under [lang] also load the per-locale layout.
	if (nodePathByNum[leafNum].includes('_lang_lang_') && LANG_LAYOUT) {
		nodeNums.push(LANG_LAYOUT);
	}
	nodeNums.push(leafNum);

	const files = new Set(baseFiles);
	for (const f of closure(nodeNums.map(nodeKey))) files.add(f);

	let bytes = 0;
	for (const f of files) {
		bytes += GZIP(fs.readFileSync(path.join(CLIENT_DIR, f)));
	}
	const kb = bytes / 1024;
	const ok = kb <= budget.maxKB;
	if (!ok) failed = true;
	const pct = ((kb / budget.maxKB) * 100).toFixed(0);
	console.log(
		`  ${ok ? '✓' : '✖'} ${budget.label.padEnd(42)} ${kb.toFixed(1).padStart(6)} KB / ${String(
			budget.maxKB
		).padStart(3)} KB  (${pct}%)  ${files.size} files`
	);
}

console.log('');
if (failed) {
	fail('One or more surfaces exceed their JS budget.');
}
console.log('✓ All surfaces within budget.\n');
