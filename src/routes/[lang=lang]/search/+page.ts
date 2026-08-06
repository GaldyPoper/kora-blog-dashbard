import { error } from '@sveltejs/kit';
import { getPosts } from '$lib/api/client';
import { parsePostQuery, SEARCH_PER_PAGE } from '$lib/search';
import type { PageLoad } from './$types';

export const ssr = true;
export const prerender = false;

export const load: PageLoad = async ({ url, parent, fetch, setHeaders }) => {
	const { locale } = await parent();
	const query = parsePostQuery(url.searchParams);
	const hasCriteria = query.q.length > 0 || query.tag !== null;

	const { items, total, perPage } = hasCriteria
		? await getPosts(
				{
					page: query.page,
					perPage: SEARCH_PER_PAGE,
					q: query.q,
					tag: query.tag,
					sort: query.sort,
					locale
				},
				fetch
			)
		: { items: [], total: 0, perPage: SEARCH_PER_PAGE };

	if (hasCriteria && query.page > 1 && items.length === 0) {
		error(404, 'Page not found');
	}

	setHeaders({
		'cache-control': 'public, max-age=0, must-revalidate',
		'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=60'
	});

	return {
		posts: items,
		total,
		perPage,
		page: query.page,
		q: query.q,
		tag: query.tag,
		sort: query.sort
	};
};
