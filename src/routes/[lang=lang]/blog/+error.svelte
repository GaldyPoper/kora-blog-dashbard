<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { createTranslator } from '$lib/i18n';
	import { Button } from '$lib/components/primitives';

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));
</script>

<section class="kora-grid-container min-h-screen py-24">
	<div class="kora-container-inner flex flex-col items-center justify-center gap-5 text-center">
		<p class="paragraph-s text-muted">{page.status}</p>
		<h1>{t('error.title')}</h1>
		<p class="max-w-md text-muted">{t('error.blog.description')}</p>
		<Button asChild>
			{#snippet child({ props })}
				<a href={resolve(`/${locale}/blog`)} {...props}>{t('error.blog.action')}</a>
			{/snippet}
		</Button>
	</div>
</section>
