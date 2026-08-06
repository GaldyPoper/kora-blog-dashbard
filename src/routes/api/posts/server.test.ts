import type { PaginatedPosts } from '$lib/schemas';
import postsJson from '../../../../mocks/posts.json';
import { GET } from './+server';

// Invoke the endpoint with a query string and return its parsed JSON body.
async function call(search = ''): Promise<PaginatedPosts> {
	const url = new URL(`http://localhost/api/posts${search}`);
	const event = { url, setHeaders: () => {} } as unknown as Parameters<typeof GET>[0];
	const response = await GET(event);
	return response.json();
}

const withTag = (tag: string) => postsJson.filter((p) => p.tags.includes(tag));

describe('GET /api/posts', () => {
	it('returns the first page of all posts, newest first, by default', async () => {
		const body = await call();
		expect(body.total).toBe(postsJson.length);
		expect(body.page).toBe(1);
		expect(body.perPage).toBe(6);
		expect(body.items).toHaveLength(6);
		// Mock data is already newest-first, so order is preserved.
		expect(body.items[0].slug).toBe(postsJson[0].slug);
	});

	it('paginates with ?page and ?perPage', async () => {
		const body = await call('?page=2&perPage=4');
		expect(body.page).toBe(2);
		expect(body.perPage).toBe(4);
		expect(body.items).toHaveLength(4);
		expect(body.items[0].slug).toBe(postsJson[4].slug);
	});

	it('filters by ?tag', async () => {
		const expected = withTag('engineering');
		const body = await call('?tag=engineering&perPage=50');
		expect(body.total).toBe(expected.length);
		expect(body.items.every((p) => p.tags.includes('engineering'))).toBe(true);
	});

	it('filters by ?q against the post text', async () => {
		const body = await call('?q=combobox&perPage=50');
		expect(body.total).toBe(1);
		expect(body.items[0].slug).toBe('accessible-combobox-from-scratch');
	});

	it('scopes the ?q text match to ?locale', async () => {
		// The first post has a German title ("… unter einer Sekunde …").
		const de = await call('?q=Sekunde&locale=de&perPage=50');
		expect(de.total).toBe(1);
		const en = await call('?q=Sekunde&locale=en&perPage=50');
		expect(en.total).toBe(0);
	});

	it('sorts oldest-first with ?sort=oldest', async () => {
		const body = await call('?sort=oldest&perPage=50');
		const dates = body.items.map((p) => p.publishedAt);
		expect(dates).toEqual([...dates].sort());
	});

	it('combines ?q and ?tag', async () => {
		const body = await call('?q=we&tag=design&perPage=50');
		expect(body.items.every((p) => p.tags.includes('design'))).toBe(true);
	});
});
