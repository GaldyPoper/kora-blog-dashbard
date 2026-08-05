<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	export type CardProps = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		title: string;
		description?: string;
	};

	let { class: className = '', title, description, ...props }: CardProps = $props();
</script>

<div
	class={twMerge('rounded-lg border border-border bg-bg-elev p-6 shadow-sm', className)}
	{...props}
>
	<h3 class="heading-5">{title}</h3>
	{#if description}
		<p class="mt-2 paragraph-s text-muted">{description}</p>
	{/if}
</div>
