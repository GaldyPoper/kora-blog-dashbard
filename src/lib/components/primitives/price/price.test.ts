import { render } from '@testing-library/svelte';
import Price from './price.svelte';

const { tSpy } = vi.hoisted(() => ({ tSpy: vi.fn((key: string) => key) }));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));

describe('Price unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the amount', () => {
		const { getByText } = render(Price, { amount: 10 });
		expect(getByText('10')).toBeTruthy();
	});

	it('renders the localized currency symbol from the translation key', () => {
		render(Price, { amount: 10 });
		expect(tSpy).toHaveBeenCalledWith('currency');
	});

	it('renders the period when provided', () => {
		const { getByText } = render(Price, { amount: 10, period: '/mo' });
		expect(getByText('/mo')).toBeTruthy();
	});

	it('omits the period when not provided', () => {
		const { container } = render(Price, { amount: 0 });
		expect(container.querySelectorAll('span')).toHaveLength(2);
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(Price, {
			amount: 10,
			class: 'custom-x',
			'data-testid': 'price'
		});
		const price = getByTestId('price');
		expect(price.classList.contains('custom-x')).toBe(true);
		expect(price.classList.contains('flex')).toBe(true); // base styling preserved
	});
});
