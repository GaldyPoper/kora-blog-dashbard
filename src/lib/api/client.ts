import { z } from 'zod';
import {
	itemSchema,
	userSchema,
	postSchema,
	paginatedPostsSchema,
	type Item,
	type User,
	type Post,
	type PaginatedPosts
} from '$lib/schemas';

const POSTS_PER_PAGE = 6;

/**
 * Fetches a same-origin API endpoint and validates the response against `schema`.
 * Even though these are our own routes, `response.json()` is `any`, so parsing it
 * through the schema is how we get a *typed*, trustworthy result at the boundary.
 *
 * @throws if the response is not ok, or if the payload fails schema validation.
 */
async function fetchValidated<T extends z.ZodType>(
	endpoint: string,
	schema: T,
	fetchFn: typeof fetch = fetch
): Promise<z.infer<T>> {
	const response = await fetchFn(endpoint);
	if (!response.ok) {
		throw new Error(`GET ${endpoint} failed with status ${response.status}.`);
	}

	const payload: unknown = await response.json();

	const result = schema.safeParse(payload);
	if (!result.success) {
		throw new Error(
			`GET ${endpoint} returned data that failed validation:\n${z.prettifyError(result.error)}`
		);
	}

	return result.data;
}

/** Validates an endpoint that returns a bare array of `schema` items. */
const fetchCollection = <T extends z.ZodType>(
	endpoint: string,
	schema: T,
	fetchFn?: typeof fetch
): Promise<z.infer<T>[]> => fetchValidated(endpoint, z.array(schema), fetchFn);

/**
 * Each accessor optionally takes a `fetch` implementation — pass SvelteKit's
 * `fetch` from a `load` function so relative URLs resolve on the server too.
 */
export const getPosts = (
	params: { page?: number; perPage?: number } = {},
	fetchFn?: typeof fetch
): Promise<PaginatedPosts> => {
	const search = new URLSearchParams({
		page: String(params.page ?? 1),
		perPage: String(params.perPage ?? POSTS_PER_PAGE)
	});
	return fetchValidated(`/api/posts?${search}`, paginatedPostsSchema, fetchFn);
};

/** Fetches a single post by slug. Throws (404 → error) if it does not exist. */
export const getPostBySlug = (slug: string, fetchFn?: typeof fetch): Promise<Post> =>
	fetchValidated(`/api/posts/${encodeURIComponent(slug)}`, postSchema, fetchFn);

export const getItems = (fetchFn?: typeof fetch): Promise<Item[]> =>
	fetchCollection('/api/items', itemSchema, fetchFn);

export const getUsers = (fetchFn?: typeof fetch): Promise<User[]> =>
	fetchCollection('/api/users', userSchema, fetchFn);
