import { render } from '@testing-library/svelte';
import PricingSection from './pricing-section.svelte';

const { tSpy, resolveSpy } = vi.hoisted(() => ({
	tSpy: vi.fn((key: string) => key),
	resolveSpy: vi.fn((path: string) => path)
}));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));
vi.mock('$app/paths', () => ({ resolve: resolveSpy }));
vi.mock('$lib/components/primitives', async () => ({
	Button: (await import('./stubs/button-stub.svelte')).default,
	Label: (await import('./stubs/label-stub.svelte')).default,
	Price: (await import('./stubs/price-stub.svelte')).default
}));

describe('PricingSection unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the localized heading and subtitle, forwarding attrs to the section', () => {
		const { getByTestId } = render(PricingSection, { 'data-testid': 'pricing' });
		expect(tSpy).toHaveBeenCalledWith('home.pricing.title');
		expect(tSpy).toHaveBeenCalledWith('home.pricing.subtitle');
		const section = getByTestId('pricing');
		expect(section.tagName).toBe('SECTION');
	});

	it('renders exactly three tiers with their names', () => {
		const { container } = render(PricingSection);
		const cards = container.querySelector('ul')!.querySelectorAll(':scope > li');
		expect(cards).toHaveLength(3);
		expect(tSpy).toHaveBeenCalledWith('pricing.free.name');
		expect(tSpy).toHaveBeenCalledWith('pricing.pro.name');
		expect(tSpy).toHaveBeenCalledWith('pricing.business.name');
	});

	it('shows the "best value" badge only on the featured (Pro) tier', () => {
		const { getAllByTestId } = render(PricingSection);
		const badges = getAllByTestId('pricing-badge');
		expect(badges).toHaveLength(1);
		expect(badges[0].textContent?.trim()).toBe('pricing.badge.popular');
	});

	it('renders a price for every tier with the localized period', () => {
		const { getAllByTestId } = render(PricingSection);
		const prices = getAllByTestId('pricing-price');
		expect(prices.map((p) => p.textContent)).toEqual([
			'0pricing.period',
			'10pricing.period',
			'25pricing.period'
		]);
	});

	it('points every CTA at the localized blog route', () => {
		const { container } = render(PricingSection);
		const links = container.querySelectorAll('a');
		expect(links).toHaveLength(3);
		links.forEach((link) => expect(link.getAttribute('href')).toBe('/en/buy'));
		expect(resolveSpy).toHaveBeenCalledWith('/en/buy');
	});
});
