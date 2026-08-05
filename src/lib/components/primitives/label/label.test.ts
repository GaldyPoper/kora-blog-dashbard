import { render } from '@testing-library/svelte';
import DefaultLabel from './tests/default-label.svelte';

describe('Label unit tests', () => {
	it('renders its children inside a span', () => {
		const { container } = render(DefaultLabel);
		const label = container.querySelector('span');
		expect(label).not.toBeNull();
		expect(label!.textContent?.trim()).toBe('Best value');
	});

	it('applies the base badge styling', () => {
		const { container } = render(DefaultLabel);
		const cls = container.querySelector('span')!.className;
		expect(cls).toContain('rounded-full');
		expect(cls).toContain('bg-accent');
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(DefaultLabel, { class: 'custom-x', 'data-testid': 'label' });
		const label = getByTestId('label');
		expect(label.classList.contains('custom-x')).toBe(true);
		expect(label.classList.contains('rounded-full')).toBe(true); // base styling preserved
	});
});
