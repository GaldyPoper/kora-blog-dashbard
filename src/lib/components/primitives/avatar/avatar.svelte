<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { getInitials } from './utils/initials';

	export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
		class?: string;
		name: string;
		color?: string;
	};

	let { class: className = '', name, color, ...props }: AvatarProps = $props();

	const initials = $derived(getInitials(name));
</script>

<span
	class={twMerge(
		'flex size-7 shrink-0 items-center justify-center rounded-full paragraph-s-strong text-white',
		className
	)}
	style={`background-color: ${color ?? 'var(--color-accent)'};`}
	role="img"
	aria-label={name}
	{...props}
>
	{initials}
</span>
