<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	type PostBackgroundProps = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		color: string;
	};

	let { class: className = '', color, ...props }: PostBackgroundProps = $props();

	const style = $derived(
		`background-image: linear-gradient(135deg, ${color}, color-mix(in oklab, ${color}, #000 55%));`
	);
</script>

<div class={twMerge('w-full', className)} {style} {...props}></div>
