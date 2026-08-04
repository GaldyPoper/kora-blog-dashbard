import { createTranslator, type TranslationKey } from './translator';

const { enMock, deMock } = vi.hoisted(() => ({
	enMock: {
		'blog.title': 'Writing',
		'blog.readingTime': '{minutes} min read',
		'search.results': '{count} results for "{query}"'
	},
	deMock: {
		'blog.title': 'Texte',
		'blog.readingTime': '{minutes} Min. Lesezeit'
	}
}));

vi.mock('../../../mocks/i18n.en.json', () => ({ default: enMock }));
vi.mock('../../../mocks/i18n.de.json', () => ({ default: deMock }));

describe('i18n translator unit tests', () => {
	it('translates a key for the given locale', () => {
		expect(createTranslator('en').t('blog.title')).toBe(enMock['blog.title']);
		expect(createTranslator('de').t('blog.title')).toBe(deMock['blog.title']);
	});

	it('interpolates named placeholders', () => {
		expect(createTranslator('en').t('blog.readingTime', { minutes: 5 })).toBe('5 min read');
		expect(createTranslator('de').t('blog.readingTime', { minutes: 5 })).toBe('5 Min. Lesezeit');
	});

	it('interpolates multiple placeholders', () => {
		expect(createTranslator('en').t('search.results', { count: 3, query: 'zod' })).toBe(
			'3 results for "zod"'
		);
	});

	it('leaves placeholders untouched when params are missing', () => {
		const { t } = createTranslator('en');
		expect(t('blog.readingTime')).toContain('{minutes}');
		expect(t('search.results', { count: 3 })).toContain('{query}');
	});

	it('returns the key and logs when a translation is missing', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const missing = 'does.not.exist' as TranslationKey;
		expect(createTranslator('de').t(missing)).toBe('does.not.exist');
		expect(spy).toHaveBeenCalledWith('[i18n] Key not found: ', missing);
		spy.mockRestore();
	});
});
