<script lang="ts">
	import ThemeSwitcher from '$lib/components/composites/theme-switcher/theme-switcher.svelte';
	import { resolve } from '$app/paths';
	import { createTranslator } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { t } = $derived(createTranslator(data.locale));
</script>

<div class="mx-auto max-w-2xl space-y-8 p-6">
	<header class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Kora Blog Dashboard</h1>
		<div class="flex items-center gap-3">
			<nav class="flex items-center gap-1 text-sm" aria-label="Language">
				<a
					href={resolve('/[lang=lang]', { lang: 'en' })}
					class="rounded px-2 py-1 hover:bg-foreground/10"
					class:font-semibold={data.locale === 'en'}
					aria-current={data.locale === 'en' ? 'page' : undefined}>EN</a
				>
				<a
					href={resolve('/[lang=lang]', { lang: 'de' })}
					class="rounded px-2 py-1 hover:bg-foreground/10"
					class:font-semibold={data.locale === 'de'}
					aria-current={data.locale === 'de' ? 'page' : undefined}>DE</a
				>
			</nav>
			<ThemeSwitcher />
		</div>
	</header>

	<p class="text-sm text-foreground/70">{t('home.hero.subtitle')}</p>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold">{t('blog.title')}</h2>
	</section>
</div>
