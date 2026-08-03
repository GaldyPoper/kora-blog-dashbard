<script lang="ts">
	import ThemeSwitcher from '$lib/components/composites/theme-switcher/theme-switcher.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-2xl space-y-8 p-6">
	<header class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">Kora Blog Dashboard</h1>
		<ThemeSwitcher />
	</header>

	<p class="text-sm text-foreground/70">
		Fetched via MSW and validated with Zod: {data.posts.length} posts, {data.items.length} items, {data
			.users.length} users.
	</p>

	<section class="space-y-3">
		<h2 class="text-lg font-semibold">Latest posts</h2>
		<ul class="divide-y divide-foreground/10">
			{#each data.posts.slice(0, 5) as post (post.id)}
				<li class="flex items-baseline justify-between gap-4 py-2">
					<span class="font-medium">{post.translations.en?.title ?? post.slug}</span>
					<time class="shrink-0 text-xs text-foreground/60">
						{new Date(post.publishedAt).toLocaleDateString()}
					</time>
				</li>
			{/each}
		</ul>
	</section>
</div>
