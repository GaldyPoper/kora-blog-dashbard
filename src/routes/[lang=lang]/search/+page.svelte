<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { createTranslator } from '$lib/i18n';
	import { Pagination } from '$lib/components/primitives';
	import { ArticlesList, SearchBar, Seo } from '$lib/components/composites';
	import { buildPostQueryString, type PostSort } from '$lib/search';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { t } = $derived(createTranslator(data.locale));

	const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.perPage)));

	// The URL is the source of truth; `current` is just a convenient view of it.
	const current = $derived({ q: data.q, tag: data.tag, sort: data.sort });
	const searchPath = $derived(resolve(`/${data.locale}/search`));

	function toHref(next: { q: string; tag: string | null; sort: PostSort }): string {
		const qs = buildPostQueryString({ ...next, page: 1 });
		return qs ? `${searchPath}?${qs}` : searchPath;
	}

	function onSortChange(event: Event & { currentTarget: HTMLSelectElement }) {
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- href built from resolve() in toHref
		goto(toHref({ ...current, sort: event.currentTarget.value as PostSort }), {
			noScroll: true
		});
	}

	function mergeTagClicks(node: HTMLElement) {
		const onClick = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0) return;
			if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

			const anchor = (event.target as HTMLElement | null)?.closest('a');
			const href = anchor?.getAttribute('href');
			if (!href) return;

			const dest = new URL(href, location.href);
			const tag = dest.searchParams.get('tag');
			if (tag === null || !dest.pathname.endsWith('/search')) return;

			event.preventDefault();
			// eslint-disable-next-line svelte/no-navigation-without-resolve -- href built from resolve() in toHref
			goto(toHref({ ...current, tag }), { noScroll: true });
		};
		node.addEventListener('click', onClick);
		return { destroy: () => node.removeEventListener('click', onClick) };
	}
</script>

<Seo
	title={t('seo.search.title')}
	description={t('seo.search.description')}
	image="/og.png"
	imageAlt={t('seo.search.imageAlt')}
	noindex
/>

<section class="kora-grid-container min-h-screen py-10">
	<div class="kora-container-inner">
		<h1 class="mb-6">{t('search.title')}</h1>

		<SearchBar variant="full" class="mb-8" />

		{#if !data.q && !data.tag}
			<p class="text-muted">{t('search.prompt')}</p>
		{:else}
			<div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<p class="paragraph-s text-muted" aria-live="polite">
					{#if data.q && data.tag}
						{t('search.resultsQueryTag', { count: data.total, query: data.q, tag: data.tag })}
					{:else if data.tag}
						{t('search.resultsTag', { count: data.total, tag: data.tag })}
					{:else}
						{t('search.results', { count: data.total, query: data.q })}
					{/if}
				</p>

				<label class="flex items-center gap-2 paragraph-s text-muted">
					{t('search.sort.label')}
					<select
						value={data.sort}
						onchange={onSortChange}
						class="rounded-lg border border-border bg-bg-soft px-2.5 py-1.5 text-fg transition-colors outline-none focus:border-border-strong"
					>
						<option value="newest">{t('search.sort.newest')}</option>
						<option value="oldest">{t('search.sort.oldest')}</option>
					</select>
				</label>
			</div>

			<div use:mergeTagClicks>
				<ArticlesList
					posts={data.posts}
					locale={data.locale}
					emptyMessage={t('search.noResults')}
				/>
			</div>

			<Pagination page={data.page} {totalPages} class="mt-10" />
		{/if}
	</div>
</section>
