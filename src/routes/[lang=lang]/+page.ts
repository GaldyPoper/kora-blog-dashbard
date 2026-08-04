import { getPosts, getItems, getUsers } from '$lib/api/client';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [posts, items, users] = await Promise.all([
		getPosts(fetch),
		getItems(fetch),
		getUsers(fetch)
	]);

	return { posts, items, users };
};
