<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { createTranslator } from '$lib/i18n';
	import { Button } from '$lib/components/primitives';
	import { Seo } from '$lib/components/composites';

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));
</script>

<Seo title={t('seo.dashboard.title')} description={t('seo.dashboard.description')} noindex />

<section class="kora-grid-container py-10">
	<div class="kora-container-inner flex items-center justify-between gap-4">
		<h1 class="heading-2">{t('dashboard.title')}</h1>
		<form method="POST" action={resolve(`/${locale}/logout`)}>
			<Button type="submit" variant="outline">{t('nav.logout')}</Button>
		</form>
	</div>
</section>
