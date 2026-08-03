import { z } from 'zod';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import { postSchema, itemSchema, userSchema, type Post, type Item, type User } from '$lib/schemas';

/**
 * Base URL of the API, from `PUBLIC_API_BASE_URL` (see `.env`). Locally this is
 * the MSW-mocked origin — MSW intercepts these requests in both the browser and
 * Node, so nothing hits the network, but the code fetches exactly as it would
 * against a real API. Override the env var per environment when deploying.
 */
export const API_BASE_URL = PUBLIC_API_BASE_URL;

/**
 * Fetches a collection endpoint and validates the response at the boundary.
 * The API response is untrusted, so it's parsed as `unknown` through the schema.
 *
 * @throws if the response is not ok, or if the payload fails schema validation.
 */
async function fetchCollection<T extends z.ZodType>(
	endpoint: string,
	schema: T,
	fetchFn: typeof fetch = fetch
): Promise<z.infer<T>[]> {
	const response = await fetchFn(`${API_BASE_URL}${endpoint}`);
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
 * `fetch` from a `load` function; it defaults to the global `fetch` elsewhere.
 */
export const getPosts = (fetchFn?: typeof fetch): Promise<Post[]> =>
	fetchCollection('/posts', postSchema, fetchFn);

export const getItems = (fetchFn?: typeof fetch): Promise<Item[]> =>
	fetchCollection('/items', itemSchema, fetchFn);

export const getUsers = (fetchFn?: typeof fetch): Promise<User[]> =>
	fetchCollection('/users', userSchema, fetchFn);
