import { render } from '@testing-library/svelte';
import Header from './header.svelte';

const { tSpy } = vi.hoisted(() => ({ tSpy: vi.fn((key: string) => key) }));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));

vi.mock('../nav/nav.svelte', () => import('./stubs/nav-stub.svelte'));
vi.mock(
	'../language-switcher/language-switcher.svelte',
	() => import('./stubs/language-switcher-stub.svelte')
);
vi.mock(
	'../theme-switcher/theme-switcher.svelte',
	() => import('./stubs/theme-switcher-stub.svelte')
);

describe('Header unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('composes the Nav, LanguageSwitcher and ThemeSwitcher', () => {
		const { getByTestId } = render(Header);
		expect(getByTestId('nav')).toBeTruthy();
		expect(getByTestId('language-switcher')).toBeTruthy();
		expect(getByTestId('theme-switcher')).toBeTruthy();
	});

	it('renders a login link labelled via the translator', () => {
		const { getByRole } = render(Header);
		expect(getByRole('link')).toBeTruthy();
		expect(tSpy).toHaveBeenCalledWith('nav.login');
	});

	it('renders a <header> and forwards a custom class', () => {
		const { container } = render(Header, { class: 'custom-class' });
		const header = container.querySelector('header');
		expect(header).not.toBeNull();
		expect(header!.classList.contains('custom-class')).toBe(true);
	});
});
