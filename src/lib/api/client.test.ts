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
	it('fetches and validates a page of posts', async () => {
		const payload = { items: postsJson.slice(0, 6), total: postsJson.length, page: 1, perPage: 6 };
		const result = await getPosts({}, stubFetch(payload));
		expect(result.items).toHaveLength(6);
		expect(result.total).toBe(postsJson.length);
		expect(result.page).toBe(1);
	});

	it('requests the given page and perPage', async () => {
		let requestedUrl = '';
		const capture: typeof fetch = (async (input: RequestInfo | URL) => {
			requestedUrl = String(input);
			return new Response(JSON.stringify({ items: [], total: 0, page: 2, perPage: 6 }), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			});
		}) as typeof fetch;

		await getPosts({ page: 2, perPage: 6 }, capture);
		expect(requestedUrl).toContain('page=2');
		expect(requestedUrl).toContain('perPage=6');
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
		const bad = { items: [{ id: 42 }], total: 1, page: 1, perPage: 6 };
		await expect(getPosts({}, stubFetch(bad))).rejects.toThrow(/failed validation/);
	});

	it('throws when the response is not ok', async () => {
		await expect(getPosts({}, stubFetch(null, 500))).rejects.toThrow(/status 500/);
	});
});
