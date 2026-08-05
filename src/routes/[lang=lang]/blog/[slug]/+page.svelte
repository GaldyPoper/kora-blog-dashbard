<script lang="ts">
	import { resolve } from '$app/paths';
	import { createTranslator } from '$lib/i18n';
	import { ArticleMeta, PostBackground, Seo, TagsContainer } from '$lib/components/composites';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { t } = $derived(createTranslator(data.locale));
	const post = $derived(data.post);
	const content = $derived(post.translations[data.locale] ?? post.translations.en);

	const paragraphs = $derived(content.body.split(/\n\n+/).filter(Boolean));
</script>

<Seo title={content.title} description={content.excerpt} type="article" />

<article class="kora-grid-container py-10">
	<div class="kora-container-inner mx-auto flex max-w-3xl flex-col">
		<a
			href={resolve(`/${data.locale}/blog`)}
			class="inline-flex items-center gap-1 self-start paragraph-s text-muted transition-colors hover:text-fg-2"
		>
			<span aria-hidden="true">←</span>
			{t('blog.back')}
		</a>

		<PostBackground color={post.coverColor} class="mt-6 h-40 rounded-2xl md:h-56" />

		<header class="mt-8 flex flex-col gap-5">
			<TagsContainer tags={post.tags} />
			<h1 class="heading-2">{content.title}</h1>
			<ArticleMeta
				author={post.author}
				publishedAt={post.publishedAt}
				readingTimeMinutes={post.readingTimeMinutes}
			/>
		</header>

		<hr class="mt-8 border-border" />

		<div class="mt-8 flex flex-col gap-5">
			{#each paragraphs as paragraph, i (i)}
				<p>{paragraph}</p>
			{/each}
		</div>
	</div>
</article>
