<script lang="ts">
	import { createTranslator } from '$lib/i18n';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { Button } from '$lib/components/primitives';
	import HeroSvg from './svg/hero.svelte';

	type FooterProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: FooterProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));
</script>

<section
	class={twMerge('flex h-[85vh] items-center justify-between gap-4 py-10', className)}
	{...props}
>
	<div class="flex size-full basis-1/2 flex-col items-start justify-center gap-6">
		<h1>{t('home.hero.title')}</h1>
		<p class="heading-3">{t('home.hero.subtitle')}</p>
		<Button asChild size="large">
			{#snippet child({ props })}
				<a href={resolve(`/${locale}/blog`)} {...props}>{t('home.hero.cta')}</a>
			{/snippet}
		</Button>
	</div>
	<div class="flex size-full basis-1/2 items-center justify-center p-8 text-accent-ink">
		<div class="size-full">
			<HeroSvg />
		</div>
	</div>
</section>
