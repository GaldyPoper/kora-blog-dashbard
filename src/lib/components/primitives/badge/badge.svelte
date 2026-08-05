<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	type BadgeVariant = 'primary' | 'ghost';
	type BadgeSize = 'small' | 'medium' | 'large';

	export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
		class?: string;
		variant?: BadgeVariant;
		size?: BadgeSize;
		children: Snippet;
	};

	let {
		class: className = '',
		variant = 'primary',
		size = 'medium',
		children,
		...props
	}: BadgeProps = $props();

	const classes: Record<'shared' | BadgeVariant | BadgeSize, string> = {
		shared: 'inline-flex items-center rounded-full',
		primary: 'bg-accent tracking-wide text-accent-fg uppercase shadow-sm',
		ghost: 'border border-border text-muted',
		small: 'px-2 py-0.5 paragraph-s',
		medium: 'px-3 py-1 paragraph',
		large: 'px-4 py-2 paragraph-l'
	};

	const computedClass = $derived(
		twMerge(classes.shared, classes[variant], classes[size], className)
	);
</script>

<span class={computedClass} {...props}>
	{@render children()}
</span>
