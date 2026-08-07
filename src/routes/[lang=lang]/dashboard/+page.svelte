<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { page } from '$app/state';
	import { goto, invalidateAll } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { createTranslator, type TranslationKey } from '$lib/i18n';
	import { itemStatusSchema, itemChannelSchema } from '$lib/schemas';
	import type { Item, ItemStatus, ItemChannel } from '$lib/schemas';
	import { Seo, StatusPill, MultiSelect } from '$lib/components/composites';
	import { Avatar, Button, FormattedDate, Pagination } from '$lib/components/primitives';
	import {
		buildItemsQueryString,
		formatCurrency,
		formatPercent,
		type ItemSortKey,
		type ItemsQuery,
		type SortDir
	} from '$lib/dashboard/items';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));
	const q = $derived(data.query);

	const statusOptions = itemStatusSchema.options;
	const channelOptions = itemChannelSchema.options;
	const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

	const cellClass = 'px-4 py-3';
	const numClass = 'text-right tabular-nums';

	type Column = { key: ItemSortKey; label: TranslationKey; numeric?: boolean };
	const columns: Column[] = [
		{ key: 'name', label: 'dashboard.items.column.name' },
		{ key: 'status', label: 'dashboard.items.column.status' },
		{ key: 'channel', label: 'dashboard.items.column.channel' },
		{ key: 'owner', label: 'dashboard.items.column.owner' },
		{ key: 'budget', label: 'dashboard.items.column.budget', numeric: true },
		{ key: 'spent', label: 'dashboard.items.column.spent', numeric: true },
		{ key: 'ctr', label: 'dashboard.items.column.ctr', numeric: true },
		{ key: 'updatedAt', label: 'dashboard.items.column.updated', numeric: true }
	];

	function apply(patch: Partial<ItemsQuery>, keepPage = false) {
		const next = { ...q, ...patch };
		if (!keepPage) next.page = 1;
		const qs = buildItemsQueryString(next);
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- same-page query nav (`?…`)
		goto(qs ? `?${qs}` : page.url.pathname, { keepFocus: true, noScroll: true });
	}

	function onFacet(kind: 'status' | 'channel', values: string[]) {
		apply(
			kind === 'status' ? { status: values as ItemStatus[] } : { channel: values as ItemChannel[] }
		);
	}

	const statusChoices = statusOptions.map((value) => ({ value, label: capitalize(value) }));
	const channelChoices = channelOptions.map((value) => ({ value, label: capitalize(value) }));

	function toggleSort(key: ItemSortKey) {
		const dir: SortDir = q.sort === key && q.dir === 'asc' ? 'desc' : 'asc';
		apply({ sort: key, dir });
	}
	function ariaSort(key: ItemSortKey): 'ascending' | 'descending' | 'none' {
		if (q.sort !== key) return 'none';
		return q.dir === 'asc' ? 'ascending' : 'descending';
	}

	let searchTimer: ReturnType<typeof setTimeout>;
	function onSearch(value: string) {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => apply({ q: value }), 250);
	}
</script>

