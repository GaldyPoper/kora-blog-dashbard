import type { Locale } from '$lib/schemas';

/**
 * Locale-aware value formatting for the items table, via `Intl` — not string
 * templates. Budgets/spend are whole-dollar USD; CTR is a 0–1 ratio shown as a
 * percentage.
 */

export function formatCurrency(amount: number, locale: Locale): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatPercent(ratio: number, locale: Locale): string {
	return new Intl.NumberFormat(locale, {
		style: 'percent',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(ratio);
}
