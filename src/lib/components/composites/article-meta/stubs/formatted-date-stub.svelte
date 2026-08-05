<!-- Test stub: stands in for <FormattedDate /> so ArticleMeta tests don't re-test it. -->
<script lang="ts">
	let { date }: { date: string } = $props();
</script>

<time data-testid="formatted-date" datetime={date}></time>
