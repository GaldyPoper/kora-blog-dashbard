<script lang="ts">
	import Button from '../button.svelte';

	let { class: className = '' }: { class?: string } = $props();
</script>

<Button asChild class={className}>
	{#snippet child({ props })}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- static test link -->
		<a href="/link" {...props}>Link</a>
	{/snippet}
</Button>
