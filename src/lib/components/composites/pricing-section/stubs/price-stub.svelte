<script lang="ts">
	let { amount, period }: { amount: number; period?: string } = $props();
</script>

<span data-testid="pricing-price">{amount}{period}</span>
