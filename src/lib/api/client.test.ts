import { getPosts, getItems, getUsers } from './client';
import postsJson from '../../../mocks/posts.json';
import itemsJson from '../../../mocks/items.json';
import usersJson from '../../../mocks/users.json';

/** A `fetch` stand-in that returns a JSON response with the given body/status. */
const stubFetch = (payload: unknown, status = 200): typeof fetch =>
	(async () =>
		new Response(JSON.stringify(payload), {
			status,
			headers: { 'content-type': 'application/json' }
		})) as typeof fetch;

describe('api client', () => {
	it('fetches and validates posts', async () => {
		const posts = await getPosts(stubFetch(postsJson));
		expect(posts).toHaveLength(postsJson.length);
	});

	it('fetches and validates items', async () => {
		const items = await getItems(stubFetch(itemsJson));
		expect(items).toHaveLength(itemsJson.length);
	});

	it('fetches and validates users', async () => {
		const users = await getUsers(stubFetch(usersJson));
		expect(users).toHaveLength(usersJson.length);
	});

	it('throws when the response fails schema validation', async () => {
		await expect(getPosts(stubFetch([{ id: 42 }]))).rejects.toThrow(/failed validation/);
	});

	it('throws when the response is not ok', async () => {
		await expect(getPosts(stubFetch(null, 500))).rejects.toThrow(/status 500/);
	});
});
