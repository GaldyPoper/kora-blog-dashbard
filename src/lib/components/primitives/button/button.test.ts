import { render } from '@testing-library/svelte';
import DefaultButton from './tests/default-button.svelte';
import AsChildButton from './tests/as-child-button.svelte';

describe('Button unit tests', () => {
	describe('default', () => {
		it('renders a <button> with its children', () => {
			const { container } = render(DefaultButton);
			const button = container.querySelector('button');
			expect(button).not.toBeNull();
			expect(button!.textContent?.trim()).toBe('Click me');
		});

		it('applies the shared + variant + size classes', () => {
			const { container } = render(DefaultButton);
			const cls = container.querySelector('button')!.className;
			expect(cls).toContain('rounded-lg'); // shared
			expect(cls).toContain('bg-accent'); // primary (default variant)
			expect(cls).toContain('text-base'); // medium (default size)
		});

		it('merges a custom class', () => {
			const { container } = render(DefaultButton, { class: 'custom-x' });
			expect(container.querySelector('button')!.classList.contains('custom-x')).toBe(true);
		});
	});

	describe('asChild', () => {
		it('renders the child element instead of a <button>', () => {
			const { container } = render(AsChildButton);
			expect(container.querySelector('button')).toBeNull();
			const anchor = container.querySelector('a');
			expect(anchor).not.toBeNull();
			expect(anchor!.getAttribute('href')).toBe('/link');
			expect(anchor!.textContent?.trim()).toBe('Link');
		});

		it('applies the button classes to the child element', () => {
			const { container } = render(AsChildButton, { class: 'custom-x' });
			const anchor = container.querySelector('a')!;
			expect(anchor.className).toContain('rounded-lg'); // shared
			expect(anchor.className).toContain('bg-accent'); // variant
			expect(anchor.classList.contains('custom-x')).toBe(true);
		});
	});
});
