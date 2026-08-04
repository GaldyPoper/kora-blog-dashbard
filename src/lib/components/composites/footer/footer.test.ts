import { render } from '@testing-library/svelte';
import Footer from './footer.svelte';

const { tSpy, createTranslatorSpy } = vi.hoisted(() => {
	const tSpy = vi.fn();
	return { tSpy, createTranslatorSpy: vi.fn(() => ({ t: tSpy })) };
});

vi.mock('$lib/i18n', () => ({ createTranslator: createTranslatorSpy }));
vi.mock('$app/state', () => ({ page: { data: { locale: 'en' } } }));

describe('Footer unit tests', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('renders the footer with the expected class attribute', () => {
		const { getByTestId } = render(Footer, { 'data-testid': 'footer' });
		const footer = getByTestId('footer');
		expect(footer).not.toBeNull();
		expect(footer!.hasAttribute('class')).toBe(true);
		expect(footer!.getAttribute('class')).toBe('kora-grid-container bg-bg-soft py-4');
	});

	it('renders the inner section with the expected class attribute', () => {
		const { getByTestId } = render(Footer, { 'data-testid': 'footer' });
		const section = getByTestId('footer').querySelector('section');
		expect(section).not.toBeNull();
		expect(section!.hasAttribute('class')).toBe(true);
		expect(section!.getAttribute('class')).toBe('kora-container-inner flex justify-center');
	});

	it('accepts optional custom class attribute', () => {
		const { getByTestId } = render(Footer, { 'data-testid': 'footer', class: 'custom-class' });
		expect(getByTestId('footer').classList.contains('custom-class')).toBe(true);
		expect(getByTestId('footer').classList.contains('random-class')).toBe(false);
	});

	it('passes the "footer.copy" key to the translator', () => {
		render(Footer);
		expect(tSpy).toHaveBeenCalledWith('footer.copy');
	});
});
