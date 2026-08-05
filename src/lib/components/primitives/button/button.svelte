<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';

	type ButtonVariant = 'primary' | 'outline';
	type ButtonSize = 'small' | 'medium' | 'large';

	export type ButtonChildProps = { class: string } & Record<string, unknown>;

	type BaseButtonProps = HTMLButtonAttributes & {
		class?: string;
		variant?: ButtonVariant;
		size?: ButtonSize;
	};

	export type ButtonProps = BaseButtonProps &
		(
			| { asChild: true; child: Snippet<[{ props: ButtonChildProps }]>; children?: never }
			| { asChild?: false; child?: never; children: Snippet }
		);

	let {
		class: className = '',
		children,
		child,
		asChild = false,
		variant = 'primary',
		size = 'medium',
		...props
	}: ButtonProps = $props();

	const classes: Record<'shared' | ButtonVariant | ButtonSize, string> = {
		shared: 'rounded-lg font-bold uppercase shadow-lg',
		primary: 'bg-accent text-accent-fg',
		outline: 'border-2 border-accent',
		small: 'text-sm px-2 py-1',
		medium: 'text-base px-4 py-2',
		large: 'text-lg px-6 py-3'
	};

	const computedClass = $derived(
		twMerge(classes.shared, classes[variant], classes[size], className)
	);
</script>

{#if asChild}
	{@render child?.({ props: { class: computedClass, ...props } })}
{:else}
	<button class={computedClass} {...props}>
		{@render children?.()}
	</button>
{/if}
