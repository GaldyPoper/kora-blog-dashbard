<script lang="ts">
	import { createTranslator } from '$lib/i18n';
	import { Avatar, Badge, FormattedDate, Pagination } from '$lib/components/primitives';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { t } = $derived(createTranslator(data.locale));
	const posts = $derived(data.posts);

	const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.perPage)));
</script>

<section class="kora-grid-container py-10">
	<div class="kora-container-inner">
		<h1 class="mb-10">{t('blog.title')}</h1>

		{#if posts.length}
			<ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each posts as post (post.id)}
					{@const content = post.translations[data.locale] ?? post.translations.en}
					<li>
						<article
							class="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-soft transition-colors hover:border-border-strong"
						>
							<div
								class="h-36 w-full"
								style="background-image: linear-gradient(135deg, {post.coverColor}, color-mix(in oklab, {post.coverColor}, #000 55%));"
							></div>

							<div class="flex flex-1 flex-col gap-4 p-6">
								<h2 class="heading-5">{content?.title}</h2>
								<p class="line-clamp-3">{content?.excerpt}</p>

								{#if post.tags.length}
									<ul class="flex flex-wrap gap-2">
										{#each post.tags as tag (tag)}
											<Badge variant="ghost" size="small">{tag}</Badge>
										{/each}
									</ul>
								{/if}

								<div class="mt-auto flex items-center gap-2 pt-2 paragraph-s text-muted">
									<Avatar name={post.author.name} color={post.author.avatarColor} />
									<span class="text-fg-2">{post.author.name}</span>
									<span aria-hidden="true">·</span>
									<FormattedDate date={post.publishedAt} />
									<span aria-hidden="true">·</span>
									<span>{t('blog.readingTime', { minutes: post.readingTimeMinutes })}</span>
								</div>
							</div>
						</article>
					</li>
				{/each}
			</ul>

			<Pagination page={data.page} {totalPages} class="mt-10" />
		{:else}
			<p class="text-muted">{t('blog.empty')}</p>
		{/if}
	</div>
</section>
