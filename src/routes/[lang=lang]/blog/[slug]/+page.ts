import { error } from '@sveltejs/kit';
import { building } from '$app/environment';
import { getPostBySlug } from '$lib/api/client';
import type { PageLoad } from './$types';

export const ssr = true;
export const prerender = 'auto';

export const load: PageLoad = async ({ params, fetch, setHeaders }) => {
	const post = await getPostBySlug(params.slug, fetch).catch(() => {
		error(404, 'Post not found');
	});

	if (!building) {
		setHeaders({
			'cache-control': 'public, max-age=0, must-revalidate',
			'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=60'
		});
	}

	return { post };
};
