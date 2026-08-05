<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { Badge } from '$lib/components/primitives';

	type TagsContainerProps = HTMLAttributes<HTMLUListElement> & {
		class?: string;
		tags: string[];
	};

	let { class: className = '', tags, ...props }: TagsContainerProps = $props();
</script>

{#if tags.length}
	<ul class={twMerge('flex flex-wrap gap-2', className)} {...props}>
		{#each tags as tag (tag)}
			<li>
				<Badge variant="ghost" size="small">{tag}</Badge>
			</li>
		{/each}
	</ul>
{/if}
