<!-- Test stub: stands in for <Avatar /> so ArticleMeta tests don't re-test it. -->
<script lang="ts">
	let { name, color }: { name: string; color?: string } = $props();
</script>

<span data-testid="avatar" data-name={name} data-color={color}></span>
