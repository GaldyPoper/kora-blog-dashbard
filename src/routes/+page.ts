import { redirect } from '@sveltejs/kit';
import { defaultLocale, localizePath } from '$lib/i18n';
import type { PageLoad } from './$types';

// The locale is a required URL segment, so the bare "/" has no page of its own —
// send visitors to the default-locale home.
export const load: PageLoad = () => {
	redirect(307, localizePath(defaultLocale, ''));
};
