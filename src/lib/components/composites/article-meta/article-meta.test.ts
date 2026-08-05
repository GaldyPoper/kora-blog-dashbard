import { render } from '@testing-library/svelte';
import ArticleMeta from './article-meta.svelte';
import type { PostAuthor } from '$lib/schemas';

const { tSpy } = vi.hoisted(() => ({ tSpy: vi.fn((key: string) => key) }));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));
vi.mock('$lib/components/primitives', async () => ({
	Avatar: (await import('./stubs/avatar-stub.svelte')).default,
	FormattedDate: (await import('./stubs/formatted-date-stub.svelte')).default
}));

const author: PostAuthor = { id: 'author_1', name: 'Omar Haddad', avatarColor: '#6d28d9' };
const props = { author, publishedAt: '2026-05-31T00:00:00Z', readingTimeMinutes: 3 };

describe('ArticleMeta unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the author name', () => {
		const { getByText } = render(ArticleMeta, props);
		expect(getByText('Omar Haddad')).toBeTruthy();
	});

	it('passes the author name and color to the Avatar', () => {
		const { getByTestId } = render(ArticleMeta, props);
		const avatar = getByTestId('avatar');
		expect(avatar.getAttribute('data-name')).toBe('Omar Haddad');
		expect(avatar.getAttribute('data-color')).toBe('#6d28d9');
	});

	it('passes the published date through to FormattedDate', () => {
		const { getByTestId } = render(ArticleMeta, props);
		expect(getByTestId('formatted-date').getAttribute('datetime')).toBe('2026-05-31T00:00:00Z');
	});

	it('passes the reading time key and minutes to the translator', () => {
		render(ArticleMeta, props);
		expect(tSpy).toHaveBeenCalledWith('blog.readingTime', { minutes: 3 });
	});

	it('merges a custom class and forwards attributes onto the root', () => {
		const { getByTestId } = render(ArticleMeta, {
			...props,
			class: 'mt-auto',
			'data-testid': 'meta'
		});
		const el = getByTestId('meta');
		expect(el.classList.contains('mt-auto')).toBe(true);
		expect(el.classList.contains('text-muted')).toBe(true); // base styling preserved
	});
});
