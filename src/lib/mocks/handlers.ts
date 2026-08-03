import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '$lib/api/client';
import posts from '../../../mocks/posts.json';
import items from '../../../mocks/items.json';
import users from '../../../mocks/users.json';

/**
 * Request handlers that serve the raw mock JSON. The responses are intentionally
 * NOT validated here — validation happens on the consumer side (`$lib/api/client`)
 * at fetch time, real production behaviour simulatiuon.
 */
// The mocked API is a different origin, so mirror a real API and return CORS
// headers — otherwise SvelteKit's SSR fetch (undici) rejects the response.
const CORS_HEADERS = { 'Access-Control-Allow-Origin': '*' };

export const handlers = [
	http.get(`${API_BASE_URL}/posts`, () => HttpResponse.json(posts, { headers: CORS_HEADERS })),
	http.get(`${API_BASE_URL}/items`, () => HttpResponse.json(items, { headers: CORS_HEADERS })),
	http.get(`${API_BASE_URL}/users`, () => HttpResponse.json(users, { headers: CORS_HEADERS }))
];
