import { render } from '@testing-library/svelte';
import Pagination from './pagination.svelte';

const { tSpy } = vi.hoisted(() => ({ tSpy: vi.fn((key: string) => key) }));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));

describe('Pagination unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
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

	it('renders the status through the translator', () => {
		render(Pagination, { page: 2, totalPages: 4 });
		expect(tSpy).toHaveBeenCalledWith('pagination.status', { page: 2, total: 4 });
	});
});
