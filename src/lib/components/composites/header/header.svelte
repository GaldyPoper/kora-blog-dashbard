<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { LanguageSwitcher, Nav, ThemeSwitcher } from '../';
	import { createTranslator } from '$lib/i18n';
	import { page } from '$app/state';
	import { Button } from '$lib/components/primitives';
	import { resolve } from '$app/paths';

	type HeaderProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: HeaderProps = $props();

	const locale = $derived(page.data.locale);
	const { t } = $derived(createTranslator(locale));
</script>

<header class={twMerge('kora-grid-container bg-bg-soft py-4 ', className)} {...props}>
	<section class="kora-container-inner flex items-center justify-between gap-3">
		<Nav />
		<div class="flex items-center gap-4">
			<Button variant="outline" size="small" asChild>
				{#snippet child({ props })}
					<a href={resolve(`/${locale}/signin`)} {...props}>{t('nav.login')}</a>
				{/snippet}
			</Button>
			<LanguageSwitcher />
			<ThemeSwitcher />
		</div>
	</section>
</header>
