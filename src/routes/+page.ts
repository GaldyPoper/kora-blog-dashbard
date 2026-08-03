import { getPosts, getItems, getUsers } from '$lib/api/client';
import type { PageLoad } from './$types';

// Universal load: runs on the server for the initial render (MSW Node intercepts)
// and on the client for subsequent navigations (MSW browser worker intercepts).
// Each response is Zod-validated inside the client before it reaches here.
export const load: PageLoad = async ({ fetch }) => {
	const [posts, items, users] = await Promise.all([
		getPosts(fetch),
		getItems(fetch),
		getUsers(fetch)
	]);

	return { posts, items, users };
};
