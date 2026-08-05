import { locales } from '$lib/i18n';
import type { EntryGenerator } from './$types';

const SSG_SLUGS = [
	'sub-second-lcp-on-a-content-site',
	'a-pragmatic-design-token-system',
	'why-we-moved-off-the-spa-default',
	'accessible-combobox-from-scratch',
	'stop-fighting-your-form-library',
	'streaming-ssr-in-plain-english',
	'what-good-error-states-look-like',
	'edge-or-node-a-sober-comparison',
	'how-we-cut-our-bundle-by-60',
	'designing-for-keyboard-users-first'
];

export const entries: EntryGenerator = () => {
	return locales.flatMap((lang) => SSG_SLUGS.map((slug) => ({ lang, slug })));
};
