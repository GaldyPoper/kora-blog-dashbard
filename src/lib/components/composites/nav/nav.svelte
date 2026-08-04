<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { createTranslator, type TranslationKey } from '$lib/i18n';

	type NavProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: NavProps = $props();

	const pathname = $derived(page.url.pathname);
	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));

	const items: { key: TranslationKey; href: string }[] = [
		{ key: 'nav.home', href: '' },
		{ key: 'nav.blog', href: '/blog' },
		{ key: 'nav.dashboard', href: '/dashboard' }
	];

	function isActive(href: string): boolean {
		const target = `/${locale}${href}`;
		return href === ''
			? pathname === target
			: pathname === target || pathname.startsWith(`${target}/`);
	}
</script>

<nav class={twMerge('flex items-center gap-3', className)} {...props}>
	{#each items as { key, href } (key)}
		<a
			href={resolve(`/${locale}${href}`)}
			class={isActive(href) ? 'text-accent-ink underline' : 'text-fg hover:text-accent-ink'}
			aria-current={isActive(href) ? 'page' : undefined}>{t(key)}</a
		>
	{/each}
</nav>
