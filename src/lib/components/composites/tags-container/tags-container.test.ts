import { render } from '@testing-library/svelte';
import TagsContainer from './tags-container.svelte';

describe('TagsContainer unit tests', () => {
	it('renders a badge for each tag', () => {
		const { getByText } = render(TagsContainer, { tags: ['performance', 'engineering'] });
		expect(getByText('performance')).toBeTruthy();
		expect(getByText('engineering')).toBeTruthy();
	});

	it('renders nothing when there are no tags', () => {
		const { container } = render(TagsContainer, { tags: [] });
		expect(container.querySelector('ul')).toBeNull();
	});

	it('merges a custom class and forwards attributes onto the list', () => {
		const { getByTestId } = render(TagsContainer, {
			tags: ['performance'],
			class: 'mt-4',
			'data-testid': 'tags'
		});
		const ul = getByTestId('tags');
		expect(ul.classList.contains('mt-4')).toBe(true);
		expect(ul.classList.contains('flex')).toBe(true); // base styling preserved
	});
});
