import { render } from '@testing-library/svelte';
import DefaultBadge from './tests/default-badge.svelte';

describe('Badge unit tests', () => {
	it('renders its children inside a span', () => {
		const { container } = render(DefaultBadge);
		const badge = container.querySelector('span');
		expect(badge).not.toBeNull();
		expect(badge!.textContent?.trim()).toBe('Best value');
	});

	it('applies the primary variant styling by default', () => {
		const { container } = render(DefaultBadge);
		const cls = container.querySelector('span')!.className;
		expect(cls).toContain('rounded-full');
		expect(cls).toContain('bg-accent');
	});

	it('applies the ghost variant styling', () => {
		const { getByTestId } = render(DefaultBadge, { variant: 'ghost', 'data-testid': 'badge' });
		const cls = getByTestId('badge').className;
		expect(cls).toContain('border-border');
		expect(cls).not.toContain('bg-accent');
	});

	it('applies the requested size', () => {
		const { getByTestId } = render(DefaultBadge, { size: 'large', 'data-testid': 'badge' });
		expect(getByTestId('badge').className).toContain('px-4');
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(DefaultBadge, { class: 'custom-x', 'data-testid': 'badge' });
		const badge = getByTestId('badge');
		expect(badge.classList.contains('custom-x')).toBe(true);
		expect(badge.classList.contains('rounded-full')).toBe(true); // base styling preserved
	});
});
