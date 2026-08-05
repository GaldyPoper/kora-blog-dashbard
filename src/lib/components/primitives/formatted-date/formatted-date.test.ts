import { render } from '@testing-library/svelte';
import FormattedDate from './formatted-date.svelte';

vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));

describe('FormattedDate unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the formatted date for the current locale', () => {
		const { getByText } = render(FormattedDate, { date: '2026-05-31T00:00:00Z' });
		expect(getByText('31 May 2026')).toBeTruthy();
	});

	it('renders a <time> element carrying the machine-readable datetime', () => {
		const { container } = render(FormattedDate, { date: '2026-05-31T00:00:00Z' });
		const time = container.querySelector('time');
		expect(time).not.toBeNull();
		expect(time?.getAttribute('datetime')).toBe('2026-05-31T00:00:00Z');
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(FormattedDate, {
			date: '2026-05-31T00:00:00Z',
			class: 'custom-x',
			'data-testid': 'formatted-date'
		});
		const el = getByTestId('formatted-date');
		expect(el.classList.contains('custom-x')).toBe(true);
	});
});
