<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { createTranslator, defaultLocale } from '$lib/i18n';
	import { localeShema } from '$lib/schemas';
	import { Button } from '$lib/components/primitives';

	// Unmatched routes have no `[lang]` layout, so there's no locale in page data —
	// derive it from the first path segment, falling back to the default.
	const locale = $derived(
		localeShema.catch(defaultLocale).parse(page.url.pathname.split('/')[1] ?? '')
	);
	const { t } = $derived(createTranslator(locale));
</script>

<section class="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
	<p class="paragraph-s text-muted">{page.status}</p>
	<h1>{t('error.title')}</h1>
	<p class="max-w-md text-muted">{t('error.description')}</p>
	<Button asChild>
		{#snippet child({ props })}
			<a href={resolve(`/${locale}`)} {...props}>{t('error.home')}</a>
		{/snippet}
	</Button>
</section>
