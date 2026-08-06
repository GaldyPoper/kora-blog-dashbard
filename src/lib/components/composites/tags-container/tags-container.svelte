<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { Badge } from '$lib/components/primitives';
	import type { Locale } from '$lib/schemas';
	import { buildPostQueryString } from '$lib/search';

	type TagsContainerProps = HTMLAttributes<HTMLUListElement> & {
		class?: string;
		tags: string[];
		locale: Locale;
	};

	let { class: className = '', tags, locale, ...props }: TagsContainerProps = $props();

	const searchPath = $derived(resolve(`/${locale}/search`));
	const hrefFor = (tag: string) => `${searchPath}?${buildPostQueryString({ tag })}`;
</script>

{#if tags.length}
	<ul class={twMerge('flex flex-wrap gap-2', className)} {...props}>
		{#each tags as tag (tag)}
			<li>
				<!-- eslint-disable svelte/no-navigation-without-resolve -- href is resolve() searchPath + our own normalized tag param -->
				<a
					href={hrefFor(tag)}
					class="relative z-10 inline-flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
				>
					<Badge
						variant="ghost"
						size="small"
						class="transition-colors hover:border-border-strong hover:text-fg"
					>
						{tag}
					</Badge>
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</li>
		{/each}
	</ul>
{/if}
