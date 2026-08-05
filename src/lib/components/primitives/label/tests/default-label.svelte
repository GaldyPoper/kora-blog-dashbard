<script lang="ts">
	import Label from '../label.svelte';

	let { class: className = '', ...props } = $props();
</script>

<Label class={className} {...props}>Best value</Label>
