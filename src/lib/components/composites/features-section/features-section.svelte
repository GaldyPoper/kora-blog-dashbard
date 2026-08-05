<script lang="ts">
	import { createTranslator, type TranslationKey } from '$lib/i18n';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { Card } from '$lib/components/primitives';

	type FeaturesSectionProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: FeaturesSectionProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));

	const features: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
		{ titleKey: 'features.i18n.title', descKey: 'features.i18n.desc' },
		{ titleKey: 'features.seo.title', descKey: 'features.seo.desc' },
		{ titleKey: 'features.validation.title', descKey: 'features.validation.desc' },
		{ titleKey: 'features.theming.title', descKey: 'features.theming.desc' },
		{ titleKey: 'features.performance.title', descKey: 'features.performance.desc' },
		{ titleKey: 'features.a11y.title', descKey: 'features.a11y.desc' }
	];
</script>

<section class={twMerge('kora-grid-container bg-bg-soft py-20', className)} {...props}>
	<div class="kora-container-inner flex flex-col items-center gap-8">
		<h2>{t('home.features.title')}</h2>
		<ul class="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
			{#each features as { titleKey, descKey } (titleKey)}
				<li>
					<Card title={t(titleKey)} description={t(descKey)} class="h-full" />
				</li>
			{/each}
		</ul>
	</div>
</section>
