import { dev } from '$app/environment';
import type { ServerInit } from '@sveltejs/kit';

/** Start the MSW Node server once, in dev only, so SSR fetches hit the mocks. */
export const init: ServerInit = async () => {
	if (!dev) return;
	const { server } = await import('$lib/mocks/server');
	server.listen({ onUnhandledRequest: 'bypass' });
};
