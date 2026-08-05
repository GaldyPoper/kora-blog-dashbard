<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { Sun, Moon } from '$lib/icons';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { toggleTheme } from './utils';

	type ThemeSwitcherProps = HTMLButtonAttributes & {
		class?: string;
	};

	let { class: className = '', ...props }: ThemeSwitcherProps = $props();
</script>

<button
	type="button"
	aria-label="Toggle color theme"
	class={twMerge(
		'text-foreground inline-flex size-8 cursor-pointer items-center justify-center rounded-full border focus-visible:outline-2 focus-visible:outline-offset-2',
		className
	)}
	{...props}
	onclick={toggleTheme}
>
	<Moon class="block size-5 dark:hidden" />
	<Sun class="hidden size-5 dark:block" />
</button>
