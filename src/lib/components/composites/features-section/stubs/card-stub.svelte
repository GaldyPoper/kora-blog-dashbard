<script lang="ts">
	let { title, description }: { title: string; description?: string } = $props();
</script>

<div data-testid="feature-card">
	<span data-testid="feature-title">{title}</span>
	<span data-testid="feature-desc">{description}</span>
</div>
