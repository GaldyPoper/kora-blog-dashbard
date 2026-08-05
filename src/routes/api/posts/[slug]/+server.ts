import { json, error } from '@sveltejs/kit';
import { getPosts } from '$lib/server/data';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params, setHeaders }) => {
	const post = getPosts().find((p) => p.slug === params.slug);

	if (!post) {
		error(404, 'Post not found');
	}

	// Same 60-minute CDN edge cache as the blog list; a single post rarely changes.
	setHeaders({
		'cache-control': 'public, max-age=0, must-revalidate',
		'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, stale-while-revalidate=60'
	});

	return json(post);
};
