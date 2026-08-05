<script lang="ts">
	import { page as appState } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { createTranslator } from '$lib/i18n';

	export type PaginationProps = HTMLAttributes<HTMLElement> & {
		class?: string;
		page: number;
		totalPages: number;
	};

	let { class: className = '', page, totalPages, ...props }: PaginationProps = $props();

	const { t } = $derived(createTranslator(appState.data.locale));

	const hasPrev = $derived(page > 1);
	const hasNext = $derived(page < totalPages);
</script>

{#snippet step(to: number, label: string, enabled: boolean)}
	{#if enabled}
		<!-- eslint-disable svelte/no-navigation-without-resolve -- same-page query link (`?page=N`) is base-safe as a relative URL;  -->
		<a
			class="rounded-lg border border-border px-3 py-1.5 text-fg-2 transition-colors hover:border-border-strong"
			href={`?page=${to}`}>{label}</a
		>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{:else}
		<span class="rounded-lg border border-border px-3 py-1.5 opacity-40" aria-disabled="true"
			>{label}</span
		>
	{/if}
{/snippet}

{#if totalPages > 1}
	<nav
		class={twMerge('flex items-center justify-center gap-3 paragraph-s text-muted', className)}
		aria-label={t('pagination.label')}
		{...props}
	>
		{@render step(page - 1, t('pagination.previous'), hasPrev)}
		<span>{t('pagination.status', { page, total: totalPages })}</span>
		{@render step(page + 1, t('pagination.next'), hasNext)}
	</nav>
{/if}
