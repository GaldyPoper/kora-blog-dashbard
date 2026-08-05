<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { getInitials } from './utils/initials';
	import { readableInk } from './utils/readable-ink';

	export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
		class?: string;
		name: string;
		color?: string;
	};

	let { class: className = '', name, color, ...props }: AvatarProps = $props();

	const initials = $derived(getInitials(name));

	const background = $derived(color ?? 'var(--color-accent)');
	const ink = $derived(color ? readableInk(color) : 'var(--color-accent-fg)');
</script>

<span
	class={twMerge(
		'flex size-7 shrink-0 items-center justify-center rounded-full paragraph-s-strong',
		className
	)}
	style={`background-color: ${background}; color: ${ink};`}
	role="img"
	aria-label={name}
	{...props}
>
	{initials}
</span>
