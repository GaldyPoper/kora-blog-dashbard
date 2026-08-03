import { dev } from '$app/environment';
import type { ClientInit } from '@sveltejs/kit';

/** Start the MSW browser worker once, in dev only, so client fetches hit the mocks. */
export const init: ClientInit = async () => {
	if (!dev) return;
	const { worker } = await import('$lib/mocks/browser');
	await worker.start({ onUnhandledRequest: 'bypass' });
};
