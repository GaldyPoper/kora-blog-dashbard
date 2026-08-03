import { z } from 'zod';
import { postSchema, itemSchema, userSchema, type Post, type Item, type User } from '$lib/schemas';

/**
 * Fetches a same-origin API endpoint and validates the response. Even though
 * these are our own routes, `response.json()` is `any`, so parsing it through
 * the schema is how we get a *typed*, trustworthy result at the fetch boundary.
 *
 * @throws if the response is not ok, or if the payload fails schema validation.
 */
async function fetchCollection<T extends z.ZodType>(
	endpoint: string,
	schema: T,
	fetchFn: typeof fetch = fetch
): Promise<z.infer<T>[]> {
	const response = await fetchFn(endpoint);
	if (!response.ok) {
		throw new Error(`GET ${endpoint} failed with status ${response.status}.`);
	}

	const payload: unknown = await response.json();

	const result = z.array(schema).safeParse(payload);
	if (!result.success) {
		throw new Error(
			`GET ${endpoint} returned data that failed validation:\n${z.prettifyError(result.error)}`
		);
	}

	return result.data;
}

/**
 * Each accessor optionally takes a `fetch` implementation — pass SvelteKit's
 * `fetch` from a `load` function so relative URLs resolve on the server too.
 */
export const getPosts = (fetchFn?: typeof fetch): Promise<Post[]> =>
	fetchCollection('/api/posts', postSchema, fetchFn);

export const getItems = (fetchFn?: typeof fetch): Promise<Item[]> =>
	fetchCollection('/api/items', itemSchema, fetchFn);

export const getUsers = (fetchFn?: typeof fetch): Promise<User[]> =>
	fetchCollection('/api/users', userSchema, fetchFn);
