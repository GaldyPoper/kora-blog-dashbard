import { http, HttpResponse } from 'msw';
import { server } from '$lib/mocks/server';
import { getPosts, getItems, getUsers, API_BASE_URL } from './client';

// Route the client's fetches through the same MSW handlers the app uses.
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('api client', () => {
	it('fetches and validates posts', async () => {
		const posts = await getPosts();
		expect(posts.length).toBeGreaterThan(0);
		expect(posts[0].id).toBeTypeOf('string');
	});

	it('fetches and validates items', async () => {
		const items = await getItems();
		expect(items.length).toBeGreaterThan(0);
	});

	it('fetches and validates users', async () => {
		const users = await getUsers();
		expect(users.length).toBeGreaterThan(0);
	});

	it('throws when the API returns data that fails schema validation', async () => {
		server.use(http.get(`${API_BASE_URL}/posts`, () => HttpResponse.json([{ id: 42 }])));
		await expect(getPosts()).rejects.toThrow(/failed validation/);
	});

	it('throws when the API returns a non-ok response', async () => {
		server.use(http.get(`${API_BASE_URL}/posts`, () => new HttpResponse(null, { status: 500 })));
		await expect(getPosts()).rejects.toThrow(/status 500/);
	});
});
