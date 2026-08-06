<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { building } from '$app/environment';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { createTranslator } from '$lib/i18n';
	import { parsePostQuery, buildPostQueryString } from '$lib/search';
	import { Search } from '$lib/icons';

	type SearchBarVariant = 'compact' | 'full';

	type SearchBarProps = HTMLAttributes<HTMLFormElement> & {
		class?: string;
		variant?: SearchBarVariant;
	};

	let { class: className = '', variant = 'compact', ...props }: SearchBarProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));
	const searchPath = $derived(resolve(`/${locale}/search`));

	// Prefill from the active `?q`, except while prerendering — a prerendered page
	// (e.g. an SSG blog post) can't depend on query params, and its header search
	// is empty anyway. At runtime this reads the real query (empty off /search).
	let value = $derived(building ? '' : (page.url.searchParams.get('q') ?? ''));

	const inputClass: Record<SearchBarVariant, string> = {
		compact: 'w-32 py-1.5 pr-9 pl-3 text-sm focus:w-48',
		full: 'w-full py-2.5 pr-11 pl-4'
	};
	const buttonClass: Record<SearchBarVariant, string> = {
		compact: 'right-1 size-7',
		full: 'right-1.5 size-8'
	};

	function commit(q: string) {
		const active = parsePostQuery(page.url.searchParams);
		const qs = buildPostQueryString({ q, tag: active.tag, sort: active.sort, page: 1 });
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		goto(qs ? `${searchPath}?${qs}` : searchPath, { keepFocus: true, noScroll: true });
	}

	function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		commit(value);
	}

	function clearsQuery(node: HTMLInputElement) {
		const handler = () => {
			if (node.value === '' && page.url.searchParams.has('q')) commit('');
		};
		node.addEventListener('search', handler);
		return { destroy: () => node.removeEventListener('search', handler) };
	}
</script>

<form
	role="search"
	method="get"
	action={searchPath}
	onsubmit={onSubmit}
	class={twMerge('relative flex items-center', variant === 'full' && 'w-full', className)}
	{...props}
>
	<input
		type="search"
		name="q"
		{value}
		oninput={(event) => (value = event.currentTarget.value)}
		use:clearsQuery
		placeholder={t('search.placeholder')}
		aria-label={t('search.placeholder')}
		autocomplete="off"
		class={twMerge(
			'rounded-full border border-border bg-bg-soft text-fg transition-[width,colors] outline-none focus:border-border-strong',
			inputClass[variant]
		)}
	/>
	<button
		type="submit"
		aria-label={t('search.submit')}
		class={twMerge(
			'absolute inline-flex cursor-pointer items-center justify-center rounded-full text-muted hover:text-fg',
			buttonClass[variant]
		)}
	>
		<Search class="size-4" />
	</button>
</form>
