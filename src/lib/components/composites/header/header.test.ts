import { render } from '@testing-library/svelte';
import Header from './header.svelte';

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
	it('composes the Nav, LanguageSwitcher and ThemeSwitcher', () => {
		const { getByTestId } = render(Header);
		expect(getByTestId('nav')).toBeTruthy();
		expect(getByTestId('language-switcher')).toBeTruthy();
		expect(getByTestId('theme-switcher')).toBeTruthy();
	});

	it('renders a <header> and forwards a custom class', () => {
		const { container } = render(Header, { class: 'custom-class' });
		const header = container.querySelector('header');
		expect(header).not.toBeNull();
		expect(header!.classList.contains('custom-class')).toBe(true);
	});
});
