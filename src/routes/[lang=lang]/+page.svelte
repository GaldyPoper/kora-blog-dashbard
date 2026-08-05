<script lang="ts">
	import { page } from '$app/state';
	import { createTranslator } from '$lib/i18n';
	import { HeroSection, FeaturesSection, PricingSection, Seo } from '$lib/components/composites';

	const { t } = $derived(createTranslator(page.data.locale));
</script>

<Seo
	title={t('seo.home.title')}
	description={t('seo.home.description')}
	image="/og.png"
	imageAlt={t('seo.home.imageAlt')}
/>

<div class="kora-grid-container">
	<HeroSection class="kora-container-inner" />
	<FeaturesSection class="kora-container-full" />
	<PricingSection class="kora-container-inner" />
</div>
