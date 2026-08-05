import { json } from '@sveltejs/kit';
import { getPosts } from '$lib/server/data';
import type { RequestHandler } from './$types';

const POSTS_PER_PAGE = 6;

// Parse a positive-integer query param, falling back when missing/invalid.
function positiveInt(value: string | null, fallback: number): number {
	const n = Number(value);
	return Number.isInteger(n) && n > 0 ? n : fallback;
}

export const GET: RequestHandler = ({ url, setHeaders }) => {
	const all = getPosts();
	const total = all.length;
	const perPage = positiveInt(url.searchParams.get('perPage'), POSTS_PER_PAGE);
	const page = positiveInt(url.searchParams.get('page'), 1);

	const start = (page - 1) * perPage;
	const items = all.slice(start, start + perPage);

	// Same 60-minute CDN edge cache as the blog page; keyed per ?page/?perPage so
	// client-side navigations (which refetch this endpoint) are edge-served too.
	setHeaders({
		'cache-control': 'public, max-age=0, must-revalidate',
		'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=60'
	});

	return json({ items, total, page, perPage });
};