{#snippet sortHeader(col: Column)}
	<th scope="col" aria-sort={ariaSort(col.key)} class={cellClass}>
		<button
			type="button"
			onclick={() => toggleSort(col.key)}
			class={twMerge(
				'inline-flex items-center gap-1 paragraph-s-strong text-muted uppercase hover:text-fg',
				col.numeric && 'flex-row-reverse'
			)}
		>
			{t(col.label)}
			<span aria-hidden="true">{q.sort === col.key ? (q.dir === 'asc' ? '▲' : '▼') : '↕'}</span>
		</button>
	</th>
{/snippet}

{#snippet cell(value: string, extra = '')}
	<td class={twMerge(cellClass, extra)}>{value}</td>
{/snippet}

{#snippet dataRow(row: Item)}
	<tr class="border-b border-border last:border-0 hover:bg-bg-soft">
		{@render cell(row.name, 'text-fg')}
		<td class={cellClass}><StatusPill status={row.status} label={capitalize(row.status)} /></td>
		{@render cell(capitalize(row.channel), 'text-fg-2')}
		<td class={cellClass}>
			<span class="inline-flex items-center gap-2 text-fg-2">
				<Avatar name={row.owner.name} color="#94a3b8" />
				{row.owner.name}
			</span>
		</td>
		{@render cell(formatCurrency(row.budget, locale), `${numClass} text-fg`)}
		{@render cell(formatCurrency(row.spent, locale), `${numClass} text-fg-2`)}
		{@render cell(formatPercent(row.ctr, locale), `${numClass} text-fg-2`)}
		<td class={twMerge(cellClass, 'text-right text-fg-2')}
			><FormattedDate date={row.updatedAt} /></td
		>
	</tr>
{/snippet}

{#snippet messageRow(content: Snippet)}
	<tr>
		<td colspan={columns.length} class="px-4 py-12 text-center">{@render content()}</td>
	</tr>
{/snippet}

{#snippet emptyState()}
	<span class="text-muted">{t('dashboard.items.empty')}</span>
{/snippet}

{#snippet errorState()}
	<p class="text-error">{t('dashboard.items.loadError')}</p>
	<button type="button" class="mt-2 text-accent-ink underline" onclick={() => invalidateAll()}>
		{t('common.retry')}
	</button>
{/snippet}

<Seo title={t('seo.dashboard.title')} description={t('seo.dashboard.description')} noindex />

<section class="kora-grid-container min-h-screen py-10">
	<div class="kora-container-inner">
		<header class="mb-6 flex items-center justify-between gap-4">
			<h1 class="heading-2">{t('dashboard.items.title')}</h1>
			<form method="POST" action={resolve(`/${locale}/logout`)}>
				<Button type="submit" variant="outline">{t('nav.logout')}</Button>
			</form>
		</header>

		<!-- Toolbar: name search + status/channel facets. All state round-trips
		     through the URL, so views are shareable and back/forward works. -->
		<div class="mb-4 flex flex-wrap items-center gap-3">
			<input
				type="search"
				value={q.q}
				oninput={(e) => onSearch(e.currentTarget.value)}
				placeholder={t('dashboard.items.filterName')}
				aria-label={t('dashboard.items.filterName')}
				class="min-w-56 flex-1 rounded-lg border border-border bg-bg-soft px-3 py-2 text-fg placeholder:text-muted"
			/>
			<MultiSelect
				label={t('dashboard.items.column.status')}
				placeholder={t('dashboard.items.allStatuses')}
				options={statusChoices}
				selected={q.status}
				onChange={(values: string[]) => onFacet('status', values)}
			/>
			<MultiSelect
				label={t('dashboard.items.column.channel')}
				placeholder={t('dashboard.items.allChannels')}
				options={channelChoices}
				selected={q.channel}
				onChange={(values: string[]) => onFacet('channel', values)}
			/>
			<p class="ml-auto paragraph-s text-muted" aria-live="polite" role="status">
				{#await data.result then r}
					{t('dashboard.items.rows', { shown: r.total, total: r.grandTotal })}
				{/await}
			</p>
		</div>

		<div class="overflow-x-auto rounded-xl border border-border">
			<table class="w-full min-w-220 border-collapse text-left">
				<caption class="sr-only">{t('dashboard.items.title')}</caption>
				<thead>
					<tr class="border-b border-border">
						{#each columns as col (col.key)}
							{@render sortHeader(col)}
						{/each}
					</tr>
				</thead>
				<tbody>
					{#await data.result}
						{#each Array(Math.min(q.perPage, 10)) as _, i (i)}
							<tr class="border-b border-border">
								{#each columns as col (col.key)}
									<td class="px-4 py-4">
										<div class="h-4 animate-pulse rounded bg-border"></div>
									</td>
								{/each}
							</tr>
						{/each}
					{:then r}
						{#if r.rows.length === 0}
							{@render messageRow(emptyState)}
						{:else}
							{#each r.rows as row (row.id)}
								{@render dataRow(row)}
							{/each}
						{/if}
					{:catch}
						{@render messageRow(errorState)}
					{/await}
				</tbody>
			</table>
		</div>

		{#await data.result then r}
			{@const totalPages = Math.max(1, Math.ceil(r.total / q.perPage))}
			{@const from = r.total === 0 ? 0 : (q.page - 1) * q.perPage + 1}
			{@const to = Math.min(q.page * q.perPage, r.total)}
			<div class="mt-4 flex items-center justify-between gap-4 paragraph-s text-muted">
				<span>{t('dashboard.items.showing', { from, to, total: r.total })}</span>
				<Pagination page={q.page} {totalPages} />
			</div>
		{/await}
	</div>
</section>
