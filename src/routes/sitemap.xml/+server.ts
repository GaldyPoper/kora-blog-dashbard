import { locales, defaultLocale, localizePath } from '$lib/i18n';
import { getPosts } from '$lib/server/data';
import type { RequestHandler } from './$types';

function sitemapPaths(): string[] {
	const postPaths = getPosts().map((post) => `/blog/${post.slug}`);
	return ['', '/blog', ...postPaths];
}

function alternateLinks(origin: string, path: string): string[] {
	const links = locales.map(
		(locale) =>
			`      <xhtml:link rel="alternate" hreflang="${locale}" href="${origin}${localizePath(locale, path)}" />`
	);
	links.push(
		`      <xhtml:link rel="alternate" hreflang="x-default" href="${origin}${localizePath(defaultLocale, path)}" />`
	);
	return links;
}

export const GET: RequestHandler = ({ url }) => {
	const { origin } = url;

	const lines = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
	];

	for (const path of sitemapPaths()) {
		for (const locale of locales) {
			lines.push(
				'  <url>',
				`    <loc>${origin}${localizePath(locale, path)}</loc>`,
				...alternateLinks(origin, path),
				'  </url>'
			);
		}
	}

	lines.push('</urlset>', '');

	return new Response(lines.join('\n'), {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
