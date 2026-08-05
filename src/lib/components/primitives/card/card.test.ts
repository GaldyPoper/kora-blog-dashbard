import { render } from '@testing-library/svelte';
import Card from './card.svelte';

describe('Card unit tests', () => {
	it('renders the title as a heading', () => {
		const { getByRole } = render(Card, { title: 'Fast by default' });
		expect(getByRole('heading', { name: 'Fast by default' })).toBeTruthy();
	});

	it('renders the description when provided', () => {
		const { getByText } = render(Card, { title: 'Fast', description: 'Server-rendered pages.' });
		expect(getByText('Server-rendered pages.')).toBeTruthy();
	});

	it('omits the description paragraph when not provided', () => {
		const { container } = render(Card, { title: 'Fast' });
		expect(container.querySelector('p')).toBeNull();
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(Card, {
			title: 'Fast',
			class: 'custom-x',
			'data-testid': 'card'
		});
		const card = getByTestId('card');
		expect(card.classList.contains('custom-x')).toBe(true);
		expect(card.classList.contains('rounded-lg')).toBe(true); // base styling preserved
	});
});
