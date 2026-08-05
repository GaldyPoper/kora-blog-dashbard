import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/api/client';
import type { PageLoad } from './$types';

export const ssr = true;
export const prerender = false;

function parsePage(value: string | null): number {
	const n = Number(value);
	return Number.isInteger(n) && n > 0 ? n : 1;
}

export const load: PageLoad = async ({ url, fetch, setHeaders }) => {
	const page = parsePage(url.searchParams.get('page'));
	const { items, total, perPage } = await getPosts({ page }, fetch);

	if (page > 1 && items.length === 0) {
		error(404, 'Page not found');
	}

	// Cache at Netlify's CDN edge for 60 minutes; the browser always revalidates
	// against the edge so purges/updates are picked up on the next visit.
	setHeaders({
		'cache-control': 'public, max-age=0, must-revalidate',
		'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=60'
	});

	return { posts: items, page, perPage, total };
};
