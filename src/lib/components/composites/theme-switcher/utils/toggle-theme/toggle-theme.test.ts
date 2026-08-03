import { toggleTheme } from './toggle-theme';

const dataTheme = () => document.documentElement.getAttribute('data-theme');
const setTheme = (theme: string) => document.documentElement.setAttribute('data-theme', theme);

beforeEach(() => {
	localStorage.clear();
	document.documentElement.removeAttribute('data-theme');
});

describe('toggleTheme unit tests', () => {
	it('switches from light to dark', () => {
		setTheme('light');
		toggleTheme();
		expect(dataTheme()).toBe('dark');
		expect(localStorage.getItem('theme')).toBe('dark');
	});

	it('switches from dark to light', () => {
		setTheme('dark');
		toggleTheme();
		expect(dataTheme()).toBe('light');
		expect(localStorage.getItem('theme')).toBe('light');
	});

	it('defaults to light when no theme is set', () => {
		toggleTheme();
		expect(dataTheme()).toBe('light');
		expect(localStorage.getItem('theme')).toBe('light');
	});

	it('toggles back and forth on repeated calls', () => {
		setTheme('light');
		toggleTheme();
		expect(dataTheme()).toBe('dark');
		toggleTheme();
		expect(dataTheme()).toBe('light');
		toggleTheme();
		expect(dataTheme()).toBe('dark');
	});

	it('keeps the data-theme attribute and localStorage in sync', () => {
		setTheme('dark');
		toggleTheme();
		expect(dataTheme()).toBe(localStorage.getItem('theme'));
	});
});
