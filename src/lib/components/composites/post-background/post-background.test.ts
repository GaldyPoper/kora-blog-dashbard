import { render } from '@testing-library/svelte';
import PostBackground from './post-background.svelte';

describe('PostBackground unit tests', () => {
	it('builds a gradient style from the given color', () => {
		const { getByTestId } = render(PostBackground, {
			color: '#6d28d9',
			'data-testid': 'bg'
		});
		// jsdom normalizes #6d28d9 -> rgb(109, 40, 217) and reformats color-mix.
		const style = getByTestId('bg').getAttribute('style') ?? '';
		expect(style).toContain('linear-gradient(135deg');
		expect(style).toContain('rgb(109, 40, 217)');
		expect(style).toContain('color-mix(in oklab');
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(PostBackground, {
			color: '#6d28d9',
			class: 'h-36',
			'data-testid': 'bg'
		});
		const el = getByTestId('bg');
		expect(el.classList.contains('h-36')).toBe(true);
		expect(el.classList.contains('w-full')).toBe(true); // base styling preserved
	});
});
