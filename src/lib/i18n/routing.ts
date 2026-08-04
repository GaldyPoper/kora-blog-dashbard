import { localeShema, type Locale } from '$lib/schemas';

export const locales = localeShema.options;
export const defaultLocale: Locale = 'en';

/**
 * Removes a leading locale segment, returning the locale-independent path.
 *
 * @example stripLocale('/de/blog') // '/blog'
 * @example stripLocale('/en')      // '' (the localized home)
 */
export function stripLocale(pathname: string): string {
	const [, first, rest = ''] = pathname.match(/^\/([^/]+)(\/.*)?$/) ?? [];
	if (first && localeShema.safeParse(first).success) {
		return rest;
	}
	return pathname === '/' ? '' : pathname;
}

/**
 * Prefixes a locale-independent path with a locale segment.
 *
 * @example localizePath('en', '/blog') // '/en/blog'
 * @example localizePath('de', '')      // '/de'
 */
export function localizePath(locale: Locale, path: string): string {
	return `/${locale}${path}`;
}
