import { formatCurrency, formatPercent } from './format';

describe('formatCurrency', () => {
	it('formats whole-dollar USD for en', () => {
		expect(formatCurrency(15000, 'en')).toBe('$15,000');
		expect(formatCurrency(0, 'en')).toBe('$0');
	});

	it('is locale-aware (de groups differently)', () => {
		// de uses a dot as the thousands separator and a trailing symbol.
		const de = formatCurrency(15000, 'de');
		expect(de).toContain('15.000');
		expect(de).not.toBe(formatCurrency(15000, 'en'));
	});
});

describe('formatPercent', () => {
	it('renders a 0–1 ratio as a 2-decimal percent', () => {
		expect(formatPercent(0.0537, 'en')).toBe('5.37%');
		expect(formatPercent(0, 'en')).toBe('0.00%');
	});
});
