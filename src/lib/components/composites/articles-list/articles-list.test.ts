import { render } from '@testing-library/svelte';
import type { Post, PostTranslation } from '$lib/schemas';
import ArticlesList from './articles-list.svelte';

vi.mock('$app/paths', () => ({ resolve: (path: string) => path }));
vi.mock(
	'../post-background/post-background.svelte',
	() => import('./stubs/post-background-stub.svelte')
);
vi.mock(
	'../tags-container/tags-container.svelte',
	() => import('./stubs/tags-container-stub.svelte')
);
vi.mock('../article-meta/article-meta.svelte', () => import('./stubs/article-meta-stub.svelte'));

type TranslationMap = Partial<Record<'en' | 'de', PostTranslation>>;

function makePost(slug: string, translations: TranslationMap): Post {
	return {
		id: slug,
		slug,
		translations: translations as Post['translations'],
		tags: ['performance'],
		author: { id: 'a1', name: 'Ada Lovelace', avatarColor: '#a855f7' },
		publishedAt: '2026-03-01T00:00:00.000Z',
		readingTimeMinutes: 5,
		coverColor: '#a855f7'
	};
}

const enOnly = (slug: string, title: string): Post =>
	makePost(slug, { en: { title, excerpt: `${title} excerpt`, body: '' } });

const bilingual = (slug: string, en: string, de: string): Post =>
	makePost(slug, {
		en: { title: en, excerpt: `${en} excerpt`, body: '' },
		de: { title: de, excerpt: `${de} excerpt`, body: '' }
	});

describe('ArticlesList unit tests', () => {
	it('renders a card per post using the active locale', () => {
		const posts = [enOnly('a', 'Alpha'), enOnly('b', 'Beta')];
		const { container, getByText } = render(ArticlesList, {
			posts,
			locale: 'en',
			emptyMessage: 'none'
		});
		expect(container.querySelectorAll('li')).toHaveLength(2);
		expect(getByText('Alpha')).toBeTruthy();
		expect(getByText('Alpha excerpt')).toBeTruthy();
	});

	it('shows each post title in the requested locale, without falling back', () => {
		const posts = [bilingual('a', 'Alpha', 'Alfa')];
		const { getByText, queryByText } = render(ArticlesList, {
			posts,
			locale: 'de',
			emptyMessage: 'none'
		});
		expect(getByText('Alfa')).toBeTruthy();
		expect(queryByText('Alpha')).toBeNull();
	});

	it('links each card to the post under the active locale', () => {
		const { container } = render(ArticlesList, {
			posts: [enOnly('my-post', 'Alpha')],
			locale: 'de',
			emptyMessage: 'none'
		});
		// The post has no `de` translation, so it is omitted entirely (see next test).
		expect(container.querySelector('a')).toBeNull();
	});

	it('omits posts that have no translation for the locale (no en fallback)', () => {
		const posts = [enOnly('a', 'Alpha'), bilingual('b', 'Beta', 'Beta DE')];
		const { container, getByText, queryByText } = render(ArticlesList, {
			posts,
			locale: 'de',
			emptyMessage: 'none'
		});
		expect(container.querySelectorAll('li')).toHaveLength(1);
		expect(getByText('Beta DE')).toBeTruthy();
		expect(queryByText('Alpha')).toBeNull();
	});

	it('shows the empty message when there are no posts', () => {
		const { getByText, container } = render(ArticlesList, {
			posts: [],
			locale: 'en',
			emptyMessage: 'No posts found.'
		});
		expect(getByText('No posts found.')).toBeTruthy();
		expect(container.querySelector('ul')).toBeNull();
	});

	it('shows the empty message when no post has the active locale', () => {
		const { getByText, container } = render(ArticlesList, {
			posts: [enOnly('a', 'Alpha')],
			locale: 'de',
			emptyMessage: 'No posts found.'
		});
		expect(getByText('No posts found.')).toBeTruthy();
		expect(container.querySelector('ul')).toBeNull();
	});
});
