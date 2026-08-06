<script lang="ts">
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { stripLocale } from '$lib/i18n';
	import { LanguageSwitcher, Nav, SearchBar, ThemeSwitcher } from '../';

	type HeaderProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: HeaderProps = $props();

	const onSearchPage = $derived(stripLocale(page.url.pathname) === '/search');
</script>

<header class={twMerge('kora-grid-container bg-bg-soft py-4 ', className)} {...props}>
	<section class="kora-container-inner flex items-center justify-between gap-3">
		<Nav />
		<div class="flex items-center gap-4">
			{#if !onSearchPage}
				<SearchBar />
			{/if}
			<LanguageSwitcher />
			<ThemeSwitcher />
		</div>
	</section>
</header>
