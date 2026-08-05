import { render } from '@testing-library/svelte';
import Avatar from './avatar.svelte';

describe('Avatar unit tests', () => {
	it('renders the initials derived from the name', () => {
		const { getByText } = render(Avatar, { name: 'Omar Haddad' });
		expect(getByText('OH')).toBeTruthy();
	});

	it('exposes the full name as an accessible label', () => {
		const { getByLabelText } = render(Avatar, { name: 'Omar Haddad' });
		expect(getByLabelText('Omar Haddad')).toBeTruthy();
	});

	it('applies the provided color as the background', () => {
		const { getByText } = render(Avatar, { name: 'Anna Becker', color: '#f59e0b' });
		// jsdom normalizes the hex to its rgb() form.
		expect(getByText('AB').style.backgroundColor).toBe('rgb(245, 158, 11)');
	});

	it('falls back to the accent color when no color is given', () => {
		const { getByText } = render(Avatar, { name: 'Anna Becker' });
		const style = getByText('AB').getAttribute('style') ?? '';
		expect(style).toContain('background-color: var(--color-accent)');
		// The design system's on-accent token keeps the initials legible in both themes.
		expect(style).toContain('color: var(--color-accent-fg)');
	});

	it('derives a contrasting ink from the provided color', () => {
		// jsdom normalizes hex to rgb().
		const bright = render(Avatar, { name: 'Anna Becker', color: '#f59e0b' });
		expect(bright.getByText('AB').style.color).toBe('rgb(0, 0, 0)'); // black on bright amber

		const dark = render(Avatar, { name: 'Nadia Idris', color: '#1e1b4b' });
		expect(dark.getByText('NI').style.color).toBe('rgb(255, 255, 255)'); // white on dark indigo
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(Avatar, {
			name: 'Omar Haddad',
			class: 'custom-x',
			'data-testid': 'avatar'
		});
		const avatar = getByTestId('avatar');
		expect(avatar.classList.contains('custom-x')).toBe(true);
		expect(avatar.classList.contains('rounded-full')).toBe(true);
	});
});
