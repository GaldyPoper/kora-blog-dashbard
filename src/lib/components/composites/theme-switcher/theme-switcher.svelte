<script lang="ts">
	import { onMount } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { Sun, Moon } from '$lib/icons';
	import type { HTMLAttributes } from 'svelte/elements';

	type ThemeSwitcherProps = HTMLAttributes<HTMLLabelElement> & {
		class?: string;
	};

	let { class: className = '', ...props }: ThemeSwitcherProps = $props();

	let checked = $state<boolean | null>(null);

	onMount(() => {
		checked = document.documentElement.getAttribute('data-theme') === 'dark';
	});

	const onchange = () => {
		const currentTheme = document.documentElement.getAttribute('data-theme');
		const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
		document.documentElement.setAttribute('data-theme', nextTheme);
		localStorage.setItem('theme', nextTheme);
	};
</script>

<label class={twMerge('group block h-8 ', className)} for="switch" {...props}>
	<div class="h-full w-16 cursor-pointer rounded-full px-1 py-0.5">
		<input
			id="switch"
			type="checkbox"
			class="peer absolute appearance-none opacity-0"
			{onchange}
			bind:checked
		/>
		<div class="flex items-center justify-between rounded-full border p-1">
			<Moon class="size-5 text-foreground/40 dark:text-foreground" />
			<Sun class="size-5 text-foreground dark:text-foreground/40" />
		</div>
	</div>
</label>
