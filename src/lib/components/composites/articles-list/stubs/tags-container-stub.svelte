<script lang="ts">
	let { tags }: { tags: string[] } = $props();
</script>

<!-- Test stub: exposes the tags it received without re-testing TagsContainer. -->
<div data-testid="tags">{tags.join(',')}</div>
