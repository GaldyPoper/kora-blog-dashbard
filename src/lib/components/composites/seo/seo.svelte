<script lang="ts">
	import { page } from '$app/state';
	import { locales, stripLocale, localizePath } from '$lib/i18n';
	import type { Locale } from '$lib/schemas';

	type OgType = 'website' | 'article';

	interface SeoProps {
		title: string;
		description: string;
		image?: string;
		imageAlt?: string;
		type?: OgType;
		siteName?: string;
	}

	let {
		title,
		description,
		image,
		imageAlt,
		type = 'website',
		siteName = 'Kora'
	}: SeoProps = $props();

	const OG_LOCALES: Record<Locale, string> = { en: 'en_US', de: 'de_DE' };

	const locale = $derived(page.data.locale as Locale);
	const origin = $derived(page.url.origin);
	const basePath = $derived(stripLocale(page.url.pathname));

	const url = $derived(`${origin}${localizePath(locale, basePath)}`);
	const absoluteImage = $derived(
		image ? (/^https?:\/\//.test(image) ? image : `${origin}${image}`) : undefined
	);

	const ogLocale = $derived(OG_LOCALES[locale]);
	const ogLocaleAlternates = $derived(
		locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l])
	);
	const twitterCard = $derived(absoluteImage ? 'summary_large_image' : 'summary');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:locale" content={ogLocale} />
	{#each ogLocaleAlternates as alternate (alternate)}
		<meta property="og:locale:alternate" content={alternate} />
	{/each}
	{#if absoluteImage}
		<meta property="og:image" content={absoluteImage} />
		{#if imageAlt}<meta property="og:image:alt" content={imageAlt} />{/if}
	{/if}

	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if absoluteImage}
		<meta name="twitter:image" content={absoluteImage} />
		{#if imageAlt}<meta name="twitter:image:alt" content={imageAlt} />{/if}
	{/if}
</svelte:head>
