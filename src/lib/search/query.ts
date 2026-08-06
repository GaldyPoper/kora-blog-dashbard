import type { Locale, Post } from '$lib/schemas';
import type { PostSort } from './params';

export type QueryOptions = {
	q: string;
	tag: string | null;
	sort: PostSort;
	locale: Locale;
};

/** Newest-first comparator on the ISO `publishedAt` timestamp. */
function byNewest(a: Post, b: Post): number {
	return b.publishedAt.localeCompare(a.publishedAt);
}

/** Filters posts by tag + text query, then orders them by date. */
export function queryPosts(posts: Post[], { q, tag, sort, locale }: QueryOptions): Post[] {
	const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
	let filtered = tag ? posts.filter((post) => post.tags.includes(tag)) : posts;

	if (terms.length) {
		filtered = filtered.filter((post) => {
			const tr = post.translations[locale];
			const searchable = [
				tr?.title ?? '',
				tr?.excerpt ?? '',
				tr?.body ?? '',
				post.author.name,
				...post.tags
			]
				.join(' ')
				.toLowerCase();

			return terms.every((term) => searchable.includes(term));
		});
	}

	const sorted = [...filtered];
	sorted.sort((a, b) => (sort === 'oldest' ? -byNewest(a, b) : byNewest(a, b)));

	return sorted;
}
