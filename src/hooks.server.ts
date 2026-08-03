import { env } from '$env/dynamic/public';
import type { ServerInit } from '@sveltejs/kit';

/**
 * Start the MSW Node server so SSR fetches hit the mock API. Mocking is ON by
 * default (this app has no real backend); set PUBLIC_ENABLE_API_MOCKING=false
 * to turn it off once you point PUBLIC_API_BASE_URL at a real API.
 */
export const init: ServerInit = async () => {
	if (env.PUBLIC_ENABLE_API_MOCKING === 'false') return;
	const { server } = await import('$lib/mocks/server');
	server.listen({ onUnhandledRequest: 'bypass' });
};
