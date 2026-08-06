import { z } from 'zod';

/**
 * Search state lives entirely in the URL so it is shareable and survives
 * back/forward navigation. This module is the single place that knows how to
 * *read* that state from a `URLSearchParams` and how to *write* a normalized
 * query string back out — parsing is tolerant (unknown values fall back to a
 * default) while serialization is canonical (defaults are omitted), so
 * `parsePostQuery(build(x))` round-trips to the same normalized state.
 */

export const postSortSchema = z.enum(['newest', 'oldest']);
export type PostSort = z.infer<typeof postSortSchema>;

export const DEFAULT_SORT: PostSort = 'newest';
export const SEARCH_PER_PAGE = 6;

export type PostQuery = {
	q: string;
	tag: string | null;
	sort: PostSort;
	page: number;
};

/** Reads and normalizes the search state from a URL's query parameters. */
export function parsePostQuery(searchParams: URLSearchParams): PostQuery {
	const q = (searchParams.get('q') ?? '').trim();
	const rawTag = (searchParams.get('tag') ?? '').trim();
	const tag = rawTag === '' ? null : rawTag;
	const sort = postSortSchema.catch(DEFAULT_SORT).parse(searchParams.get('sort'));
	const pageNumber = Number(searchParams.get('page'));
	const page = Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
	return { q, tag, sort, page };
}

/**
 * Serializes search state into a canonical query string, omitting anything at
 * its default so shared URLs stay clean (`/search?q=perf` rather than
 * `/search?q=perf&tag=&sort=relevance&page=1`).
 */
export function buildPostQueryString(query: Partial<PostQuery>): string {
	const params = new URLSearchParams();
	const q = query.q?.trim();
	if (q) params.set('q', q);
	if (query.tag) params.set('tag', query.tag);
	if (query.sort && query.sort !== DEFAULT_SORT) params.set('sort', query.sort);
	if (query.page && query.page > 1) params.set('page', String(query.page));
	return params.toString();
}
