<script lang="ts">
	import Button from '../button.svelte';

	let { class: className = '' }: { class?: string } = $props();
</script>

<Button class={className}>Click me</Button>
