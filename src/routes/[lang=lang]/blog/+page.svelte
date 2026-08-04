<script>
	import { createTranslator } from '$lib/i18n';
	import { page } from '$app/state';
	const { t } = $derived(createTranslator(page.data.locale));
</script>

<h1>{t('blog.title')}</h1>
