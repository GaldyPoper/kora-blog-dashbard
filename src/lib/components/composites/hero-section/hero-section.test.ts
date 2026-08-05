import { render } from '@testing-library/svelte';
import HeroSection from './hero-section.svelte';

const { tSpy, resolveSpy } = vi.hoisted(() => ({
	tSpy: vi.fn((key: string) => key),
	resolveSpy: vi.fn((path: string) => path)
}));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));
vi.mock('$app/paths', () => ({ resolve: resolveSpy }));
vi.mock('$lib/components/primitives', async () => ({
	Button: (await import('./stubs/button-stub.svelte')).default
}));
vi.mock('./svg/hero.svelte', () => import('./stubs/hero-svg-stub.svelte'));

describe('HeroSection unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders title, subtitle, localized CTA and graphic, forwarding attrs to the section', () => {
		const { container, getByTestId } = render(HeroSection, { 'data-testid': 'hero' });

		expect(tSpy).toHaveBeenCalledTimes(3);
		expect(tSpy).toHaveBeenCalledWith('home.hero.title');
		expect(tSpy).toHaveBeenCalledWith('home.hero.subtitle');
		expect(tSpy).toHaveBeenCalledWith('home.hero.cta');

		const cta = container.querySelector('a')!;
		expect(cta.getAttribute('href')).toBe('/en/blog');
		expect(resolveSpy).toHaveBeenCalledWith('/en/blog');

		expect(getByTestId('hero-svg')).toBeTruthy();

		const section = getByTestId('hero');
		expect(section.tagName).toBe('SECTION');
	});
});
