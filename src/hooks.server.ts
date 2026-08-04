import type { Handle } from '@sveltejs/kit';
import { defaultLocale } from '$lib/i18n';
import { localeShema } from '$lib/schemas';

export const handle: Handle = async ({ event, resolve }) => {
	const [, first] = event.url.pathname.match(/^\/([^/]+)/) ?? [];
	const lang = localeShema.safeParse(first).success ? first : defaultLocale;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
