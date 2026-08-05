<script lang="ts">
	import { createTranslator, type TranslationKey } from '$lib/i18n';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { Button, Label, Price } from '$lib/components/primitives';

	type PricingSectionProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: PricingSectionProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));

	type Tier = {
		id: string;
		nameKey: TranslationKey;
		taglineKey: TranslationKey;
		amount: number;
		ctaKey: TranslationKey;
		featureKeys: TranslationKey[];
		featured?: boolean;
	};

	const tiers: Tier[] = [
		{
			id: 'free',
			nameKey: 'pricing.free.name',
			taglineKey: 'pricing.free.tagline',
			amount: 0,
			ctaKey: 'pricing.free.cta',
			featureKeys: [
				'pricing.free.feature.1',
				'pricing.free.feature.2',
				'pricing.free.feature.3',
				'pricing.free.feature.4'
			]
		},
		{
			id: 'pro',
			nameKey: 'pricing.pro.name',
			taglineKey: 'pricing.pro.tagline',
			amount: 10,
			ctaKey: 'pricing.pro.cta',
			featured: true,
			featureKeys: [
				'pricing.pro.feature.1',
				'pricing.pro.feature.2',
				'pricing.pro.feature.3',
				'pricing.pro.feature.4',
				'pricing.pro.feature.5'
			]
		},
		{
			id: 'business',
			nameKey: 'pricing.business.name',
			taglineKey: 'pricing.business.tagline',
			amount: 25,
			ctaKey: 'pricing.business.cta',
			featureKeys: [
				'pricing.business.feature.1',
				'pricing.business.feature.2',
				'pricing.business.feature.3',
				'pricing.business.feature.4',
				'pricing.business.feature.5'
			]
		}
	];
</script>

<section class={twMerge('flex flex-col items-center gap-16 py-20', className)} {...props}>
	<div class="flex flex-col items-center gap-3 text-center">
		<h2>{t('home.pricing.title')}</h2>
		<p class="max-w-xl text-muted">{t('home.pricing.subtitle')}</p>
	</div>

	<ul class="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-3">
		{#each tiers as tier (tier.id)}
			<li class="h-full">
				<div
					class={twMerge(
						'relative flex h-full flex-col gap-6 rounded-lg border border-border bg-bg-elev p-6 shadow-sm',
						tier.featured &&
							'border-accent shadow-lg ring-2 ring-accent/40 md:-translate-y-3 md:scale-[1.03]'
					)}
				>
					{#if tier.featured}
						<Label class="absolute -top-3 right-6">{t('pricing.badge.popular')}</Label>
					{/if}

					<div class="flex flex-col gap-2">
						<h3 class="heading-5">{t(tier.nameKey)}</h3>
						<p class="paragraph-s text-muted">{t(tier.taglineKey)}</p>
					</div>

					<Price amount={tier.amount} period={t('pricing.period')} />

					<ul class="flex flex-col gap-3">
						{#each tier.featureKeys as featureKey (featureKey)}
							<li class="flex items-start gap-2 paragraph-s">
								<svg
									class="mt-0.5 size-4 shrink-0 text-accent"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.79 6.8-6.8a1 1 0 0 1 1.4 0Z"
										clip-rule="evenodd"
									/>
								</svg>
								<span>{t(featureKey)}</span>
							</li>
						{/each}
					</ul>

					<Button
						asChild
						variant={tier.featured ? 'primary' : 'outline'}
						size="large"
						class="mt-auto w-full text-center"
					>
						{#snippet child({ props: childProps })}
							<a href={resolve(`/${locale}/buy`)} {...childProps}>{t(tier.ctaKey)}</a>
						{/snippet}
					</Button>
				</div>
			</li>
		{/each}
	</ul>
</section>
