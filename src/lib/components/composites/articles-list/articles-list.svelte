<script lang="ts">
	import { resolve } from '$app/paths';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import type { Locale, Post, PostTranslation } from '$lib/schemas';
	import ArticleMeta from '../article-meta/article-meta.svelte';
	import PostBackground from '../post-background/post-background.svelte';
	import TagsContainer from '../tags-container/tags-container.svelte';

	type ArticlesListProps = HTMLAttributes<HTMLUListElement> & {
		class?: string;
		posts: Post[];
		locale: Locale;
		emptyMessage: string;
	};

	let {
		class: className = '',
		posts,
		locale,
		emptyMessage,
		...props
	}: ArticlesListProps = $props();

	const items = $derived(
		posts
			.map((post) => ({ post, content: post.translations[locale] }))
			.filter((entry): entry is { post: Post; content: PostTranslation } => entry.content != null)
	);
</script>

{#if items.length}
	<ul class={twMerge('grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', className)} {...props}>
		{#each items as { post, content } (post.id)}
			<li>
				<article
					class="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-soft transition-colors focus-within:border-border-strong hover:border-border-strong"
				>
					<PostBackground color={post.coverColor} class="h-36" />

					<div class="flex flex-1 flex-col gap-4 p-6">
						<h2 class="heading-5">
							<a
								href={resolve(`/${locale}/blog/${post.slug}`)}
								class="after:absolute after:inset-0 after:content-[''] hover:text-accent focus-visible:text-accent"
							>
								{content.title}
							</a>
						</h2>
						<p>{content.excerpt}</p>
						<TagsContainer tags={post.tags} {locale} />
						<ArticleMeta
							author={post.author}
							publishedAt={post.publishedAt}
							readingTimeMinutes={post.readingTimeMinutes}
							class="mt-auto pt-2"
						/>
					</div>
				</article>
			</li>
		{/each}
	</ul>
{:else}
	<p class="text-muted">{emptyMessage}</p>
{/if}
