<script lang="ts">
	import Badge from '../badge.svelte';

	let { class: className = '', ...props } = $props();
</script>

<Badge class={className} {...props}>Best value</Badge>
