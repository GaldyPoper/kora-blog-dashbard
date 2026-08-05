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
		expect(getByText('AB').getAttribute('style')).toContain('var(--color-accent)');
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
