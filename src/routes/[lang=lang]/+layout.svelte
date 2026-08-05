<script lang="ts">
	import { page } from '$app/state';
	import { locales, defaultLocale, stripLocale, localizePath } from '$lib/i18n';
	import type { LayoutData } from './$types';
	import { Footer, Header } from '$lib/components/composites';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	const basePath = $derived(stripLocale(page.url.pathname));
	const origin = $derived(page.url.origin);

	const canonical = $derived(`${origin}${localizePath(data.locale, basePath)}`);
	const alternates = $derived(
		locales.map((locale) => ({
			locale,
			href: `${origin}${localizePath(locale, basePath)}`
		}))
	);

	$effect(() => {
		document.documentElement.lang = data.locale;
	});
</script>

<svelte:head>
	<link rel="canonical" href={canonical} />
	{#each alternates as { locale, href } (locale)}
		<link rel="alternate" hreflang={locale} {href} />
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href={`${origin}${localizePath(defaultLocale, basePath)}`}
	/>
</svelte:head>

<Header />
<main>
	{@render children()}
</main>
<Footer />
