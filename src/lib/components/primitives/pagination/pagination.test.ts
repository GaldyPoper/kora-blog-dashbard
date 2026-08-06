import { render } from '@testing-library/svelte';
import Pagination from './pagination.svelte';

const { tSpy, pageMock } = vi.hoisted(() => ({
	tSpy: vi.fn((key: string) => key),
	pageMock: { data: { locale: 'en' }, url: new URL('http://localhost/en/blog') }
}));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: pageMock }));

describe('Pagination unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		pageMock.url = new URL('http://localhost/en/blog');
	});

	it('renders nothing when there is a single page', () => {
		const { container } = render(Pagination, { page: 1, totalPages: 1 });
		expect(container.querySelector('nav')).toBeNull();
	});

	it('disables Previous and links Next on the first page', () => {
		const { container } = render(Pagination, { page: 1, totalPages: 4 });
		expect(container.querySelector('a[href="?page=2"]')).not.toBeNull();
		expect(container.querySelector('a[href="?page=0"]')).toBeNull();
		expect(container.querySelector('span[aria-disabled="true"]')).not.toBeNull();
	});

	it('links both directions on a middle page', () => {
		const { container } = render(Pagination, { page: 2, totalPages: 4 });
		expect(container.querySelector('a[href="?page=1"]')).not.toBeNull();
		expect(container.querySelector('a[href="?page=3"]')).not.toBeNull();
		expect(container.querySelector('span[aria-disabled="true"]')).toBeNull();
	});

	it('disables Next on the last page', () => {
		const { container } = render(Pagination, { page: 4, totalPages: 4 });
		expect(container.querySelector('a[href="?page=3"]')).not.toBeNull();
		expect(container.querySelector('a[href="?page=5"]')).toBeNull();
		expect(container.querySelector('span[aria-disabled="true"]')).not.toBeNull();
	});

	it('preserves other query params (search filters) when paging', () => {
		pageMock.url = new URL('http://localhost/en/search?q=perf&tag=design&sort=newest');
		const { container } = render(Pagination, { page: 2, totalPages: 4 });
		const next = container.querySelector('a:last-of-type')!.getAttribute('href')!;
		const params = new URLSearchParams(next.slice(next.indexOf('?')));
		expect(params.get('page')).toBe('3');
		expect(params.get('q')).toBe('perf');
		expect(params.get('tag')).toBe('design');
		expect(params.get('sort')).toBe('newest');
	});

	it('renders the status through the translator', () => {
		render(Pagination, { page: 2, totalPages: 4 });
		expect(tSpy).toHaveBeenCalledWith('pagination.status', { page: 2, total: 4 });
	});
});
