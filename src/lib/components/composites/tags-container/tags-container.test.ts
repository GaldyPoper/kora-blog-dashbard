import { render } from '@testing-library/svelte';
import TagsContainer from './tags-container.svelte';

vi.mock('$app/paths', () => ({ resolve: (path: string) => path }));

describe('TagsContainer unit tests', () => {
	it('renders each tag as a plain link into a tag search', () => {
		const { getByRole } = render(TagsContainer, {
			tags: ['performance', 'engineering'],
			locale: 'en'
		});
		expect(getByRole('link', { name: 'performance' }).getAttribute('href')).toBe(
			'/en/search?tag=performance'
		);
		expect(getByRole('link', { name: 'engineering' }).getAttribute('href')).toBe(
			'/en/search?tag=engineering'
		);
	});

	it('carries only the tag — no query/sort/page — so it is prerender-safe', () => {
		const { getByRole } = render(TagsContainer, { tags: ['design'], locale: 'en' });
		const href = getByRole('link', { name: 'design' }).getAttribute('href')!;
		const params = new URLSearchParams(href.slice(href.indexOf('?')));
		expect([...params.keys()]).toEqual(['tag']);
		expect(params.get('tag')).toBe('design');
	});

	it('targets the locale passed as a prop', () => {
		const { getByRole } = render(TagsContainer, { tags: ['design'], locale: 'de' });
		expect(getByRole('link', { name: 'design' }).getAttribute('href')).toBe(
			'/de/search?tag=design'
		);
	});

	it('renders nothing when there are no tags', () => {
		const { container } = render(TagsContainer, { tags: [], locale: 'en' });
		expect(container.querySelector('ul')).toBeNull();
	});

	it('merges a custom class and forwards attributes onto the list', () => {
		const { getByTestId } = render(TagsContainer, {
			tags: ['performance'],
			locale: 'en',
			class: 'mt-4',
			'data-testid': 'tags'
		});
		const ul = getByTestId('tags');
		expect(ul.classList.contains('mt-4')).toBe(true);
		expect(ul.classList.contains('flex')).toBe(true); // base styling preserved
	});
});
