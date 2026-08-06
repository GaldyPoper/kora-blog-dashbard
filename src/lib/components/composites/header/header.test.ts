import { render } from '@testing-library/svelte';
import Header from './header.svelte';

const { pageMock } = vi.hoisted(() => ({
	pageMock: { url: new URL('http://localhost/en') }
}));

vi.mock('$app/state', () => ({ page: pageMock }));
vi.mock('../nav/nav.svelte', () => import('./stubs/nav-stub.svelte'));
vi.mock('../search-bar/search-bar.svelte', () => import('./stubs/search-bar-stub.svelte'));
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
		pageMock.url = new URL('http://localhost/en');
	});

	it('composes the Nav, SearchBar, LanguageSwitcher and ThemeSwitcher', () => {
		const { getByTestId } = render(Header);
		expect(getByTestId('nav')).toBeTruthy();
		expect(getByTestId('search-bar')).toBeTruthy();
		expect(getByTestId('language-switcher')).toBeTruthy();
		expect(getByTestId('theme-switcher')).toBeTruthy();
	});

	it('hides the SearchBar on the search page to avoid two search inputs', () => {
		pageMock.url = new URL('http://localhost/en/search?q=perf');
		const { queryByTestId } = render(Header);
		expect(queryByTestId('search-bar')).toBeNull();
		expect(queryByTestId('nav')).not.toBeNull();
		expect(queryByTestId('language-switcher')).not.toBeNull();
	});

	it('renders a <header> and forwards a custom class', () => {
		const { container } = render(Header, { class: 'custom-class' });
		const header = container.querySelector('header');
		expect(header).not.toBeNull();
		expect(header!.classList.contains('custom-class')).toBe(true);
	});
});
