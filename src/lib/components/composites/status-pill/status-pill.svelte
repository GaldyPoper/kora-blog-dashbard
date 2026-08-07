<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import type { ItemStatus } from '$lib/schemas';

	export type StatusPillProps = HTMLAttributes<HTMLSpanElement> & {
		status: ItemStatus;
		label: string;
		class?: string;
	};

	let { status, label, class: className = '', ...props }: StatusPillProps = $props();

	const styles: Record<ItemStatus, { pill: string; dot: string }> = {
		active: { pill: 'border-good-border bg-good-bg text-good-ink', dot: 'bg-good-ink' },
		completed: { pill: 'border-transparent bg-accent-soft text-accent-ink', dot: 'bg-accent-ink' },
		scheduled: { pill: 'border-warn-border bg-warn-bg text-fg', dot: 'bg-warn-border' },
		paused: { pill: 'border-error bg-transparent text-error', dot: 'bg-error' },
		draft: { pill: 'border-border bg-transparent text-muted', dot: 'bg-muted' },
		archived: { pill: 'border-border bg-transparent text-muted', dot: 'bg-muted' }
	};

	const style = $derived(styles[status]);
</script>

<span
	class={twMerge(
		'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 paragraph-s',
		style.pill,
		className
	)}
	{...props}
>
	<span class={twMerge('size-1.5 rounded-full', style.dot)} aria-hidden="true"></span>
	{label}
</span>
