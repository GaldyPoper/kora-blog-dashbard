import { formatDate } from './format-date';

describe('formatDate', () => {
	it('formats an ISO date as "day short-month year"', () => {
		expect(formatDate('2026-05-31T00:00:00Z', 'en')).toBe('31 May 2026');
	});

	it('uses a locale-aware month name', () => {
		expect(formatDate('2026-05-31T00:00:00Z', 'de')).toBe('31 Mai 2026');
	});

	it('does not slip to the previous day for midnight-UTC dates', () => {
		// Must stay the 1st regardless of the host timezone.
		expect(formatDate('2026-01-01T00:00:00Z', 'en')).toBe('1 Jan 2026');
	});

	it('formats a single-digit day without padding', () => {
		expect(formatDate('2026-12-09T00:00:00Z', 'en')).toBe('9 Dec 2026');
	});
});
