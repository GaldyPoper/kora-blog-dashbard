import { render, fireEvent } from '@testing-library/svelte';
import SearchBar from './search-bar.svelte';

const { tSpy, gotoSpy, resolveSpy, pageMock } = vi.hoisted(() => ({
	tSpy: vi.fn((key: string) => key),
	gotoSpy: vi.fn(),
	resolveSpy: vi.fn((path: string) => path),
	pageMock: { data: { locale: 'en' }, url: new URL('http://localhost/en/blog') }
}));

// SearchBar navigates client-side, keeping focus in the box and not scrolling.
const navOpts = { keepFocus: true, noScroll: true };

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/navigation', () => ({ goto: gotoSpy }));
vi.mock('$app/paths', () => ({ resolve: resolveSpy }));
vi.mock('$app/state', () => ({ page: pageMock }));
vi.mock('$app/environment', () => ({ building: false }));

describe('SearchBar unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		pageMock.data.locale = 'en';
		pageMock.url = new URL('http://localhost/en/blog');
	});

	it('renders a search form with an input and a submit button', () => {
		const { getByRole } = render(SearchBar);
		expect(getByRole('search')).toBeTruthy();
		expect(getByRole('searchbox')).toBeTruthy();
		expect(getByRole('button')).toHaveProperty('type', 'submit');
	});

	it('navigates to the search route with the query on submit', async () => {
		const { getByRole } = render(SearchBar);
		await fireEvent.input(getByRole('searchbox'), { target: { value: 'perf' } });
		await fireEvent.submit(getByRole('search'));
		expect(resolveSpy).toHaveBeenCalledWith('/en/search');
		expect(gotoSpy).toHaveBeenCalledWith('/en/search?q=perf', navOpts);
	});

	it('trims the query and drops it when empty', async () => {
		const { getByRole } = render(SearchBar);
		await fireEvent.input(getByRole('searchbox'), { target: { value: '   ' } });
		await fireEvent.submit(getByRole('search'));
		expect(gotoSpy).toHaveBeenCalledWith('/en/search', navOpts);
	});

	it('prefills the input from the current URL query', () => {
		pageMock.url = new URL('http://localhost/en/search?q=hello');
		const { getByRole } = render(SearchBar);
		expect((getByRole('searchbox') as HTMLInputElement).value).toBe('hello');
	});

	it('keeps the active tag and sort when submitting a new query', async () => {
		pageMock.url = new URL('http://localhost/en/search?tag=design&sort=oldest&page=3');
		const { getByRole } = render(SearchBar);
		await fireEvent.input(getByRole('searchbox'), { target: { value: 'grid' } });
		await fireEvent.submit(getByRole('search'));
		const [href] = gotoSpy.mock.calls.at(-1)!;
		const params = new URLSearchParams(String(href).slice(String(href).indexOf('?')));
		expect(params.get('q')).toBe('grid');
		expect(params.get('tag')).toBe('design');
		expect(params.get('sort')).toBe('oldest');
		expect(params.get('page')).toBeNull(); // reset to page 1
	});

	it('clears ?q (keeping the tag) when the native clear button empties the field', async () => {
		pageMock.url = new URL('http://localhost/en/search?q=grid&tag=design');
		const { getByRole } = render(SearchBar);
		const input = getByRole('searchbox');
		await fireEvent.input(input, { target: { value: '' } });
		await fireEvent(input, new Event('search'));
		expect(gotoSpy).toHaveBeenCalledWith('/en/search?tag=design', navOpts);
	});

	it('does not navigate on clear when there is no active query', async () => {
		pageMock.url = new URL('http://localhost/en/search?tag=design');
		const { getByRole } = render(SearchBar);
		const input = getByRole('searchbox');
		await fireEvent.input(input, { target: { value: '' } });
		await fireEvent(input, new Event('search'));
		expect(gotoSpy).not.toHaveBeenCalled();
	});

	it('keeps the active tag when the query is cleared', async () => {
		pageMock.url = new URL('http://localhost/en/search?q=grid&tag=design');
		const { getByRole } = render(SearchBar);
		await fireEvent.input(getByRole('searchbox'), { target: { value: '' } });
		await fireEvent.submit(getByRole('search'));
		expect(gotoSpy).toHaveBeenCalledWith('/en/search?tag=design', navOpts);
	});

	it('renders a full-width input for the "full" variant', () => {
		const { getByRole } = render(SearchBar, { variant: 'full' });
		expect((getByRole('searchbox') as HTMLInputElement).classList.contains('w-full')).toBe(true);
	});

	it('targets the active locale', async () => {
		pageMock.data.locale = 'de';
		const { getByRole } = render(SearchBar);
		await fireEvent.input(getByRole('searchbox'), { target: { value: 'x' } });
		await fireEvent.submit(getByRole('search'));
		expect(gotoSpy).toHaveBeenCalledWith('/de/search?q=x', navOpts);
	});
});
