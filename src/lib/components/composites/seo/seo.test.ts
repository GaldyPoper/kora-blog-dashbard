import { render } from '@testing-library/svelte';
import Seo from './seo.svelte';

vi.mock('$app/state', () => ({
	page: {
		data: { locale: 'en' },
		url: new URL('https://kora.example/en/foo')
	}
}));

const head = () => document.head;
const meta = (selector: string) => head().querySelector(selector)?.getAttribute('content') ?? null;

describe('Seo unit tests', () => {
	beforeEach(() => {
		head()
			.querySelectorAll('title, meta')
			.forEach((node) => node.remove());
	});

	const base = { title: 'Hello world', description: 'A short description.' };

	it('sets the document title and meta description', () => {
		render(Seo, base);
		expect(document.title).toBe('Hello world');
		expect(meta('meta[name="description"]')).toBe('A short description.');
	});

	it('emits Open Graph title, description, type and site name', () => {
		render(Seo, base);
		expect(meta('meta[property="og:title"]')).toBe('Hello world');
		expect(meta('meta[property="og:description"]')).toBe('A short description.');
		expect(meta('meta[property="og:type"]')).toBe('website');
		expect(meta('meta[property="og:site_name"]')).toBe('Kora');
	});

	it('derives og:url and og:locale from the current page and locale', () => {
		render(Seo, base);
		expect(meta('meta[property="og:url"]')).toBe('https://kora.example/en/foo');
		expect(meta('meta[property="og:locale"]')).toBe('en_US');
	});

	it('lists the other locales as og:locale:alternate', () => {
		render(Seo, base);
		const alternates = [...head().querySelectorAll('meta[property="og:locale:alternate"]')].map(
			(node) => node.getAttribute('content')
		);
		expect(alternates).toEqual(['de_DE']);
	});

	it('falls back to a summary Twitter card when no image is provided', () => {
		render(Seo, base);
		expect(meta('meta[name="twitter:card"]')).toBe('summary');
		expect(head().querySelector('meta[property="og:image"]')).toBeNull();
	});

	it('resolves a root-relative image against the origin and upgrades the Twitter card', () => {
		render(Seo, { ...base, image: '/og.png', imageAlt: 'Preview' });
		expect(meta('meta[property="og:image"]')).toBe('https://kora.example/og.png');
		expect(meta('meta[property="og:image:alt"]')).toBe('Preview');
		expect(meta('meta[name="twitter:card"]')).toBe('summary_large_image');
		expect(meta('meta[name="twitter:image"]')).toBe('https://kora.example/og.png');
	});

	it('keeps an absolute image URL unchanged', () => {
		render(Seo, { ...base, image: 'https://cdn.example/hero.jpg' });
		expect(meta('meta[property="og:image"]')).toBe('https://cdn.example/hero.jpg');
	});
});
