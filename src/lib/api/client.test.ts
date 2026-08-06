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

	/** Captures the requested URL and returns an empty page. */
	const captureUrl = (): { get: () => string; fetch: typeof fetch } => {
		let requestedUrl = '';
		const fetchFn: typeof fetch = (async (input: RequestInfo | URL) => {
			requestedUrl = String(input);
			return new Response(JSON.stringify({ items: [], total: 0, page: 1, perPage: 6 }), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			});
		}) as typeof fetch;
		return { get: () => requestedUrl, fetch: fetchFn };
	};

	it('requests the given page and perPage', async () => {
		const cap = captureUrl();
		await getPosts({ page: 2, perPage: 6 }, cap.fetch);
		expect(cap.get()).toContain('page=2');
		expect(cap.get()).toContain('perPage=6');
	});

	it('appends search params (q, tag, sort, locale) when provided', async () => {
		const cap = captureUrl();
		await getPosts({ q: 'perf', tag: 'design', sort: 'oldest', locale: 'de' }, cap.fetch);
		const params = new URLSearchParams(cap.get().slice(cap.get().indexOf('?')));
		expect(params.get('q')).toBe('perf');
		expect(params.get('tag')).toBe('design');
		expect(params.get('sort')).toBe('oldest');
		expect(params.get('locale')).toBe('de');
	});

	it('omits search params for the plain listing', async () => {
		const cap = captureUrl();
		await getPosts({ page: 1 }, cap.fetch);
		const url = cap.get();
		expect(url).not.toContain('q=');
		expect(url).not.toContain('tag=');
		expect(url).not.toContain('sort=');
		expect(url).not.toContain('locale=');
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
