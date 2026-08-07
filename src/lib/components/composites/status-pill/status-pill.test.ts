import { render } from '@testing-library/svelte';
import StatusPill from './status-pill.svelte';
import type { ItemStatus } from '$lib/schemas';

describe('StatusPill', () => {
	it('renders the label', () => {
		const { getByText } = render(StatusPill, { props: { status: 'active', label: 'Active' } });
		expect(getByText('Active')).toBeTruthy();
	});

	it('maps each status to its semantic token classes', () => {
		const cases: [ItemStatus, string][] = [
			['active', 'bg-good-bg'],
			['completed', 'bg-accent-soft'],
			['scheduled', 'bg-warn-bg'],
			['paused', 'text-error'],
			['draft', 'text-muted'],
			['archived', 'text-muted']
		];
		for (const [status, token] of cases) {
			const { container } = render(StatusPill, { props: { status, label: status } });
			expect(container.querySelector('span')?.className).toContain(token);
		}
	});

	it('merges a custom class onto the root without dropping the base styles', () => {
		const { container } = render(StatusPill, {
			props: { status: 'active', label: 'Active', class: 'ml-4' }
		});
		const root = container.querySelector('span');
		expect(root?.className).toContain('ml-4');
		expect(root?.className).toContain('rounded-full');
	});

	it('spreads extra HTML attributes onto the root element', () => {
		const { container } = render(StatusPill, {
			props: { status: 'active', label: 'Active', id: 'pill-1', title: 'Campaign is active' }
		});
		const root = container.querySelector('span');
		expect(root?.getAttribute('id')).toBe('pill-1');
		expect(root?.getAttribute('title')).toBe('Campaign is active');
	});

	it('renders a decorative dot hidden from assistive tech', () => {
		const { container } = render(StatusPill, { props: { status: 'active', label: 'Active' } });
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
	});
});
