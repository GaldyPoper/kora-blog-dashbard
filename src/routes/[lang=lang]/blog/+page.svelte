<script lang="ts">
	import { createTranslator } from '$lib/i18n';
	import { Pagination } from '$lib/components/primitives';
	import { ArticlesList, Seo } from '$lib/components/composites';
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

		<ArticlesList {posts} locale={data.locale} emptyMessage={t('blog.empty')} />

		<Pagination page={data.page} {totalPages} class="mt-10" />
	</div>
</section>
