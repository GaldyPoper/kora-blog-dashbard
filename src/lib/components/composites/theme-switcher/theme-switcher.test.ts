import { render } from '@testing-library/svelte';
import ThemeSwitcher from './theme-switcher.svelte';

const toogleThemeSpy = vi.fn();

vi.mock('./utils', () => ({
	toggleTheme: () => {
		toogleThemeSpy();
		return;
	}
}));

describe('ThemeSwitcher unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});
	it('renders an accessible toggle button', () => {
		const { getByRole } = render(ThemeSwitcher);
		const button = getByRole('button');
		expect(button.getAttribute('type')).toBe('button');
		expect(button.getAttribute('aria-label')).toBeTruthy();
	});

	it('renders both icons with theme-aware visibility classes', () => {
		const { container } = render(ThemeSwitcher);
		const [moon, sun] = container.querySelectorAll('svg');
		// Moon: visible in light, hidden in dark.
		expect(moon.classList.contains('block')).toBe(true);
		expect(moon.classList.contains('dark:hidden')).toBe(true);
		// Sun: hidden in light, visible in dark.
		expect(sun.classList.contains('hidden')).toBe(true);
		expect(sun.classList.contains('dark:block')).toBe(true);
	});

	it('toggleTheme is called when clicked', () => {
		const { getByRole } = render(ThemeSwitcher);
		getByRole('button').click();
		expect(toogleThemeSpy).toHaveBeenCalledTimes(1);
	});

	it('accepts custom class attributes', () => {
		const { getByTestId } = render(ThemeSwitcher, {
			'data-testid': 'test-button',
			class: 'custom-class'
		});
		const classes = getByTestId('test-button').classList;
		expect(classes.contains('custom-class')).toBe(true);
		expect(classes.contains('any-class')).toBe(false);
	});
});
