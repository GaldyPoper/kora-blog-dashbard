<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	export type LabelProps = HTMLAttributes<HTMLSpanElement> & {
		class?: string;
		children: Snippet;
	};

	let { class: className = '', children, ...props }: LabelProps = $props();
</script>

<span
	class={twMerge(
		'inline-flex items-center rounded-full bg-accent px-3 py-1 paragraph-s-strong tracking-wide text-accent-fg uppercase shadow-sm',
		className
	)}
	{...props}
>
	{@render children()}
</span>
