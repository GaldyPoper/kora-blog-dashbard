<script lang="ts">
	import { page } from '$app/state';
	import type { HTMLAttributes } from 'svelte/elements';
	import { formatDate } from './utils/format-date';

	export type FormattedDateProps = HTMLAttributes<HTMLTimeElement> & {
		date: string;
	};

	let { date, ...props }: FormattedDateProps = $props();

	const locale = $derived(page.data.locale);
	const formatted = $derived(formatDate(date, locale));
</script>

<time datetime={date} {...props}>{formatted}</time>
