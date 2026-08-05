<script lang="ts">
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { twMerge } from 'tailwind-merge';
	import { createTranslator } from '$lib/i18n';
	import { Avatar, FormattedDate } from '$lib/components/primitives';
	import type { PostAuthor } from '$lib/schemas';

	type ArticleMetaProps = HTMLAttributes<HTMLDivElement> & {
		class?: string;
		author: PostAuthor;
		publishedAt: string;
		readingTimeMinutes: number;
	};

	let {
		class: className = '',
		author,
		publishedAt,
		readingTimeMinutes,
		...props
	}: ArticleMetaProps = $props();

	const { t } = $derived(createTranslator(page.data.locale));
</script>

<div class={twMerge('flex items-center gap-2 paragraph-s text-muted', className)} {...props}>
	<Avatar name={author.name} color={author.avatarColor} />
	<span class="text-fg-2">{author.name}</span>
	<span aria-hidden="true">·</span>
	<FormattedDate date={publishedAt} />
	<span aria-hidden="true">·</span>
	<span>{t('blog.readingTime', { minutes: readingTimeMinutes })}</span>
</div>
