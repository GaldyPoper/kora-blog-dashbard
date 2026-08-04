import { localeShema, type Locale } from '$lib/schemas';
import type { LayoutLoad } from './$types';

// Resolves the locale once for every page under `/[lang]`. The matcher already
// guarantees a valid segment; `catch` keeps this total for defensiveness.
export const load: LayoutLoad = ({ params }) => {
	const locale: Locale = localeShema.catch('en').parse(params.lang);
	return { locale };
};
