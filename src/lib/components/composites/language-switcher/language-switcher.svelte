<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { createTranslator, locales, stripLocale } from '$lib/i18n';
	import type { Locale } from '$lib/schemas';

	type LanguageSwitcherProps = HTMLAttributes<HTMLDivElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: LanguageSwitcherProps = $props();

	const current = $derived(page.data.locale);
	const { t } = $derived(createTranslator(current));

	async function switchLocale(event: Event) {
		const next = (event.currentTarget as HTMLSelectElement).value as Locale;
		if (next !== current) {
			const path = stripLocale(page.url.pathname);
			await goto(resolve(`/${next}${path}`));
		}
	}
</script>

<div class={twMerge('flex items-center', className)} {...props}>
	<label for="language-switcher" class="sr-only">{t('language.select')}</label>
	<select
		id="language-switcher"
		class="rounded border-none bg-transparent px-2 py-1 text-sm"
		onchange={switchLocale}
	>
		{#each locales as locale (locale)}
			<option value={locale} selected={locale === current}>{locale.toUpperCase()}</option>
		{/each}
	</select>
</div>
