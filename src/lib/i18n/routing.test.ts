import { stripLocale, localizePath, locales, defaultLocale } from './routing';

describe('i18n routing helpers', () => {
	describe('stripLocale', () => {
		const tests: [string, string][] = [
			['/en', ''],
			['/de', ''],
			['/en/blog', '/blog'],
			['/de/blog', '/blog'],
			['/en/blog/post-1', '/blog/post-1'],
			['/', ''],
			['/blog', '/blog'],
			['/fr/blog', '/fr/blog']
		];

		it.each(tests)('strips "%s" to "%s"', (input, expected) => {
			expect(stripLocale(input)).toBe(expected);
		});
	});

	describe('localizePath', () => {
		const tests: [string, string, string][] = [
			['en', '', '/en'],
			['de', '', '/de'],
			['en', '/blog', '/en/blog'],
			['de', '/blog/post-1', '/de/blog/post-1']
		];

		it.each(tests)('localizePath(%s, %s) → %s', (locale, path, expected) => {
			expect(localizePath(locale as 'en' | 'de', path)).toBe(expected);
		});
	});

	it('round-trips a path through strip + localize', () => {
		for (const locale of locales) {
			expect(localizePath(locale, stripLocale(`/${locale}/blog`))).toBe(`/${locale}/blog`);
		}
	});

	it('exposes the supported locales and a default', () => {
		expect(locales).toEqual(['en', 'de']);
		expect(locales).toContain(defaultLocale);
	});
});
