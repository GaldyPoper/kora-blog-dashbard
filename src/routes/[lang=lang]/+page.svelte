<script lang="ts">
	import { createTranslator } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { t } = $derived(createTranslator(data.locale));
</script>

<div class="mx-auto max-w-2xl space-y-8 p-6">
	<header class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Kora Blog Dashboard</h1>
	</header>

	<p class="text-foreground/70 text-sm">{t('home.hero.subtitle')}</p>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold">{t('blog.title')}</h2>
	</section>
</div>
