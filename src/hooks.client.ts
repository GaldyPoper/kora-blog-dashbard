import { env } from '$env/dynamic/public';
import type { ClientInit } from '@sveltejs/kit';

/**
 * Start the MSW browser worker so client-side fetches hit the mock API. Mocking
 * is ON by default; set PUBLIC_ENABLE_API_MOCKING=false to turn it off once you
 * point PUBLIC_API_BASE_URL at a real API.
 */
export const init: ClientInit = async () => {
	if (env.PUBLIC_ENABLE_API_MOCKING === 'false') return;
	const { worker } = await import('$lib/mocks/browser');
	await worker.start({ onUnhandledRequest: 'bypass' });
};
