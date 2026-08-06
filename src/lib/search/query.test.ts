import type { Post } from '$lib/schemas';
import { queryPosts, type QueryOptions } from './query';

type PostOverrides = {
	slug: string;
	title: string;
	excerpt?: string;
	body?: string;
	tags?: string[];
	author?: string;
	publishedAt: string;
};

function makePost(o: PostOverrides): Post {
	return {
		id: o.slug,
		slug: o.slug,
		translations: {
			en: { title: o.title, excerpt: o.excerpt ?? '', body: o.body ?? '' },
			de: { title: `${o.title} (DE)`, excerpt: '', body: '' }
		},
		tags: o.tags ?? [],
		author: { id: 'a1', name: o.author ?? 'Ada Lovelace', avatarColor: '#a855f7' },
		publishedAt: o.publishedAt,
		readingTimeMinutes: 5,
		coverColor: '#a855f7'
	};
}

const perf = makePost({
	slug: 'perf',
	title: 'Sub-second performance',
	excerpt: 'making it fast',
	tags: ['performance', 'engineering'],
	publishedAt: '2026-03-01T00:00:00.000Z'
});
const design = makePost({
	slug: 'design',
	title: 'A design token system',
	body: 'thoughts on performance budgets too',
	tags: ['design'],
	publishedAt: '2026-02-01T00:00:00.000Z'
});
const oldPerf = makePost({
	slug: 'old-perf',
	title: 'Old notes on performance',
	tags: ['performance'],
	publishedAt: '2025-01-01T00:00:00.000Z'
});

const posts = [design, perf, oldPerf];

const opts = (over: Partial<Parameters<typeof queryPosts>[1]> = {}) =>
	({ q: '', tag: null, sort: 'newest', locale: 'en', ...over }) satisfies QueryOptions;

describe('queryPosts filtering', () => {
	it('returns all posts (newest first) when there is no query or tag', () => {
		const result = queryPosts(posts, opts());
		expect(result.map((p) => p.slug)).toEqual(['perf', 'design', 'old-perf']);
	});

	it('filters by tag', () => {
		const result = queryPosts(posts, opts({ tag: 'performance' }));
		expect(result.map((p) => p.slug).sort()).toEqual(['old-perf', 'perf']);
	});

	it('matches the query across title, excerpt, body and tags', () => {
		// "performance" appears in perf (title+tag), design (body), old-perf (title+tag).
		const result = queryPosts(posts, opts({ q: 'performance' }));
		expect(result.map((p) => p.slug).sort()).toEqual(['design', 'old-perf', 'perf']);
	});

	it('is case-insensitive', () => {
		expect(queryPosts(posts, opts({ q: 'PERFORMANCE' })).length).toBe(3);
	});

	it('excludes posts missing any term (AND semantics)', () => {
		const result = queryPosts(posts, opts({ q: 'design token' }));
		expect(result.map((p) => p.slug)).toEqual(['design']);
	});

	it('combines tag filter with the text query', () => {
		const result = queryPosts(posts, opts({ q: 'performance', tag: 'design' }));
		expect(result.map((p) => p.slug)).toEqual(['design']);
	});

	it('returns nothing when a term matches no post', () => {
		expect(queryPosts(posts, opts({ q: 'kubernetes' }))).toEqual([]);
	});

	it('searches within the requested locale', () => {
		expect(queryPosts(posts, opts({ q: '(DE)', locale: 'de' })).length).toBe(3);
		expect(queryPosts(posts, opts({ q: '(DE)', locale: 'en' })).length).toBe(0);
	});
});

describe('queryPosts sorting', () => {
	it('orders by newest', () => {
		const result = queryPosts(posts, opts({ q: 'performance', sort: 'newest' }));
		expect(result.map((p) => p.slug)).toEqual(['perf', 'design', 'old-perf']);
	});

	it('orders by oldest', () => {
		const result = queryPosts(posts, opts({ q: 'performance', sort: 'oldest' }));
		expect(result.map((p) => p.slug)).toEqual(['old-perf', 'design', 'perf']);
	});

	it('does not mutate the input array', () => {
		const input = [...posts];
		queryPosts(input, opts({ sort: 'oldest' }));
		expect(input).toEqual(posts);
	});
});
