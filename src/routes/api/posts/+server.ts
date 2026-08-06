import { json } from '@sveltejs/kit';
import { localeShema } from '$lib/schemas';
import { getPosts } from '$lib/server/data';
import { parsePostQuery, queryPosts } from '$lib/search';
import type { RequestHandler } from './$types';

const POSTS_PER_PAGE = 6;

// Parse a positive-integer query param, falling back when missing/invalid.
function positiveInt(value: string | null, fallback: number): number {
	const n = Number(value);
	return Number.isInteger(n) && n > 0 ? n : fallback;
}

export const GET: RequestHandler = ({ url, setHeaders }) => {
	// Filtering (?q, ?tag), sorting (?sort) and pagination (?page, ?perPage) all
	// happen here on the server, so the client only ever makes a parametrized
	// request — no shipping the full dataset to filter in the browser.
	const { q, tag, sort, page } = parsePostQuery(url.searchParams);
	const perPage = positiveInt(url.searchParams.get('perPage'), POSTS_PER_PAGE);
	// Text search matches the requested locale's translation; defaults to `en`.
	const locale = localeShema.catch('en').parse(url.searchParams.get('locale'));

	// With no ?q/?tag this is just the full list sorted (newest by default) — i.e.
	// the plain blog listing — so this one endpoint serves both list and search.
	const matched = queryPosts(getPosts(), { q, tag, sort, locale });
	const total = matched.length;

	const start = (page - 1) * perPage;
	const items = matched.slice(start, start + perPage);

	// 60-minute CDN edge cache, keyed by the full query string (filters/sort/page
	// included) so client-side navigations are edge-served too.
	setHeaders({
		'cache-control': 'public, max-age=0, must-revalidate',
		'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=60'
	});

	return json({ items, total, page, perPage });
};
