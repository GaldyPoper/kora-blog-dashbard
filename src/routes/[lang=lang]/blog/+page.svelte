<script lang="ts">
	import { resolve } from '$app/paths';
	import { createTranslator } from '$lib/i18n';
	import { Pagination } from '$lib/components/primitives';
	import { ArticleMeta, PostBackground, Seo, TagsContainer } from '$lib/components/composites';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { t } = $derived(createTranslator(data.locale));
	const posts = $derived(data.posts);

	const totalPages = $derived(Math.max(1, Math.ceil(data.total / data.perPage)));
</script>

<Seo
	title={t('seo.blog.title')}
	description={t('seo.blog.description')}
	image="/og.png"
	imageAlt={t('seo.blog.imageAlt')}
/>

<section class="kora-grid-container py-10">
	<div class="kora-container-inner">
		<h1 class="mb-10">{t('blog.title')}</h1>

		{#if posts.length}
			<ul class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each posts as post (post.id)}
					{@const content = post.translations[data.locale] ?? post.translations.en}
					<li>
						<article
							class="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-soft transition-colors focus-within:border-border-strong hover:border-border-strong"
						>
							<PostBackground color={post.coverColor} class="h-36" />

							<div class="flex flex-1 flex-col gap-4 p-6">
								<h2 class="heading-5">
									<a
										href={resolve(`/${data.locale}/blog/${post.slug}`)}
										class="after:absolute after:inset-0 after:content-[''] hover:text-accent focus-visible:text-accent"
									>
										{content.title}
									</a>
								</h2>
								<p>{content.excerpt}</p>
								<TagsContainer tags={post.tags} />
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

			<Pagination page={data.page} {totalPages} class="mt-10" />
		{:else}
			<p class="text-muted">{t('blog.empty')}</p>
		{/if}
	</div>
</section>
