import { render } from '@testing-library/svelte';
import FeaturesSection from './features-section.svelte';

const { tSpy } = vi.hoisted(() => ({
	tSpy: vi.fn((key: string) => key)
}));

vi.mock('$lib/i18n', () => ({ createTranslator: () => ({ t: tSpy }) }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));
vi.mock('$lib/components/primitives', async () => ({
	Card: (await import('./stubs/card-stub.svelte')).default
}));

describe('FeaturesSection unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the localized heading and forwards attributes to the section', () => {
		const { getByTestId } = render(FeaturesSection, { 'data-testid': 'features' });
		expect(tSpy).toHaveBeenCalledWith('home.features.title');
		const section = getByTestId('features');
		expect(section.tagName).toBe('SECTION');
	});

	it('renders one card per feature', () => {
		const { getAllByTestId } = render(FeaturesSection);
		expect(getAllByTestId('feature-card')).toHaveLength(6);
	});

	it('passes each feature title and description key to a Card', () => {
		const { getAllByTestId } = render(FeaturesSection);

		const titles = getAllByTestId('feature-title').map((el) => el.textContent);
		const descriptions = getAllByTestId('feature-desc').map((el) => el.textContent);

		expect(titles).toEqual([
			'features.i18n.title',
			'features.seo.title',
			'features.validation.title',
			'features.theming.title',
			'features.performance.title',
			'features.a11y.title'
		]);
		expect(descriptions).toEqual([
			'features.i18n.desc',
			'features.seo.desc',
			'features.validation.desc',
			'features.theming.desc',
			'features.performance.desc',
			'features.a11y.desc'
		]);
	});

	it('merges a custom class onto the section', () => {
		const { getByTestId } = render(FeaturesSection, {
			class: 'custom-x',
			'data-testid': 'features'
		});
		const section = getByTestId('features');
		expect(section.classList.contains('custom-x')).toBe(true);
		expect(section.classList.contains('kora-grid-container')).toBe(true); // base styling preserved
	});
});
