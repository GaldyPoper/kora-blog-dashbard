import { getPosts, getItems, getUsers } from '$lib/api/client';
import type { PageLoad } from './$types';

// Universal load: on the initial (server) render SvelteKit calls the /api routes
// directly; on client navigations it fetches them over HTTP. Each response is
// Zod-validated inside the client before it reaches here.
export const load: PageLoad = async ({ fetch }) => {
	const [posts, items, users] = await Promise.all([
		getPosts(fetch),
		getItems(fetch),
		getUsers(fetch)
	]);

	return { posts, items, users };
};
