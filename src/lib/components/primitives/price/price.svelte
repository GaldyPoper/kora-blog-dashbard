<script lang="ts">
	import { createTranslator } from '$lib/i18n';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	export type PriceProps = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		amount: number;
		period?: string;
	};

	let { class: className = '', amount, period, ...props }: PriceProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));
</script>

<div class={twMerge('flex items-baseline gap-1', className)} {...props}>
	<span class="heading-4 text-muted">{t('currency')}</span>
	<span class="heading-1">{amount}</span>
	{#if period}
		<span class="paragraph text-muted">{period}</span>
	{/if}
</div>
