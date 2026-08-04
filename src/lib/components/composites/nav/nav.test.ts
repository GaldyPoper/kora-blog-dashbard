import { render } from '@testing-library/svelte';
import Nav from './nav.svelte';

const { pageMock, tSpy, resolveSpy } = vi.hoisted(() => ({
	pageMock: { data: { locale: 'en' }, url: { pathname: '/en' } },
	tSpy: vi.fn((key: string) => key),
	resolveSpy: vi.fn((path: string) => path)
}));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: pageMock }));
vi.mock('$app/paths', () => ({ resolve: resolveSpy }));

function activeLinks(container: HTMLElement): HTMLAnchorElement[] {
	return [...container.querySelectorAll('nav a')].filter(
		(a) => a.getAttribute('aria-current') === 'page'
	) as HTMLAnchorElement[];
}

describe('Nav unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		pageMock.data.locale = 'en';
		pageMock.url.pathname = '/en';
	});

	it('renders a <nav> with a locale-prefixed link per item', () => {
		const { container } = render(Nav);
		const hrefs = [...container.querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
		expect(hrefs).toEqual(['/en', '/en/blog', '/en/dashboard']);
	});

	it('labels each link via its translator key', () => {
		render(Nav);
		expect(tSpy).toHaveBeenCalledTimes(3);
		expect(tSpy).toHaveBeenCalledWith('nav.home');
		expect(tSpy).toHaveBeenCalledWith('nav.blog');
		expect(tSpy).toHaveBeenCalledWith('nav.dashboard');
	});

	it('marks only Home active on the locale root', () => {
		pageMock.url.pathname = '/en';
		const { container } = render(Nav);
		const active = activeLinks(container);
		expect(active).toHaveLength(1);
		expect(active[0].getAttribute('href')).toBe('/en');
	});

	it('marks only Blog active on a nested blog route (Home is not caught)', () => {
		pageMock.url.pathname = '/en/blog/some-post';
		const { container } = render(Nav);
		const active = activeLinks(container);
		expect(active).toHaveLength(1);
		expect(active[0].getAttribute('href')).toBe('/en/blog');
	});

	it('applies the accent class only to the active link', () => {
		pageMock.url.pathname = '/en/blog';
		const { container } = render(Nav);
		const [home, blog] = ['/en', '/en/blog'].map((href) =>
			container.querySelector(`nav a[href="${href}"]`)!
		);
		expect(blog.classList.contains('text-accent-ink')).toBe(true);
		expect(home.classList.contains('text-accent-ink')).toBe(false);
	});

	it('prefixes links with the active locale', () => {
		pageMock.data.locale = 'de';
		pageMock.url.pathname = '/de';
		const { container } = render(Nav);
		const hrefs = [...container.querySelectorAll('nav a')].map((a) => a.getAttribute('href'));
		expect(hrefs).toEqual(['/de', '/de/blog', '/de/dashboard']);
	});
});
