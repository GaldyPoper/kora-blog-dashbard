<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { LanguageSwitcher, Nav, ThemeSwitcher } from '../';

	type HeaderProps = HTMLAttributes<HTMLElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: HeaderProps = $props();
</script>

<header class={twMerge('kora-grid-container bg-bg-soft py-4 ', className)} {...props}>
	<section class="kora-container-inner flex items-center justify-between gap-3">
		<Nav />
		<div class="flex items-center gap-4">
			<LanguageSwitcher />
			<ThemeSwitcher />
		</div>
	</section>
</header>
