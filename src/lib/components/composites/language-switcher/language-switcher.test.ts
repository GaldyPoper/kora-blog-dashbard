import { render, fireEvent } from '@testing-library/svelte';
import LanguageSwitcher from './language-switcher.svelte';

const { tSpy, gotoSpy, resolveSpy } = vi.hoisted(() => ({
	tSpy: vi.fn((key: string) => key),
	gotoSpy: vi.fn(),
	resolveSpy: vi.fn((path: string) => path)
}));

vi.mock('$lib/i18n', () => ({
	createTranslator: () => ({ t: tSpy }),
	locales: ['en', 'de'],
	stripLocale: (pathname: string) => pathname.replace(/^\/(en|de)/, '')
}));
vi.mock('$app/navigation', () => ({ goto: gotoSpy }));
vi.mock('$app/paths', () => ({ resolve: resolveSpy }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' }, url: { pathname: '/en/blog' } } }));

describe('LanguageSwitcher unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders a semantic <select>, not a <nav>', () => {
		const { container } = render(LanguageSwitcher);
		expect(container.querySelector('select')).not.toBeNull();
		expect(container.querySelector('nav')).toBeNull();
	});

	it('associates a <label> with the select for an accessible name', () => {
		const { getByRole, container } = render(LanguageSwitcher);
		const select = getByRole('combobox');
		expect(select.hasAttribute('id')).toBe(true);
		expect(container.querySelector(`label[for="${select.id}"]`)).not.toBeNull();
	});

	it('renders an option per locale and marks the current one selected', () => {
		const { container } = render(LanguageSwitcher);
		const options = [...container.querySelectorAll('option')] as HTMLOptionElement[];
		expect(options.map((o) => o.value)).toEqual(['en', 'de']);
		expect(options.find((o) => o.value === 'en')!.selected).toBe(true);
		expect(options.find((o) => o.value === 'de')!.selected).toBe(false);
	});

	it('stays on the current page when switching locale', async () => {
		const { getByRole } = render(LanguageSwitcher);
		await fireEvent.change(getByRole('combobox'), { target: { value: 'de' } });
		expect(resolveSpy).toHaveBeenCalledWith('/de/blog');
		expect(gotoSpy).toHaveBeenCalledWith('/de/blog');
	});

	it('does not navigate when the current locale is re-selected', async () => {
		const { getByRole } = render(LanguageSwitcher);
		await fireEvent.change(getByRole('combobox'), { target: { value: 'en' } });
		expect(gotoSpy).not.toHaveBeenCalled();
	});

	it('passes the "language.select" key to the translator for its label', () => {
		render(LanguageSwitcher);
		expect(tSpy).toHaveBeenCalledWith('language.select');
	});
});
